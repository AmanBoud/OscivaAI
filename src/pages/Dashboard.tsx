import Topbar from "@/components/layout/Topbar";
import { Bot, MessageSquare, MessagesSquare, Clock, TrendingUp, TrendingDown, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAgents } from "@/context/AgentContext";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getLast7Days, onStatsChanged } from "@/lib/agentStats";

const cardVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { agents, refreshFromStorage } = useAgents();
  const [tick, setTick] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Refresh every 30s + react to embed widget activity in other tabs
  useEffect(() => {
    const id = setInterval(() => {
      refreshFromStorage();
      setTick((t) => t + 1);
      setLastUpdated(Date.now());
    }, 30000);
    const off = onStatsChanged(() => {
      refreshFromStorage();
      setTick((t) => t + 1);
      setLastUpdated(Date.now());
    });
    return () => {
      clearInterval(id);
      off();
    };
  }, [refreshFromStorage]);

  const weeklyData = useMemo(() => getLast7Days(), [tick, agents]);
  const maxVal = Math.max(1, ...weeklyData.map((d) => d.value));
  const todayIndex = weeklyData.length - 1;

  const totalMessages = useMemo(() => agents.reduce((s, a) => s + a.messages, 0), [agents]);
  const totalConversations = useMemo(() => agents.reduce((s, a) => s + a.conversations, 0), [agents]);
  const activeAgents = useMemo(() => agents.filter((a) => a.active), [agents]);

  const stats = [
    { label: "Total Agents", value: String(agents.length), trend: agents.length > 0 ? `${activeAgents.length} active` : "Create your first", up: true, icon: Bot, accent: "bg-primary/10 text-primary" },
    { label: "Total Messages", value: totalMessages.toLocaleString(), trend: "Live", up: true, icon: MessageSquare, accent: "bg-success/10 text-success" },
    { label: "Conversations", value: totalConversations.toLocaleString(), trend: "Live", up: true, icon: MessagesSquare, accent: "bg-info/10 text-info" },
    { label: "Avg Response Time", value: "1.2s", trend: "-0.3s improvement", up: false, icon: Clock, accent: "bg-warning/10 text-warning" },
  ];

  const updatedAgo = Math.max(0, Math.floor((Date.now() - lastUpdated) / 1000));

  return (
    <>
      <Topbar title="Dashboard" subtitle="Welcome back to Osciva AI" />
      <div className="p-4 sm:p-6 space-y-5">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-5 border border-primary/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}! 👋</h2>
              <p className="text-sm text-foreground-secondary">Here's what's happening with your AI agents today.</p>
              <p className="text-[10px] text-foreground-muted mt-1">Last updated: {updatedAgo < 5 ? "just now" : `${updatedAgo}s ago`}</p>
            </div>
            <button
              onClick={() => navigate("/agents/create")}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Plus size={16} />
              New Agent
            </button>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariant}
              className="stat-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-foreground-muted font-medium">{s.label}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.accent}`}>
                  <s.icon size={16} />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">{s.value}</div>
              <div className={`flex items-center gap-1 text-[11px] font-medium ${s.up ? "text-success" : "text-info"}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {s.trend}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart + Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Weekly Messages</h3>
              <span className="text-[11px] text-foreground-muted bg-secondary px-2.5 py-1 rounded-md">Last 7 days</span>
            </div>
            <div className="flex items-end gap-2 sm:gap-3 h-40">
              {weeklyData.map((d, i) => (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] text-foreground-muted font-medium">{d.value}</span>
                  <motion.div
                    key={`${d.date}-${d.value}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.value / maxVal) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    className={`w-full rounded-t-md min-h-[4px] ${
                      i === todayIndex
                        ? "bg-gradient-to-t from-primary/80 to-primary"
                        : "bg-primary/15 hover:bg-primary/25 transition-colors"
                    }`}
                  />
                  <span className={`text-[10px] font-medium ${i === todayIndex ? "text-primary" : "text-foreground-muted"}`}>{d.day}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Active Agents</h3>
              <button onClick={() => navigate("/agents/create")} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-foreground-muted hover:text-primary">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2.5">
              {activeAgents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Bot size={24} className="text-primary" />
                  </div>
                  <p className="text-xs text-foreground-muted mb-3">No active agents</p>
                  <button
                    onClick={() => navigate("/agents/create")}
                    className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Create your first <ArrowRight size={12} />
                  </button>
                </div>
              ) : (
                activeAgents.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer" onClick={() => navigate(`/agents/edit/${a.id}`)}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: a.color + "20", color: a.color }}>
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{a.name}</div>
                      <div className="text-[10px] text-foreground-muted">{a.messages.toLocaleString()} msgs · {a.conversations} convs</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground-secondary font-medium">{a.model}</span>
                      <span className="w-2 h-2 rounded-full bg-success" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* India banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-4 flex items-center gap-3"
        >
          <span className="text-2xl">🇮🇳</span>
          <p className="text-xs text-foreground-secondary">
            Your agents served <span className="text-primary font-semibold">{totalMessages.toLocaleString()} users</span> across India this week — top cities: Mumbai, Bengaluru, Delhi, Hyderabad
          </p>
        </motion.div>
      </div>
    </>
  );
}
