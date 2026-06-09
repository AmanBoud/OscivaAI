import Topbar from "@/components/layout/Topbar";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "rag", label: "How RAG Works" },
  { id: "prompts", label: "System Prompts" },
  { id: "api", label: "API Integrations" },
  { id: "embed", label: "Embed Guide" },
];

const content: Record<string, React.ReactNode> = {
  overview: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">What is Osciva AI?</h2>
      <p className="text-xs text-foreground-secondary leading-relaxed">
        Osciva AI is India's first enterprise-grade AI agent platform. Build, train, and deploy intelligent AI agents on your own data — in minutes, not months.
      </p>
      <h3 className="text-sm font-semibold text-foreground mt-6">Quick Start</h3>
      <div className="space-y-3">
        {["Create an agent and configure its personality", "Upload your documents or add URLs to the knowledge base", "Customize the widget appearance and embed on your site", "Monitor performance through the analytics dashboard"].map((s, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</span>
            <p className="text-xs text-foreground-secondary">{s}</p>
          </div>
        ))}
      </div>
    </div>
  ),
  rag: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">How RAG Works</h2>
      <p className="text-xs text-foreground-secondary leading-relaxed">
        RAG (Retrieval-Augmented Generation) is the technology that lets your AI agent answer questions using YOUR data instead of general knowledge.
      </p>
      <h3 className="text-sm font-semibold text-foreground">3-Step Process</h3>
      {[
        { title: "1. Ingestion", desc: "Your documents (PDF, DOCX, TXT) are split into small chunks and stored in our database." },
        { title: "2. Embedding", desc: "Each chunk is converted into a mathematical representation (vector) that captures its meaning." },
        { title: "3. Retrieval", desc: "When a user asks a question, we find the most relevant chunks and feed them to the AI along with the question." },
      ].map((s) => (
        <div key={s.title} className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs font-semibold text-primary mb-1">{s.title}</div>
          <p className="text-[11px] text-foreground-secondary">{s.desc}</p>
        </div>
      ))}
      <h3 className="text-sm font-semibold text-foreground mt-4">Why RAG over Fine-tuning?</h3>
      <ul className="text-xs text-foreground-secondary space-y-1.5 list-disc list-inside">
        <li>No need to retrain the model — just update your documents</li>
        <li>Sources are cited so users can verify answers</li>
        <li>Works with any AI model (OpenAI, Anthropic, Google)</li>
        <li>Much cheaper and faster than fine-tuning</li>
      </ul>
      <h3 className="text-sm font-semibold text-foreground mt-4">Supported Formats</h3>
      <div className="flex gap-2 flex-wrap">
        {["PDF", "DOCX", "TXT", "URL"].map((f) => (
          <span key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{f}</span>
        ))}
      </div>
    </div>
  ),
  prompts: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">System Prompts</h2>
      <p className="text-xs text-foreground-secondary leading-relaxed">
        A system prompt is the instruction that shapes your AI agent's behavior. It determines personality, boundaries, and response style.
      </p>
      <h3 className="text-sm font-semibold text-foreground">Anatomy of a Great Prompt</h3>
      <pre className="text-[10px] text-foreground-secondary bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono leading-relaxed whitespace-pre-wrap">
{`You are a customer support agent for [Company].  // ← Role
Your tone is professional yet friendly.           // ← Personality
You only answer questions about our products.     // ← Boundaries
If unsure, say "Let me connect you with a human." // ← Fallback
Always cite the source document.                  // ← Behavior`}
      </pre>
      <h3 className="text-sm font-semibold text-foreground">Example Use Cases</h3>
      {[
        { title: "E-commerce Support", prompt: "You are a helpful shopping assistant. Guide users to products, answer sizing questions, and help with returns." },
        { title: "SaaS Onboarding", prompt: "You help new users set up their account. Walk them through features step by step." },
        { title: "Legal FAQ Bot", prompt: "You provide general legal information based on Indian law. Always add a disclaimer that this is not legal advice." },
        { title: "HR Helpdesk", prompt: "You answer employee questions about leave policy, benefits, and company procedures." },
      ].map((e) => (
        <div key={e.title} className="p-3 bg-secondary/50 rounded-lg">
          <div className="text-xs font-semibold text-foreground mb-1">{e.title}</div>
          <p className="text-[10px] text-foreground-muted italic">"{e.prompt}"</p>
        </div>
      ))}
    </div>
  ),
  api: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">API Integrations</h2>
      <h3 className="text-sm font-semibold text-foreground">Webhook Request Format</h3>
      <pre className="text-[10px] text-foreground-secondary bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
{`POST https://api.osciva.io/v1/chat/{agentId}
Content-Type: application/json

{
  "message": "What is your return policy?",
  "session_id": "user_abc123",
  "metadata": { "source": "website" }
}`}
      </pre>
      <h3 className="text-sm font-semibold text-foreground">Response Format</h3>
      <pre className="text-[10px] text-foreground-secondary bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
{`{
  "response": "Our return policy allows...",
  "sources": ["returns-policy.pdf"],
  "session_id": "user_abc123",
  "tokens_used": 245
}`}
      </pre>
      <h3 className="text-sm font-semibold text-foreground">Supported Integrations</h3>
      <div className="grid grid-cols-2 gap-2">
        {["n8n", "Make (Integromat)", "Zapier", "Webhooks", "REST API", "WhatsApp", "Slack", "Telegram"].map((i) => (
          <div key={i} className="p-2.5 bg-secondary/50 rounded-lg text-xs text-foreground-secondary font-medium text-center">{i}</div>
        ))}
      </div>
    </div>
  ),
  embed: (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-foreground">Embed Guide</h2>
      <p className="text-xs text-foreground-secondary leading-relaxed">
        Add your AI agent to any website with a single code snippet. The widget is fully responsive, customizable, and optimized for mobile.
      </p>
      <h3 className="text-sm font-semibold text-foreground">Features</h3>
      <ul className="text-xs text-foreground-secondary space-y-1.5 list-disc list-inside">
        <li>Fully responsive design with mobile optimizations</li>
        <li>Customizable colors, position, and branding</li>
        <li>Session management for conversation continuity</li>
        <li>iOS keyboard handling</li>
        <li>Rotating bubble messages to encourage engagement</li>
        <li>Powered by Osciva badge</li>
      </ul>
      <h3 className="text-sm font-semibold text-foreground">OscivaConfig Reference</h3>
      <pre className="text-[10px] text-foreground-secondary bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono whitespace-pre-wrap">
{`window.OscivaConfig = {
  agentId: "agent_abc123",       // Required — your agent ID
  companyName: "Your Company",    // Header display name
  tagline: "AI Assistant",        // Header subtitle
  welcomeMessage: "Hi! 👋",      // Initial bot message
  theme: "purple",                // Color theme
  position: "right",              // Widget position (left/right)
  headerLogo: "https://...",      // Logo URL for header
  bubbleLogo: "https://...",      // Logo URL for toggle button
  webhookUrl: "https://...",      // Chat API endpoint
  bubbleMessages: [               // Rotating bubble texts
    "Need help? 💬",
    "Ask me anything 💡"
  ]
};`}
      </pre>
    </div>
  ),
};

export default function Docs() {
  const [active, setActive] = useState("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeLabel = sections.find((s) => s.id === active)?.label ?? "Overview";

  return (
    <>
      <Topbar title="Documentation" subtitle="Learn how to use Osciva AI" />
      <div className="p-4 md:p-6 animate-fade-up">
        {/* Mobile nav dropdown */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-secondary border border-border text-sm font-semibold text-foreground"
          >
            {activeLabel}
            <ChevronDown size={16} className={`text-foreground-muted transition-transform ${mobileNavOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileNavOpen && (
            <div className="mt-1 rounded-lg border border-border bg-card overflow-hidden">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setActive(s.id); setMobileNavOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-all ${
                    active === s.id ? "bg-primary/10 text-primary" : "text-foreground-secondary hover:bg-secondary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Desktop left nav */}
          <div className="w-48 shrink-0 hidden md:block">
            <nav className="space-y-0.5 sticky top-20">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    active === s.id ? "bg-primary/10 text-primary" : "text-foreground-secondary hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 glass-card p-4 md:p-6 min-w-0">
            {content[active]}
          </div>
        </div>
      </div>
    </>
  );
}
