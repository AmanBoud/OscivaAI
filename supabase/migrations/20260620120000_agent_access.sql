-- Per-agent ACCESS PASSWORD for the embeddable widget.
--
-- Stored in a SEPARATE owner-only table (NOT a column on public.agents) on
-- purpose: public.agents has a "Public can read active agents" RLS policy, so any
-- column added there is world-readable via the anon key. The password hash must
-- never be exposed to visitors. Here only the agent's OWNER can read/write the
-- row; the `chat` edge function reads it with the service role (which bypasses
-- RLS). There is deliberately NO anon policy.
--
-- Only a SHA-256 hash of the password is stored — never plaintext.
CREATE TABLE IF NOT EXISTS public.agent_access (
  agent_id uuid PRIMARY KEY REFERENCES public.agents(id) ON DELETE CASCADE,
  password_hash text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_access ENABLE ROW LEVEL SECURITY;

-- Owner (authenticated) fully manages their own agent's access row.
-- No anon policy → the widget/visitors can never read the hash.
DROP POLICY IF EXISTS "Owner manage agent_access" ON public.agent_access;
CREATE POLICY "Owner manage agent_access" ON public.agent_access FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_access.agent_id AND a.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_access.agent_id AND a.user_id = auth.uid()));
