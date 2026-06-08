"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface SelectableCardProps {
  label: string;
  description?: string;
  iconName?: string;
  selected: boolean;
  onSelect: () => void;
  /** Show a check badge when selected (used for multi-select). */
  multi?: boolean;
  className?: string;
}

/**
 * Selectable card used throughout the questionnaire instead of dropdowns.
 * Full interactive states: default / hover / focus-visible / active /
 * selected. Keyboard-operable (button), with a visible focus ring.
 */
export function SelectableCard({
  label,
  description,
  iconName,
  selected,
  onSelect,
  multi = false,
  className,
}: SelectableCardProps) {
  return (
    <motion.button
      type="button"
      role={multi ? "checkbox" : "radio"}
      aria-checked={selected}
      onClick={onSelect}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-card border p-4 text-left",
        "min-h-[44px] transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60",
        selected
          ? "border-line-glow bg-surface glow-energy"
          : "border-line bg-elevated hover:border-energy-dim hover:bg-surface/60",
        className
      )}
    >
      {iconName && (
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-btn",
            selected ? "bg-gradient-energy text-[var(--bg-deepest)]" : "bg-surface text-energy"
          )}
        >
          <Icon name={iconName} size={20} />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink [overflow-wrap:anywhere]">
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block text-sm text-ink-faint">
            {description}
          </span>
        )}
      </span>
      {selected && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-energy text-[var(--bg-deepest)]"
        >
          <Check size={14} strokeWidth={3} />
        </motion.span>
      )}
    </motion.button>
  );
}
