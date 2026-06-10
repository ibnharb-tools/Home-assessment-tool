# Everstead — Build Handoff (visual + UI wiring)

Companion to the planning discussion. This records the agreed decisions, what is
**already wired (backend/data/typography)**, and a precise spec for the
**remaining visual + UI work** to hand to `impeccable` locally.

## Agreed decisions
- **Futura → Jost** (free Futura-like geometric sans). Headings: **Playfair Display Bold**.
- **2.5D** scroll scenery (not heavy WebGL/3D) — perf first.
- **Live data first** for pricing/grants (with graceful fallback + "verify with supplier").
- **Retrieval:** curated **methodology registry** + **keyword search** over a corpus (no vector DB).
- Anything heavy/visual I cannot verify blind goes here for impeccable.

---

## ✅ Already done (backend, data model, typography)
- **Methodology registry** `src/lib/methodology.ts` — the finite, cited equation set (RED model from your report + Masters textbook). Injected into every assessment prompt; each figure must cite its equation.
- **Retrieval** `src/lib/retrieval.ts` + `src/lib/corpus.json` — keyword/TF-IDF search over your report + the textbook (264 chunks). Top passages are pulled into each prompt with `(title, p.N)` citations. Rebuild the corpus with the pymupdf snippet in this repo's history if you add docs.
- **Live pricing/grants** wired in `src/lib/anthropic.ts` via Anthropic server tools `web_search` + `web_fetch` (with a `pause_turn` resume loop). Untested in this sandbox (network blocked); verify on Vercel with `ANTHROPIC_API_KEY`.
- **Data model** (`src/types/index.ts`) extended — the UI can now render:
  - `Recommendation.unitPrice / installationCost / maintenanceCostPerYear / energyRequiredKwh / energyProducedKwh` (your Report **Table III** columns)
  - `Recommendation.options[]` (`ProductOption`: name, supplier, prices, energy, `url`, `sourceCitation`) — budget-filtered live products
  - `Recommendation.citations[]` and top-level `Assessment.citations[]`, `Assessment.grants[]`
  - `Assessment.financing[]` (`FinancingOption` with `shariahCompliant` flag)
  - `QuestionnaireData.shariahCompliant` (drives riba-free financing)
- **Mock** (`src/lib/mock.ts`) fully populates all of the above (so the UI has real data with no API key). Shariah toggle verified: ON → only riba-free financing.
- **Logging** `src/lib/logging.ts` + `assessment_logs` table in `supabase/schema.sql` (run it). Console + best-effort Supabase insert; never blocks a response.
- **Typography** swapped to Playfair Display + Jost (`layout.tsx`, `globals.css`).
- **Removed** the second hero CTA box (`ClosingCTA`) from the landing.

> **Data contract for the UI:** read the fields above straight off `assessment`. They already update live with the technology toggle via `recomputeFromSelection` — extend that to recompute the table rows too if you add per-option math.

---

## ⏳ Remaining work for impeccable (visual + UI)

### 1. Scroll lag — diagnose, then fix
Profile first (DevTools Performance, record a scroll). Likely culprits, in order:
- **SVG filters** in `HomeScene` (`feGaussianBlur`, `feDropShadow`) + the `mask-image` recompositing every frame → replace with **static** shadows/pre-baked blur; drop the radial mask or make it a cheap gradient overlay.
- **Lenis + Framer `useScroll`/`useTransform` parallax** forcing layout reads → ensure Lenis drives a single rAF, animate **transform only**, avoid `top/left`.
- Many `Reveal`/IntersectionObserver wrappers → batch, or use CSS `content-visibility: auto` + `contain: paint` on offscreen sections.
- Fixed `grid-bg`/`noise`/`backdrop-blur` layers → cap blur, mark `will-change: transform` sparingly.

### 2. Immersive 2.5D scroll scenery (lusion.co / thedigitalpanda style)
- New component e.g. `src/components/landing/ScrollScenery.tsx`: fixed, full-viewport, `pointer-events:none`, `-z-10` layer behind content.
- Reuse the existing SVG `Turbine`/panel/geothermal pieces as **layers**; drive their `x`/`rotate`/`opacity` from `useScroll` so turbines and solar panels **enter from the left/right edges** as the user scrolls, parallaxing at different depths.
- Keep to transform/opacity only; respect `prefers-reduced-motion`; mobile = simplified/disabled.
- Lenis is already installed for the smooth base.

### 3. Graph-paper engineering theme
- Reuse the `.grid-bg` token; add a themed `.graph-paper` utility (light + dark) — fine teal grid lines on the warm paper, slightly stronger major lines every 5th.
- Apply as the section background on **`/assess`** and the **results** page so they match the landing grid.

### 4. Hero polish
- **Stretch the address/search bar** so it fills the vertical gap down to the "Everything you need to go renewable" heading; make all top-of-page spacing even, no overlap.
- Make the home **bigger / more realistic** (continue the `HomeScene` detailing or swap to a layered asset).
- **Replace the static sample with a full interactive mini-dashboard** based on `docs/` hero reference image: the 4 stat cards + the energy donut, with the technology toggles live (reuse `recomputeFromSelection`).

### 5. Questionnaire (`/assess`)
- **Appliances & Usage step won't scroll** — fix the overflow container (the step body likely has a fixed height / `overflow:hidden`; make it `overflow-y:auto` with proper height, or remove the clamp). **Enlarge the option boxes so each label fits on one line** (no wrap): widen cells, `white-space:nowrap`, shrink/relabel long ones.
- Add **moving, interactive graphics per step** (turbine/solar/geothermal/battery) — reuse the SVG pieces.
- Graph-paper background (item 3).
- **Shariah toggle UI:** add a switch on the Goals step bound to `store.data.shariahCompliant` (already in the type + read by the engine). Label: "Shariah-compliant financing only".

### 6. Results page
- **CostTable component** (`src/components/results/CostTable.tsx`): a table per recommended technology (or one combined table) with columns **Unit Price ($) · Installation ($) · Maintenance ($/yr) · Energy Required (kWh) · Energy Produced (kWh)**, rows = `recommendation.options[]` (fallback to the single `unitPrice/...` fields). Filter rows to the user's budget. Show the `sourceCitation`/`url` per row.
- **Financing section:** render `assessment.financing[]` with a "Halal" badge when `shariahCompliant`. **Grants:** render `assessment.grants[]` as real links.
- **Citations:** render `recommendation.citations[]` + `assessment.citations[]` (e.g. a "Sources & equations" expander) so every number traces to a document/equation or a supplier URL.
- **"What to do next"** (`NextSteps.tsx`): make each item an **expandable accordion** with real working links (supplier lists, grant program pages).
- Graph-paper background (item 3). Live savings/emissions on toggle already work.

### 7. Copy sweep (site-wide)
- Remove AI-sounding phrasing and **all em dashes (—)**. Replace em dashes with periods, commas, or " - " as appropriate. Touch all `src/components/**` and page copy.

---

## Notes / caveats
- Live web tools can't be exercised in the cloud sandbox (network blocked) — they run on Vercel/local with a key. Keep the "verify with supplier" labeling and budget filter.
- We are co-editing this branch. Pull before editing shared files (`Hero.tsx`, results components, `globals.css`).
