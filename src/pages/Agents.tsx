import Topbar from "@/components/layout/Topbar";
import { Plus, MessageSquare, MessagesSquare, Star, MoreVertical, Pencil, Code2, Trash2, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAgents } from "@/context/AgentContext";
import { toast } from "sonner";

export default function Agents() {
  const navigate = useNavigate();
  const { agents, deleteAgent, loading, refreshFromStorage } = useAgents();

  useEffect(() => {
    refreshFromStorage();
  }, []);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    await deleteAgent(id);
    setMenuOpen(null);
    toast.success(`"${name}" deleted successfully`);
  };

  if (loading) {
    return (
      <>
        <Topbar title="My Agents" subtitle="Loading…" />
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  if (agents.length === 0) {
    return (
      <>
        <Topbar title="My Agents" subtitle="0 agents deployed" />
        <div className="p-6 animate-fade-up flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bot size={32} className="text-primary" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No agents yet</h2>
          <p className="text-sm text-foreground-muted">Create your first AI agent to get started</p>
          <button
            onClick={() => navigate("/agents/create")}
            className="mt-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:brightness-110 transition-all glow-primary"
          >
            Create Agent
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar title="My Agents" subtitle={`${agents.length} agent${agents.length !== 1 ? "s" : ""} deployed`} />
      <div className="p-6 animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {agents.map((a) => (
            <div key={a.id} className="glass-card p-5 hover:border-primary/30 transition-all group relative">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ backgroundColor: a.color + "20", color: a.color }}
                >
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">{a.name}</h3>
                    <span className={`flex items-center gap-1 text-[10px] font-medium ${a.active ? "text-success" : "text-foreground-muted"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${a.active ? "bg-success" : "bg-foreground-muted"}`} />
                      {a.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted">ID: {a.id}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(menuOpen === a.id ? null : a.id)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-foreground-muted"
                  >
                    <MoreVertical size={14} />
                  </button>
                  {menuOpen === a.id && (
                    <div className="absolute right-0 top-8 w-32 bg-background-elevated border border-border rounded-lg shadow-lg py-1 z-10">
                      <button onClick={() => { setMenuOpen(null); navigate(`/agents/edit/${a.id}`); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground-secondary hover:bg-secondary">
                        <Pencil size={12} /> Edit
                      </button>
                      <button onClick={() => { setMenuOpen(null); navigate("/embed"); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-foreground-secondary hover:bg-secondary">
                        <Code2 size={12} /> Embed
                      </button>
                      <button onClick={() => handleDelete(a.id, a.name)} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-destructive hover:bg-secondary">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                  <MessageSquare size={12} className="mx-auto mb-1 text-foreground-muted" />
                  <div className="text-xs font-bold text-foreground">{a.messages.toLocaleString()}</div>
                  <div className="text-[9px] text-foreground-muted">Messages</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                  <MessagesSquare size={12} className="mx-auto mb-1 text-foreground-muted" />
                  <div className="text-xs font-bold text-foreground">{a.conversations}</div>
                  <div className="text-[9px] text-foreground-muted">Conversations</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
                  <Star size={12} className="mx-auto mb-1 text-warning" />
                  <div className="text-xs font-bold text-foreground">{a.rating}</div>
                  <div className="text-[9px] text-foreground-muted">Rating</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground-secondary font-medium">{a.model}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{a.sources.length} sources</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => navigate("/agents/create")}
            className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Plus size={24} className="text-primary" />
            </div>
            <span className="text-sm font-semibold text-foreground-secondary group-hover:text-primary transition-colors">Create New Agent</span>
          </button>
        </div>
      </div>
    </>
  );
}
