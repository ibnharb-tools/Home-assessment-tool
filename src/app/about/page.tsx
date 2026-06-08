import type { Metadata } from "next";
import { Target, Compass, User } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "About",
  description: "The mission and vision behind Everstead.",
};

/**
 * ============================================================================
 * ABOUT PAGE — PLACEHOLDER CONTENT.
 * Replace the bracketed text below with the real founder bio, mission, and
 * vision. Optionally drop in a real headshot where the avatar placeholder is.
 * Everything else (layout, styling) is ready to go.
 * ============================================================================
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        {/* Intro */}
        <section className="mx-auto max-w-[1200px] px-6 pt-32 pb-12 md:px-8 md:pt-36">
          <p className="caption text-energy">About</p>
          <h1 className="mt-4 max-w-[18ch] font-display text-5xl font-extrabold leading-[1.04] tracking-[-0.02em] md:text-6xl">
            Energy made understandable for everyone
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg text-ink-soft">
            {/* PLACEHOLDER — one or two sentences on why Everstead exists. */}
            [One or two sentences on why you started Everstead — the problem you
            saw, and who you&apos;re building it for.]
          </p>
        </section>

        {/* Founder */}
        <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-8">
          <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-4">
              {/* PLACEHOLDER — replace with a real headshot (next/image). */}
              <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-panel border border-line bg-surface text-ink-faint">
                <User size={48} strokeWidth={1.25} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="caption text-energy">Founder</p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                [Your name]
              </h2>
              <p className="mt-1 text-ink-soft">[Your role / title]</p>
              <div className="mt-6 max-w-[64ch] space-y-4 text-ink-soft">
                <p>
                  {/* PLACEHOLDER — your background. */}
                  [A short paragraph about your background — what you do, what
                  led you here, and the experience behind Everstead.]
                </p>
                <p>
                  {/* PLACEHOLDER — the personal "why". */}
                  [A second paragraph: the personal reason this matters to you,
                  and what you want people to feel using Everstead.]
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border-t border-line pt-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-btn bg-surface text-energy">
                <Target size={20} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold">Our mission</h2>
              <p className="mt-3 max-w-[48ch] text-ink-soft">
                {/* PLACEHOLDER — your mission statement. */}
                [Your mission in one or two clear sentences — what Everstead sets
                out to do for people and the planet.]
              </p>
            </div>
            <div className="border-t border-line pt-8">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-btn bg-surface text-energy">
                <Compass size={20} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold">Our vision</h2>
              <p className="mt-3 max-w-[48ch] text-ink-soft">
                {/* PLACEHOLDER — your vision statement. */}
                [Your vision — the future you&apos;re working toward, and what the
                world looks like when Everstead succeeds.]
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
