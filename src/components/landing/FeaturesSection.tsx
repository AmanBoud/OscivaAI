import { motion } from "framer-motion";
import { Database, Workflow, BarChart3, MessageSquare, Code2, Paintbrush, Globe, Shield, Zap } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";

const spotlight = {
  icon: Database,
  title: "Train on your own data",
  desc: "Upload PDFs, documents, URLs and FAQs — anything. Osciva embeds your content into a private knowledge base so every answer is grounded in your real business, never made up.",
};

const features = [
  { icon: Workflow, title: "Any use case", desc: "Support, sales, lead capture, internal helpdesk, tutoring — design it for whatever you need." },
  { icon: BarChart3, title: "Built-in analytics", desc: "Every conversation, top questions and resolution rate — no extra tools to wire up." },
  { icon: MessageSquare, title: "Human handoff", desc: "When the AI can't help, it hands off to your team with full context preserved." },
  { icon: Globe, title: "20+ Indian languages", desc: "Native Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati and more." },
  { icon: Shield, title: "India-first security", desc: "DPDP-ready, encrypted everywhere, data hosted in India." },
  { icon: Code2, title: "Embed anywhere", desc: "One line of code. Native WordPress, Shopify, React and WhatsApp support." },
  { icon: Paintbrush, title: "Your brand, not ours", desc: "Your colors, logo and welcome message — it looks like part of your product." },
  { icon: Zap, title: "Truly no-code", desc: "No JSON, no APIs, no developer. If you've filled a form, you can build one." },
];

const integrations = ["WhatsApp", "Slack", "Zendesk", "Freshdesk", "Salesforce", "Zapier", "Shopify", "WordPress", "Razorpay", "Stripe"];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-bl" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <SectionHeading
          eyebrow="Platform"
          title="Everything you need. None of the complexity."
          subtitle="A complete AI assistant platform built for operators, not engineers."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-4">
          {/* Spotlight card */}
          <Reveal className="md:col-span-2 lg:row-span-2">
            <div className="relative h-full overflow-hidden rounded-3xl border border-[#EBEDF0] bg-[#0B0E14] p-8 text-white">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-[#E8613C] flex items-center justify-center mb-6 shadow-brand">
                  <spotlight.icon size={22} className="text-white" />
                </div>
                <h3 className="text-[22px] md:text-[26px] font-extrabold display mb-3">{spotlight.title}</h3>
                <p className="text-[14.5px] text-white/65 leading-relaxed max-w-md">{spotlight.desc}</p>

                {/* mini "indexing" visual */}
                <div className="mt-8 grid grid-cols-3 gap-2.5 max-w-md">
                  {["product-guide.pdf", "returns-policy.md", "company.osciva.io", "pricing.pdf", "faq.docx", "support.csv"].map((f, i) => (
                    <motion.div
                      key={f}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="flex items-center gap-1.5 rounded-lg bg-white/[0.06] border border-white/10 px-2.5 py-2 text-[10px] text-white/70"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      <span className="truncate">{f}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {features.map((f, i) => (
            <Reveal key={f.title} i={(i % 3) + 1}>
              <div className="group h-full rounded-2xl border border-[#EBEDF0] bg-white p-6 transition-all duration-300 hover:border-[#E8613C]/30 hover:shadow-premium hover:-translate-y-1">
                <div className="w-11 h-11 rounded-xl bg-[#F7F8FA] border border-[#EBEDF0] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#FFF1EC] group-hover:border-[#E8613C]/20">
                  <f.icon size={19} className="text-[#0B0E14] transition-colors group-hover:text-[#E8613C]" />
                </div>
                <h3 className="text-[15px] font-bold text-[#0B0E14] mb-1.5">{f.title}</h3>
                <p className="text-[13px] text-[#586072] leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Integrations marquee */}
        <Reveal>
          <div className="mt-14 rounded-3xl border border-[#EBEDF0] bg-[#F7F8FA] py-10">
            <p className="text-center text-[13px] text-[#586072] mb-6">
              <span className="font-semibold text-[#0B0E14]">Works with your stack</span> — connect the tools your team already uses
            </p>
            <div className="relative overflow-hidden mask-fade-x">
              <div className="flex w-max gap-3 animate-marquee-slow">
                {[...integrations, ...integrations].map((name, i) => (
                  <span
                    key={i}
                    className="px-5 py-2.5 rounded-full border border-[#EBEDF0] bg-white text-[13px] font-medium text-[#586072] whitespace-nowrap"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
