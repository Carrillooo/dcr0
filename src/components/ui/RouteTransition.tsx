"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useExperience } from "@/lib/store";

/* ---------------------------------------------------------------------------
 * Route transitions as a light wipe: a hard blade of light crosses the frame,
 * the page changes behind it, and it leaves. It is the same visual idea as the
 * headlight sweep in the home narrative, which is what makes navigation feel
 * like part of the same film rather than a page load.
 *
 * Implemented by intercepting internal link clicks so the OUT can play before
 * the router moves. Modifier-clicks, new tabs, downloads and external links all
 * fall through to the browser untouched — a transition that breaks Cmd+click is
 * a worse experience than no transition.
 * ------------------------------------------------------------------------ */

const OUT = 0.52;
const IN = 0.62;

export function RouteTransition() {
  const panel = useRef<HTMLDivElement>(null);
  const blade = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const busy = useRef(false);
  const loaded = useExperience((s) => s.loaded);

  // OUT — intercept, cover, then navigate.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = (e.target as HTMLElement).closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download") || a.dataset.noTransition === "true") return;
      if (href === pathname) return;

      e.preventDefault();
      if (busy.current) return;
      busy.current = true;

      gsap
        .timeline({
          onComplete: () => {
            router.push(href);
            busy.current = false;
          },
        })
        .set(panel.current, { display: "block" })
        .fromTo(
          blade.current,
          { xPercent: -130, skewX: -8 },
          { xPercent: 0, skewX: 0, duration: OUT, ease: "power4.in" },
        )
        .fromTo(panel.current, { opacity: 0 }, { opacity: 1, duration: 0.18 }, `-=${OUT * 0.45}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname, router]);

  // IN — uncover once the new route has painted.
  useEffect(() => {
    if (!loaded) return;
    const tl = gsap.timeline({ delay: 0.04 });
    tl.to(blade.current, { xPercent: 130, skewX: 8, duration: IN, ease: "power3.out" })
      .to(panel.current, { opacity: 0, duration: 0.28 }, "-=0.4")
      .set(panel.current, { display: "none" })
      .add(() => ScrollTrigger.refresh());
    return () => {
      tl.kill();
    };
  }, [pathname, loaded]);

  return (
    <div
      ref={panel}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[90] hidden bg-ground"
      style={{ display: "none" }}
    >
      <div
        ref={blade}
        className="absolute inset-y-0 -left-[15%] w-[130%]"
        style={{
          background:
            "linear-gradient(100deg, transparent 0%, #050505 18%, #14161c 46%, #f2f2f0 50%, #14161c 54%, #050505 82%, transparent 100%)",
        }}
      />
    </div>
  );
}
