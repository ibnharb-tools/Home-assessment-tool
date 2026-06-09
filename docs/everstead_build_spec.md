# EVERSTEAD — PRODUCT BUILD SPECIFICATION
# Renewable Energy Assessment Platform (MVP)
# Build document for Claude Code

---

## HOW TO USE THIS DOCUMENT (Instructions for Claude Code)

You are Claude Code, building a complete web application MVP called **Everstead** from this specification. This is a real product that will be demonstrated to a startup accelerator (Antler), so the design quality must be exceptional, futuristic, and beautiful while remaining clean and usable.

**Workflow instructions specific to Claude Code:**

1. **Read this entire document before doing anything.** Then read the BUILD SEQUENCE in section 10. Do not attempt to build the whole app in a single pass. Build it phase by phase, in the order given, verifying each phase compiles and runs before moving to the next.

2. **Work incrementally and verify as you go.** After each phase, run the dev server (or build) to confirm there are no errors, fix anything broken, then continue. Tell me what you completed and what is next before proceeding to the next phase. This prevents a large untested dump of code.

3. **Initialize the project first.** Section 10, Phase 0 gives the exact commands. Run them, confirm the project scaffolds and the dev server starts, then proceed.

4. **Create a `PROGRESS.md` file** at the project root and keep it updated as you complete each phase, listing what is done, what is pending, and any decisions or deviations you made. This is our shared source of truth across sessions.

5. **Environment variables:** create `.env.local.example` with the variables listed in section 2. Do not hardcode secrets. Where an API key is required to run, note clearly in `PROGRESS.md` that I need to supply it, and stub the code so the app still compiles without it.

6. **When something is genuinely ambiguous, ask me before guessing.** Otherwise, follow the spec and use good judgment to fill small gaps.

7. **Where the document marks a feature "FUTURE," do not build it.** Leave a clearly commented placeholder and structure the code so it can be added later.

8. **Suggested prompting rhythm for the user (me):** I will typically say "proceed with Phase N" to advance one phase at a time. If I say "continue," move to the next incomplete phase in the sequence.

Follow the design system in section 3 exactly. The visual quality is as important as the functionality.

---

## 1. PRODUCT OVERVIEW

### What This Product Is
A web platform that lets anyone assess their home or property for renewable energy potential without needing a utility bill. The user answers a smart questionnaire about their property, appliances, and location. An AI engine analyzes this data along with location-specific climate data and produces a detailed energy profile, recommends which renewable technologies are worth installing in their specific area, and visualizes their potential energy savings and greenhouse gas reductions over time through intuitive graphs.

### Core User Journey
1. User lands on a striking landing page with a single clear call to action
2. User enters their address or location to begin
3. User answers a multi-step questionnaire (property details, appliances, occupants, energy goals)
4. User optionally uploads photos of their property
5. AI processes everything and generates a comprehensive energy assessment
6. User sees their energy profile, device recommendations, cost estimates, and savings projections through beautiful interactive graphs
7. User is prompted to create an account to save their assessment
8. If they do not save, they are warned they will lose their work

### The Key Principle
No login required to try it. The entire assessment experience is open and frictionless. Account creation is only prompted when the user wants to SAVE their work. This removes all barriers to experiencing the product value first.

---

## 2. TECHNICAL STACK

Build the application using these exact technologies:

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- Tailwind CSS for styling
- Framer Motion for animations (npm: framer-motion)
- Recharts for data visualization graphs (npm: recharts)
- Lucide React for icons (npm: lucide-react)
- next-themes for light/dark theme management (npm: next-themes)

**Backend:**
- Next.js API routes (keep it monolithic for MVP simplicity, no separate backend server needed)
- Anthropic SDK for AI (npm: @anthropic-ai/sdk)

**Database and Auth:**
- Supabase (free tier) for database and email-based authentication
- Use Supabase client library (npm: @supabase/supabase-js)

**External APIs (all free):**
- NASA POWER API for solar irradiance and wind data (no key required)
- Open-Meteo API for additional climate data (no key required)
- Nominatim (OpenStreetMap) for geocoding addresses to coordinates (no key required)

**Deployment Target:**
- Vercel (frontend and API routes deploy together)

**Environment Variables Needed (create a .env.local.example file):**
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 3. DESIGN SYSTEM

This is the most important section. The product must look futuristic, premium, and beautiful. Think of the aesthetic as "clean energy meets advanced technology" with a sophisticated, almost aerospace-grade feeling. Not childish, not corporate-boring. Refined, confident, forward-looking.

### 3.1 Aesthetic Direction
**Retro-futuristic clean-tech with an emphasis on light, energy, and depth.** The interface should feel like a high-end energy intelligence system. Imagine the control interface of a sophisticated solar installation crossed with a premium financial dashboard. Glassmorphism, subtle gradients, glowing accents, and smooth motion.

