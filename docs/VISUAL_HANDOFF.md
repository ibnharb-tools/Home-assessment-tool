# Everstead — Build Handoff for impeccable (visual / front-end)

The backend, data model, and the data-driven UI are done and on the branch. This
doc is the remaining **visual + layout** scope to execute locally with impeccable,
plus the exact data contract the UI reads from.

## Agreed direction
- **Headings:** Playfair Display Bold. **Body:** Jost (free Futura substitute).
- **2.5D** scroll scenery (no heavy WebGL) — performance first.
- **Live-data-first** pricing/grants (graceful fallback, "verify with supplier").
- **Retrieval:** methodology registry + keyword search (no vector DB).
- Visual direction: **lusion.co** motion polish + **thedigitalpanda.com** scroll-driven
  side elements (turbines / panels filling the viewport edges). Immersive, realistic.

---

## ✅ Done and on the branch (backend + data UI)
- **Grounded engine:** `src/lib/methodology.ts` (cited RED-model + textbook equations),
  `src/lib/retrieval.ts` + `src/lib/corpus.json` (keyword search over your report + the
  textbook, 264 chunks), injected into every prompt with `(title, page)` citations.
- **Live pricing/grants:** Anthropic `web_search`/`web_fetch` server tools wired in
  `src/lib/anthropic.ts` (budget-filtered, cited). Runs on Vercel/local with a key.
- **Data model** (`src/types/index.ts`): Table III columns on `Recommendation`
  (`unitPrice/installationCost/maintenanceCostPerYear/energyRequiredKwh/energyProducedKwh`),
  `options[]`, `citations[]`; `Assessment.financing[]`, `grants[]`, `citations[]`;
  `QuestionnaireData.shariahCompliant`.
- **Results UI for all of the above (built + wired):**
  - `CostTable.tsx` — the Table III table (Unit Price / Installation / Maintenance /
    Energy Required / Energy Produced), product options as sub-rows, budget-filtered, totals, source links.
  - `Financing.tsx` — financing options with a **Halal** badge + grant links.
  - `Sources.tsx` — collapsible "Sources and equations" listing every citation.
- **Shariah toggle** — on the questionnaire Goals step, store-backed, end-to-end with the
  engine (ON → riba-free financing only). Verified.
- **Logging** (`logging.ts` + `assessment_logs` table — run `supabase/schema.sql`).
- **Typography** swapped to Playfair + Jost; **second hero CTA removed**.
- Savings/emissions already recompute live on the technology toggle.
- **2D floor-plan engine (functionality done):** `src/lib/floorplan.ts` →
  `buildFloorPlan(data, systems?)` returns a structured `FloorPlan` (typed in
  `src/types/index.ts`). Added a **"How many floors?"** input to Step 1. Verified:
  rooms pack per floor, appliances place into the right rooms, systems place on
  roof / in garage / outdoors. **Only the rendering is left** (item 0 below).

> **Data contract:** the UI reads everything straight off `assessment` — including the new
> `recommendation.unitPrice/options[]/citations[]` and `assessment.financing/grants/citations`.
> No further data work needed.

---

## ⏳ Remaining — visual / layout (impeccable)

### 0. ⭐ Live 2D floor-plan visualization (the marquee feature)
**Reference look & feel:** https://floor-plan.ai/2d-floor-plan — a clean, top-down 2D
floor plan with labelled rooms, wall lines, and icons.

**The data is already generated for you** — no logic to write. Call:
```ts
import { buildFloorPlan } from "@/lib/floorplan";
const plan = buildFloorPlan(data /* QuestionnaireData */, selectedSystems?);
```
`plan: FloorPlan` (see `src/types/index.ts`):
- `floors` (number), `width`/`height` (footprint in grid units, ~1 unit = 1 m).
- `rooms[]`: `{ id, kind, label, floor, x, y, w, h }` — draw each as a wall-outlined
  rectangle with its label; group/show by `floor`.
- `appliances[]`: `{ applianceId, label, icon, roomId, floor, x, y }` — `icon` is a
  lucide name (use the existing `Icon` registry); drop it at `(x,y)` inside its room.
- `systems[]`: `{ system, label, floor, x, y, outdoor }` — solar on the roof (top floor),
  wind/geothermal outdoors, battery in the garage.

