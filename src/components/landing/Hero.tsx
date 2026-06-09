"use client";

import { motion } from "framer-motion";
import { AddressEntry } from "./AddressEntry";
import { HomeScene } from "./HomeScene";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden px-6 pt-32 pb-20 md:pt-36 md:pb-28"
    >
      {/* one static warm bloom + faint grid — no orbs */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-12 lg:gap-4">
        {/* Left: editorial */}
        <div className="lg:col-span-5">
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
            id="hero-heading"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-[15ch] text-balance font-display font-semibold leading-[1.02] tracking-[-0.02em] text-[clamp(2.75rem,5vw+1rem,4.75rem)]"
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
            Enter your address and answer a few questions. In minutes,
            you&apos;ll have a detailed assessment: which technologies suit
            your property, estimated costs, savings projections and the
            rebates you qualify for.
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

        {/* Right: the living home — large, open, no frame; bleeds to the edge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-7 lg:-mr-6 xl:-mr-16"
        >
          <HomeScene className="lg:scale-110 lg:origin-right" />
        </motion.div>
      </div>
    </section>
  );
}
