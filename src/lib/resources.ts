// src/lib/resources.ts
//
// Solar + wind resource APIs for the Everstead assessment engine.
// All calls are server-side only (PVGIS rejects browser CORS), so import this
// from API routes (e.g. src/app/api/assess/route.ts), not client components.
//
// Sources / methodology:
//   - PVGIS 5.3 non-interactive API (EU JRC): https://re.jrc.ec.europa.eu/api/v5_3/
//   - NREL PVWatts v8 (key required): https://developer.nrel.gov/docs/solar/pvwatts/v8/
//   - NASA POWER API: https://power.larc.nasa.gov/api/
//   - World Bank Data360 — Global Wind Atlas (WB_GWA): https://data360.worldbank.org/en/dataset/WB_GWA
//   - Wind: power-law shear extrapolation + Rayleigh (Weibull k=2) capacity factor,
//     per Manwell, McGowan & Rogers, "Wind Energy Explained" (Wiley, 2009).
//
// The external JSON shapes are loosely typed (`any`) on purpose — these are
// third-party responses we narrow defensively at the read site.
/* eslint-disable @typescript-eslint/no-explicit-any */

// ----------------------------------------------------------------------------
// Shared fetch helper (timeout + JSON, no external deps)
// ----------------------------------------------------------------------------

async function fetchJSON<T>(url: string, timeoutMs = 15000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      throw new Error(`Request failed ${res.status} ${res.statusText} for ${url}`);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

// ============================================================================
// SOLAR
// ============================================================================

export interface SolarResult {
  source: "PVGIS" | "NASA_POWER" | "PVWatts";
  annualKWh: number | null;       // expected AC energy for the given peakPower
  specificYield: number | null;   // kWh per kWp per year
  optimalTilt: number | null;     // degrees
  optimalAzimuth: number | null;  // degrees (0 = south in PVGIS convention)
  monthlyKWh: number[] | null;    // 12 values, Jan..Dec
  ghiAnnual: number | null;       // kWh/m2/yr global horizontal irradiation
  database: string | null;        // e.g. "PVGIS-SARAH3" or "PVGIS-ERA5"
}

/**
 * Primary solar path: PVGIS PVcalc.
 * Returns loss-adjusted PV yield with optimal tilt/azimuth chosen by PVGIS.
 * peakPower in kWp; loss is system loss % (14% is the standard default).
 */
export async function getSolarPV(
  lat: number,
  lon: number,
  peakPower = 1,
  loss = 14
): Promise<SolarResult> {
  // SARAH3 covers roughly -60..+65 lat; ERA5 is the worldwide fallback.
  const inSarah = lat >= -60 && lat <= 65;
  const raddatabase = inSarah ? "PVGIS-SARAH3" : "PVGIS-ERA5";

  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    peakpower: String(peakPower),
    loss: String(loss),
    pvtechchoice: "crystSi",
    mountingplace: "building", // rooftop residential
    optimalangles: "1",        // let PVGIS pick optimal tilt + azimuth
    raddatabase,
    outputformat: "json",
  });

  const url = `https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?${params.toString()}`;

  // PVGIS shape: { outputs: { totals: { fixed: {...} }, monthly: { fixed: [...] } },
  //               inputs: { mounting_system: { fixed: { slope, azimuth } } } }
  const data = await fetchJSON<any>(url);

  const totals = data?.outputs?.totals?.fixed ?? {};
  const monthly = data?.outputs?.monthly?.fixed ?? [];
  const mount = data?.inputs?.mounting_system?.fixed ?? {};

  const annualKWh = typeof totals.E_y === "number" ? totals.E_y : null;

  return {
    source: "PVGIS",
    annualKWh,
    specificYield: annualKWh !== null ? annualKWh / peakPower : null,
    optimalTilt: mount?.slope?.value ?? null,
    optimalAzimuth: mount?.azimuth?.value ?? null,
    monthlyKWh: Array.isArray(monthly)
      ? monthly.map((m: any) => m.E_m).filter((v: any) => typeof v === "number")
      : null,
    ghiAnnual: typeof totals["H(i)_y"] === "number" ? totals["H(i)_y"] : null,
    database: raddatabase,
  };
}

/**
 * Fallback / cross-check: NASA POWER annual GHI climatology.
 * Use when PVGIS is unavailable or you only need raw irradiance.
 * ALLSKY_SFC_SW_DWN is reported in kWh/m^2/day -> multiply by 365.25 for annual.
 */
