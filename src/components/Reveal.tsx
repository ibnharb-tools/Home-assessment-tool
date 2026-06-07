"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay in seconds before this element animates in. */
  delay?: number;
  /** Slide distance in px. */
  y?: number;
  className?: string;
  /** Animate on mount instead of on scroll into view. */
  onMount?: boolean;
  as?: "div" | "section" | "li" | "span";
}

const makeVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
});

/**
 * Fade + slide-up reveal. Defaults to animating when scrolled into view
 * (whileInView). Set `onMount` for hero elements that should animate on load.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  onMount = false,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  const variants = makeVariants(y);

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-80px" } })}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
