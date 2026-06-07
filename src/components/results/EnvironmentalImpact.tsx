"use client";

import { Leaf, TreePine, Car } from "lucide-react";
import type { Assessment } from "@/types";
import { Card, AnimatedNumber } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export function EnvironmentalImpact({ assessment }: { assessment: Assessment }) {
  const e = assessment.environmental;

  return (
    <Reveal>
      <Card padding="lg" className="relative overflow-hidden">
        <div className="orb orb-energy -z-0 absolute -right-16 -top-16 h-48 w-48 opacity-30" />
        <div className="relative">
          <p className="caption text-energy">Environmental impact</p>
          <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
            What it means for the planet
          </h2>
          <p className="mt-2 max-w-lg text-ink-soft">
            Your projected system avoids{" "}
            <span className="font-semibold text-savings">
              {e.annualCo2AvoidedTonnes} tonnes
            </span>{" "}
            of CO₂ every year. Here&apos;s what that looks like.
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <Impact
              icon={<Leaf size={22} />}
              value={e.annualCo2AvoidedTonnes}
              decimals={1}
              suffix=" t"
              label="CO₂ avoided per year"
              accent="text-savings"
            />
            <Impact
              icon={<TreePine size={22} />}
              value={e.treesEquivalent}
              suffix=""
              label="Equivalent trees planted / yr"
              accent="text-savings"
            />
            <Impact
              icon={<Car size={22} />}
              value={e.kmDrivingEquivalent}
              suffix=" km"
              label="Driving avoided / yr"
              accent="text-wind"
            />
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

function Impact({
  icon,
  value,
  decimals = 0,
  suffix,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: number;
  decimals?: number;
  suffix: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface/60 p-5 text-center">
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-full bg-elevated ${accent}`}
      >
        {icon}
      </span>
      <p className={`mt-4 font-mono text-3xl font-bold ${accent}`}>
        <AnimatedNumber value={value} decimals={decimals} suffix={suffix} />
      </p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
