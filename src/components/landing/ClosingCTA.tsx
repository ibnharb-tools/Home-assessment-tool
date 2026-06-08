"use client";

import { AddressEntry } from "./AddressEntry";
import { Reveal } from "@/components/Reveal";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-28">
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <Reveal className="mx-auto max-w-[1200px]">
        <div className="grid items-end gap-10 rounded-panel border border-line bg-elevated p-8 shadow-[var(--shadow-whisper)] md:grid-cols-12 md:p-12">
          <div className="md:col-span-6">
            <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              Ready to see what your{" "}
              <span className="accent-underline">home</span> can do?
            </h2>
            <p className="mt-4 max-w-[46ch] text-lg text-ink-soft">
              Start your free assessment now. No account needed to explore your
              clean energy potential.
            </p>
          </div>
          <div className="md:col-span-6 md:justify-self-end">
            <AddressEntry />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