export async function getSolarIrradianceNASA(
  lat: number,
  lon: number
): Promise<SolarResult> {
  const params = new URLSearchParams({
    parameters: "ALLSKY_SFC_SW_DWN",
    community: "RE",
    longitude: String(lon),
    latitude: String(lat),
    format: "JSON",
  });
  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?${params.toString()}`;

  const data = await fetchJSON<any>(url);
  const ghi = data?.properties?.parameter?.ALLSKY_SFC_SW_DWN ?? {};
  const annualDaily = ghi?.ANN; // kWh/m2/day, annual average

  return {
    source: "NASA_POWER",
    annualKWh: null,
    specificYield: null,
    optimalTilt: null,
    optimalAzimuth: null,
    monthlyKWh: null,
    ghiAnnual: typeof annualDaily === "number" ? annualDaily * 365.25 : null,
    database: "NASA_POWER_climatology",
  };
}

/**
 * NREL PVWatts v8 (https://developer.nrel.gov/docs/solar/pvwatts/v8/).
 * Requires a free NREL API key in process.env.NREL_API_KEY — returns null when
 * the key is absent so the engine degrades gracefully. PVWatts covers the US
 * (nsrdb) and most of the world (intl datasets); out-of-coverage points 422 and
 * are caught upstream.
 *
 * array_type 1 = fixed roof mount; module_type 0 = standard; losses 14% default.
 */
export async function getSolarPVWatts(
  lat: number,
  lon: number,
  systemCapacityKw = 1,
  tilt = 20,
  azimuth = 180,
  losses = 14
): Promise<SolarResult | null> {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({
    api_key: apiKey,
    lat: String(lat),
    lon: String(lon),
    system_capacity: String(systemCapacityKw),
    azimuth: String(azimuth),
    tilt: String(tilt),
    array_type: "1",
    module_type: "0",
    losses: String(losses),
    timeframe: "monthly",
  });
  const url = `https://developer.nrel.gov/api/pvwatts/v8.json?${params.toString()}`;

  const data = await fetchJSON<any>(url);
  const out = data?.outputs ?? {};
  const annualKWh = typeof out.ac_annual === "number" ? out.ac_annual : null;
  const solradAnnualDaily =
    typeof out.solrad_annual === "number" ? out.solrad_annual : null; // kWh/m2/day

  return {
    source: "PVWatts",
    annualKWh,
    specificYield: annualKWh !== null ? annualKWh / systemCapacityKw : null,
    optimalTilt: tilt,
    optimalAzimuth: azimuth,
    monthlyKWh: Array.isArray(out.ac_monthly) ? out.ac_monthly : null,
    ghiAnnual: solradAnnualDaily !== null ? solradAnnualDaily * 365.25 : null,
    database: "PVWatts-v8",
  };
}

// ============================================================================
// WIND
// ============================================================================

export interface WindTurbine {
  ratedPowerKW: number; // turbine nameplate
  cutInMs: number;      // typically ~3 m/s
  ratedMs: number;      // wind speed at which rated power is reached, ~11-12 m/s
  cutOutMs: number;     // typically ~25 m/s (small turbines may furl earlier)
}

export interface WindResult {
  source: "NASA_POWER";
  windSpeed10m: number;     // m/s annual mean
  windSpeed50m: number;     // m/s annual mean
  shearExponent: number;    // derived local alpha
  hubHeightM: number;
  windSpeedHub: number;     // m/s extrapolated to hub height
  capacityFactor: number;   // 0..1
  annualKWh: number;        // estimated AEP
  viable: boolean;          // honest guardrail (see note below)
}

// Sensible default small/residential turbine (override from your equipment DB).
export const DEFAULT_SMALL_TURBINE: WindTurbine = {
  ratedPowerKW: 5,
  cutInMs: 3,
  ratedMs: 11,
  cutOutMs: 25,
};

/**
 * Wind resource + energy estimate from NASA POWER mean wind speeds.
 *
 * Method (all standard, defensible):
 *   1. Pull WS10M and WS50M annual means.
 *   2. Derive the local power-law shear exponent alpha from the two heights:
 *        alpha = ln(v50/v10) / ln(50/10)
 *   3. Extrapolate to hub height: v_hub = v50 * (hub/50)^alpha
 *   4. Capacity factor via Rayleigh (Weibull k=2) distribution of wind speed
 *      convolved with the turbine power curve (numerical integration).
 *   5. AEP = CF * ratedPower * 8760.
 */
