// PUBLIC chat endpoint for the embeddable widget — MULTI-PROVIDER.
//   GET  /chat?agentId=...                       -> widget config
//   POST /chat { agentId, messages }             -> RAG retrieval + answer { reply }  (JSON)
//   POST /chat { agentId, messages, stream:true } -> same, streamed as Server-Sent Events
// Uses the AGENT OWNER's stored LLM key (OpenAI / Anthropic / Google / OpenRouter),
// looked up server-side. Visitors never see the key. Embeddings use the free
// built-in gte-small model, so RAG needs no provider key.
//
// Streaming protocol (when stream:true): text/event-stream, each event is
//   data: {"delta":"..."}            incremental text
//   data: {"done":true,"conversationId":"..."}  final marker
//   data: [DONE]
// The widget renders deltas live and falls back to JSON if the function predates
// streaming (so it degrades gracefully whether or not this file is deployed yet).
//
// Visitor conversations are logged (conversations + conversation_messages) for the
// owner's analytics. Owner "Live Test" chats pass { test:true } and are NOT logged.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

type Provider = "OpenAI" | "Anthropic" | "Google AI" | "OpenRouter";
type Msg = { role: string; content: string };

// Friendly model aliases -> real provider model ids
const OPENAI_MODELS: Record<string, string> = { "gpt-4o": "gpt-4o", "gpt-4o-mini": "gpt-4o-mini" };
const ANTHROPIC_MODELS: Record<string, string> = {
  "claude-sonnet": "claude-sonnet-4-6",
  "claude-haiku": "claude-haiku-4-5",
  "claude-opus": "claude-opus-4-8",
};
const GOOGLE_MODELS: Record<string, string> = { "gemini-flash": "gemini-2.0-flash", "gemini-pro": "gemini-2.5-pro" };

function detectProvider(modelId: string): Provider {
  if (modelId.startsWith("openrouter/") || (modelId.includes("/") && !modelId.startsWith("openai/"))) return "OpenRouter";
  if (modelId.startsWith("gpt") || modelId.startsWith("openai")) return "OpenAI";
  if (modelId.startsWith("claude")) return "Anthropic";
  if (modelId.startsWith("gemini")) return "Google AI";
  return "OpenAI";
}

async function embed(text: string): Promise<number[]> {
  // @ts-ignore - Supabase Edge Runtime built-in embeddings model
  const session = new Supabase.ai.Session("gte-small");
  // @ts-ignore
  return (await session.run(text, { mean_pool: true, normalize: true })) as number[];
}

const PERSONALITY_TONES: Record<string, string> = {
  professional: "Maintain a professional, formal, and precise tone.",
  friendly: "Be warm, friendly, and approachable.",
  concise: "Be brief and to the point — keep answers short.",
  expert: "Respond like a knowledgeable domain expert, with depth and authority.",
  empathetic: "Be understanding, caring, and empathetic.",
  playful: "Be fun, playful, and engaging.",
};

function buildSystemPrompt(agent: Record<string, unknown>, context: string): string {
  const name = (agent.name as string) || "an AI assistant";
  const personality = (agent.personality as string) || "professional";
  const tone = PERSONALITY_TONES[personality] ?? `Adopt a ${personality} tone.`;
  const instructions = ((agent.instructions as string) || "").trim();

  // The owner's instructions are the AUTHORITATIVE behaviour spec. They are
  // fenced and explicitly prioritised so the model follows them over the
  // platform's generic defaults below (which only act as a safety net).
  const head =
    `You are ${name}. ${tone}\n\n` +
    `=== OPERATING INSTRUCTIONS (set by the business owner) ===\n` +
    `These are your rules. Follow them EXACTLY and in full. They take priority over your\n` +
    `default behaviour. Obey their tone, formatting, language, and any step-by-step or\n` +
    `conditional rules they contain. Do not ignore, summarise, or deviate from them.\n\n` +
    `${instructions || "(No specific instructions provided — be a helpful, friendly assistant for this business.)"}\n` +
    `=== END OPERATING INSTRUCTIONS ===`;

  const kb = context
    ? `\n\nKNOWLEDGE BASE (the business's own information — use this as your source of facts):\n${context}\n\n` +
      `When answering factual questions (prices, policies, names, dates, contacts), use ONLY the ` +
      `knowledge base above. If the answer isn't there, say you're not sure and offer to connect the ` +
      `user with the team. Never invent facts. This factual rule never overrides the OPERATING INSTRUCTIONS.`
    : `\n\nYou currently have no knowledge base content. For specific factual questions, say you're not ` +
      `sure and offer to connect the user with the team. Never invent facts. This never overrides the ` +
      `OPERATING INSTRUCTIONS above.`;

  return head + kb;
}

const toOpenAI = (m: Msg) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content) });

