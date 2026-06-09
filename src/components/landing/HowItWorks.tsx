"use client";

import { ClipboardList, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
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
    desc: "Answer a quick questionnaire about your property, appliances, and energy habits. Under five minutes.",
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
    desc: "A detailed plan with cost estimates, savings projections, and the greenhouse gases you'll prevent.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-[1200px] px-6 py-16 md:px-8 md:py-20"
    >
      <Reveal>
        <h2 className="font-display text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
          From questions to clean energy
        </h2>
      </Reveal>

      <div className="mt-10 flex flex-col">
        {steps.map((step, i) => (
          <Reveal key={step.num} delay={i * 0.08}>
            <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-7 sm:grid-cols-[6rem_auto_1fr] sm:gap-8">
              <span className="font-mono text-3xl font-bold text-energy sm:text-4xl">
                {step.num}
              </span>
              <span className="hidden h-12 w-12 items-center justify-center rounded-btn bg-surface text-energy sm:inline-flex">
                <step.icon size={22} />
              </span>
              <div className="max-w-[60ch]">
                <h3 className="font-display text-xl font-semibold md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 text-ink-soft">{step.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
        <div className="border-t border-line" />
      </div>
    </section>
  );
}
