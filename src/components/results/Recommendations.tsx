"use client";

import { Sun, Wind, Thermometer, BatteryCharging, Check, X, type LucideIcon } from "lucide-react";
import type { Assessment, Recommendation } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "Solar PV": Sun,
  Wind: Wind,
  Geothermal: Thermometer,
  "Battery Storage": BatteryCharging,
};

export function Recommendations({ assessment }: { assessment: Assessment }) {
  // Recommended first, then not-recommended (dimmed).
  const sorted = [...assessment.recommendations].sort(
    (a, b) => Number(b.recommended) - Number(a.recommended)
  );

  return (
    <Reveal>
      <div>
        <p className="caption text-energy">Recommendations</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          Your renewable roadmap
        </h2>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {sorted.map((rec, i) => (
            <Reveal key={rec.technology} delay={(i % 2) * 0.1}>
              <RecCard rec={rec} />
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function RecCard({ rec }: { rec: Recommendation }) {
  const Icon = ICONS[rec.technology] ?? Sun;
  return (
    <Card
      padding="md"
      glow={rec.recommended}
      className={cn(
        "h-full transition-opacity",
        !rec.recommended && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-btn",
              rec.recommended
                ? "bg-gradient-energy text-[var(--bg-deepest)]"
                : "bg-surface text-ink-faint"
            )}
          >
            <Icon size={20} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold">
              {rec.technology}
            </h3>
            <p className="caption text-ink-faint">
              {rec.confidence} confidence
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            rec.recommended
              ? "bg-savings/15 text-savings"
              : "bg-surface text-ink-faint"
          )}
        >
          {rec.recommended ? <Check size={13} /> : <X size={13} />}
          {rec.recommended ? "Recommended" : "Not now"}
        </span>
      </div>

      {rec.recommended && (
        <div className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4 sm:grid-cols-4">
          <Metric label="System" value={rec.systemSize} />
          <Metric label="Cost" value={formatCurrency(rec.estimatedCost)} />
          <Metric
            label="Production"
            value={
              rec.estimatedAnnualProduction
                ? `${formatNumber(rec.estimatedAnnualProduction)} kWh`
                : "—"
            }
          />
          <Metric
            label="Coverage"
            value={rec.coveragePercentage ? `${rec.coveragePercentage}%` : "—"}
          />
        </div>
      )}

      <p className={cn("text-sm text-ink-soft", rec.recommended ? "mt-4" : "mt-5")}>
        {rec.explanation}
      </p>
      {rec.placement && rec.recommended && (
        <p className="mt-3 text-sm text-ink-faint">
          <span className="font-medium text-ink-soft">Placement: </span>
          {rec.placement}
        </p>
      )}
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-sm font-semibold text-ink [overflow-wrap:anywhere]">
        {value}
      </p>
      <p className="caption mt-0.5 text-ink-faint">{label}</p>
    </div>
  );
}
