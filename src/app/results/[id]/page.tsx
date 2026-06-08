"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, AlertTriangle } from "lucide-react";
import { useUser } from "@/lib/useUser";
import { getSupabase } from "@/lib/supabase";
import { getAssessment, type SavedAssessmentRow } from "@/lib/assessments";
import { Button, Card, Logo, ThemeToggle } from "@/components/ui";
import { AuthModal } from "@/components/auth/AuthModal";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";

export default function SavedAssessmentPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user, loading, configured } = useUser();
  const [row, setRow] = useState<SavedAssessmentRow | null>(null);
  const [fetching, setFetching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!user || !id) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setFetching(true);
    getAssessment(supabase, id)
      .then((r) => {
        if (!r) setNotFound(true);
        else setRow(r);
      })
      .finally(() => setFetching(false));
  }, [user, id]);

  if (configured && loading) return <FullCenter><Loader2 className="animate-spin text-energy" /></FullCenter>;

  if (!configured) {
    return (
      <Shell>
        <Notice title="Saving isn't set up yet" body="Add your Supabase environment variables to view saved assessments." />
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <Card padding="lg" className="text-center">
          <p className="text-ink-soft">Sign in to view this assessment.</p>
          <Button className="mt-5" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
        </Card>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </Shell>
    );
  }

  if (fetching) return <FullCenter><Loader2 className="animate-spin text-energy" /></FullCenter>;

  if (notFound || !row) {
    return (
      <Shell>
        <Notice
          title="Assessment not found"
          body="It may have been deleted, or it belongs to another account."
        />
        <Link href="/my-assessments" className="mt-4 inline-block">
          <Button variant="secondary">Back to my assessments</Button>
        </Link>
      </Shell>
    );
  }

  return (
    <ResultsDashboard
      assessment={row.assessment_result}
      photos={[]}
      warning={null}
      saved
    />
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen px-6 py-6">
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </header>
        {children}
      </div>
    </main>
  );
}

function FullCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Card padding="lg">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-solar" size={20} />
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{body}</p>
        </div>
      </div>
    </Card>
  );
}
