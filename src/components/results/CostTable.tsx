"use client";

import type { Assessment, QuestionnaireData } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { formatCurrency, formatNumber } from "@/lib/utils";

/**
 * Cost & energy table — mirrors the Report's Table III columns:
 * Unit Price / Installation / Maintenance / Energy Required / Energy Produced.
 * Shows the currently-selected technologies (and their real product options
 * when present), filtered to the user's budget. Every row can carry a source.
 */

const BUDGET_CEILING: Record<string, number> = {
  under_10k: 10000,
  "10k_25k": 25000,
  "25k_50k": 50000,
  "50k_plus": Infinity,
  unsure: Infinity,
};

interface Row {
  label: string;
  unitPrice: number;
  installationCost: number;
  maintenanceCostPerYear: number;
  energyRequiredKwh: number;
  energyProducedKwh: number;
  source?: string;
  url?: string;
  sub?: boolean;
}

export function CostTable({
  assessment,
  selected,
  questionnaireData,
}: {
  assessment: Assessment;
  selected: ReadonlySet<string>;
  questionnaireData?: QuestionnaireData;
}) {
  const ceiling = questionnaireData?.budget
    ? BUDGET_CEILING[questionnaireData.budget] ?? Infinity
    : Infinity;

  const recs = assessment.recommendations.filter(
    (r) => selected.has(r.technology) && r.recommended
  );
  if (recs.length === 0) return null;

  const rows: Row[] = [];
  for (const r of recs) {
    rows.push({
      label: r.technology,
      unitPrice: r.unitPrice ?? Math.round(r.estimatedCost * 0.72),
      installationCost: r.installationCost ?? Math.round(r.estimatedCost * 0.28),
      maintenanceCostPerYear: r.maintenanceCostPerYear ?? 0,
      energyRequiredKwh: r.energyRequiredKwh ?? 0,
      energyProducedKwh: r.energyProducedKwh ?? r.estimatedAnnualProduction ?? 0,
      source: r.citations?.[0]?.source,
    });
    // Real product options within budget, as sub-rows.
    for (const o of r.options ?? []) {
      if (o.unitPrice + o.installationCost > ceiling) continue;
      rows.push({
        label: `${o.name} — ${o.supplier}`,
        unitPrice: o.unitPrice,
        installationCost: o.installationCost,
        maintenanceCostPerYear: o.maintenanceCostPerYear,
        energyRequiredKwh: o.energyRequiredKwh,
        energyProducedKwh: o.energyProducedKwh,
        source: o.sourceCitation ?? o.supplier,
        url: o.url,
        sub: true,
      });
    }
  }

  const totals = rows
    .filter((r) => !r.sub)
    .reduce(
      (t, r) => ({
        unit: t.unit + r.unitPrice,
        install: t.install + r.installationCost,
        maint: t.maint + r.maintenanceCostPerYear,
        prod: t.prod + r.energyProducedKwh,
      }),
      { unit: 0, install: 0, maint: 0, prod: 0 }
    );

  return (
    <Reveal>
      <div>
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          Cost and energy breakdown
        </h2>
        <p className="mt-3 max-w-[60ch] text-ink-soft">
          Per-technology figures for your selected plan
          {questionnaireData?.budget && ceiling !== Infinity
            ? `, filtered to options within your ${formatCurrency(ceiling)} budget`
            : ""}
          . Product options use live supplier pricing when available.
        </p>

        <Card padding="none" className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-ink-faint">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 text-right font-medium">Unit Price ($)</th>
                <th className="px-4 py-3 text-right font-medium">Installation ($)</th>
                <th className="px-4 py-3 text-right font-medium">Maintenance ($/yr)</th>
                <th className="px-4 py-3 text-right font-medium">Energy Required (kWh)</th>
                <th className="px-4 py-3 text-right font-medium">Energy Produced (kWh)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={i}
                  className={`border-b border-line/60 ${r.sub ? "text-ink-soft" : "font-medium text-ink"}`}
                >
                  <td className="px-4 py-3">
                    <span className={r.sub ? "pl-4 text-xs" : ""}>
                      {r.label}
                    </span>
                    {r.source && (
                      <span className="ml-2 text-xs text-ink-faint">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-energy hover:underline">
                            [source]
                          </a>
                        ) : (
                          `[${r.source}]`
                        )}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(r.unitPrice)}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(r.installationCost)}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(r.maintenanceCostPerYear)}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{r.energyRequiredKwh ? formatNumber(r.energyRequiredKwh) : "0"}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-savings">{r.energyProducedKwh ? formatNumber(r.energyProducedKwh) : "0"}</td>
                </tr>
              ))}
              <tr className="bg-surface/50 font-semibold text-ink">
                <td className="px-4 py-3">Total (systems)</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(totals.unit)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(totals.install)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">{formatCurrency(totals.maint)}</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums">—</td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-savings">{formatNumber(totals.prod)}</td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </Reveal>
  );
}
