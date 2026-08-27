---
name: 3d-web-experience
description: Three.js, React Three Fiber, Drei, WebGL and WebGPU work for the web — scene architecture, GLTF/GLB pipelines with Draco, Meshopt and KTX2, PBR materials, HDRI environments, lighting, cameras and camera rigs, instancing, postprocessing, refraction, reflection, transmission, depth, parallax, physics and GPU performance. Use whenever a project involves 3D on the web, a product configurator, an interactive model, a WebGL scene, or when deciding whether and how 3D should carry an experience.
---

# 3D Web Experience

## Principle

3D must **carry the narrative**. If the 3D could be replaced by a video loop or a
photo with no loss, it should be. "A model that rotates" is not an experience.

Ask before building: what does interactivity/dimensionality let the visitor
*understand or feel* that flat media cannot?

Good answers: they can see how it's made · they control the reveal · the camera
travels through it · the material responds to them · the object becomes the navigation.

## Architecture (React Three Fiber)

```
app/
  layout.tsx            → one persistent <Canvas> above the router outlet
components/canvas/
  Scene.tsx             → root, <Suspense>, environment, postprocessing stack
  rigs/CameraRig.tsx    → all camera motion lives here, driven by scroll/pointer state
  objects/…             → one file per model, each self-contained
  materials/…           → see shader-material-designer
lib/
  store.ts              → zustand: scroll progress, active scene, quality tier
  loaders.ts            → GLTF + DRACO + KTX2 loader setup, preloading
```

Rules:
- **One canvas for the whole site.** Mounting/unmounting canvases per route leaks
  WebGL contexts and kills transitions. Route changes change the *scene*, not the canvas.
- Never drive R3F animation through React state. Use `useFrame`, refs, and mutate
  `object.position`/`rotation`/`material.uniforms` directly. A `setState` per frame is a bug.
- Keep DOM and WebGL in sync through a shared store, not through props drilling.
- Wrap everything loadable in `<Suspense>` with a designed fallback, not a spinner.

## Asset pipeline (non-negotiable)

1. Export GLB, not GLTF+bin+textures.
2. `gltf-transform optimize model.glb out.glb --texture-compress ktx2` — or explicitly:
   - **Draco** for static geometry, **Meshopt** when you need faster decode or animation.
   - **KTX2 / Basis** for every texture (`--texture-compress ktx2`). GPU-resident,
     often 4–8× smaller in VRAM than PNG/JPG. This is the single biggest win.
3. Bake what can be baked: AO, and lighting for static geometry.
4. Texture sizes: 2048 hero material, 1024 secondary, 512 mobile. Powers of two.
5. `npx gltfjsx model.glb -t -T` to generate typed components; then hand-edit.
6. Preload with `useGLTF.preload()` and `<Preload all />`. Load the hero model with
   the page, everything else lazily by scene proximity.

## Materials & lighting

- Use `MeshPhysicalMaterial` for anything with transmission, clearcoat or iridescence.
- **HDRI environment is what makes it look real.** A good `<Environment>` HDRI does
  more than five lights. Use `.hdr` (or a compressed `.exr`), and consider
  `<Environment preset>` only for prototyping — ship a curated HDRI matching your art direction.
- Add lights on top of the environment for *drama*, not for exposure: usually one
  key with shadows, one rim, and let the HDRI do ambient.
- Shadows: `PCFSoftShadowMap`, tight shadow-camera frustum, and bake or fake
  (a soft `<ContactShadows>`/blob) whenever real shadows aren't earning their cost.
- Tone mapping: `ACESFilmic`, `renderer.outputColorSpace = SRGBColorSpace`,
  and set `toneMappingExposure` deliberately. Wrong colour space is the #1 cause
  of "why does my 3D look flat and washed out".
- Custom looks → `shader-material-designer`.

## Cameras

- Camera motion is direction, not decoration. Put all of it in one rig component.
- Scroll-driven: sample a `CatmullRomCurve3` path with scroll progress, and
  `lerp`/`damp` toward the target — never assign raw scroll to position (jitter).
- Use `MathUtils.damp` / `damp3` (frame-rate independent) rather than naive lerp.
- Pointer influence: small (±0.05–0.15 units), always damped, always disabled on touch.
- FOV is expressive: 20–35mm equivalent for drama, 50mm for honest product.
- `OrbitControls` is a prototyping tool. Shipping it in a luxury experience is a
  design failure unless free inspection is genuinely the point (configurator).

## Postprocessing

Use `@react-three/postprocessing`. Budget-aware: each pass is a fullscreen draw.
Worth it: Bloom (selective, low intensity), DepthOfField (for cinema), Vignette,
Noise/grain, ChromaticAberration (very subtle), SMAA/TAA.
Rarely worth it: SSR, SSAO on mobile, heavy god rays.
Grain + vignette + subtle bloom is the cheapest "expensive" look there is.

## Instancing & scale

`<Instances>`/`InstancedMesh` for anything repeated >20 times. Points/`BufferGeometry`
for particles >5k. Merge static geometry. Frustum-cull aggressively. Use LODs for
anything the camera travels away from.

## Physics

Use `@react-three/rapier` only when the interaction genuinely needs simulation
(objects the visitor throws, cloth, soft collisions). Fake it with springs/tweens
otherwise — cheaper, more controllable, more art-directable.

## WebGPU

Consider `WebGPURenderer` + TSL when you need compute (large particle systems,
GPGPU simulation) and can ship a WebGL fallback. Don't adopt it for a standard
product scene — the ecosystem cost isn't repaid.

## Always

- Handle context loss (`webglcontextlost`) with a graceful reload path.
- Dispose geometries, materials and textures on scene teardown.
- Provide a non-WebGL fallback (poster image or video) — detect support, don't assume.
- Respect `prefers-reduced-motion`: static camera, no auto-motion, still beautiful.
- Hand the finished scene to `3d-performance-engineer` before calling it done.
