"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { ChartReady } from "@/components/ChartReady";
import { formatNumber } from "@/lib/utils";

// Energy palette cycled across breakdown categories.
const COLORS = [
  "var(--energy-primary)",
  "var(--wind)",
  "var(--solar)",
  "var(--savings)",
  "var(--energy-dim)",
  "var(--text-tertiary)",
];

export function EnergyProfile({ assessment }: { assessment: Assessment }) {
  const { energyProfile } = assessment;
  const data = energyProfile.breakdown.map((b, i) => ({
    name: b.category,
    value: b.kwh,
    percentage: b.percentage,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <Reveal>
      <Card padding="lg">
        <p className="caption text-energy">Energy profile</p>
        <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
          Where your energy goes
        </h2>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-2">
          {/* Donut */}
          <div
            className="relative h-64 w-full"
            role="img"
            aria-label={`Donut chart: energy usage breakdown totalling ${formatNumber(energyProfile.estimatedAnnualKwh)} kWh per year across ${data.length} categories. Full data table follows.`}
          >
            <ChartReady className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={2}
                  stroke="var(--bg-elevated)"
                  strokeWidth={2}
                  animationDuration={1200}
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 12,
                    fontFamily: "var(--font-outfit)",
                    color: "var(--text-primary)",
                    boxShadow: "var(--card-shadow)",
                  }}
                  formatter={(value, name) => [
                    `${formatNumber(Number(value))} kWh`,
                    name as string,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            </ChartReady>
            {/* center total */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-2xl font-bold text-ink md:text-3xl">
                {formatNumber(energyProfile.estimatedAnnualKwh)}
              </span>
              <span className="caption text-ink-faint">kWh / year</span>
            </div>
          </div>

          {/* Legend + totals */}
          <div>
            <ul className="space-y-2.5">
              {data.map((d) => (
                <li
                  key={d.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className="inline-block h-3 w-3 rounded-sm"
                      style={{ background: d.color }}
                    />
                    <span className="text-ink-soft">{d.name}</span>
                  </span>
                  <span className="font-mono text-sm text-ink">
                    {d.percentage}%
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
              <Mini label="Daily" value={`${formatNumber(energyProfile.estimatedDailyKwh, 1)}`} unit="kWh" />
              <Mini label="Monthly" value={formatNumber(energyProfile.estimatedMonthlyKwh)} unit="kWh" />
              <Mini label="Peak" value={`${formatNumber(energyProfile.peakDemandKw, 1)}`} unit="kW" />
            </div>
          </div>
        </div>

        {/* comparison callout */}
        <div className="mt-6 rounded-card border border-line bg-surface/60 p-4 text-sm text-ink-soft">
          {energyProfile.comparisonToAverage}
        </div>

        <table className="sr-only">
          <caption>Annual energy usage breakdown for your property</caption>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">kWh per year</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td>{formatNumber(d.value)} kWh</td>
                <td>{d.percentage}%</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td>{formatNumber(energyProfile.estimatedAnnualKwh)} kWh</td>
              <td>100%</td>
            </tr>
          </tfoot>
        </table>
      </Card>
    </Reveal>
  );
}

function Mini({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div>
      <p className="font-mono text-lg font-bold text-ink">{value}</p>
      <p className="caption text-ink-faint">
        {label} · {unit}
      </p>
    </div>
  );
}
