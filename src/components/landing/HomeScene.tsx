"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * The "living home" — a detailed, depth-shaded SVG scene that animates the
 * home's renewable systems: solar panels shimmer, wind turbines spin, and the
 * geothermal loop shows fluid flowing into a borehole. Theme-aware via --home-*
 * tokens, and day/night aware: the SUN shows in light mode, the MOON + stars in
 * dark mode (sun fully removed at night). Honors prefers-reduced-motion.
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
  const reduceMotion = useReducedMotion();
  // Airfoil blade: tapered, slight curve. Starts at y=0 (hub center).
  const blade = "M0,0 C7,-22 7,-54 2,-78 C-1,-54 -4,-22 0,0 Z";
  const towerH = baseY - hubY;
  const dur = `${fast ? 4.5 : 7}s`;
  return (
    <g transform={`translate(${x} ${hubY}) scale(${scale})`}>
      {/* mast: continuous tapered pole from ground up to hub */}
      <path d={`M-3,0 L3,0 L6,${towerH} L-6,${towerH} Z`} fill="url(#towerGrad)" />
      {/* base shadow */}
      <ellipse cx={0} cy={towerH} rx={14} ry={3.5} fill="#000" opacity={0.08} />
      {/* rotor — SVG animateTransform rotates around (0,0) = hub center exactly */}
      <g>
        {[0, 120, 240].map((deg) => (
          <path key={deg} d={blade} transform={`rotate(${deg})`} fill="url(#bladeGrad)" />
        ))}
        {!reduceMotion && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur={dur}
            repeatCount="indefinite"
          />
        )}
      </g>
      {/* hub cap */}
      <circle r={5.5} fill="var(--solar)" />
      <circle r={2.2} fill="#fff" opacity={0.65} />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={20} ry={5} fill="#000" opacity={0.08} />
      <rect x={-3} y={-26} width={6} height={32} rx={2} fill="var(--home-pipe)" />
      <circle cx={0} cy={-40} r={20} fill="url(#treeGrad)" />
      <circle cx={-12} cy={-30} r={14} fill="url(#treeGrad)" />
      <circle cx={12} cy={-32} r={13} fill="url(#treeGrad)" />
      <circle cx={-6} cy={-46} r={7} fill="#ffffff" opacity={0.12} />
    </g>
  );
}

