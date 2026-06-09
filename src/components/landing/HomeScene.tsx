"use client";

import { cn } from "@/lib/utils";

/**
 * The "living home" — a hand-built SVG scene that animates the home's renewable
 * systems: solar panels shimmer, wind turbines spin continuously, and the
 * geothermal loop shows fluid flowing through the pipes. Theme-aware via the
 * --home-* CSS tokens. Honors prefers-reduced-motion (global reset).
 *
 * Built parametrically so pieces can later be reused by the assessment's
 * "build your home" live drawing.
 */

function Turbine({
  x,
  hubY,
  baseY,
  scale = 1,
  fast = false,
}: {
  x: number;
  hubY: number;
  baseY: number;
  scale?: number;
  fast?: boolean;
}) {
  // Three tapered blades around the hub at 0/120/240 degrees.
  const blade = "M0,-4 Q10,-30 4,-74 Q-2,-34 0,-4 Z";
  return (
    <g transform={`translate(${x} ${hubY}) scale(${scale})`}>
      {/* pole */}
      <rect
        x={-2.5}
        y={0}
        width={5}
        height={baseY - hubY}
        rx={2.5}
        fill="var(--home-roof-2)"
      />
      {/* rotor */}
      <g className={cn("turbine-spin", fast && "turbine-spin-fast")}>
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d={blade}
            transform={`rotate(${deg})`}
            fill="var(--text-primary)"
            opacity={0.85}
          />
        ))}
      </g>
      <circle r={5} fill="var(--solar)" />
    </g>
  );
}

const PANEL_ROWS = 3;
const PANEL_COLS = 5;

export function HomeScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={cn("h-auto w-full select-none", className)}
      role="img"
      aria-label="An illustrated home with solar panels, wind turbines and a geothermal loop"
    >
      <defs>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--solar-bright)" stopOpacity="0.9" />
          <stop offset="55%" stopColor="var(--solar)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--solar)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#103744" />
          <stop offset="100%" stopColor="#0a2730" />
        </linearGradient>
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="roofClip">
          <path d="M214,196 L470,158 L492,196 L236,234 Z" />
        </clipPath>
      </defs>

      {/* sun / ambient */}
      <circle cx="540" cy="96" r="120" fill="url(#sun)" className="soft-bob" />
      {/* sparkles */}
      {[
        [120, 70],
        [300, 50],
        [430, 90],
        [70, 150],
        [580, 200],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={2.5}
          fill="var(--energy-primary)"
          className="twinkle"
          style={{ animationDelay: `${i * 0.6}s` }}
        />
      ))}

      {/* turbines (behind house) */}
      <Turbine x={96} hubY={150} baseY={372} scale={1.05} />
      <Turbine x={566} hubY={196} baseY={372} scale={0.8} fast />

      {/* ground */}
      <path
        d="M0,372 Q320,344 640,372 L640,480 L0,480 Z"
        fill="var(--home-ground)"
      />

      {/* geothermal loop (under ground) */}
      <g fill="none" strokeLinecap="round">
        <path
          d="M250,372 L250,432 Q250,452 270,452 L300,452 Q320,452 320,432 L320,372"
          stroke="var(--home-pipe)"
          strokeWidth={9}
        />
        <path
          d="M250,372 L250,432 Q250,452 270,452 L300,452 Q320,452 320,432 L320,372"
          stroke="var(--energy-primary)"
          strokeWidth={3.5}
          className="geo-flow"
        />
      </g>

      {/* house */}
      <g>
        {/* side wall (depth) */}
        <path d="M455,236 L500,214 L500,360 L455,360 Z" fill="var(--home-wall-2)" />
        {/* front wall */}
        <rect x={224} y={236} width={232} height={124} rx={6} fill="var(--home-wall)" />

        {/* roof slab with solar panels */}
        <path d="M214,196 L470,158 L492,196 L236,234 Z" fill="var(--home-roof)" />
        <g clipPath="url(#roofClip)">
          <rect x={214} y={150} width={280} height={90} fill="url(#panel)" />
          {/* panel grid */}
          {Array.from({ length: PANEL_COLS - 1 }).map((_, i) => {
            const t = (i + 1) / PANEL_COLS;
            const xTop = 214 + t * (470 - 214);
            const xBot = 236 + t * (492 - 236);
            return (
              <line
                key={`v${i}`}
                x1={xTop}
                y1={150}
                x2={xBot}
                y2={240}
                stroke="var(--energy-dim)"
                strokeWidth={1}
                opacity={0.5}
              />
            );
          })}
          {Array.from({ length: PANEL_ROWS - 1 }).map((_, i) => {
            const y = 196 + (i - (PANEL_ROWS - 2) / 2) * 16;
            return (
              <line
                key={`h${i}`}
                x1={210}
                y1={y - 22}
                x2={496}
                y2={y - 22 + 8}
                stroke="var(--energy-dim)"
                strokeWidth={1}
                opacity={0.35}
              />
            );
          })}
          {/* moving shimmer */}
          <rect
            x={150}
            y={150}
            width={120}
            height={120}
            fill="url(#shimmer)"
            className="solar-shimmer"
            opacity={0.5}
          />
        </g>

        {/* windows + door */}
        <rect x={244} y={262} width={56} height={48} rx={4} fill="var(--home-glass)" stroke="var(--energy-primary)" strokeWidth={1.5} />
        <rect x={314} y={262} width={56} height={48} rx={4} fill="var(--solar)" opacity={0.85} />
        <rect x={384} y={262} width={50} height={98} rx={4} fill="var(--home-glass)" stroke="var(--energy-primary)" strokeWidth={1.5} />
      </g>

      {/* foreground shrub */}
      <g transform="translate(150 360)">
        <path d="M0,12 C-14,6 -16,-12 0,-18 C16,-12 14,6 0,12 Z" fill="var(--savings)" opacity={0.9} />
        <rect x={-1.5} y={10} width={3} height={10} fill="var(--home-pipe)" />
      </g>
    </svg>
  );
}
