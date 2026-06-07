"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  /** Decimal places to display. */
  decimals?: number;
  /** Prefix (e.g. "$") and suffix (e.g. " kWh"). */
  prefix?: string;
  suffix?: string;
  /** Animation duration in seconds. */
  duration?: number;
  /** Use thousands separators. */
  separator?: boolean;
  className?: string;
}

/**
 * Counts up from 0 to `value` when scrolled into view. Used for hero stats
 * and energy figures. Renders monospace-friendly formatted text.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  separator = true,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    const fixed = Number(latest.toFixed(decimals));
    const formatted = separator
      ? new Intl.NumberFormat("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(fixed)
      : fixed.toFixed(decimals);
    return `${prefix}${formatted}${suffix}`;
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, value, count, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  );
}
