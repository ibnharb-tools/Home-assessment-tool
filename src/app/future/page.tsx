import type { Metadata } from "next";
import {
  ReceiptText,
  LineChart,
  History,
  Fingerprint,
  Box,
  Store,
  Activity,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "What's next",
  description: "The Everstead roadmap: features in design and on the way.",
};

interface Item {
  icon: LucideIcon;
  title: string;
  desc: string;
  tag: "Planned" | "Soon" | "Exploring";
}

const roadmap: Item[] = [
  {
    icon: ReceiptText,
    title: "Utility bill cross-reference",
    desc: "Optionally link or upload a utility account to validate AI estimates against your real billing data.",
    tag: "Planned",
  },
  {
    icon: LineChart,
    title: "Energy tracking with AI tips",
    desc: "Log your actual energy use over time and receive AI-generated guidance on reducing consumption.",
    tag: "Planned",
  },
  {
    icon: History,
    title: "Real historical tracking",
    desc: "Your over-time graphs will plot real logged usage alongside the projections you see today.",
    tag: "Planned",
  },
  {
    icon: Fingerprint,
    title: "Google & Apple sign-in",
    desc: "One-tap social sign-in for faster, easier access to your saved assessments.",
    tag: "Soon",
  },
  {
    icon: Box,
    title: "3D property visualization",
    desc: "A photogrammetry-based 3D model of your property with device placement and AR preview via Meta glasses.",
    tag: "Exploring",
  },
  {
    icon: Store,
    title: "Live marketplace",
    desc: "Real supplier integration: compare quotes, request proposals, and purchase all in one place.",
    tag: "Exploring",
  },
  {
    icon: Activity,
    title: "Monitoring dashboard",
    desc: "Once installed, track your system's real performance through IoT integration.",
    tag: "Exploring",
  },
  {
    icon: Settings2,
    title: "Optimize & Expand modules",
    desc: "Ongoing recommendations to fine-tune your system and plan future capacity.",
    tag: "Exploring",
  },
];

function tagClass(tag: Item["tag"]): string {
  if (tag === "Planned") return "bg-energy/10 text-energy";
  if (tag === "Soon") return "bg-solar/10 text-solar";
  return "bg-surface text-ink-faint";
}

export default function FuturePage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-6 pt-32 pb-12 md:px-8 md:pt-36">
          <Reveal>
            <p className="caption text-energy">The roadmap</p>
            <h1 className="mt-4 max-w-[20ch] text-balance font-display text-5xl font-extrabold leading-[1.04] tracking-[-0.02em] md:text-6xl">
              What we&apos;re building next
            </h1>
            <p className="mt-6 max-w-[60ch] text-lg text-ink-soft">
              Everstead today gives you a complete clean-energy assessment.
              Here&apos;s where we&apos;re taking it: from real-world validation
              to a full path from plan to installed system.
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-28 md:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.06}>
                <div className="flex flex-col gap-3 border-t border-line py-8 pr-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-btn bg-surface text-energy">
                      <item.icon size={20} strokeWidth={1.75} />
                    </span>
                    <span
                      className={`caption rounded-full px-2.5 py-1 ${tagClass(item.tag)}`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <h2 className="mt-2 font-display text-xl font-semibold">
                    {item.title}
                  </h2>
                  <p className="text-sm text-ink-soft">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
