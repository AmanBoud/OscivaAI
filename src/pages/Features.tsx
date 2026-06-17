import { motion } from "framer-motion";
import { Check, Lock, Server, FileCheck2, KeyRound } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import { Reveal, SectionHeading } from "@/components/landing/_primitives";
import { WizardMockup, DashboardMockup, WidgetMockup } from "@/components/landing/UIMockups";

const EASE = [0.22, 1, 0.36, 1] as const;

const deepDive = [
  {
    tag: "Knowledge",
    title: "Answers grounded in your real content",
    desc: "Upload PDFs, docs, spreadsheets, your website URL and FAQs. Osciva chunks and embeds everything into a private vector index, so every reply is retrieved from your data — never hallucinated.",
    points: ["PDF, DOCX, CSV, URL & raw text", "Automatic re-indexing on update", "Per-agent isolated knowledge base"],
    Mockup: WizardMockup,
  },
  {
    tag: "Insight",
    title: "See exactly how your AI performs",
    desc: "Every conversation is logged with full transcripts. Track message volume, top questions and resolution rate from a clean dashboard — no Google Analytics setup, no spreadsheets.",
    points: ["Live conversation transcripts", "Top questions & resolution rate", "Per-agent usage breakdown"],
    Mockup: DashboardMockup,
  },
  {
    tag: "Deploy",
    title: "Live on any site in one snippet",
    desc: "Copy one line of code, or use the WordPress, Shopify and React integrations. The widget is fully themable to your brand and streams replies token-by-token like a human typing.",
    points: ["One-line embed, any framework", "Brand colors, logo & welcome message", "Streaming replies in real time"],
    Mockup: WidgetMockup,
  },
];

const security = [
  { icon: Lock, title: "Encrypted everywhere", desc: "TLS in transit and encryption at rest for all data and knowledge bases." },
  { icon: Server, title: "Hosted in India", desc: "Your data stays on Indian infrastructure to meet local residency needs." },
  { icon: FileCheck2, title: "DPDP ready", desc: "Controls and data handling aligned with India's DPDP Act." },
  { icon: KeyRound, title: "Bring your own key", desc: "Use your own LLM provider key — it's stored server-side, never exposed to visitors." },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="Features"
        badge="The complete platform"
        title="Everything you need to ship a"
        highlight="production AI agent"
        subtitle="From private knowledge bases to live analytics and one-line embedding — Osciva covers the whole journey, without a single line of glue code."
        secondaryCta={{ label: "See how it works", to: "/how-it-works" }}
      />

      {/* Deep-dive alternating rows */}
      <section className="bg-white py-12 md:py-16 px-5 sm:px-6">
        <div className="max-w-[1200px] mx-auto space-y-16 md:space-y-24">
          {deepDive.map((d, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={d.title} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <Reveal className={flip ? "lg:order-2" : ""}>
                  <div>
                    <span className="eyebrow text-[#E8613C]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E8613C]" />
                      {d.tag}
                    </span>
                    <h3 className="display mt-4 text-[26px] md:text-[34px] font-extrabold text-[#0B0E14]">{d.title}</h3>
                    <p className="mt-4 text-[15px] text-[#586072] leading-relaxed max-w-md">{d.desc}</p>
                    <ul className="mt-6 space-y-3">
                      {d.points.map((p) => (
                        <li key={p} className="flex items-center gap-3 text-[14px] text-[#1F2733]">
                          <span className="grid place-items-center w-5 h-5 rounded-full bg-[#16A34A]/10">
                            <Check size={13} className="text-[#16A34A]" />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className={flip ? "lg:order-1" : ""}
                >
                  <d.Mockup />
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full capability grid + integrations (existing premium section) */}
      <FeaturesSection />

      {/* Security band */}
      <section className="bg-[#F7F8FA] py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading
            eyebrow="Security & compliance"
            title="Enterprise-grade by default"
            subtitle="The controls serious businesses expect — without an enterprise contract."
          />
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {security.map((s, i) => (
              <Reveal key={s.title} i={i}>
                <div className="h-full rounded-2xl border border-[#EBEDF0] bg-white p-6">
                  <div className="w-11 h-11 rounded-xl bg-[#0B0E14] flex items-center justify-center mb-4">
                    <s.icon size={19} className="text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0B0E14] mb-2">{s.title}</h3>
                  <p className="text-[13px] text-[#586072] leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <FooterSection />
    </div>
  );
}
