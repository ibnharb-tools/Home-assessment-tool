"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /**
   * Default `solid` = bg-elevated + hairline border (the standard surface).
   * `glass` is reserved for true overlays (nav pill, modals).
   */
  variant?: "glass" | "solid";
  /** Subtle hover signal for clickable cards (border shift, no lift). */
  interactive?: boolean;
  /** Retained for API compatibility; now a no-op (glow removed in de-slop). */
  glow?: boolean;
  /** Padding preset. */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6 md:p-8", // 24px mobile / 32px desktop per spec
  lg: "p-8 md:p-10",
};

export function Card({
  children,
  variant = "solid",
  interactive = false,
  glow: _glow,
  padding = "md",
  className,
  ...props
}: CardProps) {
  void _glow;
  return (
    <motion.div
      className={cn(
        "rounded-card transition-colors duration-150",
        variant === "glass"
          ? "glass"
          : "bg-elevated border border-line shadow-[var(--shadow-whisper)]",
        // One restrained signal on interactive cards: border shifts to energy.
        interactive &&
          "cursor-pointer hover:border-energy-dim",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
