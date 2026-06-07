"use client";

import { Bookmark, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

/**
 * Save CTA panel. The actual account-creation modal + Supabase save flow is
 * wired in Phase 6 — `onCreateAccount` opens it.
 */
export function SaveCTA({
  onCreateAccount,
  onContinue,
}: {
  onCreateAccount: () => void;
  onContinue: () => void;
}) {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-panel glass-strong p-8 text-center md:p-12">
        <div className="ambient-glow pointer-events-none absolute inset-0" />
        <div className="orb orb-energy -z-0 absolute left-1/4 top-0 h-48 w-48 opacity-40" />

        <div className="relative mx-auto max-w-xl">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-gradient-energy text-[var(--bg-deepest)] glow-energy">
            <Bookmark size={22} />
          </span>
          <h2 className="mt-6 font-display text-2xl font-bold md:text-3xl">
            Save your assessment
          </h2>
          <p className="mt-3 text-ink-soft">
            Create a free account to save this assessment, track your energy
            journey over time, and come back to it anytime.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={onCreateAccount}>
              Create account to save
            </Button>
            <Button variant="ghost" size="lg" onClick={onContinue}>
              Continue without saving
            </Button>
          </div>

          <p className="mt-6 inline-flex items-center gap-2 text-sm text-ink-faint">
            <AlertTriangle size={15} className="text-solar" />
            Heads up: if you leave without saving, you&apos;ll lose this assessment.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
