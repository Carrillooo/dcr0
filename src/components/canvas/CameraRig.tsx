"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience, type StageId } from "@/lib/store";

/* ---------------------------------------------------------------------------
 * All camera motion on the site lives here. Nothing else is allowed to touch
 * the camera, which is what keeps the movement reading as direction rather
 * than as four components fighting over one object.
 *
 * Every act is a short path the scroll walks along; the camera is damped toward
 * the sampled point, never assigned the raw scroll value (that is what causes
 * the jitter you see on most scroll-driven 3D sites).
 * ------------------------------------------------------------------------ */

type Move = {
  /** Camera path. Sampled with the act's progress. */
  path: THREE.CatmullRomCurve3;
  /** Where it looks, start → end. */
  aim: [THREE.Vector3, THREE.Vector3];
  fov: [number, number];
  /** How strongly the pointer nudges the frame. Small, always. */
  parallax: number;
};

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

const DESKTOP: Record<StageId, Move> = {
  /* Pushes in out of the dark. Starts far enough that the product is a rumour. */
  reveal: {
    path: new THREE.CatmullRomCurve3([v(0, 0.5, 10.5), v(0.7, 0.35, 7.4), v(0.35, 0.2, 5.8), v(0.1, 0.12, 4.6)]),
    aim: [v(0, 0, 0), v(0, 0.02, 0)],
    fov: [20, 30],
    parallax: 0.5,
  },
  /* Pulls back and lifts so the separated components all stay in frame. */
  explode: {
    path: new THREE.CatmullRomCurve3([v(0.1, 0.12, 4.6), v(2.3, 0.45, 5.2), v(3.1, 0.15, 6.3), v(1.5, -0.08, 7.1)]),
    aim: [v(0, 0.02, 0), v(0, 0.06, 0)],
    fov: [30, 36],
    parallax: 0.35,
  },
  /* Lateral travelling shot across the five category worlds. */
  worlds: {
    path: new THREE.CatmullRomCurve3([v(-2.2, 0.25, 5.6), v(-0.8, 0.45, 5.0), v(0.9, 0.25, 4.8), v(2.4, 0.35, 5.6)]),
    aim: [v(0, 0.02, 0), v(0, 0.02, 0)],
    fov: [29, 29],
    parallax: 0.6,
  },
  /* Dives into the cabin. Ends close, low and slightly off-axis — the angle a
     photographer uses for an interior detail, not a centred product shot. */
  context: {
    path: new THREE.CatmullRomCurve3([v(0.25, 1.5, 4.6), v(0.1, 0.75, 3.1), v(-0.4, 0.12, 1.95), v(-0.52, -0.08, 1.5)]),
    aim: [v(0, 0.25, 0), v(-0.04, -0.44, 0)],
    fov: [34, 28],
    parallax: 0.28,
  },
  /* Macro. Very close, very tight, almost no parallax so it holds still. */
  engineering: {
    path: new THREE.CatmullRomCurve3([v(1.9, 0.7, 3.6), v(1.15, 0.5, 2.7), v(0.7, 0.3, 2.1), v(0.42, 0.16, 1.75)]),
    aim: [v(0, 0.2, 0), v(0, 0.12, 0)],
    fov: [26, 21],
    parallax: 0.12,
  },
  /* Product page: free-ish inspection, driven by pointer rather than scroll. */
  studio: {
    path: new THREE.CatmullRomCurve3([v(0, 0.08, 6.2), v(0, 0.08, 5.9), v(0, 0.08, 5.75), v(0, 0.08, 5.6)]),
    aim: [v(0, 0, 0), v(0, 0, 0)],
    fov: [27, 25],
    parallax: 0.75,
  },
  idle: {
    path: new THREE.CatmullRomCurve3([v(0, 0.2, 6.4), v(0, 0.2, 6.4), v(0, 0.2, 6.4), v(0, 0.2, 6.4)]),
    aim: [v(0, 0, 0), v(0, 0, 0)],
    fov: [30, 30],
    parallax: 0.4,
  },
};

