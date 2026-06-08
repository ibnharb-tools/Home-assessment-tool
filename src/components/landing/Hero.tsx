"use client";

import { motion } from "framer-motion";
import { AddressEntry } from "./AddressEntry";

// Representative sample curve for the hero panel (hand-built SVG sparkline —
// labelled "Sample", honest copy: not a real assessment).
const POINTS = [8, 14, 19, 27, 33, 42, 51, 63, 72, 84, 96];
const sparkPath = (() => {
  const w = 240;
  const h = 64;
  const max = Math.max(...POINTS);
  return POINTS.map((p, i) => {
    const x = (i / (POINTS.length - 1)) * w;
    const y = h - (p / max) * h;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
})();

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-36 md:pb-28">
      {/* one static bloom + faint grid — no orbs, no animation */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-12 lg:gap-8">
        {/* Left: editorial, left-aligned */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="caption inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1.5 text-ink-soft"
          >
            <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-energy" />
            AI-powered energy intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[15ch] font-display font-extrabold leading-[1.04] tracking-[-0.02em] text-[clamp(2.75rem,5vw+1rem,4.75rem)]"
          >
            Let&apos;s energize your{" "}
            <span className="accent-underline">home</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[52ch] text-lg text-ink-soft md:text-xl"
          >
            Discover your property&apos;s clean energy potential in minutes — no
            utility bill needed. Answer a few questions and our AI designs your
            path to energy independence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9"
          >
            <AddressEntry />
          </motion.div>
        </div>

        {/* Right: a real sample-assessment panel (asymmetric counterweight) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5"
        >
          <div className="rounded-panel border border-line bg-elevated p-6 shadow-[var(--shadow-whisper)]">
            <div className="flex items-center justify-between">
              <span className="caption text-ink-faint">Projected savings</span>
              <span className="caption rounded-full bg-surface px-2.5 py-1 text-ink-faint">
                Sample
              </span>
            </div>

            {/* hand-built sparkline */}
            <svg
              viewBox="0 0 240 64"
              className="mt-4 h-16 w-full"
              fill="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="heroSpark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--savings)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--savings)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${sparkPath} L240,64 L0,64 Z`} fill="url(#heroSpark)" />
              <path
                d={sparkPath}
                stroke="var(--savings)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <dl className="mt-6 space-y-4">
              <PanelRow label="Annual production" value="9,200" unit="kWh" />
              <PanelRow label="Payback period" value="7.4" unit="yrs" />
              <PanelRow label="CO₂ avoided / yr" value="4.8" unit="t" accent />
            </dl>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PanelRow({
  label,
  value,
  unit,
  accent,
}: {
  label: string;
  value: string;
  unit: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-line pb-3 last:border-0 last:pb-0">
      <dt className="text-sm text-ink-soft">{label}</dt>
      <dd
        className={`font-mono text-xl font-semibold ${accent ? "text-savings" : "text-ink"}`}
      >
        {value}
        <span className="ml-1 text-sm font-normal text-ink-faint">{unit}</span>
      </dd>
    </div>
  );
}
