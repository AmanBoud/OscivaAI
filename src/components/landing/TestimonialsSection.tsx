import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";
import CountUp from "./CountUp";

const EASE = [0.22, 1, 0.36, 1] as const;

const testimonials = [
  { name: "Priya Sharma", role: "CTO, FinEdge Solutions", text: "Osciva transformed our support. Response time dropped 80% and CSAT went through the roof.", avatar: "PS" },
  { name: "Rahul Menon", role: "Founder, ShopKart", text: "Setting up our agent took under 30 minutes. It now handles 70% of customer queries with no human in the loop.", avatar: "RM" },
  { name: "Ananya Gupta", role: "VP Product, HealthBridge", text: "The knowledge-base retrieval is a game-changer. It answers complex queries accurately from our own docs.", avatar: "AG" },
];

const stats = [
  { value: 500, suffix: "+", label: "Businesses trust us" },
  { value: 10, suffix: "M+", label: "Messages handled" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Platform uptime" },
  { value: 1.2, decimals: 1, prefix: "<", suffix: "s", label: "Avg. response time" },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-tl" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Stats band */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-[#0B0E14] p-8 md:p-12 mb-20">
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
                  className="text-center"
                >
                  <div className="text-[30px] md:text-[40px] font-extrabold text-white display">
                    <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <div className="text-[12.5px] text-white/55 font-medium mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <SectionHeading eyebrow="Testimonials" title="Loved by teams across India" />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} i={i % 3}>
              <figure className="h-full rounded-2xl border border-[#EBEDF0] bg-white p-6 transition-all duration-300 hover:shadow-premium hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className="text-[#E8613C] fill-[#E8613C]" />
                  ))}
                </div>
                <blockquote className="text-[14px] text-[#1F2733] leading-relaxed mb-6">“{t.text}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-white bg-[#0B0E14]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#0B0E14]">{t.name}</div>
                    <div className="text-[11.5px] text-[#8C94A1]">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
