---
name: apple-interface-design
description: Apple's interface design principles applied as a quality and discipline standard — clarity, hierarchy, simplicity, precision, exceptional spacing, typography, purposeful motion, progressive disclosure, product-first design, microinteractions, natural transitions, accessibility, flawless responsive behaviour and extreme attention to detail. Use when refining any UI for precision and restraint, when a layout feels cluttered or imprecise, or when deciding whether an animation or element earns its place. Not for copying Apple's visual style.
---

# Apple Interface Design Principles

## What this is and is not

**Is:** a standard of *quality and discipline*. Clarity, restraint, precision, care.
**Is not:** a visual template. Do not clone Apple.com — no big centred hero + product
shot + two-column feature grid because "Apple does it".

Combine this discipline with genuinely experimental art direction from
`luxury-web-art-director` and `experimental-layout-designer`. Apple supplies the rigour;
the concept supplies the personality.

When you need current specifics, consult the Human Interface Guidelines
(developer.apple.com/design/human-interface-guidelines) rather than recalling them.

## Principles, operationalised

### Clarity
Every element states its purpose without explanation. If a label needs a tooltip
to be understood, the label is wrong. Copy is short, concrete and human.

### Hierarchy
The eye's path through the screen is designed, not accidental.
Rank everything: primary, secondary, tertiary. Ties are a design failure.

### Simplicity through subtraction
Ship the version where you removed something and it got better.
Ask of each element: what breaks if this is gone? If nothing, it's gone.

### Precision
- Optical alignment beats mathematical alignment — a circle next to a square needs nudging.
- Consistent corner radii, and **concentric radii** when nesting (outer = inner + padding).
- Icons on a shared optical weight and grid.
- No 1px drift. No accidental 17px next to 16px.
- Snap to the spacing scale. If something needs an off-scale value, understand why.

### Spacing
Space is the main tool. Related things are close; unrelated things are far.
Set a scale and never freehand a margin. Whitespace is not emptiness — it's the design.

### Typography
One family used with real range beats four families. Use optical sizing and weight
to build hierarchy before you reach for colour. Line length 60–75 characters for body.

### Motion with purpose
Motion explains a relationship — where a thing came from, where it went, what changed.
- Never animate for decoration.
- Duration: 150–250ms UI feedback, 300–500ms transitions, longer only for narrative.
- Easing: custom cubic-bezier that starts fast and settles (e.g. `cubic-bezier(.22,1,.36,1)`).
  Never `linear` for UI, rarely default `ease`.
- Things that appear should come from where they logically live.
- Respect `prefers-reduced-motion` — provide a real, non-broken static path.

### Progressive disclosure
Show what's needed now. Reveal depth on demand. Complexity is available, not imposed.
Applies to nav, filters, product detail, forms.

### Product-first
The product/work is the hero. Chrome, UI and cleverness recede. If your interface is
more memorable than what it presents, you got it backwards.

### Microinteractions
Every interactive element has designed hover, focus-visible, active, disabled and
loading states. Feedback is immediate (<100ms) even when the result isn't.
Focus states are visible and beautiful — never `outline: none` without a replacement.

### Accessibility
Keyboard reachable and operable, in logical order. Real focus indicators.
AA contrast minimum. Semantic HTML first, ARIA only where semantics fall short.
Touch targets ≥44px. Meaningful alt text. Reduced-motion honoured.
Accessibility is part of craft, not a checklist bolted on at the end.

### Responsive
Not "it doesn't break" — it's *right* at every size. Layouts are reconsidered, not squeezed.
See `mobile-experience-director`.

### Detail
The last 10% is the difference. Loading states, empty states, error states,
scroll behaviour, text selection colour, caret colour, overscroll, the favicon,
the 404, the way the cursor changes. Sweat all of it.

## Review pass

Run this over any UI before calling it finished:
alignment · radii · spacing scale adherence · state coverage · focus visibility ·
motion purpose and duration · contrast · touch targets · reduced motion ·
copy precision · what can be removed.
