"use client";

/* Adaptive quality. Degrade the execution, never the concept. */

export type Tier = "high" | "mid" | "low";

let cached: Tier | null = null;

export function detectTier(): Tier {
  if (cached) return cached;
  if (typeof window === "undefined") return "high";

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.innerWidth < 768;
  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  let tier: Tier = "high";
  if (coarse || narrow) tier = "mid";
  if (cores <= 4 || mem <= 4) tier = "low";
  if ((coarse || narrow) && (cores <= 6 || mem <= 6)) tier = "low";

  cached = tier;
  return tier;
}

export const QUALITY: Record<Tier, {
  dpr: [number, number];
  post: boolean;
  bloom: number;
  shadows: boolean;
  envResolution: number;
  particles: number;
}> = {
  high: { dpr: [1, 2], post: true, bloom: 0.32, shadows: true, envResolution: 256, particles: 900 },
  mid: { dpr: [1, 1.5], post: true, bloom: 0.24, shadows: false, envResolution: 128, particles: 420 },
  low: { dpr: [1, 1], post: false, bloom: 0, shadows: false, envResolution: 64, particles: 160 },
};

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
