import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Bot, PlusCircle, BarChart3, Code2, Key,
  BookOpen, Settings, LogOut, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "My Agents", icon: Bot, path: "/agents" },
  { label: "Create Agent", icon: PlusCircle, path: "/agents/create" },
  { label: "Analytics", icon: BarChart3, path: "/analytics" },
  { label: "Embed & Deploy", icon: Code2, path: "/embed" },
  { label: "API Keys", icon: Key, path: "/api-keys" },
  { label: "Documentation", icon: BookOpen, path: "/docs" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  if (isMobile && !mobileOpen) return null;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && (
        <div className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      )}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ${
          isMobile ? "w-[260px] shadow-xl" : ""
        }`}
        style={!isMobile ? { width: collapsed ? 64 : 228 } : undefined}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="https://osciva.io/images/osciva-web.png" alt="Osciva" className="h-8 w-8 object-contain" />
            {(!collapsed || isMobile) && (
              <span className="text-sm font-bold tracking-tight text-foreground">
                Osciva <span className="text-primary">AI</span>
              </span>
            )}
          </div>
          {isMobile && (
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary text-foreground-muted">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : item.path === "/agents"
                  ? location.pathname === "/agents"
                  : item.path === "/agents/create"
                    ? location.pathname === "/agents/create" || location.pathname.startsWith("/agents/edit/")
                    : location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground-secondary hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon size={18} className={active ? "text-primary" : ""} />
                {(!collapsed || isMobile) && item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-border space-y-1">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-foreground-muted hover:bg-secondary hover:text-destructive transition-all"
          >
            <LogOut size={18} />
            {(!collapsed || isMobile) && "Sign Out"}
          </button>
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center py-1.5 text-foreground-muted hover:text-foreground transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