**Theme: LIGHT by default, with a light/dark toggle.** The default experience is a bright, airy, premium light theme that feels clean, optimistic, and energy-forward (sunlight, clarity, openness). A dark mode toggle is available for users who prefer it. Both themes must be fully designed and beautiful, not one as an afterthought. The energy-colored accents (teal, solar gold, wind blue) carry across both themes and make data feel alive in either mode.

**Implement the toggle properly:** Use a theme system (next-themes library recommended, npm: next-themes) with CSS variables that swap based on the active theme. Persist the user's choice. Default to light on first visit. Place a clean, animated theme toggle (sun/moon icon that transitions smoothly) in the navigation bar. Respect prefers-color-scheme as the initial hint but default to light if no preference is detected.

### 3.2 Color Palette

Use CSS variables that swap between light and dark themes. Light is the default. Define both theme sets. The energy accent colors stay consistent across themes (with minor brightness tuning for contrast).

```css
/* ===== LIGHT THEME (default) ===== */
:root, [data-theme="light"] {
  /* Foundation - bright, airy, clean */
  --bg-deepest: #FFFFFF;        /* Pure white, deepest */
  --bg-base: #F7F9FC;           /* Base background, soft off-white */
  --bg-elevated: #FFFFFF;       /* Cards, pure white with shadow */
  --bg-surface: #EEF2F8;        /* Interactive surfaces, light grey-blue */

  /* Energy accent - teal/cyan (tuned slightly deeper for light-bg contrast) */
  --energy-primary: #00B89F;    /* Primary energy, readable on white */
  --energy-bright: #00D4B8;     /* Brighter energy highlight */
  --energy-dim: #5FD9C9;        /* Lighter energy tone */

  /* Solar accent - warm amber/gold */
  --solar: #F5A623;             /* Solar gold */
  --solar-bright: #FFB627;      /* Bright solar */

  /* Wind accent - cool blue */
  --wind: #3B82C4;              /* Wind blue */

  /* Success/savings - green */
  --savings: #06B080;           /* Savings green */

  /* Text */
  --text-primary: #0F1726;      /* Primary text, near black */
  --text-secondary: #56627A;    /* Secondary text, muted slate */
  --text-tertiary: #94A0B8;     /* Tertiary text, light */

  /* Borders and dividers */
  --border-subtle: rgba(15, 23, 38, 0.08);
  --border-glow: rgba(0, 184, 159, 0.4);

  /* Glass effect (light) */
  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(255, 255, 255, 0.9);
  --card-shadow: 0 8px 32px rgba(15, 23, 38, 0.08);

  /* Gradients */
  --gradient-energy: linear-gradient(135deg, #00B89F 0%, #3B82C4 100%);
  --gradient-solar: linear-gradient(135deg, #F5A623 0%, #FF6B6B 100%);
  --gradient-hero: linear-gradient(180deg, #FFFFFF 0%, #F7F9FC 100%);
  --gradient-glow: radial-gradient(circle at 50% 0%, rgba(0, 184, 159, 0.10) 0%, transparent 55%);
}

/* ===== DARK THEME (toggle) ===== */
[data-theme="dark"] {
  /* Foundation - deep space */
  --bg-deepest: #0A0E1A;
  --bg-base: #0F1420;
  --bg-elevated: #161C2C;
  --bg-surface: #1D2438;

  /* Energy accent - luminous */
  --energy-primary: #00E5C7;
  --energy-bright: #2DFFE0;
  --energy-dim: #00A896;

  /* Solar accent */
  --solar: #FFB627;
  --solar-bright: #FFD166;

  /* Wind accent */
  --wind: #4EA8DE;

  /* Success/savings */
  --savings: #06D6A0;

  /* Text */
  --text-primary: #F0F4FC;
  --text-secondary: #94A3C4;
  --text-tertiary: #5A6788;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-glow: rgba(0, 229, 199, 0.3);

  /* Glass effect (dark) */
  --glass-bg: rgba(29, 36, 56, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
  --card-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* Gradients */
  --gradient-energy: linear-gradient(135deg, #00E5C7 0%, #4EA8DE 100%);
  --gradient-solar: linear-gradient(135deg, #FFB627 0%, #FF6B6B 100%);
  --gradient-hero: linear-gradient(180deg, #0A0E1A 0%, #0F1420 50%, #161C2C 100%);
  --gradient-glow: radial-gradient(circle at 50% 0%, rgba(0, 229, 199, 0.15) 0%, transparent 60%);
}
```

**Glassmorphism and glow effects should reference the theme-aware variables (--glass-bg, --glass-border, --card-shadow) so they look correct in both themes.** In light mode, glass is frosted-white with soft shadows. In dark mode, glass is deep translucent navy with glowing edges. The ambient background glow, gradient orbs, and grid are present in both themes but more subtle in light mode (lower opacity) so the light theme stays clean and airy rather than busy.

