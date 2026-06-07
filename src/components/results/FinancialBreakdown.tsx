"use client";

import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { formatCurrency } from "@/lib/utils";

export function FinancialBreakdown({ assessment }: { assessment: Assessment }) {
  const f = assessment.financial;

  return (
    <Reveal>
      <Card padding="lg">
        <p className="caption text-energy">The numbers</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          Financial breakdown
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* itemized */}
          <div className="space-y-1">
            <Row label="Total system cost" value={formatCurrency(f.totalSystemCost)} />
            <Row
              label="Estimated rebates"
              value={`− ${formatCurrency(f.estimatedRebates)}`}
              accent="text-savings"
            />
            <div className="my-2 border-t border-line" />
            <Row label="Net cost" value={formatCurrency(f.netCost)} strong />
          </div>

          {/* outcomes */}
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Annual savings" value={formatCurrency(f.annualSavings)} accent="text-savings" />
            <Stat label="Payback period" value={`${f.paybackYears} yrs`} accent="text-energy" />
            <Stat
              label="25-year savings"
              value={formatCurrency(f.twentyFiveYearSavings)}
              accent="text-savings"
              span
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          Estimates in CAD. Figures are indicative and vary by province, installer,
          and final system design.
        </p>
      </Card>
    </Reveal>
  );
}

function Row({
  label,
  value,
  accent,
  strong,
}: {
  label: string;
  value: string;
  accent?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className={strong ? "font-semibold text-ink" : "text-ink-soft"}>
        {label}
      </span>
      <span
        className={`font-mono ${strong ? "text-lg font-bold text-ink" : ""} ${accent ?? "text-ink"}`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  span,
}: {
  label: string;
  value: string;
  accent: string;
  span?: boolean;
}) {
  return (
    <div
      className={`rounded-card bg-surface/60 p-4 ${span ? "col-span-2" : ""}`}
    >
      <p className={`font-mono text-xl font-bold ${accent}`}>{value}</p>
      <p className="caption mt-1 text-ink-faint">{label}</p>
    </div>
  );
}
