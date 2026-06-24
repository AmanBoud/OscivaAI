import { Clock, Boxes, MousePointerClick, ShieldCheck } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";

const reasons = [
  { icon: Clock, title: "Live in ~30 minutes", desc: "Upload your data, configure the assistant, embed one snippet. No setup hell, no engineering sprint." },
  { icon: Boxes, title: "Fits any business", desc: "Stores, clinics, institutes, SaaS, agencies, real estate — if you have customers, it fits in." },
  { icon: MousePointerClick, title: "Genuinely no-code", desc: "Built for founders and operators. If you can fill a form, you can ship an Osciva agent." },
  { icon: ShieldCheck, title: "Secure by default", desc: "Encryption in transit and at rest, India-hosted data, and DPDP-ready controls out of the box." },
];

export default function HighlightsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-aurora-soft" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <SectionHeading
          eyebrow="Why Osciva"
          title="The fastest path from data to a working AI agent"
          subtitle="Built for non-technical teams who want production-grade results without the production-grade complexity."
        />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => (
            <Reveal key={r.title} i={i}>
              <div className="group h-full rounded-2xl border border-[#EBEDF0] bg-white p-6 transition-all duration-300 hover:border-[#E8613C]/30 hover:shadow-premium hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-[#F7F8FA] border border-[#EBEDF0] flex items-center justify-center mb-5 transition-colors group-hover:bg-[#FFF1EC] group-hover:border-[#E8613C]/20">
                  <r.icon size={21} className="text-[#0B0E14] transition-colors group-hover:text-[#E8613C]" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0B0E14] mb-2">{r.title}</h3>
                <p className="text-[13.5px] text-[#586072] leading-relaxed">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
