import { ShoppingBag, GraduationCap, HeartPulse, Building2, Briefcase, Home, X, Check } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import { Reveal, SectionHeading } from "@/components/landing/_primitives";

const useCases = [
  { icon: ShoppingBag, title: "E-commerce", desc: "Order tracking, returns, product Q&A and cart recovery.", ex: "“Where is my order #4821?”" },
  { icon: GraduationCap, title: "Education", desc: "Admissions, course details, fees and student support.", ex: "“What's the fee for the BCA program?”" },
  { icon: HeartPulse, title: "Healthcare", desc: "Appointments, departments, doctors and reports.", ex: "“Book a cardiology appointment for Friday.”" },
  { icon: Building2, title: "Real estate", desc: "Listings, site visits, pricing and EMI questions.", ex: "“Show 3BHK flats under ₹80L in Whitefield.”" },
  { icon: Briefcase, title: "SaaS & startups", desc: "Onboarding, docs, billing and tier-1 support.", ex: "“How do I reset my API key?”" },
  { icon: Home, title: "Local services", desc: "Bookings, quotes, hours and FAQs for any business.", ex: "“Are you open this Sunday?”" },
];

const compare = [
  { old: "Weeks of developer time and API wiring", neu: "Live in about 30 minutes, no code" },
  { old: "Generic bot that makes up answers", neu: "Grounded in your real documents" },
  { old: "Expensive per-seat support tooling", neu: "Transparent INR pricing, GST invoices" },
  { old: "English-only, rigid scripts", neu: "20+ Indian languages, natural replies" },
  { old: "No visibility into conversations", neu: "Full transcripts and analytics built in" },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="How it works"
        badge="From zero to live"
        title="Launch a real AI agent in"
        highlight="three steps"
        subtitle="No engineering team, no integrations to maintain. Configure, train on your data, and embed — that's the whole process."
        secondaryCta={{ label: "View pricing", to: "/pricing" }}
      />

      {/* Existing 3-step section */}
      <HowItWorksSection />

      {/* Use cases */}
      <section className="bg-white py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-[1200px] mx-auto">
          <SectionHeading
            eyebrow="Use cases"
            title="One platform, every kind of business"
            subtitle="If you have customers with questions, Osciva fits in. Here's what teams build."
          />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((u, i) => (
              <Reveal key={u.title} i={i % 3}>
                <div className="group h-full rounded-2xl border border-[#EBEDF0] bg-white p-6 transition-all duration-300 hover:border-[#0EC2A8]/30 hover:shadow-premium hover:-translate-y-1">
                  <div className="w-11 h-11 rounded-xl bg-[#F7F8FA] border border-[#EBEDF0] flex items-center justify-center mb-4 transition-colors group-hover:bg-[#FFF1EC] group-hover:border-[#0EC2A8]/20">
                    <u.icon size={19} className="text-[#0B0E14] transition-colors group-hover:text-[#0EC2A8]" />
                  </div>
                  <h3 className="text-[15.5px] font-bold text-[#0B0E14] mb-1.5">{u.title}</h3>
                  <p className="text-[13px] text-[#586072] leading-relaxed mb-4">{u.desc}</p>
                  <div className="text-[12.5px] text-[#586072] bg-[#F7F8FA] border border-[#EBEDF0] rounded-lg px-3 py-2 italic">{u.ex}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Before / after comparison */}
      <section className="bg-[#F7F8FA] py-20 md:py-28 px-5 sm:px-6">
        <div className="max-w-[1000px] mx-auto">
          <SectionHeading eyebrow="Why teams switch" title="The old way vs. the Osciva way" />
          <Reveal>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-[#EBEDF0] bg-white p-7">
                <h3 className="text-[15px] font-bold text-[#8C94A1] mb-5">The old way</h3>
                <ul className="space-y-4">
                  {compare.map((c) => (
                    <li key={c.old} className="flex items-start gap-3 text-[14px] text-[#586072]">
                      <span className="grid place-items-center w-5 h-5 rounded-full bg-[#EF4444]/10 mt-0.5 shrink-0">
                        <X size={12} className="text-[#EF4444]" />
                      </span>
                      {c.old}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-[#0EC2A8]/30 bg-[#0B0E14] p-7 shadow-premium">
                <h3 className="text-[15px] font-bold text-white mb-5">With Osciva</h3>
                <ul className="space-y-4">
                  {compare.map((c) => (
                    <li key={c.neu} className="flex items-start gap-3 text-[14px] text-white/85">
                      <span className="grid place-items-center w-5 h-5 rounded-full bg-[#16A34A]/20 mt-0.5 shrink-0">
                        <Check size={12} className="text-[#16A34A]" />
                      </span>
                      {c.neu}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
      <FooterSection />
    </div>
  );
}
