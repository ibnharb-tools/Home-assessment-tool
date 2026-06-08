"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, DollarSign, Clock, Leaf, AlertTriangle, Plus, RotateCcw } from "lucide-react";
import type { Assessment, QuestionnaireData } from "@/types";
import { Logo, ThemeToggle, StatCard, Button } from "@/components/ui";
import { recomputeFromSelection } from "@/lib/recompute";
import { AuthModal } from "@/components/auth/AuthModal";
import { EnergyProfile } from "./EnergyProfile";
import { Viability } from "./Viability";
import { Recommendations } from "./Recommendations";
import { PhotoInsights } from "./PhotoInsights";
import { SavingsCharts } from "./SavingsCharts";
import { FinancialBreakdown } from "./FinancialBreakdown";
import { EnvironmentalImpact } from "./EnvironmentalImpact";
import { SaveCTA } from "./SaveCTA";

export function ResultsDashboard({
  assessment,
  photos,
  warning,
  questionnaireData,
  saved = false,
}: {
  assessment: Assessment;
  photos: string[];
  warning: string | null;
  /** Present for the live session (enables saving). Absent for a saved view. */
  questionnaireData?: QuestionnaireData;
  /** True when viewing an already-saved assessment (hides the Save CTA). */
  saved?: boolean;
}) {
  const [showSave, setShowSave] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Technologies the AI recommended — the default selection.
  const recommendedTechs = useMemo(
    () =>
      assessment.recommendations.filter((r) => r.recommended).map((r) => r.technology),
    [assessment]
  );
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(recommendedTechs)
  );

  const toggleTech = (tech: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tech)) next.delete(tech);
      else next.add(tech);
      return next;
    });

  // Recompute all totals for the current selection (the "what-if" engine).
  const recomputed = useMemo(
    () => recomputeFromSelection(assessment, selected),
    [assessment, selected]
  );

  // Sections that depend on the selection read these overridden totals.
  const effective: Assessment = useMemo(
    () => ({
      ...assessment,
      financial: recomputed.financial,
      environmental: recomputed.environmental,
    }),
    [assessment, recomputed]
  );

  const isDefaultSelection =
    selected.size === recommendedTechs.length &&
    recommendedTechs.every((t) => selected.has(t));

  const isMock = assessment.meta?.mock;

  return (
    <main className="relative min-h-screen px-6 pb-24 pt-6">
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />

      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <header className="mb-10 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* New starts from the landing entry, which resets the board. */}
            <Link href="/">
              <Button variant="secondary" size="sm">
                <Plus size={16} /> New
              </Button>
            </Link>
          </div>
        </header>

        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-ink-soft">{assessment.meta?.address}</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] md:text-5xl">
            Your clean energy{" "}
            <span className="accent-underline">assessment</span>
          </h1>

          {(warning || isMock) && (
            <p className="mt-4 inline-flex items-start gap-2 rounded-btn bg-surface px-4 py-2 text-sm text-ink-soft">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 text-solar" />
              <span>
                {warning ??
                  "Sample assessment (no Anthropic API key configured). Add ANTHROPIC_API_KEY for a live AI analysis."}
              </span>
            </p>
          )}
        </motion.div>

        {/* Hero stats — reflect the current technology selection. */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Annual production" value={recomputed.annualProduction} suffix=" kWh" icon={Zap} accent="energy" />
          <StatCard label="Net cost after rebates" value={effective.financial.netCost} prefix="$" icon={DollarSign} accent="solar" />
          <StatCard label="Payback period" value={effective.financial.paybackYears} decimals={1} suffix=" yrs" icon={Clock} accent="wind" />
          <StatCard label="CO₂ avoided / yr" value={effective.environmental.annualCo2AvoidedTonnes} decimals={1} suffix=" t" icon={Leaf} accent="savings" />
        </div>

        {!isDefaultSelection && (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-sm text-ink-soft">
              Showing a custom plan ({selected.size}{" "}
              {selected.size === 1 ? "technology" : "technologies"}).
            </span>
            <button
              type="button"
              onClick={() => setSelected(new Set(recommendedTechs))}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-energy hover:underline focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-energy"
            >
              <RotateCcw size={14} /> Reset to recommended
            </button>
          </div>
        )}

        {/* Sections */}
        <div className="mt-16 space-y-16">
          <EnergyProfile assessment={assessment} />
          <Viability assessment={assessment} />
          <Recommendations
            assessment={assessment}
            selected={selected}
            onToggle={toggleTech}
          />
          <PhotoInsights assessment={assessment} photos={photos} />
          <SavingsCharts assessment={effective} />
          <FinancialBreakdown assessment={effective} />
          <EnvironmentalImpact assessment={effective} />
          {!saved && !dismissed && (
            <SaveCTA
              onCreateAccount={() => setShowSave(true)}
              onContinue={() => setDismissed(true)}
            />
          )}
        </div>
      </div>

      <AuthModal
        open={showSave}
        onClose={() => setShowSave(false)}
        toSave={
          questionnaireData
            ? { data: questionnaireData, assessment }
            : null
        }
      />
    </main>
  );
}
