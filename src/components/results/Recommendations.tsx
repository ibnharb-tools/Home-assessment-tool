"use client";

import { useMemo } from "react";
import { Sun, Wind, Thermometer, BatteryCharging, Check, type LucideIcon } from "lucide-react";
import type { Assessment, Recommendation } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { recomputeFromSelection } from "@/lib/recompute";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  "Solar PV": Sun,
  Wind: Wind,
  Geothermal: Thermometer,
  "Battery Storage": BatteryCharging,
};

export function Recommendations({
  assessment,
  selected,
  onToggle,
}: {
  assessment: Assessment;
  /** Currently-included technologies (drives the dashboard's what-if totals). */
  selected: ReadonlySet<string>;
  onToggle: (technology: string) => void;
}) {
  // Recommended first, then the rest.
  const sorted = [...assessment.recommendations].sort(
    (a, b) => Number(b.recommended) - Number(a.recommended)
  );

  // Marginal annual-savings contribution of each technology: the difference
  // between the plan with it included vs. the plan without it.
  const contributions = useMemo<Record<string, number>>(() => {
    const current = recomputeFromSelection(assessment, selected);
    return Object.fromEntries(
      assessment.recommendations.map((rec) => {
        const hypothetical = new Set(selected);
        if (selected.has(rec.technology)) {
          hypothetical.delete(rec.technology);
          const without = recomputeFromSelection(assessment, hypothetical);
          return [rec.technology, current.financial.annualSavings - without.financial.annualSavings];
        } else {
          hypothetical.add(rec.technology);
          const withTech = recomputeFromSelection(assessment, hypothetical);
          return [rec.technology, withTech.financial.annualSavings - current.financial.annualSavings];
        }
      })
    );
  }, [assessment, selected]);

  return (
    <Reveal>
      <div>
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          Your renewable roadmap
        </h2>
        <p className="mt-3 max-w-[60ch] text-ink-soft">
          We&apos;ve pre-selected what makes sense for your property. Toggle any
          technology to include or drop it; every figure below updates instantly.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {sorted.map((rec, i) => (
            <Reveal key={rec.technology} delay={(i % 2) * 0.08}>
              <RecCard
                rec={rec}
                active={selected.has(rec.technology)}
                onToggle={() => onToggle(rec.technology)}
                contribution={contributions[rec.technology] ?? 0}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function RecCard({
  rec,
  active,
  onToggle,
  contribution,
}: {
  rec: Recommendation;
  active: boolean;
  onToggle: () => void;
  contribution: number;
}) {
  const Icon = ICONS[rec.technology] ?? Sun;
  return (
    <Card
      padding="md"
      className={cn(
        "h-full transition-colors",
        active ? "border-energy-dim" : "opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-btn",
              active
                ? "bg-energy text-[var(--accent-ink)]"
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
              {rec.recommended
                ? `Recommended · ${rec.confidence} confidence`
                : "Not recommended for your property"}
            </p>
          </div>
        </div>

        {/* include/exclude toggle + delta badge */}
        <div className="mt-1 flex flex-col items-end gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={active}
            aria-label={`${active ? "Exclude" : "Include"} ${rec.technology}`}
            onClick={onToggle}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150",
              "focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy",
              active ? "bg-energy" : "bg-surface"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-elevated shadow-[var(--shadow-whisper)] transition-transform duration-150",
                active ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
          <DeltaBadge contribution={contribution} active={active} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-line py-4 sm:grid-cols-4">
        <Metric label="System" value={rec.systemSize || "—"} />
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

      <p className="mt-4 text-sm text-ink-soft">{rec.explanation}</p>
      {rec.placement && (
        <p className="mt-3 text-sm text-ink-faint">
          <span className="font-medium text-ink-soft">Placement: </span>
          {rec.placement}
        </p>
      )}

      {active && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-savings">
          <Check size={14} /> Included in your plan
        </p>
      )}
    </Card>
  );
}

function DeltaBadge({ contribution, active }: { contribution: number; active: boolean }) {
  if (contribution === 0) {
    return (
      <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs text-ink-faint">
        Resilience only
      </span>
    );
  }
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
        active ? "bg-savings/10 text-savings" : "bg-surface text-ink-soft"
      )}
      title={
        active
          ? `Removing this technology would reduce annual savings by ${formatCurrency(contribution)}`
          : `Adding this technology would increase annual savings by ${formatCurrency(contribution)}`
      }
    >
      {active ? "" : "+"}
      {formatCurrency(contribution)}/yr
    </span>
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
