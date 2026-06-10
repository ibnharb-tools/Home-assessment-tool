/* ============================================================================
   Shared domain types for Everstead.
   ========================================================================== */

/* ---------- Questionnaire ---------- */

export type PropertyType =
  | "house"
  | "apartment"
  | "farm"
  | "community"
  | "commercial";

export type AreaUnit = "sqft" | "sqm";
export type Ownership = "own" | "rent";
export type GridConnection = "grid" | "partial" | "offgrid";
export type UsageFrequency = "rarely" | "sometimes" | "daily" | "constantly";
export type LightingType = "led" | "incandescent" | "mixed";

/** Breakdown of rooms by type. */
export interface RoomCounts {
  bedrooms: number;
  bathrooms: number;
  living: number;
  kitchens: number;
  garages: number;
  other: number;
}

export interface ApplianceSelection {
  /** Appliance key (see APPLIANCES catalog). */
  id: string;
  quantity: number;
  frequency: UsageFrequency;
}

export interface QuestionnaireData {
  address: string;

  // Step 1 — Property basics
  propertyType?: PropertyType;
  rooms: RoomCounts;
  floorArea?: number;
  areaUnit: AreaUnit;
  occupants: number;
  ownership: Ownership;

  // Step 2 — Energy connection
  gridConnection?: GridConnection;
  hasRenewables: boolean;
  existingRenewables: string[]; // "solar" | "wind" | "battery" | "other"
  dailyKwh?: number; // optional, user may not know

  // Step 3 — Appliances & usage
  appliances: ApplianceSelection[];
  lightingType: LightingType;

  // Step 4 — Energy goals
  goals: string[];
  budget?: string;
  timeframe?: string;
  /** When true, only Shariah-compliant (riba-free) financing is recommended. */
  shariahCompliant?: boolean;

  // Step 5 — Photos (optional). Stored as downscaled JPEG data URLs for MVP.
  photos: string[];
}

/* ---------- Assessment result (AI output, Phase 4) ---------- */

export type Rating = "Excellent" | "Good" | "Moderate" | "Poor";
export type Viability = "High" | "Moderate" | "Low";
export type Confidence = "High" | "Medium" | "Low";

export interface EnergyBreakdownItem {
  category: string;
  kwh: number;
  percentage: number;
}

export interface EnergyProfile {
  estimatedDailyKwh: number;
  estimatedMonthlyKwh: number;
  estimatedAnnualKwh: number;
  peakDemandKw: number;
  breakdown: EnergyBreakdownItem[];
  comparisonToAverage: string;
}

export interface LocationData {
  solarIrradiance: number;
  solarRating: Rating;
  windSpeed: number;
  windRating: Rating;
  geothermalViability: Viability;
  climateSummary: string;
}

/** A cited fact — links a number or claim back to its source. */
export interface Citation {
  /** What the citation supports, e.g. "PV annual production" or "panel unit price". */
  label: string;
  /** Document + equation/section, OR a supplier/grant name. */
  source: string;
  /** URL for live pricing/grant sources (omitted for document equations). */
  url?: string;
}

/** A purchasable product option for a technology (live or curated pricing). */
export interface ProductOption {
  name: string;
  supplier: string;
  unitPrice: number;
  installationCost: number;
  maintenanceCostPerYear: number;
  energyRequiredKwh: number; // operating energy the unit consumes
  energyProducedKwh: number; // energy the unit produces per year
  url?: string;
  sourceCitation?: string;
}

export interface Recommendation {
  technology: string;
  recommended: boolean;
  confidence: Confidence;
  systemSize: string;
  estimatedCost: number;
  estimatedAnnualProduction: number;
  coveragePercentage: number;
  explanation: string;
  placement: string;
  // Report Table III columns
  unitPrice?: number;
  installationCost?: number;
  maintenanceCostPerYear?: number;
  energyRequiredKwh?: number;
  energyProducedKwh?: number;
  /** Real product/supplier options (budget-filtered, live or curated). */
  options?: ProductOption[];
  /** Calculation + price citations specific to this technology. */
  citations?: Citation[];
}

/** A financing option; Shariah-compliant ones are riba-free structures. */
export interface FinancingOption {
  name: string;
  provider: string;
  type: string; // e.g. "Green loan", "Murabaha", "Ijara", "Grant"
  shariahCompliant: boolean;
  summary: string;
  url?: string;
}

export interface FinancialSummary {
  totalSystemCost: number;
  estimatedRebates: number;
  netCost: number;
  annualSavings: number;
  paybackYears: number;
  twentyFiveYearSavings: number;
}

export interface EnvironmentalImpact {
  annualCo2AvoidedTonnes: number;
  treesEquivalent: number;
  kmDrivingEquivalent: number;
  twentyFiveYearCo2Tonnes: number;
}

export interface Assessment {
  energyProfile: EnergyProfile;
  locationData: LocationData;
  recommendations: Recommendation[];
  financial: FinancialSummary;
  environmental: EnvironmentalImpact;
  photoInsights: string | null;
  /** Financing options, filtered to Shariah-compliant when the user opts in. */
  financing?: FinancingOption[];
  /** Grant/rebate programs found (with source URLs). */
  grants?: Citation[];
  /** Methodology citations used across the assessment. */
  citations?: Citation[];
  /** Resolved coordinates + meta, attached by the API route. */
  meta?: {
    address: string;
    latitude: number;
    longitude: number;
    generatedAt: string;
    /** True when returned from the mock fallback (no ANTHROPIC_API_KEY). */
    mock?: boolean;
  };
}
