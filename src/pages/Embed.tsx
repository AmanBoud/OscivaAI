import Topbar from "@/components/layout/Topbar";
import { useState } from "react";
import { Copy, Check, Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useAgents } from "@/context/AgentContext";
import { chatComplete, MissingApiKeyError, ChatMessage } from "@/lib/aiClient";
import { retrieveTopChunks, buildRagSystemPrompt } from "@/lib/rag";
import { getKeyForModel } from "@/lib/apiKeyStore";
import { recordAgentActivity } from "@/lib/agentStats";

const embedTabs = ["HTML Snippet", "React / Next.js", "WordPress"];

const configOptions = [
  { key: "agentId", type: "string", desc: "Unique Osciva agent identifier" },
  { key: "companyName", type: "string", desc: "Brand name shown in the chat header" },
  { key: "tagline", type: "string", desc: "Subtitle under the company name (e.g. AI Assistant)" },
  { key: "welcomeMessage", type: "string", desc: "First message shown when the widget opens" },
  { key: "webhookUrl", type: "string", desc: "Backend chat endpoint for this agent" },
  { key: "theme", type: "string", desc: "Color theme (purple, blue, green, dark)" },
  { key: "position", type: "string", desc: "left or right (default right)" },
  { key: "bubbleMessages", type: "string[]", desc: "Rotating teaser messages above the bubble" },
];

// Map an agent's hex/named color to an Osciva theme keyword used by the
// hosted widget stylesheet. Falls back to "purple" to match brand default.
function colorToTheme(c?: string): string {
  if (!c) return "purple";
  const v = c.toLowerCase();
  if (v.includes("purple") || v.startsWith("#7") || v.startsWith("#8") || v.startsWith("#9")) return "purple";
  if (v.includes("blue") || v.startsWith("#1e3") || v.startsWith("#2563") || v.startsWith("#3b82")) return "blue";
  if (v.includes("green") || v.startsWith("#10b") || v.startsWith("#22c")) return "green";
  if (v.includes("dark") || v === "#000" || v.startsWith("#0") || v.startsWith("#1")) return "dark";
  return "purple";
}

// The embed snippet uses the hosted Osciva widget loader (osciva.io/chat),
// so no inline runtime is required here. The page only generates a small
// configuration block + script tag pointing at the hosted widget.

