import { motion } from "framer-motion";
import { Clock, Bot, CreditCard, Wrench } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const reasons = [
  { icon: Clock, title: "Live in 30 Minutes", desc: "Upload your data, configure your assistant, embed it. No setup hell, no engineering team needed.", color: "#E8613C" },
  { icon: Bot, title: "For Any Business", desc: "Stores, clinics, schools, SaaS, agencies, real estate — if you have customers, your AI assistant fits in.", color: "#4CAF50" },
  { icon: CreditCard, title: "Truly No-Code", desc: "Built for founders, marketers, and operators. If you can use WhatsApp, you can build an Osciva agent.", color: "#2196F3" },
  { icon: Wrench, title: "Made in India 🇮🇳", desc: "Built in India for Indian businesses. INR pricing, GST invoices, and 20+ Indian languages out of the box.", color: "#FF9800" },
];

export default function HighlightsSection() {
  return (
    <section className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
            Why Build With Osciva AI
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-[15px] text-[#888] max-w-lg mx-auto">
            India's most accessible AI assistant builder — designed for non-technical founders
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className="bg-[#FAFAFA] rounded-2xl p-6 border border-[#f0ebe6] hover:shadow-lg hover:shadow-[#E8613C]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `${r.color}15` }}>
                <r.icon size={22} style={{ color: r.color }} />
              </div>
              <h3 className="text-[16px] font-bold text-[#1a1a2e] mb-2">{r.title}</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
