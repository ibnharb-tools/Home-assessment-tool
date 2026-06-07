"use client";

import { Sun, Wind, Thermometer, BatteryCharging, type LucideIcon } from "lucide-react";
import type { Assessment, Rating } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

const RATING_FRACTION: Record<string, number> = {
  Excellent: 1,
  Good: 0.75,
  Moderate: 0.5,
  Poor: 0.25,
  High: 1,
  Low: 0.33,
};

interface Tile {
  key: string;
  label: string;
  icon: LucideIcon;
  rating: string;
  detail: string | null;
  accentVar: string;
  accentText: string;
}

export function Viability({ assessment }: { assessment: Assessment }) {
  const { locationData } = assessment;

  const tiles: Tile[] = [
    {
      key: "solar",
      label: "Solar",
      icon: Sun,
      rating: locationData.solarRating,
      detail: `${locationData.solarIrradiance.toFixed(1)} kWh/m²/day`,
      accentVar: "var(--solar)",
      accentText: "text-solar",
    },
    {
      key: "wind",
      label: "Wind",
      icon: Wind,
      rating: locationData.windRating,
      detail: locationData.windSpeed
        ? `${locationData.windSpeed.toFixed(1)} m/s @ 50m`
        : "—",
      accentVar: "var(--wind)",
      accentText: "text-wind",
    },
    {
      key: "geo",
      label: "Geothermal",
      icon: Thermometer,
      rating: locationData.geothermalViability,
      detail: "Ground-source",
      accentVar: "var(--energy-primary)",
      accentText: "text-energy",
    },
    {
      key: "battery",
      label: "Battery",
      icon: BatteryCharging,
      rating:
        assessment.recommendations.find((r) => r.technology === "Battery Storage")
          ?.recommended
          ? "Recommended"
          : "Optional",
      detail: "Storage & backup",
      accentVar: "var(--savings)",
      accentText: "text-savings",
    },
  ];

  return (
    <Reveal>
      <div>
        <p className="caption text-energy">Location viability</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          What works at your address
        </h2>
        {locationData.climateSummary && (
          <p className="mt-2 max-w-2xl text-ink-soft">
            {locationData.climateSummary}
          </p>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <Reveal key={t.key} delay={i * 0.08}>
              <Card padding="md" className="h-full">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-btn bg-surface ${t.accentText}`}
                  >
                    <t.icon size={20} />
                  </span>
                  <span className={`text-sm font-semibold ${t.accentText}`}>
                    {t.rating}
                  </span>
                </div>
                <p className="mt-4 font-display text-lg font-semibold">
                  {t.label}
                </p>
                {/* rating bar */}
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(RATING_FRACTION[t.rating] ?? 0.5) * 100}%`,
                      background: t.accentVar,
                    }}
                  />
                </div>
                <p className="mt-3 font-mono text-sm text-ink-soft">{t.detail}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export type { Rating };
