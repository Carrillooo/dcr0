---
name: luxury-ui-system
description: High-end UI component systems — navigation, buttons, custom cursors, menus, search, cart, product selectors, filters, forms, modals, product pages, checkout, responsive controls and interaction states. Use when building or refining the interface layer of a premium site or luxury e-commerce, when components feel generic or inconsistent, or when defining the design tokens and interaction states that keep an experiential site coherent.
---

# Luxury UI System

The experiential layer gets the drama. This layer gets the **discipline**.
A cinematic homepage attached to a Bootstrap checkout destroys the brand instantly.

Every control must feel like it belongs to the same house.

## Tokens first

Define once, use everywhere. No freehand values.

```css
:root{
  --ground:#0A0908; --ink:#F4F1EC; --muted:#8C8880; --line:rgb(244 241 236 / .12);
  --accent:#C9A227;
  --s-1:.25rem; --s-2:.5rem; --s-3:1rem; --s-4:2rem; --s-5:4rem; --s-6:8rem; --s-7:12rem;
  --r-s:2px; --r-m:4px;                       /* luxury radii are SMALL or zero */
  --e-out:cubic-bezier(.16,1,.3,1); --e-io:cubic-bezier(.65,0,.35,1);
  --t-micro:180ms; --t-ui:380ms; --t-scene:900ms;
}
```
Large radii, thick borders and heavy shadows are e-commerce-template signals.
Luxury separates with **space and rule lines**, not with boxes.

## Navigation

- Minimal at rest: wordmark, 2–4 items, cart. It should almost disappear over content.
- Adapt to the content behind it (mix-blend-mode, or a scroll-position colour swap).
  Never a solid bar dropped on top of a cinematic hero.
- Full-screen menu overlay: a composition in its own right — large type, staggered
  line reveals, an image preview per item on hover. Not a dropdown list.
- Hide on scroll down / reveal on scroll up is fine; a permanently sticky opaque bar
  in an experiential site is usually wrong.
- Must be keyboard operable, focus-trapped when open, `Esc` to close, scroll locked
  (lock via Lenis `stop()`, not `overflow:hidden` alone, or you'll fight the smooth scroll).

## Buttons

- Prefer **text + rule + arrow** over filled pills for secondary actions.
- One filled primary style, used rarely. Small radius or none. Uppercase with
  wide tracking reads luxury; sentence case reads modern-editorial. Pick one.
- Hover: something moves or reveals — a fill wiping in from an edge, the label
  shifting up while a duplicate rises in, the arrow travelling. Never just a colour change.
- Always: `:hover`, `:focus-visible`, `:active`, `:disabled`, loading.
  Focus-visible must be *designed*, not a browser outline and not removed.
- Min touch target 44px even when the visual is smaller (use padding or a pseudo-element).

## Custom cursor

Optional, and only if it earns its place. If used:
- Pointer devices only (`@media (hover:hover) and (pointer:fine)`), never on touch.
- Damped follow (`lerp` ~0.12–0.18), `mix-blend-mode: difference` is a reliable base.
- Contextual states: default dot → expanded on interactive → label ("View", "Drag") →
  arrows on a gallery → hidden over form inputs.
- **Never hide the native cursor without a working custom one**, and always restore it
  on unmount and for reduced-motion users.

## Search

Full-screen or side panel, opening with motion. Live results with imagery, not a
plain dropdown. Recent/suggested state before typing. Keyboard: `/` or `⌘K` to open,
arrows to move, `Enter` to select, `Esc` to close.

## Cart

Slide-over panel, never a full page navigation away from browsing.
Line items with generous imagery, quantity as a refined stepper, subtotal set
typographically, and an unhurried checkout CTA. Add-to-cart feedback: a brief,
elegant confirmation — never a toast that shouts.

## Product selectors

Variants as swatches showing the real material/colour, with the name on hover/select.
Size as a clean row with unavailable states clearly but quietly marked.
Selection state must be unmistakable without being loud (a rule beneath, a filled dot,
a subtle scale). Never a native `<select>` for variants on a luxury product page —
but keep it semantically correct (radiogroup roles, keyboard arrows).

## Filters

Progressive disclosure: a quiet "Filter" opening a considered panel. Applied filters
shown as removable tokens. Results update without a full-page flash. URL reflects
state so it's shareable and back-button-correct.

## Forms

Floating or above-field labels — never placeholder-as-label. Underline inputs read
more editorial than boxed ones. Inline validation on blur, not on every keystroke.
Errors in words, not just red. Correct `type`, `inputmode`, `autocomplete` on every field.
`:focus-visible` styled. Success states designed. Never disable the submit button
without explaining why.

## Modals

`<dialog>` or a properly built overlay: focus trap, `Esc`, restore focus on close,
`aria-modal`, scroll lock, backdrop that dims *and* blurs the scene slightly.
Enter/exit motion must match (same easing, exit ~0.7× the enter duration).

## Product page

An editorial spread: full-bleed or 3D hero, story before specification, macro details,
materials and craft, then technical data available on demand. Sticky purchase rail on
desktop, a compact sticky bar on mobile. Delegate the visual direction to
`luxury-web-art-director`; this skill owns the controls.

## Checkout

The one place where **clarity beats art direction**. Keep the type system and colour;
drop the experimentation. Single column, clear steps, visible progress, no surprises,
no motion that delays anything. Guest checkout available. Errors recoverable.

## Interaction states — the non-negotiable checklist

For every interactive element: rest · hover · focus-visible · active · disabled ·
loading · error · success · selected. Missing states are the most common reason a
beautiful site feels unfinished.
