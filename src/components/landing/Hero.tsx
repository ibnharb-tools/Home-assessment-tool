"use client";

import { motion } from "framer-motion";
import { AddressEntry } from "./AddressEntry";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-28 pb-16 md:pt-32">
      {/* Ambient layers */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="noise-overlay pointer-events-none absolute inset-0 -z-10" />
      <div className="orb orb-energy orb-float -z-10 left-[-8rem] top-24 h-80 w-80" />
      <div
        className="orb orb-wind orb-float -z-10 right-[-6rem] top-40 h-72 w-72"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="orb orb-solar orb-float -z-10 bottom-[-4rem] left-1/3 h-64 w-64"
        style={{ animationDelay: "-12s" }}
      />

      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Caption pill */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="caption inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-ink-soft"
        >
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-energy" />
          AI-Powered Energy Intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl lg:text-[80px]"
        >
          Let&apos;s energize
          <br />
          your <span className="text-gradient-energy">home</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-[600px] text-lg text-ink-soft md:text-xl"
        >
          Discover your property&apos;s clean energy potential in minutes. No
          utility bill needed. Just answer a few questions and let our AI design
          your path to energy independence.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex w-full justify-center"
        >
          <AddressEntry />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-5 items-start justify-center rounded-full border border-line p-1"
        >
          <span className="h-2 w-1 rounded-full bg-energy" />
        </motion.div>
      </motion.div>
    </section>
  );
}
