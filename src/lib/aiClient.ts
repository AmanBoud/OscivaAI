import { getKeyForModel } from "./apiKeyStore";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export class MissingApiKeyError extends Error {
  provider: string;
  constructor(provider: string) {
    super(`Missing API key for ${provider}. Add it in Settings → API Keys.`);
    this.provider = provider;
  }
}

const OPENAI_MODELS: Record<string, string> = {
  "gpt-4o": "gpt-4o",
  "gpt-4o-mini": "gpt-4o-mini",
};
const ANTHROPIC_MODELS: Record<string, string> = {
  "claude-sonnet": "claude-sonnet-4-20250514",
  "claude-haiku": "claude-haiku-4-5",
};
const GOOGLE_MODELS: Record<string, string> = {
  "gemini-flash": "gemini-2.0-flash",
  "gemini-pro": "gemini-1.5-pro",
};

export async function chatComplete(
  modelId: string,
  systemPrompt: string,
  history: ChatMessage[]
): Promise<string> {
  const { provider, key } = getKeyForModel(modelId);
  if (!key) throw new MissingApiKeyError(provider);

  if (provider === "OpenRouter") {
    // Strip optional "openrouter/" prefix; pass through any other slug (e.g. "meta-llama/llama-3.1-8b-instruct")
    const model = modelId.startsWith("openrouter/") ? modelId.slice("openrouter/".length) : modelId;
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://osciva.io",
        "X-Title": "Osciva AI",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...history],
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  if (provider === "OpenAI") {
    const model = OPENAI_MODELS[modelId] ?? modelId;
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: systemPrompt }, ...history],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? "";
  }

  if (provider === "Anthropic") {
    const model = ANTHROPIC_MODELS[modelId] ?? modelId;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: history.map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
      }),
    });
    if (!res.ok) throw new Error(`Anthropic error: ${res.status} ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text ?? "";
  }

  // Google
  const model = GOOGLE_MODELS[modelId] ?? modelId;
  const contents = history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
      }),
    }
  );
  if (!res.ok) throw new Error(`Google error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export function buildSystemPrompt(opts: {
  agentName: string;
  instructions: string;
  personality: string;
  sources: { name: string; type: string; status: string }[];
}) {
  const indexed = opts.sources.filter((s) => s.status === "Indexed ✓");
  const kb =
    indexed.length > 0
      ? `\n\nKnowledge base sources (treat as authoritative business data):\n${indexed
          .map((s, i) => `${i + 1}. ${s.name} (${s.type})`)
          .join("\n")}`
      : "";
  return `You are ${opts.agentName || "an AI assistant"}. Personality: ${opts.personality}.\n\n${opts.instructions}${kb}`;
}
