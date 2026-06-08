"use client";

/**
 * Results route.
 * Triggers the AI assessment (/api/assess) with an energy-themed loader, then
 * renders the full results dashboard. Error state offers a retry.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, RotateCw } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { Button, Card } from "@/components/ui";
import { AssessmentLoader } from "@/components/results/AssessmentLoader";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";

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
    return (
      <ResultsDashboard
        assessment={assessment}
        photos={data.photos}
        warning={warning}
        questionnaireData={data}
      />
    );
  }

  // idle / pre-fetch flash
  return <AssessmentLoader />;
}
