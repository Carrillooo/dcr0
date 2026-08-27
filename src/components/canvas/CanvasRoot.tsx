"use client";

import { Suspense, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useExperience } from "@/lib/store";
import { detectTier, QUALITY, type Tier } from "@/lib/quality";
import { useHydrated, useMediaQuery, webglSupported } from "@/lib/client";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { HomeScene } from "./scenes/HomeScene";
import { ProductStudio } from "./scenes/ProductStudio";
import { VehicleScene } from "./scenes/VehicleScene";

/* ---------------------------------------------------------------------------
 * ONE canvas for the entire site, mounted above the router outlet.
 *
 * Routes change the scene inside it; they never mount a second Canvas. That is
 * what keeps WebGL contexts at one instead of leaking one per page view, and
 * it is the only way a transition can carry a 3D object across a route change.
 * ------------------------------------------------------------------------ */

export function CanvasRoot() {
  // Everything about the device is a subscription, not a one-shot mount effect:
  // the tier is read once the DOM exists, and both media queries stay live so a
  // rotated phone or a changed accessibility preference is respected at once.
  const hydrated = useHydrated();
  const mobile = useMediaQuery("(max-width: 1023px)");
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  const tier: Tier = useMemo(() => (hydrated ? detectTier() : "high"), [hydrated]);
  const supported = useMemo(() => (hydrated ? webglSupported() : true), [hydrated]);

  // PerformanceMonitor may lower this at runtime; until it does, the tier decides.
  const [dprCap, setDprCap] = useState<number | null>(null);
  const dpr: [number, number] = [1, dprCap ?? QUALITY[tier].dpr[1]];

  const scene = useExperience((s) => s.scene);
  const explode = useExperience((s) => s.explode);
  const finish = useExperience((s) => s.finish);
  const mood = useExperience((s) => s.mood);
  const glow = useExperience((s) => s.glow);
  const offsetX = useExperience((s) => s.offsetX);
  const vehicleProgress = useExperience((s) => s.vehicleProgress);

  if (!supported) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #1b1b20 0%, #0a0a0c 45%, #050505 100%)",
        }}
      />
    );
  }

  const q = QUALITY[tier];

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ position: [0, 0.3, 6], fov: 30, near: 0.05, far: 60 }}
        shadows={false}
        // Rendering only pauses when the whole scene is genuinely still; the
        // home narrative is scrubbed, so it stays on demand-free.
        frameloop="always"
      >
        <PerformanceMonitor
          onDecline={() =>
            setDprCap((c) => Math.max(1, (c ?? QUALITY[tier].dpr[1]) - 0.25))
          }
        />
        <AdaptiveDpr pixelated={false} />

        <CameraRig mobile={mobile} reduced={reduced} />

        <Suspense fallback={null}>
          {scene === "product" ? (
            <ProductStudio
              tier={tier}
              finish={finish}
              explode={explode}
              mood={mood}
              glow={glow}
              offsetX={mobile ? 0 : offsetX}
            />
          ) : scene === "vehicle" ? (
            <VehicleScene
              progress={vehicleProgress}
              offset={mobile ? 0 : 2.1}
              scale={mobile ? 0.4 : 0.52}
            />
          ) : scene === "void" ? null : (
            <HomeScene tier={tier} mobile={mobile} />
          )}
          <Preload all />
        </Suspense>

        {q.post && !reduced && <Effects bloom={q.bloom} />}
      </Canvas>
    </div>
  );
}
