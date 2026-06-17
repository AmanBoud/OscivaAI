import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Play, Check } from "lucide-react";
import { DashboardMockup } from "./UIMockups";

const EASE = [0.22, 1, 0.36, 1] as const;
const up = (d: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: EASE },
});

const logos = ["E-Commerce", "Education", "Healthcare", "SaaS", "Real Estate", "Fintech", "Logistics", "Hospitality"];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white pt-[120px] pb-16 md:pt-[150px] md:pb-24 px-5 sm:px-6">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.5]" aria-hidden />
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#E8613C]/[0.06] blur-[120px]" aria-hidden />

      <div className="relative max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <motion.div {...up(0)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBEDF0] bg-white/70 backdrop-blur shadow-sm mb-6">
              <span className="flex h-2 w-2">
                <span className="absolute h-2 w-2 rounded-full bg-[#E8613C]/40 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-[#E8613C]" />
              </span>
              <span className="text-[12.5px] font-medium text-[#586072]">No-code AI assistant builder · Made in India</span>
            </motion.div>

            <motion.h1
              {...up(0.08)}
              className="display text-[40px] sm:text-[52px] md:text-[60px] font-extrabold text-[#0B0E14]"
            >
              AI agents that{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-[#E8613C]">actually know</span>
                <svg className="absolute -bottom-1 left-0 w-full" height="10" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none">
                  <motion.path
                    d="M2 7C40 3 160 3 198 6"
                    stroke="#E8613C"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
                  />
                </svg>
              </span>{" "}
              your business.
            </motion.h1>

            <motion.p
              {...up(0.16)}
              className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-[#586072] max-w-xl mx-auto lg:mx-0"
            >
              Train an assistant on your own documents, website and FAQs — then embed it
              anywhere in minutes. Real answers from your real data. No developers, no glue code.
            </motion.p>

            <motion.div {...up(0.24)} className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/auth")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E8613C] text-white text-[15px] font-semibold hover:bg-[#CF4F2C] transition-all shadow-brand"
              >
                Start building free
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#E3E6EB] bg-white text-[15px] font-semibold text-[#0B0E14] hover:bg-[#F7F8FA] transition-colors"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0B0E14] text-white">
                  <Play size={11} className="fill-white ml-0.5" />
                </span>
                Watch demo
              </button>
            </motion.div>

            <motion.div {...up(0.32)} className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 justify-center lg:justify-start text-[13px] text-[#8C94A1]">
              {["Free 50 credits", "No credit card", "Live in ~30 min"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#16A34A]" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Product visual */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
            className="relative [perspective:1200px]"
          >
            <div className="animate-float">
              <DashboardMockup />
            </div>
            {/* floating proof chip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9, ease: EASE }}
              className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-2xl shadow-float border border-[#EBEDF0] px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-[#16A34A]/10 flex items-center justify-center">
                <Check size={17} className="text-[#16A34A]" />
              </div>
              <div className="text-left">
                <div className="text-[12px] font-bold text-[#0B0E14] leading-tight">Your AI is live</div>
                <div className="text-[11px] text-[#8C94A1]">Answering customers 24/7</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Trust marquee */}
        <motion.div {...up(0.5)} className="mt-20 md:mt-28">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#A2AAB6] mb-6">
            Trusted by teams across industries
          </p>
          <div className="relative overflow-hidden mask-fade-x">
            <div className="flex w-max gap-12 animate-marquee">
              {[...logos, ...logos].map((n, i) => (
                <span key={i} className="text-[18px] font-bold tracking-tight text-[#0B0E14]/30 whitespace-nowrap">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
