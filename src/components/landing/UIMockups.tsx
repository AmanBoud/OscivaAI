// High-fidelity, animated product mockups — pure CSS/SVG + Framer Motion.
// No external images; crisp at any size. Designed to look like real screen
// recordings of the Osciva dashboard.
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

function Chrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 bg-[#F7F8FA] border-b border-[#EBEDF0]">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
      <div className="ml-3 flex-1 h-6 bg-white rounded-md text-[10px] text-[#9CA3AF] flex items-center px-2.5 border border-[#EBEDF0]">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" className="mr-1.5 text-[#9CA3AF]">
          <path d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5Zm3 8H9V6a3 3 0 0 1 6 0v3Z" fill="currentColor" />
        </svg>
        {url}
      </div>
    </div>
  );
}

const frame =
  "bg-white rounded-2xl border border-[#EBEDF0] shadow-premium overflow-hidden w-full";

export function DashboardMockup() {
  const bars = [42, 64, 50, 78, 58, 88, 72];
  return (
    <div className={frame}>
      <Chrome url="app.osciva.io/dashboard" />
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:block w-[124px] bg-[#0B0E14] p-3 space-y-1">
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="w-5 h-5 rounded-md bg-[#0EC2A8]" />
            <span className="text-[10px] font-bold text-white">Osciva <span className="text-[#0EC2A8]">AI</span></span>
          </div>
          {["Dashboard", "Agents", "Create", "Analytics", "Embed", "API keys"].map((l, i) => (
            <div
              key={l}
              className={`text-[10px] px-2.5 py-1.5 rounded-md flex items-center gap-1.5 ${
                i === 0 ? "bg-white/10 text-white font-semibold" : "text-white/45"
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${i === 0 ? "bg-[#0EC2A8]" : "bg-white/25"}`} />
              {l}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4 bg-[#FBFBFC]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] font-bold text-[#0B0E14]">Overview</div>
            <div className="flex items-center gap-1.5 text-[9px] text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2 py-1 rounded-full">
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              Live
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { l: "Agents", v: "12", c: "#0EC2A8" },
              { l: "Messages", v: "8.4k", c: "#16A34A" },
              { l: "Resolved", v: "94%", c: "#2563EB" },
            ].map((s, i) => (
              <motion.div
                key={s.l}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: EASE }}
                className="bg-white border border-[#EBEDF0] rounded-xl p-2.5"
              >
                <div className="text-[8px] text-[#8C94A1] font-medium">{s.l}</div>
                <div className="text-[15px] font-extrabold text-[#0B0E14] mt-0.5">{s.v}</div>
                <div className="h-1 mt-1.5 rounded-full" style={{ background: `${s.c}22` }}>
                  <div className="h-full rounded-full w-2/3" style={{ background: s.c }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart with growing bars */}
          <div className="bg-white border border-[#EBEDF0] rounded-xl p-3 mb-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[9px] font-semibold text-[#0B0E14]">Weekly conversations</div>
              <div className="text-[8px] text-[#8C94A1]">+18.2%</div>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {bars.map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-t-[3px] origin-bottom"
                  style={{
                    height: `${h}%`,
                    background:
                      i === bars.length - 2
                        ? "#0EC2A8"
                        : "linear-gradient(180deg,#F3C5B5,#FBE7DF)",
                  }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASE }}
                />
              ))}
            </div>
          </div>

          {/* Agents list */}
          <div className="bg-white border border-[#EBEDF0] rounded-xl p-3 space-y-2">
            <div className="text-[9px] font-semibold text-[#0B0E14] mb-0.5">Recent agents</div>
            {[
              { n: "Support Bot", m: "1.2k msgs", a: true },
              { n: "Sales Assistant", m: "847 msgs", a: true },
              { n: "Onboarding Helper", m: "412 msgs", a: false },
            ].map((a) => (
              <div key={a.n} className="flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.a ? "bg-[#16A34A]" : "bg-[#CBD5E1]"}`} />
                  <span className="text-[#0B0E14] font-medium">{a.n}</span>
                </div>
                <span className="text-[#8C94A1]">{a.m}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WizardMockup() {
  return (
    <div className={frame}>
      <Chrome url="app.osciva.io/agents/create" />
      <div className="p-5 bg-[#FBFBFC]">
        <div className="text-[12px] font-bold text-[#0B0E14] mb-3">Create agent</div>
        <div className="flex gap-1 p-1 bg-[#EEF1F5] rounded-lg mb-3">
          {["General", "Knowledge", "Appearance", "Security", "Preview"].map((t, i) => (
            <div
              key={t}
              className={`flex-1 text-center py-1.5 text-[9px] font-semibold rounded-md transition-colors ${
                i === 0 ? "bg-white text-[#0B0E14] shadow-sm" : "text-[#8C94A1]"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-[#EBEDF0] p-3.5 space-y-3">
          <div>
            <div className="text-[9px] font-semibold text-[#586072] mb-1">Agent name</div>
            <div className="h-8 rounded-lg bg-[#FBFBFC] border border-[#EBEDF0] flex items-center px-2.5 text-[10px] text-[#0B0E14]">
              My Support Bot
              <motion.span
                className="ml-0.5 w-px h-3 bg-[#0EC2A8]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
              />
            </div>
          </div>
          <div>
            <div className="text-[9px] font-semibold text-[#586072] mb-1">System instructions</div>
            <div className="h-14 rounded-lg bg-[#FBFBFC] border border-[#EBEDF0] p-2 text-[9px] text-[#586072] leading-relaxed">
              You are a helpful assistant for our store. Answer questions about products, shipping, and returns using the knowledge base.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: "AI model", v: "GPT-4o" },
              { l: "Personality", v: "Friendly" },
            ].map((f) => (
              <div key={f.l}>
                <div className="text-[9px] font-semibold text-[#586072] mb-1">{f.l}</div>
                <div className="h-8 rounded-lg bg-[#FBFBFC] border border-[#EBEDF0] flex items-center justify-between px-2.5 text-[10px]">
                  <span className="text-[#0B0E14] font-medium">{f.v}</span>
                  <span className="text-[#8C94A1]">▾</span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-9 rounded-lg bg-[#0EC2A8] flex items-center justify-center text-[10px] font-semibold text-white shadow-brand">
            Create agent
          </div>
        </div>
      </div>
    </div>
  );
}

export function WidgetMockup() {
  const lines = [
    { bot: true, t: "Hi 👋 How can I help you today?" },
    { bot: false, t: "What's your return policy?" },
    { bot: true, t: "We offer 30-day returns on all items 📦" },
  ];
  return (
    <div className={frame}>
      <Chrome url="yourstore.in" />
      <div className="relative h-[360px] bg-gradient-to-br from-[#F7F8FA] to-white p-5 overflow-hidden">
        <div className="space-y-2.5">
          <div className="h-3.5 bg-[#EAEDF1] rounded w-2/3" />
          <div className="h-3.5 bg-[#EAEDF1] rounded w-1/2" />
          <div className="h-2 bg-[#EFF1F4] rounded w-full mt-3" />
          <div className="h-2 bg-[#EFF1F4] rounded w-5/6" />
          <div className="h-2 bg-[#EFF1F4] rounded w-4/6" />
          <div className="grid grid-cols-3 gap-2.5 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-xl bg-[#EFF1F4]" />
            ))}
          </div>
        </div>

        {/* Widget */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="absolute bottom-4 right-4 w-[235px] rounded-2xl overflow-hidden shadow-float border border-[#0B0E14]/10 bg-white"
        >
          <div className="bg-[#0B0E14] px-3.5 py-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#0EC2A8] flex items-center justify-center text-[10px] font-bold text-white">
              S
            </div>
            <div>
              <div className="text-[11px] font-bold text-white leading-none">Support Bot</div>
              <div className="text-[8px] text-[#16A34A] mt-1 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#16A34A]" /> Online
              </div>
            </div>
          </div>
          <div className="bg-[#FBFBFC] p-2.5 space-y-2 h-[150px]">
            {lines.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.5, duration: 0.4, ease: EASE }}
                className={`text-[9px] rounded-xl p-2 max-w-[85%] leading-snug ${
                  m.bot
                    ? "bg-white border border-[#EBEDF0] rounded-bl-sm text-[#374151]"
                    : "bg-[#0B0E14] text-white rounded-br-sm ml-auto"
                }`}
              >
                {m.t}
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 1, 1, 0] }}
              viewport={{ once: true }}
              transition={{ delay: 1.6, duration: 1.2, times: [0, 0.2, 0.8, 1] }}
              className="flex gap-1 px-1"
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              ))}
            </motion.div>
          </div>
          <div className="bg-white p-2 flex items-center gap-1.5 border-t border-[#EBEDF0]">
            <div className="flex-1 px-2.5 py-1.5 rounded-full text-[9px] text-[#9CA3AF] border border-[#EBEDF0]">
              Type a message…
            </div>
            <div className="w-6 h-6 rounded-full bg-[#0EC2A8] flex items-center justify-center text-white text-[9px]">
              ➤
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
