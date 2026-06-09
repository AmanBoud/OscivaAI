import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Check, Sparkles, Zap, Globe2 } from "lucide-react";
import { DashboardMockup } from "./UIMockups";

const stats = [
  { icon: Sparkles, value: "No-Code", label: "Build Your Agent", sub: "Zero coding required" },
  { icon: Zap, value: "30 Min", label: "From Idea to Live", sub: "On your website" },
  { icon: Globe2, value: "🇮🇳", label: "Made in India", sub: "For Indian businesses" },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-[#FFF5F0] pt-[100px] pb-8 md:pt-[120px] md:pb-16 px-6 overflow-hidden">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="text-[13px] font-semibold text-[#E8613C] tracking-wide uppercase mb-4"
            >
              🇮🇳 India's First No-Code AI Assistant Builder
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[36px] sm:text-[44px] md:text-[52px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#1a1a2e] mb-5"
            >
              Build Your Own{" "}
              <span className="text-[#E8613C]">Smart AI Assistant</span>{" "}
              — No Code Needed
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-wrap items-center gap-2 mb-5"
            >
              {["Any Business", "Any Website", "Any Use Case"].map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-white/70 border border-[#f0e6df] text-[12px] font-medium text-[#666]">
                  {tag}
                </span>
              ))}
              <span className="text-[14px] text-[#555]">— all in one platform</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[15px] text-[#666] leading-relaxed max-w-md mb-7"
            >
              Whether you run a store, a clinic, an institute, or a SaaS product — train an AI assistant on your data and embed it on your website or app in minutes. No developers. No headaches.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
              className="flex items-center gap-3 flex-wrap mb-8"
            >
              <button onClick={() => navigate("/auth")}
                className="px-7 py-3.5 rounded-full bg-[#E8613C] text-white text-[14px] font-semibold hover:bg-[#d4522f] transition-all shadow-lg shadow-[#E8613C]/25">
                Build My Assistant Free
              </button>
              <button onClick={() => navigate("/auth")}
                className="flex items-center gap-2 px-5 py-3.5 rounded-full border border-[#E8613C]/20 text-[14px] font-medium text-[#E8613C] hover:bg-[#E8613C]/5 transition-colors">
                <Play size={15} className="fill-[#E8613C]" /> Watch Overview
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-start gap-6 flex-wrap mb-6"
            >
              {stats.map((s) => (
                <div key={s.label} className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FDEAE3] flex items-center justify-center flex-shrink-0">
                    <s.icon size={18} className="text-[#E8613C]" />
                  </div>
                  <div>
                    <div className="text-[18px] font-extrabold text-[#1a1a2e] leading-tight">{s.value}</div>
                    <div className="text-[11px] text-[#888] leading-tight">{s.label}<br />{s.sub}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-4 flex-wrap text-[12px] text-[#888]"
            >
              {["No coding required", "Free 50 credits", "Made in India 🇮🇳"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check size={13} className="text-[#E8613C]" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero — Real Dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <DashboardMockup />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-[#f0e6df]"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                  <Check size={16} className="text-[#4CAF50]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#1a1a2e]">Your AI is Live</div>
                  <div className="text-[10px] text-[#888]">Helping customers 24/7</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-10 border-t border-[#f0e6df]"
        >
          <p className="text-center text-[11px] text-[#888] mb-4 uppercase tracking-wider font-semibold">
            Trusted by Indian businesses across industries
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-14 flex-wrap opacity-40">
            {["E-Commerce", "Education", "Healthcare", "SaaS", "Real Estate", "Fintech"].map((n) => (
              <span key={n} className="text-[14px] font-bold tracking-tight text-[#1a1a2e]">{n}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
