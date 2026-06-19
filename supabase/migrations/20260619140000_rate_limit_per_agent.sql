-- Make the rate limit configurable per agent (owner sets it in the Security tab).
-- Defaults to 20 messages/visitor/hour to match the previous fixed cap.
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS rate_limit_per_hour int NOT NULL DEFAULT 20;
