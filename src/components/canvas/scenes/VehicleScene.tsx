"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Backdrop } from "../Atmosphere";

/* ---------------------------------------------------------------------------
 * The vehicle selector is not a form with three dropdowns on a white card.
 * It is a car drawn as a light construction — the profile is built as a real
 * 2D path, extruded, and rendered as its own edges, so it reads as a CAD
 * drawing coming into focus as the selection is completed.
 * ------------------------------------------------------------------------ */

function carProfile() {
  const s = new THREE.Shape();
  // A generic hot-hatch profile. Deliberately not any manufacturer's shape.
  s.moveTo(-2.15, -0.42);
  s.lineTo(-2.2, 0.05);
  s.bezierCurveTo(-2.1, 0.34, -1.85, 0.4, -1.62, 0.42);
  s.lineTo(-1.15, 0.44);
  s.bezierCurveTo(-0.95, 0.86, -0.62, 1.06, -0.2, 1.08);
  s.lineTo(0.62, 1.06);
  s.bezierCurveTo(1.02, 1.02, 1.32, 0.82, 1.5, 0.44);
  s.lineTo(1.95, 0.4);
  s.bezierCurveTo(2.16, 0.36, 2.26, 0.2, 2.26, 0.0);
  s.lineTo(2.2, -0.42);
  s.lineTo(1.42, -0.46);
  s.absarc(1.05, -0.46, 0.37, 0, Math.PI, true);
  s.lineTo(-0.72, -0.46);
  s.absarc(-1.1, -0.46, 0.38, 0, Math.PI, true);
  s.closePath();
  return s;
}

export function VehicleScene({
  progress = 0,
  offset = 0,
  scale = 0.62,
}: {
  progress?: number;
  offset?: number;
  scale?: number;
}) {
  const lines = useRef<THREE.LineSegments>(null);
  const solid = useRef<THREE.Mesh>(null);
  const damped = useRef(0);

  const { edges, geometry } = useMemo(() => {
    const geometry = new THREE.ExtrudeGeometry(carProfile(), {
      depth: 1.7,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.06,
      bevelSegments: 2,
      curveSegments: 14,
    });
    geometry.center();
    const edges = new THREE.EdgesGeometry(geometry, 18);
    return { edges, geometry };
  }, []);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: "#9a9a95",
        transparent: true,
        opacity: 0.55,
      }),
    [],
  );

  const solidMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0d0d10",
        metalness: 0.9,
        roughness: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
        envMapIntensity: 1.2,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useFrame((state, dt) => {
    damped.current = THREE.MathUtils.damp(damped.current, progress, 3, dt);
    const p = damped.current;

    // Wireframe fades out as the solid body fades in: the drawing becomes a car
    // as the visitor completes the selection.
    lineMat.opacity = 0.2 + (1 - p) * 0.5;
    solidMat.opacity = p * 0.92;

    const t = state.clock.elapsedTime;
    const yaw = -0.5 + Math.sin(t * 0.14) * 0.09 + p * 0.22;
    if (lines.current) {
      lines.current.rotation.y = yaw;
      lines.current.rotation.x = -0.08;
    }
    if (solid.current) {
      solid.current.rotation.y = yaw;
      solid.current.rotation.x = -0.08;
    }
  });

  return (
    <>
      <Backdrop sweep={0.3 + progress * 0.4} presence={0.75} ground="#08080b" accent={progress} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} color="#dfe6f5" />
      <directionalLight position={[-5, 2, -4]} intensity={1.4} color="#c8102e" />

      <group scale={scale} position={[offset, 0.35, 0]}>
        <lineSegments ref={lines} geometry={edges} material={lineMat} />
        <mesh ref={solid} geometry={geometry} material={solidMat} />
      </group>
    </>
  );
}
