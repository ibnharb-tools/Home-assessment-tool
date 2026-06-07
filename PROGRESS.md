# Everstead — Build Progress

Shared source of truth across sessions. Updated as each phase completes.

Last updated: 2026-06-07

---

## Status Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project initialization & verification | ✅ Done |
| 1 | Design system foundation | ✅ Done |
| 2 | Landing page | ✅ Done |
| 3 | Questionnaire state & flow | ✅ Done |
| 4 | AI assessment engine (API route) | ✅ Done |
| 5 | Results dashboard | ⏳ Pending |
| 6 | Auth & saving (Supabase) | ⏳ Pending |
| 7 | Polish & handoff | ⏳ Pending |

---

## Phase 0 — Project initialization & verification ✅

**Done:**
- Scaffolded a Next.js app (App Router, TypeScript, Tailwind, ESLint, `/src` dir, `@/*` alias).
- Installed dependencies: `framer-motion`, `recharts`, `lucide-react`, `next-themes`, `zustand`, `@anthropic-ai/sdk`, `@supabase/supabase-js`.
- Verified the dev server starts and the default page loads (HTTP 200).
- Created `.env.local.example` with the required variables.
- Created this `PROGRESS.md`.

**Verification:** `npm run dev` → "Ready in ~361ms", `curl localhost:3000` → HTTP 200.

---

## Phase 1 — Design system foundation ✅

**Done:**
- Rewrote `src/app/globals.css` with the full design system:
  - CSS variables for **both** themes (light default + dark), from spec §3.2.
  - Tailwind v4 `@theme inline` token mapping → utilities follow the live theme
    (`bg-base/elevated/surface/deepest`, `text-ink/-soft/-faint`,
    `text-energy/solar/wind/savings`, `border-line/-line-glow`, `font-display/mono`,
    `rounded-btn/card/panel`).
  - Reusable effect classes: `.glass`, `.glass-strong`, `.glow-energy/solar/wind`,
    `.text-gradient-energy/solar`, `.ambient-glow`, `.grid-bg` (animated), `.noise-overlay`,
    `.orb` + `.orb-float`, `.pulse-dot`, `.caption`. Glow/orb/grid/noise intensities are
    theme-tuned (subtler in light, richer in dark) via `--glow-strength`, `--orb-opacity`,
    `--grid-opacity`, `--noise-opacity`. Honors `prefers-reduced-motion`.
- Fonts loaded via `next/font/google` in `layout.tsx`: **Sora** (600/700/800),
  **Outfit** (300/400/500/600), **JetBrains Mono** (400/500/700).
- `next-themes` configured via `src/components/theme-provider.tsx`:
  `attribute="data-theme"`, `defaultTheme="light"`, `enableSystem={false}`, persisted.
  `suppressHydrationWarning` on `<html>`.
- Core UI components in `src/components/ui/`: `Button` (primary/secondary/ghost + sizes,
  hover lift + tap scale), `Card` (glass/solid, interactive, glow), `Input` (label/hint/error/
  icon/trailing, focus glow), `StatCard` (+ `AnimatedNumber` count-up), `ProgressBar`
  (animated gradient fill), `Logo` (swappable placeholder, clearly commented), `ThemeToggle`
  (animated sun/moon). Barrel export at `ui/index.ts`. Helper `src/lib/utils.ts`
  (`cn`, `formatCurrency`, `formatNumber`).
- `/components-preview` page renders every component for visual verification in both themes.

**Verification:** `npm run build` ✓ (compiles, types pass, all routes static).
Dev server: `/` and `/components-preview` both HTTP 200, no console errors.

---

## Phase 2 — Landing page ✅

**Done:**
- Full landing page (`src/app/page.tsx`) composed from `src/components/landing/`:
  - `Nav` — fixed glass nav; background intensifies on scroll; logo, theme toggle,
    anchor links, "Sign in"; collapses to an animated mobile menu.
  - `Hero` — full-viewport; ambient glow + animated grid + noise + 3 floating orbs;
    caption pill with pulsing dot; staggered on-load reveal of headline/subhead/CTA;
    animated scroll hint.
  - `AddressEntry` (shared) — glass address input + integrated "Start Assessment" button,
    captures address to the store and routes to `/assess`; inline validation;
    "Free to try. No account needed." trust line.
  - `HowItWorks` — 3 numbered glass step cards (ClipboardList / Sparkles / TrendingUp).
  - `Capabilities` — 6-feature glass grid.
  - `VisualPreview` — real embedded Recharts area chart (projected savings) + mini stats,
    a representative dashboard preview.
  - `ClosingCTA` — repeated address entry with strong ambient glow.
  - `Footer` — glass-topped, logo, tagline, placeholder links, copyright.
