"use client";

import { useState } from "react";
import {
  HardHat,
  ClipboardList,
  Landmark,
  ChevronDown,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { cn, formatCurrency } from "@/lib/utils";

interface Link {
  label: string;
  url: string;
}
interface Step {
  Icon: LucideIcon;
  accent: string;
  title: string;
  detail: string;
  links: Link[];
}

const dedupe = (links: Link[]) => {
  const seen = new Set<string>();
  return links.filter((l) => l.url && !seen.has(l.url) && seen.add(l.url));
};

export function NextSteps({ assessment }: { assessment: Assessment }) {
  const { financial } = assessment;
  const [open, setOpen] = useState<number>(0);

  const grantLinks = (assessment.grants ?? [])
    .filter((g) => g.url)
    .map((g) => ({ label: g.label, url: g.url as string }));
  const financeLinks = (assessment.financing ?? [])
    .filter((f) => f.url)
    .map((f) => ({ label: `${f.name} — ${f.provider}`, url: f.url as string }));

  const steps: Step[] = [
    {
      Icon: HardHat,
      accent: "text-energy",
      title: "Get installer quotes",
      detail:
        "The modelled costs use regional benchmarks. A certified local installer confirms sizing and gives a firm quote for your roof, electrical panel, and permits. Get two or three quotes.",
      links: dedupe([
        { label: "CanREA member directory (installers & suppliers)", url: "https://renewablesassociation.ca/membership/our-members/" },
        { label: "Canada Greener Homes — book an energy advisor", url: "https://natural-resources.canada.ca/energy-efficiency/homes/canada-greener-homes-initiative" },
      ]),
    },
    {
      Icon: ClipboardList,
      accent: "text-savings",
      title: "Apply for rebates before installation",
      detail: `${formatCurrency(financial.estimatedRebates)} in incentives are included in this estimate. Most programs require pre-approval before any work begins; applying after install forfeits the incentive.`,
      links: dedupe([
        ...grantLinks,
        { label: "Canada Greener Homes Initiative", url: "https://natural-resources.canada.ca/energy-efficiency/homes/canada-greener-homes-initiative" },
        { label: "Find programs by province (NRCan)", url: "https://natural-resources.canada.ca/energy-efficiency/homes" },
      ]),
    },
    {
      Icon: Landmark,
      accent: "text-solar",
      title: "Review your financing options",
      detail: `Your net cost of ${formatCurrency(financial.netCost)} can be spread through low- or no-interest programs, reducing the day-one cash you need.`,
      links: dedupe([
        ...financeLinks,
        { label: "Canada Greener Homes Loan (interest-free)", url: "https://natural-resources.canada.ca/energy-efficiency/homes/canada-greener-homes-initiative" },
      ]),
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

        <div className="mt-8 divide-y divide-line border-y border-line">
          {steps.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 py-4 text-left focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy"
                >
                  <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-surface", s.accent)}>
                    <s.Icon size={18} aria-hidden />
                  </span>
                  <span className="flex-1 font-semibold text-ink">
                    <span className="mr-2 font-mono text-ink-faint">{i + 1}.</span>
                    {s.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={cn("shrink-0 text-ink-faint transition-transform", isOpen && "rotate-180")}
                  />
                </button>

                {isOpen && (
                  <div className="pb-5 pl-14">
                    <p className="text-sm leading-relaxed text-ink-soft">{s.detail}</p>
                    <ul className="mt-3 space-y-2">
                      {s.links.map((l, j) => (
                        <li key={j}>
                          <a
                            href={l.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-energy hover:underline"
                          >
                            {l.label}
                            <ExternalLink size={13} aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </Reveal>
  );
}
