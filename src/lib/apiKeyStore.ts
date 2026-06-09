// Simple localStorage-backed API key store with cross-tab sync via storage event

const STORAGE_KEY = "osciva_api_keys_v1";

export type Provider = "OpenAI" | "Anthropic" | "Google AI" | "OpenRouter";

export type ApiKeyMap = Partial<Record<Provider, string>>;

export function loadKeys(): ApiKeyMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ApiKeyMap) : {};
  } catch {
    return {};
  }
}

export function saveKeys(keys: ApiKeyMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  // notify same-tab listeners
  window.dispatchEvent(new CustomEvent("osciva-keys-updated"));
}

const LEGACY_KEYS: Record<Provider, string> = {
  OpenAI: "osciva_openai_key",
  Anthropic: "osciva_anthropic_key",
  "Google AI": "osciva_google_key",
  OpenRouter: "osciva_openrouter_key",
};

export function setKey(provider: Provider, value: string) {
  const cur = loadKeys();
  if (value) cur[provider] = value;
  else delete cur[provider];
  saveKeys(cur);
  // Also mirror into legacy flat keys for embed snippets / external scripts
  try {
    if (value) localStorage.setItem(LEGACY_KEYS[provider], value);
    else localStorage.removeItem(LEGACY_KEYS[provider]);
  } catch {
    /* ignore */
  }
}

export function getKeyForModel(modelId: string): { provider: Provider; key?: string } {
  const keys = loadKeys();
  // OpenRouter models use "openrouter/" prefix or contain a "/" (e.g. "meta-llama/llama-3.1-8b-instruct")
  if (modelId.startsWith("openrouter/") || (modelId.includes("/") && !modelId.startsWith("openai/"))) {
    const key = keys["OpenRouter"];
    return { provider: "OpenRouter", key };
  }
  if (modelId.startsWith("gpt") || modelId.startsWith("openai")) return { provider: "OpenAI", key: keys["OpenAI"] };
  if (modelId.startsWith("claude")) return { provider: "Anthropic", key: keys["Anthropic"] };
  if (modelId.startsWith("gemini")) return { provider: "Google AI", key: keys["Google AI"] };
  return { provider: "OpenAI", key: keys["OpenAI"] };
}

export function onKeysChanged(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("osciva-keys-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("osciva-keys-updated", handler);
  };
}
