import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  agent_id: string | null;
  read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unread: number;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(40);
    setNotifications((data as AppNotification[]) ?? []);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  // Refetch immediately when something creates a notification client-side
  // (agent created/deleted, API key saved) — independent of Realtime.
  useEffect(() => {
    if (!user) return;
    const onNotify = () => load();
    window.addEventListener("osciva-notify", onNotify);
    return () => window.removeEventListener("osciva-notify", onNotify);
  }, [user, load]);

  // Live updates — new notifications stream in without a refresh.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("notifications-" + user.id)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const n = payload.new as AppNotification;
          setNotifications((prev) => (prev.some((p) => p.id === n.id) ? prev : [n, ...prev].slice(0, 60)));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  };

  const markAllRead = async () => {
    if (!user) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unread, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
