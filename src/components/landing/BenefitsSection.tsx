import { motion } from "framer-motion";
import { Globe, Shield, Zap, MessageSquare, Eye, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const benefits = [
  { icon: MessageSquare, title: "Personalized Conversations", desc: "Your assistant remembers context, recognizes returning users, and gives accurate, on-brand answers using your data." },
  { icon: Zap, title: "Save 80% of Time", desc: "Automate repetitive questions, lead qualification, and onboarding so your team focuses on what matters most." },
  { icon: Globe, title: "Speak Your Customer's Language", desc: "Hindi, Tamil, Telugu, Bengali, Kannada and 20+ languages — built for India's diverse customer base." },
  { icon: Shield, title: "Built for Non-Coders", desc: "Founders, marketers, support leads — anyone in your team can build, edit, and improve your AI assistant." },
  { icon: Eye, title: "Know What's Happening", desc: "Live conversation logs, top questions, and CSAT — see exactly how your AI is helping customers in real time." },
  { icon: Users, title: "Built for Indian Business", desc: "INR pricing, GST invoices, India-hosted data, DPDP-compliant. Made in India 🇮🇳, for India." },
];

export default function BenefitsSection() {
  return (
    <section className="bg-[#FFF5F0] py-20 md:py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
            Benefits
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
            An AI Assistant That Works Like Your Best Employee
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className="bg-white rounded-2xl p-6 border border-[#f0ebe6] hover:shadow-lg hover:shadow-[#E8613C]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-[#FDEAE3] flex items-center justify-center mb-4">
                <b.icon size={20} className="text-[#E8613C]" />
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-2">{b.title}</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
