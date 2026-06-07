"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100. */
  value: number;
  className?: string;
  showGlow?: boolean;
}

/** Animated energy-gradient progress bar used by the questionnaire. */
export function ProgressBar({ value, className, showGlow = true }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface",
        className
      )}
    >
      <motion.div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full bg-gradient-energy",
          showGlow &&
            "shadow-[0_0_16px_color-mix(in_srgb,var(--energy-primary)_50%,transparent)]"
        )}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
