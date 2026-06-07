"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-btn select-none transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60 disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3", // ~16px / 16px 24px
  lg: "text-base px-8 py-4",
};

const variants: Record<Variant, string> = {
  // Energy gradient, dark text for contrast on the bright gradient.
  primary:
    "bg-gradient-energy text-[var(--bg-deepest)] font-semibold shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_28px_color-mix(in_srgb,var(--energy-primary)_45%,transparent)]",
  // Glass with energy outline.
  secondary:
    "glass text-energy border border-energy-dim hover:border-energy hover:shadow-[0_0_24px_color-mix(in_srgb,var(--energy-primary)_25%,transparent)]",
  // Minimal ghost link-button.
  ghost:
    "bg-transparent text-ink-soft hover:text-ink hover:bg-surface/60",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
