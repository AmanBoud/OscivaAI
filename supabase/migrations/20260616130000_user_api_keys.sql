-- Per-user LLM provider API keys, stored server-side so the public chat edge
-- function can use the OWNER's key to answer visitors (keys never reach the browser
-- widget or visitors). Only the owner can read/write their own keys via RLS; the
-- edge function reads them with the service role.
CREATE TABLE IF NOT EXISTS public.user_api_keys (
  user_id   uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider  text NOT NULL,            -- 'OpenAI' | 'Anthropic' | 'Google AI' | 'OpenRouter'
  api_key   text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, provider)
);

ALTER TABLE public.user_api_keys ENABLE ROW LEVEL SECURITY;

-- Owner-only. No anon access — visitors must never read keys.
CREATE POLICY "own keys select" ON public.user_api_keys
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own keys insert" ON public.user_api_keys
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own keys update" ON public.user_api_keys
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own keys delete" ON public.user_api_keys
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
