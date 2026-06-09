"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { formatCurrency } from "@/lib/utils";

export function FinancialBreakdown({ assessment }: { assessment: Assessment }) {
  const f = assessment.financial;
  const [methodOpen, setMethodOpen] = useState(false);

  return (
    <Reveal>
      <Card padding="lg">
        <p className="caption text-energy">The numbers</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          Financial breakdown
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Itemized costs */}
          <div className="space-y-1">
            <Row label="Total system cost" value={formatCurrency(f.totalSystemCost)} />
            <Row
              label="Estimated rebates"
              hint="Federal and provincial incentive programs applicable to your province"
              value={`− ${formatCurrency(f.estimatedRebates)}`}
              accent="text-savings"
            />
            <div className="my-2 border-t border-line" />
            <Row
              label="Your net cost"
              hint="Total system cost minus applicable rebates"
              value={formatCurrency(f.netCost)}
              strong
            />
          </div>

          {/* Outcome stats */}
          <div className="grid grid-cols-2 gap-4">
            <Stat
              label="Annual energy savings"
              value={formatCurrency(f.annualSavings)}
              accent="text-savings"
            />
            <Stat
              label="Payback period"
              hint="Years until cumulative energy savings equal your net upfront cost"
              value={`${f.paybackYears} yrs`}
              accent="text-energy"
            />
            <Stat
              label="Net savings at year 25"
              value={formatCurrency(f.twentyFiveYearSavings)}
              accent="text-savings"
              span
            />
          </div>
        </div>

        {/* Methodology disclosure */}
        <div className="mt-6 border-t border-line pt-5">
          <button
            type="button"
            onClick={() => setMethodOpen((v) => !v)}
            aria-expanded={methodOpen}
            aria-controls="financial-methodology"
            className="inline-flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-ink-soft focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy"
          >
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`transition-transform duration-200 ${methodOpen ? "rotate-180" : ""}`}
            />
            How we calculated these estimates
          </button>

          {methodOpen && (
            <div
              id="financial-methodology"
              className="mt-3 rounded-card bg-surface/60 p-4 text-sm"
            >
              <p className="text-ink-soft">
                These projections are modelled specifically for your property and
                location using four data sources:
              </p>
              <dl className="mt-3 space-y-2">
                {METHODOLOGY.map(({ term, detail }) => (
                  <div key={term} className="grid gap-x-3 sm:grid-cols-[9rem_1fr]">
                    <dt className="font-medium text-ink">{term}</dt>
                    <dd className="text-ink-soft sm:mt-0 mt-0.5">{detail}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-ink-soft">
                Actual costs and savings will differ once you receive installer
                quotes and confirm your final system design. These figures are a
                well-grounded starting point for your decision.
              </p>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-ink-soft">
          Figures are in CAD and based on modelled data. A licensed
          installer&apos;s quote will account for your specific roof geometry,
          electrical panel, shading, and local permit costs.
        </p>
      </Card>
    </Reveal>
  );
}

const METHODOLOGY = [
  {
    term: "Solar resource",
    detail:
      "NASA POWER satellite irradiance data for your exact coordinates",
  },
  {
    term: "Energy pricing",
    detail:
      "Current provincial rates, escalated at historical averages across 25 years",
  },
  {
    term: "Rebates",
    detail:
      "Federal and provincial incentive programs currently available for your province",
  },
  {
    term: "System costs",
    detail:
      "Residential installation benchmarks for your selected technology mix",
  },
] as const;

function Row({
  label,
  hint,
  value,
  accent,
  strong,
}: {
  label: string;
  hint?: string;
  value: string;
  accent?: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span
        className={strong ? "font-semibold text-ink" : "text-ink-soft"}
        title={hint}
      >
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
  hint,
  value,
  accent,
  span,
}: {
  label: string;
  hint?: string;
  value: string;
  accent: string;
  span?: boolean;
}) {
  return (
    <div
      title={hint}
      className={`rounded-card bg-surface/60 p-4 ${span ? "col-span-2" : ""}`}
    >
      <p className={`font-mono text-xl font-bold ${accent}`}>{value}</p>
      <p className="caption mt-1 text-ink-faint">{label}</p>
    </div>
  );
}
