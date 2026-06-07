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
  rooms: number;
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
