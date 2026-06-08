import type {
  Assessment,
  QuestionnaireData,
  Rating,
} from "@/types";
import type { GeocodeResult } from "./geocode";
import type { ClimateData } from "./climate";

/**
 * Deterministic mock assessment used when ANTHROPIC_API_KEY is absent (so the
 * app compiles and runs end-to-end without a key) or as a fallback if the AI
 * call fails. Figures are plausible estimates derived from the questionnaire
 * and the real climate data, not random — so the dashboard looks meaningful.
 */

// Rough daily-kWh contribution per appliance by usage frequency.
const APPLIANCE_DAILY_KWH: Record<string, number> = {
  refrigerator: 1.5,
  freezer: 1.3,
  stove: 2.0,
  microwave: 0.3,
  dishwasher: 1.2,
  washer: 0.7,
  dryer: 2.5,
  ac: 3.5,
  electric_heat: 6.0,
  heat_pump: 4.0,
  water_heater: 4.5,
  tv: 0.4,
  computer: 0.5,
  lighting: 1.0,
  ev_charger: 8.0,
  well_pump: 0.8,
  other: 0.5,
};

const FREQ_FACTOR: Record<string, number> = {
  rarely: 0.3,
  sometimes: 0.6,
  daily: 1.0,
  constantly: 1.6,
};

function solarRating(v: number | null): Rating {
  if (v === null) return "Moderate";
  if (v > 5) return "Excellent";
  if (v >= 4) return "Good";
  if (v >= 3) return "Moderate";
  return "Poor";
}

function windRating(v: number | null): Rating {
  if (v === null) return "Moderate";
  if (v > 6) return "Excellent";
  if (v >= 5) return "Good";
  if (v >= 4) return "Moderate";
  return "Poor";
}

