import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Reveal, SectionHeading } from "./_primitives";

const steps = [
  { num: "01", title: "Configure your assistant", desc: "Name it, set its personality and pick a model in a point-and-click wizard." },
  { num: "02", title: "Upload your business data", desc: "Add PDFs, docs, your website URL and FAQs. Osciva indexes it all automatically." },
  { num: "03", title: "Embed anywhere in one click", desc: "Copy one snippet, or use the WordPress, Shopify and React integrations." },
];

export default function HomeHowItWorks() {
  const reduce = useReducedMotion();
  // `active` is the card shown in the centre (and highlighted). It cycles, and
  // the other two slide out to the sides, dimmed.
  const [active, setActive] = useState(1);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setActive((i) => (i + 1) % steps.length), 3600);
    return () => clearInterval(id);
  }, [reduce, paused]);

  // Render order: previous on the left, active in the middle, next on the right.
  const order = [
    (active + steps.length - 1) % steps.length,
    active,
    (active + 1) % steps.length,
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-20 px-5 sm:px-6">
      <div className="absolute inset-0 z-0 bg-glow-tc" aria-hidden />
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <SectionHeading
          title="From idea to live AI in three steps"
          subtitle="No coding, no glue work. Built for non-technical founders and teams."
        />

        <Reveal>
          <div
            className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {order.map((idx, pos) => {
              const s = steps[idx];
              const on = reduce || pos === 1; // the centre card is highlighted
              return (
                <motion.button
                  key={s.num}
                  layout
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  onFocus={() => setActive(idx)}
                  className={`block w-full text-left h-full rounded-2xl border p-7 bg-white transition-[opacity,box-shadow,border-color] duration-500 ${
                    on
                      ? "border-[#E8613C]/40 shadow-premium opacity-100"
                      : "border-[#EBEDF0] opacity-40"
                  }`}
                >
                  <span
                    className={`display text-[40px] font-extrabold leading-none transition-colors duration-500 ${
                      on ? "text-[#E8613C]" : "text-[#C7CDD6]"
                    }`}
                  >
                    {s.num}
                  </span>
                  <h3 className="mt-3 text-[17px] font-bold text-[#0B0E14]">{s.title}</h3>
                  <p className="mt-2 text-[13.5px] text-[#586072] leading-relaxed">{s.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-10 flex justify-center">
            <Link
              to="/how-it-works"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold text-[#0B0E14] hover:text-[#E8613C] transition-colors"
            >
              See the full walkthrough
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
