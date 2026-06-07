import type { UsageFrequency } from "@/types";

/* Option catalogs for the questionnaire. Icon names map to lucide-react icons
   resolved in the step components. Kept data-only so they can also be sent to
   the AI prompt later. */

export const PROPERTY_TYPES = [
  { id: "house", label: "House", icon: "Home" },
  { id: "apartment", label: "Apartment / Condo", icon: "Building2" },
  { id: "farm", label: "Farm / Agricultural", icon: "Tractor" },
  { id: "community", label: "Community Building", icon: "Users" },
  { id: "commercial", label: "Commercial", icon: "Store" },
] as const;

export const GRID_OPTIONS = [
  {
    id: "grid",
    label: "Fully grid-connected",
    desc: "Reliable utility power",
    icon: "PlugZap",
  },
  {
    id: "partial",
    label: "Partially connected",
    desc: "Frequent outages",
    icon: "Unplug",
  },
  {
    id: "offgrid",
    label: "Off-grid",
    desc: "No utility connection",
    icon: "PowerOff",
  },
] as const;

export const EXISTING_RENEWABLES = [
  { id: "solar", label: "Solar", icon: "Sun" },
  { id: "wind", label: "Wind", icon: "Wind" },
  { id: "battery", label: "Battery", icon: "BatteryCharging" },
  { id: "other", label: "Other", icon: "Plus" },
] as const;

export interface ApplianceDef {
  id: string;
  label: string;
  icon: string;
}

export const APPLIANCES: ApplianceDef[] = [
  { id: "refrigerator", label: "Refrigerator", icon: "Refrigerator" },
  { id: "freezer", label: "Freezer", icon: "Snowflake" },
  { id: "stove", label: "Electric Stove / Oven", icon: "CookingPot" },
  { id: "microwave", label: "Microwave", icon: "Microwave" },
  { id: "dishwasher", label: "Dishwasher", icon: "Utensils" },
  { id: "washer", label: "Washing Machine", icon: "WashingMachine" },
  { id: "dryer", label: "Clothes Dryer", icon: "Wind" },
  { id: "ac", label: "Air Conditioning", icon: "AirVent" },
  { id: "electric_heat", label: "Electric Heating", icon: "Flame" },
  { id: "heat_pump", label: "Heat Pump", icon: "Thermometer" },
  { id: "water_heater", label: "Water Heater (electric)", icon: "Droplets" },
  { id: "tv", label: "Television(s)", icon: "Tv" },
  { id: "computer", label: "Computer(s)", icon: "Monitor" },
  { id: "lighting", label: "Lighting", icon: "Lightbulb" },
  { id: "ev_charger", label: "EV Charger", icon: "Car" },
  { id: "well_pump", label: "Well Pump", icon: "Waves" },
  { id: "other", label: "Other", icon: "Plus" },
];

export const USAGE_FREQUENCIES: { id: UsageFrequency; label: string }[] = [
  { id: "rarely", label: "Rarely" },
  { id: "sometimes", label: "Sometimes" },
  { id: "daily", label: "Daily" },
  { id: "constantly", label: "Constantly" },
];

export const GOALS = [
  { id: "lower_bills", label: "Lower my bills", icon: "PiggyBank" },
  { id: "independence", label: "Energy independence", icon: "ShieldCheck" },
  { id: "carbon", label: "Reduce my carbon footprint", icon: "Leaf" },
  { id: "backup", label: "Backup power reliability", icon: "BatteryCharging" },
  { id: "value", label: "Increase property value", icon: "TrendingUp" },
] as const;

export const BUDGETS = [
  { id: "under_10k", label: "Under $10k" },
  { id: "10k_25k", label: "$10k – $25k" },
  { id: "25k_50k", label: "$25k – $50k" },
  { id: "50k_plus", label: "$50k+" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export const TIMEFRAMES = [
  { id: "now", label: "Ready now" },
  { id: "6mo", label: "Within 6 months" },
  { id: "1yr", label: "Within a year" },
  { id: "exploring", label: "Just exploring" },
] as const;

export const QUESTIONNAIRE_STEPS = [
  "Property Basics",
  "Energy Connection",
  "Appliances & Usage",
  "Energy Goals",
  "Property Photos",
] as const;
