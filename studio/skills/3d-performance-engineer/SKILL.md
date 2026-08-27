---
name: 3d-performance-engineer
description: Keeps visually spectacular websites fast — FPS, bundle size, texture sizes, polygon count, device pixel ratio, lazy loading, Suspense, code splitting, Draco, Meshopt, KTX2, LOD, instancing, render loops, mobile GPU limits, memory, WebGL contexts and reduced motion. Use before shipping any 3D or heavily animated site, when frame rate drops or stutters, when a page loads slowly, when a GLB or texture is large, or when a scene must be adapted to weaker mobile GPUs.
---

# 3D Performance Engineer

**A spectacular site that runs badly is not finished.** Performance is a design
requirement, not a cleanup phase.

## Budgets (set these at PHASE 07, before building)

| Metric | Desktop | Mobile |
|---|---|---|
| Sustained FPS | 60 | 60 (accept 45 in the heaviest scene) |
| JS shipped (gzip) | < 300 KB initial | < 250 KB |
| Hero GLB | < 3 MB | < 1.5 MB |
| Total 3D assets before interaction | < 8 MB | < 4 MB |
| Draw calls | < 150 | < 80 |
| Triangles on screen | < 800k | < 300k |
| Texture memory | < 256 MB | < 128 MB |
| LCP | < 2.5s | < 2.5s |
| DPR cap | min(devicePixelRatio, 2) | min(devicePixelRatio, 1.5) |

Blow a budget deliberately and knowingly, or not at all.

## Measure before optimising

- `r3f-perf` (`<Perf />`) — live FPS, draw calls, triangles, memory, GPU time.
- Chrome DevTools Performance with 4× CPU throttle; Rendering panel → FPS meter.
- Spector.js for a frame-by-frame WebGL capture when draw calls are the mystery.
- Lighthouse and a real phone. **A real mid-range Android phone**, not a simulator —
  desktop throttling does not model mobile GPU or thermal behaviour.
- `renderer.info` for live draw call / geometry / texture counts.

Identify whether you're CPU-bound (too many draw calls, too much JS per frame),
GPU-bound (fill rate, shader cost, postprocessing) or memory-bound before touching anything.

## Asset optimisation — biggest wins first

1. **KTX2 / Basis textures.** Usually the single largest win. GPU-resident compressed
   textures cut VRAM 4–8× vs PNG/JPEG and decode instantly.
   `gltf-transform optimize in.glb out.glb --texture-compress ktx2 --texture-size 2048`
2. **Draco or Meshopt geometry.** Draco compresses hardest; Meshopt decodes faster and
   handles animation better. Pick one per project, don't mix.
3. **Right-size textures.** 2048 hero, 1024 secondary, 512 mobile/small. Nobody has
   ever needed a 4096 map for a 200px-tall object.
4. **Decimate geometry.** `gltf-transform simplify --ratio 0.5 --error 0.001`.
   Most exported models carry 5–10× the triangles they need for web.
5. **Prune and dedupe.** `gltf-transform prune` + `dedup` removes unused materials,
   nodes and duplicate accessors. Free savings.
6. **WebP/AVIF for all 2D imagery**, with `next/image` or explicit `srcset` + `sizes`.

## Render loop

- Zero allocations inside `useFrame`. Hoist every `Vector3`, `Quaternion`, `Matrix4`.
- Never `setState` per frame. Mutate refs.
- `MathUtils.damp` (frame-rate independent), not raw `lerp` with a fixed factor.
- `frameloop="demand"` + `invalidate()` for scenes that are static between interactions —
  it can take idle GPU use to near zero.
- Throttle expensive work: raycasting every 3rd frame, resize handlers debounced.
- One `requestAnimationFrame` for the whole app: wire Lenis into `gsap.ticker` and
  R3F's loop, don't run three competing RAFs.

## Scene optimisation

- Instancing for anything repeated >20×. Merge static geometry (`BufferGeometryUtils`).
- LOD via `<Detailed>` for anything the camera moves away from.
- Frustum culling on (default) — but check that huge bounding spheres aren't defeating it.
- Shadows are expensive: one shadow-casting light maximum, tight shadow camera,
  1024 map size, `shadow.autoUpdate = false` for static scenes. Prefer baked AO +
  `<ContactShadows>` where possible.
- Postprocessing: each pass is a fullscreen draw. Budget 2–3 passes desktop, 1 on mobile.
  Bloom at half resolution (`mipmapBlur`). Drop DOF and SSAO on mobile entirely.
- `powerPreference: 'high-performance'`, `antialias: false` when using SMAA in post.

## Loading strategy

- Code-split the entire 3D layer: `dynamic(() => import('./Canvas'), { ssr: false })`.
- `<Suspense>` with a designed fallback (a composed poster frame, not a spinner).
- Preload only the first scene. Load subsequent scenes on scroll proximity
  (`useGLTF.preload()` triggered ~1 viewport ahead).
- `<Preload all />` after the first paint to compile shaders and avoid the freeze on
  first appearance — shader compilation stutter is a very common, very fixable jank.
- Progressive: show a low-poly/blurred state immediately, swap to full quality when ready.

## Adaptive quality (do this — it's what makes mobile viable)

```ts
const tier = getGPUTier()   // detect-gpu, or a first-frames FPS probe
const q = { high:{dpr:2, post:true, shadows:true,  particles:20000},
            mid: {dpr:1.5,post:true, shadows:false, particles:6000},
            low: {dpr:1,  post:false,shadows:false, particles:1500} }[tier]
```
Also use drei's `<PerformanceMonitor>` / `<AdaptiveDpr>` to *drop DPR dynamically* when
frames slip, and recover when they don't. Degrade quality, never the concept.

## Memory & lifecycle

- Dispose geometries, materials, textures and render targets on unmount.
- One WebGL context for the whole site — contexts are limited (~8–16) and leaking them
  is the classic "the site dies after five page views" bug.
- Handle `webglcontextlost` with a graceful recovery path.
- Watch heap growth across a full scroll-through + several route changes. Flat = good.

## Non-negotiables

- `prefers-reduced-motion`: static camera, no auto-motion, no scrub — and still beautiful.
- Non-WebGL fallback: detect support and serve a poster/video. Don't ship a blank page.
- Test on: a mid-range Android, an older iPhone, Safari (its WebGL differs), and a
  throttled 4G connection.

## Report

When auditing, report measured numbers against the budget table, then **fix the top
three offenders yourself** rather than handing back a list.
