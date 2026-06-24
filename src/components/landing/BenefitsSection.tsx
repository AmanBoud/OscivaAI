import { Globe, Shield, Zap, MessageSquare, Eye, Users } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";

const benefits = [
  { icon: MessageSquare, title: "Personalized conversations", desc: "It remembers context, recognizes returning users, and answers on-brand using your data." },
  { icon: Zap, title: "Save 80% of support time", desc: "Automate repetitive questions, lead qualification and onboarding so your team focuses on what matters." },
  { icon: Globe, title: "Speak your customer's language", desc: "Hindi, Tamil, Telugu, Bengali, Kannada and 20+ more — built for India's diverse customers." },
  { icon: Shield, title: "Built for non-coders", desc: "Founders, marketers and support leads can build, edit and improve the assistant themselves." },
  { icon: Eye, title: "Know what's happening", desc: "Live conversation logs, top questions and resolution rate — see exactly how your AI performs." },
  { icon: Users, title: "Made for Indian business", desc: "INR pricing, GST invoices, India-hosted data and DPDP-ready controls." },
];

export default function BenefitsSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-tr" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <SectionHeading
          eyebrow="Outcomes"
          title="An assistant that works like your best employee"
          subtitle="Accurate, always-on, and on-brand — without the overhead of hiring and training."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-[#EBEDF0] bg-[#EBEDF0]">
          {benefits.map((b, i) => (
            <Reveal key={b.title} i={(i % 3)}>
              <div className="group h-full bg-white p-7 transition-colors hover:bg-[#FBFBFC]">
                <div className="w-11 h-11 rounded-xl bg-[#FFF1EC] flex items-center justify-center mb-4">
                  <b.icon size={20} className="text-[#E8613C]" />
                </div>
                <h3 className="text-[15.5px] font-bold text-[#0B0E14] mb-2">{b.title}</h3>
                <p className="text-[13.5px] text-[#586072] leading-relaxed">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
