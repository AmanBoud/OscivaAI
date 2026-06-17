// AUTH ingest endpoint. POST { agentId }
// Embeds every chunk of the owner's agent that doesn't yet have an embedding,
// then marks the agent's sources as indexed. Requires the owner's JWT.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

async function embed(text: string): Promise<number[]> {
  // @ts-ignore - Supabase Edge Runtime built-in embeddings model
  const session = new Supabase.ai.Session("gte-small");
  // @ts-ignore
  const out = await session.run(text, { mean_pool: true, normalize: true });
  return out as number[];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    // Identify the caller from their JWT
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const { agentId } = await req.json();
    if (!agentId) return json({ error: "agentId required" }, 400);

    // Ownership check
    const { data: agent } = await admin
      .from("agents")
      .select("id, user_id")
      .eq("id", agentId)
      .maybeSingle();
    if (!agent) return json({ error: "Agent not found" }, 404);
    if (agent.user_id !== user.id) return json({ error: "Forbidden" }, 403);

    // Embed chunks that don't have an embedding yet
    const { data: chunks } = await admin
      .from("agent_chunks")
      .select("id, content")
      .eq("agent_id", agentId)
      .is("embedding", null);

    let embedded = 0;
    for (const c of chunks ?? []) {
      try {
        const emb = await embed(c.content as string);
        await admin.from("agent_chunks").update({ embedding: emb }).eq("id", c.id);
        embedded++;
      } catch (_e) {
        // skip a bad chunk rather than fail the whole batch
      }
    }

    // Mark sources as indexed so the UI reflects readiness
    await admin
      .from("agent_sources")
      .update({ status: "Indexed ✓" })
      .eq("agent_id", agentId);

    return json({ embedded });
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
