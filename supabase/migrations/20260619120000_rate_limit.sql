-- Server-side rate limiting for the public chat widget. Protects the agent
-- owner's LLM spend from abuse/bots. Edge functions are stateless, so the
-- counter lives in Postgres: a fixed-window (per hour) count per visitor IP
-- per agent, bumped atomically via an RPC the service-role chat fn calls.

CREATE TABLE IF NOT EXISTS public.rate_limit_hits (
  agent_id     uuid        NOT NULL,
  client_id    text        NOT NULL,            -- visitor IP (or "unknown")
  window_start timestamptz NOT NULL,            -- truncated to the window
  count        int         NOT NULL DEFAULT 0,
  PRIMARY KEY (agent_id, client_id, window_start)
);

-- Lock the table down: only the service role (the edge fn) ever touches it.
ALTER TABLE public.rate_limit_hits ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_rate_limit_window
  ON public.rate_limit_hits (window_start);

-- Atomically increment the visitor's counter for the current window and return
-- the new count. SECURITY DEFINER so the service-role call works under RLS.
CREATE OR REPLACE FUNCTION public.bump_rate_limit(
  p_agent_id uuid,
  p_client_id text,
  p_window_seconds int DEFAULT 3600
)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_window timestamptz := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );
  v_count int;
BEGIN
  INSERT INTO public.rate_limit_hits (agent_id, client_id, window_start, count)
  VALUES (p_agent_id, p_client_id, v_window, 1)
  ON CONFLICT (agent_id, client_id, window_start)
  DO UPDATE SET count = public.rate_limit_hits.count + 1
  RETURNING count INTO v_count;

  -- Opportunistic cleanup of stale windows (cheap, keeps the table small).
  DELETE FROM public.rate_limit_hits
  WHERE window_start < now() - interval '1 day';

  RETURN v_count;
END;
$$;
