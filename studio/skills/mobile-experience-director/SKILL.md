---
name: mobile-experience-director
description: Designs the mobile experience as its own design, not a shrunken desktop — recomposing layout, 3D camera framing, gestures, scroll behaviour, type sizes, navigation, timelines and interactions for phones and tablets. Use when adapting any premium or 3D site to small screens, when a layout is merely squeezed rather than redesigned, or when touch interaction, mobile performance or mobile-specific viewport issues need solving.
---

# Mobile Experience Director

## Rule

**Mobile is not desktop made smaller.** It is the same concept, re-directed.
Keep the creative idea. Change the execution.

Most traffic on a luxury brand site is mobile. A mobile experience that is a
compressed desktop is the majority experience being the worst one.

## What must be re-designed, not scaled

**Composition.** Desktop's horizontal breathing room becomes vertical rhythm.
A side-by-side becomes a sequence. A 3-across becomes a horizontal drag gallery or a
single strong item. Overlapping editorial layouts usually need re-stacking with
different overlaps, not the same ones at 0.4×.

**3D camera.** A portrait viewport frames completely differently. Do not just reduce FOV.
Re-frame: move the camera closer, change the angle, change what's in shot, often show
*less* of the object but larger. Give mobile its own camera path — it's a different
lens on the same scene, and it's usually 20 lines of code.

**Scroll timeline.** Compress. A 400vh pinned desktop scene often becomes 200vh with
fewer beats. Cut the weakest beat rather than speeding all of them up. Long pins feel
much longer on a phone.

**Typography.** Display type doesn't scale linearly — a 12vw headline that sings on
desktop can be unreadable at 375px. Use `clamp()` with a considered floor, and often a
different weight or a tighter tracking on mobile. Body minimum 16px (prevents iOS
input zoom). Line length 35–45 characters.

**Navigation.** Thumb-reachable. Primary actions in the lower two-thirds. Full-screen
menu, opened from a control near the bottom or a consistent top-right. Nothing critical
in the top corners only.

**Interaction.** `:hover` does not exist. Every hover-revealed thing needs a tap,
a permanent visible state, or removal. Custom cursors off entirely.

## Gestures

- Vertical scroll is sacred — never hijack it for a horizontal mapping on touch.
  Use a real horizontal scroller with `scroll-snap` instead; it feels native and correct.
- Swipe for galleries and carousels, with visible affordance (a peeking next item beats
  any dot indicator).
- Drag for 3D inspection where it's the point — with a one-time hint, then never again.
- Pinch-zoom on product imagery: expected behaviour, don't disable it.
- Tap targets ≥44×44px with ≥8px separation.
- Give immediate feedback within 100ms on every tap; never rely on `:hover` styling.

## Viewport mechanics

- Use `dvh`/`svh`/`lvh`, not `vh` — mobile browser chrome makes `100vh` wrong,
  and it changes as you scroll.
- `viewport-fit=cover` + `env(safe-area-inset-*)` for notches and home indicators.
- Test with the URL bar both visible and hidden.
- Resize handling must not fire on the address-bar collapse — debounce, and compare
  width only, or your ScrollTriggers will refresh constantly while scrolling.
- `overscroll-behavior: none` on scroll-locked overlays, and lock via Lenis `stop()`.

## Performance on mobile

Coordinate with `3d-performance-engineer`. Typical mobile profile:
DPR capped at 1.5 · postprocessing reduced to one pass or none · shadows off
(use baked/contact) · particle counts ÷4 · textures at 1024/512 · simpler shaders
(fewer noise octaves, drop transmission samples) · no physics.
Battery and thermal throttling are real: a scene at 60fps for 10 seconds and 30fps
after two minutes has failed.

## Implementation

```ts
gsap.matchMedia()
  .add('(min-width: 1024px)', () => { /* desktop timeline + camera path */ })
  .add('(max-width: 1023px)', () => { /* mobile timeline + camera path */ })
```
Genuinely separate timelines beat one timeline with responsive values.
For layout, prefer a different component or a different grid at the breakpoint over
a cascade of overrides.

## Verification

375×667 (small iPhone) · 390×844 · 430×932 · 768 (tablet portrait) · 1024 (tablet landscape).
Both orientations. Real device where possible — iOS Safari especially.
Check: no horizontal overflow anywhere, nothing under the safe area, forms usable with
the keyboard open, the full scroll journey, menu open/close, back navigation,
and a full scroll-through with the FPS meter on.

**The mobile version must still feel special.** If mobile is the "reduced" version,
you've failed the majority of the audience.
