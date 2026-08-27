"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { brushedMap, blastMap, carbonMap, microRoughnessMap } from "@/lib/textures";

/* ---------------------------------------------------------------------------
 * DCRO ONE — built from geometry rather than a GLB.
 *
 * Why procedural: there are no final models yet, and a stand-in cube would have
 * dragged the whole art direction down a level. This is a real machined form —
 * a lathe-turned housing with crisp chamfers, a recessed band of cut knurl, and
 * six separable components — so the exploded view, the macro camera and the
 * material work are all genuine.
 *
 * Replacing it later: keep the six part ids and the EXPLODE offsets, drop a
 * GLB in behind them, and every scroll timeline on the site keeps working.
 *
 * Form notes — the shape is straight-sided and chamfered on purpose. An earlier
 * pass had a barrel profile with an exposed thread coil and it read as a light
 * bulb; automotive hardware is flat-topped, hard-edged and recessed where the
 * hand goes.
 * ------------------------------------------------------------------------ */

export const PART_IDS = ["lens", "crown", "core", "knurl", "collar", "base"] as const;
export type PartId = (typeof PART_IDS)[number];

/** Travel of each component, in local units, at explode = 1. */
const EXPLODE: Record<PartId, number> = {
  lens: 1.5,
  crown: 0.78,
  core: 0.22,
  knurl: -0.3,
  collar: -0.8,
  base: -1.4,
};

/** Assembled positions. The core sits INSIDE the housing, which is what makes
    it worth revealing; every other part meets its neighbour with no gap. */
const REST_Y: Record<PartId, number> = {
  lens: 0.67,
  crown: 0.38,
  core: 0.38,
  knurl: -0.05,
  collar: -0.31,
  base: -0.53,
};

export type Finish = "graphite" | "silver" | "red" | "carbon";

type Props = {
  explode?: number;
  finish?: Finish;
  glow?: number;
  scale?: number;
  /** 0→1 camera-through-object: the cap grows past the camera and its material
      fills the frame, which is the cut into the next scene. */
  through?: number;
};

