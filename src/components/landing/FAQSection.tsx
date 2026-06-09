import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
  }),
};

const faqs = [
  { q: "What is Osciva AI?", a: "Osciva AI is India's first enterprise-grade AI agent platform. Build, train, and deploy intelligent chatbots on your own data — no coding required." },
  { q: "How long does it take to set up?", a: "Most businesses go live within 30 minutes. Upload your data, configure your agent, embed the widget, and you're ready." },
  { q: "What languages does it support?", a: "20+ languages including Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Malayalam, and major international languages." },
  { q: "Is my data secure?", a: "Absolutely. SOC 2 compliant, DPDP ready. All data encrypted at rest and in transit, hosted exclusively on Indian servers." },
  { q: "Can I integrate with existing tools?", a: "Yes — Slack, WhatsApp, Zendesk, Freshdesk, Shopify, WordPress, Razorpay, and custom integrations via APIs and webhooks." },
  { q: "What happens when AI can't answer?", a: "Automatic handoff to human agents with full conversation context preserved. Your team picks up right where the bot left off." },
  { q: "Do you offer a free trial?", a: "Yes! Get started free with no credit card required. Upgrade when you're ready to scale." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-[720px] mx-auto">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
          className="text-center mb-12"
        >
          <motion.h2 variants={fadeUp} custom={0}
            className="text-[32px] md:text-[42px] font-bold leading-[1.15] tracking-[-0.02em] text-[#0a0a0a]">
            Frequently asked questions
          </motion.h2>
        </motion.div>

        <div className="divide-y divide-[#f0f0f0]">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-20px" }}
              variants={fadeUp} custom={i}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
              >
                <span className="text-[15px] font-medium text-[#0a0a0a] pr-4 group-hover:text-[hsl(var(--primary))] transition-colors">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#999] shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-40 pb-5" : "max-h-0"}`}>
                <p className="text-[14px] text-[#666] leading-relaxed">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
