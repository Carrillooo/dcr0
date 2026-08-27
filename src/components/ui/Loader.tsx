"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useExperience } from "@/lib/store";
import { lockScroll } from "@/lib/smooth";

/* ---------------------------------------------------------------------------
 * The loading state is the first scene, not a spinner.
 *
 * A technical elevation of the product draws itself line by line while the app
 * boots; at 100% the drawing resolves into the real object and the panel wipes
 * away, handing straight to the 3D reveal already in progress behind it.
 * ------------------------------------------------------------------------ */

const PATHS = [
  // Cap
  "M92 44 q28 0 28 22 l0 6 -56 0 0 -6 q0 -22 28 -22Z",
  // Housing
  "M64 74 l56 0 0 30 -4 6 -48 0 -4 -6Z",
  // Knurl band
  "M62 112 l60 0 0 26 -60 0Z",
  // Collar
  "M68 142 l48 0 -3 16 -42 0Z",
  // Core
  "M76 162 l32 0 0 26 -32 0Z",
  // Base
  "M74 192 l36 0 -3 18 -30 0Z",
];

const TICKS = [44, 74, 112, 142, 162, 192, 210];

export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const setLoaded = useExperience((s) => s.setLoaded);

  useEffect(() => {
    lockScroll(true);

    const state = { v: 0 };
    const counter = gsap.to(state, {
      v: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => setPct(Math.round(state.v)),
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });

      tl.from(".ld-brand", { yPercent: 120, opacity: 0, duration: 0.9, ease: "expo.out" })
        .from(".ld-sub", { yPercent: 120, opacity: 0, duration: 0.9, ease: "expo.out" }, "-=0.7")
        // The drawing constructs itself, part by part, bottom-up like an assembly.
        .to(
          ".ld-path",
          { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.11 },
          "-=0.5",
        )
        .to(".ld-tick", { scaleX: 1, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.05 }, "-=1.1")
        .to(".ld-bar", { scaleX: 1, duration: 2.2, ease: "power2.inOut" }, 0.3)
        // Resolve: the wireframe fills, then the whole panel leaves upward.
        .to(".ld-fill", { opacity: 1, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(".ld-path", { opacity: 0.25, duration: 0.5 }, "<")
        .to(".ld-figure", { scale: 1.35, duration: 1.1, ease: "power3.inOut" }, "-=0.3")
        .to([".ld-brand", ".ld-sub", ".ld-meta", ".ld-track"], {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
        }, "-=0.7")
        .to(".ld-figure", { opacity: 0, scale: 1.9, duration: 0.7, ease: "power3.in" }, "-=0.35")
        .to(root.current, {
          yPercent: -100,
          duration: 1.1,
          ease: "expo.inOut",
          onStart: () => {
            setLoaded(true);
            lockScroll(false);
          },
        })
        .set(root.current, { display: "none" });
    }, root);

    return () => {
      counter.kill();
      ctx.revert();
      lockScroll(false);
    };
  }, [setLoaded]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ground px-6 py-8 md:px-12 md:py-10"
      role="status"
      aria-live="polite"
      aria-label="Loading DCRO"
    >
      <div className="flex items-start justify-between">
        <div className="reveal-mask">
          <span className="ld-brand t-mono block text-[11px] tracking-[0.42em] text-paper">DCRO</span>
        </div>
        <div className="reveal-mask">
          <span className="ld-sub t-mono block text-aluminium">Engineered for automotive</span>
        </div>
      </div>

      <div className="ld-figure flex flex-1 items-center justify-center will-change-transform">
        <svg width="184" height="254" viewBox="0 0 184 254" fill="none" aria-hidden>
          {/* Construction axis */}
          <line x1="92" y1="20" x2="92" y2="234" stroke="#c8102e" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.5" />

          {/* Dimension ticks — the drawing reads as an engineering elevation */}
          {TICKS.map((y, i) => (
            <g key={y} className="ld-tick origin-left opacity-0" style={{ transform: "scaleX(0)" }}>
              <line x1="24" y1={y} x2="56" y2={y} stroke="#9a9a95" strokeWidth="0.5" />
              <text x="24" y={y - 4} fill="#9a9a95" fontSize="6" letterSpacing="1.4" fontFamily="monospace">
                {String(i + 1).padStart(2, "0")}
              </text>
            </g>
          ))}

          {/* The filled resolution, revealed at the end */}
          <g className="ld-fill opacity-0">
            {PATHS.map((d, i) => (
              <path key={i} d={d} fill="#1c1c20" stroke="#9a9a95" strokeWidth="0.6" />
            ))}
          </g>

          {/* The drawing itself */}
          {PATHS.map((d, i) => (
            <path
              key={i}
              d={d}
              className="ld-path"
              fill="none"
              stroke="#f2f2f0"
              strokeWidth="0.9"
              strokeDasharray="400"
              strokeDashoffset="400"
            />
          ))}
        </svg>
      </div>

      <div>
        <div className="ld-track mb-3 h-px w-full bg-rule">
          <div className="ld-bar h-px w-full origin-left scale-x-0 bg-paper" />
        </div>
        <div className="ld-meta flex items-baseline justify-between">
          <span className="t-mono text-aluminium">DCRO ONE · Precision Shift Module</span>
          <span className="t-mono tabular-nums text-paper">{String(pct).padStart(3, "0")}</span>
        </div>
      </div>
    </div>
  );
}
