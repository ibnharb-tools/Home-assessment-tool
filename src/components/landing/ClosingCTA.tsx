"use client";

import { AddressEntry } from "./AddressEntry";
import { Reveal } from "@/components/Reveal";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      {/* strong ambient glow */}
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="orb orb-energy orb-float -z-10 left-1/4 top-1/4 h-80 w-80" />
      <div
        className="orb orb-wind orb-float -z-10 right-1/4 bottom-0 h-72 w-72"
        style={{ animationDelay: "-8s" }}
      />

      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Ready to see what your{" "}
          <span className="text-gradient-energy">home</span> can do?
        </h2>
        <p className="mt-5 max-w-lg text-lg text-ink-soft">
          Start your free assessment now. No account needed to explore your
          clean energy potential.
        </p>
        <div className="mt-10 flex w-full justify-center">
          <AddressEntry />
        </div>
      </Reveal>
    </section>
  );
}
