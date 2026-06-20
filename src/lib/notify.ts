import { supabase } from "@/integrations/supabase/client";

/**
 * Insert an in-app notification for the currently signed-in user.
 * Best-effort: never throws, so it can't break the action that triggered it.
 * Appears live in the dashboard bell via Supabase Realtime.
 *
 * NOTE: requires the `notifications` table (migration 20260620130000) to be
 * deployed — until then these inserts silently no-op.
 */
export async function notify(type: string, title: string, body?: string, agentId?: string) {
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user?.id;
    if (!uid) return;
    await supabase.from("notifications").insert({
      user_id: uid,
      type,
      title,
      body: body ?? null,
      agent_id: agentId ?? null,
    });
  } catch {
    // notifications must never break the triggering action
  }
}
