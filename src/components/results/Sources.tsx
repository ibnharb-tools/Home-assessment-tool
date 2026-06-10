"use client";

import { useState } from "react";
import { BookText, ChevronDown, ExternalLink } from "lucide-react";
import type { Assessment, Citation } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

/**
 * Sources & equations — every number in the assessment traces back to a cited
 * methodology equation (your report / the textbook) or a live supplier/grant
 * URL. Collapsed by default.
 */
export function Sources({ assessment }: { assessment: Assessment }) {
  const [open, setOpen] = useState(false);

  const items: Citation[] = [
    ...(assessment.citations ?? []),
    ...assessment.recommendations.flatMap((r) =>
      (r.citations ?? []).map((c) => ({
        ...c,
        label: `${r.technology}: ${c.label}`,
      }))
    ),
  ];
  if (items.length === 0) return null;

  return (
    <Reveal>
      <Card padding="md">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy"
        >
          <span className="inline-flex items-center gap-2 font-display text-lg font-semibold">
            <BookText size={18} className="text-energy" /> Sources and equations
          </span>
          <ChevronDown
            size={18}
            className={cn("shrink-0 text-ink-faint transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <ul className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
            {items.map((c, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-ink">{c.label}</span>
                <span className="text-ink-soft">— {c.source}</span>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-energy hover:underline"
                  >
                    link <ExternalLink size={11} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Reveal>
  );
}
