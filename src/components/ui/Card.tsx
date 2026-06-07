"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  /** Glass variant uses theme-aware frosted background. Solid uses bg-elevated. */
  variant?: "glass" | "solid";
  /** Adds a hover lift + shadow interaction. */
  interactive?: boolean;
  /** Adds a subtle energy glow. */
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
  variant = "glass",
  interactive = false,
  glow = false,
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <motion.div
      whileHover={
        interactive
          ? { y: -4, boxShadow: "0 16px 48px rgba(15,23,38,0.12)" }
          : undefined
      }
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "rounded-card",
        variant === "glass" ? "glass" : "bg-elevated border border-line",
        glow && "glow-energy",
        interactive && "cursor-pointer",
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
