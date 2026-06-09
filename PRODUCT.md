# Product

## Register

product

## Users

Homeowners and property owners (primarily Canada and North America) who want to understand whether renewable energy makes sense for their specific home. They arrive curious, not committed: they may have seen a neighbour's solar install, received a rebate mailer, or just had a high energy bill. They're not engineers; they want a credible answer in plain language without hiring a consultant or sitting through a sales call. They use the tool on a laptop or phone, typically in one sitting, in a low-distraction context at home.

## Product Purpose

Everstead runs a location-specific renewable energy assessment using real climate data (NASA POWER, PVGIS), a short questionnaire (property, appliances, goals, optional photos), and AI analysis via Claude. It produces technology recommendations (solar, wind, geothermal, battery), cost and rebate estimates, and 25-year savings and emissions projections — without requiring a utility bill or an account to try it. Account creation is only prompted when the user wants to save their assessment. Success means the user finishes knowing: "here is what would work for my home, here is what it costs, here is when it pays back, and here is how to act on it."

## Brand Personality

Authoritative, warm, precise. The product speaks with the confidence of an expert who has run the numbers honestly: no hype, no inflated savings promises, no fabricated proof metrics. The warmth comes from tone and visual texture, not from softening the data. "Bold, optimistic" earns its place because the projections are grounded — the product can be bold about a 12-year payback because it actually modelled the location.

Reference: ilabsolutions.it — the specific quality to capture is considered, non-generic visual identity that still serves a technical product; confident layout without SaaS templating.

## Anti-references

- **Solar company marketing sites** — stock panel photography, bright-orange CTAs, "Save with solar!" headlines. Everstead's authority comes from data, not aspiration.
- **Generic SaaS dashboards** — navy + blue palette, glassmorphism cards, identical stat grids, enterprise-grade branding. The warm teal + amber palette and editorial typography already differentiate; keep that.
- **Overly playful fintech apps** — chunky rounded cards, loud gradients, emoji-heavy UX, neobank energy. Everstead is technical and the numbers are serious.
- **Government/utility portals** — bureaucratic density, form-heavy flows, trust through officialness. The product earns trust through transparency and precision, not institutional weight.

## Design Principles

1. **Data before promise.** Every projection is sourced from real location data. Surface the methodology when the stakes are high (payback period, 25-year savings). Never inflate a number.
2. **Earn trust through honesty.** The mock-assessment flag, approximate-estimate warnings, and "sample data" labels are features, not apologies. Users trust a tool that admits its uncertainty.
3. **The interface disappears into the task.** Users are on a mission to get their assessment. UI chrome, navigation, and decorative elements step back; the questionnaire and results are the whole product.
4. **Warm precision.** Climate science and energy financials are technical. The experience should make them feel approachable without dumbing them down: warm typography and texture carry the tone, the data carries the weight.
5. **Full value before the ask.** The complete assessment runs without an account. Signup is only prompted when the user wants to preserve something. Never gate the core experience.

## Accessibility & Inclusion

Target: WCAG 2.1 AAA. Considerations: keyboard-navigable questionnaire flow, screen-reader-announced step progress and form errors, reduced-motion respected throughout (all Framer Motion animations have `prefers-reduced-motion` alternatives), colour-independent state signalling (not contrast-only), sufficient text contrast on all themed backgrounds. The teal + amber palette requires care on light backgrounds — verify all body and label text against the `--bg-base` (#faf7f1) background at AAA thresholds (7:1 for normal text).