export function buildMockAssessment(
  data: QuestionnaireData,
  geo: GeocodeResult,
  climate: ClimateData
): Assessment {
  // ---- Energy estimate ----
  let applianceDaily = 0;
  for (const a of data.appliances) {
    const base = APPLIANCE_DAILY_KWH[a.id] ?? 0.5;
    const qty = a.id === "lighting" ? 1 : Math.max(1, a.quantity);
    applianceDaily += base * qty * (FREQ_FACTOR[a.frequency] ?? 1);
  }
  // Baseline by occupants if nothing selected.
  const occupantBase = data.occupants * 4;
  const estimatedDailyKwh = Math.round(
    (data.dailyKwh ?? Math.max(applianceDaily, occupantBase)) * 10
  ) / 10;
  const estimatedAnnualKwh = Math.round(estimatedDailyKwh * 365);
  const estimatedMonthlyKwh = Math.round(estimatedAnnualKwh / 12);
  const peakDemandKw = Math.round((estimatedDailyKwh / 24) * 3 * 10) / 10;

  // ---- Breakdown ----
  const pct = {
    Heating: 0.3,
    Cooling: 0.12,
    Appliances: 0.25,
    "Water Heating": 0.18,
    Lighting: 0.07,
    Other: 0.08,
  };
  const breakdown = Object.entries(pct).map(([category, p]) => ({
    category,
    kwh: Math.round(estimatedAnnualKwh * p),
    percentage: Math.round(p * 100),
  }));

  // ---- Location ratings ----
  const solar = climate.solarIrradiance;
  const wind = climate.windSpeed50m;
  const sRating = solarRating(solar);
  const wRating = windRating(wind);
  const apartment = data.propertyType === "apartment";
  // Geothermal shines where there's a real heating/cooling load to displace.
  const hasHeatingLoad = data.appliances.some(
    (a) => a.id === "electric_heat" || a.id === "heat_pump"
  );
  const geothermal: "High" | "Moderate" | "Low" = apartment
    ? "Low"
    : hasHeatingLoad
      ? "High"
      : "Moderate";

  // ---- Recommendations ----
  const solarSizeKw =
    Math.round(Math.max(3, estimatedDailyKwh / 4) * 10) / 10;
  const solarCost = Math.round(solarSizeKw * 2700);
  const solarAnnualProd = Math.round(
    solarSizeKw * (solar ?? 3.8) * 365 * 0.8
  );
  const solarCoverage = Math.min(
    95,
    Math.round((solarAnnualProd / estimatedAnnualKwh) * 100)
  );

  const recommendations = [
    {
      technology: "Solar PV",
      recommended: sRating !== "Poor" && !apartment,
      confidence: (sRating === "Excellent" ? "High" : "Medium") as
        | "High"
        | "Medium"
        | "Low",
      systemSize: `${solarSizeKw} kW`,
      estimatedCost: solarCost,
      estimatedAnnualProduction: solarAnnualProd,
      coveragePercentage: solarCoverage,
      explanation: `With ${solar ? solar.toFixed(1) : "~3.8"} kWh/m²/day of solar irradiance, a rooftop array can offset roughly ${solarCoverage}% of your estimated annual use.`,
      placement: apartment
        ? "Limited roof access in multi-unit buildings; consider community solar."
        : "South-facing roof sections with minimal shading.",
    },
    {
      technology: "Wind",
      recommended: wRating === "Excellent" && !apartment,
      confidence: (wRating === "Excellent" ? "Medium" : "Low") as
        | "High"
        | "Medium"
        | "Low",
      systemSize: wRating === "Excellent" ? "5 kW turbine" : "n/a",
      estimatedCost: wRating === "Excellent" ? 22000 : 0,
      estimatedAnnualProduction:
        wRating === "Excellent" ? Math.round((wind ?? 6) * 1200) : 0,
      coveragePercentage: wRating === "Excellent" ? 25 : 0,
      explanation: `Average wind speed of ${wind ? wind.toFixed(1) : "n/a"} m/s at 50m is rated ${wRating} for small wind. Small wind is only cost-effective with strong, consistent wind and open land.`,
      placement: "Open area away from buildings and obstructions.",
    },
    {
      technology: "Geothermal",
      recommended: geothermal === "High",
      confidence: (geothermal === "High" ? "Medium" : "Low") as
        | "High"
        | "Medium"
        | "Low",
      systemSize: geothermal === "High" ? "3-ton ground-source heat pump" : "n/a",
      estimatedCost: geothermal === "High" ? 28000 : 0,
      estimatedAnnualProduction: 0,
      coveragePercentage: geothermal === "High" ? 60 : 0,
      explanation: `Geothermal viability is ${geothermal}. Ground-source heat pumps deliver excellent heating/cooling efficiency where there's a significant heating load and lot space for a loop field.`,
      placement: apartment
        ? "Not feasible for multi-unit dwellings without shared infrastructure."
        : "Horizontal or vertical loop field on the property.",
    },
    {
      technology: "Battery Storage",
      recommended: data.gridConnection !== "grid" || data.goals.includes("backup"),
      confidence: "Medium" as const,
      systemSize: "13.5 kWh battery",
      estimatedCost: 14000,
      estimatedAnnualProduction: 0,
      coveragePercentage: 0,
      explanation:
        "Battery storage adds resilience and lets you use more of your own solar generation, especially valuable with frequent outages or backup goals.",
      placement: "Wall-mounted in garage or utility space.",
    },
  ];

  // ---- Financials ----
  const recommended = recommendations.filter((r) => r.recommended);
  const totalSystemCost = recommended.reduce(
    (s, r) => s + r.estimatedCost,
    0
  );
  const estimatedRebates = Math.min(5000, Math.round(totalSystemCost * 0.15));
  const netCost = Math.max(0, totalSystemCost - estimatedRebates);

  // ~ $0.16/kWh CAD blended rate.
  const RATE = 0.16;
  const solarRecommended = recommendations[0].recommended;
  const windRecommended = recommendations[1].recommended;
  const geoRecommended = recommendations[2].recommended;

  const solarSavings = solarRecommended
    ? Math.min(estimatedAnnualKwh, solarAnnualProd) * RATE
    : 0;
  // Wind savings are the bill offset from its generation (kept in step with
  // its cost so a wind recommendation doesn't inflate payback).
  const windSavings = windRecommended
    ? recommendations[1].estimatedAnnualProduction * RATE
    : 0;
  // Ground-source heat pump displaces most of the heating load. Floor reflects
  // that an electric-heat home's heating bill is large even when our
  // appliance-based kWh estimate is conservative.
  const heatingKwh = estimatedAnnualKwh * 0.3;
  const geoSavings = geoRecommended
    ? Math.max(heatingKwh * 0.6 * RATE, 1200)
    : 0;
  const annualSavings = Math.round(solarSavings + windSavings + geoSavings);

  // Payback is measured on the energy-generating investment only. Battery
  // storage is a resilience purchase (no direct energy savings), so its cost
  // is part of the honest total/net cost but excluded from payback math.
  const productiveCost =
    (solarRecommended ? recommendations[0].estimatedCost : 0) +
    (windRecommended ? recommendations[1].estimatedCost : 0) +
    (geoRecommended ? recommendations[2].estimatedCost : 0);
  const productiveNet = Math.max(0, productiveCost - estimatedRebates);
  const paybackYears =
    annualSavings > 0
      ? Math.round((productiveNet / annualSavings) * 10) / 10
      : 0;
  const twentyFiveYearSavings = Math.round(annualSavings * 25 - productiveNet);

  // ---- Environmental ----
  // ~0.13 t CO2 per MWh (varies by grid). Base it on the production of the
  // RECOMMENDED clean-generation systems only — never a system we didn't
  // recommend (e.g. solar on an apartment).
  const recommendedProductionKwh = recommendations
    .filter((r) => r.recommended)
    .reduce((s, r) => s + (r.estimatedAnnualProduction || 0), 0);
  const annualCo2AvoidedTonnes =
    Math.round((recommendedProductionKwh / 1000) * 0.13 * 100) / 100;
  const environmental = {
    annualCo2AvoidedTonnes,
    treesEquivalent: Math.round(annualCo2AvoidedTonnes * 16.5),
    kmDrivingEquivalent: Math.round(annualCo2AvoidedTonnes * 5400),
    twentyFiveYearCo2Tonnes: Math.round(annualCo2AvoidedTonnes * 25 * 10) / 10,
  };

  return {
    energyProfile: {
      estimatedDailyKwh,
      estimatedMonthlyKwh,
      estimatedAnnualKwh,
      peakDemandKw,
      breakdown,
      comparisonToAverage: `Your estimated ${estimatedAnnualKwh.toLocaleString()} kWh/year is ${estimatedAnnualKwh > 11000 ? "above" : "around or below"} the typical Canadian household average (~11,000 kWh/year) for a home of this size.`,
    },
    locationData: {
      solarIrradiance: solar ?? 3.8,
      solarRating: sRating,
      windSpeed: wind ?? 0,
      windRating: wRating,
      geothermalViability: geothermal,
      climateSummary: `Location at ${geo.latitude.toFixed(2)}, ${geo.longitude.toFixed(2)} has ${sRating.toLowerCase()} solar potential${wind ? ` and ${wRating.toLowerCase()} wind resource` : ""}. Climate data sourced from ${climate.source === "nasa-power" ? "NASA POWER" : climate.source === "open-meteo" ? "Open-Meteo" : "regional estimates"}.`,
    },
    recommendations,
    financial: {
      totalSystemCost,
      estimatedRebates,
      netCost,
      annualSavings,
      paybackYears,
      twentyFiveYearSavings,
    },
    environmental,
    photoInsights:
      data.photos.length > 0
        ? `${data.photos.length} photo(s) received. (Live AI photo analysis requires an Anthropic API key; this is a sample assessment.)`
        : null,
  };
}
