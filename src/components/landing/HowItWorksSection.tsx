import { motion } from "framer-motion";
import { DashboardMockup, WizardMockup, WidgetMockup } from "./UIMockups";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const steps = [
  {
    num: "01",
    title: "Configure Your Assistant — No Code",
    desc: "Use our point-and-click wizard to name your AI, set its personality, choose an AI model, and write what it should do — all in plain English. No code, no APIs to wire up.",
    Mockup: WizardMockup,
  },
  {
    num: "02",
    title: "Upload Your Business Data",
    desc: "Add PDFs, documents, your website URL, FAQs — anything your customers ask about. Your AI learns from YOUR data so it answers like an employee who actually works at your company.",
    Mockup: DashboardMockup,
  },
  {
    num: "03",
    title: "Embed Anywhere in 1 Click",
    desc: "Copy a single line of code (or use our WordPress / React / Shopify integrations) and your AI assistant is live on your website, ready to help customers 24/7.",
    Mockup: WidgetMockup,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-[#FFF5F0] py-20 md:py-28 px-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-16">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
            How It Works
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
            From Idea to Live AI in 30 Minutes
          </motion.h2>
          <motion.p variants={fadeUp} custom={2}
            className="text-[15px] text-[#888] max-w-xl mx-auto">
            Three simple steps. Zero coding. Built for non-technical founders and teams.
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-6 md:p-10 rounded-3xl bg-white border border-[#f0ebe6] hover:shadow-xl hover:shadow-[#E8613C]/5 transition-all duration-300"
            >
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#FDEAE3] text-[#E8613C] text-[13px] font-bold mb-4">
                  {s.num}
                </span>
                <h3 className="text-[22px] md:text-[26px] font-bold text-[#1a1a2e] mb-3">{s.title}</h3>
                <p className="text-[14px] text-[#888] leading-relaxed">{s.desc}</p>
              </div>
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <s.Mockup />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
