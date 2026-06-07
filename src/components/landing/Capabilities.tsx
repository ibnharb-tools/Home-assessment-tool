"use client";

import {
  Gauge,
  MapPinned,
  SunMedium,
  Wallet,
  LineChart,
  Camera,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const features: Feature[] = [
  {
    icon: Gauge,
    title: "Smart energy profiling",
    desc: "Build an accurate energy profile from your home and appliances — no utility bill required.",
  },
  {
    icon: MapPinned,
    title: "Location-specific recommendations",
    desc: "Real climate data for your exact coordinates drives every recommendation.",
  },
  {
    icon: SunMedium,
    title: "Solar, wind, geothermal & battery",
    desc: "We analyze every viable renewable technology and tell you what actually fits.",
  },
  {
    icon: Wallet,
    title: "Cost & rebate calculations",
    desc: "Transparent cost estimates including available grants and rebates.",
  },
  {
    icon: LineChart,
    title: "Savings & emissions over time",
    desc: "See cumulative savings and avoided greenhouse gases projected over 25 years.",
  },
  {
    icon: Camera,
    title: "Visual property insights",
    desc: "Upload photos and our AI reads your roof, orientation, and available space.",
  },
];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative overflow-hidden px-6 py-24 md:py-32"
    >
      <div className="ambient-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-[1200px] md:px-2">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="caption text-energy">Capabilities</p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to go renewable
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1}>
              <Card interactive className="h-full">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-btn bg-surface text-energy">
                  <f.icon size={22} />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">
                  {f.title}
                </h3>
                <p className="mt-2 text-ink-soft">{f.desc}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
