import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "./_primitives";

const capabilities = [
  "Train on your own PDFs, docs & URLs",
  "Built-in analytics & transcripts",
  "Human handoff with full context",
  "20+ Indian languages",
  "One-line embed, any framework",
  "Your brand, colors and logo",
];

export default function HomeFeatures() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-bl" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <Reveal>
          <div>
            <h2 className="display text-[30px] sm:text-[36px] md:text-[42px] font-extrabold text-[#0B0E14] leading-tight">
              Everything you need. None of the complexity.
            </h2>
            <p className="mt-4 text-[15px] md:text-[16px] text-[#586072] leading-relaxed max-w-md">
              A complete AI assistant platform built for operators, not engineers. Here is a taste of what is in the box.
            </p>
            <Link
              to="/features"
              className="group mt-7 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0B0E14] text-white text-[14px] font-semibold hover:bg-[#1b2030] transition-colors"
            >
              Explore all features
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="rounded-3xl border border-[#EBEDF0] bg-white p-7 sm:p-8 shadow-sm">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {capabilities.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[14px] text-[#1F2733]">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-[#16A34A]/10 mt-0.5 shrink-0">
                    <Check size={13} className="text-[#16A34A]" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
