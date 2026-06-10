"use client";

import { BadgeCheck, ExternalLink, Landmark } from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

/**
 * Financing options + grants. When the user enabled the Shariah-compliant
 * toggle, the engine returns only riba-free structures; each option still shows
 * its compliance badge so it is clear.
 */
export function Financing({ assessment }: { assessment: Assessment }) {
  const financing = assessment.financing ?? [];
  const grants = assessment.grants ?? [];
  if (financing.length === 0 && grants.length === 0) return null;

  return (
    <Reveal>
      <div>
        <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-4xl">
          Financing and grants
        </h2>
        <p className="mt-3 max-w-[60ch] text-ink-soft">
          Ways to fund your plan, including government programs. Figures are
          estimates; confirm terms with each provider.
        </p>

        {financing.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {financing.map((f, i) => (
              <Card key={i} padding="md" className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{f.name}</h3>
                    <p className="caption text-ink-faint">
                      {f.provider} · {f.type}
                    </p>
                  </div>
                  {f.shariahCompliant && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-savings/10 px-2.5 py-0.5 text-xs font-medium text-savings">
                      <BadgeCheck size={13} /> Halal
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-ink-soft">{f.summary}</p>
                {f.url && (
                  <a
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-energy hover:underline"
                  >
                    Learn more <ExternalLink size={13} />
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}

        {grants.length > 0 && (
          <div className="mt-6 rounded-card border border-line bg-surface/50 p-5">
            <p className="caption mb-3 inline-flex items-center gap-2 text-ink-soft">
              <Landmark size={15} className="text-solar" /> Grant programs
            </p>
            <ul className="space-y-2">
              {grants.map((g, i) => (
                <li key={i} className="text-sm">
                  {g.url ? (
                    <a href={g.url} target="_blank" rel="noopener noreferrer" className="font-medium text-energy hover:underline">
                      {g.label}
                    </a>
                  ) : (
                    <span className="font-medium text-ink">{g.label}</span>
                  )}
                  <span className="text-ink-faint"> — {g.source}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  );
}
