"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";

interface Option<T extends string> {
  id: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}

/**
 * Segmented control with an animated sliding highlight. Used for toggles
 * (Own/Rent, unit) and usage frequency selection.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = "md",
  className,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const layoutId = useId();
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full rounded-btn border border-line bg-surface p-1",
        className
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative flex-1 rounded-[9px] text-center font-medium transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60",
              size === "sm" ? "px-2 py-1.5 text-sm" : "px-3 py-2.5 text-sm",
              active ? "text-[var(--bg-deepest)]" : "text-ink-soft hover:text-ink"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${layoutId}`}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 -z-10 rounded-[9px] bg-gradient-energy"
              />
            )}
            <span className="relative whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
