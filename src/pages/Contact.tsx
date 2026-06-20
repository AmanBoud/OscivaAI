import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MessageCircle, MapPin, Phone, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import FooterSection from "@/components/landing/FooterSection";
import PageHero from "@/components/landing/PageHero";
import { Reveal, SectionHeading } from "@/components/landing/_primitives";

const methods = [
  { icon: Mail, label: "Email us", value: "hello@osciva.io", sub: "We reply within 24 hours" },
  { icon: Phone, label: "Call us", value: "+91 98765 43210", sub: "Mon–Sat, 9am–7pm IST" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", sub: "Fastest way to reach us" },
  { icon: MapPin, label: "Visit", value: "Bengaluru, India", sub: "Koramangala, 560034" },
];

const reasons = [
  "Get a guided product walkthrough",
  "Discuss enterprise & volume pricing",
  "Ask about security, DPDP & data residency",
  "Explore custom integrations",
];

export default function ContactPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const fields = [
    { id: "name", label: "Your name", type: "text", placeholder: "Rahul Sharma" },
    { id: "email", label: "Work email", type: "email", placeholder: "rahul@company.com" },
    { id: "company", label: "Company (optional)", type: "text", placeholder: "Acme Inc." },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <PageHero
        breadcrumb="Contact"
        title="Let's talk about your"
        highlight="AI assistant"
        subtitle="Questions about the product, pricing, security or a custom rollout? Send a note and a real person will get back to you."
        primaryCta={null}
      />

      <section className="bg-white pb-12 px-5 sm:px-6">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">
          {/* Left: methods + reasons */}
          <div>
            <Reveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {methods.map((m) => (
                  <div key={m.label} className="rounded-2xl border border-[#EBEDF0] bg-white p-5 hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300">
                    <div className="w-11 h-11 rounded-xl bg-[#F7F8FA] border border-[#EBEDF0] flex items-center justify-center mb-4">
                      <m.icon size={19} className="text-[#E8613C]" />
                    </div>
                    <p className="text-[11px] font-semibold text-[#8C94A1] uppercase tracking-wider mb-1">{m.label}</p>
                    <p className="text-[14.5px] text-[#0B0E14] font-semibold">{m.value}</p>
                    <p className="text-[12px] text-[#8C94A1] mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal i={1}>
              <div className="mt-6 rounded-2xl border border-[#EBEDF0] bg-[#0B0E14] p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-[#E8613C]" />
                  <span className="text-[13px] font-semibold">What you can expect</span>
                </div>
                <ul className="space-y-3">
                  {reasons.map((r) => (
                    <li key={r} className="flex items-start gap-3 text-[13.5px] text-white/80">
                      <CheckCircle2 size={16} className="text-[#16A34A] mt-0.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal i={1}>
            <div className="rounded-3xl border border-[#EBEDF0] bg-white p-7 md:p-9 shadow-premium">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 size={30} className="text-[#16A34A]" />
                  </div>
                  <h3 className="text-[22px] font-extrabold text-[#0B0E14] mb-2 display">Message sent</h3>
                  <p className="text-[14px] text-[#586072] mb-7">Thanks — we'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 rounded-full bg-[#0B0E14] text-white text-[14px] font-semibold hover:bg-[#1b2030] transition-colors"
                  >
                    Back to home
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-[18px] font-extrabold text-[#0B0E14] display">Send us a message</h3>
                    <p className="text-[13px] text-[#8C94A1] mt-1">We'll route it to the right person on our team.</p>
                  </div>
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-[13px] font-semibold text-[#0B0E14] mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#E3E6EB] bg-[#FBFBFC] text-[14px] text-[#0B0E14] placeholder:text-[#A2AAB6] focus:outline-none focus:bg-white focus:border-[#E8613C]/50 focus:ring-4 focus:ring-[#E8613C]/10 transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0B0E14] mb-1.5">How can we help?</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us a bit about what you're building…"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E3E6EB] bg-[#FBFBFC] text-[14px] text-[#0B0E14] placeholder:text-[#A2AAB6] focus:outline-none focus:bg-white focus:border-[#E8613C]/50 focus:ring-4 focus:ring-[#E8613C]/10 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#E8613C] text-white text-[15px] font-semibold hover:bg-[#CF4F2C] transition-colors shadow-brand"
                  >
                    Send message
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-[11.5px] text-[#A2AAB6] text-center">
                    By submitting, you agree to our privacy policy. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Reassurance band */}
      <section className="bg-white pt-8 pb-24 px-5 sm:px-6">
        <div className="max-w-[1100px] mx-auto">
          <SectionHeading
            eyebrow="Prefer self-serve?"
            title="You don't have to wait to start"
            subtitle="Create your first agent free in minutes — no sales call required."
          />
          <Reveal>
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/auth")}
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#0B0E14] text-white text-[15px] font-semibold hover:bg-[#1b2030] transition-colors"
              >
                Start building free
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
