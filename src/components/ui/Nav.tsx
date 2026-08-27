"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCommerce, useExperience, cartCount } from "@/lib/store";
import { Magnetic } from "./Magnetic";
import { useHydrated } from "@/lib/client";

/* ---------------------------------------------------------------------------
 * Minimal at rest and blended into whatever is behind it. A solid bar dropped
 * on top of a cinematic hero is the fastest way to make an experiential site
 * look like a template with a canvas glued underneath.
 * ------------------------------------------------------------------------ */

const LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/vehicle", label: "Vehicle" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const toggleMenu = useExperience((s) => s.toggleMenu);
  const loaded = useExperience((s) => s.loaded);
  const lines = useCommerce((s) => s.lines);
  const hydrated = useHydrated();
  const last = useRef(0);

  // Read straight from the store; the hydration gate keeps the server markup
  // and the first client paint identical without mirroring state in an effect.
  const count = hydrated ? cartCount(lines) : 0;

  useEffect(() => {
    if (!loaded) return;
    gsap.fromTo(
      bar.current,
      { yPercent: -100, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1, ease: "expo.out", delay: 0.25 },
    );
  }, [loaded]);

  // Hide going down, reveal going up. The nav should not compete with a scene.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > last.current && y > 220;
      gsap.to(bar.current, {
        yPercent: down ? -110 : 0,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={bar}
      className="fixed inset-x-0 top-0 z-50 mix-blend-difference"
      style={{ opacity: 0 }}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-h)] max-w-[1800px] items-center justify-between px-5 md:px-10"
      >
        <Link
          href="/"
          data-cursor="Home"
          className="t-mono text-[13px] tracking-[0.44em] text-paper"
          aria-label="DCRO home"
        >
          DCRO
        </Link>

        <div className="hidden items-center gap-10 lg:flex">
          {LINKS.map((l) => (
            <Magnetic key={l.href}>
              <Link
                href={l.href}
                data-cursor="View"
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className="group relative block py-2"
              >
                <span className="t-mono text-paper">{l.label}</span>
                <span
                  className="absolute -bottom-px left-0 h-px w-full origin-right scale-x-0 bg-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100"
                  style={
                    pathname.startsWith(l.href)
                      ? { transform: "scaleX(1)" }
                      : undefined
                  }
                />
              </Link>
            </Magnetic>
          ))}
        </div>

        <div className="flex items-center gap-5 md:gap-7">
          <Link href="/search" data-cursor="Search" className="t-mono text-paper hidden sm:block">
            Search
          </Link>
          <Link href="/account" data-cursor="Account" className="t-mono text-paper hidden sm:block">
            Account
          </Link>
          <Link href="/cart" data-cursor="Cart" className="t-mono text-paper tabular-nums">
            Cart<span className="text-accent">{count > 0 ? ` (${count})` : ""}</span>
          </Link>
          <button
            type="button"
            onClick={() => toggleMenu(true)}
            aria-label="Open menu"
            data-cursor="Menu"
            className="flex h-8 w-8 flex-col items-end justify-center gap-[5px] lg:hidden"
          >
            <span className="block h-px w-6 bg-paper" />
            <span className="block h-px w-4 bg-paper" />
          </button>
        </div>
      </nav>
    </header>
  );
}