### 3.3 Typography

Do NOT use Inter, Roboto, Arial, or system fonts. Use these distinctive choices loaded from Google Fonts:

- **Display/Headlines:** "Clash Display" or "Space Grotesk" alternative. Use **"Sora"** for headings (geometric, modern, technical feel). Load weights 600, 700, 800.
- **Body text:** Use **"Outfit"** for body and UI text (clean, friendly, contemporary). Load weights 300, 400, 500, 600.
- **Data/Numbers:** Use **"JetBrains Mono"** for numerical data, stats, and energy figures (gives a precise, technical, instrumentation feel). Load weights 400, 500, 700.

Font loading via Google Fonts in the Next.js layout. Import in globals.css or use next/font.

**Type Scale:**
```
Hero headline: 64px to 80px (clamp for responsiveness), font-weight 800, Sora
Section headline: 40px to 48px, font-weight 700, Sora
Subsection: 28px to 32px, font-weight 600, Sora
Card title: 20px to 24px, font-weight 600, Sora
Body large: 18px, font-weight 400, Outfit
Body: 16px, font-weight 400, Outfit
Small: 14px, font-weight 400, Outfit
Caption: 12px, font-weight 500, Outfit, letter-spacing 0.05em, uppercase
Data large: 48px to 56px, font-weight 700, JetBrains Mono
Data medium: 24px to 32px, font-weight 500, JetBrains Mono
```

### 3.4 Spacing and Layout

- Use generous whitespace. The design breathes.
- Max content width: 1200px, centered, with comfortable padding on mobile (24px) and desktop (48px).
- Section vertical padding: 96px to 128px on desktop, 64px on mobile.
- Card padding: 32px on desktop, 24px on mobile.
- Consistent spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (in pixels).
- Border radius: 16px for cards, 12px for buttons, 24px for large panels, 9999px for pills.

### 3.5 Visual Effects and Details

These details are what make it look premium and futuristic. Implement all of them:

