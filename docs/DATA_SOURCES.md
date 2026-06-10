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

## Reference library (`docs/`)

Engineering and economics references that ground the assessment methodology.
Items marked **[in code]** directly inform current model assumptions; the rest
support future expansion (hydro, detailed storage) and validation.

**Solar PV modelling**
- *RE509 — Applied Photovoltaics* · *Solar Energy Engineering: Processes and Systems* ·
  *Renewable and Efficient Electric Power Systems*
- *SAM Photovoltaic Model Technical Reference* · *PVWatts Version 5 Manual* **[in code]**
  (informs the PVWatts/PVGIS yield path in `src/lib/resources.ts`)
- *pvlib python — project update (2023)* · *pvlib iotools (solar irradiance access)* ·
  *Open-source photovoltaic model pipeline validation*

**PV performance loss & degradation** (informs the 25-year projection + system-loss %)
- *Best practices for photovoltaic performance loss rate calculations* **[in code]**
- *Estimating the PLR of PV Systems Using Time Series Change-Point Analysis*
- *Solar RRL 2023 — Deceglie: Performance Loss Rate in PV Systems*
- *Solar RRL 2023 — Theristis: How Climate & Data Quality Impact PLR Estimations*
- *The economic value of PV performance-loss mitigation in electricity spot markets*

**Wind** (informs the shear-extrapolation + Rayleigh capacity-factor model in `resources.ts`) **[in code]**
- *Wind Energy Handbook* · *Aerodynamics of Wind Turbines* ·
  *Fluid Mechanics and Thermodynamics of Turbomachinery*

**Geothermal / heat pumps** (informs geothermal viability + heating-offset assumptions)
- *Design of Ground-Source Heat Pump Systems* · *Ground Source Heat Pump — Residential & Light Commercial*
- *CSA F280 — HVAC Requirements for Part 9 Buildings* · *Intro to thermal/geo*

**Solar thermal**
- *Solar Thermal Energy Systems* · *IEC Solar white paper (CS10111)*

**Storage / batteries** (informs battery cost + resilience modelling)
- *Cost Projections for Utility-Scale Battery Storage (2023 Update)* **[in code-adjacent]**
- *DOE/EPRI Electricity Storage Handbook* · *Handbook of Batteries* ·
  *Battery Management Systems* · *Energy Storage: Fundamentals, Materials & Applications*

**Economics / cost basis** (informs cost, rebate, payback & LCOE assumptions)
- *Lazard LCOE+ (June 2025)* **[in code]** · *A Manual for the Economic Evaluation of Energy Efficiency*
- *OGA IRRs attachment*

**Canadian residential standards** (informs Canadian context + rebate framing)
- *Canadian Home Builders' Association Net Zero Home Labelling — v1.3 Technical Procedures* ·
  *Final NG Mechanicals Decision Guide*

**Hydropower** (FUTURE — supports a planned small-hydro module)
- *Hydropower Engineering Handbook* · *Layman's Guide to Developing a Small Hydro Site* ·
  *Merged Guide — Develop a Small Hydropower Plant*

> A few uploads (e.g. `Sach_Tieng_Anh.pdf`, various `preview…`/`dokumen.pub…` excerpts) appear to
> be previews or unrelated and aren't tied to the methodology — kept for completeness.

## Retrieval corpus (what the AI learns from)

`src/lib/corpus.json` is the searchable corpus the assessment engine retrieves from at request
time (`src/lib/retrieval.ts` → top passages injected into the prompt with `(title, page)`
citations). It currently spans **5 sources**:

- `Harb_MECH4692_Final_Report.pdf` — the user's RED-model report (preferred source of truth)
- `Renewable and Efficient Electric Power Systems.pdf` — Masters textbook
- `Design of Ground-Source Heat Pump Systems.pdf` — Kavanaugh & Rafferty (geothermal sizing/COP)
- `Operation and Maintenance Decision Support.pdf` — O&M / maintenance cost basis
- `Pacheco-Torres_2014_Building_Geometry_PV_Energy.pdf` — Pacheco-Torres et al. (2014),
  *Energy Efficiency*: building geometry vs. PV generation and energy demand

**Rebuild the corpus** after adding/removing PDFs: list the file in `SOURCES` inside
`scripts/extract-corpus.mjs`, then `node scripts/extract-corpus.mjs` and commit the updated
`src/lib/corpus.json`. The methodology registry (`src/lib/methodology.ts`) also cites the
GSHP, O&M, and PV-geometry sources for the matching calculations.

