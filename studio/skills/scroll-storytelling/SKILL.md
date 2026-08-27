---
name: scroll-storytelling
description: Scroll-driven web experiences using GSAP ScrollTrigger, scrub, pinning, Lenis smooth scroll, camera animation synced to scroll, text reveals, horizontal sections, masking, parallax and scene transitions. Use when the scroll should direct a narrative rather than just move the page — pinned storytelling, product sequences, scroll-synced 3D cameras, chaptered long-form pages — or when planning the scroll timeline of a section before implementing it.
---

# Scroll Storytelling

## Principle

**Scroll does not move the page. Scroll directs the experience.**
The visitor is operating a timeline. Design that timeline before writing code.

## Always storyboard first

Write the timeline in scroll percentages before touching GSAP. Template:

```
SCENE: "The Cut"                       pin: 300vh
0–15%    Intro — title splits, product enters from depth, ambient light rises
15–30%   Product movement — object rotates to hero angle, background recedes
30–45%   Camera change — dolly in, FOV tightens, rack focus to the facet
45–60%   Macro reveal — extreme close-up, caption fades in from the left
60–75%   Transformation — material shifts, object begins to disassemble
75–90%   Reconstruction — parts reassemble in a new configuration
90–100%  Handoff — camera pushes through the object into the next scene
```

Every % band names: what moves, from what to what, with what easing, and why.
Show this to the user before implementing. It's cheap to change here, expensive later.

## Stack

- **Lenis** for smooth scroll. Do not hand-roll inertia.
- **GSAP + ScrollTrigger** for everything scroll-bound.
- Register once, and wire Lenis into GSAP's ticker so they share one RAF:

```ts
gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
```

- In React, wrap every animation in `useGSAP` (`@gsap/react`) with a scope ref so
  cleanup is automatic. Manual `ctx.revert()` otherwise. Leaked ScrollTriggers on
  route change are the most common bug in this whole domain.

## Scrub

- `scrub: true` = locked to scroll, no lag. Use for camera and anything the visitor
  should feel they control directly.
- `scrub: 1` (or 0.5–1.5) = eased catch-up. Use for most content motion; it feels
  expensive and forgiving. This is usually the right default.
- Inside a scrubbed timeline, **easing on individual tweens still applies** and is
  what separates a mechanical scrub from a directed one.

## Pinning

- `pin: true`, `end: '+=300%'` — the pin distance *is* the scene's runtime.
- Pin the wrapper, animate the children. Pinning the animated element itself fights you.
- `anticipatePin: 1` on heavy scenes to avoid the jump.
- Never nest pins. Sequence them instead.
- Always give a pinned scene a visible exit — the visitor must feel progress,
  or a long pin reads as a broken page. A progress indicator or a moving element helps.

## Horizontal sections

```ts
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: { trigger: wrapper, pin: true, scrub: 1,
    end: () => '+=' + (track.scrollWidth - innerWidth),
    invalidateOnRefresh: true }
})
```
Use `invalidateOnRefresh: true` on every function-based value, or resize breaks it.
On touch, consider a native horizontal scroll + snap instead — it feels better than
a hijacked vertical-to-horizontal mapping on a phone.

## Syncing 3D to scroll

Do **not** set camera position from a ScrollTrigger callback directly.
Write scroll progress into a store/ref; read and damp it inside `useFrame`:

```ts
ScrollTrigger.create({ trigger, start:'top top', end:'+=300%', scrub:true,
  onUpdate: (self) => { progress.current = self.progress } })

useFrame((_, dt) => {
  eased.current = MathUtils.damp(eased.current, progress.current, 4, dt)
  curve.getPointAt(eased.current, camera.position)
  camera.lookAt(target)
})
```
This keeps rendering frame-locked and smooth regardless of scroll event frequency.

## Text reveals

Line-by-line or word-by-word with `stagger`, masked by an overflow-hidden wrapper
so glyphs rise out of nothing. Use SplitText if the licence is available; otherwise
split manually and **restore accessible text** (keep the original in an `sr-only`
element or use `aria-label`) — split text is invisible to screen readers otherwise.
Never split every paragraph on the site. Reserve it for statements.

## Rules

- Content must be readable while it's on screen — not mid-fade for 60% of its life.
- Never trap the visitor. No unskippable sequences, no scroll-jacking that breaks
  keyboard, `End`, or anchor links.
- `ScrollTrigger.refresh()` after fonts and images load, and on resize.
- `matchMedia` for breakpoint-specific timelines — see `mobile-experience-director`.
- `prefers-reduced-motion`: kill scrubs, show final states, keep the page usable and
  still good-looking. Build this in from the start, not as a patch.
- Test on a trackpad, a mouse wheel, and a phone. They feel completely different.
