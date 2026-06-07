"use client";

import { useState } from "react";
import {
  ArrowRight,
  Zap,
  Sun,
  Wind,
  Leaf,
  Search,
  TrendingUp,
} from "lucide-react";
import {
  Button,
  Card,
  Input,
  StatCard,
  ProgressBar,
  Logo,
  ThemeToggle,
  AnimatedNumber,
} from "@/components/ui";

/**
 * UI component preview / verification page (Phase 1 checkpoint).
 * Renders every core design-system component. Use the theme toggle in the
 * top-right to verify both light and dark themes look correct.
 */
export default function ComponentsPreviewPage() {
  const [progress, setProgress] = useState(60);

  return (
    <main className="relative min-h-screen px-6 py-16 md:px-12">
      {/* ambient background */}
      <div className="ambient-glow pointer-events-none fixed inset-0 -z-10" />
      <div className="noise-overlay pointer-events-none fixed inset-0 -z-10" />
      <div className="orb orb-energy orb-float -z-10 left-[-6rem] top-24 h-72 w-72" />
      <div className="orb orb-wind orb-float -z-10 right-[-4rem] top-96 h-64 w-64" />

      <div className="mx-auto max-w-[1200px]">
        {/* header */}
        <header className="mb-12 flex items-center justify-between">
          <Logo size="lg" />
          <ThemeToggle />
        </header>

        <h1 className="font-display text-4xl font-extrabold md:text-5xl">
          Design System Preview
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Phase 1 checkpoint. Toggle the theme (top right) to verify every
          component in both light and dark modes.
        </p>

        {/* Typography */}
        <Section title="Typography">
          <div className="space-y-4">
            <p className="font-display text-5xl font-extrabold">
              Sora display 800
            </p>
            <p className="font-display text-3xl font-semibold">
              Sora subsection 600
            </p>
            <p className="text-lg text-ink-soft">
              Outfit body large — clean, friendly, contemporary UI text.
            </p>
            <p className="font-mono text-3xl font-bold text-energy">
              <AnimatedNumber value={12480} suffix=" kWh" />
            </p>
            <p className="caption text-ink-faint">
              JetBrains Mono data + uppercase caption
            </p>
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary">
              Start Assessment <ArrowRight size={18} />
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Inputs">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Address"
              placeholder="Enter your address to begin"
              icon={<Search size={18} />}
            />
            <Input
              label="With trailing button"
              placeholder="123 Solar Way"
              trailing={
                <Button size="sm">
                  Go <ArrowRight size={16} />
                </Button>
              }
            />
            <Input
              label="With hint"
              placeholder="Optional"
              hint="Don't know? No problem, we'll estimate it."
            />
            <Input
              label="With error"
              placeholder="Required"
              error="This field is required"
            />
          </div>
        </Section>

        {/* Cards */}
        <Section title="Cards">
          <div className="grid gap-6 md:grid-cols-3">
            <Card interactive>
              <h3 className="font-display text-xl font-semibold">Glass card</h3>
              <p className="mt-2 text-ink-soft">
                Frosted glass, hover to lift. Theme-aware background and shadow.
              </p>
            </Card>
            <Card variant="solid" interactive>
              <h3 className="font-display text-xl font-semibold">Solid card</h3>
              <p className="mt-2 text-ink-soft">
                Elevated surface with a subtle border.
              </p>
            </Card>
            <Card glow>
              <h3 className="font-display text-xl font-semibold">Glow card</h3>
              <p className="mt-2 text-ink-soft">
                Energy glow for emphasized panels.
              </p>
            </Card>
          </div>
        </Section>

        {/* Stat cards */}
        <Section title="Stat cards (animated count-up)">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Annual production"
              value={9200}
              suffix=" kWh"
              icon={Zap}
              accent="energy"
            />
            <StatCard
              label="Net cost"
              value={14500}
              prefix="$"
              icon={Sun}
              accent="solar"
            />
            <StatCard
              label="Payback period"
              value={7.4}
              decimals={1}
              suffix=" yrs"
              icon={Wind}
              accent="wind"
            />
            <StatCard
              label="CO₂ avoided / yr"
              value={4.8}
              decimals={1}
              suffix=" t"
              icon={Leaf}
              accent="savings"
            />
          </div>
        </Section>

        {/* Progress bar */}
        <Section title="Progress bar">
          <div className="max-w-xl space-y-4">
            <ProgressBar value={progress} />
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setProgress((p) => Math.max(0, p - 20))}
              >
                −20%
              </Button>
              <span className="font-mono text-ink-soft">{progress}%</span>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setProgress((p) => Math.min(100, p + 20))}
              >
                +20%
              </Button>
            </div>
          </div>
        </Section>

        {/* Effects */}
        <Section title="Effect classes">
          <div className="flex flex-wrap gap-6">
            <div className="caption inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-ink-soft">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-energy" />
              AI-Powered Energy Intelligence
            </div>
            <span className="font-display text-3xl font-bold text-gradient-energy">
              Gradient text
            </span>
            <span className="font-display text-3xl font-bold text-gradient-solar">
              Solar gradient
            </span>
            <span className="inline-flex items-center gap-2 text-savings">
              <TrendingUp size={20} /> Savings accent
            </span>
          </div>
        </Section>

        <footer className="mt-16 border-t border-line pt-8 text-sm text-ink-faint">
          Everstead design system · Phase 1 preview
        </footer>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="caption mb-6 text-energy">{title}</h2>
      {children}
    </section>
  );
}
