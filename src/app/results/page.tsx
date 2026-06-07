"use client";

/**
 * PLACEHOLDER — Phase 3.
 * Confirms the questionnaire data captured in the store. Phase 4 wires the AI
 * assessment call + loading animation here; Phase 5 replaces this with the full
 * results dashboard.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { Button, Card, Logo, ThemeToggle } from "@/components/ui";
import { APPLIANCES } from "@/lib/questionnaire-options";

export default function ResultsPlaceholderPage() {
  const router = useRouter();
  const { data } = useQuestionnaireStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && !data.address) router.replace("/");
  }, [mounted, data.address, router]);

  if (!mounted || !data.address) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-faint">
        Loading…
      </div>
    );
  }

  const applianceLabel = (id: string) =>
    APPLIANCES.find((a) => a.id === id)?.label ?? id;

  return (
    <main className="relative min-h-screen px-6 py-8">
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>

        <Card padding="lg">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-savings glow-energy">
            <CheckCircle2 size={24} />
          </span>
          <h1 className="mt-6 font-display text-2xl font-bold md:text-3xl">
            Questionnaire complete
          </h1>
          <p className="mt-2 text-ink-soft">
            Your answers are captured. The AI assessment engine and full results
            dashboard arrive in the next build phases.
          </p>

          <dl className="mt-8 space-y-3 text-sm">
            <Row label="Address" value={data.address} />
            <Row label="Property type" value={data.propertyType ?? "—"} />
            <Row
              label="Rooms / occupants"
              value={`${data.rooms} rooms · ${data.occupants} people`}
            />
            <Row
              label="Floor area"
              value={
                data.floorArea
                  ? `${data.floorArea} ${data.areaUnit === "sqft" ? "sq ft" : "sq m"}`
                  : "—"
              }
            />
            <Row label="Grid connection" value={data.gridConnection ?? "—"} />
            <Row
              label="Existing renewables"
              value={
                data.hasRenewables
                  ? data.existingRenewables.join(", ") || "yes"
                  : "none"
              }
            />
            <Row
              label="Appliances"
              value={
                data.appliances.map((a) => applianceLabel(a.id)).join(", ") ||
                "—"
              }
            />
            <Row label="Goals" value={data.goals.join(", ") || "—"} />
            <Row label="Budget" value={data.budget ?? "—"} />
            <Row label="Timeframe" value={data.timeframe ?? "—"} />
            <Row label="Photos" value={`${data.photos.length} uploaded`} />
          </dl>

          <div className="mt-8 flex gap-3">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-line pb-3">
      <dt className="text-ink-faint">{label}</dt>
      <dd className="text-right font-medium text-ink [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  );
}
