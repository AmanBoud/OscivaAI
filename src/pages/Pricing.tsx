import { Fragment } from "react";
import { Check, Minus, ShieldCheck, RefreshCw, Headphones } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import { Reveal, SectionHeading } from "@/components/landing/_primitives";

const planNames = ["Free", "Starter", "Growth", "Enterprise"];

type Row = { label: string; values: (string | boolean)[] };
const rows: { group: string; items: Row[] }[] = [
  {
    group: "Core",
    items: [
      { label: "AI agents", values: ["1", "3", "10", "Unlimited"] },
      { label: "Messages / month", values: ["500", "10,000", "25,000", "Unlimited"] },
      { label: "Knowledge base size", values: ["5 MB", "25 MB", "50 MB", "Custom"] },
      { label: "Models", values: ["GPT-4o Mini", "+ Gemini Flash", "GPT-4o & Gemini Pro", "All + fine-tuning"] },
    ],
  },
  {
    group: "Features",
    items: [
      { label: "Analytics & transcripts", values: ["Basic", "Basic", "Advanced", "Advanced"] },
      { label: "Remove Osciva badge", values: [false, false, true, true] },
      { label: "API access", values: [false, false, true, true] },
      { label: "Human handoff", values: [true, true, true, true] },
      { label: "20+ Indian languages", values: [true, true, true, true] },
    ],
  },
  {
    group: "Support & ops",
    items: [
      { label: "Support", values: ["Community", "Email", "Priority", "Dedicated manager"] },
      { label: "SSO / SAML", values: [false, false, false, true] },
      { label: "SLA guarantee", values: [false, false, false, true] },
      { label: "GST invoicing", values: [true, true, true, true] },
    ],
  },
];

const guarantees = [
  { icon: ShieldCheck, title: "No lock-in", desc: "Month-to-month billing. Cancel anytime, export your data whenever." },
  { icon: RefreshCw, title: "Switch plans freely", desc: "Upgrade or downgrade instantly as your volume changes." },
  { icon: Headphones, title: "Real human support", desc: "Talk to people who know the product — not a script." },
];

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check size={16} className="text-[#16A34A] mx-auto" />;
  if (v === false) return <Minus size={15} className="text-[#C7CDD6] mx-auto" />;
  return <span className="text-[13px] text-[#1F2733]">{v}</span>;
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="Pricing"
        badge="Transparent INR pricing"
        title="Pricing that scales"
        highlight="with you"
        subtitle="Start free, upgrade when you grow. Every plan includes GST invoices and India-hosted data — no hidden fees, ever."
        primaryCta={{ label: "Start free", to: "/auth" }}
        secondaryCta={{ label: "Talk to sales", to: "/contact" }}
      />

      {/* Plan cards (existing) */}
      <PricingSection />

      {/* Comparison table */}
      <section className="bg-[#F7F8FA] py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading eyebrow="Compare" title="Every feature, side by side" />

          <Reveal>
            <div className="mt-12 overflow-x-auto rounded-3xl border border-[#EBEDF0] bg-white shadow-sm">
              <table className="w-full min-w-[720px] border-collapse">
                <thead>
                  <tr className="border-b border-[#EBEDF0]">
                    <th className="text-left text-[13px] font-semibold text-[#586072] px-6 py-5 w-[28%]">Plan</th>
                    {planNames.map((n) => (
                      <th key={n} className={`text-center text-[14px] font-bold px-4 py-5 ${n === "Growth" ? "text-[#E8613C]" : "text-[#0B0E14]"}`}>
                        {n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((grp) => (
                    <Fragment key={grp.group}>
                      <tr className="bg-[#FBFBFC]">
                        <td colSpan={5} className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#A2AAB6]">
                          {grp.group}
                        </td>
                      </tr>
                      {grp.items.map((r) => (
                        <tr key={r.label} className="border-b border-[#F1F3F6] last:border-0">
                          <td className="px-6 py-3.5 text-[13.5px] text-[#586072]">{r.label}</td>
                          {r.values.map((v, i) => (
                            <td key={i} className={`text-center px-4 py-3.5 ${i === 2 ? "bg-[#FFF8F5]" : ""}`}>
                              <Cell v={v} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          {/* Guarantees */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {guarantees.map((g, i) => (
              <Reveal key={g.title} i={i}>
                <div className="h-full rounded-2xl border border-[#EBEDF0] bg-white p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#FFF1EC] flex items-center justify-center shrink-0">
                    <g.icon size={19} className="text-[#E8613C]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#0B0E14] mb-1.5">{g.title}</h3>
                    <p className="text-[13px] text-[#586072] leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}
