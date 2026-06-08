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
    desc: "An accurate energy profile from your home and appliances — no utility bill required.",
  },
  {
    icon: MapPinned,
    title: "Location-specific analysis",
    desc: "Real climate data for your exact coordinates drives every recommendation.",
  },
  {
    icon: SunMedium,
    title: "Solar, wind, geothermal & battery",
    desc: "Every viable renewable technology analyzed — we tell you what actually fits.",
  },
  {
    icon: Wallet,
    title: "Cost & rebate calculations",
    desc: "Transparent cost estimates including available grants and rebates.",
  },
  {
    icon: LineChart,
    title: "Savings & emissions over time",
    desc: "Cumulative savings and avoided greenhouse gases projected over 25 years.",
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
      className="mx-auto max-w-[1200px] px-6 py-24 md:px-8 md:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            Everything you need to go renewable
          </h2>
          <p className="mt-4 max-w-[40ch] text-ink-soft">
            One assessment, every angle — from the technologies worth installing
            to the dollars and emissions they move.
          </p>
        </Reveal>

        <div className="lg:col-span-8">
          <div className="grid sm:grid-cols-2">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 0.08}>
                <div className="flex gap-4 border-t border-line py-6 pr-2">
                  <f.icon
                    size={22}
                    className="mt-0.5 shrink-0 text-energy"
                    strokeWidth={1.75}
                  />
                  <div>
                    <h3 className="font-display text-lg font-semibold">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-soft">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