/* Portrait needs its own framing, not a narrower FOV on the same path.
   Closer, higher, and with the product placed lower in frame so the type
   above it has somewhere to live. */
const MOBILE: Partial<Record<StageId, Move>> = {
  reveal: {
    path: new THREE.CatmullRomCurve3([v(0, 0.55, 9.5), v(0.3, 0.42, 7.0), v(0.1, 0.25, 5.6), v(0, 0.18, 4.9)]),
    aim: [v(0, 0, 0), v(0, 0.04, 0)],
    fov: [32, 42],
    parallax: 0,
  },
  explode: {
    path: new THREE.CatmullRomCurve3([v(0, 0.18, 4.9), v(0.7, 0.3, 5.8), v(1.0, 0.1, 7.0), v(0.5, 0, 7.8)]),
    aim: [v(0, 0.04, 0), v(0, 0.08, 0)],
    fov: [42, 48],
    parallax: 0,
  },
  worlds: {
    path: new THREE.CatmullRomCurve3([v(-0.8, 0.25, 6.4), v(-0.3, 0.35, 6.0), v(0.4, 0.25, 5.9), v(0.9, 0.3, 6.4)]),
    aim: [v(0, 0.02, 0), v(0, 0.02, 0)],
    fov: [42, 42],
    parallax: 0,
  },
  context: {
    path: new THREE.CatmullRomCurve3([v(0.15, 1.4, 4.4), v(0, 0.7, 3.2), v(-0.22, 0.16, 2.4), v(-0.26, -0.02, 2.0)]),
    aim: [v(0, 0.25, 0), v(-0.03, -0.44, 0)],
    fov: [46, 40],
    parallax: 0,
  },
  engineering: {
    path: new THREE.CatmullRomCurve3([v(1.5, 0.7, 4.4), v(0.95, 0.5, 3.4), v(0.6, 0.3, 2.7), v(0.36, 0.18, 2.3)]),
    aim: [v(0, 0.2, 0), v(0, 0.12, 0)],
    fov: [38, 31],
    parallax: 0,
  },
  studio: {
    path: new THREE.CatmullRomCurve3([v(0, 0.1, 7.0), v(0, 0.1, 6.6), v(0, 0.1, 6.4), v(0, 0.1, 6.2)]),
    aim: [v(0, 0, 0), v(0, 0, 0)],
    fov: [40, 38],
    parallax: 0,
  },
};

const pos = new THREE.Vector3();
const look = new THREE.Vector3();
const target = new THREE.Vector3();

export function CameraRig({ mobile = false, reduced = false }: { mobile?: boolean; reduced?: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const pointer = useThree((s) => s.pointer);
  const eased = useRef(0);
  const px = useRef(0);
  const py = useRef(0);

  useFrame((_, dt) => {
    const { stage, narrative } = useExperience.getState();
    const move = (mobile && MOBILE[stage]) || DESKTOP[stage] || DESKTOP.idle;

    // Damp the scroll value itself, so a flicked trackpad does not snap the camera.
    eased.current = THREE.MathUtils.damp(eased.current, narrative, 5, dt);
    const t = THREE.MathUtils.clamp(eased.current, 0, 1);

    move.path.getPointAt(t, pos);

    // Pointer influence — small and damped, and off entirely on touch.
    if (!mobile && !reduced) {
      px.current = THREE.MathUtils.damp(px.current, pointer.x, 2.4, dt);
      py.current = THREE.MathUtils.damp(py.current, pointer.y, 2.4, dt);
      pos.x += px.current * move.parallax * 0.28;
      pos.y += py.current * move.parallax * 0.16;
    }

    camera.position.lerp(pos, 1 - Math.exp(-6 * dt));

    look.lerpVectors(move.aim[0], move.aim[1], t);
    target.lerp(look, 1 - Math.exp(-6 * dt));
    camera.lookAt(target);

    const fov = THREE.MathUtils.lerp(move.fov[0], move.fov[1], t);
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 5, dt);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
