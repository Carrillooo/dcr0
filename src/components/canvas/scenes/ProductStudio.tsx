"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Studio } from "../Studio";
import { Backdrop, SweepLight } from "../Atmosphere";
import { ProductModel, type Finish } from "../products/ProductModel";
import { ContactShadow } from "../ContactShadow";
import { QUALITY, type Tier } from "@/lib/quality";
import type { LightMood } from "../Studio";

/* ---------------------------------------------------------------------------
 * The product page canvas: an inspection studio. The visitor drags to turn it,
 * scroll drives the exploded view, and the light keeps moving slowly so the
 * metal never sits still and dead.
 *
 * Deliberately not OrbitControls — free tumbling lets the visitor find every
 * bad angle. This is constrained to the angles the product was lit for.
 * ------------------------------------------------------------------------ */

export function ProductStudio({
  tier,
  finish,
  explode,
  mood,
  glow = 1,
  offsetX = 0,
}: {
  tier: Tier;
  finish: Finish;
  explode: number;
  mood: LightMood;
  glow?: number;
  offsetX?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, last: 0, vel: 0, angle: 0 });
  const pointer = useThree((s) => s.pointer);
  const gl = useThree((s) => s.gl);
  const q = QUALITY[tier];

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;

    if (drag.current.active) {
      const dx = pointer.x - drag.current.last;
      drag.current.last = pointer.x;
      drag.current.vel = dx * 3.2;
    } else {
      // Idle drift, plus inertia from the last drag.
      drag.current.vel = THREE.MathUtils.damp(drag.current.vel, 0.055, 1.4, dt);
    }

    drag.current.angle += drag.current.vel;
    g.rotation.y = drag.current.angle;

    // Tilt follows the pointer a little, so the product acknowledges the cursor.
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -pointer.y * 0.12, 3, dt);
  });

  const onDown = () => {
    drag.current.active = true;
    drag.current.last = pointer.x;
    gl.domElement.style.cursor = "grabbing";
  };
  const onUp = () => {
    drag.current.active = false;
    gl.domElement.style.cursor = "";
  };

  return (
    <>
      <Studio mood={mood} resolution={q.envResolution} />
      <Backdrop sweep={0.5} presence={0.8} ground="#0a0a0c" accent={0.7} />
      <SweepLight sweep={0.62} intensity={30} />

      <group
        ref={group}
        position={[offsetX, 0, 0]}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onPointerMissed={onUp}
      >
        <ProductModel explode={explode} finish={finish} glow={glow} scale={0.92} />
        {/* Invisible grab volume so the drag target is the whole product area,
            not only the exact silhouette. */}
        <mesh visible={false}>
          <cylinderGeometry args={[0.85, 0.85, 2.4, 8]} />
        </mesh>
      </group>

      <group position={[offsetX, 0, 0]}>
        <ContactShadow opacity={0.72} y={-0.8} radius={1.05} squash={0.6} />
      </group>
    </>
  );
}
