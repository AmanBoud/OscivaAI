import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";
import CountUp from "./CountUp";

type Tier = { name: string; note: string; popular: boolean; amount?: number; custom?: boolean };

const tiers: Tier[] = [
  { name: "Free", amount: 0, note: "1 agent, 500 msgs/mo", popular: false },
  { name: "Starter", amount: 999, note: "3 agents, 10k msgs/mo", popular: false },
  { name: "Growth", amount: 1999, note: "10 agents, 25k msgs/mo", popular: true },
  { name: "Enterprise", custom: true, note: "Unlimited everything", popular: false },
];

export default function HomePricing() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-tc" aria-hidden />
      <div className="relative z-10 max-w-[1100px] mx-auto">
        <SectionHeading
          title="Simple, transparent pricing"
          subtitle="Start free. Scale as you grow. INR pricing with GST invoices, no hidden fees."
        />

        <Reveal i={2}>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-px rounded-3xl overflow-hidden border border-[#EBEDF0] bg-[#EBEDF0]">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`p-6 sm:p-7 ${t.popular ? "bg-[#0B0E14] text-white" : "bg-white"}`}
              >
                <div className="flex items-center gap-2">
                  <h3 className={`text-[14px] font-bold ${t.popular ? "text-white" : "text-[#0B0E14]"}`}>{t.name}</h3>
                  {t.popular && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#E8613C] text-white">POPULAR</span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`display text-[28px] font-extrabold ${t.popular ? "text-white" : "text-[#0B0E14]"}`}>
                    {t.custom ? "Custom" : <CountUp prefix="₹" value={t.amount ?? 0} group />}
                  </span>
                  {!t.custom && (t.amount ?? 0) > 0 && (
                    <span className={`text-[12px] ${t.popular ? "text-white/50" : "text-[#8C94A1]"}`}>/mo</span>
                  )}
                </div>
                <p className={`mt-2 text-[12.5px] ${t.popular ? "text-white/60" : "text-[#586072]"}`}>{t.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-10 flex justify-center">
            <Link
              to="/pricing"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#0B0E14] hover:text-[#E8613C] transition-colors"
            >
              Compare all plans &amp; features
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
