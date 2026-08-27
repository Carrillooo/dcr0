"use client";

import { useMemo } from "react";
import { useExperience } from "@/lib/store";
import { CATEGORIES } from "@/data/products";
import { Studio, type LightMood } from "../Studio";
import { Backdrop, SweepLight, Motes } from "../Atmosphere";
import { Cabin } from "../Cabin";
import { ProductModel, type Finish } from "../products/ProductModel";
import { ContactShadow } from "../ContactShadow";
import type { Tier } from "@/lib/quality";
import { QUALITY } from "@/lib/quality";

/* ---------------------------------------------------------------------------
 * One scene, six acts. Nothing mounts or unmounts between acts — the same
 * product, the same stage, the same light, re-directed. That continuity is what
 * makes the home read as a single continuous take rather than a stack of
 * sections that each happen to contain 3D.
 * ------------------------------------------------------------------------ */

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Category finishes: each world changes the material, not just the caption. */
const WORLD_FINISH: Finish[] = ["graphite", "carbon", "silver", "graphite", "graphite"];

export function HomeScene({ tier, mobile = false }: { tier: Tier; mobile?: boolean }) {
  const stage = useExperience((s) => s.stage);
  const n = useExperience((s) => s.narrative);
  const q = QUALITY[tier];

  const look = useMemo(() => {
    switch (stage) {
      case "reveal":
        // The whole opening: a light crosses the stage and finds the object.
        return {
          sweep: 0.06 + n * 0.62,
          presence: 0.32 + smooth(0.0, 0.3, n) * 0.68,
          explode: 0,
          finish: "graphite" as Finish,
          mood: "soft" as LightMood,
          cabin: 0,
          glow: smooth(0.55, 1, n) * 1.4,
          through: 0,
          keyIntensity: 26 + smooth(0.1, 0.7, n) * 26,
          pScale: 1,
          pos: [0.2, 0, 0] as [number, number, number],
        };

      case "explode":
        return {
          sweep: 0.52,
          presence: 0.85,
          explode: smooth(0.05, 0.78, n) - smooth(0.86, 1, n) * 0.98,
          finish: "graphite" as Finish,
          mood: "clinical" as LightMood,
          cabin: 0,
          glow: 1.1,
          through: 0,
          keyIntensity: 40,
          pScale: 1,
          pos: [0, 0, 0] as [number, number, number],
        };

      case "worlds": {
        const i = Math.min(CATEGORIES.length - 1, Math.floor(n * CATEGORIES.length));
        return {
          // The light rakes across as the worlds change — one continuous move.
          sweep: 0.3 + n * 0.44,
          presence: 1,
          explode: 0,
          finish: WORLD_FINISH[i],
          mood: CATEGORIES[i].light,
          cabin: 0,
          glow: CATEGORIES[i].light === "emissive" ? 3.4 : 0.9,
          through: 0,
          keyIntensity: CATEGORIES[i].light === "emissive" ? 16 : 42,
          pScale: 1,
          pos: [0.22, 0, 0] as [number, number, number],
        };
      }

      case "context":
        return {
          sweep: 0.34,
          presence: 1 - smooth(0.15, 0.6, n) * 0.85,
          explode: 0,
          finish: "graphite" as Finish,
          mood: "soft" as LightMood,
          cabin: smooth(0.08, 0.45, n),
          glow: 0.8 + smooth(0.5, 1, n) * 1.2,
          through: 0,
          keyIntensity: 22,
          // The cabin sets world scale, so the product has to come down to the
          // size of an actual shift knob against a 1.5-unit-wide console.
          pScale: 1 - smooth(0.05, 0.5, n) * 0.58,
          pos: [0, -smooth(0.05, 0.5, n) * 0.42, 0] as [number, number, number],
        };

      case "engineering":
        return {
          sweep: 0.3 + n * 0.44,
          presence: 0.9,
          explode: smooth(0.3, 0.62, n) * 0.32,
          finish: "silver" as Finish,
          mood: "clinical" as LightMood,
          cabin: 0,
          glow: 1.2,
          // The cut out of the home narrative.
          through: smooth(0.78, 1, n),
          keyIntensity: 44,
          pScale: 1,
          pos: [0, 0, 0] as [number, number, number],
        };

      default:
        return {
          sweep: 0.5,
          presence: 1,
          explode: 0,
          finish: "graphite" as Finish,
          mood: "soft" as LightMood,
          cabin: 0,
          glow: 1,
          through: 0,
          keyIntensity: 30,
          pScale: 1,
          pos: [0, 0, 0] as [number, number, number],
        };
    }
  }, [stage, n]);

  // Portrait needs a tighter spread; the same travel reads as debris there.
  const spread = mobile ? 0.6 : 1;

  return (
    <>
      <Studio mood={look.mood} resolution={q.envResolution} />
      <Backdrop
        sweep={look.sweep}
        presence={look.presence}
        ground={look.mood === "clinical" ? "#0b0b0e" : "#07070a"}
        accent={look.mood === "contrast" ? 1.6 : 0.8}
      />
      <SweepLight sweep={look.sweep} intensity={look.keyIntensity} />

      {tier !== "low" && <Motes count={q.particles} />}

      <Cabin presence={look.cabin} strip={look.cabin} />

      <group position={look.pos}>
        <ProductModel
          explode={look.explode * spread}
          finish={look.finish}
          glow={look.glow}
          through={look.through}
          scale={look.pScale}
        />
      </group>

      <ContactShadow
        opacity={0.8 * (1 - look.cabin)}
        y={-0.74}
        radius={1.1}
        squash={0.62}
      />
    </>
  );
}