// --- Build the upstream request for a provider (shared by stream + non-stream) ---
function buildRequest(
  provider: Provider,
  modelId: string,
  key: string,
  system: string,
  history: Msg[],
  stream: boolean,
): { url: string; init: RequestInit } {
  if (provider === "OpenRouter" || provider === "OpenAI") {
    const isOR = provider === "OpenRouter";
    const model = isOR
      ? (modelId.startsWith("openrouter/") ? modelId.slice("openrouter/".length) : modelId)
      : (OPENAI_MODELS[modelId] ?? modelId);
    const url = isOR
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const headers: Record<string, string> = { "content-type": "application/json", Authorization: `Bearer ${key}` };
    if (isOR) headers["X-Title"] = "Osciva AI";
    return {
      url,
      init: {
        method: "POST",
        headers,
        body: JSON.stringify({ model, stream, messages: [{ role: "system", content: system }, ...history.map(toOpenAI)] }),
      },
    };
  }

  if (provider === "Anthropic") {
    const model = ANTHROPIC_MODELS[modelId] ?? modelId;
    return {
      url: "https://api.anthropic.com/v1/messages",
      init: {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model,
          max_tokens: 1024,
          stream,
          system,
          messages: history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content) })),
        }),
      },
    };
  }

  // Google Gemini
  const model = GOOGLE_MODELS[modelId] ?? modelId;
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: String(m.content) }],
  }));
  const action = stream ? "streamGenerateContent?alt=sse&" : "generateContent?";
  return {
    url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}key=${encodeURIComponent(key)}`,
    init: {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents }),
    },
  };
}

// Pull one delta of text out of a parsed provider SSE event.
function deltaFrom(provider: Provider, j: Record<string, unknown>): string {
  if (provider === "OpenAI" || provider === "OpenRouter") {
    // deno-lint-ignore no-explicit-any
    return (j as any).choices?.[0]?.delta?.content ?? "";
  }
  if (provider === "Anthropic") {
    // deno-lint-ignore no-explicit-any
    return (j as any).type === "content_block_delta" ? ((j as any).delta?.text ?? "") : "";
  }
  // deno-lint-ignore no-explicit-any
  return (j as any).candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

// Yield trimmed lines from an upstream Response body as they arrive.
async function* sseLines(res: Response): AsyncGenerator<string> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx).trim();
      buf = buf.slice(idx + 1);
      if (line) yield line;
    }
  }
  if (buf.trim()) yield buf.trim();
}

// Stream text deltas from any provider.
async function* streamLLM(
  provider: Provider,
  modelId: string,
  key: string,
  system: string,
  history: Msg[],
): AsyncGenerator<string> {
  const { url, init } = buildRequest(provider, modelId, key, system, history, true);
  const res = await fetch(url, init);
  if (!res.ok || !res.body) throw new Error(`${provider} ${res.status}: ${await res.text()}`);
  for await (const line of sseLines(res)) {
    if (!line.startsWith("data:")) continue;
    const data = line.slice(5).trim();
    if (data === "[DONE]") return;
    try {
      const d = deltaFrom(provider, JSON.parse(data));
      if (d) yield d;
    } catch {
      // ignore keep-alives / non-JSON lines
    }
  }
}

// Non-streaming single answer (used for JSON responses).
async function callLLM(
  provider: Provider,
  modelId: string,
  key: string,
  system: string,
  history: Msg[],
): Promise<string> {
  const { url, init } = buildRequest(provider, modelId, key, system, history, false);
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${provider} ${res.status}: ${await res.text()}`);
  const j = await res.json();
  if (provider === "OpenAI" || provider === "OpenRouter") return j.choices?.[0]?.message?.content ?? "";
  if (provider === "Anthropic") return j.content?.[0]?.text ?? "";
  return j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "content-type": "application/json" } });
}

// --- Conversation logging (best-effort; never breaks chat) ---
async function ensureConversation(agentId: string, ownerId: string, conversationId: string | null): Promise<string | null> {
  try {
    if (conversationId) return conversationId;
    const { data } = await admin
      .from("conversations")
      .insert({ agent_id: agentId, user_id: ownerId })
      .select("id")
      .single();
    admin.rpc("increment_agent_conversation", { p_agent_id: agentId }).then(() => {}, () => {});
    return data?.id ?? null;
  } catch {
    return null;
  }
}

