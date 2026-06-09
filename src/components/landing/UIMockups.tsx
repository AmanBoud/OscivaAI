// Realistic styled-div mockups of the actual product UI for the landing page.
// No external images. Pure tailwind + inline SVG so they always look crisp.

export function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl border border-[#f0e6df] shadow-2xl shadow-[#E8613C]/10 overflow-hidden w-full">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#f0ebe6]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex-1 h-5 bg-white rounded text-[10px] text-[#999] flex items-center px-2 border border-[#f0ebe6]">
          app.osciva.io/dashboard
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[120px] bg-[#1a1a2e] p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 mb-3 pb-3 border-b border-white/10">
            <div className="w-5 h-5 rounded bg-[#E8613C]" />
            <span className="text-[9px] font-bold text-white">Osciva</span>
          </div>
          {["Dashboard", "My Agents", "Create", "Analytics", "Embed", "API Keys"].map((l, i) => (
            <div
              key={l}
              className={`text-[9px] px-2 py-1.5 rounded ${
                i === 0 ? "bg-[#E8613C] text-white font-semibold" : "text-white/60"
              }`}
            >
              {l}
            </div>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1 p-4 bg-[#FAFAFA]">
          <div className="text-[11px] font-bold text-[#1a1a2e] mb-3">Dashboard</div>
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { l: "Agents", v: "12", c: "#E8613C" },
              { l: "Messages", v: "8.4k", c: "#4CAF50" },
              { l: "Resolved", v: "94%", c: "#2196F3" },
            ].map((s) => (
              <div key={s.l} className="bg-white border border-[#f0ebe6] rounded-lg p-2">
                <div className="text-[8px] text-[#888]">{s.l}</div>
                <div className="text-[14px] font-extrabold text-[#1a1a2e]">{s.v}</div>
                <div className="h-0.5 mt-1 rounded-full" style={{ background: s.c }} />
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="bg-white border border-[#f0ebe6] rounded-lg p-2.5 mb-3">
            <div className="text-[9px] font-semibold text-[#1a1a2e] mb-2">Weekly Conversations</div>
            <svg viewBox="0 0 200 60" className="w-full h-14">
              <defs>
                <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#E8613C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#E8613C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,45 L30,30 L60,38 L90,18 L120,25 L150,10 L180,18 L200,8 L200,60 L0,60 Z" fill="url(#g1)" />
              <path
                d="M0,45 L30,30 L60,38 L90,18 L120,25 L150,10 L180,18 L200,8"
                stroke="#E8613C"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          {/* Agents list */}
          <div className="bg-white border border-[#f0ebe6] rounded-lg p-2.5 space-y-1.5">
            <div className="text-[9px] font-semibold text-[#1a1a2e] mb-1">Recent Agents</div>
            {[
              { n: "Support Bot", m: "1.2k msgs", a: true },
              { n: "Sales Assistant", m: "847 msgs", a: true },
              { n: "Onboarding Helper", m: "412 msgs", a: false },
            ].map((a) => (
              <div key={a.n} className="flex items-center justify-between text-[9px]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.a ? "bg-[#4CAF50]" : "bg-[#999]"}`} />
                  <span className="text-[#1a1a2e] font-medium">{a.n}</span>
                </div>
                <span className="text-[#888]">{a.m}</span>
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
    <div className="bg-white rounded-2xl border border-[#f0e6df] shadow-2xl shadow-[#E8613C]/10 overflow-hidden w-full">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#f0ebe6]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex-1 h-5 bg-white rounded text-[10px] text-[#999] flex items-center px-2 border border-[#f0ebe6]">
          app.osciva.io/agents/create
        </div>
      </div>
      <div className="p-5 bg-[#FAFAFA]">
        <div className="text-[12px] font-bold text-[#1a1a2e] mb-3">Create Agent</div>
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#f0ebe6] rounded-lg mb-3">
          {["General", "Knowledge", "Appearance", "Security", "Preview"].map((t, i) => (
            <div
              key={t}
              className={`flex-1 text-center py-1.5 text-[9px] font-semibold rounded ${
                i === 0 ? "bg-[#E8613C] text-white" : "text-[#888]"
              }`}
            >
              {t}
            </div>
          ))}
        </div>
        {/* Form */}
        <div className="bg-white rounded-lg border border-[#f0ebe6] p-3 space-y-3">
          <div>
            <div className="text-[9px] font-semibold text-[#555] mb-1">Agent Name</div>
            <div className="h-7 rounded bg-[#FAFAFA] border border-[#f0ebe6] flex items-center px-2 text-[10px] text-[#1a1a2e]">
              My Support Bot
            </div>
          </div>
          <div>
            <div className="text-[9px] font-semibold text-[#555] mb-1">System Instructions</div>
            <div className="h-14 rounded bg-[#FAFAFA] border border-[#f0ebe6] p-2 text-[9px] text-[#666] leading-relaxed">
              You are a helpful assistant for our store. Answer questions about products, shipping, and returns using
              the knowledge base.
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[9px] font-semibold text-[#555] mb-1">AI Model</div>
              <div className="h-7 rounded bg-[#FAFAFA] border border-[#f0ebe6] flex items-center justify-between px-2 text-[10px]">
                <span className="text-[#1a1a2e] font-medium">GPT-4o</span>
                <span className="text-[#888]">▾</span>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-semibold text-[#555] mb-1">Personality</div>
              <div className="h-7 rounded bg-[#FAFAFA] border border-[#f0ebe6] flex items-center justify-between px-2 text-[10px]">
                <span className="text-[#1a1a2e] font-medium">Friendly</span>
                <span className="text-[#888]">▾</span>
              </div>
            </div>
          </div>
          <div className="h-8 rounded-lg bg-[#E8613C] flex items-center justify-center text-[10px] font-semibold text-white">
            Create Agent
          </div>
        </div>
      </div>
    </div>
  );
}

export function WidgetMockup() {
  return (
    <div className="bg-white rounded-2xl border border-[#f0e6df] shadow-2xl shadow-[#E8613C]/10 overflow-hidden w-full">
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FAFAFA] border-b border-[#f0ebe6]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-3 flex-1 h-5 bg-white rounded text-[10px] text-[#999] flex items-center px-2 border border-[#f0ebe6]">
          yourstore.in
        </div>
      </div>
      <div className="relative h-[360px] bg-gradient-to-br from-[#FFF5F0] to-white p-5">
        {/* Page content */}
        <div className="space-y-2">
          <div className="h-3 bg-[#f0ebe6] rounded w-2/3" />
          <div className="h-3 bg-[#f0ebe6] rounded w-1/2" />
          <div className="h-2 bg-[#f0ebe6]/60 rounded w-full mt-3" />
          <div className="h-2 bg-[#f0ebe6]/60 rounded w-5/6" />
          <div className="h-2 bg-[#f0ebe6]/60 rounded w-4/6" />
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-lg bg-[#f0ebe6]/50" />
            ))}
          </div>
        </div>
        {/* Widget */}
        <div className="absolute bottom-4 right-4 w-[230px] rounded-2xl overflow-hidden shadow-2xl border border-[#1e293b]/20">
          <div className="bg-[#1e293b] p-3 text-center">
            <div className="text-[11px] font-bold text-white">Support Bot</div>
            <div className="text-[9px] text-white/70">AI Assistant</div>
          </div>
          <div className="bg-white p-2.5 space-y-2 h-[140px]">
            <div className="text-[9px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg rounded-bl-sm p-2 max-w-[85%] text-[#374151]">
              Hi 👋 How can I help you today?
            </div>
            <div className="text-[9px] bg-[#1e293b] text-white rounded-lg rounded-br-sm p-2 max-w-[80%] ml-auto">
              What's your return policy?
            </div>
            <div className="text-[9px] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg rounded-bl-sm p-2 max-w-[85%] text-[#374151]">
              We offer 30-day returns on all items 📦
            </div>
          </div>
          <div className="bg-white p-2 flex items-center gap-1.5 border-t border-[#e2e8f0]">
            <div className="flex-1 px-2 py-1 rounded-full text-[9px] text-[#9ca3af] border border-[#e2e8f0]">
              Type a message...
            </div>
            <div className="w-6 h-6 rounded-full bg-[#1e293b]" />
          </div>
        </div>
      </div>
    </div>
  );
}
