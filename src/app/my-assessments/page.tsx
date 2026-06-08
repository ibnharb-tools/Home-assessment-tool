"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  MapPin,
  Zap,
  DollarSign,
  Leaf,
  LogOut,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { useUser } from "@/lib/useUser";
import { getSupabase } from "@/lib/supabase";
import { listAssessments, type SavedAssessmentRow } from "@/lib/assessments";
import { Logo, ThemeToggle, Button, Card } from "@/components/ui";
import { AuthModal } from "@/components/auth/AuthModal";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function MyAssessmentsPage() {
  const { user, loading, configured } = useUser();
  const [rows, setRows] = useState<SavedAssessmentRow[] | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const supabase = getSupabase();
    if (!supabase) return;
    setFetching(true);
    setError(null); // clear any stale error before refetching
    listAssessments(supabase)
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [user]);

  const signOut = async () => {
    await getSupabase()?.auth.signOut();
    setRows(null);
  };

  return (
    <main className="relative min-h-screen px-6 py-6">
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="secondary" size="sm">
                <Plus size={16} /> New
              </Button>
            </Link>
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut size={16} /> Sign out
              </Button>
            )}
          </div>
        </header>

        <h1 className="font-display text-3xl font-bold md:text-4xl">
          My Assessments
        </h1>

        {/* States */}
        {!configured ? (
          <Notice
            title="Saving isn't set up yet"
            body="Add your Supabase environment variables and run supabase/schema.sql to enable accounts and saved assessments."
          />
        ) : loading ? (
          <Centered>
            <Loader2 className="animate-spin text-energy" />
          </Centered>
        ) : !user ? (
          <Card padding="lg" className="mt-8 text-center">
            <p className="text-ink-soft">
              Sign in to view assessments you&apos;ve saved.
            </p>
            <Button className="mt-5" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
          </Card>
        ) : fetching ? (
          <Centered>
            <Loader2 className="animate-spin text-energy" />
          </Centered>
        ) : error ? (
          <Notice title="Couldn't load your assessments" body={error} />
        ) : rows && rows.length === 0 ? (
          <Card padding="lg" className="mt-8 text-center">
            <p className="text-ink-soft">
              You haven&apos;t saved any assessments yet.
            </p>
            <Link href="/assess" className="mt-5 inline-block">
              <Button>Start your first assessment</Button>
            </Link>
          </Card>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rows?.map((row, i) => (
              <motion.div
                key={row.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link href={`/results/${row.id}`}>
                  <Card interactive padding="md" className="h-full">
                    <div className="flex items-start gap-2 text-ink-soft">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-energy" />
                      <span className="font-medium text-ink [overflow-wrap:anywhere]">
                        {row.nickname || row.address}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-faint">
                      {new Date(row.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <Stat
                        icon={<DollarSign size={14} />}
                        text={formatCurrency(
                          row.assessment_result.financial.netCost
                        )}
                        accent="text-solar"
                      />
                      <Stat
                        icon={<Zap size={14} />}
                        text={`${row.assessment_result.financial.paybackYears} yr`}
                        accent="text-energy"
                      />
                      <Stat
                        icon={<Leaf size={14} />}
                        text={`${formatNumber(row.assessment_result.environmental.annualCo2AvoidedTonnes, 1)} t/yr`}
                        accent="text-savings"
                      />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}

function Stat({
  icon,
  text,
  accent,
}: {
  icon: React.ReactNode;
  text: string;
  accent: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${accent}`}>
      {icon}
      {text}
    </span>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mt-16 flex justify-center">{children}</div>;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <Card padding="lg" className="mt-8">
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
