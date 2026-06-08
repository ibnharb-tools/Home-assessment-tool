"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertTriangle, Mail } from "lucide-react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { saveAssessment } from "@/lib/assessments";
import type { Assessment, QuestionnaireData } from "@/types";
import { Button, Input, Card } from "@/components/ui";

type Mode = "signup" | "signin";
type Phase = "form" | "confirm" | "success";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  /** When provided, the assessment is saved right after authentication. */
  toSave?: { data: QuestionnaireData; assessment: Assessment } | null;
  /** Called after a successful sign-in/up (no save). */
  onAuthed?: () => void;
}

export function AuthModal({ open, onClose, toSave, onAuthed }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("signup");
  const [phase, setPhase] = useState<Phase>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError("Authentication isn't configured yet.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: authErr } =
        mode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (authErr) throw new Error(authErr.message);

      const user = data.user;
      const session = data.session;

      // Sign-up with email confirmation enabled returns no session.
      if (mode === "signup" && !session) {
        setPhase("confirm");
        setLoading(false);
        return;
      }

      if (toSave && user) {
        const { id } = await saveAssessment(
          supabase,
          user.id,
          toSave.data,
          toSave.assessment
        );
        setSavedId(id);
        setPhase("success");
      } else {
        onAuthed?.();
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="relative w-full max-w-md"
            role="dialog"
            aria-modal="true"
          >
            <Card padding="lg" variant="glass">
              <button
                type="button"
                aria-label="Close"
                onClick={onClose}
                className="absolute right-4 top-4 text-ink-faint transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-energy/60 rounded-full"
              >
                <X size={18} />
              </button>

              {!isSupabaseConfigured ? (
                <NotConfigured />
              ) : phase === "success" ? (
                <SuccessState savedId={savedId} onClose={onClose} />
              ) : phase === "confirm" ? (
                <ConfirmState email={email} />
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold">
                    {toSave ? "Save your assessment" : "Welcome back"}
                  </h2>
                  <p className="mt-2 text-sm text-ink-soft">
                    {mode === "signup"
                      ? "Create a free account to keep this assessment and track your energy journey."
                      : "Sign in to access your saved assessments."}
                  </p>

                  {/* mode toggle */}
                  <div className="mt-5 inline-flex rounded-btn border border-line bg-surface p-1 text-sm">
                    {(["signup", "signin"] as Mode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setMode(m);
                          setError(null);
                        }}
                        className={`rounded-[9px] px-4 py-1.5 font-medium transition-colors ${
                          mode === m
                            ? "bg-gradient-energy text-[var(--bg-deepest)]"
                            : "text-ink-soft hover:text-ink"
                        }`}
                      >
                        {m === "signup" ? "Sign up" : "Sign in"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <Input
                      type="email"
                      name="email"
                      label="Email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      type="password"
                      name="password"
                      label="Password"
                      placeholder="••••••••"
                      autoComplete={
                        mode === "signup" ? "new-password" : "current-password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                      <p className="flex items-center gap-2 text-sm text-danger">
                        <AlertTriangle size={15} /> {error}
                      </p>
                    )}

                    <Button type="submit" fullWidth disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          {mode === "signup" ? "Creating account…" : "Signing in…"}
                        </>
                      ) : mode === "signup" ? (
                        "Create account"
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </form>

                  {/* FUTURE: Google and Apple sign-in.
                      Add OAuth buttons here using supabase.auth.signInWithOAuth
                      ({ provider: "google" | "apple" }). Left as a placeholder
                      per spec §4.5 — do not build now. */}
                  <div className="mt-5 border-t border-line pt-4 text-center text-xs text-ink-faint">
                    Google &amp; Apple sign-in coming soon
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NotConfigured() {
  return (
    <div className="text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-solar">
        <AlertTriangle size={22} />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold">
        Saving isn&apos;t set up yet
      </h2>
      <p className="mt-2 text-sm text-ink-soft">
        Add <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
        and{" "}
        <code className="font-mono text-ink">
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </code>{" "}
        to <code className="font-mono text-ink">.env.local</code> (and run the
        SQL in <code className="font-mono text-ink">supabase/schema.sql</code>)
        to enable accounts and saving.
      </p>
    </div>
  );
}

function ConfirmState({ email }: { email: string }) {
  return (
    <div className="text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-energy">
        <Mail size={22} />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold">Check your inbox</h2>
      <p className="mt-2 text-sm text-ink-soft">
        We sent a confirmation link to{" "}
        <span className="font-medium text-ink">{email}</span>. Confirm your email,
        then sign in to save your assessment.
      </p>
    </div>
  );
}

function SuccessState({
  savedId,
  onClose,
}: {
  savedId: string | null;
  onClose: () => void;
}) {
  return (
    <div className="text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-savings glow-energy">
        <CheckCircle2 size={22} />
      </span>
      <h2 className="mt-5 font-display text-xl font-bold">
        Your assessment is saved
      </h2>
      <p className="mt-2 text-sm text-ink-soft">Welcome aboard.</p>
      <div className="mt-6 flex flex-col gap-3">
        <Link href={savedId ? `/results/${savedId}` : "/my-assessments"}>
          <Button fullWidth>View my assessments</Button>
        </Link>
        <Button variant="ghost" fullWidth onClick={onClose}>
          Keep exploring
        </Button>
      </div>
    </div>
  );
}
