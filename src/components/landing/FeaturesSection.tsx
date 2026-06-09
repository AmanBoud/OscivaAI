import { motion } from "framer-motion";
import { Database, Workflow, BarChart3, MessageSquare, Code2, Paintbrush, Globe, Shield, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const features = [
  { icon: Database, title: "Train on Your Data", desc: "Upload PDFs, docs, URLs, FAQs — anything. Your AI learns YOUR business and answers from your real content.", color: "#E8613C" },
  { icon: Workflow, title: "Any Business Use Case", desc: "Customer support, sales, lead capture, internal helpdesk, course tutoring — design your assistant for whatever you need.", color: "#4CAF50" },
  { icon: BarChart3, title: "Built-in Analytics", desc: "See every conversation, top questions, and CSAT — without setting up Google Analytics.", color: "#2196F3" },
  { icon: MessageSquare, title: "Human Handoff", desc: "When the AI can't help, it smoothly hands the chat to your team with full context preserved.", color: "#FF9800" },
  { icon: Globe, title: "20+ Indian Languages", desc: "Native Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Punjabi, and more.", color: "#9C27B0" },
  { icon: Shield, title: "India-First Security", desc: "DPDP-compliant, encryption everywhere, data hosted in India — built for Indian businesses.", color: "#607D8B" },
  { icon: Code2, title: "Embed Anywhere", desc: "One line of code for any website. Native plugins for WordPress, Shopify, React, and WhatsApp Business.", color: "#795548" },
  { icon: Paintbrush, title: "Your Brand, Not Ours", desc: "Pick colors, upload your logo, customize the welcome message — your AI looks like part of your product.", color: "#E91E63" },
  { icon: Zap, title: "No-Code, Truly", desc: "If you've ever filled a form, you can build an Osciva agent. No JSON, no APIs, no developer required.", color: "#00BCD4" },
];

const integrations = [
  "WhatsApp", "Slack", "Zendesk", "Freshdesk", "Salesforce",
  "Zapier", "Shopify", "WordPress", "Razorpay", "Stripe",
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 md:py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
            Features
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
            Everything You Need — None of the Complexity
          </motion.h2>
          <motion.p variants={fadeUp} custom={2}
            className="text-[15px] text-[#888] max-w-xl mx-auto">
            A complete AI assistant platform designed for Indian businesses, not engineers.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className="bg-[#FAFAFA] rounded-2xl p-6 border border-[#f0ebe6] hover:bg-white hover:shadow-lg hover:shadow-[#E8613C]/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: `${f.color}12` }}>
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="text-[15px] font-bold text-[#1a1a2e] mb-2">{f.title}</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Integrations */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0}
          className="bg-[#FFF5F0] rounded-3xl border border-[#f0ebe6] p-10 text-center"
        >
          <h3 className="text-[18px] font-bold text-[#1a1a2e] mb-2">Works With Your Tools</h3>
          <p className="text-[13px] text-[#888] mb-7">Integrate with the platforms your team already uses</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {integrations.map((name) => (
              <span key={name} className="px-5 py-2.5 rounded-full border border-[#f0ebe6] bg-white text-[13px] font-medium text-[#555] hover:border-[#E8613C]/30 hover:text-[#E8613C] transition-colors">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
