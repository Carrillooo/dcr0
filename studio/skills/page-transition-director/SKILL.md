---
name: page-transition-director
description: Page and route transitions for experiential websites — camera-through-object, morph transitions, masks, wipes, scale transitions, object continuity, 3D portals, typography transitions, light transitions and cinematic cuts. Use when navigation between routes feels abrupt, when building a Next.js or React router transition layer, or when a shared element or 3D scene must persist and transform across a route change.
---

# Page Transition Director

A hard cut between routes breaks the spell instantly. On an experiential site the
transition is not a loading cover — it is **part of the narrative**.

Exception: utility routes (cart, checkout, account, legal) should transition fast and
plainly. Don't make someone watch a 1.2s portal sequence to reach their basket.

## Architecture (Next.js App Router)

The canvas and the transition layer live **above** the router outlet in `layout.tsx`,
so neither remounts on navigation:

```tsx
<Lenis>
  <TransitionProvider>      {/* owns state: idle | out | in, and the overlay */}
    <Canvas3D />            {/* one persistent WebGL context, scene swaps inside */}
    <main>{children}</main>
  </TransitionProvider>
</Lenis>
```

Flow: intercept the click → play OUT → `router.push()` → wait for the new route to be
ready → play IN. Use `useTransitionRouter` style logic or the View Transitions API where
support allows, with a GSAP fallback. Never let the new page paint mid-OUT.

Always: scroll to top at the swap point (not before), restore focus to the new page's
`<h1>` or main landmark, and announce the route change to screen readers.

## Techniques

**Mask / wipe.** A shape (`clip-path`, an SVG path, a scaling block) sweeps across,
covering then revealing. The cheapest technique that still looks directed — especially
with an easing pair: fast cover (`power4.in`), slow reveal (`expo.out`).

**Scale transition.** The outgoing page scales down and dims slightly while the incoming
scales up from ~1.06. Reads as depth rather than replacement.

**Object continuity / shared element.** The clicked thumbnail is the hero of the next
page. Measure both rects (FLIP: `gsap/Flip`) and animate between them. This is the single
most convincing transition there is — it makes the site feel like one continuous space.
Works for images, type, and 3D objects alike.

**Camera through object.** The 3D camera dollies into and through the product; the
interior geometry or a portal becomes the next scene. Requires the persistent canvas and
a scene graph where both scenes can coexist briefly. The signature luxury transition.

**Morph.** The 3D object's geometry/material morphs into the next page's hero object
(morph targets, or a shader `uProgress` blending two states). Expensive; reserve it for
one key journey, not every link.

**3D portal.** A masked window into the next scene that expands to fill the viewport.
Use a stencil/portal material (`drei` `MeshPortalMaterial`) or a second render target.

**Typography transition.** The page title travels and resizes into the next page's
heading position. Cheap, elegant, brand-forward. Pairs perfectly with a mask.

**Light transition.** A light sweeps through, blowing out the frame, and the scene
behind has changed. Sells a cut with almost no geometry cost.

**Cinematic cut.** Instant, with a hard sound/flash accent. Effective *because* it's
surrounded by slower transitions. One cut in a site of dissolves is a statement.

## Craft rules

- **Total budget ≤ 900ms** for a standard route change; ≤ 1.4s for one signature
  journey. Beyond that people think it's broken.
- **Cover the load, don't add to it.** Prefetch the route on hover/intent
  (`<Link prefetch>`, or an `onMouseEnter` prefetch) so the OUT animation is doing real
  work, not stalling.
- OUT and IN must share the easing family. Exit ≈ 0.6–0.8× the entrance duration.
- Something must **carry across**: a colour, the object, a line, the persistent canvas.
  A transition where everything changes is just a slower cut.
- Back/forward navigation must transition too, and must not double-fire.
- Never break: the URL, deep links, browser history, `Cmd/Ctrl+click`, middle-click,
  or the keyboard. If a link isn't an `<a href>`, it's wrong.
- Reduced motion → crossfade at 150ms, or an instant swap. Never a broken half-state.
- Slow connection → the transition must complete even if the next page isn't ready;
  hold on a designed state, not a frozen overlay.

## Verification

Navigate every route pair, fast-click twice in a row, use the back button mid-transition,
reload on each route, test on a throttled connection, and check no ScrollTrigger or GSAP
timeline from the previous route survived (a leaked ScrollTrigger is the classic symptom:
the second visit to a page animates wrong).
