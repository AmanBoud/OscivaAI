-- RAG: pgvector embeddings + semantic search for agent knowledge base
-- Embeddings use Supabase built-in `gte-small` model => 384 dimensions.

-- 1. Vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Embedding column on existing chunks table
ALTER TABLE public.agent_chunks
  ADD COLUMN IF NOT EXISTS embedding vector(384);

-- 3. Approximate-nearest-neighbour index (cosine)
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
  ON public.agent_chunks
  USING hnsw (embedding vector_cosine_ops);

-- 4. Semantic match function (scoped to one agent). Runs as definer so the
--    public chat edge function (service role) can call it; only returns chunk
--    text + similarity, never cross-agent data.
CREATE OR REPLACE FUNCTION public.match_agent_chunks(
  p_agent_id uuid,
  p_query_embedding vector(384),
  p_match_count int DEFAULT 6
)
RETURNS TABLE (id uuid, content text, similarity float)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT c.id,
         c.content,
         1 - (c.embedding <=> p_query_embedding) AS similarity
  FROM public.agent_chunks c
  WHERE c.agent_id = p_agent_id
    AND c.embedding IS NOT NULL
  ORDER BY c.embedding <=> p_query_embedding
  LIMIT p_match_count;
$$;

-- 5. Best-effort message counter for the public chat function
CREATE OR REPLACE FUNCTION public.increment_agent_message(p_agent_id uuid)
RETURNS void
LANGUAGE sql
SET search_path = public
AS $$
  UPDATE public.agents
  SET message_count = message_count + 1
  WHERE id = p_agent_id;
$$;
