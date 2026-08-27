"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { gradientMap } from "@/lib/textures";

/* ---------------------------------------------------------------------------
 * The car, as a silhouette. Deliberately not a full vehicle model: what sells
 * "installed in the car" is the enclosing dark geometry, one bright windscreen
 * behind it for the rim, and a single ambient strip — not 400k triangles of
 * dashboard nobody looks at.
 *
 * Everything here is dark and matte so the product stays the only thing lit.
 * ------------------------------------------------------------------------ */

export function Cabin({ presence = 1, strip = 1 }: { presence?: number; strip?: number }) {
  const group = useRef<THREE.Group>(null);
  const stripMat = useRef<THREE.MeshStandardMaterial>(null);
  const damped = useRef(0);

  const mats = useMemo(() => {
    const leather = new THREE.MeshPhysicalMaterial({
      color: "#0d0d0f",
      roughness: 0.88,
      metalness: 0,
      sheen: 0.8,
      sheenRoughness: 0.6,
      sheenColor: new THREE.Color("#4a4844"),
    });
    const trim = new THREE.MeshPhysicalMaterial({
      color: "#141417",
      roughness: 0.35,
      metalness: 0.9,
      clearcoat: 0.6,
      envMapIntensity: 1.2,
    });
    const glass = new THREE.MeshBasicMaterial({
      map: gradientMap("#2b3446", "#0a0d14", "screen"),
      toneMapped: false,
    });
    return { leather, trim, glass };
  }, []);

  useFrame((_, dt) => {
    damped.current = THREE.MathUtils.damp(damped.current, presence, 3, dt);
    if (group.current) {
      group.current.visible = damped.current > 0.01;
      group.current.scale.setScalar(0.94 + damped.current * 0.06);
    }
    if (stripMat.current) {
      stripMat.current.emissiveIntensity = strip * damped.current * 2.4;
    }
  });

  return (
    <group ref={group} position={[0, -0.55, 0]} dispose={null}>
      {/* Centre console — the surface the product sits on. */}
      <RoundedBox args={[1.5, 0.34, 2.4]} radius={0.09} smoothness={4} position={[0, -0.34, -0.35]}>
        <primitive object={mats.leather} attach="material" />
      </RoundedBox>

      {/* Gaiter surround: a machined trim ring the product rises out of. */}
      <mesh position={[0, -0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.035, 12, 48]} />
        <primitive object={mats.trim} attach="material" />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.42, 0.5, 0.16, 40, 1, true]} />
        <primitive object={mats.leather} attach="material" />
      </mesh>

      {/* Dashboard mass above — reads as enclosure, blocks the top of frame. */}
      <RoundedBox
        args={[3.6, 0.7, 1.1]}
        radius={0.24}
        smoothness={4}
        position={[0, 1.15, -2.15]}
        rotation={[-0.18, 0, 0]}
      >
        <primitive object={mats.leather} attach="material" />
      </RoundedBox>

      {/* Door card, camera left — gives the frame a near edge to fall off. */}
      <RoundedBox
        args={[0.34, 1.5, 3.0]}
        radius={0.12}
        smoothness={3}
        position={[-1.55, 0.15, -0.5]}
        rotation={[0, 0, 0.06]}
      >
        <primitive object={mats.leather} attach="material" />
      </RoundedBox>

      {/* The one ambient strip — this is the LUMEN product doing its job. */}
      <mesh position={[-1.36, 0.34, -0.5]} rotation={[0, 0, 0.06]}>
        <boxGeometry args={[0.012, 0.02, 2.1]} />
        <meshStandardMaterial
          ref={stripMat}
          color="#ffd9b0"
          emissive="#ffb877"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Windscreen: a cold bright plane far behind that rims everything. */}
      <mesh position={[0, 1.3, -4.4]} rotation={[-0.28, 0, 0]}>
        <planeGeometry args={[7, 3]} />
        <primitive object={mats.glass} attach="material" />
      </mesh>
    </group>
  );
}
