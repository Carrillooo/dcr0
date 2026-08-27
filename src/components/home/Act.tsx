"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperience, type StageId } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------------------------------------------------------------------
 * An Act is one pinned scene of the home narrative.
 *
 * The pin distance IS the scene's runtime — 300vh of scroll is a three-screen
 * long take. The wrapper is pinned and the children animate, never the other
 * way round.
 *
 * Beats inside are driven by direct DOM writes from the scrub callback rather
 * than React state: a setState per scroll frame is the single most common
 * reason scroll-driven sites drop frames.
 * ------------------------------------------------------------------------ */

type Props = {
  id: StageId;
  /** Scene runtime, in viewport heights of scroll. */
  length: number;
  children: ReactNode;
  className?: string;
  label?: string;
};

export function Act({ id, length, children, className = "", label }: Props) {
  const section = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const setStage = useExperience((s) => s.setStage);

  useGSAP(
    () => {
      const el = section.current;
      const beats = Array.from(
        sticky.current?.querySelectorAll<HTMLElement>("[data-beat]") ?? [],
      );

      const ranges = beats.map((b) => ({
        el: b,
        from: parseFloat(b.dataset.from ?? "0"),
        to: parseFloat(b.dataset.to ?? "1"),
        y: parseFloat(b.dataset.y ?? "26"),
        hold: b.dataset.hold === "true",
      }));

      // `active` matters: every act on the page runs its first apply on mount,
      // and if they all wrote the stage the last one mounted would win and the
      // canvas would open on the wrong camera. Only the act the visitor is
      // actually inside gets to direct the scene.
      const apply = (p: number, active: boolean) => {
        if (active) setStage(id, p);

        // Fade the frame OUT at the end of the act so the next scene cuts in
        // cleanly. Deliberately no fade-IN: an act must be fully legible at
        // progress 0, or the very first frame of the site is blank.
        if (sticky.current) {
          sticky.current.style.opacity = String(clamp((1 - p) / 0.03));
        }

        for (const r of ranges) {
          const span = r.to - r.from;
          // A beat anchored at the very start of the act is already open.
          const inT = r.from <= 0 ? 1 : clamp((p - r.from) / (span * 0.22));
          const outT = r.hold ? 0 : clamp((p - (r.to - span * 0.22)) / (span * 0.22));
          const v = inT * (1 - outT);
          const eased = v * v * (3 - 2 * v);

          r.el.style.opacity = String(eased);
          r.el.style.transform = `translate3d(0, ${(1 - eased) * r.y}px, 0)`;
          r.el.style.pointerEvents = eased > 0.6 ? "auto" : "none";
          r.el.style.visibility = eased > 0.004 ? "visible" : "hidden";
        }
      };

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: `+=${length * 100}%`,
        pin: sticky.current,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => apply(self.progress, true),
        onRefresh: (self) => apply(self.progress, self.isActive),
      });

      // ScrollTrigger does not fire onUpdate on creation, so without this the
      // opening frame of every act stays at its hidden initial state until the
      // visitor scrolls — which is exactly the moment it needs to look composed.
      apply(trigger.progress, trigger.isActive);

      return () => trigger.kill();
    },
    { scope: section, dependencies: [id, length] },
  );

  return (
    <section
      ref={section}
      aria-label={label}
      className={`relative ${className}`}
      style={{ height: `${(length + 1) * 100}vh` }}
    >
      <div ref={sticky} className="relative h-screen w-full overflow-hidden">
        {children}
      </div>
    </section>
  );
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** A moment inside an Act, expressed in the act's own 0→1 timeline. */
export function Beat({
  from,
  to,
  y = 26,
  hold = false,
  className = "",
  children,
}: {
  from: number;
  to: number;
  y?: number;
  hold?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-beat
      data-from={from}
      data-to={to}
      data-y={y}
      data-hold={hold ? "true" : "false"}
      className={`will-change-[opacity,transform] ${className}`}
      style={{ opacity: 0, visibility: "hidden" }}
    >
      {children}
    </div>
  );
}

/** The running technical rail. Present on every act — it is the site's spine. */
export function Rail({ index, title, note }: { index: string; title: string; note?: string }) {
  return (
    <div className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 md:left-10 lg:block">
      <div className="flex items-start gap-4">
        <span className="t-mono text-accent">{index}</span>
        <div className="h-px w-10 translate-y-[0.55em] bg-rule-strong" />
        <div>
          <span className="t-mono block text-paper">{title}</span>
          {note && <span className="t-mono mt-1 block text-[9px] text-aluminium">{note}</span>}
        </div>
      </div>
    </div>
  );
}
