-- Hybrid RAG: add a LEXICAL (full-text) signal alongside the existing vector
-- search and fuse them with Reciprocal Rank Fusion (RRF). Pure vector search
-- misses exact keywords (product names, acronyms, SKUs, error codes); pure
-- keyword search misses paraphrases. RRF gives the best of both.

-- 1. Generated full-text column + GIN index on the existing chunks table.
ALTER TABLE public.agent_chunks
  ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_chunks_fts
  ON public.agent_chunks USING gin (fts);

-- 2. Hybrid match (scoped to one agent). Runs as a stable SQL function so the
--    public chat edge function (service role) can call it. Combines:
--      - semantic rank: embedding <=> query  (cosine distance, top p_pool)
--      - lexical  rank: ts_rank_cd over websearch_to_tsquery (top p_pool)
--    then fuses with RRF:  score = Σ 1 / (p_rrf_k + rank_in_each_list).
--    Returns the top p_match_count chunks by fused score.
CREATE OR REPLACE FUNCTION public.match_agent_chunks_hybrid(
  p_agent_id uuid,
  p_query_embedding vector(384),
  p_query_text text,
  p_match_count int DEFAULT 6,
  p_pool int DEFAULT 30,
  p_rrf_k int DEFAULT 50
)
RETURNS TABLE (id uuid, content text, score float)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  WITH q AS (
    SELECT websearch_to_tsquery('english', coalesce(p_query_text, '')) AS tsq
  ),
  semantic AS (
    SELECT c.id, c.content,
           row_number() OVER (ORDER BY c.embedding <=> p_query_embedding) AS rank
    FROM public.agent_chunks c
    WHERE c.agent_id = p_agent_id
      AND c.embedding IS NOT NULL
    ORDER BY c.embedding <=> p_query_embedding
    LIMIT p_pool
  ),
  lexical AS (
    SELECT c.id, c.content,
           row_number() OVER (ORDER BY ts_rank_cd(c.fts, q.tsq) DESC) AS rank
    FROM public.agent_chunks c, q
    WHERE c.agent_id = p_agent_id
      AND q.tsq <> ''::tsquery
      AND c.fts @@ q.tsq
    ORDER BY ts_rank_cd(c.fts, q.tsq) DESC
    LIMIT p_pool
  )
  SELECT
    COALESCE(s.id, l.id)            AS id,
    COALESCE(s.content, l.content)  AS content,
    (COALESCE(1.0 / (p_rrf_k + s.rank), 0.0)
     + COALESCE(1.0 / (p_rrf_k + l.rank), 0.0))::float AS score
  FROM semantic s
  FULL OUTER JOIN lexical l ON s.id = l.id
  ORDER BY score DESC
  LIMIT p_match_count;
$$;
