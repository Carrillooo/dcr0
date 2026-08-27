"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useMemo } from "react";

/* ---------------------------------------------------------------------------
 * Automotive product photography, built procedurally.
 *
 * The whole look comes from long rectangular strip lights, the way a Porsche or
 * a watch is actually lit: two long overhead softboxes for the highlight lines
 * that run the length of the body, side cards for the rim, and a single very
 * restrained red kicker that reads as brand rather than as a colour wash.
 *
 * No HDRI file to download, so there is nothing to 404 and nothing to optimise.
 * ------------------------------------------------------------------------ */

export type LightMood = "soft" | "contrast" | "emissive" | "clinical" | "industrial";

type Props = { mood?: LightMood; resolution?: number; accent?: string };

export function Studio({ mood = "soft", resolution = 256, accent = "#c8102e" }: Props) {
  const cfg = useMemo(() => MOODS[mood], [mood]);

  return (
    <Environment resolution={resolution} frames={1} background={false}>
      {/* Ground plane of the environment — a dark stage, never pure black,
          or metals lose their falloff and read as flat cut-outs. */}
      <mesh scale={80} position={[0, 0, -12]}>
        <sphereGeometry args={[1, 32, 16]} />
        <meshBasicMaterial color={cfg.ambient} side={1} />
      </mesh>

      {/* Key: long overhead strip. This is the highlight line down the body. */}
      <Lightformer
        form="rect"
        intensity={cfg.key}
        color="#ffffff"
        position={[0, 5.5, 1.5]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[10, 1.1, 1]}
      />

      {/* Second, narrower overhead strip offset off-axis — gives the surface
          two parallel highlight lines instead of one dead centre. */}
      <Lightformer
        form="rect"
        intensity={cfg.key * 0.7}
        color="#eef2ff"
        position={[-2.6, 4.6, -1.2]}
        rotation={[Math.PI / 2, 0, 0.35]}
        scale={[7, 0.5, 1]}
      />

      {/* Fill card, camera left — lifts the shadow side without killing contrast. */}
      <Lightformer
        form="rect"
        intensity={cfg.fill}
        color="#c9d3e0"
        position={[-5, 1, 2.5]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[8, 5, 1]}
      />

      {/* Rim, camera right and behind — separates the product from the ground. */}
      <Lightformer
        form="rect"
        intensity={cfg.rim}
        color="#ffffff"
        position={[5.5, 1.6, -3]}
        rotation={[0, -Math.PI / 2.4, 0]}
        scale={[6, 4, 1]}
      />

      {/* Low bounce — stops the underside going to a solid black silhouette. */}
      <Lightformer
        form="rect"
        intensity={cfg.bounce}
        color="#8f97a5"
        position={[0, -3.2, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[8, 6, 1]}
      />

      {/* The brand kicker. One small red source, low intensity, always behind.
          Enough to tint an edge; never enough to make the site "red and black". */}
      <Lightformer
        form="rect"
        intensity={cfg.accent}
        color={accent}
        position={[4.2, -0.9, -5.2]}
        rotation={[0, -Math.PI / 3, 0]}
        scale={[1.6, 1.2, 1]}
      />

      {cfg.extra}
    </Environment>
  );
}

const MOODS: Record<
  LightMood,
  { key: number; fill: number; rim: number; bounce: number; accent: number; ambient: string; extra?: React.ReactNode }
> = {
  /* Interior — dark cabin, light falls slowly. */
  soft: { key: 3.1, fill: 0.8, rim: 2.0, bounce: 0.36, accent: 0.5, ambient: "#0c0c0f" },

  /* Exterior — night road, hard moving light. */
  contrast: {
    key: 3.4,
    fill: 0.18,
    rim: 3.2,
    bounce: 0.1,
    accent: 0.3,
    ambient: "#050507",
    extra: (
      <Lightformer
        form="rect"
        intensity={2.4}
        color="#dfe8ff"
        position={[-4.5, 2.4, -4]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[1.2, 6, 1]}
      />
    ),
  },

  /* Lighting — the product is the source, so the room gives almost nothing. */
  emissive: { key: 1.4, fill: 0.2, rim: 1.5, bounce: 0.1, accent: 0.35, ambient: "#08080a" },

  /* Technology — even, measured, unemotional. */
  clinical: { key: 2.6, fill: 1.15, rim: 1.4, bounce: 0.5, accent: 0.8, ambient: "#101013" },

  /* Protection — heavier light for heavier material. */
  industrial: { key: 2.7, fill: 0.85, rim: 2.8, bounce: 0.5, accent: 0.45, ambient: "#0d0d0f" },
};
