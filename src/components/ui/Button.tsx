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
  "inline-flex items-center justify-center gap-2 font-medium rounded-btn select-none whitespace-nowrap min-h-[44px] transition-colors duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy disabled:opacity-55 disabled:cursor-not-allowed disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2 min-h-[40px]",
  md: "text-base px-6 py-3",
  lg: "text-base px-7 py-3.5",
};

const variants: Record<Variant, string> = {
  // Solid energy fill, dark accent-ink text (contrast-checked). No glow.
  primary:
    "bg-energy text-[var(--accent-ink)] font-semibold hover:bg-energy-bright",
  // Outlined hairline, energy text. No glass, no glow.
  secondary:
    "bg-transparent text-energy border border-energy-dim hover:border-energy hover:bg-surface/50",
  // Minimal ghost link-button.
  ghost: "bg-transparent text-ink-soft hover:text-ink hover:bg-surface/60",
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
      whileTap={{ scale: props.disabled ? 1 : 0.99 }}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
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
