/**
 * Methodology registry — the finite, cited set of equations the assessment is
 * allowed to use. Injected verbatim into every assessment prompt so each figure
 * can cite the document + equation it came from. Sources:
 *   - REPORT: Harb, K. "MECH 4692 Renewable Energy — Final Report" (2023),
 *     RED model (Renewable Energy Demand), Dr. E. Bibeau.
 *   - MASTERS: Masters, G. "Renewable and Efficient Electric Power Systems".
 *
 * Keep equations here scholarly and stable; do not invent new ones in the model.
 */

export interface MethodEquation {
  id: string;
  label: string;
  equation: string;
  variables: string;
  citation: string;
}

export const METHODOLOGY: MethodEquation[] = [
  {
    id: "demand",
    label: "Total annual energy demand",
    equation: "E_demand = Σ (E_hydro + E_natgas + E_gasoline + E_propane)",
    variables: "Each source converted to a common energy unit (kWh/MWh).",
    citation: "REPORT §3 Data Acquisition — Demand",
  },
  {
    id: "rer",
    label: "Renewable Energy Ratio",
    equation: "RER = E_renewable / E_total  (×100%)",
    variables:
      "E_renewable = energy from renewable sources; E_total = renewable + non-renewable.",
    citation: "REPORT §3.1 Initial RER and GHG Emissions",
  },
  {
    id: "ghg",
    label: "GHG emissions",
    equation: "GHG = Σ (E_source × EF_source)",
    variables:
      "EF_source = emission factor per energy source (kg CO2e per unit), from a conversion table.",
    citation: "REPORT §3.1 (conversion table, Appendix C)",
  },
  {
    id: "pv_energy",
    label: "PV / solar panel annual energy",
    equation: "E_pv = n × P_panel × H × PR",
    variables:
      "n = number of panels; P_panel = panel rating; H = annual in-plane irradiation (kWh/m²·yr or peak-sun-hours); PR = performance ratio (≈0.75–0.8).",
    citation: "REPORT §5.1 Solar Panel Analysis; MASTERS (PV systems chapter)",
  },
  {
    id: "wind_power",
    label: "Wind turbine available power",
    equation: "P = ½ · ρ · A · v³ · Cp",
    variables:
      "ρ = air density (≈1.225 kg/m³); A = swept area = πr²; v = wind speed; Cp = power coefficient (Betz limit 0.593).",
    citation: "MASTERS (wind power chapter); REPORT §5.2 Turbine Analysis",
  },
  {
    id: "wind_weibull",
    label: "Wind speed probability (Weibull / Rayleigh)",
    equation:
      "f_i = (k/c)(v/c)^(k−1) e^(−(v/c)^k);  AEP = Σ f_i · P(v_i) · 8760",
    variables:
      "k = shape (k=2 → Rayleigh); c = scale; f_i = probability of wind speed bin v_i; F_i = cumulative.",
    citation: "REPORT §5.2 Turbine Analysis (f_i, F_i); MASTERS (statistics of wind)",
  },
  {
    id: "capacity_factor",
    label: "Capacity factor",
    equation: "CF = AEP / (P_rated × 8760)",
    variables: "AEP = annual energy produced; P_rated = nameplate power.",
    citation: "MASTERS (capacity factor)",
  },
  {
    id: "biomass",
    label: "Biomass boiler heat output",
    equation: "Q = m_fuel × HHV × η",
    variables:
      "m_fuel = fuel mass; HHV = higher heating value; η = boiler efficiency.",
    citation: "REPORT §5.3 Biomass Analysis",
  },
  {
    id: "balance",
    label: "Power & heat balance",
    equation: "E_surplus(month) = E_produced − E_consumed",
    variables:
      "Surplus exported / deficit billed at the utility rate; summed across months.",
    citation: "REPORT §6 Power and Heat Balance",
  },
  {
    id: "payback",
    label: "Simple payback",
    equation: "Payback = NetCost / AnnualSavings",
    variables:
      "NetCost = capital − rebates; AnnualSavings = avoided energy cost per year.",
    citation: "REPORT §6 (30-year savings analysis)",
  },
  {
    id: "lcoe",
    label: "Levelized cost of energy",
    equation: "LCOE = (Σ (I_t + M_t + F_t)/(1+r)^t) / (Σ E_t/(1+r)^t)",
    variables:
      "I=investment, M=O&M, F=fuel, E=energy, r=discount rate, t=year.",
    citation: "MASTERS (economics); docs/lazards-lcoeplus-june-2025.pdf",
  },
];

/** Compact, citeable block for the prompt. */
export function methodologyForPrompt(): string {
  return METHODOLOGY.map(
    (m) =>
      `- ${m.label}: ${m.equation}\n  where ${m.variables}\n  [cite: ${m.citation}]`
  ).join("\n");
}