- `Reveal` scroll-reveal helper (fade + slide, on-mount or whileInView).
- Minimal `useQuestionnaireStore` (Zustand + sessionStorage persist) holding the address;
  expanded to the full questionnaire shape in Phase 3.
- Placeholder `/assess` page confirming the captured address (replaced in Phase 3).
- Ambient effects are theme-tuned (subtle in light, richer in dark) via the Phase 1 vars.

**Verification:** `npm run build` ✓. Dev server: `/` and `/assess` HTTP 200; all six
landing section headlines present in rendered HTML; no runtime errors.

**Note:** A benign Recharts SSR warning ("width(-1)/height(-1)") prints during static
prerender of pages containing `ResponsiveContainer`; charts size correctly in the browser.
Final pixel-level visual polish in both themes is best confirmed in a real browser.

---

## Key Decisions & Deviations

1. **Project lives at the repository root**, not in a nested `everstead/` subfolder as the
   spec's file tree implies. The git repo *is* the home-assessment tool, so a nested folder
   would be redundant. The `package.json` name is `everstead`.

2. **Newer stack than the spec's baseline.** `create-next-app@latest` produced:
   - **Next.js 16** (spec said "14+", satisfied) — uses the App Router and **Turbopack** for dev.
   - **React 19** (spec said "18+", satisfied).
   - **Tailwind CSS v4** (spec assumed v3). This is the most significant deviation:
     Tailwind v4 is **CSS-first** — configured via `@theme` / `@import "tailwindcss"` in
     `globals.css` rather than a `tailwind.config.ts` with `theme.extend`. The design-system
     CSS variables (both themes) will be wired into Tailwind tokens using the v4 CSS approach.
     A `tailwind.config.ts` may still be added if needed for content/plugins, but theme tokens
     live in CSS.
   All chosen libraries (framer-motion 12, recharts 3, lucide-react, next-themes) support
   React 19 in their current versions; install completed with no peer-dependency conflicts.

---

## Phase 3 — Questionnaire state & flow ✅

**Done:**
- Shared types in `src/types/index.ts` (`QuestionnaireData`, `Assessment` + sub-types).
- Expanded `useQuestionnaireStore` (Zustand + sessionStorage persist) to the full shape:
  per-step data, `currentStep`/nav, appliance toggles, array toggles, plus
  `assessment`/`status`/`error` lifecycle fields ready for Phase 4.
- Option catalogs in `src/lib/questionnaire-options.ts` (property types, grid options,
  renewables, 17 appliances, usage frequencies, goals, budgets, timeframes, step names).
- Shared questionnaire controls (Hallmark-disciplined: full states, keyboard, focus rings,
  44px targets, `overflow-wrap` on labels): `SelectableCard` (single/multi),
  `NumberStepper`, `SegmentedControl` (animated slider), `Field`, plus an explicit
  `Icon` registry mapping option icon-names to lucide components.
- Five steps in `src/components/questionnaire/steps/`: Property basics, Energy connection
  (conditional renewables + optional kWh), Appliances & usage (per-appliance quantity +
  frequency; lighting type), Energy goals (+ budget/timeframe), Photos (drag-drop upload,
  client-side downscale via `src/lib/image.ts`, thumbnail grid with remove).
- `QuestionnaireFlow` shell: address confirmation chip, progress bar, "Step N of 5",
  direction-aware slide transitions, per-step validation, Back/Next, clickable step dots,
  "Generate my assessment" / Skip on the last step. Guards: redirects to `/` if no address.
- `/assess` renders the flow; `/results` is a placeholder summarizing captured data
  (replaced by the dashboard in Phase 5; AI call added in Phase 4).

**Verification:** `npm run build` ✓ (7 routes, types pass). Dev server: `/`, `/assess`,
`/results`, `/components-preview` all HTTP 200; `/assess` shows the no-address guard state;
no runtime errors. Interactive 5-step click-through is best confirmed in a browser.

---

## Phase 4 — AI assessment engine (API route) ✅