export default function Embed() {
  const { agents } = useAgents();
  const [selectedAgent, setSelectedAgent] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const currentAgent = agents[selectedAgent];
  const agentId = currentAgent?.id ?? "";
  const apiKey = currentAgent ? (getKeyForModel(currentAgent.model).key ?? "") : "";

  // The hosted widget loader handles its own prompt + RAG retrieval server-side
  // via the webhookUrl, so the snippet only needs identity + branding config.

  const theme = colorToTheme(currentAgent?.color);
  const position = currentAgent?.position === "left" ? "left" : "right";
  const bubbleMessages = ["Need help? 💬", "Ask me anything 💡", "We're here for you 👋"];

  const htmlSnippet = currentAgent
    ? `<!-- Osciva AI Chat Widget -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="https://osciva.io/chat/osciva-chat.css">
<script>
  window.OscivaConfig = {
    agentId: "${currentAgent.id}",
    headerLogo: "https://osciva.io/images/osciva-web.png",
    bubbleLogo: "https://osciva.io/images/osciva-web.png",
    companyName: ${JSON.stringify(currentAgent.name)},
    tagline: "AI Assistant",
    welcomeMessage: ${JSON.stringify(currentAgent.welcomeMsg || "Hi 👋 How can I help you today?")},
    webhookUrl: "https://api.osciva.io/v1/chat/${currentAgent.id}",
    theme: "${theme}",
    position: "${position}",
    bubbleMessages: ${JSON.stringify(bubbleMessages)}
  };
</script>
<script src="https://osciva.io/chat/osciva-chat.js"></script>`
    : "";

  const reactSnippet = currentAgent
    ? `import { useEffect } from "react";

export function OscivaChat() {
  useEffect(() => {
    (window as any).OscivaConfig = {
      agentId: "${currentAgent.id}",
      headerLogo: "https://osciva.io/images/osciva-web.png",
      bubbleLogo: "https://osciva.io/images/osciva-web.png",
      companyName: ${JSON.stringify(currentAgent.name)},
      tagline: "AI Assistant",
      welcomeMessage: ${JSON.stringify(currentAgent.welcomeMsg || "Hi 👋 How can I help you today?")},
      webhookUrl: "https://api.osciva.io/v1/chat/${currentAgent.id}",
      theme: "${theme}",
      position: "${position}",
      bubbleMessages: ${JSON.stringify(bubbleMessages)},
    };
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(font);
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://osciva.io/chat/osciva-chat.css";
    document.head.appendChild(css);
    const s = document.createElement("script");
    s.src = "https://osciva.io/chat/osciva-chat.js";
    s.async = true;
    document.body.appendChild(s);
    return () => { font.remove(); css.remove(); s.remove(); };
  }, []);
  return null;
}`
    : "";

  const wpSnippet = currentAgent
    ? `<?php
// Add to your theme's footer.php right before </body>
add_action('wp_footer', function() { ?>
${htmlSnippet}
<?php });`
    : "";

  const snippets = [htmlSnippet, reactSnippet, wpSnippet];

  const copyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendTestMessage = async () => {
    if (!chatInput.trim() || chatLoading || !currentAgent) return;
    const userMsg = chatInput.trim();
    const newHistory: ChatMessage[] = [
      ...chatMessages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMsg },
    ];
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const ctx = retrieveTopChunks(userMsg, currentAgent.chunks ?? [], 3);
      const prompt = buildRagSystemPrompt({
        agentName: currentAgent.name,
        instructions: currentAgent.instructions,
        personality: currentAgent.personality,
        contextChunks: ctx,
      });
      const reply = await chatComplete(currentAgent.model, prompt, newHistory);
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply || "(empty)" }]);
      recordAgentActivity(currentAgent.id);
    } catch (err) {
      const message =
        err instanceof MissingApiKeyError
          ? `⚠️ Please add your **${err.provider}** API key in Settings → API Keys to use this model.`
          : `❌ ${err instanceof Error ? err.message : "Something went wrong"}`;
      setChatMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <>
      <Topbar title="Embed & Deploy" subtitle="Add your AI agent to any website" />
      <div className="p-6 space-y-6 animate-fade-up">
        {agents.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="text-sm text-foreground-muted">No agents created yet. Create an agent first to generate embed code.</p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 flex-wrap">
              {agents.map((a, i) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgent(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedAgent === i ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground-secondary hover:bg-secondary"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            <div className="glass-card p-4 flex items-center gap-3">
              <span className="text-xs text-foreground-muted">Agent ID:</span>
              <code className="flex-1 text-xs font-mono text-primary bg-secondary px-3 py-1.5 rounded">{agentId}</code>
              <button onClick={() => { navigator.clipboard.writeText(agentId); toast.success("Agent ID copied!"); }} className="p-2 rounded-lg hover:bg-secondary text-foreground-muted hover:text-foreground">
                <Copy size={14} />
              </button>
            </div>

            {!apiKey && (
              <div className="glass-card p-3 border border-warning/30 bg-warning/5 text-xs text-foreground-secondary">
                ⚠️ No API key found for this model. Please add it in the <a href="/api-keys" className="text-primary underline">API Keys</a> page.
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex gap-1 p-1 bg-secondary rounded-lg">
                  {embedTabs.map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(i)}
                      className={`flex-1 py-2 text-[10px] font-semibold rounded-md transition-all ${
                        activeTab === i ? "bg-primary text-primary-foreground" : "text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="glass-card p-4 relative">
                  <button
                    onClick={copyCode}
                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary text-[10px] font-medium text-foreground-secondary hover:text-foreground transition-colors z-10"
                  >
                    {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <pre className="text-[11px] text-foreground-secondary overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap max-h-[480px] overflow-y-auto">
                    {snippets[activeTab]}
                  </pre>
                </div>
              </div>

              <div className="space-y-4">
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-foreground">Live Test Chat</h3>
                    <button onClick={() => setChatMessages([])} className="text-[10px] text-foreground-muted hover:text-foreground flex items-center gap-1">
                      <RotateCcw size={10} /> Clear
                    </button>
                  </div>
                  <p className="text-[10px] text-foreground-muted mb-3">Tests with the same model + API key the embedded widget will use.</p>
                  <div className="bg-secondary/30 rounded-lg p-3 h-56 overflow-y-auto space-y-2 mb-2">
                    <div className="bg-background p-2 rounded-lg rounded-bl-none max-w-[85%] border border-border">
                      <p className="text-[11px] text-foreground-secondary">{currentAgent?.welcomeMsg ?? "Hi 👋 How can I help you today?"}</p>
                    </div>
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`max-w-[85%] ${m.role === "user" ? "ml-auto" : ""}`}>
                        <div className={`p-2 rounded-lg text-[11px] whitespace-pre-wrap ${
                          m.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-none"
                            : "bg-background border border-border text-foreground-secondary rounded-bl-none"
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-background p-2 rounded-lg rounded-bl-none max-w-[60%] border border-border">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendTestMessage()}
                      placeholder="Type a message…"
                      className="flex-1 px-3 py-2 rounded-full bg-secondary border border-border text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={sendTestMessage} disabled={chatLoading} className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 disabled:opacity-50">
                      <Send size={12} />
                    </button>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <h3 className="text-xs font-semibold text-foreground mb-3">Configuration Attributes</h3>
                  <div className="space-y-2.5">
                    {configOptions.map((c) => (
                      <div key={c.key} className="p-2 bg-secondary/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-0.5">
                          <code className="text-[10px] text-primary font-mono">{c.key}</code>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-secondary text-foreground-muted">{c.type}</span>
                        </div>
                        <p className="text-[10px] text-foreground-muted">{c.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
