# Everstead

**AI-powered renewable energy assessment platform.**

Everstead lets anyone assess their home or property for renewable energy
potential — without a utility bill. Answer a short, smart questionnaire about
your property, appliances, and goals; Everstead geocodes your address, pulls
real location-specific climate data, and uses AI to produce a detailed energy
profile, technology recommendations (solar, wind, geothermal, battery), cost and
rebate estimates, and beautiful 25-year savings & emissions projections.

> No login required to try it. Account creation is only prompted when you want to
> **save** your assessment — so you experience the full value first.

---

## Tech stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first design tokens) with a custom light/dark design system
- **Framer Motion** (animation) · **Recharts** (charts) · **Lucide** (icons) · **next-themes**
- **Zustand** (questionnaire state, persisted to `sessionStorage`)
- **Anthropic SDK** (`claude-sonnet-4-6`) for the AI assessment engine
- **Supabase** for email auth + saved assessments
- Free external APIs (no key): **Nominatim** (geocoding), **NASA POWER** + **Open-Meteo** (climate)

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in values:

```bash
cp .env.local.example .env.local
```

```
# Anthropic — required for the live AI assessment.
# Without it the app still runs and returns a deterministic sample assessment.
ANTHROPIC_API_KEY=your_key_here

# Supabase — required for accounts & saving.
# Without these the app still runs; auth/save show a "not configured" message.
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**The app compiles and runs with no keys at all** — the assessment falls back to
a credible sample, and the auth/save UI degrades gracefully. Add keys to unlock
the live experience.

- **Anthropic key:** https://console.anthropic.com → API Keys.
- **Supabase URL + anon key:** create a free project at https://supabase.com →
  Project Settings → API.

### 3. Supabase schema (only needed for saving)

In the Supabase dashboard → **SQL Editor** → run the contents of
[`supabase/schema.sql`](supabase/schema.sql). It creates the `assessments` table,
an index, and a Row-Level-Security policy so each user can only access their own
saved assessments.

Email/password auth works out of the box. To skip the email-confirmation step for
local testing, disable "Confirm email" under Authentication → Providers → Email.

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000.

---

## How it works

```
Landing (enter address)
   → /assess  multi-step questionnaire (property, energy, appliances, goals, photos)
   → POST /api/assess
        1. Geocode address (Nominatim)
        2. Fetch climate data (NASA POWER → Open-Meteo fallback)
        3. Claude (claude-sonnet-4-6) builds the structured assessment
           (+ Claude Vision on uploaded photos). No key → deterministic mock.
   → /results  full dashboard (energy profile, viability, recommendations,
                25-year savings & emissions charts, financials, impact)
   → Save  → AuthModal (Supabase) → /my-assessments, /results/[id]
```

Questionnaire state lives in a Zustand store persisted to `sessionStorage`, so the
assessment is ephemeral until the user creates an account to save it.

### Resilience

- If **geocoding** is unavailable, the engine returns an approximate estimate
  (flagged) instead of failing.
- If the **AI call** fails, it falls back to the deterministic sample assessment.
- Missing **Anthropic** / **Supabase** keys degrade features gracefully rather than
  crashing.

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                 # landing
│   ├── assess/                  # questionnaire flow
│   ├── results/                 # results dashboard (+ [id] for saved)
│   ├── my-assessments/          # saved list (auth-gated)
│   ├── components-preview/      # design-system preview
│   └── api/assess/route.ts      # geocode + climate + Anthropic
├── components/  (ui, landing, questionnaire, results, auth)
├── lib/         (anthropic, geocode, climate, mock, supabase, assessments, utils, image)
├── store/       (questionnaire Zustand store)
└── types/       (shared domain types)
supabase/schema.sql              # run once in the Supabase SQL editor
```

`/components-preview` renders every core UI component in both light and dark
themes — handy for visual QA.

---

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
```

---

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project at https://vercel.com/new.
3. Add the three environment variables (Project → Settings → Environment Variables):
   `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy. Frontend and API routes deploy together; the external climate/geocoding
   APIs require no keys and work from Vercel.

---

## Notes & roadmap

- The **logo** is a swappable placeholder — see `src/components/ui/Logo.tsx`.
- **FUTURE** (structured for, not built): Google/Apple sign-in, utility-bill
  cross-reference, real historical usage tracking alongside projections, 3D
  property visualization, marketplace, monitoring. Integration points are
  commented in the code.

See [`PROGRESS.md`](PROGRESS.md) for the full build log, decisions, and deviations.
