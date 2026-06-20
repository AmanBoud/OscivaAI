import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Check, RefreshCw, Send, FileText } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;
const up = (d: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: EASE },
});

const stats = [
  { stat: "4", unit: "providers", desc: "OpenAI, Anthropic, Google and OpenRouter. Your key, your model." },
  { stat: "~30", unit: "minutes", desc: "From uploading your docs to a live agent on your website." },
  { stat: "0%", unit: "token markup", desc: "Bring your own key and pay your AI provider directly." },
];

/* The real product surface — the Osciva chat widget — rendered as a live
 * component preview (not a fake dashboard screenshot). */
function ChatPreview() {
  return (
    <div className="w-full max-w-[420px] mx-auto rounded-[20px] bg-white border border-[#EBEDF0] shadow-float overflow-hidden">
      {/* widget header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0B0E14]">
        <div className="w-9 h-9 rounded-full bg-[#0EC2A8] grid place-items-center text-white font-bold text-[13px]">O</div>
        <div className="min-w-0 flex-1">
          <div className="text-[13px] font-semibold text-white leading-tight">Osciva Assistant</div>
          <div className="flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> Online
          </div>
        </div>
        <RefreshCw size={14} className="text-white/45" />
      </div>

      {/* messages */}
      <div className="px-4 py-4 space-y-3 bg-[#F7F8FA]">
        <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white border border-[#EBEDF0] px-3.5 py-2.5 text-[13px] text-[#1F2733] leading-relaxed">
          Hi there. Ask me anything about our plans, setup, or docs.
        </div>
        <div className="max-w-[82%] ml-auto rounded-2xl rounded-br-md bg-[#0B0E14] px-3.5 py-2.5 text-[13px] text-white leading-relaxed">
          What's included in the free plan?
        </div>
        <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-white border border-[#EBEDF0] px-3.5 py-2.5 text-[13px] text-[#1F2733] leading-relaxed">
          The Free plan gives you 50 message credits, one AI agent, and training on
          your documents and website. You can upgrade anytime.
          <span className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#586072]">
            <FileText size={12} className="text-[#0EC2A8]" /> From: pricing-and-plans.pdf
          </span>
        </div>
      </div>

      {/* input */}
      <div className="flex items-center gap-2 px-3 py-3 border-t border-[#EBEDF0] bg-white">
        <div className="flex-1 rounded-full bg-[#F2F4F7] px-4 py-2 text-[12.5px] text-[#8C94A1]">
          Message Osciva…
        </div>
        <div className="w-9 h-9 rounded-full bg-[#0EC2A8] grid place-items-center text-white">
          <Send size={15} />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white pt-[116px] pb-20 md:pt-[140px] md:pb-28 px-5 sm:px-6">
      {/* single, restrained brand glow */}
      <div className="absolute inset-0 bg-mesh" aria-hidden />

      <div className="relative max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div
              {...up(0)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBEDF0] bg-[#F7F8FA] mb-7"
            >
              <Sparkles size={13} className="text-[#0EC2A8]" />
              <span className="text-[12.5px] font-medium text-[#586072]">No-code AI agent builder, made in India</span>
            </motion.div>

            <motion.h1
              {...up(0.08)}
              className="display text-[40px] sm:text-[52px] md:text-[60px] font-bold text-[#0B0E14]"
            >
              AI agents that <span className="text-[#0EC2A8]">actually know</span> your business.
            </motion.h1>

            <motion.p
              {...up(0.16)}
              className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-[#586072] max-w-md mx-auto lg:mx-0"
            >
              Train an assistant on your documents, website and FAQs, then embed it anywhere in
              minutes. No developers, no glue code.
            </motion.p>

            <motion.div {...up(0.24)} className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/auth")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#0EC2A8] text-white text-[15px] font-semibold hover:bg-[#0AA593] transition-colors shadow-brand"
              >
                Start Free Trial
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/how-it-works")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#E3E6EB] bg-white text-[15px] font-semibold text-[#0B0E14] hover:bg-[#F7F8FA] transition-colors"
              >
                See how it works
              </button>
            </motion.div>

            <motion.div {...up(0.32)} className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start text-[13px] text-[#586072]">
              {["No credit card", "50 free credits", "3-day trial", "Live in 30 minutes"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#0EC2A8]" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Real product preview */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="relative"
          >
            <div className="animate-float">
              <ChatPreview />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
              className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-2xl shadow-float border border-[#EBEDF0] px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 grid place-items-center">
                <Check size={17} className="text-[#16A34A]" />
              </div>
              <div className="text-left">
                <div className="text-[12px] font-bold text-[#0B0E14] leading-tight">Live in ~30 minutes</div>
                <div className="text-[11px] text-[#8C94A1]">Answering customers 24/7</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Capability stats (honest, not invented customer metrics) */}
        <motion.div
          {...up(0.5)}
          className="mt-20 md:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-[#EBEDF0] bg-[#EBEDF0]"
        >
          {stats.map((s) => (
            <div key={s.unit} className="bg-white p-7 text-center sm:text-left">
              <div className="flex items-baseline gap-1.5 justify-center sm:justify-start">
                <span className="display text-[40px] font-bold text-[#0B0E14]">{s.stat}</span>
                <span className="text-[15px] font-semibold text-[#0EC2A8]">{s.unit}</span>
              </div>
              <p className="mt-2 text-[13.5px] text-[#586072] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
