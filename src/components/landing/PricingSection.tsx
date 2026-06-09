import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

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
    features: [
      "1 AI agent",
      "500 messages / month",
      "Basic knowledge base (5MB)",
      "GPT-4o Mini only",
      "Basic analytics",
      "Community support",
      "Osciva branding on widget",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    monthly: 999,
    yearly: 799,
    desc: "Perfect for solo founders and small teams getting started",
    features: [
      "3 AI agents",
      "10,000 messages / month",
      "1 knowledge base per agent (25MB)",
      "GPT-4o Mini & Gemini Flash",
      "Basic analytics",
      "Email support",
      "Osciva branding on widget",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Growth",
    monthly: 1999,
    yearly: 1599,
    desc: "For growing businesses ready to scale AI",
    features: [
      "10 AI agents",
      "25,000 messages / month",
      "50MB knowledge base per agent",
      "GPT-4o & Gemini Pro",
      "Custom branding (remove Osciva badge)",
      "Advanced analytics",
      "Priority email support",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    monthly: "custom",
    yearly: "custom",
    desc: "For large-scale, mission-critical deployments",
    features: [
      "Unlimited agents",
      "Unlimited messages",
      "Dedicated infrastructure",
      "SSO / SAML",
      "Custom AI model fine-tuning",
      "SLA guarantee",
      "Dedicated account manager",
      "On-premise option",
      "Invoice billing with GST",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function PricingSection() {
  const navigate = useNavigate();
  const [yearly, setYearly] = useState(false);

  const formatPrice = (p: Plan) => {
    const v = yearly ? p.yearly : p.monthly;
    if (v === "custom") return "Custom";
    if (v === 0) return "Free";
    return `₹${v.toLocaleString("en-IN")}`;
  };

  return (
    <section id="pricing" className="bg-[#FFF5F0] py-20 md:py-28 px-6">
      <div className="max-w-[1000px] mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="text-center mb-10">
          <motion.span variants={fadeUp} custom={0}
            className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FDEAE3] text-[12px] font-semibold text-[#E8613C] uppercase tracking-wider mb-4">
            Pricing
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1}
            className="text-[30px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#1a1a2e] mb-3">
            Simple, Transparent Pricing
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-[15px] text-[#888] max-w-md mx-auto mb-8">
            Start free. Scale as you grow. No hidden fees. INR pricing with GST invoices.
          </motion.p>

          {/* Toggle */}
          <motion.div variants={fadeUp} custom={3} className="inline-flex items-center gap-3 p-1.5 bg-white rounded-full border border-[#f0ebe6] shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                !yearly ? "bg-[#1a1a2e] text-white" : "text-[#888]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all flex items-center gap-2 ${
                yearly ? "bg-[#1a1a2e] text-white" : "text-[#888]"
              }`}
            >
              Yearly
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${yearly ? "bg-[#E8613C] text-white" : "bg-[#FDEAE3] text-[#E8613C]"}`}>
                SAVE 20%
              </span>
            </button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp} custom={i}
              className={`rounded-3xl border p-7 transition-all duration-300 ${
                plan.popular
                  ? "border-[#E8613C] bg-[#1a1a2e] text-white shadow-2xl shadow-[#E8613C]/15 scale-[1.03] relative"
                  : "border-[#f0ebe6] bg-white hover:shadow-lg hover:shadow-[#E8613C]/5"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#E8613C] text-white text-[11px] font-bold tracking-wide">
                  MOST POPULAR
                </span>
              )}
              <h3 className={`text-[17px] font-bold mb-1 ${plan.popular ? "text-white" : "text-[#1a1a2e]"}`}>{plan.name}</h3>
              <p className={`text-[12px] mb-4 ${plan.popular ? "text-white/60" : "text-[#888]"}`}>{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`text-[36px] font-extrabold ${plan.popular ? "text-white" : "text-[#1a1a2e]"}`}>{formatPrice(plan)}</span>
                {plan.monthly !== "custom" && (
                  <span className={`text-[14px] ${plan.popular ? "text-white/60" : "text-[#888]"}`}>/mo</span>
                )}
              </div>
              <div className={`text-[11px] mb-5 h-4 ${plan.popular ? "text-white/50" : "text-[#999]"}`}>
                {yearly && plan.monthly !== "custom" && plan.monthly !== 0 ? `Billed ₹${((plan.yearly as number) * 12).toLocaleString("en-IN")} / year` : ""}
              </div>
              <button
                onClick={() => navigate(plan.cta === "Contact Sales" ? "/auth" : "/auth")}
                className={`w-full py-3 rounded-full text-[14px] font-semibold transition-all mb-6 ${
                  plan.popular
                    ? "bg-[#E8613C] text-white hover:bg-[#d4522f] shadow-lg shadow-[#E8613C]/30"
                    : "bg-[#1a1a2e] text-white hover:bg-[#2a2a3e]"
                }`}
              >
                {plan.cta}
              </button>
              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2.5 text-[13px] ${plan.popular ? "text-[#ccc]" : "text-[#666]"}`}>
                    <Check size={15} className={`mt-0.5 shrink-0 ${plan.popular ? "text-[#E8613C]" : "text-[#4CAF50]"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
