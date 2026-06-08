"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, DollarSign, Clock, Leaf, AlertTriangle, Plus } from "lucide-react";
import type { Assessment, QuestionnaireData } from "@/types";
import { Logo, ThemeToggle, StatCard, Button } from "@/components/ui";
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

  const annualProduction = assessment.recommendations
    .filter((r) => r.recommended)
    .reduce((s, r) => s + (r.estimatedAnnualProduction || 0), 0);

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
            <Link href="/assess">
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
          <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Your Clean Energy{" "}
            <span className="text-gradient-energy">Assessment</span>
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

        {/* Hero stats */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Annual production" value={annualProduction} suffix=" kWh" icon={Zap} accent="energy" />
          <StatCard label="Net cost after rebates" value={assessment.financial.netCost} prefix="$" icon={DollarSign} accent="solar" />
          <StatCard label="Payback period" value={assessment.financial.paybackYears} decimals={1} suffix=" yrs" icon={Clock} accent="wind" />
          <StatCard label="CO₂ avoided / yr" value={assessment.environmental.annualCo2AvoidedTonnes} decimals={1} suffix=" t" icon={Leaf} accent="savings" />
        </div>

        {/* Sections */}
        <div className="mt-16 space-y-16">
          <EnergyProfile assessment={assessment} />
          <Viability assessment={assessment} />
          <Recommendations assessment={assessment} />
          <PhotoInsights assessment={assessment} photos={photos} />
          <SavingsCharts assessment={assessment} />
          <FinancialBreakdown assessment={assessment} />
          <EnvironmentalImpact assessment={assessment} />
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
