import Topbar from "@/components/layout/Topbar";
import { useState, useRef } from "react";
import { Check, Upload, X, Plus, Send, RotateCcw, Sparkles, Copy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAgents, Agent, AgentSource, AgentChunk } from "@/context/AgentContext";
import { chatComplete, MissingApiKeyError, ChatMessage } from "@/lib/aiClient";
import { extractPdfText, extractUrlText, chunkText, retrieveTopChunks, buildRagSystemPrompt } from "@/lib/rag";
import { recordAgentActivity } from "@/lib/agentStats";

const providers = [
  { id: "OpenAI", label: "OpenAI", emoji: "🟢", desc: "GPT-4o & GPT-4o Mini", badge: "bg-green-100 text-green-700" },
  { id: "Anthropic", label: "Anthropic", emoji: "🟠", desc: "Claude Sonnet & Haiku", badge: "bg-orange-100 text-orange-700" },
  { id: "Google", label: "Google", emoji: "🔵", desc: "Gemini Flash & Pro", badge: "bg-blue-100 text-blue-700" },
  { id: "OpenRouter", label: "OpenRouter", emoji: "🟣", desc: "Llama, Mistral, DeepSeek +more", badge: "bg-purple-100 text-purple-700" },
];

const models = [
  { id: "gpt-4o", name: "GPT-4o", desc: "Most capable model", provider: "OpenAI" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", desc: "Fast and affordable", provider: "OpenAI" },
  { id: "claude-sonnet", name: "Claude Sonnet 4", desc: "Best for analysis", provider: "Anthropic" },
  { id: "claude-haiku", name: "Claude Haiku 4.5", desc: "Ultra-fast responses", provider: "Anthropic" },
  { id: "gemini-flash", name: "Gemini 2.0 Flash", desc: "Google's fastest", provider: "Google" },
  { id: "gemini-pro", name: "Gemini 2.5 Pro", desc: "Advanced reasoning", provider: "Google" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", desc: "Meta · open-source flagship", provider: "OpenRouter" },
  { id: "mistralai/mistral-large", name: "Mistral Large", desc: "Mistral · strong reasoning", provider: "OpenRouter" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3", desc: "DeepSeek · cheap & smart", provider: "OpenRouter" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", desc: "Alibaba · multilingual", provider: "OpenRouter" },
  { id: "openrouter/auto", name: "OpenRouter Auto", desc: "Auto-route to best model", provider: "OpenRouter" },
  { id: "__custom_openrouter__", name: "Custom model…", desc: "Paste any OpenRouter slug", provider: "OpenRouter" },
];

const personalities = [
  { id: "professional", name: "Professional", desc: "Formal and precise" },
  { id: "friendly", name: "Friendly", desc: "Warm and approachable" },
  { id: "concise", name: "Concise", desc: "Brief and to the point" },
  { id: "expert", name: "Expert", desc: "Deep domain knowledge" },
  { id: "empathetic", name: "Empathetic", desc: "Understanding and caring" },
  { id: "playful", name: "Playful", desc: "Fun and engaging" },
];


export default function CreateAgent() {
  const navigate = useNavigate();
  const { id: editId } = useParams();
  const { agents, addAgent, updateAgent } = useAgents();
  const existingAgent = editId ? agents.find((a) => a.id === editId) : null;

  const [tab, setTab] = useState(0);
  const [name, setName] = useState(existingAgent?.name ?? "");
  const [instructions, setInstructions] = useState(existingAgent?.instructions ?? "You are a helpful customer support assistant for our company. Answer questions based on the provided knowledge base.");
  const initialModel = existingAgent?.model ?? "gpt-4o";
  const isPresetModel = models.some((m) => m.id === initialModel);
  const [selectedModel, setSelectedModel] = useState(isPresetModel ? initialModel : "__custom_openrouter__");
  const [customModel, setCustomModel] = useState(isPresetModel ? "" : initialModel);
  const effectiveModel = selectedModel === "__custom_openrouter__" ? customModel.trim() : selectedModel;
  const initialProvider = models.find((m) => m.id === (isPresetModel ? initialModel : "__custom_openrouter__"))?.provider ?? "OpenAI";
  const [selectedProvider, setSelectedProvider] = useState<string>(initialProvider);
  const [personality, setPersonality] = useState(existingAgent?.personality ?? "professional");
  const [sources, setSources] = useState<AgentSource[]>(existingAgent?.sources ?? []);
  const [chunks, setChunks] = useState<AgentChunk[]>(existingAgent?.chunks ?? []);
  const [welcomeMsg, setWelcomeMsg] = useState(existingAgent?.welcomeMsg ?? "Hi 👋 How can I help you today?");
  const [logoUrl, setLogoUrl] = useState(existingAgent?.logoUrl ?? "");
  const [suggestions, setSuggestions] = useState(existingAgent?.suggestions ?? ["What services do you offer?", "How can I contact support?"]);
  const [newSuggestion, setNewSuggestion] = useState("");
  const [position, setPosition] = useState<"left" | "right">(existingAgent?.position ?? "right");
  const [passwordEnabled, setPasswordEnabled] = useState(existingAgent?.passwordEnabled ?? false);
  const [rateLimitEnabled, setRateLimitEnabled] = useState(existingAgent?.rateLimitEnabled ?? true);
  const [domains, setDomains] = useState<string[]>(existingAgent?.domains ?? []);
  const [newDomain, setNewDomain] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = ["General", "Knowledge Base", "Appearance", "Security", "Preview"];

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "TXT";
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    const newSource: AgentSource = {
      id: crypto.randomUUID(),
      name: file.name,
      type: ext,
      size: `${sizeMB} MB`,
      status: "Processing...",
    };
    setSources((prev) => [...prev, newSource]);
    e.target.value = "";

    try {
      let text = "";
      if (ext === "PDF") {
        text = await extractPdfText(file);
      } else {
        // TXT (DOCX falls back to raw text)
        text = await file.text();
      }
      const newChunks = chunkText(text, newSource.id);
      if (!newChunks.length) throw new Error("No extractable text found");
      setChunks((prev) => [...prev, ...newChunks]);
      setSources((prev) =>
        prev.map((s) => (s.id === newSource.id ? { ...s, status: "Indexed ✓" } : s))
      );
      toast.success(`${file.name} indexed (${newChunks.length} chunks)`);
    } catch (err) {
      setSources((prev) =>
        prev.map((s) => (s.id === newSource.id ? { ...s, status: "Failed" } : s))
      );
      toast.error(`Failed to index: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  const handleAddUrl = async () => {
    const url = urlInput.trim();
    if (!url) {
      toast.error("Enter a URL first");
      return;
    }
    const newSource: AgentSource = {
      id: crypto.randomUUID(),
      name: url,
      type: "URL",
      size: "—",
      status: "Processing...",
    };
    setSources((prev) => [...prev, newSource]);
    setUrlInput("");

    try {
      const text = await extractUrlText(url);
      const newChunks = chunkText(text, newSource.id);
      if (!newChunks.length) throw new Error("No extractable text found");
      setChunks((prev) => [...prev, ...newChunks]);
      setSources((prev) =>
        prev.map((s) => (s.id === newSource.id ? { ...s, status: "Indexed ✓", size: `${newChunks.length} chunks` } : s))
      );
      toast.success(`URL indexed (${newChunks.length} chunks)`);
    } catch (err) {
      setSources((prev) =>
        prev.map((s) => (s.id === newSource.id ? { ...s, status: "Failed" } : s))
      );
      toast.error(`Failed to fetch URL: ${err instanceof Error ? err.message : "unknown error"}`);
    }
  };

  const addSuggestion = () => {
    if (newSuggestion.trim()) {
      setSuggestions((prev) => [...prev, newSuggestion.trim()]);
      setNewSuggestion("");
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    const newHistory: ChatMessage[] = [
      ...chatMessages.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: userMsg },
    ];
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const contextChunks = retrieveTopChunks(userMsg, chunks, 3);
      const systemPrompt = buildRagSystemPrompt({
        agentName: name,
        instructions,
        personality,
        contextChunks,
      });
      const reply = await chatComplete(effectiveModel, systemPrompt, newHistory);
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply || "(empty response)" }]);
      // Record activity against the persisted agent (only if it's been saved)
      if (existingAgent?.id) recordAgentActivity(existingAgent.id);
    } catch (err) {
      const message =
        err instanceof MissingApiKeyError
          ? `⚠️ Please add your **${err.provider}** API key in Settings → API Keys to use this model.`
          : `❌ ${err instanceof Error ? err.message : "Something went wrong"}`;
      setChatMessages((prev) => [...prev, { role: "assistant", content: message }]);
      if (err instanceof MissingApiKeyError) toast.error(`Missing ${err.provider} API key`);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter an agent name");
      return;
    }
    if (selectedModel === "__custom_openrouter__" && !customModel.trim()) {
      toast.error("Please enter an OpenRouter model slug (e.g. meta-llama/llama-3.1-8b-instruct)");
      return;
    }

    const agentData: Omit<Agent, "id" | "createdAt" | "messages" | "conversations" | "rating" | "active"> = {
      name: name.trim(),
      instructions,
      model: effectiveModel,
      personality,
      color: "#1e293b",
      position,
      chatIcon: "🤖",
      logoUrl: logoUrl.trim(),
      welcomeMsg,
      suggestions,
      sources,
      chunks,
      passwordEnabled,
      rateLimitEnabled,
      domains,
    };

    try {
      if (existingAgent) {
        await updateAgent(existingAgent.id, agentData);
        toast.success("Agent updated successfully!");
        navigate("/agents");
      } else {
        const newAgent: Agent = {
          ...agentData,
          id: "agent_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11),
          createdAt: new Date().toISOString(),
          messages: 0,
          conversations: 0,
          rating: 0,
          active: true,
        };
        await addAgent(newAgent);
        toast.success("🎉 Agent created successfully!");
        navigate("/agents");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save agent");
    }
  };

  const agentId = existingAgent?.id ?? "Will be generated on save";

  return (
    <>
      <Topbar title={existingAgent ? "Edit Agent" : "Create Agent"} subtitle="Configure your AI agent" />
      <div className="p-6 animate-fade-up">
        {/* Agent ID bar */}
        {existingAgent && (
          <div className="glass-card p-3 mb-4 flex items-center gap-3">
            <span className="text-xs text-foreground-muted">Agent ID:</span>
            <code className="flex-1 text-xs font-mono text-primary bg-secondary px-3 py-1.5 rounded">{existingAgent.id}</code>
            <button
              onClick={() => { navigator.clipboard.writeText(existingAgent.id); toast.success("Agent ID copied!"); }}
              className="p-2 rounded-lg hover:bg-secondary text-foreground-muted hover:text-foreground"
            >
              <Copy size={14} />
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Left: Config */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-1 p-1 bg-secondary rounded-xl mb-5">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  onClick={() => setTab(i)}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    tab === i ? "bg-card text-foreground shadow-sm" : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="glass-card p-5 space-y-5">
              {/* Tab 0: General */}
              {tab === 0 && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Agent Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="My AI Agent"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">System Instructions</label>
                    <textarea
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      rows={4}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                      style={{ minHeight: 110 }}
                    />
                    <div className="flex justify-between mt-1">
                      <a href="/docs" className="text-[10px] text-primary hover:underline">Learn how to write effective system prompts →</a>
                      <span className="text-[10px] text-foreground-muted">{instructions.length} chars</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">AI Model</label>
                    <Select
                      value={selectedProvider}
                      onValueChange={(val) => {
                        setSelectedProvider(val);
                        const first = models.find((m) => m.provider === val);
                        if (first) setSelectedModel(first.id);
                      }}
                    >
                      <SelectTrigger className="w-full bg-secondary border-border mb-2">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <span className="mr-1.5">{p.emoji}</span>
                            <span className="font-medium">{p.label}</span>
                            <span className="ml-2 text-foreground-muted text-xs">— {p.desc}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-full bg-secondary border-border">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        {models.filter((m) => m.provider === selectedProvider).map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            <span className="font-medium">{m.name}</span>
                            <span className="ml-2 text-foreground-muted text-xs">— {m.desc}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedModel === "__custom_openrouter__" && (
                      <div className="mt-2">
                        <input
                          value={customModel}
                          onChange={(e) => setCustomModel(e.target.value)}
                          placeholder="e.g. meta-llama/llama-3.1-8b-instruct"
                          className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <p className="text-[10px] text-foreground-muted mt-1">
                          Paste any slug from <a href="https://openrouter.ai/models" target="_blank" rel="noopener" className="text-primary hover:underline">openrouter.ai/models</a>
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Personality</label>
                    <Select value={personality} onValueChange={setPersonality}>
                      <SelectTrigger className="w-full bg-secondary border-border">
                        <SelectValue placeholder="Select personality" />
                      </SelectTrigger>
                      <SelectContent className="max-h-52">
                        {personalities.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            <span className="font-medium">{p.name}</span>
                            <span className="ml-2 text-foreground-muted text-xs">— {p.desc}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Tab 1: Knowledge Base */}
              {tab === 1 && (
                <>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs text-foreground-secondary">
                    <Sparkles size={14} className="inline mr-1.5 text-primary" />
                    <strong className="text-primary">How RAG works</strong> — Your documents are chunked, embedded, and retrieved to give your AI accurate answers from YOUR data.
                  </div>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <Upload size={24} className="mx-auto mb-2 text-foreground-muted" />
                    <p className="text-xs font-semibold text-foreground-secondary">Drop files here or click to browse</p>
                    <p className="text-[10px] text-foreground-muted mt-1">PDF, DOCX, TXT supported · Max 50MB per file</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://docs.example.com"
                      className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={handleAddUrl} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-[#CF4F2C] transition-colors">
                      Add URL
                    </button>
                  </div>
                  {sources.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground-secondary">Sources</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{sources.length} sources</span>
                      </div>
                      {sources.map((s) => (
                        <div key={s.id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <span className="text-sm">{s.type === "PDF" ? "📄" : s.type === "URL" ? "🌐" : s.type === "DOCX" ? "📄" : "📝"}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-foreground truncate">{s.name}</div>
                            <div className="text-[10px] text-foreground-muted">{s.type} · {s.size}</div>
                          </div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            s.status === "Indexed ✓" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                          }`}>
                            {s.status}
                          </span>
                          <button onClick={() => setSources((prev) => prev.filter((x) => x.id !== s.id))} className="text-foreground-muted hover:text-destructive">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Tab 2: Appearance */}
              {tab === 2 && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Logo URL (shown in the chat header)</label>
                    <div className="flex items-center gap-2">
                      {logoUrl && (
                        <img src={logoUrl} alt="logo" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
                      )}
                      <input
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://your-site.com/logo.png"
                        className="flex-1 px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                    <p className="text-[10px] text-foreground-muted mt-1">Paste a public image URL. Leave blank to use the default chat icon.</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Welcome Message</label>
                    <input
                      value={welcomeMsg}
                      onChange={(e) => setWelcomeMsg(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Suggested Questions</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={newSuggestion}
                        onChange={(e) => setNewSuggestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addSuggestion()}
                        placeholder="Add a suggestion..."
                        className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button onClick={addSuggestion} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((s, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-foreground-secondary">
                          {s}
                          <button onClick={() => setSuggestions((prev) => prev.filter((_, j) => j !== i))}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-2 block">Widget Position</label>
                    <div className="flex gap-2">
                      {(["left", "right"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPosition(p)}
                          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                            position === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground-secondary"
                          }`}
                        >
                          {p === "left" ? "← Left" : "→ Right"}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tab 3: Security */}
              {tab === 3 && (
                <>
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="text-xs font-semibold text-foreground">Password Protection</div>
                      <div className="text-[10px] text-foreground-muted">Require a password to access this agent</div>
                    </div>
                    <button
                      onClick={() => setPasswordEnabled(!passwordEnabled)}
                      className={`w-10 h-5 rounded-full transition-all relative ${passwordEnabled ? "bg-primary" : "bg-border"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${passwordEnabled ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                  {passwordEnabled && (
                    <input
                      type="password"
                      placeholder="Set password"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  )}
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <div className="text-xs font-semibold text-foreground">Rate Limiting</div>
                      <div className="text-[10px] text-foreground-muted">20 messages/user/hour</div>
                    </div>
                    <button
                      onClick={() => setRateLimitEnabled(!rateLimitEnabled)}
                      className={`w-10 h-5 rounded-full transition-all relative ${rateLimitEnabled ? "bg-primary" : "bg-border"}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-all ${rateLimitEnabled ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground-secondary mb-1.5 block">Domain Whitelist</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newDomain.trim()) {
                            setDomains((prev) => [...prev, newDomain.trim()]);
                            setNewDomain("");
                          }
                        }}
                        placeholder="example.com"
                        className="flex-1 px-3.5 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        onClick={() => { if (newDomain.trim()) { setDomains((prev) => [...prev, newDomain.trim()]); setNewDomain(""); } }}
                        className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {domains.map((d, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-xs text-foreground-secondary">
                          {d}
                          <button onClick={() => setDomains((prev) => prev.filter((_, j) => j !== i))}>
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Tab 4: Preview Chat */}
              {tab === 4 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground-secondary">Live Chat Preview</span>
                    <button onClick={() => setChatMessages([])} className="text-[10px] text-foreground-muted hover:text-foreground flex items-center gap-1">
                      <RotateCcw size={10} /> Clear
                    </button>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4 h-72 overflow-y-auto space-y-3">
                    <div className="bg-background p-3 rounded-lg rounded-bl-none max-w-[80%] border border-border">
                      <p className="text-xs text-foreground-secondary">{welcomeMsg}</p>
                    </div>
                    {chatMessages.map((m, i) => (
                      <div key={i} className={`max-w-[80%] ${m.role === "user" ? "ml-auto" : ""}`}>
                        <div className={`p-3 rounded-lg text-xs ${
                          m.role === "user"
                            ? "bg-background-elevated text-foreground rounded-br-none"
                            : "bg-background border border-border text-foreground-secondary rounded-bl-none"
                        }`}>
                          {m.content}
                        </div>
                        {m.role === "assistant" && sources.length > 0 && (
                          <span className="text-[9px] text-foreground-muted mt-1 inline-block">📄 Source: {sources[0].name}</span>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="bg-background p-3 rounded-lg rounded-bl-none max-w-[80%] border border-border">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <span key={i} className="w-1.5 h-1.5 bg-foreground-muted rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  {suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setChatInput(s)}
                          className="text-[10px] px-2.5 py-1 rounded-full border border-border text-foreground-secondary hover:bg-secondary"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3.5 py-2.5 rounded-full bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <button onClick={sendChatMessage} className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-[#CF4F2C] transition-colors">
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleSave} className="mt-4 w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-[#CF4F2C] transition-colors transition-all glow-primary">
              {existingAgent ? "Update Agent" : "Create Agent"}
            </button>
          </div>

          {/* Right: Widget Preview */}
          <div className="w-[340px] shrink-0 hidden lg:block">
            <div className="sticky top-20">
              <h3 className="text-xs font-semibold text-foreground-secondary mb-3">Widget Preview</h3>
              <div className="bg-background-elevated rounded-xl border border-border overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                  <span className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-warning/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-success/60" />
                  <div className="flex-1 ml-2 h-5 bg-secondary rounded text-[8px] text-foreground-muted flex items-center px-2">yoursite.com</div>
                </div>
                <div className="relative h-[420px] bg-background p-4">
                  <div className="space-y-2 mb-6">
                    <div className="h-3 bg-secondary rounded w-3/4" />
                    <div className="h-3 bg-secondary rounded w-1/2" />
                    <div className="h-3 bg-secondary rounded w-2/3" />
                    <div className="h-2 bg-secondary/50 rounded w-full mt-4" />
                    <div className="h-2 bg-secondary/50 rounded w-5/6" />
                  </div>

                  {widgetOpen ? (
                    <div
                      className={`absolute bottom-14 w-[280px] rounded-2xl overflow-hidden shadow-2xl ${
                        position === "right" ? "right-3" : "left-3"
                      }`}
                      style={{ border: `1px solid rgba(30,41,59,0.2)` }}
                    >
                      {/* Header — logo + name aligned to the start (matches the live widget) */}
                      <div className="px-3 py-2.5 flex items-center gap-2 relative overflow-hidden" style={{ backgroundColor: "#1e293b" }}>
                        <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.2), transparent)` }} />
                        <img
                          src={logoUrl || "https://osciva.io/images/osciva-web.png"}
                          alt=""
                          className="relative z-10 h-7 w-7 rounded-full bg-white object-contain p-0.5 shrink-0"
                        />
                        <div className="relative z-10 min-w-0 flex-1">
                          <div className="text-[11px] font-bold leading-tight truncate" style={{ color: "#fff" }}>{name || "My Agent"}</div>
                          <div className="text-[8px] flex items-center gap-1 leading-tight" style={{ color: "rgba(255,255,255,0.7)" }}>
                            <span className="w-1 h-1 rounded-full bg-green-400" /> Online
                          </div>
                        </div>
                        <div className="relative z-10 flex gap-1 shrink-0">
                          <button className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                            <RotateCcw size={8} style={{ color: "#fff" }} />
                          </button>
                          <button onClick={() => setWidgetOpen(false)} className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                            <X size={8} style={{ color: "#fff" }} />
                          </button>
                        </div>
                      </div>
                      {/* Chat area */}
                      <div className="p-2.5 space-y-2 h-[160px] overflow-y-auto" style={{ backgroundColor: "#ffffff" }}>
                        <div className="p-2 rounded-lg rounded-bl-sm text-[9px] shadow-sm" style={{ backgroundColor: "#f1f5f9", color: "#374151", border: "1px solid #e2e8f0" }}>
                          {welcomeMsg}
                        </div>
                      </div>
                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="px-2.5 pb-1.5 flex flex-wrap gap-1" style={{ backgroundColor: "#ffffff" }}>
                          {suggestions.slice(0, 2).map((s, i) => (
                            <span key={i} className="text-[7px] px-2 py-0.5 rounded-full" style={{ border: "1px solid rgba(30,41,59,0.4)", color: "#1e293b" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Input area */}
                      <div className="p-2 flex items-center gap-1.5" style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
                        <div className="flex-1 px-2 py-1.5 rounded-full text-[8px]" style={{ border: "1px solid #e2e8f0", color: "#9ca3af" }}>
                          Type a message...
                        </div>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#1e293b" }}>
                          <Send size={8} style={{ color: "#fff" }} />
                        </div>
                      </div>
                      {/* Footer */}
                      <div className="text-center py-1" style={{ backgroundColor: "#ffffff" }}>
                        <span className="text-[7px]" style={{ color: "#9ca3af" }}>Powered by Osciva⚡</span>
                      </div>
                    </div>
                  ) : null}

                  <div className={`absolute bottom-3 ${position === "right" ? "right-3" : "left-3"}`}>
                    {!widgetOpen && (
                      <div className="mb-2 px-3 py-1.5 rounded-full bg-foreground text-background text-[9px] font-medium shadow-lg whitespace-nowrap">
                        Need help? 💬
                      </div>
                    )}
                    <button
                      onClick={() => setWidgetOpen(!widgetOpen)}
                      className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                      style={{ backgroundColor: "#1e293b" }}
                    >
                      <img src="https://osciva.io/images/osciva-web.png" alt="" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
