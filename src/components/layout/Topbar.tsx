import { Bell, Search, User, Key, LogOut, Check, Bot, BarChart3, Code2, BookOpen, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth, getInitials } from "@/hooks/useAuth";
import { useAgents } from "@/context/AgentContext";
import { useNotifications } from "@/hooks/useNotifications";

interface TopbarProps {
  title: string;
  subtitle?: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const pages = [
  { label: "Dashboard", path: "/dashboard", icon: Bot },
  { label: "My Agents", path: "/agents", icon: Bot },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Embed & Deploy", path: "/embed", icon: Code2 },
  { label: "Documentation", path: "/docs", icon: BookOpen },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "API Keys", path: "/api-keys", icon: Key },
];

export default function Topbar({ title, subtitle }: TopbarProps) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, profile, signOut: doSignOut } = useAuth();
  const { agents } = useAgents();
  const { notifications: notifs, unread, markRead, markAllRead } = useNotifications();
  const popRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    if (notifOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (searchOpen) { setSearchQuery(""); setTimeout(() => searchInputRef.current?.focus(), 50); }
  }, [searchOpen]);

  const q = searchQuery.toLowerCase();
  const filteredAgents = agents.filter((a) => a.name.toLowerCase().includes(q) || a.model.toLowerCase().includes(q));
  const filteredPages = pages.filter((p) => p.label.toLowerCase().includes(q));

  const goTo = (path: string) => { setSearchOpen(false); navigate(path); };

  const signOut = async () => {
    await doSignOut();
    navigate("/auth", { replace: true });
  };

  const displayName = profile?.name || user?.email?.split("@")[0] || "Osciva User";
  const displayEmail = user?.email || "";
  const initials = getInitials(profile?.name, user?.email);

  return (
    <>
    <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="min-w-0">
        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
        {subtitle && <p className="text-xs text-foreground-muted truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors text-foreground-muted hover:text-foreground text-xs"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-border font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative" ref={popRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground-muted hover:text-foreground relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-30 animate-fade-up">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-primary hover:underline flex items-center gap-1">
                    <Check size={10} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="text-xs text-foreground-muted text-center py-8">No notifications</p>
                ) : (
                  notifs.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors flex items-start gap-3 ${
                        !n.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.read ? "bg-primary" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground leading-snug">{n.title}</p>
                        {n.body && <p className="text-[11px] text-foreground-secondary mt-0.5 leading-snug line-clamp-2">{n.body}</p>}
                        <p className="text-[10px] text-foreground-muted mt-0.5">{timeAgo(n.created_at)}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/25 transition-colors"
              aria-label="User menu"
            >
              {initials}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">{displayName}</span>
                {displayEmail && (
                  <span className="text-[10px] text-foreground-muted font-normal">{displayEmail}</span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")} className="text-xs cursor-pointer">
              <User size={14} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/api-keys")} className="text-xs cursor-pointer">
              <Key size={14} className="mr-2" /> API Keys
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-xs cursor-pointer text-destructive focus:text-destructive">
              <LogOut size={14} className="mr-2" /> Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    {/* Search Modal */}
    {searchOpen && (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4" onClick={() => setSearchOpen(false)}>
        <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" />
        <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <Search size={16} className="text-foreground-muted shrink-0" />
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agents, pages…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-muted focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="text-foreground-muted hover:text-foreground">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto py-2">
            {/* Agents */}
            {filteredAgents.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider px-4 py-1.5">Agents</p>
                {filteredAgents.map((a) => (
                  <button key={a.id} onClick={() => goTo(`/agents/edit/${a.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: a.color + "20", color: a.color }}>
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                      <p className="text-[11px] text-foreground-muted">{a.model} · {a.messages} messages</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Pages */}
            {filteredPages.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-foreground-muted uppercase tracking-wider px-4 py-1.5 mt-1">Pages</p>
                {filteredPages.map((p) => (
                  <button key={p.path} onClick={() => goTo(p.path)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-secondary transition-colors text-left">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <p.icon size={14} className="text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{p.label}</p>
                  </button>
                ))}
              </div>
            )}

            {filteredAgents.length === 0 && filteredPages.length === 0 && (
              <p className="text-sm text-foreground-muted text-center py-8">No results for "{searchQuery}"</p>
            )}
          </div>

          <div className="px-4 py-2 border-t border-border flex items-center gap-3">
            <span className="text-[10px] text-foreground-muted">Press <kbd className="px-1 py-0.5 rounded bg-secondary font-mono text-[10px]">ESC</kbd> to close</span>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
