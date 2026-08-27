"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "./quality";

/* ---------------------------------------------------------------------------
 * Lenis and GSAP share ONE requestAnimationFrame. Running them separately is
 * the single most common cause of scroll-driven 3D that stutters — two loops
 * updating the same frame at different times.
 * ------------------------------------------------------------------------ */

let lenis: Lenis | null = null;
export const getLenis = () => lenis;

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    // Reduced motion gets native scrolling. Smooth scroll is motion too.
    if (prefersReducedMotion()) {
      ScrollTrigger.refresh();
      return;
    }

    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis?.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Fonts and images change layout height; pins computed before they land
    // are wrong. Refresh once everything has settled.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  // Every route change resets scroll and rebuilds triggers. Leaked
  // ScrollTriggers from a previous page are the classic "it animates wrong the
  // second time you visit" bug.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}

export function lockScroll(locked: boolean) {
  if (!lenis) {
    document.body.style.overflow = locked ? "hidden" : "";
    return;
  }
  if (locked) lenis.stop();
  else lenis.start();
}
