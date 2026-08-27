---
name: cinematic-web-designer
description: Designs websites as film — scenes, camera work, depth, reveals, editing, timing, rhythm, tension, lighting, macro and product shots, and narrative structure. Use when a site should feel like a cinematic experience or campaign film, when a page needs to evolve as the visitor moves through it, when planning how sections cut and dissolve into one another, or when a design feels like a static document instead of an unfolding experience.
---

# Cinematic Web Designer

Treat the page as a film, not a document. A document is read top to bottom.
A film **unfolds**, with intention behind every cut.

## The vocabulary, translated to web

| Film | Web |
|---|---|
| Scene | A pinned section or route with its own light, camera and mood |
| Shot | A viewport state — what's framed and how |
| Camera | Real 3D camera, or CSS perspective + transform + scale |
| Cut | An instant change of scene (mask wipe, snap, flash) |
| Dissolve | Crossfade of two scenes, usually with movement continuing through |
| Match cut | An element's shape/position carries from scene A into scene B |
| Push in / pull out | Scroll-driven dolly on Z |
| Rack focus | DOF or blur shift between foreground and background |
| Establishing shot | Wide opening frame that sets place and scale |
| Macro | Extreme close-up on craft, texture, material |
| Montage | Rapid rhythmic sequence, often horizontal or masked |

## Building a sequence

1. **Beat sheet first.** Write the scenes in order with one line each:
   what the visitor sees, what they feel, how long it lasts in scroll %.
2. **Give every scene a job.** Establish, reveal, escalate, resolve, transition.
   A scene with no job gets cut.
3. **Vary the rhythm.** Slow wide → hold → fast cut → macro → breathe.
   Uniform pacing is the fastest way to lose someone. Silence (a still, empty
   moment) makes the next movement land.
4. **Design the cuts, not just the scenes.** Most sites are a stack of scenes with
   no editing. The transition is where the craft shows — see `page-transition-director`.
5. **Continuity.** Something should carry across a cut: a colour, a shape, a moving
   object, a line of type. That's what makes it feel authored.

## Depth

Cinematic = layered. Build at least three planes: foreground (occluding, fast),
midground (subject, medium), background (atmosphere, slow). Parallax them at
different rates. Add atmosphere: haze, grain, vignette, bloom used *sparingly*.
Grain in particular is what stops digital 3D looking plastic — a subtle film grain
overlay (2–5% opacity, animated) is often the single highest-value addition.

## Lighting as narrative

Light is the cheapest emotional lever you have.
- Direction changes = time passing, mood shifting.
- A single key light with deep falloff = drama, luxury, focus.
- Cool ambient + one warm key = the classic premium product look.
- Animate light across a scroll: a moving key light revealing a product's form
  is often a WOW moment on its own.
- Practical lights (visible sources in frame) sell realism.

## Product shots

Sequence them like a commercial: silhouette → hero angle → macro detail →
material/texture → in-context → exploded/technical. Don't show everything at once;
you're building desire, not a catalogue.

## Timing

- Reveals: 0.8–1.6s, eased out hard (`expo.out`, `cubic-bezier(.16,1,.3,1)`).
- Holds: give a strong frame 300–600ms of stillness before the next move.
- Cuts: 0 or <120ms. If a "cut" takes 400ms it's a dissolve.
- Scroll-scrubbed sequences: think in scroll percentage, not seconds.
  Hand the timeline to `scroll-storytelling`.

## Audio

If the project allows it: muted-by-default ambient with an obvious, elegant toggle,
plus subtle interaction sounds. Never autoplay with sound. Massive impact when
appropriate (campaign, launch, portfolio) — inappropriate for most e-commerce.

## Traps

- Cinematic ≠ slow. Never hold a visitor hostage in an unskippable intro.
  Always allow scrolling past, always allow skipping.
- The first frame must already look extraordinary — before any animation runs.
- Don't cinematise utility pages (cart, checkout, account). Those are `luxury-ui-system`.
