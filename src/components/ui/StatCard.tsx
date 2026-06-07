"use client";

import { cn } from "@/lib/utils";
import { Card } from "./Card";
import { AnimatedNumber } from "./AnimatedNumber";
import type { LucideIcon } from "lucide-react";

type Accent = "energy" | "solar" | "wind" | "savings";

interface StatCardProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  icon?: LucideIcon;
  accent?: Accent;
  className?: string;
  /** Disable count-up animation (e.g. for static previews). */
  animate?: boolean;
}

const accentText: Record<Accent, string> = {
  energy: "text-energy",
  solar: "text-solar",
  wind: "text-wind",
  savings: "text-savings",
};

const accentGlow: Record<Accent, string> = {
  energy: "glow-energy",
  solar: "glow-solar",
  wind: "glow-wind",
  savings: "glow-energy",
};

const accentVar: Record<Accent, string> = {
  energy: "var(--energy-primary)",
  solar: "var(--solar)",
  wind: "var(--wind)",
  savings: "var(--savings)",
};

export function StatCard({
  label,
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  icon: Icon,
  accent = "energy",
  className,
  animate = true,
}: StatCardProps) {
  return (
    <Card padding="md" className={cn("relative overflow-hidden", className)}>
      {/* faint accent wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ background: accentVar[accent] }}
      />
      {Icon && (
        <div
          className={cn(
            "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-btn bg-surface",
            accentText[accent],
            accentGlow[accent]
          )}
        >
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
      <div
        className={cn(
          "font-mono font-bold tracking-tight",
          "text-3xl md:text-4xl",
          accentText[accent]
        )}
      >
        {animate ? (
          <AnimatedNumber
            value={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
          />
        ) : (
          <span>
            {prefix}
            {new Intl.NumberFormat("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            }).format(value)}
            {suffix}
          </span>
        )}
      </div>
      <p className="caption mt-2 text-ink-faint">{label}</p>
    </Card>
  );
}
