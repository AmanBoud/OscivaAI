// Agent stats backed by Supabase daily_stats table.
// Preserves the previous public API (bumpDailyStats, getLast7Days,
// recordAgentActivity, onStatsChanged) so existing call sites keep working.

import { supabase } from "@/integrations/supabase/client";

const CONVERSATION_GAP_MS = 30 * 60 * 1000; // 30 minutes
const lastMsgMemory: Record<string, number> = {};
let cachedWeek: { day: string; date: string; value: number }[] = seedEmptyWeek();

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function seedEmptyWeek() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const out: { day: string; date: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ day: days[d.getDay()], date: d.toISOString().slice(0, 10), value: 0 });
  }
  return out;
}

async function refreshWeek() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    cachedWeek = seedEmptyWeek();
    window.dispatchEvent(new CustomEvent("osciva-stats-updated"));
    return;
  }
  const start = new Date();
  start.setDate(start.getDate() - 6);
  start.setHours(0, 0, 0, 0);

  // Real, live source of truth: actual logged messages from visitor chats.
  // (RLS scopes conversation_messages to conversations the user owns.)
  const { data, error } = await supabase
    .from("conversation_messages")
    .select("created_at")
    .gte("created_at", start.toISOString())
    .limit(10000);

  const totals: Record<string, number> = {};
  if (!error && data) {
    data.forEach((row: any) => {
      const key = new Date(row.created_at).toISOString().slice(0, 10);
      totals[key] = (totals[key] ?? 0) + 1;
    });
  } else {
    // Fallback to daily_stats if logging table isn't available yet.
    const startIso = start.toISOString().slice(0, 10);
    const { data: ds } = await supabase
      .from("daily_stats")
      .select("stat_date, message_count")
      .eq("user_id", user.id)
      .gte("stat_date", startIso);
    (ds ?? []).forEach((row: any) => {
      totals[row.stat_date] = (totals[row.stat_date] ?? 0) + (row.message_count ?? 0);
    });
  }

  cachedWeek = seedEmptyWeek().map((d) => ({ ...d, value: totals[d.date] ?? 0 }));
  window.dispatchEvent(new CustomEvent("osciva-stats-updated"));
}

// Kick off a load on module import
refreshWeek().catch(() => {});

export async function bumpDailyStats(agentId: string, messageDelta = 2) {
  if (!agentId) return;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const date = todayKey();
    // Find existing row
    const { data: existing } = await supabase
      .from("daily_stats")
      .select("id, message_count")
      .eq("agent_id", agentId)
      .eq("stat_date", date)
      .maybeSingle();
    if (existing) {
      await supabase
        .from("daily_stats")
        .update({ message_count: (existing.message_count ?? 0) + messageDelta })
        .eq("id", existing.id);
    } else {
      await supabase.from("daily_stats").insert({
        agent_id: agentId,
        user_id: user.id,
        stat_date: date,
        message_count: messageDelta,
      });
    }
    await refreshWeek();
  } catch {
    /* ignore */
  }
}

export function getLast7Days(): { day: string; date: string; value: number }[] {
  // Trigger a background refresh; return current cached value synchronously
  refreshWeek().catch(() => {});
  return cachedWeek;
}

/**
 * Increment messages + maybe conversations on the agent row in Supabase.
 * Called after every successful AI response from BOTH the preview chat and
 * the embedded widget runtime, so the dashboard reflects real activity.
 */
export async function recordAgentActivity(agentId: string) {
  if (!agentId) return;
  try {
    const lastTs = lastMsgMemory[agentId] ?? 0;
    const now = Date.now();
    const newConversation = !lastTs || now - lastTs > CONVERSATION_GAP_MS;
    lastMsgMemory[agentId] = now;

    // Atomic-ish increment by reading current then updating
    const { data: row } = await supabase
      .from("agents")
      .select("message_count, conversation_count")
      .eq("id", agentId)
      .maybeSingle();
    if (row) {
      await supabase
        .from("agents")
        .update({
          message_count: (row.message_count ?? 0) + 2,
          conversation_count: (row.conversation_count ?? 0) + (newConversation ? 1 : 0),
        })
        .eq("id", agentId);
    }
    await bumpDailyStats(agentId, 2);
    window.dispatchEvent(new CustomEvent("osciva-agents-updated"));
  } catch {
    /* ignore */
  }
}

export function onStatsChanged(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener("osciva-stats-updated", handler);
  window.addEventListener("osciva-agents-updated", handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("osciva-stats-updated", handler);
    window.removeEventListener("osciva-agents-updated", handler);
  };
}
