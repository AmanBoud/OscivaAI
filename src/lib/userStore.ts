// Persistent user session + storage versioning.
// Production-grade: try/catch everywhere, version migration, cross-tab sync.

const USER_KEY = "osciva_user";
const VERSION_KEY = "osciva_data_version";
const CURRENT_VERSION = "1";

export interface OscivaUser {
  name: string;
  email: string;
  plan: string;
  createdAt: number;
}

const ALL_KEYS = [
  "osciva_user",
  "osciva_agents",
  "osciva_openai_key",
  "osciva_anthropic_key",
  "osciva_google_key",
  "osciva_api_keys_v1",
];

export function ensureDataVersion() {
  try {
    const v = localStorage.getItem(VERSION_KEY);
    if (v !== CURRENT_VERSION) {
      // Version mismatch — clear cleanly to avoid stale shapes
      ALL_KEYS.forEach((k) => {
        try { localStorage.removeItem(k); } catch { /* ignore */ }
      });
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }
  } catch {
    /* localStorage unavailable */
  }
}

export function loadUser(): OscivaUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as OscivaUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveUser(user: OscivaUser) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("osciva-user-updated"));
  } catch {
    /* ignore */
  }
}

export function clearAllData() {
  ALL_KEYS.forEach((k) => {
    try { localStorage.removeItem(k); } catch { /* ignore */ }
  });
  try { window.dispatchEvent(new CustomEvent("osciva-user-updated")); } catch { /* ignore */ }
  try { window.dispatchEvent(new CustomEvent("osciva-keys-updated")); } catch { /* ignore */ }
}

export function onUserChanged(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("osciva-user-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("osciva-user-updated", handler);
  };
}

export function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
