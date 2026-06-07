"use client";

/**
 * PLACEHOLDER — Phase 2.
 * This route currently confirms the captured address. It is replaced in
 * Phase 3 with the full multi-step questionnaire flow.
 */
import Link from "next/link";
import { MapPin, ArrowLeft } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { Button, Card } from "@/components/ui";

export default function AssessPlaceholderPage() {
  const address = useQuestionnaireStore((s) => s.address);

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <Card padding="lg" className="w-full max-w-lg text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-energy glow-energy">
          <MapPin size={22} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold">
          Assessment starting soon
        </h1>
        <p className="mt-3 text-ink-soft">
          The multi-step questionnaire arrives in the next build phase.
        </p>
        {address ? (
          <p className="mt-4 rounded-btn bg-surface px-4 py-3 font-mono text-sm text-ink">
            {address}
          </p>
        ) : (
          <p className="mt-4 text-sm text-ink-faint">No address captured yet.</p>
        )}
        <Link href="/" className="mt-6 inline-block">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={16} /> Back home
          </Button>
        </Link>
      </Card>
    </main>
  );
}
