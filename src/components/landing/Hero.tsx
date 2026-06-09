"use client";

import { motion } from "framer-motion";
import { AddressEntry } from "./AddressEntry";
import { HomeScene } from "./HomeScene";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-36 md:pb-28">
      {/* one static warm bloom + faint grid — no orbs */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-12 lg:gap-6">
        {/* Left: editorial */}
        <div className="lg:col-span-6">
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
            className="mt-6 max-w-[15ch] font-display font-semibold leading-[1.02] tracking-[-0.02em] text-[clamp(2.75rem,5vw+1rem,4.75rem)]"
          >
            Let&apos;s energize your{" "}
            <span className="accent-underline">home</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[50ch] text-lg text-ink-soft md:text-xl"
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

        {/* Right: the living home (animated centerpiece) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-6"
        >
          <HomeScene />

          {/* floating sample chips (honest copy) */}
          <div className="pointer-events-none absolute left-2 top-6 rounded-full border border-line bg-elevated/90 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-[var(--shadow-whisper)] backdrop-blur">
            <span className="font-mono text-savings">9,200 kWh</span> / yr ·{" "}
            <span className="text-ink-faint">sample</span>
          </div>
          <div className="pointer-events-none absolute bottom-10 right-2 rounded-full border border-line bg-elevated/90 px-3 py-1.5 text-xs font-medium text-ink-soft shadow-[var(--shadow-whisper)] backdrop-blur">
            <span className="font-mono text-energy">7.4 yr</span> payback
          </div>
        </motion.div>
      </div>
    </section>
  );
}