async function logTurn(conversationId: string | null, agentId: string, userText: string, assistantText: string) {
  if (!conversationId) return;
  try {
    const rows: Record<string, string>[] = [];
    if (userText) rows.push({ conversation_id: conversationId, agent_id: agentId, role: "user", content: userText });
    if (assistantText) rows.push({ conversation_id: conversationId, agent_id: agentId, role: "assistant", content: assistantText });
    if (rows.length) await admin.from("conversation_messages").insert(rows);
    await admin
      .from("conversations")
      .update({ last_message_at: new Date().toISOString(), message_count: rows.length })
      .eq("id", conversationId);
  } catch {
    // analytics logging must never break the chat
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const url = new URL(req.url);

  try {
    // --- Widget config ---
    if (req.method === "GET") {
      const agentId = url.searchParams.get("agentId");
      if (!agentId) return json({ error: "agentId required" }, 400);
      const { data: agent } = await admin
        .from("agents")
        .select("name, welcome_msg, color, position, chat_icon, logo_url, suggestions, active")
        .eq("id", agentId)
        .maybeSingle();
      if (!agent || !agent.active) return json({ error: "Agent not found" }, 404);
      return json({
        name: agent.name,
        welcomeMsg: agent.welcome_msg,
        color: agent.color,
        position: agent.position,
        chatIcon: agent.chat_icon,
        logoUrl: agent.logo_url ?? "",
        suggestions: agent.suggestions ?? [],
      });
    }

    // --- Chat ---
    if (req.method === "POST") {
      const { agentId, messages, stream, test, conversationId: convIdIn } = await req.json();
      if (!agentId || !Array.isArray(messages)) return json({ error: "agentId and messages[] required" }, 400);

      const { data: agent } = await admin.from("agents").select("*").eq("id", agentId).maybeSingle();
      if (!agent || !agent.active) return json({ error: "Agent not found" }, 404);

      // RAG retrieval for the latest user question
      const lastUser = [...messages].reverse().find((m: Msg) => m.role === "user");
      let context = "";
      if (lastUser?.content) {
        try {
          const qEmb = await embed(lastUser.content);
          // Hybrid retrieval: semantic (vector) + lexical (full-text), fused via
          // RRF — so exact keywords AND paraphrases both hit. Falls back to the
          // pure-vector RPC if the hybrid migration isn't deployed yet.
          let chunks: { content: string }[] | null = null;
          const hybrid = await admin.rpc("match_agent_chunks_hybrid", {
            p_agent_id: agentId,
            p_query_embedding: qEmb,
            p_query_text: lastUser.content,
            p_match_count: 6,
          });
          if (hybrid.error) {
            const fallback = await admin.rpc("match_agent_chunks", {
              p_agent_id: agentId,
              p_query_embedding: qEmb,
              p_match_count: 6,
            });
            chunks = fallback.data;
          } else {
            chunks = hybrid.data;
          }
          if (chunks?.length) context = chunks.map((c: { content: string }) => c.content).join("\n---\n");
        } catch (_e) {
          // retrieval failure shouldn't break chat
        }
      }

      // Look up the OWNER's key for this model's provider
      const provider = detectProvider(agent.model);
      const { data: keyRow } = await admin
        .from("user_api_keys")
        .select("api_key")
        .eq("user_id", agent.user_id)
        .eq("provider", provider)
        .maybeSingle();

      const gate = `⚠️ This assistant isn't ready yet — the owner needs to add their ${provider} API key in Settings → API Keys.`;
      const system = buildSystemPrompt(agent, context);
      const userText = String(lastUser?.content ?? "");
      // Owner Live-Test chats (test:true) are answered but never logged, so they
      // don't inflate the owner's own analytics.
      const conversationId = test ? null : await ensureConversation(agentId, agent.user_id, convIdIn ?? null);
      const countTurn = () => {
        if (!test) admin.rpc("increment_agent_message", { p_agent_id: agentId }).then(() => {}, () => {});
      };

      // ---- Streaming (SSE) ----
      if (stream) {
        const encoder = new TextEncoder();
        const body = new ReadableStream({
          async start(controller) {
            const send = (obj: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
            const finish = () => {
              send({ done: true, conversationId });
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            };
            if (!keyRow?.api_key) {
              send({ delta: gate });
              finish();
              return;
            }
            let full = "";
            try {
              for await (const delta of streamLLM(provider, agent.model, keyRow.api_key, system, messages)) {
                full += delta;
                send({ delta });
              }
            } catch (e) {
              if (!full) send({ delta: "Sorry, I'm having trouble responding right now. Please try again in a moment." });
              send({ error: String((e as Error)?.message ?? e) });
            }
            finish();
            countTurn();
            logTurn(conversationId, agentId, userText, full);
          },
        });
        return new Response(body, {
          headers: { ...corsHeaders, "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache" },
        });
      }

      // ---- Non-streaming (JSON) ----
      if (!keyRow?.api_key) {
        await logTurn(conversationId, agentId, userText, gate);
        return json({ reply: gate, conversationId });
      }

      let reply: string;
      try {
        reply = await callLLM(provider, agent.model, keyRow.api_key, system, messages);
      } catch (e) {
        return json({
          reply: "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          error: String((e as Error)?.message ?? e),
          conversationId,
        });
      }

      countTurn();
      await logTurn(conversationId, agentId, userText, reply);
      return json({ reply, conversationId });
    }

    return json({ error: "Method not allowed" }, 405);
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500);
  }
});
