import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Check } from "lucide-react";
import { Reveal, SectionHeading } from "./_primitives";

type Plan = {
  name: string;
  monthly: number | "custom";
  yearly: number | "custom";
  desc: string;
  features: string[];
  cta: string;
  popular: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    desc: "Get started with no credit card required",
    features: ["1 AI agent", "500 messages / month", "Knowledge base (5MB)", "GPT-4o Mini", "Basic analytics", "Community support"],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Starter",
    monthly: 999,
    yearly: 799,
    desc: "For solo founders and small teams",
    features: ["3 AI agents", "10,000 messages / month", "25MB per agent", "GPT-4o Mini & Gemini Flash", "Basic analytics", "Email support"],
    cta: "Start free trial",
    popular: false,
  },
  {
    name: "Growth",
    monthly: 1999,
    yearly: 1599,
    desc: "For growing businesses scaling AI",
    features: ["10 AI agents", "25,000 messages / month", "50MB per agent", "GPT-4o & Gemini Pro", "Remove Osciva badge", "Advanced analytics", "Priority support", "API access"],
    cta: "Start free trial",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: "custom",
    yearly: "custom",
    desc: "For large-scale, mission-critical use",
    features: ["Unlimited agents", "Unlimited messages", "Dedicated infra", "SSO / SAML", "Custom fine-tuning", "SLA guarantee", "Dedicated manager", "GST invoicing"],
    cta: "Contact sales",
    popular: false,
  },
];

export default function PricingSection() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  const price = (p: Plan) => {
    const v = yearly ? p.yearly : p.monthly;
    if (v === "custom") return "Custom";
    if (v === 0) return "Free";
    return `₹${v.toLocaleString("en-IN")}`;
  };

  return (
    <section id="pricing" className="bg-white py-20 md:py-28 px-5 sm:px-6">
      <div className="max-w-[1180px] mx-auto">
        <SectionHeading
          title="Simple, transparent pricing"
          subtitle="Start free. Scale as you grow. INR pricing with GST invoices — no hidden fees."
        />

        <Reveal i={3}>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-1 p-1 bg-[#F2F4F7] rounded-full border border-[#EBEDF0]">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${!yearly ? "bg-white text-[#0B0E14] shadow-sm" : "text-[#8C94A1]"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${yearly ? "bg-white text-[#0B0E14] shadow-sm" : "text-[#8C94A1]"}`}
              >
                Yearly
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#FFF1EC] text-[#E8613C]">SAVE 20%</span>
              </button>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} i={i}>
              <div
                className={`relative h-full rounded-3xl p-7 flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#0B0E14] text-white shadow-premium ring-1 ring-[#E8613C]/40"
                    : "bg-white border border-[#EBEDF0] hover:shadow-premium hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#E8613C] text-white text-[11px] font-bold tracking-wide shadow-brand">
                    MOST POPULAR
                  </span>
                )}
                <h3 className={`text-[16px] font-bold ${plan.popular ? "text-white" : "text-[#0B0E14]"}`}>{plan.name}</h3>
                <p className={`text-[12px] mt-1 mb-5 ${plan.popular ? "text-white/55" : "text-[#8C94A1]"}`}>{plan.desc}</p>

                <div className="flex items-baseline gap-1">
                  <span className={`text-[34px] font-extrabold display ${plan.popular ? "text-white" : "text-[#0B0E14]"}`}>{price(plan)}</span>
                  {plan.monthly !== "custom" && plan.monthly !== 0 && (
                    <span className={`text-[13px] ${plan.popular ? "text-white/50" : "text-[#8C94A1]"}`}>/mo</span>
                  )}
                </div>
                <div className={`text-[11px] h-4 mb-5 ${plan.popular ? "text-white/45" : "text-[#A2AAB6]"}`}>
                  {yearly && typeof plan.yearly === "number" && plan.yearly > 0 ? `Billed ₹${(plan.yearly * 12).toLocaleString("en-IN")}/yr` : ""}
                </div>

                <button
                  onClick={() => navigate("/auth")}
                  className={`w-full py-3 rounded-full text-[14px] font-semibold transition-all mb-6 ${
                    plan.popular
                      ? "bg-[#E8613C] text-white hover:bg-[#CF4F2C] shadow-brand"
                      : "bg-[#0B0E14] text-white hover:bg-[#1b2030]"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="space-y-3 mt-auto">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2.5 text-[13px] ${plan.popular ? "text-white/80" : "text-[#586072]"}`}>
                      <Check size={15} className={`mt-0.5 shrink-0 ${plan.popular ? "text-[#E8613C]" : "text-[#16A34A]"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
