"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Locating your property…",
  "Pulling climate data for your coordinates…",
  "Analyzing solar potential…",
  "Calculating wind viability…",
  "Estimating your energy profile…",
  "Sizing renewable systems…",
  "Projecting savings and emissions…",
  "Building your energy profile…",
];

/**
 * Energy-themed processing loader: pulsing concentric rings in energy-teal
 * with rotating status messages. Shown while the AI assessment runs.
 */
export function AssessmentLoader() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1) % MESSAGES.length),
      2200
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="orb orb-energy orb-float -z-10 left-1/4 top-1/4 h-72 w-72" />
      <div
        className="orb orb-wind orb-float -z-10 right-1/4 bottom-1/4 h-64 w-64"
        style={{ animationDelay: "-7s" }}
      />

      {/* Concentric pulsing rings */}
      <div className="relative h-40 w-40">
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--energy-primary)" }}
            initial={{ scale: 0.4, opacity: 0.6 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: ring * 0.8,
            }}
          />
        ))}
        {/* core */}
        <motion.span
          className="absolute inset-[34%] rounded-full bg-gradient-energy"
          animate={{ scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            boxShadow: "0 0 32px color-mix(in srgb, var(--energy-primary) 60%, transparent)",
          }}
        />
      </div>

      <h2 className="mt-12 font-display text-2xl font-bold md:text-3xl">
        Analyzing your property
      </h2>

      <div className="mt-3 h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="font-mono text-sm text-energy"
          >
            {MESSAGES[idx]}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="mt-6 max-w-sm text-sm text-ink-faint">
        This usually takes a few seconds while we analyze your property and local
        climate.
      </p>
    </div>
  );
}
