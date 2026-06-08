"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, Leaf } from "lucide-react";
import type { Assessment } from "@/types";
import { Card } from "@/components/ui";
import { SegmentedControl } from "@/components/questionnaire/SegmentedControl";
import { Reveal } from "@/components/Reveal";
import { ChartReady } from "@/components/ChartReady";
import { formatCurrency } from "@/lib/utils";

type View = "savings" | "emissions";

const YEARS = 25;

/**
 * The visual centerpiece (spec §4.6): 25-year cumulative Savings and Emissions
 * projections. Built to also accept real historical data points later (FUTURE).
 *
 * The data arrays are kept generic so a future enhancement can merge real
 * logged usage alongside these projections without changing the chart.
 */
export function SavingsCharts({ assessment }: { assessment: Assessment }) {
  const [view, setView] = useState<View>("savings");
  const { financial, environmental } = assessment;

  const data = useMemo(() => {
    const annualSavings = financial.annualSavings || 0;
    // Use the productive net cost implied by payback so the break-even on the
    // chart matches the reported payback figure.
    const netForBreakEven =
      financial.paybackYears > 0
        ? annualSavings * financial.paybackYears
        : financial.netCost;
    const annualCo2 = environmental.annualCo2AvoidedTonnes || 0;
    return Array.from({ length: YEARS + 1 }, (_, year) => ({
      year,
      savings: Math.round(annualSavings * year - netForBreakEven),
      emissions: Math.round(annualCo2 * year * 10) / 10,
    }));
  }, [financial, environmental]);

  const breakEvenYear =
    financial.paybackYears > 0 && financial.paybackYears <= YEARS
      ? Math.round(financial.paybackYears * 10) / 10
      : null;

  const isSavings = view === "savings";
  const accentVar = isSavings ? "var(--savings)" : "var(--wind)";

  return (
    <Reveal>
      <Card padding="lg" className="relative overflow-hidden">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="caption text-energy">Over 25 years</p>
            <h2 className="mt-2 font-display text-2xl font-bold md:text-3xl">
              {isSavings ? "Your savings, compounding" : "Emissions you'll prevent"}
            </h2>
            <p className="mt-2 max-w-md text-ink-soft">
              {isSavings
                ? "Cumulative net savings after the upfront investment, projected across the system's lifetime."
                : "Cumulative greenhouse-gas emissions avoided, in tonnes of CO₂."}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <SegmentedControl<View>
              ariaLabel="Chart view"
              options={[
                { id: "savings", label: "Savings" },
                { id: "emissions", label: "Emissions" },
              ]}
              value={view}
              onChange={setView}
            />
          </div>
        </div>

        <ChartReady className="mt-8 h-72 w-full md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 12, bottom: 0, left: 4 }}
            >
              <defs>
                <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--savings)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--savings)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="emissionsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--wind)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--wind)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-subtle)"
                vertical={false}
              />
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
                width={52}
                tickFormatter={(v) =>
                  isSavings
                    ? `$${Math.round(Number(v) / 1000)}k`
                    : `${v}t`
                }
              />
              <Tooltip
                cursor={{ stroke: "var(--energy-dim)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: 12,
                  fontFamily: "var(--font-outfit)",
                  color: "var(--text-primary)",
                  boxShadow: "var(--card-shadow)",
                }}
                formatter={(value) =>
                  isSavings
                    ? [formatCurrency(Number(value)), "Net savings"]
                    : [`${Number(value).toFixed(1)} t CO₂`, "Avoided"]
                }
                labelFormatter={(l) => `Year ${l}`}
              />
              {isSavings && (
                <ReferenceLine y={0} stroke="var(--border-subtle)" />
              )}
              {isSavings && breakEvenYear && (
                <ReferenceLine
                  x={Math.round(breakEvenYear)}
                  stroke="var(--energy-primary)"
                  strokeDasharray="4 4"
                  label={{
                    value: `Break-even · yr ${breakEvenYear}`,
                    fill: "var(--energy-primary)",
                    fontSize: 12,
                    position: "insideTopLeft",
                  }}
                />
              )}
              {isSavings && breakEvenYear && (
                <ReferenceDot
                  x={Math.round(breakEvenYear)}
                  y={0}
                  r={5}
                  fill="var(--energy-primary)"
                  stroke="var(--bg-elevated)"
                  strokeWidth={2}
                />
              )}
              <Area
                type="monotone"
                dataKey={view}
                stroke={accentVar}
                strokeWidth={2.5}
                fill={isSavings ? "url(#savingsFill)" : "url(#emissionsFill)"}
                animationDuration={1600}
                dot={false}
                activeDot={{
                  r: 5,
                  fill: accentVar,
                  stroke: "var(--bg-elevated)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartReady>

        {/* summary chips */}
        <div className="mt-6 flex flex-wrap gap-3">
          {isSavings ? (
            <>
              <Chip icon={<TrendingUp size={15} />} accent="text-savings">
                {formatCurrency(financial.twentyFiveYearSavings)} net by year 25
              </Chip>
              {breakEvenYear && (
                <Chip accent="text-energy">Break-even in {breakEvenYear} years</Chip>
              )}
            </>
          ) : (
            <Chip icon={<Leaf size={15} />} accent="text-wind">
              {environmental.twentyFiveYearCo2Tonnes} t CO₂ avoided by year 25
            </Chip>
          )}
        </div>
      </Card>
    </Reveal>
  );
}

function Chip({
  children,
  icon,
  accent,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  accent: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-sm font-medium ${accent}`}
    >
      {icon}
      {children}
    </span>
  );
}
