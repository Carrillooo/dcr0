"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { shadowMap } from "@/lib/textures";

/**
 * A soft grounded shadow. Real shadow maps are not worth a whole pass here —
 * but a hard-edged black circle reads as a sticker, which is worse than no
 * shadow at all. This is one transparent quad with a radial falloff.
 */
export function ContactShadow({
  opacity = 0.75,
  y = -0.86,
  radius = 1.25,
  squash = 1,
}: {
  opacity?: number;
  y?: number;
  radius?: number;
  squash?: number;
}) {
  const map = useMemo(() => shadowMap(), []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} scale={[radius, radius * squash, 1]}>
      <planeGeometry args={[2, 2]} />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={opacity}
        depthWrite={false}
        color={new THREE.Color("#000000")}
      />
    </mesh>
  );
}
