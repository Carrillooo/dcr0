"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Backdrop } from "../Atmosphere";
import { Studio } from "../Studio";

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
        // Automotive paint over a dark base: light enough that the resolved
        // body actually reads as a car rather than as a hole in the page.
        // Automotive paint: a diffuse base under a clearcoat, not a mirror.
        // High metalness in a dark studio gives a black cut-out, because a
        // metal can only show you what there is to reflect.
        color: "#31343c",
        metalness: 0.1,
        roughness: 0.44,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.0,
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
      <Studio mood="clinical" resolution={128} />
      <Backdrop sweep={0.3 + progress * 0.4} presence={0.75} ground="#08080b" accent={progress} />
      {/* Studio key, cool fill from behind, and a very restrained red kicker. */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 7, 6]} intensity={3.4} color="#eef2fb" />
      <directionalLight position={[-6, 3, -5]} intensity={1.8} color="#8fa4c8" />
      <directionalLight position={[2, -1, -6]} intensity={0.45} color="#c8102e" />

      <group scale={scale} position={[offset, 0.35, 0]}>
        <lineSegments ref={lines} geometry={edges} material={lineMat} />
        <mesh ref={solid} geometry={geometry} material={solidMat} />
      </group>
    </>
  );
}
