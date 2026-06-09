import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const testimonials = [
  { name: "Priya Sharma", role: "CTO, FinEdge Solutions", text: "Osciva AI transformed our customer support. We reduced response time by 80% and our CSAT scores went through the roof.", avatar: "PS", color: "#E8613C" },
  { name: "Rahul Menon", role: "Founder, ShopKart", text: "Setting up our AI agent took less than 30 minutes. It now handles 70% of our customer queries without human intervention.", avatar: "RM", color: "#4CAF50" },
  { name: "Ananya Gupta", role: "VP Product, HealthBridge", text: "The RAG knowledge base feature is a game-changer. Our agent answers complex queries accurately using our own docs.", avatar: "AG", color: "#2196F3" },
  { name: "Vikram Patel", role: "Head of CX, UrbanClap", text: "Osciva AI was the only platform that understood Indian languages natively and handled our complex booking workflows.", avatar: "VP", color: "#FF9800" },
  { name: "Meera Iyer", role: "COO, EduFirst", text: "Within a week, we reduced ticket volume by 60% while improving satisfaction scores. Our support team now focuses on what matters.", avatar: "MI", color: "#9C27B0" },
  { name: "Arjun Nair", role: "CTO, PaySecure", text: "SOC 2, DPDP compliance, India hosting — Osciva AI was the clear choice for our financial services platform.", avatar: "AN", color: "#607D8B" },
];

const stats = [
  { value: "500+", label: "Businesses Trust Us" },
  { value: "10M+", label: "Messages Handled" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "<1.2s", label: "Avg. Response Time" },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Stats bar */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 rounded-3xl bg-[#1a1a2e]"
        >
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
              <div className="text-[28px] md:text-[36px] font-extrabold text-white mb-1">{s.value}</div>
              <div className="text-[12px] text-[#999] font-medium">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-14">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
            Testimonials
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e]">
            Loved by Teams Across India
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className="p-6 rounded-2xl border border-[#f0ebe6] bg-[#FAFAFA] hover:bg-white hover:shadow-lg hover:shadow-[#E8613C]/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="text-[#E8613C] fill-[#E8613C]" />
                ))}
              </div>
              <p className="text-[13px] text-[#555] leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white" style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#1a1a2e]">{t.name}</div>
                  <div className="text-[11px] text-[#999]">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
