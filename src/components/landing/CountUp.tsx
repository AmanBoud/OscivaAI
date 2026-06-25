import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Counts a number up from 0 to `value` the first time it scrolls into view.
 * Keeps an optional prefix/suffix, fixed decimals, and en-IN grouping
 * (1,999). Renders the final value instantly under reduced motion.
 */
export default function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  group = false,
  duration = 1.8,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  group?: boolean;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setN(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);

  const fixed = decimals > 0 ? Number(n.toFixed(decimals)) : Math.round(n);
  const text = group
    ? fixed.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : fixed.toFixed(decimals);

  return (
    <span ref={ref}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