export function ProductModel({
  explode = 0,
  finish = "graphite",
  glow = 1,
  scale = 1,
  through = 0,
}: Props) {
  const rootRef = useRef<THREE.Group>(null);
  const parts = useRef<Record<string, THREE.Group | null>>({});
  const damped = useRef(0);
  const emissive = useRef<THREE.MeshStandardMaterial>(null);
  const knurlRef = useRef<THREE.InstancedMesh>(null);

  const mats = useMemo(() => buildMaterials(finish), [finish]);
  const knurl = useMemo(() => buildKnurl(), []);
  const crownGeo = useMemo(() => buildCrown(), []);
  const capGeo = useMemo(() => buildCap(), []);

  // 72 teeth, written once, one draw call.
  useEffect(() => {
    const mesh = knurlRef.current;
    if (!mesh) return;
    for (let i = 0; i < knurl.count; i++) mesh.setMatrixAt(i, knurl.matrices[i]);
    mesh.instanceMatrix.needsUpdate = true;
  }, [knurl]);

  useFrame((_, dt) => {
    // Frame-rate independent damping — never a raw lerp with a fixed factor.
    damped.current = THREE.MathUtils.damp(damped.current, explode, 4.2, dt);
    const e = damped.current;

    for (const id of PART_IDS) {
      const p = parts.current[id];
      if (!p) continue;
      p.position.y = REST_Y[id] + EXPLODE[id] * e;
      // Components turn very slightly as they separate: an engineering render,
      // not a set of objects sliding apart.
      p.rotation.y = e * (EXPLODE[id] > 0 ? 0.2 : -0.16);
    }

    if (emissive.current) emissive.current.emissiveIntensity = glow * (0.4 + e * 0.7);

    // Camera-through-object. The whole part swells toward the lens and its
    // surface fills the frame — passing through machined metal, so the frame
    // goes dark and hands straight to the next scene.
    const root = rootRef.current;
    if (root) {
      const th = THREE.MathUtils.damp((root.userData.th as number) ?? 0, through, 7, dt);
      root.userData.th = th;
      const swell = 1 + th * th * 7;
      root.scale.setScalar(scale * swell);
      root.position.z = th * th * 1.35;
      if (emissive.current) emissive.current.visible = th < 0.08;
    }
  });

  const reg = (id: PartId) => (el: THREE.Group | null) => {
    parts.current[id] = el;
  };

  return (
    <group ref={rootRef} scale={scale} dispose={null}>
      {/* 01 — Optical cap. Shallow crown, seated in a machined bezel. The only
          transmissive material on the product, so it holds the strip light as a
          long specular streak while everything around it stays matte. */}
      <group ref={reg("lens")} position={[0, REST_Y.lens, 0]}>
        <mesh geometry={capGeo} castShadow>
          <primitive object={mats.lens} attach="material" />
        </mesh>
        <mesh position={[0, -0.022, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.044, 56]} />
          <primitive object={mats.lens} attach="material" />
        </mesh>
        {/* Indicator, INSET beneath the cap so it glows through the optic
            rather than sitting on top of the silhouette like a handle. */}
        <mesh position={[0, -0.036, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.118, 0.0085, 12, 56]} />
          <meshStandardMaterial
            ref={emissive}
            color="#8e0a1e"
            emissive="#c8102e"
            emissiveIntensity={0.55}
            roughness={0.35}
          />
        </mesh>
        <mesh position={[0, -0.052, 0]}>
          <cylinderGeometry args={[0.306, 0.318, 0.03, 56]} />
          <primitive object={mats.body} attach="material" />
        </mesh>
      </group>

      {/* 02 — Machined housing. Straight sides, a relief groove at the waist and
          a chamfer under the top face. */}
      <group ref={reg("crown")} position={[0, REST_Y.crown, 0]}>
        <mesh geometry={crownGeo} castShadow receiveShadow>
          <primitive object={mats.body} attach="material" />
        </mesh>
      </group>

      {/* 03 — Stainless weight core, concealed inside the housing until the
          exploded view earns it. */}
      <group ref={reg("core")} position={[0, REST_Y.core, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.196, 0.196, 0.34, 40]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh position={[0, 0.178, 0]}>
          <cylinderGeometry args={[0.212, 0.196, 0.024, 40]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh position={[0, -0.178, 0]}>
          <cylinderGeometry args={[0.196, 0.212, 0.024, 40]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      </group>

      {/* 04 — Knurl. Cut geometry inside a recessed band, not a normal map: it
          catches the strip lights as 72 individual highlights, which is the
          entire reason to model it. */}
      <group ref={reg("knurl")} position={[0, REST_Y.knurl, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.336, 0.336, 0.36, 64]} />
          <primitive object={mats.dark} attach="material" />
        </mesh>
        <instancedMesh
          ref={knurlRef}
          args={[knurl.geometry, mats.knurl, knurl.count]}
          frustumCulled={false}
          castShadow
        />
        {/* Shoulders that close the recess top and bottom. */}
        <mesh position={[0, 0.192, 0]}>
          <cylinderGeometry args={[0.358, 0.344, 0.024, 64]} />
          <primitive object={mats.body} attach="material" />
        </mesh>
        <mesh position={[0, -0.192, 0]}>
          <cylinderGeometry args={[0.344, 0.358, 0.024, 64]} />
          <primitive object={mats.body} attach="material" />
        </mesh>
      </group>

      {/* 05 — Leather collar. Sheen material: the rim brightening is what reads
          as leather rather than dark plastic. */}
      <group ref={reg("collar")} position={[0, REST_Y.collar, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.364, 0.372, 0.09, 64]} />
          <primitive object={mats.collar} attach="material" />
        </mesh>
        <mesh position={[0, -0.075, 0]}>
          <cylinderGeometry args={[0.372, 0.36, 0.06, 64]} />
          <primitive object={mats.collar} attach="material" />
        </mesh>
        {/* Stitch line — nobody consciously registers it and everybody feels it. */}
        <mesh position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.374, 0.0045, 8, 96]} />
          <meshStandardMaterial color="#4a4844" roughness={0.72} />
        </mesh>
      </group>

      {/* 06 — Thread adapter. The thread form is short and shrouded; an exposed
          coil here is what made the first pass look like a bulb. */}
      <group ref={reg("base")} position={[0, REST_Y.base, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.356, 0.336, 0.17, 48]} />
          <primitive object={mats.dark} attach="material" />
        </mesh>
        <mesh position={[0, 0.093, 0]}>
          <cylinderGeometry args={[0.344, 0.356, 0.018, 48]} />
          <primitive object={mats.body} attach="material" />
        </mesh>
        {/* Shroud: the thread lives inside a skirt, so no coil is ever
            silhouetted against the background. */}
        <mesh position={[0, -0.115, 0]}>
          <cylinderGeometry args={[0.336, 0.31, 0.07, 48]} />
          <primitive object={mats.dark} attach="material" />
        </mesh>
        <mesh position={[0, -0.128, 0]}>
          <cylinderGeometry args={[0.128, 0.128, 0.05, 32]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        {[0, 1].map((i) => (
          <mesh key={i} position={[0, -0.118 - i * 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.131, 0.008, 8, 32]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* --- Geometry ----------------------------------------------------------- */

/** Turned housing: straight sides, a relief groove, a chamfer under the top. */
function buildCrown() {
  const p: THREE.Vector2[] = [];
  const push = (x: number, y: number) => p.push(new THREE.Vector2(x, y));

  push(0.0, -0.25);
  push(0.348, -0.25);
  push(0.36, -0.238); // bottom chamfer
  push(0.36, -0.2);
  push(0.352, -0.06);
  push(0.348, 0.018);
  push(0.334, 0.038); // relief groove across the waist
  push(0.344, 0.058);
  push(0.338, 0.19);
  push(0.326, 0.222); // top chamfer
  push(0.3, 0.25);
  push(0.0, 0.25);

  const geo = new THREE.LatheGeometry(p, 64);
  geo.computeVertexNormals();
  return geo;
}

/** A very shallow crowned cap — a hemisphere here reads as a lamp, not a part. */
function buildCap() {
  const R = 1.015;
  const theta = 0.3; // base radius R·sinθ ≈ 0.30, rise R(1−cosθ) ≈ 0.045
  const geo = new THREE.SphereGeometry(R, 56, 20, 0, Math.PI * 2, 0, theta);
  geo.translate(0, -R * Math.cos(theta), 0);
  return geo;
}

/** 72 cut teeth around the recessed grip band. One draw call. */
function buildKnurl() {
  const count = 72;
  const geometry = new THREE.BoxGeometry(0.019, 0.34, 0.05);
  const matrices: THREE.Matrix4[] = [];
  const q = new THREE.Quaternion();
  const pos = new THREE.Vector3();
  const scl = new THREE.Vector3(1, 1, 1);
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    pos.set(Math.cos(a) * 0.334, 0, Math.sin(a) * 0.334);
    q.setFromAxisAngle(up, -a);
    matrices.push(new THREE.Matrix4().compose(pos, q, scl));
  }

  return { geometry, matrices, count };
}

/* --- Materials ---------------------------------------------------------- */

const FINISH: Record<Finish, { body: string; rough: number; metal: number }> = {
  graphite: { body: "#26262a", rough: 0.4, metal: 1 },
  silver: { body: "#bcbcb6", rough: 0.29, metal: 1 },
  red: { body: "#8e0f22", rough: 0.33, metal: 1 },
  carbon: { body: "#17171c", rough: 0.26, metal: 0.15 },
};

function buildMaterials(finish: Finish) {
  const f = FINISH[finish];
  const micro = microRoughnessMap();
  const blast = blastMap();
  const brushed = brushedMap();

  for (const m of [micro, blast, brushed]) m.wrapS = m.wrapT = THREE.RepeatWrapping;
  micro.repeat.set(4, 4);
  blast.repeat.set(3, 3);
  brushed.repeat.set(1, 6);

  const body = new THREE.MeshPhysicalMaterial({
    color: f.body,
    metalness: f.metal,
    roughness: f.rough,
    roughnessMap: blast, // constant roughness is what makes metal read as plastic
    clearcoat: finish === "carbon" ? 1 : 0.22,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.5,
  });

  if (finish === "carbon") {
    const weave = carbonMap();
    weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
    weave.repeat.set(4, 4);
    body.map = weave;
  }

  return {
    body,
    dark: new THREE.MeshPhysicalMaterial({
      color: "#141417",
      metalness: 1,
      roughness: 0.52,
      roughnessMap: micro,
      envMapIntensity: 1.05,
    }),
    knurl: new THREE.MeshStandardMaterial({
      color: f.body,
      metalness: 1,
      // Cut faces are never as polished as the turned body.
      roughness: Math.min(f.rough + 0.14, 1),
      envMapIntensity: 1.35,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: "#9a9a95",
      metalness: 1,
      roughness: 0.22,
      roughnessMap: brushed,
      envMapIntensity: 1.8,
    }),
    collar: new THREE.MeshPhysicalMaterial({
      color: "#131315",
      metalness: 0,
      roughness: 0.84,
      roughnessMap: micro,
      sheen: 1,
      sheenRoughness: 0.55,
      sheenColor: new THREE.Color("#6e6a66"),
      envMapIntensity: 0.85,
    }),
    lens: new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 0.4,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 1.5,
      transparent: true,
    }),
  };
}
