import type { Assessment, FinancialSummary, EnvironmentalImpact } from "@/types";

/**
 * Recompute the financial + environmental totals for an arbitrary selection of
 * technologies, so the results dashboard can let the user toggle each tech on
 * or off and see consistent numbers. Mirrors the engine's costing logic:
 *  - cost/rebates from the selected systems' own estimatedCost
 *  - solar/wind savings from their generation; geothermal from heating offset;
 *    battery is resilience (no direct savings)
 *  - payback measured on the energy-generating (non-battery) investment
 *  - CO2 from the selected generation only
 */
const RATE = 0.16; // $/kWh CAD blended
const CO2_PER_MWH = 0.13; // tonnes per MWh

export interface Recomputed {
  financial: FinancialSummary;
  environmental: EnvironmentalImpact;
  annualProduction: number;
}

export function recomputeFromSelection(
  assessment: Assessment,
  selected: ReadonlySet<string>
): Recomputed {
  const recs = assessment.recommendations.filter((r) =>
    selected.has(r.technology)
  );

  const heating = assessment.energyProfile.breakdown.find(
    (b) => b.category.toLowerCase() === "heating"
  );
  const heatingKwh =
    heating?.kwh ?? assessment.energyProfile.estimatedAnnualKwh * 0.3;

  let totalSystemCost = 0;
  let productiveCost = 0;
  let annualSavings = 0;
  let annualProduction = 0;
  let cleanProductionKwh = 0;

  for (const r of recs) {
    totalSystemCost += r.estimatedCost || 0;
    const tech = r.technology.toLowerCase();
    annualProduction += r.estimatedAnnualProduction || 0;

    if (tech.includes("battery")) {
      // resilience purchase — cost only, no savings/production
      continue;
    }
    productiveCost += r.estimatedCost || 0;

    if (tech.includes("solar") || tech.includes("wind")) {
      const prod = r.estimatedAnnualProduction || 0;
      annualSavings += prod * RATE;
      cleanProductionKwh += prod;
    } else if (tech.includes("geo")) {
      annualSavings += Math.max(heatingKwh * 0.6 * RATE, 1200);
    }
  }

  const estimatedRebates = Math.min(
    5000,
    Math.round(totalSystemCost * 0.15)
  );
  const netCost = Math.max(0, totalSystemCost - estimatedRebates);
  const productiveNet = Math.max(0, productiveCost - estimatedRebates);
  annualSavings = Math.round(annualSavings);
  const paybackYears =
    annualSavings > 0
      ? Math.round((productiveNet / annualSavings) * 10) / 10
      : 0;
  const twentyFiveYearSavings = Math.round(annualSavings * 25 - productiveNet);

  const annualCo2AvoidedTonnes =
    Math.round((cleanProductionKwh / 1000) * CO2_PER_MWH * 100) / 100;

  return {
    annualProduction,
    financial: {
      totalSystemCost,
      estimatedRebates,
      netCost,
      annualSavings,
      paybackYears,
      twentyFiveYearSavings,
    },
    environmental: {
      annualCo2AvoidedTonnes,
      treesEquivalent: Math.round(annualCo2AvoidedTonnes * 16.5),
      kmDrivingEquivalent: Math.round(annualCo2AvoidedTonnes * 5400),
      twentyFiveYearCo2Tonnes:
        Math.round(annualCo2AvoidedTonnes * 25 * 10) / 10,
    },
  };
}