export function HomeScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 480"
      className={cn("h-auto w-full select-none overflow-visible", className)}
      style={{
        maskImage: "radial-gradient(ellipse 86% 80% at 54% 52%, black 38%, transparent 76%)",
        WebkitMaskImage: "radial-gradient(ellipse 86% 80% at 54% 52%, black 38%, transparent 76%)",
      }}
      role="img"
      aria-label="An illustrated home with solar panels, wind turbines and a geothermal loop"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--solar-bright)" stopOpacity="0.85" />
          <stop offset="45%" stopColor="var(--solar)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--solar)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sunCore" cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#fff3d6" />
          <stop offset="55%" stopColor="var(--solar-bright)" />
          <stop offset="100%" stopColor="var(--solar)" />
        </radialGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#cfe0ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#cfe0ff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonCore" cx="38%" cy="36%" r="75%">
          <stop offset="0%" stopColor="#f4f6ff" />
          <stop offset="100%" stopColor="#c3cde6" />
        </radialGradient>

        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--home-wall)" />
          <stop offset="100%" stopColor="var(--home-wall-2)" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0%" stopColor="var(--home-roof-2)" />
          <stop offset="100%" stopColor="var(--home-roof)" />
        </linearGradient>
        <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#15485a" />
          <stop offset="100%" stopColor="#0a2530" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--home-glass)" />
          <stop offset="55%" stopColor="var(--energy-dim)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--home-glass)" />
        </linearGradient>
        <linearGradient id="towerGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3efe7" />
          <stop offset="100%" stopColor="#c9c2b4" />
        </linearGradient>
        <linearGradient id="bladeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d8d2c6" />
        </linearGradient>
        <radialGradient id="treeGrad" cx="38%" cy="34%" r="75%">
          <stop offset="0%" stopColor="var(--savings)" />
          <stop offset="100%" stopColor="#0b7a55" />
        </radialGradient>

        {/* Ground — transparent at the top edge, opaque below, so the terrain
            blends into the background instead of sitting on a hard block. */}
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--home-ground)" stopOpacity="0" />
          <stop offset="28%" stopColor="var(--home-ground)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--home-pipe)" stopOpacity="1" />
        </linearGradient>

        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="roofClip">
          <path d="M214,196 L470,158 L492,196 L236,234 Z" />
        </clipPath>
        <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>

        {/* Soft drop shadow for the house — feathered, no hard edge */}
        <filter id="houseDrop" x="-18%" y="-6%" width="136%" height="140%">
          <feDropShadow dx="0" dy="14" stdDeviation="22" floodOpacity="0.13" />
        </filter>

        {/* Bottom dissolve: fades the scene into the page background */}
        <linearGradient id="bottomFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--bg-base)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--bg-base)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* ===== SKY: day (sun) vs night (moon + stars) ===== */}
      <g className="scene-day">
        <circle cx={552} cy={92} r={130} fill="url(#sunGlow)" className="soft-bob" />
        <g className="soft-bob">
          <circle cx={552} cy={92} r={40} fill="url(#sunCore)" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 552 + Math.cos(a) * 50;
            const y1 = 92 + Math.sin(a) * 50;
            const x2 = 552 + Math.cos(a) * 62;
            const y2 = 92 + Math.sin(a) * 62;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="var(--solar)"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.7}
              />
            );
          })}
        </g>
      </g>

      <g className="scene-night">
        <circle cx={552} cy={92} r={120} fill="url(#moonGlow)" />
        <g className="soft-bob">
          <circle cx={552} cy={92} r={38} fill="url(#moonCore)" />
          {/* craters */}
          <circle cx={544} cy={82} r={6} fill="#aeb9d6" opacity={0.7} />
          <circle cx={562} cy={98} r={4.5} fill="#aeb9d6" opacity={0.6} />
          <circle cx={548} cy={104} r={3.5} fill="#aeb9d6" opacity={0.5} />
        </g>
        {/* stars */}
        {[
          [90, 60], [160, 110], [250, 64], [340, 96], [420, 60],
          [470, 130], [120, 150], [300, 130], [610, 200], [60, 210],
        ].map(([cx, cy], i) => (
          <g key={i} className="twinkle" style={{ animationDelay: `${i * 0.4}s` }}>
            <circle cx={cx} cy={cy} r={i % 3 === 0 ? 2.2 : 1.4} fill="#eef2ff" />
          </g>
        ))}
      </g>

      {/* ===== turbines (behind) ===== */}
      <Turbine x={92} hubY={150} baseY={372} scale={1.08} />
      <Turbine x={584} hubY={206} baseY={372} scale={0.78} fast />

      {/* ===== ground — soft organic edge dissolves into background ===== */}
      <path d="M0,372 Q320,346 640,372 L640,480 L0,480 Z" fill="url(#groundGrad)" />
      {/* soil band (faint depth layer) */}
      <path
        d="M0,408 Q320,388 640,408 L640,480 L0,480 Z"
        fill="#000"
        opacity={0.04}
      />

      {/* ===== geothermal: heat pump + loop into a borehole ===== */}
      <g>
        {/* heat-pump unit beside the house */}
        <rect x={176} y={336} width={34} height={30} rx={6} fill="var(--home-wall-2)" stroke="var(--border-subtle)" />
        <circle cx={193} cy={351} r={9} fill="var(--home-roof)" />
        <circle cx={193} cy={351} r={3} fill="var(--energy-primary)" />
        {/* loop */}
        <g fill="none" strokeLinecap="round">
          <path
            d="M205,360 L240,360 L240,440 Q240,456 256,456 L286,456 Q302,456 302,440 L302,360"
            stroke="var(--home-pipe)"
            strokeWidth={9}
          />
          <path
            d="M205,360 L240,360 L240,440 Q240,456 256,456 L286,456 Q302,456 302,440 L302,360"
            stroke="var(--energy-primary)"
            strokeWidth={3.5}
            className="geo-flow"
          />
        </g>
      </g>

      {/* ===== house — wrapped in soft drop-shadow filter for depth ===== */}
      <g filter="url(#houseDrop)">
        {/* contact shadow */}
        <ellipse cx={350} cy={364} rx={150} ry={16} fill="#000" opacity={0.1} filter="url(#soft)" />

        {/* side wall (depth) */}
        <path d="M456,236 L502,213 L502,362 L456,362 Z" fill="var(--home-wall-2)" />
        {/* front wall */}
        <rect x={224} y={236} width={232} height={126} rx={8} fill="url(#wallGrad)" />
        {/* foundation */}
        <rect x={218} y={356} width={244} height={10} rx={4} fill="var(--home-roof)" opacity={0.85} />

        {/* roof slab + fascia */}
        <path d="M210,200 L472,160 L496,200 L238,240 Z" fill="var(--home-roof)" opacity={0.9} />
        <path d="M214,196 L470,158 L492,196 L236,234 Z" fill="url(#roofGrad)" />
        {/* solar array */}
        <g clipPath="url(#roofClip)">
          <rect x={210} y={150} width={290} height={92} fill="url(#panelGrad)" />
          {/* cell grid */}
          {Array.from({ length: 6 }).map((_, i) => {
            const t = (i + 1) / 7;
            return (
              <line
                key={`v${i}`}
                x1={214 + t * 256}
                y1={158}
                x2={236 + t * 256}
                y2={234}
                stroke="var(--energy-dim)"
                strokeWidth={1}
                opacity={0.45}
              />
            );
          })}
          {[176, 196, 216].map((y, i) => (
            <line
              key={`h${i}`}
              x1={206}
              y1={y - (216 - y) * 0}
              x2={500}
              y2={y - 18}
              stroke="var(--energy-dim)"
              strokeWidth={1}
              opacity={0.3}
            />
          ))}
          {/* glass reflection */}
          <path d="M214,196 L470,158 L492,196 L236,234 Z" fill="#ffffff" opacity={0.06} />
          {/* moving shimmer */}
          <rect x={140} y={150} width={120} height={120} fill="url(#shimmer)" className="solar-shimmer" opacity={0.5} />
        </g>

        {/* windows (frame + mullions + glass) */}
        {[
          { x: 242, y: 260, w: 58, h: 50 },
          { x: 314, y: 260, w: 58, h: 50, lit: true },
          { x: 386, y: 260, w: 50, h: 100 },
        ].map((win, i) => (
          <g key={i}>
            <rect x={win.x - 2} y={win.y - 2} width={win.w + 4} height={win.h + 4} rx={6} fill="var(--home-wall-2)" />
            <rect x={win.x} y={win.y} width={win.w} height={win.h} rx={5} fill={win.lit ? "var(--solar)" : "url(#glassGrad)"} opacity={win.lit ? 0.9 : 1} />
            <line x1={win.x + win.w / 2} y1={win.y} x2={win.x + win.w / 2} y2={win.y + win.h} stroke="var(--home-wall-2)" strokeWidth={2} />
            <line x1={win.x} y1={win.y + win.h / 2} x2={win.x + win.w} y2={win.y + win.h / 2} stroke="var(--home-wall-2)" strokeWidth={2} />
          </g>
        ))}

        {/* night: warm interior glow in the windows */}
        <g className="scene-night">
          {[
            [242, 260, 58, 50],
            [386, 260, 50, 100],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={5} fill="var(--solar)" opacity={0.55} />
          ))}
        </g>
      </g>

      {/* ===== landscaping ===== */}
      <Tree x={150} y={356} s={1.1} />
      <Tree x={524} y={360} s={0.85} />
      {/* grass tufts */}
      {[60, 110, 430, 480, 600].map((x, i) => (
        <path
          key={i}
          d={`M${x},372 q3,-12 6,0 q3,-12 6,0`}
          stroke="var(--savings)"
          strokeWidth={2}
          fill="none"
          opacity={0.6}
        />
      ))}

      {/* Bottom dissolve — fades the scene floor into the page bg, removing the
          hard rectangular cutoff at the SVG boundary. */}
      <rect x="0" y="418" width="640" height="62" fill="url(#bottomFade)" />
    </svg>
  );
}
