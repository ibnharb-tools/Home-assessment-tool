import type { Metadata } from "next";
import { type LucideIcon, MapPin, Cpu, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Everstead turns your address into a complete renewable energy assessment in minutes.",
};

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  body: string[];
  detail: { label: string; items: string[] };
}

const steps: Step[] = [
  {
    num: "01",
    icon: MapPin,
    title: "Tell us about your home",
    body: [
      "Enter your address and answer a short questionnaire: property type, roof orientation, occupants, appliances, and your energy goals. You can also upload photos so Everstead's AI can read your roof area and shading directly.",
      "The whole thing takes under five minutes. No utility bill, no account, and no technical knowledge required.",
    ],
    detail: {
      label: "What you need",
      items: [
        "Your address or postal code",
        "Rough home size and type",
        "About 5 minutes",
      ],
    },
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI builds your energy profile",
    body: [
      "Everstead pulls real climate data for your exact coordinates: solar irradiance, wind speeds, and ground temperatures from NASA POWER and PVGIS. Claude then models your household's energy consumption from the questionnaire answers and identifies which technologies will actually perform at your location.",
      "A home in Vancouver and one in Phoenix get different assessments because they have fundamentally different energy profiles. Every recommendation is grounded in measured local data, not averaged national figures.",
    ],
    detail: {
      label: "Data sources",
      items: [
        "NASA POWER solar and wind records",
        "PVGIS irradiance datasets",
        "Regional ground temperature profiles",
      ],
    },
  },
  {
    num: "03",
    icon: FileText,
    title: "Read your assessment",
    body: [
      "You receive a full breakdown: which technologies fit your property (solar, wind, geothermal, battery storage), installation cost estimates, 25-year savings projections, avoided greenhouse gas emissions, and every rebate or grant available in your jurisdiction.",
      "Save it to an account to return later, or use it as a working document when talking to installers. The assessment is yours, no strings attached.",
    ],
    detail: {
      label: "What you get",
      items: [
        "Technology recommendations",
        "Cost and payback estimates",
        "25-year savings projection",
        "Local rebates and grants",
        "Greenhouse gas avoided",
      ],
    },
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Intro */}
        <section className="mx-auto max-w-[1200px] px-6 pt-32 pb-12 md:px-8 md:pt-36">
          <Reveal>
            <p className="caption text-energy">How it works</p>
            <h1 className="mt-4 max-w-[22ch] text-balance font-display text-5xl font-extrabold leading-[1.04] tracking-[-0.02em] md:text-6xl">
              Address to action plan in under ten minutes
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg text-ink-soft">
              Everstead runs a complete renewable energy assessment from your
              address. Real climate data, AI analysis, and a plain-language
              report. No consultant, no sales call, no account required to try
              it.
            </p>
          </Reveal>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-[1200px] px-6 md:px-8">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 0.08}>
              <div className="grid gap-8 border-t border-line py-12 lg:grid-cols-12 lg:gap-6">
                {/* number + content */}
                <div className="flex items-start gap-5 lg:col-span-8">
                  <span className="shrink-0 font-mono text-4xl font-bold tabular-nums text-energy/40 md:text-5xl">
                    {step.num}
                  </span>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-surface text-energy">
                        <step.icon size={20} strokeWidth={1.75} />
                      </span>
                      <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                        {step.title}
                      </h2>
                    </div>
                    <div className="mt-5 max-w-[58ch] space-y-4 text-ink-soft">
                      {step.body.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* detail sidebar */}
                <div className="lg:col-span-4 lg:pt-1">
                  <p className="text-sm font-medium text-ink-faint">
                    {step.detail.label}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {step.detail.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-ink-soft"
                      >
                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-energy" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}

          {/* CTA */}
          <Reveal>
            <div className="border-t border-line pb-28 pt-14">
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Ready to see what your home can do?
              </h2>
              <p className="mt-3 max-w-[48ch] text-ink-soft">
                Start your free assessment. No account, no utility bill, no
                installer visit required.
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex items-center gap-2 rounded-btn bg-energy px-6 py-3.5 text-base font-semibold text-accent-ink transition-opacity hover:opacity-90"
              >
                Start your assessment <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
