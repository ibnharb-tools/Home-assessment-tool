# Everstead — Data Sources & Methodology

Everstead's assessment engine combines several **free** external data sources with
an AI reasoning layer. All external calls are server-side (from `/api/assess`).
Every source is wrapped so a failure or blocked network degrades gracefully —
the engine never hard-fails.

## Geocoding

| Source | Used for | Key | Code |
|---|---|---|---|
| **Nominatim** (OpenStreetMap) | Address / postal code → coordinates | none | `src/lib/geocode.ts` |
| Direct coordinates | `"lat, lon"` input is used as-is (most precise) | — | `parseCoordinates()` |

## Climate

| Source | Used for | Key | Code |
|---|---|---|---|
| **NASA POWER** (climatology) | Annual solar irradiance (GHI), wind speed @10/50m, temperature | none | `src/lib/climate.ts` |
| **Open-Meteo** | Climate fallback when NASA POWER is unavailable | none | `src/lib/climate.ts` |

## Solar & wind resource modelling — `src/lib/resources.ts`

Higher-fidelity, engineering-grade resource estimates layered on top of the raw
climate data. Fetched in parallel via `getResources()` and threaded into both the
AI prompt (`src/lib/anthropic.ts`) and the deterministic mock (`src/lib/mock.ts`).

| Source | Used for | Key | Notes |
|---|---|---|---|
| **PVGIS 5.3** (EU JRC) | Loss-adjusted PV yield, optimal tilt/azimuth, monthly output | none | Primary solar path (`getSolarPV`). SARAH3 for ±65° lat, ERA5 worldwide. |
| **NREL PVWatts v8** | PV yield cross-check | **`NREL_API_KEY`** | Optional (`getSolarPVWatts`). Returns null without a key. Free key at https://developer.nrel.gov/signup/ |
| **NASA POWER + model** | Wind: shear-extrapolated hub-height speed, Rayleigh (Weibull k=2) capacity factor, AEP, honest viability guardrail | none | `getWindResource()`. Method per *Wind Energy Explained* (Manwell et al., Wiley 2009). |
| **World Bank Data360 — Global Wind Atlas (WB_GWA)** | Regional (country/admin-level) wind context | none | **Reference stub only** (`getRegionalWindContext`). The WB_GWA dataset is aggregated regional data, not point queries; the exact Data360 indicator codes still need confirming, so it is documented and gated, not wired into the engine. See https://data360.worldbank.org/en/dataset/WB_GWA and https://globalwindatlas.info/ |

## AI reasoning

| Source | Used for | Key | Code |
|---|---|---|---|
| **Anthropic `claude-sonnet-4-6`** | Synthesizes all of the above into the structured assessment; analyzes uploaded photos (vision) | **`ANTHROPIC_API_KEY`** | `src/lib/anthropic.ts`. Without a key, the engine returns a deterministic sample (`src/lib/mock.ts`). |

## Environment variables

```
ANTHROPIC_API_KEY=          # live AI assessment (optional — sample without it)
NEXT_PUBLIC_SUPABASE_URL=   # accounts & saving
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NREL_API_KEY=               # optional — enables the NREL PVWatts solar cross-check
```

## References

- PVGIS API: https://re.jrc.ec.europa.eu/api/v5_3/
- NREL PVWatts v8: https://developer.nrel.gov/docs/solar/pvwatts/v8/
- NASA POWER: https://power.larc.nasa.gov/
- Open-Meteo: https://open-meteo.com/
- Nominatim usage policy: https://operations.osmfoundation.org/policies/nominatim/
- Global Wind Atlas: https://globalwindatlas.info/  ·  World Bank Data360: https://data360.worldbank.org/
- Original product spec: [`everstead_build_spec.md`](./everstead_build_spec.md)
