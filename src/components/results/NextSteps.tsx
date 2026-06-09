"use client";

import { HardHat, ClipboardList, Landmark, ArrowUpRight, type LucideIcon } from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { formatCurrency } from "@/lib/utils";

export function NextSteps({ assessment }: { assessment: Assessment }) {
  const { financial } = assessment;

  const steps: StepDef[] = [
    {
      step: 1,
      Icon: HardHat,
      accentText: "text-energy",
      title: "Get installer quotes",
      detail:
        "The modelled costs use regional benchmarks. A certified local installer will confirm sizing and give a firm quote for your specific roof, electrical panel, and permit requirements.",
      cta: "Find a certified installer",
      // Replace with a provincial installer directory once integrated
      href: "#",
    },
    {
      step: 2,
      Icon: ClipboardList,
      accentText: "text-savings",
      title: "Apply for rebates before installation",
      detail: `${formatCurrency(financial.estimatedRebates)} in incentives are included in this estimate. Most federal and provincial programs require a pre-approval application before any work begins — missing this step forfeits the incentive.`,
      cta: "View incentive programs",
      // Replace with Canada Greener Homes or provincial portal URL once integrated
      href: "#",
    },
    {
      step: 3,
      Icon: Landmark,
      accentText: "text-solar",
      title: "Review your financing options",
      detail: `Your net cost of ${formatCurrency(financial.netCost)} can be covered through government low-interest loans or utility payment plans, reducing the day-one cash requirement significantly.`,
      cta: "Explore financing programs",
      // Replace with Canada Greener Homes Loan or provincial green financing URL once integrated
      href: "#",
    },
  ];

  return (
    <Reveal>
      <Card padding="lg">
        <p className="caption text-energy">What to do next</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          From assessment to installation
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Get quotes while applying for rebates, since most incentive programs
          require pre-approval before installation begins.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <StepTile key={s.step} {...s} />
          ))}
        </div>
      </Card>
    </Reveal>
  );
}

interface StepDef {
  step: number;
  Icon: LucideIcon;
  accentText: string;
  title: string;
  detail: string;
  cta: string;
  href: string;
}

function StepTile({ step, Icon, accentText, title, detail, cta, href }: StepDef) {
  return (
    <div className="flex flex-col gap-4 rounded-card border border-line bg-surface/40 p-5 transition-colors hover:bg-surface/80">
      <div className="flex items-start justify-between">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-btn bg-elevated ${accentText}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
        <span
          className={`select-none font-mono text-3xl font-bold opacity-20 ${accentText}`}
          aria-hidden="true"
        >
          {step}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{detail}</p>
      </div>

      <a
        href={href}
        onClick={href === "#" ? (e) => e.preventDefault() : undefined}
        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy ${accentText}`}
      >
        {cta}
        <ArrowUpRight size={13} aria-hidden="true" />
      </a>
    </div>
  );
}
