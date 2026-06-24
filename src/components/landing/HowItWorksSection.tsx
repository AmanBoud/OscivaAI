import { motion } from "framer-motion";
import { DashboardMockup, WizardMockup, WidgetMockup } from "./UIMockups";
import { Reveal, SectionHeading } from "./_primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    num: "01",
    title: "Configure your assistant",
    desc: "Use the point-and-click wizard to name your AI, set its personality, pick a model, and describe what it should do — all in plain English.",
    Mockup: WizardMockup,
  },
  {
    num: "02",
    title: "Upload your business data",
    desc: "Add PDFs, documents, your website URL and FAQs. Osciva indexes everything so the assistant answers like an employee who actually works at your company.",
    Mockup: DashboardMockup,
  },
  {
    num: "03",
    title: "Embed anywhere in one click",
    desc: "Copy a single snippet — or use the WordPress, React and Shopify integrations — and your assistant is live, helping customers 24/7.",
    Mockup: WidgetMockup,
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#F7F8FA] py-20 md:py-28 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-aurora-soft" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <SectionHeading
          eyebrow="How it works"
          title="From idea to live AI in three steps"
          subtitle="No coding. No glue work. Designed for non-technical founders and teams."
        />

        <div className="mt-16 space-y-6 lg:space-y-10">
          {steps.map((s, i) => {
            const flip = i % 2 === 1;
            return (
              <Reveal key={s.num} i={0}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center rounded-3xl border border-[#EBEDF0] bg-white p-6 md:p-10 shadow-sm">
                  <div className={flip ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center justify-center h-9 px-3 rounded-full bg-[#0B0E14] text-white text-[12px] font-bold tracking-wide">
                        STEP {s.num}
                      </span>
                      <span className="h-px flex-1 bg-gradient-to-r from-[#EBEDF0] to-transparent" />
                    </div>
                    <h3 className="text-[22px] md:text-[28px] font-extrabold text-[#0B0E14] display mb-3">{s.title}</h3>
                    <p className="text-[14.5px] text-[#586072] leading-relaxed max-w-md">{s.desc}</p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, ease: EASE }}
                    className={flip ? "lg:order-1" : ""}
                  >
                    <s.Mockup />
                  </motion.div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
