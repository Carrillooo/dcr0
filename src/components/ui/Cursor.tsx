"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/lib/store";

/* ---------------------------------------------------------------------------
 * Precise pointers only. Never on touch, never without restoring the native
 * cursor on unmount, and it stays small — a large blob covering the product is
 * a worse experience than no custom cursor at all.
 * ------------------------------------------------------------------------ */

export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useExperience((s) => s.cursor);
  const setCursor = useExperience((s) => s.setCursor);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.body.dataset.cursor = "on";

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;

    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // Read the intent declared by whatever is under the pointer.
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
      setCursor(el?.dataset.cursor ?? null);
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
      delete document.body.dataset.cursor;
    };
  }, [setCursor]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] hidden lg:block">
      <div
        ref={dot}
        className="absolute -left-[2px] -top-[2px] h-[4px] w-[4px] rounded-full bg-paper mix-blend-difference"
      />
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-paper/45 mix-blend-difference transition-[width,height,margin] duration-300"
        style={{
          width: label ? 74 : 28,
          height: label ? 74 : 28,
          marginLeft: label ? -37 : -14,
          marginTop: label ? -37 : -14,
        }}
      >
        <span
          className="t-mono text-[9px] text-paper transition-opacity duration-200"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
