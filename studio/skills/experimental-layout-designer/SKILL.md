---
name: experimental-layout-designer
description: Breaks generic web layout patterns. Use when a page structure needs to be genuinely distinctive — asymmetric and typography-led layouts, fullscreen sections, horizontal scrolling, pinned storytelling, overlapping and editorial compositions, floating and spatial elements, depth, masks, unconventional navigation, interactive galleries. Use whenever a design is falling into hero → three cards → image+text → testimonials → CTA → footer, or when each page of a site needs its own composition instead of one repeated template.
---

# Experimental Layout Designer

## Forbidden default

```
Hero → 3 cards → image + text → testimonials → CTA → footer
```
This sequence is banned as an automatic answer. If you catch yourself producing it,
you have stopped designing. Also banned by reflex: a 3-column grid chosen because
there are three things; equal-weight sections stacked forever; centred everything.

**Innovation yes. Chaos no.** Every break from convention must be legible,
navigable, and serve the content.

## Toolbox

**Asymmetric layouts.** Offset the content axis. Use a 12-col grid but place things
at 2/7, 8/12 — never 1/12, 1/12, 1/12. Let one element bleed off-canvas.

**Typography-led.** The type *is* the layout: an oversized word as the composition,
text wrapping an image, a headline broken across three lines at three sizes,
vertical type in a margin, a paragraph set as a narrow editorial column beside a void.

**Fullscreen sections.** Each viewport is one complete, composed frame. Works with
snap or pinning. Demands that every frame be individually strong.

**Horizontal scrolling.** For sequences, collections, timelines, galleries.
Give a progress indicator, and reconsider entirely on touch.

**Pinned storytelling.** Sticky visual, content scrolling past it — or the inverse.
See `scroll-storytelling`.

**Overlapping compositions.** Negative margins, z-index layering, images that sit
over type that sits over another image. This is the single fastest way to move from
"template" to "editorial". Needs careful contrast management for legibility.

**Editorial composition.** Steal from magazines, not from websites: pull quotes,
drop caps, captions in the margin, a full-bleed spread facing a text column,
generous gutters, deliberate rag.

**Floating / spatial elements.** Elements positioned in 3D space (CSS `perspective`
or WebGL) that respond to scroll and pointer with different depths.

**Depth.** Layer foreground/mid/background at different parallax rates. Blur the
background plane slightly. This alone makes a flat page feel built.

**Masks.** `clip-path`, SVG masks, `mask-image` for reveals, shaped image crops,
text clipped to video or a moving gradient. Animate the mask, not the content.

**Unconventional navigation.** Nav as an overlay with its own composition, a radial
or spatial menu, navigation embedded in the 3D object itself, a persistent index in
the margin, keyboard-driven navigation with a visible hint.
Constraint: it must be discoverable in under 2 seconds and keyboard accessible.

**Interactive galleries.** Drag-scroll, cursor-following previews, hover-to-video,
grid↔list morphing, click-to-expand with shared-element transitions.

## Method for a new page

1. Ask: what is this page *actually* for, in one sentence?
2. Ask: what is the one thing that must dominate the first frame?
3. Choose a compositional strategy from above that fits — **different from the
   previous page's strategy** unless there's a reason.
4. Sketch the grid: columns, where the content axis sits, what breaks out.
5. Place the type first, at real sizes, with real copy. Layout follows type.
6. Only then decide about imagery, 3D and motion.

## Per-page differentiation (mandatory on multi-page sites)

Constant: type system, colour, brand voice, base UI, cursor, nav, transitions.
Variable: composition, grid, rhythm, scroll behaviour, camera, density.

If your page inventory has the same wireframe twice, redesign one of them.

## Guardrails

- Legibility beats novelty, every time. Contrast, line length, reading order.
- Reading order in the DOM must match visual order (or fix it with proper markup,
  never with `order`/absolute positioning alone) — screen readers follow the DOM.
- Every experimental layout needs a *deliberately designed* mobile counterpart,
  not a squeezed one. See `mobile-experience-director`.
- Overflow discipline: `overflow-x` must never appear by accident. Check at 320px.
- If a visitor can't find the primary action or the navigation, the layout failed
  regardless of how beautiful it is.
