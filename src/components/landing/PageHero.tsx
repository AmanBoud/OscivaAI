import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
const up = (d: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: EASE },
});

/**
 * Distinctive, premium hero band for every marketing sub-page.
 * Replaces the bare orange eyebrow that used to sit at the top.
 */
export default function PageHero({
  breadcrumb,
  badge,
  title,
  highlight,
  subtitle,
  primaryCta = { label: "Start building free", to: "/auth" },
  secondaryCta,
  children,
}: {
  breadcrumb: string;
  badge?: string;
  title: string;
  highlight?: string;
  subtitle: string;
  primaryCta?: { label: string; to: string } | null;
  secondaryCta?: { label: string; to: string } | null;
  children?: ReactNode;
}) {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-white pt-[130px] pb-16 md:pt-[160px] md:pb-20 px-5 sm:px-6">
      <div className="absolute inset-0 bg-grid mask-fade-b opacity-[0.5]" aria-hidden />
      <div className="absolute inset-0 bg-mesh" aria-hidden />
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[1000px] h-[460px] rounded-full bg-[#E8613C]/[0.07] blur-[130px]" aria-hidden />
      <div className="absolute -top-24 right-[12%] w-72 h-72 rounded-full bg-[#2563EB]/[0.05] blur-[100px] animate-float" aria-hidden />

      <div className="relative max-w-[820px] mx-auto text-center">
        <motion.nav {...up(0)} className="flex items-center justify-center gap-1.5 text-[12.5px] text-[#8C94A1] mb-6">
          <button onClick={() => navigate("/")} className="hover:text-[#0B0E14] transition-colors">Home</button>
          <ChevronRight size={13} />
          <span className="text-[#586072] font-medium">{breadcrumb}</span>
        </motion.nav>

        {badge && (
          <motion.div {...up(0.05)} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EBEDF0] bg-white/70 backdrop-blur shadow-sm mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E8613C]" />
            <span className="text-[12.5px] font-medium text-[#586072]">{badge}</span>
          </motion.div>
        )}

        <motion.h1 {...up(0.1)} className="display text-[36px] sm:text-[46px] md:text-[56px] font-extrabold text-[#0B0E14]">
          {title}
          {highlight && (
            <>
              {" "}
              <span className="text-[#E8613C]">{highlight}</span>
            </>
          )}
        </motion.h1>

        <motion.p {...up(0.18)} className="mt-5 text-[16px] md:text-[17px] leading-relaxed text-[#586072] max-w-xl mx-auto">
          {subtitle}
        </motion.p>

        {(primaryCta || secondaryCta) && (
          <motion.div {...up(0.26)} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {primaryCta && (
              <button
                onClick={() => navigate(primaryCta.to)}
                className="group w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#E8613C] text-white text-[15px] font-semibold hover:bg-[#CF4F2C] transition-colors shadow-brand"
              >
                {primaryCta.label}
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            )}
            {secondaryCta && (
              <button
                onClick={() => navigate(secondaryCta.to)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-[#E3E6EB] bg-white text-[15px] font-semibold text-[#0B0E14] hover:bg-[#F7F8FA] transition-colors"
              >
                {secondaryCta.label}
              </button>
            )}
          </motion.div>
        )}

        {children && <motion.div {...up(0.34)}>{children}</motion.div>}
      </div>
    </section>
  );
}
