/**
 * Location climate data for energy assessment.
 *
 * Primary source: NASA POWER climatology (no key) — long-term annual averages
 * for solar irradiance, wind speed, and temperature.
 * Fallback / supplement: Open-Meteo (no key) for resilience if NASA POWER is
 * unavailable.
 */

export interface ClimateData {
  /** Annual avg all-sky surface shortwave irradiance, kWh/m²/day. */
  solarIrradiance: number | null;
  /** Annual avg wind speed at 10m, m/s. */
  windSpeed10m: number | null;
  /** Annual avg wind speed at 50m, m/s. */
  windSpeed50m: number | null;
  /** Annual avg air temperature at 2m, °C. */
  avgTempC: number | null;
  source: "nasa-power" | "open-meteo" | "none";
}

const NASA_POWER =
  "https://power.larc.nasa.gov/api/temporal/climatology/point";

interface PowerResponse {
  properties?: {
    parameter?: Record<string, Record<string, number>>;
  };
}

/** ANN is the annual mean key in POWER climatology responses. */
function annual(
  param: Record<string, Record<string, number>> | undefined,
  key: string
): number | null {
  const series = param?.[key];
  if (!series) return null;
  const v = series.ANN;
  if (typeof v === "number" && v > -900) return v; // -999 = fill value
  return null;
}

async function fetchNasaPower(
  lat: number,
  lon: number
): Promise<ClimateData | null> {
  const params =
    "ALLSKY_SFC_SW_DWN,WS10M,WS50M,T2M";
  const url = `${NASA_POWER}?parameters=${params}&community=RE&longitude=${lon}&latitude=${lat}&format=JSON`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const json = (await res.json()) as PowerResponse;
    const p = json.properties?.parameter;
    const solar = annual(p, "ALLSKY_SFC_SW_DWN");
    if (solar === null) return null; // treat missing solar as a failed fetch
    return {
      solarIrradiance: solar,
      windSpeed10m: annual(p, "WS10M"),
      windSpeed50m: annual(p, "WS50M"),
      avgTempC: annual(p, "T2M"),
      source: "nasa-power",
    };
  } catch {
    return null;
  }
}

interface OpenMeteoResponse {
  hourly?: { temperature_2m?: number[]; wind_speed_10m?: number[] };
  daily?: { shortwave_radiation_sum?: number[] };
}

/**
 * Open-Meteo fallback. Pulls a recent year of archive data and averages it.
 * Less precise than POWER climatology but key-free and resilient.
 */
async function fetchOpenMeteo(
  lat: number,
  lon: number
): Promise<ClimateData | null> {
  // Use the forecast API's recent past days for a lightweight estimate.
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,wind_speed_10m&daily=shortwave_radiation_sum&past_days=92&forecast_days=1&wind_speed_unit=ms&timezone=UTC`;
  try {
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;
    const json = (await res.json()) as OpenMeteoResponse;

    const temps = json.hourly?.temperature_2m ?? [];
    const winds = json.hourly?.wind_speed_10m ?? [];
    const rad = json.daily?.shortwave_radiation_sum ?? []; // MJ/m²/day

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const radAvgMj = avg(rad);
    // Convert MJ/m²/day -> kWh/m²/day (1 kWh = 3.6 MJ).
    const solar = radAvgMj !== null ? radAvgMj / 3.6 : null;

    if (solar === null && avg(winds) === null) return null;
    return {
      solarIrradiance: solar,
      windSpeed10m: avg(winds),
      windSpeed50m: avg(winds) !== null ? avg(winds)! * 1.4 : null, // rough 10m->50m shear
      avgTempC: avg(temps),
      source: "open-meteo",
    };
  } catch {
    return null;
  }
}

export async function getClimateData(
  lat: number,
  lon: number
): Promise<ClimateData> {
  const nasa = await fetchNasaPower(lat, lon);
  if (nasa) return nasa;

  const om = await fetchOpenMeteo(lat, lon);
  if (om) return om;

  return {
    solarIrradiance: null,
    windSpeed10m: null,
    windSpeed50m: null,
    avgTempC: null,
    source: "none",
  };
}
