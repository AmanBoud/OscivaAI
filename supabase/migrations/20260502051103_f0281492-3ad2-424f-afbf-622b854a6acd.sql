-- AGENTS
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Agent',
  instructions text NOT NULL DEFAULT '',
  model text NOT NULL DEFAULT 'gpt-4o',
  personality text NOT NULL DEFAULT 'professional',
  color text NOT NULL DEFAULT '#6366f1',
  position text NOT NULL DEFAULT 'right' CHECK (position IN ('left','right')),
  chat_icon text NOT NULL DEFAULT 'bot',
  welcome_msg text NOT NULL DEFAULT 'Hi! How can I help you today?',
  suggestions text[] NOT NULL DEFAULT ARRAY[]::text[],
  password_enabled boolean NOT NULL DEFAULT false,
  rate_limit_enabled boolean NOT NULL DEFAULT true,
  domains text[] NOT NULL DEFAULT ARRAY[]::text[],
  message_count int NOT NULL DEFAULT 0,
  conversation_count int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own agents" ON public.agents FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own agents" ON public.agents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own agents" ON public.agents FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own agents" ON public.agents FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- Public read for embed widget
CREATE POLICY "Public can read active agents" ON public.agents FOR SELECT TO anon, authenticated USING (active = true);

-- AGENT SOURCES
CREATE TABLE public.agent_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  size text NOT NULL DEFAULT '0 MB',
  status text NOT NULL DEFAULT 'Processing',
  raw_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own sources" ON public.agent_sources FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own sources" ON public.agent_sources FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users delete own sources" ON public.agent_sources FOR DELETE TO authenticated USING (auth.uid() = user_id);
-- Allow inserts for embed widget
CREATE POLICY "Anyone can insert sources" ON public.agent_sources FOR INSERT TO anon, authenticated WITH CHECK (true);

-- AGENT CHUNKS
CREATE TABLE public.agent_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.agent_sources(id) ON DELETE CASCADE,
  chunk_index int NOT NULL DEFAULT 0,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.agent_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select chunks via agent" ON public.agent_chunks FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_chunks.agent_id AND a.user_id = auth.uid()));
CREATE POLICY "Users update chunks via agent" ON public.agent_chunks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_chunks.agent_id AND a.user_id = auth.uid()));
CREATE POLICY "Users delete chunks via agent" ON public.agent_chunks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agents a WHERE a.id = agent_chunks.agent_id AND a.user_id = auth.uid()));
-- Allow inserts for embed widget
CREATE POLICY "Anyone can insert chunks" ON public.agent_chunks FOR INSERT TO anon, authenticated WITH CHECK (true);

-- DAILY STATS
CREATE TABLE public.daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stat_date date NOT NULL DEFAULT CURRENT_DATE,
  message_count int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (agent_id, stat_date)
);
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own stats" ON public.daily_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own stats" ON public.daily_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own stats" ON public.daily_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id);
-- Embed widget anon insert
CREATE POLICY "Anyone can insert stats" ON public.daily_stats FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can update stats" ON public.daily_stats FOR UPDATE TO anon USING (true);

-- updated_at trigger for agents
CREATE TRIGGER agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- helpful indexes
CREATE INDEX idx_agents_user ON public.agents(user_id);
CREATE INDEX idx_sources_agent ON public.agent_sources(agent_id);
CREATE INDEX idx_chunks_agent ON public.agent_chunks(agent_id);
CREATE INDEX idx_chunks_source ON public.agent_chunks(source_id);
CREATE INDEX idx_daily_stats_user_date ON public.daily_stats(user_id, stat_date);