**Done:**
- `src/lib/geocode.ts` — Nominatim geocoding (no key, descriptive User-Agent).
- `src/lib/climate.ts` — NASA POWER climatology (annual solar/wind/temp), with an
  Open-Meteo fallback; degrades to nulls if both are unavailable.
- `src/lib/anthropic.ts` — `buildAssessment()` using `@anthropic-ai/sdk`,
  model **`claude-sonnet-4-6`** (per spec), with the structured engineer prompt
  (rating thresholds, Canadian Greener Homes rebate assumptions), Claude **vision**
  image blocks for uploaded photos, and defensive JSON extraction. `hasAnthropicKey()` gate.
- `src/lib/mock.ts` — deterministic, plausible fallback assessment derived from the
  questionnaire + real climate (so the app runs fully without a key). Tuned for credible
  financials: geothermal recommended only at "High" viability (electric-heat homes), payback
  measured on energy-generating systems (battery treated as resilience, included in honest
  net cost but excluded from payback).
- `src/app/api/assess/route.ts` — orchestrates geocode → climate → AI (or mock). Validates
  address (422), **degrades gracefully** if geocoding is unavailable (returns an approximate
  estimate with a warning rather than hard-failing), and falls back to mock if the AI call
  errors. Attaches `meta` (address, coords, generatedAt, mock flag).
- `src/components/results/AssessmentLoader.tsx` — energy-themed loader (pulsing concentric
  rings + rotating status messages), honoring reduced-motion.
- `/results` now calls `/api/assess` on mount with the loader, an error state with retry,
  and a lightweight success view (hero StatCards + raw-JSON disclosure). Questionnaire submit
  resets prior result so re-submitting re-runs. Full dashboard replaces the success view in Phase 5.

**Verification:** `npm run build` ✓. API tested via curl:
- Valid payloads → HTTP 200 with a complete, schema-correct assessment; breakdown sums to 100%.
- Empty address → HTTP 422.
- Two scenarios produce credible financials (grid house: ~13yr payback; electric-heat+backup:
  ~18yr payback, positive 25yr).

**Sandbox limitation (not a code bug):** outbound calls to Nominatim and NASA POWER return
**403** under this environment's network policy, so the live geocode/climate and live AI paths
can't be exercised here — they work on Vercel (all key-free) and with `ANTHROPIC_API_KEY` set.
The graceful-degradation fallback is what makes the engine verifiable here and resilient in prod.

---

## Design Skill — Hallmark (added mid-build)

User ran `npx skills add nutlope/hallmark` (installed at `.agents/skills/hallmark/`,
symlinked to Claude Code; `skills-lock.json` at repo root). The full skill — `SKILL.md` plus
the complete `references/**` set (macrostructures, themes, components, slop-test, color/
typography/anti-patterns, etc.) — is present, so the full protocol's reference files are
available for the Phase 7 polish pass if useful.

**User decision: "Spec wins, Hallmark polishes."** The Everstead spec remains the source of
truth for the design system (light glassmorphism, teal/solar/wind palette, Sora/Outfit/
JetBrains Mono) and page structure. Hallmark's anti-slop **disciplines** are applied on top of
everything built from here:
- Full interactive states (default/hover/focus-visible/active/disabled/loading/error/success).
- Motion restraint; animate transform/opacity only; honor `prefers-reduced-motion`.
- Mobile floors verified at 320/375/414/768px (no horizontal scroll; no two-line tap targets).
- Honest copy — no fabricated proof metrics (landing preview chart labelled "Sample").
- Token-only colors (added `--danger` token; removed hardcoded error reds). No fake browser/
  phone/IDE chrome. Roman headings only (no italic display).

A consolidated Hallmark polish pass is planned for Phase 7. Existing Phases 0–2 were not
restructured (per the decision); only token/honest-copy touch-ups were applied.

---

## Environment Keys Needed From User (to run live)

- `ANTHROPIC_API_KEY` — required for the live AI assessment. App compiles & runs without it
  (assessment route will fall back to a mock until provided).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for auth & saving.
  App compiles & runs without them (auth/save degrade gracefully).

---

## Pending / Next

- **Phase 5:** Build the full results dashboard (replaces the Phase 4 success view): hero
  stat cards (count-up), energy-profile donut, location viability cards, recommendation cards,
  photo insights, the 25-year Savings & Emissions charts (centerpiece, with view toggle),
  financial breakdown, environmental impact, and the Save CTA. Recharts with the energy
  palette, gradient fills, animated draw-in, hover tooltips.
