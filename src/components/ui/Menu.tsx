"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useExperience } from "@/lib/store";
import { lockScroll } from "@/lib/smooth";
import { CATEGORIES } from "@/data/products";
import { SoundToggle } from "./SoundToggle";

/* ---------------------------------------------------------------------------
 * Fullscreen menu as a composition, not a dropdown list. Large type, staggered
 * line reveals, and the category worlds listed with their own material notes.
 * Focus trapped, Esc closes, scroll locked through Lenis (not overflow:hidden,
 * which fights smooth scroll).
 * ------------------------------------------------------------------------ */

const PRIMARY = [
  { href: "/shop", label: "Shop", meta: "All products" },
  { href: "/vehicle", label: "Vehicle", meta: "Find your fit" },
  { href: "/about", label: "About", meta: "Why DCRO exists" },
  { href: "/search", label: "Search", meta: "Find anything" },
];

export function Menu() {
  const open = useExperience((s) => s.menuOpen);
  const toggle = useExperience((s) => s.toggleMenu);
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);

  useEffect(() => {
    if (!open) return;

    opener.current = document.activeElement;
    lockScroll(true);
    closeRef.current?.focus();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.set(root.current, { display: "flex" })
        .fromTo(".mn-panel", { yPercent: -100 }, { yPercent: 0, duration: 0.85, ease: "expo.inOut" })
        .fromTo(
          ".mn-line",
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.85, ease: "expo.out", stagger: 0.06 },
          "-=0.35",
        )
        .fromTo(
          ".mn-world",
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 },
          "-=0.5",
        );
    }, root);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggle(false);
      if (e.key !== "Tab") return;
      const f = root.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!f?.length) return;
      const first = f[0];
      const lastEl = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      ctx.revert();
      lockScroll(false);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [open, toggle]);

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      style={{ display: "none" }}
    >
      <div className="mn-panel flex h-full w-full flex-col bg-ground px-5 py-8 md:px-10">
        <div className="flex items-center justify-between">
          <span className="t-mono tracking-[0.44em]">DCRO</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => toggle(false)}
            className="t-mono text-aluminium transition-colors hover:text-paper"
          >
            Close
          </button>
        </div>

        <nav className="mt-16 flex-1" aria-label="Menu">
          <ul>
            {PRIMARY.map((l) => (
              <li key={l.href} className="reveal-mask border-b border-rule">
                <Link
                  href={l.href}
                  onClick={() => toggle(false)}
                  className="mn-line group flex items-baseline justify-between py-4"
                >
                  <span className="t-display text-[13vw] leading-[0.9] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3 md:text-[9vw]">
                    {l.label}
                  </span>
                  <span className="t-mono shrink-0 text-aluminium">{l.meta}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <p className="t-mono text-aluminium">Worlds</p>
            {/* The floating toggle is desktop-only; on a phone it lives here. */}
            <span className="md:hidden">
              <SoundToggle inline />
            </span>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-5">
            {CATEGORIES.map((c) => (
              <li key={c.slug} className="mn-world">
                <Link
                  href={`/shop/${c.slug}`}
                  onClick={() => toggle(false)}
                  className="group block"
                >
                  <span className="t-mono block text-[9px] text-accent">{c.index}</span>
                  <span className="block font-display text-lg uppercase tracking-tight transition-colors group-hover:text-aluminium">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
