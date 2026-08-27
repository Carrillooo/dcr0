"use client";

/* ---------------------------------------------------------------------------
 * Stand-in product imagery, and deliberately not a grey box.
 *
 * Each product is drawn as a technical elevation on a lit plate. It reads as
 * deliberate art direction rather than a missing asset, it matches the loader
 * and the exploded-view language, and it is a single swap away from real
 * photography: replace the <svg> with <Image> and everything around it —
 * the plate, the sweep, the hover parallax — keeps working.
 * ------------------------------------------------------------------------ */

import type { CategorySlug } from "@/data/products";

const SILHOUETTES: Record<CategorySlug, string[]> = {
  interior: [
    "M92 40 q30 0 30 24 l0 8 -60 0 0 -8 q0 -24 30 -24Z",
    "M62 76 l60 0 0 32 -4 6 -52 0 -4 -6Z",
    "M60 116 l64 0 0 28 -64 0Z",
    "M66 148 l52 0 -4 18 -44 0Z",
    "M74 170 l36 0 -4 22 -28 0Z",
  ],
  lighting: [
    "M28 96 l128 0 q8 0 8 10 l0 20 q0 10 -8 10 l-128 0 q-8 0 -8 -10 l0 -20 q0 -10 8 -10Z",
    "M40 112 l104 0 0 12 -104 0Z",
    "M52 140 l80 0 0 8 -80 0Z",
    "M70 152 l44 0 0 14 -44 0Z",
  ],
  exterior: [
    "M16 132 q46 -40 76 -42 l0 -6 q34 2 76 42 l0 20 -152 0Z",
    "M32 138 l120 0 0 10 -120 0Z",
    "M52 154 l80 0 0 8 -80 0Z",
  ],
  technology: [
    "M44 66 l96 0 q10 0 10 10 l0 76 q0 10 -10 10 l-96 0 q-10 0 -10 -10 l0 -76 q0 -10 10 -10Z",
    "M56 80 l72 0 0 58 -72 0Z",
    "M78 168 l28 0 0 22 -28 0Z",
    "M60 190 l64 0 0 10 -64 0Z",
  ],
  protection: [
    "M92 44 l64 26 0 58 q0 46 -64 68 q-64 -22 -64 -68 l0 -58Z",
    "M92 66 l44 18 0 42 q0 32 -44 48 q-44 -16 -44 -48 l0 -42Z",
    "M74 108 l36 0 0 34 -36 0Z",
  ],
};

export function ProductPlate({
  category,
  className = "",
  tone = "dark",
}: {
  category: CategorySlug;
  className?: string;
  tone?: "dark" | "light";
}) {
  const paths = SILHOUETTES[category];
  const id = `pl-${category}-${tone}`;
  const stroke = tone === "dark" ? "#d8d8d3" : "#26262a";
  const rule = tone === "dark" ? "#9a9a95" : "#5a5a58";

  return (
    <svg
      viewBox="0 0 184 234"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={`${category} product elevation`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Lit from top-left, the way the 3D scene is lit. Without this the
            elevations read as clip art rather than as a product on a plate. */}
        <linearGradient id={`${id}-body`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={tone === "dark" ? "#43434a" : "#ffffff"} />
          <stop offset="38%" stopColor={tone === "dark" ? "#232329" : "#e8e6df"} />
          <stop offset="72%" stopColor={tone === "dark" ? "#141418" : "#d2d0c9"} />
          <stop offset="100%" stopColor={tone === "dark" ? "#0b0b0e" : "#bcbab3"} />
        </linearGradient>
        <linearGradient id={`${id}-sub`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={tone === "dark" ? "#2c2c33" : "#f2f0ea"} />
          <stop offset="100%" stopColor={tone === "dark" ? "#0e0e11" : "#c6c4bd"} />
        </linearGradient>
        {/* A single specular streak — the highlight line a strip light leaves. */}
        <linearGradient id={`${id}-spec`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity={tone === "dark" ? "0.42" : "0.75"} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}-clip`}>
          <path d={paths[0]} />
        </clipPath>
      </defs>

      {/* Construction geometry — the drawing is technical, not decorative. */}
      <g opacity="0.5">
        <line x1="92" y1="10" x2="92" y2="224" stroke="#c8102e" strokeWidth="0.5" strokeDasharray="3 5" />
        <line x1="14" y1="30" x2="26" y2="30" stroke={rule} strokeWidth="0.5" />
        <line x1="14" y1="204" x2="26" y2="204" stroke={rule} strokeWidth="0.5" />
        <line x1="20" y1="30" x2="20" y2="204" stroke={rule} strokeWidth="0.5" />
        <line x1="158" y1="204" x2="170" y2="204" stroke={rule} strokeWidth="0.5" />
      </g>

      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          fill={`url(#${id}-${i === 0 ? "body" : "sub"})`}
          stroke={stroke}
          strokeWidth="0.7"
          strokeLinejoin="round"
          strokeOpacity={0.55 - i * 0.06}
        />
      ))}

      {/* Highlight, clipped to the body so it behaves like a real reflection. */}
      <g clipPath={`url(#${id}-clip)`}>
        <rect x="46" y="0" width="26" height="234" fill={`url(#${id}-spec)`} transform="skewX(-8)" />
      </g>
    </svg>
  );
}
