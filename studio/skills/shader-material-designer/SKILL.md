---
name: shader-material-designer
description: GLSL shaders and premium materials for the web — ShaderMaterial, custom and procedural materials, noise, distortion, refraction, caustics, glass, metal, gold, liquid metal, silver, platinum, water, smoke, fabric, particles, displacement, fresnel and iridescence. Use when a surface needs to look genuinely precious rather than like plastic or a video-game asset, when building a custom material or effect, or when writing vertex/fragment shaders for Three.js or React Three Fiber.
---

# Shader & Material Designer

## Principle

Priority is **realism and sophistication**. Avoid cheap game-engine aesthetics:
flat speculars, uniform roughness, saturated rim glow, plastic highlights.

Real materials have: **variation** (roughness is never constant), **fresnel**
(edges behave differently from faces), **correct energy** (they don't glow for free),
and **environment** (they reflect a real world).

## Before writing a shader

Most "premium material" needs are met by `MeshPhysicalMaterial` + a good HDRI +
roughness/normal maps. Write a custom shader when you need something physically
unavailable (procedural animation, custom refraction, displacement, non-photoreal art
direction). A hand-written shader that looks worse than PBR is a loss.

Prefer extending over replacing: `onBeforeCompile`, or `CustomShaderMaterial`
(`three-custom-shader-material`), which keeps Three's lighting, shadows and fog while
letting you inject your own vertex displacement or colour logic. This is almost always
the right tool.

## Material recipes

**Glass / crystal**
```js
transmission: 1, thickness: 1.5, roughness: 0.02, ior: 1.5 (glass) / 2.4 (diamond),
dispersion: 0.1–0.4, clearcoat: 1, envMapIntensity: 1.5, attenuationColor, attenuationDistance
```
Diamond needs high IOR + dispersion + a strong HDRI. Add a subtle internal-facet
normal map. For real fire, use MeshTransmissionMaterial (drei) with `samples: 8–16`,
`backside: true`, `chromaticAberration: 0.05–0.2`.

**Gold / precious metal**
```js
metalness: 1, roughness: 0.15–0.3 (never 0), color: #FFD277-ish for polished gold
```
Gold is defined by its *tinted reflection*, so the HDRI does the work — a flat gold
colour with no environment looks like yellow plastic every time. Add anisotropy for
brushed finishes, a fine roughness map for hand-worked surfaces.
Rose gold ≈ #F0BFA8, white gold/platinum ≈ #E5E4E2 with roughness 0.1,
silver ≈ #F0EEE8 with slightly cooler reflection.

**Liquid metal**
Displacement via curl/simplex noise in the vertex shader + `metalness: 1`,
`roughness: 0.05–0.15`, plus a moving environment. Recompute normals after
displacement (finite differences on the noise field) or lighting will be wrong.

**Water / caustics**
Layered noise for the surface normal, fresnel-driven reflection/refraction blend,
depth-based colour absorption. Caustics: projected animated texture, or a light
cookie — full raytraced caustics aren't worth the cost on web.

**Fabric / velvet**
Sheen (`sheen`, `sheenRoughness`, `sheenColor` in MeshPhysicalMaterial) + a fresnel
falloff. Velvet's whole character is the rim brightening — that's sheen, not emissive.

**Particles / smoke**
`Points` + custom shader, or instanced billboards. Soft particles (fade against depth
buffer) are what stop smoke looking like cut-out sprites. Additive blending only for
light, normal blending for volume.

## Essential shader building blocks

```glsl
// Fresnel — the most valuable 3 lines in this file
float fresnel(vec3 N, vec3 V, float power) {
  return pow(1.0 - clamp(dot(N, V), 0.0, 1.0), power);
}

// Iridescence: shift hue by view angle
vec3 iridescent(float f) { return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0,0.33,0.67) + f)); }
```
Keep a shared chunk file with: simplex/curl noise, fbm, fresnel, hue rotation,
value remap, dithering. Import via `glslify` or string concatenation.

**Dithering.** Add `+ (hash(gl_FragCoord.xy) - 0.5) / 255.0` to your final colour.
It removes banding in gradients and dark scenes, and it is the difference between
"cheap" and "expensive" more often than any other single line.

## Uniforms & animation

```js
const uniforms = { uTime:{value:0}, uProgress:{value:0}, uMouse:{value:new Vector2()} }
useFrame((_, dt) => { uniforms.uTime.value += dt })
```
Mutate uniform `.value` directly in `useFrame` — never through React state.
Drive `uProgress` from scroll (see `scroll-storytelling`) for material *transformations*
as scroll events: gold melting, glass frosting, a surface crystallising.

## Quality rules

- Work in linear space; convert once at output. `outputColorSpace = SRGBColorSpace`,
  `toneMapping = ACESFilmicToneMapping`.
- Roughness maps > constant roughness, always. Even 5% variation transforms a surface.
- Normal maps carry micro-detail cheaply — use them before adding geometry.
- Never `roughness: 0` on metal. Perfect mirrors look fake.
- Test every material against at least two HDRIs and both a dark and light background.
- Mobile: precision `mediump` where safe, fewer octaves of noise, smaller textures,
  drop transmission samples. Coordinate with `3d-performance-engineer`.
