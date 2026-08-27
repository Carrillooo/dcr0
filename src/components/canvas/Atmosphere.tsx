"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
 * The backdrop is not a black clear colour. It is a shaded stage with a single
 * travelling band of light, which is the central idea of the whole site:
 * light is what reveals the engineering.
 *
 * Dithered on output — the last three lines of the fragment shader are the
 * difference between "expensive" and "banded gradient".
 * ------------------------------------------------------------------------ */

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uSweep;    // 0→1 position of the light line
  uniform float uPresence; // how present the light is at all
  uniform float uTime;
  uniform vec3  uGround;
  uniform vec3  uLight;
  uniform vec3  uAccent;
  uniform float uAccentAmt;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;

    // Base sweep: a photographic backdrop, not a black clear colour. Dark
    // enough that the product is the brightest thing in frame at all times.
    float grad = smoothstep(1.2, -0.25, uv.y);
    vec3 col = mix(uGround * 0.25, uGround, grad);

    // The light line. A tight core with a controlled spill — the spill used to
    // be wide enough to wash the whole frame, which read as a cheap gradient.
    float x = uv.x - uSweep;
    float core = exp(-pow(x * 13.0, 2.0));
    float spill = exp(-pow(x * 5.2, 2.0)) * 0.22;

    // Shaped vertically so it is a shaft of light, not a stripe.
    float shaft = smoothstep(-0.05, 0.5, uv.y) * smoothstep(1.15, 0.45, uv.y);

    float light = (core + spill) * shaft * uPresence;
    col += uLight * light * 0.34;

    // Brand accent: a thin edge trailing the light, never a colour wash. Kept
    // narrow and weak on purpose — a red-and-black site is not the brief.
    float trail = exp(-pow((x + 0.055) * 40.0, 2.0)) * shaft;
    col += uAccent * trail * uAccentAmt * uPresence * 0.16;

    // Very slow breathing so the frame is never mathematically static.
    col *= 0.98 + 0.02 * sin(uTime * 0.3 + uv.y * 2.0);

    // Vignette — tight, so the frame closes down rather than glowing at centre.
    float d = distance(uv, vec2(0.5, 0.46));
    col *= 1.0 - smoothstep(0.24, 0.78, d) * 0.85;

    // Dither. Removes banding in the dark gradients.
    col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  sweep: number;
  presence?: number;
  ground?: string;
  light?: string;
  accent?: number;
};

export function Backdrop({ sweep, presence = 1, ground = "#08080a", light = "#dfe4ec", accent = 1 }: Props) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uSweep: { value: 0 },
      uPresence: { value: 1 },
      uTime: { value: 0 },
      uGround: { value: new THREE.Color(ground) },
      uLight: { value: new THREE.Color(light) },
      uAccent: { value: new THREE.Color("#c8102e") },
      uAccentAmt: { value: accent },
    }),
    [ground, light, accent],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += dt;
    u.uSweep.value = THREE.MathUtils.damp(u.uSweep.value, sweep, 3.5, dt);
    u.uPresence.value = THREE.MathUtils.damp(u.uPresence.value, presence, 3, dt);
  });

  return (
    <mesh position={[0, 0, -5.4]} scale={[19, 11, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
 * A real moving key light, so the product is genuinely revealed by the sweep
 * rather than lit evenly with a light drawn behind it.
 * ------------------------------------------------------------------------ */

export function SweepLight({ sweep, intensity = 40 }: { sweep: number; intensity?: number }) {
  const light = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);
  const x = useRef(-6);

  useFrame((_, dt) => {
    x.current = THREE.MathUtils.damp(x.current, (sweep - 0.5) * 11, 3.5, dt);
    if (light.current) {
      light.current.position.set(x.current, 3.4, 3.2);
      target.position.set(x.current * 0.25, 0, 0);
      target.updateMatrixWorld();
    }
  });

  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={light}
        target={target}
        intensity={intensity}
        angle={0.55}
        penumbra={1}
        distance={18}
        decay={1.6}
        color="#eef3ff"
      />
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Dust in the light beam. Points, one draw call, count set by device tier.
 * ------------------------------------------------------------------------ */

export function Motes({ count = 600, spread = 6 }: { count?: number; spread?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    // Seeded, so the dust is identical on every render and every reload.
    let s = 0x2f6e2b1;
    const rand = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 0xffffffff;
    };

    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (rand() - 0.5) * spread;
      positions[i * 3 + 2] = (rand() - 0.5) * spread - 1;
      speeds[i] = 0.01 + rand() * 0.04;
    }
    return { positions, speeds };
  }, [count, spread]);

  useFrame((_, dt) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt;
      if (arr[i * 3 + 1] > spread / 2) arr[i * 3 + 1] = -spread / 2;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        color="#c8cede"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
