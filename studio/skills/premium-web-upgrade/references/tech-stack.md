# Technology reference repositories

These are **documentation sources**, not a dependency checklist.
Consult them when implementing that technology. Do not clone them wholesale;
official technology repos can be read as reference without installing anything.

Before adding any dependency ask: *does this genuinely improve this project?*
If the answer is no, don't install it.

## Core

| Tech | Repo | Consult for |
|---|---|---|
| Three.js | `mrdoob/three.js` | WebGL/WebGPU, scenes, materials, lighting, cameras, geometries, shaders, loaders, render pipeline |
| React Three Fiber | `pmndrs/react-three-fiber` | Declarative 3D in React — the primary reference for any React + Three project |
| Drei | `pmndrs/drei` | Environments, cameras, controls, loaders, text, staging, scene helpers. Don't reinvent what Drei already solves correctly |
| gltfjsx | `pmndrs/gltfjsx` | Turning GLTF/GLB into reusable typed R3F components; also helps reduce and organise models |
| react-postprocessing | `pmndrs/react-postprocessing` | Bloom, DOF, noise, vignette, colour effects. **Do not overuse bloom** — a premium site must not look like a video game |
| postprocessing | `pmndrs/postprocessing` | The underlying Three.js post pipeline, when the R3F wrapper isn't enough |
| GSAP | `greensock/GSAP` | Timelines, motion, ScrollTrigger, scroll choreography, transforms, easing, SVG, large sequences. Use the official React integration (`@gsap/react`) when React is involved |
| Lenis | `darkroomengineering/lenis` | Smooth scrolling, WebGL-scroll sync, parallax. Must be wired correctly into GSAP/ScrollTrigger when both are used |
| glTF-Transform | `donmccurdy/glTF-Transform` | GLB/GLTF optimisation: texture compression, WebP, KTX2, geometry optimisation, weight reduction. **Never ship heavy models unprocessed** |

## Optional — only with a real reason

| Tech | Repo | Adopt only when |
|---|---|---|
| react-three-rapier | `pmndrs/react-three-rapier` | Physics is genuinely needed: objects, collisions, gravity, physical interaction. Never add physics "because". Springs and tweens are cheaper and more art-directable |
| react-three-offscreen | `pmndrs/react-three-offscreen` | Very demanding 3D where moving rendering to OffscreenCanvas/Web Worker is justified. Advanced optimisation — not a default |

## Before using npm/pnpm/yarn

Check `package.json` and the lockfile. Respect the existing package manager.
Never mix npm + yarn + pnpm. Don't bump majors unnecessarily. Don't create
incompatibilities just to use one animation.