**Glassmorphism cards:**
```css
background: rgba(29, 36, 56, 0.6);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

**Glowing accents:** Key interactive elements and data highlights should have a subtle glow:
```css
box-shadow: 0 0 24px rgba(0, 229, 199, 0.3);
```

**Ambient background glow:** The landing page and key sections should have a radial gradient glow emanating from the top center, as if energy is radiating. Use the --gradient-glow variable as a fixed background layer.

**Animated grid background:** A subtle, slowly animating grid of faint lines in the background of the hero section, evoking a technical blueprint or energy field. Very low opacity (rgba white at 0.03). Optional slow drift animation.

**Noise texture overlay:** Apply a very subtle noise/grain texture over backgrounds to add depth and avoid flat digital look. Can be a CSS-generated SVG noise filter at very low opacity (0.02 to 0.04).

**Gradient orbs:** Floating, blurred gradient orbs in the background (teal and blue), slowly drifting, adding atmosphere. Position absolutely, blur heavily (blur 80px to 120px), low opacity.

### 3.6 Motion and Animation

Use Framer Motion. Animation is high-impact but never gratuitous.

- **Page load:** Staggered reveal of elements. Hero headline fades up first, then subheadline, then CTA, each delayed by 0.1 to 0.15s.
- **Scroll reveals:** Elements fade and slide up as they enter viewport (use Framer Motion whileInView).
- **Hover states:** Buttons lift slightly and intensify their glow. Cards lift with increased shadow.
- **Number counters:** When stats or energy figures appear, animate them counting up from zero to final value.
- **Questionnaire transitions:** Smooth horizontal slide between questionnaire steps, with the progress bar filling smoothly.
- **Graph animations:** Charts draw in progressively when they appear (Recharts supports animation).
- **Loading states:** When AI is processing, show an elegant animated loader. Not a generic spinner. Something energy-themed: pulsing concentric rings in energy-teal, or animated flowing particles, with rotating status messages like "Analyzing solar potential," "Calculating wind viability," "Building your energy profile."

### 3.7 Buttons and Interactive Elements

**Primary button:**
- Background: gradient-energy
- Text: dark (--bg-deepest) for contrast on the bright gradient, font-weight 600
- Padding: 16px 32px
- Border radius: 12px
- Glow on hover
- Slight scale up on hover (1.02), scale down on click (0.98)

**Secondary button:**
- Transparent background with glass effect
- Border: 1px solid energy-dim
- Text: energy-primary
- Same padding and radius

**Input fields:**
- Background: bg-surface
- Border: 1px solid border-subtle, transitions to border-glow on focus
- Text: text-primary
- Generous padding (16px)
- Border radius: 12px
- Subtle inner glow on focus

---

## 4. FEATURE SPECIFICATIONS

### 4.1 Landing Page

The landing page is the first impression. It must be stunning.

**Structure (top to bottom):**

**Navigation bar (fixed, glass effect):**
- Left: Logo placeholder (text "Everstead" in Sora 700 for now, user will provide logo later, leave a clearly marked component for easy swap)
- Right: "How it works" link, an animated light/dark theme toggle (sun/moon icon with smooth transition), "Sign in" link (ghost button)
- Glass background that intensifies on scroll

**Hero section (full viewport height):**
- Ambient radial glow from top
- Animated subtle grid background
- Floating gradient orbs
- Centered content:
  - Small caption pill above headline: "AI-POWERED ENERGY INTELLIGENCE" (uppercase, letter-spaced, with a small pulsing dot)
  - Hero headline: "Let's energize your home" (or make the headline dynamic and bold, large Sora 800)
  - Subheadline: "Discover your property's clean energy potential in minutes. No utility bill needed. Just answer a few questions and let our AI design your path to energy independence." (Outfit, text-secondary, max-width 600px centered)
  - Primary CTA: An elegant address input field with an integrated button. Placeholder: "Enter your address to begin." Button says "Start Assessment" with a right arrow icon. The input is wide, glass-styled, with a glow on focus. This is the single clear entry point.
  - Below the input: small trust text "Free to try. No account needed." with a subtle checkmark icon.

**How it works section (3 steps):**
- Section headline: "From questions to clean energy"
- Three glass cards in a row (stack on mobile), each with:
  - A number (01, 02, 03) in JetBrains Mono, energy-primary, glowing
  - An icon (Lucide: ClipboardList, Sparkles, TrendingUp)
  - Card title and short description
  - Step 1: "Tell us about your home" / "Answer a quick questionnaire about your property, appliances, and energy habits. Takes under five minutes."
  - Step 2: "AI does the analysis" / "Our engine calculates your energy profile and identifies which renewable technologies make sense for your exact location."
  - Step 3: "See your energy future" / "Get a detailed plan with cost estimates, savings projections, and the greenhouse gases you'll prevent."

**Capabilities showcase section:**
- Section headline: "Everything you need to go renewable"
- A grid of feature highlights with icons, each in a glass card:
  - Smart energy profiling (no bill required)
  - Location-specific recommendations
  - Solar, wind, geothermal, and battery analysis
  - Cost and rebate calculations
  - Savings and emissions tracking over time
  - Visual property insights from your photos

**Visual preview section:**
- A large showcase area displaying a mockup of the results dashboard (you will build this as a real component, so embed a styled preview of actual graphs here, or a representative visual). Headline: "Your energy, beautifully visualized."

**Closing CTA section:**
- Centered, with strong ambient glow
- Headline: "Ready to see what your home can do?"
- The same address input and start button repeated
- Reinforces the single entry point

**Footer:**
- Minimal, glass-topped
- Logo placeholder, short tagline, copyright
- Links: How it works, Privacy, Contact (can be placeholder links for MVP)

### 4.2 The Questionnaire

After the user enters their address and clicks start, they enter the questionnaire flow. This is a multi-step form with smooth transitions and a persistent progress indicator.

**Design of the questionnaire:**
- Clean, focused, one logical group of questions per step
- Progress bar at top showing completion (animated fill in energy-gradient)
- Step counter "Step 2 of 5"
- Smooth slide transitions between steps (Framer Motion)
- Back and Next buttons (Next validates required fields)
- The address they entered on the landing page is already captured and shown confirmed at the top

**Step 1: Property Basics**
- Property type (selectable cards with icons, not a boring dropdown): House, Apartment/Condo, Farm/Agricultural, Community Building, Commercial
- Number of rooms (elegant number stepper or slider)
- Approximate floor area (input with unit toggle: square feet / square metres)
- Number of people living there (number stepper)
- Ownership (toggle: Own / Rent)

**Step 2: Energy Connection**
- Grid connection status (selectable cards): Fully grid-connected, Partially connected (frequent outages), Off-grid
- Do you currently have any renewable energy? (toggle: Yes / No, if yes show checkboxes for solar, wind, battery, other)
- Approximate average daily electricity usage if known (optional input in kWh, with helper text: "Don't know? No problem, we'll estimate it from your appliances.")

**Step 3: Appliances and Usage**
- A visually appealing checklist of common appliances, each as a selectable card with an icon and a small usage indicator
- Appliances to include: Refrigerator, Freezer, Electric stove/oven, Microwave, Dishwasher, Washing machine, Clothes dryer, Air conditioning, Electric heating, Heat pump, Water heater (electric), Television(s), Computer(s), Lighting (LED/incandescent toggle), EV charger, Well pump, Other
- For each selected appliance, allow specifying quantity and a simple usage frequency (Rarely / Sometimes / Daily / Constantly) via a clean segmented control
- The AI will use built-in wattage and usage-hour assumptions, so the user does not need to know technical details

**Step 4: Energy Goals**
- What is most important to you? (selectable cards, can select multiple): Lower my bills, Energy independence, Reduce my carbon footprint, Backup power reliability, Increase property value
- Budget range (elegant slider or selectable ranges): Under $10k, $10k-$25k, $25k-$50k, $50k+, Not sure yet
- Timeframe (selectable): Ready now, Within 6 months, Within a year, Just exploring

**Step 5: Property Photos (Optional)**
- Drag-and-drop or tap-to-upload area, styled beautifully with glass effect and energy-glow border on hover
- Prompt: "Upload 2 to 6 photos of your property from different angles. This helps our AI understand your roof, orientation, and available space. You can skip this step."
- Show uploaded photo thumbnails in a clean grid
- A clear "Skip this step" option and a "Generate my assessment" primary button

**On submission:** Show the elegant energy-themed loading animation while the AI processes (this will take a few seconds as it calls the AI and climate APIs).

### 4.3 AI Energy Assessment Engine (Backend Logic)

This is the core intelligence. Build a Next.js API route at /api/assess that:

1. Receives all questionnaire data plus the address
2. Geocodes the address to latitude/longitude using Nominatim
3. Fetches climate data from NASA POWER API for that location:
   - Solar irradiance (parameter ALLSKY_SFC_SW_DWN)
   - Wind speed (parameter WS10M and WS50M)
   - Temperature data
   - Use the climatology endpoint: https://power.larc.nasa.gov/api/temporal/climatology/point
4. Sends a structured prompt to the Anthropic API (use model claude-sonnet-4-6) containing all the user data and climate data, asking it to act as an expert energy systems engineer and return a detailed assessment as structured JSON
5. If photos were uploaded, include them in the Claude API call (Claude Vision) and ask it to analyze roof type, orientation, shading, and available space
6. Returns the structured assessment to the frontend

**The AI prompt should instruct Claude to return JSON with this structure:**
```json
{
  "energyProfile": {
    "estimatedDailyKwh": number,
    "estimatedMonthlyKwh": number,
    "estimatedAnnualKwh": number,
    "peakDemandKw": number,
    "breakdown": [
      { "category": "Heating", "kwh": number, "percentage": number },
      { "category": "Cooling", "kwh": number, "percentage": number },
      { "category": "Appliances", "kwh": number, "percentage": number },
      { "category": "Water Heating", "kwh": number, "percentage": number },
      { "category": "Lighting", "kwh": number, "percentage": number },
      { "category": "Other", "kwh": number, "percentage": number }
    ],
    "comparisonToAverage": "string describing how this compares to similar homes in the region"
  },
  "locationData": {
    "solarIrradiance": number,
    "solarRating": "Excellent | Good | Moderate | Poor",
    "windSpeed": number,
    "windRating": "Excellent | Good | Moderate | Poor",
    "geothermalViability": "High | Moderate | Low",
    "climateSummary": "string"
  },
  "recommendations": [
    {
      "technology": "Solar PV",
      "recommended": true,
      "confidence": "High | Medium | Low",
      "systemSize": "string e.g. 7.2 kW",
      "estimatedCost": number,
      "estimatedAnnualProduction": number,
      "coveragePercentage": number,
      "explanation": "plain language why this is or isn't recommended",
      "placement": "string describing where on the property"
    }
    // repeat for Wind, Geothermal, Battery Storage
  ],
  "financial": {
    "totalSystemCost": number,
    "estimatedRebates": number,
    "netCost": number,
    "annualSavings": number,
    "paybackYears": number,
    "twentyFiveYearSavings": number
  },
  "environmental": {
    "annualCo2AvoidedTonnes": number,
    "treesEquivalent": number,
    "kmDrivingEquivalent": number,
    "twentyFiveYearCo2Tonnes": number
  },
  "photoInsights": "string or null, AI observations from uploaded photos"
}
```

**Important for the prompt:** Instruct Claude to base solar and wind ratings on the actual NASA POWER data values passed in. Provide reference thresholds in the prompt (for example, solar irradiance above 5.0 kWh/m2/day is Excellent, 4.0 to 5.0 is Good, etc. and wind speed above 6 m/s at 50m is Excellent for small wind, etc.). Instruct it to apply Canadian federal rebate assumptions (Canada Greener Homes Grant up to $5,000) and note that rebates vary by province. Make the financial math reasonable and clearly estimated, not falsely precise.

### 4.4 Results Dashboard

This is where the magic is shown. After processing, the user lands on a beautiful, scrollable results dashboard. This must be visually impressive since it is the core value and the demo centerpiece.

**Layout (top to bottom):**

**Header section:**
- The property address, confirmed
- A headline like "Your Clean Energy Assessment"
- A few hero stats in large JetBrains Mono numbers with animated count-up: estimated annual production, net cost after rebates, payback period, annual CO2 avoided. Each in a glass stat card with a glowing accent and an icon.

**Energy Profile section:**
- A donut or radial chart (Recharts) showing the energy consumption breakdown by category, using the energy color palette
- The total daily/monthly/annual kWh displayed prominently
- The comparison-to-average text in an elegant callout
- Animate the chart drawing in

**Location Viability section:**
- Three or four cards for Solar, Wind, Geothermal, Battery
- Each shows the rating (Excellent/Good/Moderate/Poor) as a visual gauge or rating bar with appropriate color (solar gold, wind blue, energy teal)
- Show the underlying data (solar irradiance value, wind speed) in JetBrains Mono
- Plain language explanation of the rating

**Recommendations section:**
- For each recommended technology, a detailed glass card:
  - Technology name and icon
  - Recommended or Not Recommended badge (with confidence level)
  - System size, estimated cost, annual production, coverage percentage
  - The placement description
  - The plain-language explanation
- The recommended technologies are visually emphasized; not-recommended ones are present but dimmed with explanation

**Photo Insights section (if photos uploaded):**
- Display the uploaded photos in a clean gallery
- Show the AI's observations about the property in an elegant callout card

**Savings Over Time section (THE GRAPHS - this is a key MVP feature the user specifically wants):**
- An interactive line/area chart (Recharts) showing cumulative savings over 25 years. X-axis is years, Y-axis is dollars. The line climbs, crossing the break-even point which is clearly marked with an annotation. Area under the line filled with an energy gradient.
- A second chart showing cumulative GHG emissions avoided over time (in tonnes CO2), with the same elegant treatment in savings-green.
- A toggle to switch between "Savings" view and "Emissions" view, or show both stacked.
- These charts animate drawing in and are the visual highlight. Make them genuinely beautiful: smooth curves, gradient fills, glowing data points, clean axis labels in Outfit, data values in JetBrains Mono.
- Add a subtle interactive tooltip on hover showing the exact value at each year.

**Financial Breakdown section:**
- A clean breakdown: total system cost, minus rebates, equals net cost
- Annual savings, payback period, 25-year total savings
- Present as an elegant itemized panel, numbers in JetBrains Mono

**Environmental Impact section:**
- The CO2 avoided translated into relatable terms: trees planted equivalent, km of driving avoided
- Use icons and large friendly numbers
- Make it feel meaningful and motivating

**Call to action (Save):**
- A prominent, glowing panel: "Save your assessment"
- Explanation: "Create a free account to save this assessment, track your energy journey over time, and come back to it anytime."
- A warning in softer text: "Heads up: if you leave without saving, you'll lose this assessment."
- Primary button: "Create account to save"
- Secondary: "Continue without saving"

### 4.5 Account Creation and Saving

**The save flow:**
- When user clicks "Create account to save," show a clean modal (glass, centered, with backdrop blur)
- Email and password fields (styled per design system)
- Use Supabase email authentication
- On successful signup, save the current assessment to the database linked to the user
- Show a success state: "Your assessment is saved. Welcome aboard."
- FUTURE (do not build now, but structure for it): Google and Apple sign-in buttons. Leave a clearly commented placeholder section in the auth modal where these will go.

**Saved assessments / dashboard (lightweight for MVP):**
- After login, user can access a simple "My Assessments" page listing their saved assessments with the address, date, and key stats
- Clicking one reopens the full results dashboard for that assessment
- This is where the FUTURE energy tracking over time feature will live (see Future Features)

**Database schema (Supabase):**
```
Table: assessments
- id (uuid, primary key)
- user_id (uuid, foreign key to auth.users)
- created_at (timestamp)
- address (text)
- latitude (float)
- longitude (float)
- questionnaire_data (jsonb)  -- full questionnaire responses
- assessment_result (jsonb)   -- full AI assessment output
- nickname (text, optional, e.g. "My House")
```

### 4.6 The "Energy Over Time" Visualization (MVP Feature)

The user specifically wants, in the MVP, the ability to see through intuitive graphs their overall energy over the years and how much they are saving and the GHGs they are saving.

For the MVP, since there is no real historical usage data yet, this is implemented as PROJECTED data based on the assessment:
- The Savings Over Time and Emissions Over Time charts in the results dashboard (section 4.4) fulfill this
- These project forward 25 years based on the recommended system
- Make them interactive, beautiful, and the visual centerpiece

FUTURE enhancement (do not build now): once a user has an account and can input actual periodic usage data, these same charts will show REAL historical tracking alongside projections. Structure the charting components so they can later accept real data points in addition to projections.

---

## 5. FUTURE FEATURES (DO NOT BUILD NOW - STRUCTURE CODE TO ALLOW THEM LATER)

Clearly comment in the code where these would integrate. Do not implement them.

1. **Utility bill cross-reference:** Optional feature to upload or link a utility account to validate AI estimates against real billing data.
2. **Energy expenditure tracking with tips:** Users log actual energy use over time and receive AI-generated tips on reducing consumption.
3. **Real historical tracking:** The over-time graphs display actual logged usage alongside projections.
4. **Google and Apple authentication:** Social sign-in for easier access.
5. **3D property visualization:** Photogrammetry-based 3D model with device placement and AR via Meta glasses.
6. **Live marketplace with transactions:** Real supplier API integration, quotes, and purchasing.
7. **Monitoring dashboard:** Post-installation system performance monitoring via IoT integration.
8. **Optimize and Expand modules:** Recommendations for system optimization and future expansion.

---

## 6. PAGES AND ROUTES

Build these routes:

```
/                      -> Landing page
/assess                -> The questionnaire flow (multi-step)
/results               -> The results dashboard (reads from state or saved assessment)
/my-assessments        -> List of saved assessments (requires auth)
/results/[id]          -> View a specific saved assessment (requires auth)
```

For MVP, the questionnaire can hold state in React context or a state management approach (Zustand recommended, npm: zustand) so data persists across the multi-step flow and into results without a backend round-trip until assessment submission.

---

## 7. RESPONSIVE DESIGN

- Mobile-first but stunning on desktop
- The questionnaire must work beautifully on mobile (this is where many users will be)
- Charts must be responsive (Recharts ResponsiveContainer)
- Navigation collapses to a clean mobile menu
- Touch-friendly tap targets (minimum 44px)
- Test all layouts at: 375px (mobile), 768px (tablet), 1440px (desktop)

---

## 8. CODE QUALITY AND STRUCTURE

- Use TypeScript throughout
- Use the App Router with a `/src` directory and the `@/*` import alias
- Keep API keys in environment variables, never hardcoded
- Create a reusable design system component set so the aesthetic is consistent
- Comment the AI prompt clearly and make it easy to iterate on
- Make the logo a single swappable component (`Logo.tsx`)
- Handle loading and error states gracefully everywhere (especially the AI call, which may take time or fail)
- Add basic input validation

**Target file structure:**
```
everstead/
├── PROGRESS.md
├── README.md
├── .env.local.example
├── tailwind.config.ts
└── src/
    ├── app/
    │   ├── layout.tsx              # root layout, ThemeProvider, fonts
    │   ├── page.tsx                # landing page
    │   ├── globals.css             # design system variables (both themes)
    │   ├── components-preview/
    │   │   └── page.tsx            # UI component preview (verification)
    │   ├── assess/
    │   │   └── page.tsx            # multi-step questionnaire
    │   ├── results/
    │   │   ├── page.tsx            # results from current session (store)
    │   │   └── [id]/page.tsx       # saved assessment (auth-gated)
    │   ├── my-assessments/
    │   │   └── page.tsx            # list of saved assessments (auth-gated)
    │   └── api/
    │       └── assess/route.ts     # geocode + NASA POWER + Anthropic
    ├── components/
    │   ├── ui/                     # Button, Card, Input, StatCard, ProgressBar, Logo, ThemeToggle
    │   ├── landing/                # Hero, HowItWorks, Capabilities, etc.
    │   ├── questionnaire/          # step components
    │   └── results/               # charts, stat sections, save modal
    ├── lib/
    │   ├── anthropic.ts            # AI client + prompt
    │   ├── geocode.ts              # Nominatim
    │   ├── climate.ts              # NASA POWER + Open-Meteo
    │   └── supabase.ts             # Supabase client
    ├── store/
    │   └── questionnaire.ts        # Zustand store
    └── types/
        └── index.ts                # shared TypeScript types (Assessment, etc.)
```

---

## 9. THE LOGO PLACEHOLDER

The user will provide a logo later. For now:
- Create a `Logo.tsx` component
- It renders the wordmark "Everstead" in Sora font weight 800 with a subtle energy-gradient text fill, and a small glowing dot or spark mark beside it
- Make it theme-aware (legible in both light and dark)
- Clearly comment: "LOGO PLACEHOLDER — user will replace with provided logo image. Swap the contents of this component when the final logo is ready."

---

## 10. BUILD SEQUENCE (Follow This Order, Phase by Phase)

Build one phase at a time. After each phase, verify it compiles and runs, update `PROGRESS.md`, and tell me what is done before continuing. Do not jump ahead.

### Phase 0 — Project initialization and verification
Run these commands to scaffold the project:
```bash
npx create-next-app@latest everstead --typescript --tailwind --eslint --app --src-dir --use-npm --import-alias "@/*"
cd everstead
npm install framer-motion recharts lucide-react next-themes zustand @anthropic-ai/sdk @supabase/supabase-js
```
Then:
- Start the dev server (`npm run dev`) and confirm the default page loads with no errors.
- Create `PROGRESS.md` at the root and `.env.local.example` with the variables from section 2.
- Commit or note the clean baseline.
- **Checkpoint:** report that the project scaffolds and runs before continuing.

### Phase 1 — Design system foundation
- Replace `globals.css` with all CSS variables for BOTH light and dark themes (section 3.2), font imports (Sora, Outfit, JetBrains Mono via next/font or Google Fonts), and base styles.
- Install and configure `next-themes` with **light as the default**, persisted, with a smooth toggle.
- Configure `tailwind.config` to expose the CSS variables as theme tokens so utilities map to the palette.
- Build the core reusable components in `/src/components/ui`: `Button`, `Card` (glass variant), `Input`, `StatCard`, `ProgressBar`, `Logo`, `ThemeToggle`.
- Build a simple `/components-preview` page that renders every UI component in both themes so we can visually verify the system.
- **Checkpoint:** dev server runs, the preview page shows all components correctly in light and dark mode.

### Phase 2 — Landing page
- Build the full landing page (section 4.1): fixed glass nav with logo, theme toggle, and links; hero with ambient glow, animated grid, gradient orbs, and the single address-entry CTA; how-it-works (3 steps); capabilities showcase; visual preview section; closing CTA; footer.
- Implement Framer Motion entrance and scroll-reveal animations.
- Ensure the ambient effects are subtle in light mode, richer in dark mode.
- **Checkpoint:** landing page is responsive (375 / 768 / 1440px) and visually polished in both themes.

### Phase 3 — Questionnaire state and flow
- Set up Zustand store for questionnaire data, persisting across steps and into results.
- Build the multi-step questionnaire (section 4.2): all five steps, animated transitions, progress bar, validation, back/next. The address from the landing page is pre-captured.
- For now, on submit, route to a results page that reads from the store (AI call comes next phase).
- **Checkpoint:** a user can complete all five steps on mobile and desktop; data persists into the results route.

### Phase 4 — AI assessment engine (API route)
- Build `/api/assess` (section 4.3): geocode via Nominatim, fetch NASA POWER climatology, call the Anthropic API (model `claude-sonnet-4-6`) with the structured prompt, return the JSON schema specified. Include uploaded photos via Claude Vision if present.
- Stub gracefully if `ANTHROPIC_API_KEY` is absent so the app still compiles; note in `PROGRESS.md` that the key is required to run live.
- Add the elegant energy-themed loading animation (section 3.6) shown while processing.
- **Checkpoint:** submitting the questionnaire returns a valid structured assessment (test with a real key, or with a mocked response if no key yet).

### Phase 5 — Results dashboard
- Build the full results dashboard (section 4.4): hero stat cards with animated count-up, energy profile donut chart, location viability cards, recommendation cards, photo insights, the Savings-Over-Time and Emissions-Over-Time charts (the visual centerpiece, section 4.6), financial breakdown, environmental impact, and the Save CTA.
- Use Recharts with the energy palette, gradient fills, animated draw-in, hover tooltips.
- **Checkpoint:** dashboard renders beautifully from a real or mocked assessment, charts animate, responsive in both themes.

### Phase 6 — Auth and saving
- Set up Supabase (client, schema from section 4.5). Build the glass auth modal (email/password), the save flow, success state, and the "you'll lose this if you leave" warning.
- Leave a clearly commented placeholder for FUTURE Google/Apple sign-in.
- Build `/my-assessments` and `/results/[id]` for viewing saved assessments (auth-gated).
- **Checkpoint:** a user can create an account, save an assessment, sign in, and reopen it.

### Phase 7 — Polish and handoff
- Refine animations, error/empty/loading states everywhere, accessibility, and responsive edge cases.
- Write a thorough `README.md` with setup instructions (env vars, how to get the Supabase and Anthropic keys, how to run and deploy to Vercel).
- Final pass on `PROGRESS.md`.
- **Checkpoint:** clean build (`npm run build`), no console errors, ready to demo and deploy.

---

## 11. THE FEELING TO ACHIEVE

When someone opens Everstead, they should feel like they have accessed something advanced and premium. Not a clunky government energy calculator. Not a generic SaaS template. Something that feels like the future of energy: intelligent, beautiful, and trustworthy. Every interaction should feel smooth and considered. The data should feel alive through motion and glow. The user should come away thinking "that was genuinely impressive, and I finally understand my energy options."

Build it to that standard.

---

## END OF SPECIFICATION

Claude Code: Read this entire document, then begin with Phase 0 in section 10. Verify each phase before advancing, keep `PROGRESS.md` updated, and ask me before guessing on anything genuinely ambiguous. Build Everstead to the design and quality standard described.
