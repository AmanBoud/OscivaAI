import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";

const faqs = [
  { q: "What is Osciva AI?", a: "Osciva is a no-code platform to build, train and deploy AI assistants on your own data — no engineering required." },
  { q: "How long does setup take?", a: "Most businesses go live within 30 minutes: upload your data, configure the agent, embed the widget, done." },
  { q: "Which languages are supported?", a: "20+ languages including Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Malayalam and major international languages." },
  { q: "Is my data secure?", a: "Yes. Data is encrypted in transit and at rest, hosted on Indian servers, with DPDP-ready controls." },
  { q: "Can I integrate with existing tools?", a: "Slack, WhatsApp, Zendesk, Freshdesk, Shopify, WordPress, Razorpay and custom integrations via API and webhooks." },
  { q: "What happens when the AI can't answer?", a: "It hands off to a human agent with full conversation context, so your team picks up right where it left off." },
  { q: "Is there a free trial?", a: "Yes — start free with no credit card required, and upgrade when you're ready to scale." },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden py-20 md:py-28 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-cl" aria-hidden />
      <div className="relative z-10 max-w-[760px] mx-auto">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} i={i}>
                <div
                  className={`rounded-2xl border bg-white transition-all ${isOpen ? "border-[#E8613C]/30 shadow-sm" : "border-[#EBEDF0]"}`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-semibold text-[#0B0E14]">{faq.q}</span>
                    <span className={`shrink-0 grid place-items-center w-7 h-7 rounded-full border transition-all ${isOpen ? "bg-[#E8613C] border-[#E8613C] text-white rotate-45" : "border-[#E3E6EB] text-[#586072]"}`}>
                      <Plus size={15} />
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[14px] text-[#586072] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
