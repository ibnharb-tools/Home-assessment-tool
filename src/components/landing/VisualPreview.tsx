"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Zap, DollarSign, Leaf } from "lucide-react";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { ChartReady } from "@/components/ChartReady";

// Representative projected-savings data for the preview mockup.
const data = Array.from({ length: 26 }, (_, year) => ({
  year,
  savings: Math.round(year * 1850 - 18000 + year * year * 32),
}));

export function VisualPreview() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-6 py-24 md:px-8 md:py-28">
      <Reveal>
        <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          Your energy, in one clear dashboard
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-ink-soft">
          Every assessment becomes an interactive dashboard — energy profile,
          recommendations, and savings projected across 25 years.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <Card padding="lg" className="relative overflow-hidden">
          {/* Honest-copy: this dashboard preview uses representative sample
              figures, not a real assessment. Labelled so it can't read as a
              fabricated proof metric. */}
          <span className="caption absolute right-5 top-5 rounded-full bg-surface px-3 py-1 text-ink-faint">
            Sample
          </span>
          {/* mini stat row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat
              icon={<Zap size={18} />}
              label="Annual production"
              value="9,200 kWh"
              accent="text-energy"
            />
            <MiniStat
              icon={<DollarSign size={18} />}
              label="25-year savings"
              value="$48,300"
              accent="text-savings"
            />
            <MiniStat
              icon={<Leaf size={18} />}
              label="CO₂ avoided / yr"
              value="4.8 t"
              accent="text-wind"
            />
          </div>

          {/* chart */}
          <ChartReady className="mt-8 h-64 w-full md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 8, bottom: 0, left: -8 }}
              >
                <defs>
                  <linearGradient id="previewFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--energy-primary)"
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--energy-primary)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `Yr ${v}`}
                  interval={4}
                />
                <YAxis
                  tick={{ fill: "var(--text-tertiary)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
                  width={48}
                />
                <Tooltip
                  cursor={{ stroke: "var(--energy-dim)", strokeWidth: 1 }}
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 12,
                    fontFamily: "var(--font-outfit)",
                    color: "var(--text-primary)",
                  }}
                  formatter={(v) => [
                    `$${Number(v).toLocaleString()}`,
                    "Net savings",
                  ]}
                  labelFormatter={(l) => `Year ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="savings"
                  stroke="var(--energy-primary)"
                  strokeWidth={2.5}
                  fill="url(#previewFill)"
                  animationDuration={1600}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartReady>
        </Card>
      </Reveal>
    </section>
  );
}

function MiniStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-card bg-surface/60 p-4">
      <div className={`inline-flex items-center gap-2 ${accent}`}>{icon}</div>
      <p className={`mt-2 font-mono text-2xl font-bold ${accent}`}>{value}</p>
      <p className="caption mt-1 text-ink-faint">{label}</p>
    </div>
  );
}