**Behaviour to build:**
- Render it **live in the questionnaire** (right side / sticky panel) and have it **build up
  as the user answers**: rooms appear/animate in as room counts change (Step 1), the floors
  control adds storeys (a small floor switcher or stacked view), appliance icons pop into
  rooms as they're selected (Step 3). Derive the plan from the live store with
  `const plan = useMemo(() => buildFloorPlan(data), [data])`.
- **Carry it onto the results page** ("your home"), and feed the **selected technologies** in
  so solar/wind/geo/battery appear on the plan (`buildFloorPlan(data, [...selected])`), updating
  live with the toggle. This is also the home for the "Edit your home" panel.
- Style it to the floor-plan.ai reference, themed to the site (teal lines on warm paper /
  warm-dark). Animate with transform/opacity; respect `prefers-reduced-motion`.
- Coordinates are grid units — scale to a responsive pixel box; center the footprint.

### 1. Scroll lag — diagnose then fix
Profile a scroll (DevTools Performance). Likely causes, in order:
- `HomeScene` SVG filters (`feGaussianBlur`, `feDropShadow`) + the `mask-image` recompositing
  each frame → replace with static shadows; drop/cheapen the mask.
- Lenis + Framer `useScroll`/`useTransform` parallax forcing layout reads → transform-only,
  single rAF.
- Many `Reveal`/IntersectionObserver wrappers → `content-visibility:auto` + `contain:paint`
  on offscreen sections.
- Fixed `grid-bg`/`noise`/`backdrop-blur` layers → cap blur.

### 2. Immersive 2.5D scroll scenery (lusion / Panda)
- New `src/components/landing/ScrollScenery.tsx`: fixed, full-viewport, `pointer-events:none`,
  behind content. Reuse the SVG `Turbine`/panel/geothermal pieces as parallax **layers** that
  enter from the left/right edges driven by `useScroll`. Transform/opacity only; respect
  `prefers-reduced-motion`; simplify on mobile. Lenis is already installed.

### 3. Graph-paper engineering theme
- Add a themed `.graph-paper` background (reuse `.grid-bg`; fine teal grid + stronger major
  lines every 5th) and apply it to the section backgrounds on **`/assess`** and **results**.

### 4. Hero polish
- **Stretch the address/search bar** to fill the vertical gap down to the
  "Everything you need to go renewable" heading; even top-of-page spacing, no overlap.
- Make the home bigger / more realistic (continue `HomeScene` or swap to a layered asset).
- Optional: turn the hero sample into a fuller interactive mini-dashboard (the results donut +
  stat cards already exist to reuse).

### 5. Questionnaire (`/assess`)
- **Appliances & Usage won't scroll** — the step body sits inside the `AnimatePresence`
  slide wrapper in `QuestionnaireFlow.tsx` (`<div className="relative mt-10">` → `motion.div`
  animating `x`). Ensure that wrapper has no height clamp / `overflow:hidden`, and that the
  transform isn't trapping scroll; the page itself should scroll (outer is `min-h-screen` +
  `pb-32`). Verify against `overflow-x: clip` on `body`.
- **Box sizing:** appliance `SelectableCard` labels wrap (e.g. "Electric Stove / Oven",
  "Water Heater (electric)"). Widen cells / shorten labels (in `questionnaire-options.ts`) so
  each fits on one line; `white-space:nowrap`.
- Add moving, interactive per-step graphics (turbine/solar/geo/battery — reuse the SVG pieces).
- Graph-paper background (item 3). The Shariah toggle is already there.

### 6. Results page
- Graph-paper background (item 3).
- **`NextSteps.tsx`:** make each item an expandable accordion with real working links
  (supplier lists, grant program pages — `assessment.grants` already carries URLs).
- The cost table, financing, citations sections are built; restyle to match the new visual
  language as needed.

### 7. Copy sweep (site-wide)
- Remove AI-sounding phrasing and **all em dashes (—)** across `src/**`. Replace with periods,
  commas, or " - ". (I avoided the global sweep to prevent merge conflicts with your local edits.)

### 8. Font check
- Confirm Playfair/Jost render well at every heading size; tune weights/tracking.

---

## Notes / coordination
- Live web tools can't run in the cloud sandbox (network blocked); they work on Vercel/local
  with `ANTHROPIC_API_KEY`. Keep "verify with supplier" labels + the budget filter.
- We co-edit this branch. **Pull before editing** shared files (`Hero.tsx`, `ResultsDashboard.tsx`,
  `globals.css`, questionnaire steps).
- Run `supabase/schema.sql` for the new `assessment_logs` table.