export async function getWindResource(
  lat: number,
  lon: number,
  hubHeightM = 15,
  turbine: WindTurbine = DEFAULT_SMALL_TURBINE
): Promise<WindResult> {
  const params = new URLSearchParams({
    parameters: "WS10M,WS50M",
    community: "RE",
    longitude: String(lon),
    latitude: String(lat),
    format: "JSON",
  });
  const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?${params.toString()}`;

  const data = await fetchJSON<any>(url);
  const p = data?.properties?.parameter ?? {};
  const v10 = p?.WS10M?.ANN;
  const v50 = p?.WS50M?.ANN;

  if (typeof v10 !== "number" || typeof v50 !== "number") {
    throw new Error("NASA POWER did not return WS10M/WS50M for this location");
  }

  // Local shear exponent (clamp to a physically reasonable range).
  let alpha = Math.log(v50 / v10) / Math.log(50 / 10);
  if (!isFinite(alpha)) alpha = 0.143; // 1/7 power law default (open terrain)
  alpha = Math.min(Math.max(alpha, 0.1), 0.4);

  const vHub = v50 * Math.pow(hubHeightM / 50, alpha);
  const cf = rayleighCapacityFactor(vHub, turbine);
  const annualKWh = cf * turbine.ratedPowerKW * 8760;

  return {
    source: "NASA_POWER",
    windSpeed10m: v10,
    windSpeed50m: v50,
    shearExponent: Number(alpha.toFixed(3)),
    hubHeightM,
    windSpeedHub: Number(vHub.toFixed(2)),
    capacityFactor: Number(cf.toFixed(3)),
    annualKWh: Math.round(annualKWh),
    // Honest guardrail: residential wind is rarely worthwhile below ~5 m/s mean
    // at hub height, and rooftop/suburban siting underperforms these estimates.
    viable: vHub >= 5.0,
  };
}

/**
 * Capacity factor for a turbine given the long-term MEAN wind speed at hub height,
 * assuming a Rayleigh distribution (Weibull shape k = 2). Numerically integrates
 * the power curve over the speed distribution.
 */
function rayleighCapacityFactor(meanSpeed: number, t: WindTurbine): number {
  if (meanSpeed <= 0) return 0;

  // Rayleigh scale parameter: c = 2 * mean / sqrt(pi)
  const c = (2 * meanSpeed) / Math.sqrt(Math.PI);
  const k = 2;

  let energy = 0; // integral of P(v) * f(v) dv, expressed as fraction of rated
  const dv = 0.25;
  for (let v = 0; v < 30; v += dv) {
    // Weibull pdf (k=2)
    const f =
      (k / c) * Math.pow(v / c, k - 1) * Math.exp(-Math.pow(v / c, k));
    energy += powerCurveFraction(v, t) * f * dv;
  }
  return Math.min(Math.max(energy, 0), 1);
}

/** Generic power curve, returns fraction of rated power (0..1) at wind speed v. */
function powerCurveFraction(v: number, t: WindTurbine): number {
  if (v < t.cutInMs || v >= t.cutOutMs) return 0;
  if (v >= t.ratedMs) return 1;
  // Cubic ramp between cut-in and rated (standard approximation).
  return (
    (Math.pow(v, 3) - Math.pow(t.cutInMs, 3)) /
    (Math.pow(t.ratedMs, 3) - Math.pow(t.cutInMs, 3))
  );
}

/**
 * World Bank Data360 — Global Wind Atlas (WB_GWA).
 *
 * NOTE: This is a DOCUMENTED REFERENCE STUB, not yet wired into the engine.
 * The WB_GWA dataset is admin/country-level aggregated wind potential (mean
 * wind speed, power density, capacity factor by region), not point queries —
 * useful for REGIONAL context, not exact-site siting (NASA POWER + the model
 * above already give site-level numbers).
 *
 * The Data360 data endpoint follows the pattern:
 *   https://data360api.worldbank.org/data360/data?DATABASE_ID=WB_GWA&INDICATOR=<code>&REF_AREA=<ISO3>
 * The exact INDICATOR codes and response shape must be confirmed against
 * https://data360.worldbank.org/en/dataset/WB_GWA (the page 403'd from this
 * environment). Left gated/unused until verified to avoid shipping an
 * unverified contract. Reference: https://globalwindatlas.info/
 */
export async function getRegionalWindContext(
  _iso3CountryCode: string
): Promise<null> {
  // Intentionally a no-op until the Data360 indicator codes are confirmed.
  void _iso3CountryCode;
  return null;
}

// ============================================================================
// BUNDLE — fetch all resources in parallel, resiliently
// ============================================================================

export interface ResourceBundle {
  /** PVGIS loss-adjusted PV yield (primary solar). */
  solarPV: SolarResult | null;
  /** NREL PVWatts cross-check (only when NREL_API_KEY is set). */
  solarPVWatts: SolarResult | null;
  /** NASA POWER wind resource + AEP estimate. */
  wind: WindResult | null;
}

/**
 * Fetch solar (PVGIS + optional PVWatts) and wind resources in parallel. Every
 * sub-fetch is wrapped so one failure (or a blocked network) never breaks the
 * assessment — missing values simply fall back to the climate/heuristic path.
 */
export async function getResources(
  lat: number,
  lon: number,
  peakPowerKw = 5,
  hubHeightM = 15
): Promise<ResourceBundle> {
  const [solarPV, solarPVWatts, wind] = await Promise.all([
    getSolarPV(lat, lon, peakPowerKw).catch(() => null),
    getSolarPVWatts(lat, lon, peakPowerKw).catch(() => null),
    getWindResource(lat, lon, hubHeightM).catch(() => null),
  ]);
  return { solarPV, solarPVWatts, wind };
}
