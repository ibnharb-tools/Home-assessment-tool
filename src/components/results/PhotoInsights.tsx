"use client";

import { Camera } from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

/**
 * Photo insights — shown only when photos were uploaded. `photos` are the
 * data URLs from the questionnaire store; `assessment.photoInsights` is the
 * AI's observation text (or a note in mock mode).
 */
export function PhotoInsights({
  assessment,
  photos,
}: {
  assessment: Assessment;
  photos: string[];
}) {
  if (photos.length === 0) return null;

  return (
    <Reveal>
      <Card padding="lg">
        <p className="caption text-energy">Property insights</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          What we saw in your photos
        </h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URL
              <img
                key={i}
                src={src}
                alt={`Property ${i + 1}`}
                className="aspect-square w-full rounded-card border border-line object-cover"
              />
            ))}
          </div>

          <div className="flex">
            <div className="rounded-card border border-line bg-surface/60 p-5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-btn bg-elevated text-energy">
                <Camera size={18} />
              </span>
              <p className="mt-4 text-ink-soft">
                {assessment.photoInsights ??
                  "No specific observations were returned for these photos."}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}
