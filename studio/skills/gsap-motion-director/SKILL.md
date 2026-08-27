---
name: gsap-motion-director
description: Motion design direction with GSAP — timelines, easing, stagger, transforms, SVG animation, SplitText, ScrollTrigger choreography and overall motion language. Use when animating anything on a premium site, when choosing easing and duration, when building an entrance or reveal sequence, when motion feels cheap, bouncy, laggy or arbitrary, or when defining the motion system for a project.
---

# GSAP Motion Director

## Principle

Premium motion feels **smooth, precise, controlled, natural, weighted, cinematic.**
Cheap motion feels bouncy, uniform, fast-in-slow-out-by-default, and everywhere.

**Never add movement just because it's possible.** Every animation answers:
what relationship does this explain, or what emotion does it carry?

## Define a motion system per project

Before animating anything, fix these and reuse them everywhere:

```ts
export const E = {
  out:   'power3.out',              // default reveal
  expo:  'expo.out',                // dramatic, cinematic reveal
  inOut: 'power2.inOut',            // moving between two states
  soft:  CustomEase.create('soft', 'M0,0 C0.22,1 0.36,1 1,1'), // signature ease
}
export const D = { micro: 0.2, ui: 0.4, reveal: 0.9, scene: 1.4 }
export const STAGGER = { tight: 0.04, normal: 0.08, loose: 0.14 }
```

One signature easing curve used consistently is what makes a site feel authored.
Pick it deliberately — it's as much a brand asset as the typeface.

## Easing guide

| Feel | Ease |
|---|---|
| Refined reveal | `power3.out`, `power4.out` |
| Dramatic, luxury | `expo.out` — huge initial speed, long settle |
| Weighted physical object | `power2.inOut` or a spring with low bounce |
| Precise UI feedback | `power2.out`, 150–250ms |
| Never | `elastic`, `bounce`, `back` — unless the brand is genuinely playful |
| Never | `linear`, except for continuous loops and scrubbed camera paths |

Duration + easing together create weight. A heavy object moves slowly *and* settles slowly.
A 0.3s `expo.out` and a 1.2s `expo.out` read as completely different masses.

## Timelines, not tween soup

```ts
const tl = gsap.timeline({ defaults: { ease: E.expo, duration: D.reveal } })
tl.from(mask,  { yPercent: 100 })
  .from(lines, { yPercent: 110, stagger: STAGGER.normal }, '-=0.6')
  .from(meta,  { opacity: 0, y: 12, duration: D.ui }, '<0.2')
```
Overlaps (`'-=0.6'`, `'<0.2'`) are where choreography lives. Sequential tweens with no
overlap look like a slideshow. Aim for movements that *hand off* to each other.

## Stagger

```ts
stagger: { each: 0.06, from: 'start', ease: 'power2.out' }
stagger: { amount: 0.8, grid: [rows, cols], from: 'center' }   // grids
```
Use `amount` (total spread) rather than `each` when item count varies, or 40 items
give you a 3-second stagger. Easing *the stagger itself* is an underused refinement.

## React

Always `useGSAP` from `@gsap/react` with a scope — automatic cleanup:

```ts
useGSAP(() => { /* animations */ }, { scope: containerRef, dependencies: [key] })
```
Never animate through React state. Never animate layout properties (`width`, `top`,
`margin`) — animate `transform` and `opacity`. Use `xPercent`/`yPercent` for responsive
translation. Set `will-change` only while animating, and remove it after.

## SVG

`DrawSVGPlugin` for stroke reveals, `MorphSVGPlugin` for shape transitions,
`MotionPathPlugin` for objects following a path. Animate `transform` on groups, not
`x`/`y` attributes. Set `transform-box: fill-box; transform-origin: center` in CSS
or origins will surprise you.

## Text

SplitText (Club/now free in GSAP 3.13+) → animate `lines` masked by `overflow: hidden`
parents. Always `revert()` before re-splitting on resize. Preserve accessible text
(`aria-label` on the container). Reserve split-text reveals for headline statements,
not every paragraph.

## Performance

- Batch reads/writes; never read layout inside `onUpdate`.
- `gsap.set()` initial states in the same tick you build the timeline to avoid FOUC —
  or use CSS for initial hidden state and `.from()` carefully.
- `gsap.ticker.lagSmoothing(0)` when synced with Lenis/RAF-driven 3D.
- Kill timelines on unmount. Leaked timelines compound across route changes.
- Animating more than ~30 elements simultaneously: use transforms only, or canvas.

## Reduced motion

```ts
const mm = gsap.matchMedia()
mm.add('(prefers-reduced-motion: no-preference)', () => { /* full choreography */ })
mm.add('(prefers-reduced-motion: reduce)',        () => { gsap.set(els, { clearProps: 'all' }) })
```
The reduced version must still look composed and intentional — not a broken skeleton.

## Review checklist

Is anything animating that doesn't need to? · Is every duration/ease from the system? ·
Does anything use default `ease` accidentally? · Do reveals overlap or queue? ·
Does it hold 60fps? · Does it work on reload, on back-navigation, and at 320px?
