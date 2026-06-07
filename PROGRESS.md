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
| 3 | Questionnaire state & flow | ⏳ Pending |
| 4 | AI assessment engine (API route) | ⏳ Pending |
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

## Environment Keys Needed From User (to run live)

- `ANTHROPIC_API_KEY` — required for the live AI assessment. App compiles & runs without it
  (assessment route will fall back to a mock until provided).
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — required for auth & saving.
  App compiles & runs without them (auth/save degrade gracefully).

---

## Pending / Next

- **Phase 3:** Expand the Zustand store to the full questionnaire shape and build the
  multi-step questionnaire (`/assess`): 5 steps (property basics, energy connection,
  appliances & usage, energy goals, photos), animated slide transitions, progress bar,
  validation, back/next, pre-captured address. On submit, route to a results page that
  reads from the store (AI call comes in Phase 4).
