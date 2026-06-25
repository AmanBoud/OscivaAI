import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import CTASection from "@/components/landing/CTASection";
import { Reveal, SectionHeading } from "@/components/landing/_primitives";

const stats = [
  { value: "500+", label: "Businesses building on Osciva" },
  { value: "10M+", label: "Messages handled" },
  { value: "20+", label: "Indian languages supported" },
  { value: "India", label: "Where your data stays" },
];

const values = [
  { title: "Operators first", desc: "We build for founders, marketers and support leads, not just engineers. If you can fill a form, you can ship an agent." },
  { title: "Grounded answers", desc: "Every reply comes from your real data. We would rather an agent say it does not know than make something up." },
  { title: "India by default", desc: "INR pricing, GST invoices, India-hosted data and native support for the languages your customers actually speak." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="About"
        title="We are making AI useful for"
        highlight="every Indian business"
        subtitle="Osciva is the no-code platform to build, train and deploy AI assistants on your own data. Our goal is simple: put a capable AI teammate within reach of any business, without an engineering team."
        primaryCta={{ label: "Start building free", to: "/auth" }}
        secondaryCta={{ label: "See how it works", to: "/how-it-works" }}
      />

      <section className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
        <div className="absolute inset-0 z-0 bg-glow-bl" aria-hidden />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-[#0B0E14] p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[28px] md:text-[38px] font-extrabold text-white display">{s.value}</div>
                    <div className="text-[12.5px] text-white/55 font-medium mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 md:py-16 px-5 sm:px-6">
        <div className="absolute inset-0 z-0 bg-glow-tr" aria-hidden />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <SectionHeading title="What we believe" subtitle="The principles that shape how we build the product." />
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <Reveal key={v.title} i={i}>
                <div className="h-full rounded-2xl border border-[#EBEDF0] bg-white p-7">
                  <h3 className="text-[16px] font-bold text-[#0B0E14] mb-2">{v.title}</h3>
                  <p className="text-[13.5px] text-[#586072] leading-relaxed">{v.desc}</p>
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
