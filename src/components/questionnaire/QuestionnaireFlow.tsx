"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Sparkles, Check } from "lucide-react";
import { useQuestionnaireStore } from "@/store/questionnaire";
import { QUESTIONNAIRE_STEPS } from "@/lib/questionnaire-options";
import { Button, Logo, ThemeToggle, ProgressBar } from "@/components/ui";
import { Step1Property } from "./steps/Step1Property";
import { Step2Energy } from "./steps/Step2Energy";
import { Step3Appliances } from "./steps/Step3Appliances";
import { Step4Goals } from "./steps/Step4Goals";
import { Step5Photos } from "./steps/Step5Photos";

const stepDescriptions = [
  "Tell us about your property.",
  "How you connect to and use power.",
  "The appliances that draw energy.",
  "What you want to achieve.",
  "Help our AI see your property.",
];

export function QuestionnaireFlow() {
  const router = useRouter();
  const { data, currentStep, totalSteps, next, prev, setStep } =
    useQuestionnaireStore();
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // If someone lands on /assess without an address, send them home to start.
  useEffect(() => {
    if (mounted && !data.address) {
      router.replace("/");
    }
  }, [mounted, data.address, router]);

  const validateStep = (): string | null => {
    switch (currentStep) {
      case 0:
        if (!data.propertyType) return "Please choose a property type.";
        return null;
      case 1:
        if (!data.gridConnection)
          return "Please choose your grid connection status.";
        return null;
      case 2:
        if (data.appliances.length === 0)
          return "Select at least one appliance so we can estimate your usage.";
        return null;
      case 3:
        if (data.goals.length === 0)
          return "Pick at least one goal so we can prioritize recommendations.";
        return null;
      default:
        return null;
    }
  };

  const goNext = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    if (currentStep === totalSteps - 1) {
      submit();
      return;
    }
    setDirection(1);
    next();
  };

  const goPrev = () => {
    setError(null);
    setDirection(-1);
    prev();
  };

  const submit = () => {
    // Phase 4 triggers the AI assessment on /results. For now we navigate with
    // the collected data persisted in the store.
    router.push("/results");
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLast = currentStep === totalSteps - 1;

  if (!mounted || !data.address) {
    return (
      <div className="flex min-h-screen items-center justify-center text-ink-faint">
        Loading…
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />

      {/* Top bar */}
      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Logo />
        <ThemeToggle />
      </header>

      <div className="mx-auto max-w-3xl px-6 pb-32">
        {/* Address confirmation */}
        <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full glass px-4 py-2 text-sm text-ink-soft">
          <MapPin size={15} className="shrink-0 text-energy" />
          <span className="truncate">{data.address}</span>
          <Check size={14} className="shrink-0 text-savings" />
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between">
          <span className="caption text-energy">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm text-ink-faint">
            {QUESTIONNAIRE_STEPS[currentStep]}
          </span>
        </div>
        <ProgressBar value={progress} />

        {/* Heading */}
        <div className="mt-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
            {QUESTIONNAIRE_STEPS[currentStep]}
          </h1>
          <p className="mt-2 text-ink-soft">{stepDescriptions[currentStep]}</p>
        </div>

        {/* Animated step body */}
        <div className="relative mt-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {currentStep === 0 && <Step1Property />}
              {currentStep === 1 && <Step2Energy />}
              {currentStep === 2 && <Step3Appliances />}
              {currentStep === 3 && <Step4Goals />}
              {currentStep === 4 && <Step5Photos />}
            </motion.div>
          </AnimatePresence>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-danger"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Sticky footer nav */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line glass-strong">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
          <Button
            variant="ghost"
            onClick={goPrev}
            disabled={currentStep === 0}
            className="shrink-0"
          >
            <ArrowLeft size={18} /> Back
          </Button>

          {/* step dots */}
          <div className="hidden items-center gap-2 sm:flex">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to step ${i + 1}`}
                onClick={() => {
                  if (i < currentStep) {
                    setError(null);
                    setDirection(-1);
                    setStep(i);
                  }
                }}
                disabled={i > currentStep}
                className={[
                  "h-2 rounded-full transition-all duration-300",
                  i === currentStep
                    ? "w-6 bg-energy"
                    : i < currentStep
                      ? "w-2 bg-energy-dim hover:w-3"
                      : "w-2 bg-surface",
                ].join(" ")}
              />
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {isLast && (
              <Button variant="ghost" onClick={submit} className="hidden sm:inline-flex">
                Skip
              </Button>
            )}
            <Button onClick={goNext}>
              {isLast ? (
                <>
                  <Sparkles size={18} /> Generate my assessment
                </>
              ) : (
                <>
                  Next <ArrowRight size={18} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
