"use client";

import { ClipboardList, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: "01",
    icon: ClipboardList,
    title: "Tell us about your home",
    desc: "Answer a quick questionnaire about your property, appliances, and energy habits. Takes under five minutes.",
  },
  {
    num: "02",
    icon: Sparkles,
    title: "AI does the analysis",
    desc: "Our engine calculates your energy profile and identifies which renewable technologies make sense for your exact location.",
  },
  {
    num: "03",
    icon: TrendingUp,
    title: "See your energy future",
    desc: "Get a detailed plan with cost estimates, savings projections, and the greenhouse gases you'll prevent.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-8 md:py-32"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="caption text-energy">How it works</p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
          From questions to clean energy
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 0.12}>
            <Card interactive className="h-full">
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-bold text-energy [text-shadow:0_0_18px_color-mix(in_srgb,var(--energy-primary)_45%,transparent)]">
                  {step.num}
                </span>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-energy glow-energy">
                  <step.icon size={22} />
                </span>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-ink-soft">{step.desc}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
