"use client";

import { createElement, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------------------
 * Motion system. Every duration and easing on the site comes from here, which
 * is what makes the movement feel authored by one hand.
 * ------------------------------------------------------------------------ */

export const E = {
  out: "power3.out",
  expo: "expo.out",
  inOut: "power2.inOut",
} as const;

export const D = { micro: 0.2, ui: 0.42, reveal: 0.95, scene: 1.4 } as const;
export const STAGGER = { tight: 0.045, normal: 0.075, loose: 0.13 } as const;

/**
 * Masked line reveal. The glyphs rise out of nothing rather than fading in —
 * a fade-up on everything is the clearest tell of a generated site.
 *
 * The text stays a single real node for assistive tech; only the wrapper moves.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
  y = 110,
  duration = D.reveal,
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  y?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const inner = ref.current?.querySelector(".reveal-line");
      if (!inner) return;
      gsap.fromTo(
        inner,
        { yPercent: y, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration,
          delay,
          ease: E.expo,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`reveal-mask ${className}`}>
      {createElement(Tag, { className: "reveal-line" }, children)}
    </div>
  );
}

/** Staggered children. Used for lists and specification tables, never for whole pages. */
export function RevealGroup({
  children,
  className = "",
  stagger = STAGGER.normal,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items?.length) return;
      gsap.fromTo(
        items,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: D.reveal,
          ease: E.expo,
          stagger: { amount: Math.min(stagger * items.length, 0.9), ease: "power2.out" },
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
