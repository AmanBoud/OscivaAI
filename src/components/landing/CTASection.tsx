import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section id="contact" className="px-5 sm:px-6 pb-20 md:pb-28">
      <div className="max-w-[1100px] mx-auto">
        <div className="relative overflow-hidden rounded-[32px] bg-[#0B0E14] px-6 py-16 md:px-16 md:py-20 text-center">
          <div className="absolute inset-0 bg-glow-tl" aria-hidden />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative"
          >
            <h2 className="display text-[30px] md:text-[46px] font-extrabold text-white max-w-2xl mx-auto">
              Ready to put AI to work for your business?
            </h2>
            <p className="mt-5 text-[15px] md:text-[16px] text-white/60 max-w-lg mx-auto leading-relaxed">
              Join 500+ businesses using Osciva. Build your first agent today — it's free, and you'll be live in minutes.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#E8613C] text-white text-[15px] font-semibold hover:bg-[#CF4F2C] transition-colors shadow-brand"
              >
                Start building free
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-white/15 text-[15px] font-semibold text-white hover:bg-white/5 transition-colors"
              >
                Talk to sales
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/55">
              {["No credit card", "Free 50 credits", "Cancel anytime"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#E8613C]" /> {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
