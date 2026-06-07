"use client";

/**
 * Results route — Phase 4.
 * Triggers the AI assessment (/api/assess) with an energy-themed loader, and
 * shows a lightweight success view. Phase 5 replaces the success view with the
 * full results dashboard (charts, recommendations, savings projections).
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, RotateCw, Zap, DollarSign, Clock, Leaf } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { Button, Card, Logo, ThemeToggle, StatCard } from "@/components/ui";
import { AssessmentLoader } from "@/components/results/AssessmentLoader";

export default function ResultsPage() {
  const router = useRouter();
  const {
    data,
    assessment,
    status,
    error,
    setStatus,
    setAssessment,
    setError,
  } = useQuestionnaireStore();
  const [mounted, setMounted] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !data.address) router.replace("/");
  }, [mounted, data.address, router]);

  const runAssessment = async () => {
    setStatus("loading");
    setError(null);
    setWarning(null);
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireData: data }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Assessment failed. Please try again.");
      }
      if (json.warning) setWarning(json.warning);
      setAssessment(json.assessment);
      setStatus("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  };

  // Kick off the assessment once on mount when needed.
  useEffect(() => {
    if (!mounted || !data.address) return;
    if (startedRef.current) return;
    if (status === "idle" && !assessment) {
      startedRef.current = true;
      runAssessment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, data.address, status, assessment]);

  if (!mounted || !data.address) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-faint">
        Loading…
      </div>
    );
  }

  if (status === "loading") return <AssessmentLoader />;

  if (status === "error") {
    return (
      <main className="relative flex min-h-screen items-center justify-center px-6">
        <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
        <Card padding="lg" className="w-full max-w-md text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-danger">
            <AlertTriangle size={24} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold">
            We hit a snag
          </h1>
          <p className="mt-2 text-ink-soft">{error}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button onClick={runAssessment}>
              <RotateCw size={16} /> Try again
            </Button>
            <Link href="/assess">
              <Button variant="secondary">
                <ArrowLeft size={16} /> Edit answers
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    );
  }

  if (status === "done" && assessment) {
    const { financial, environmental, recommendations } = assessment;
    const annualProduction = recommendations
      .filter((r) => r.recommended)
      .reduce((s, r) => s + (r.estimatedAnnualProduction || 0), 0);

    return (
      <main className="relative min-h-screen px-6 py-8">
        <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
        <div className="mx-auto max-w-4xl">
          <header className="mb-10 flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </header>

          <p className="caption text-energy">Your assessment</p>
          <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Clean Energy Assessment
          </h1>
          <p className="mt-2 text-ink-soft">{assessment.meta?.address ?? data.address}</p>

          {(warning || assessment.meta?.mock) && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-btn bg-surface px-4 py-2 text-sm text-ink-soft">
              <AlertTriangle size={15} className="text-solar" />
              {warning ??
                "Sample assessment (no Anthropic API key configured). Add a key to generate a live AI analysis."}
            </p>
          )}

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Annual production"
              value={annualProduction}
              suffix=" kWh"
              icon={Zap}
              accent="energy"
            />
            <StatCard
              label="Net cost after rebates"
              value={financial.netCost}
              prefix="$"
              icon={DollarSign}
              accent="solar"
            />
            <StatCard
              label="Payback period"
              value={financial.paybackYears}
              decimals={1}
              suffix=" yrs"
              icon={Clock}
              accent="wind"
            />
            <StatCard
              label="CO₂ avoided / yr"
              value={environmental.annualCo2AvoidedTonnes}
              decimals={1}
              suffix=" t"
              icon={Leaf}
              accent="savings"
            />
          </div>

          <Card className="mt-8">
            <p className="text-ink-soft">
              The full interactive results dashboard — energy-profile chart,
              location viability, recommendation cards, and the 25-year savings &
              emissions graphs — arrives in the next build phase. Your structured
              assessment is ready and saved in this session.
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-energy">
                View raw assessment JSON
              </summary>
              <pre className="mt-3 max-h-96 overflow-auto rounded-card bg-surface p-4 font-mono text-xs text-ink-soft">
                {JSON.stringify(assessment, null, 2)}
              </pre>
            </details>
            <div className="mt-6 flex gap-3">
              <Link href="/assess">
                <Button variant="secondary" size="sm">
                  <ArrowLeft size={16} /> Edit answers
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  // idle / pre-fetch flash
  return <AssessmentLoader />;
}
