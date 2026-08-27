"use client";

import { EffectComposer, Bloom, Vignette, Noise, SMAA } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

/* ---------------------------------------------------------------------------
 * Budget: three passes on desktop, none on low tier.
 *
 * Bloom is deliberately weak and high-threshold. It exists to bloom the lens
 * marker and the ambient strip — the only genuinely emissive things in the
 * scene — and nothing else. Bloom used to rescue a dull material is the fastest
 * way to make a premium product site look like a video game.
 * ------------------------------------------------------------------------ */

export function Effects({ bloom = 0.3 }: { bloom?: number }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <SMAA />
      <Bloom
        intensity={bloom}
        luminanceThreshold={0.94}
        luminanceSmoothing={0.22}
        mipmapBlur
        radius={0.6}
      />
      <Vignette offset={0.28} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
      <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.16} />
    </EffectComposer>
  );
}
