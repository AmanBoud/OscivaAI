-- Conversation logging for analytics.
-- The PUBLIC chat edge function (service role) writes a conversation row per
-- visitor session and one message row per turn. The agent OWNER can read their
-- own conversations/messages via RLS (user_id = the agent owner). Visitors never
-- read these tables — only the service-role edge function inserts.

-- 1. Conversations (one per visitor chat session)
CREATE TABLE IF NOT EXISTS public.conversations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id        uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- agent owner
  message_count   int  NOT NULL DEFAULT 0,
  started_at      timestamptz NOT NULL DEFAULT now(),
  last_message_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Owner-only read. No anon/insert policies: only the service role (edge fn) writes.
CREATE POLICY "Owner reads own conversations" ON public.conversations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. Individual messages within a conversation
CREATE TABLE IF NOT EXISTS public.conversation_messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  agent_id         uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  role             text NOT NULL CHECK (role IN ('user','assistant')),
  content          text NOT NULL,
  created_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- Owner reads messages for conversations they own.
CREATE POLICY "Owner reads own messages" ON public.conversation_messages
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_messages.conversation_id
        AND c.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_conversations_agent ON public.conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_recent ON public.conversations(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conv_messages_conv ON public.conversation_messages(conversation_id, created_at);

-- 3. Atomic conversation counter on the agent (mirrors increment_agent_message).
CREATE OR REPLACE FUNCTION public.increment_agent_conversation(p_agent_id uuid)
RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE public.agents
  SET conversation_count = conversation_count + 1
  WHERE id = p_agent_id;
$$;
