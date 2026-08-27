"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperience, type SceneKey } from "@/lib/store";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Wraps the DOM-only part of a page and switches the canvas off while it is on
 * screen. The Canvas element stays mounted (one WebGL context for the whole
 * site) but draws nothing, which takes idle GPU work to roughly zero for the
 * half of the home page that is pure typography.
 */
export function SceneGate({
  children,
  scene = "void",
  restore = "home",
}: {
  children: ReactNode;
  scene?: SceneKey;
  restore?: SceneKey;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const setScene = useExperience((s) => s.setScene);

  useGSAP(
    () => {
      const t = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 60%",
        end: "bottom top",
        onEnter: () => setScene(scene),
        onEnterBack: () => setScene(scene),
        onLeaveBack: () => setScene(restore),
      });
      return () => t.kill();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
