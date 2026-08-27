---
name: luxury-web-art-director
description: Digital art direction for high-end and luxury brands. Use when designing or reviewing the visual language of a website — typography, colour systems, editorial layout, composition, negative space, photography direction, product presentation, visual hierarchy — for fashion, jewellery, automotive, watches, real estate, hospitality, art, premium e-commerce or any brand selling expensive things. Also use to rescue a design that looks like a SaaS template, a generic startup landing or an AI-generated site.
---

# Luxury Web Art Director

## The one question

> **"Could this interface belong to a brand selling a 10.000 € — 50.000 € product?"**

Ask it of every screen, every section, every component. If the answer is no, redo it.

## Banned by default

SaaS layouts · template compositions · card grids as a default answer ·
generic gradients (especially purple→blue) · unjustified glassmorphism ·
cheap glow and neon · rounded-everything · icons in tinted squares ·
visually saturated interfaces · stock-photo energy · anything that reads
"made by an AI in 30 seconds".

Cards are not forbidden — *reaching for cards first* is. A card is what you use
when items are genuinely equivalent and comparable. Products in a luxury house
are rarely equivalent.

## Typography

- Two typefaces maximum, three only with a reason. One display/editorial serif or
  a distinctive grotesque + one workhorse for UI and body.
- Build a real scale (e.g. 1.2 for dense editorial, 1.333–1.5 for dramatic) and use
  `clamp()` for fluid type. Display sizes are *large* — 8–20vw for a hero word is normal
  in luxury, 16px body is not the ceiling for editorial (18–20px reads richer).
- Tracking: negative on large display (-0.02em to -0.04em), positive on small caps
  and labels (0.08em–0.2em). Never leave display type at default tracking.
- Line-height: 0.9–1.05 for display, 1.4–1.6 for body, 1.2–1.3 for subheads.
- Hyphenation off on display, `text-wrap: balance` on headlines, `pretty` on paragraphs.
- Set type in the real language with the real copy. Lorem ipsum hides bad hierarchy.

## Colour

- Luxury palettes are **narrow**. One ground, one ink, one accent — and the accent
  is used sparingly enough to be an event.
- Prefer deep desaturated darks (warm near-blacks #0A0908, #101010 rather than pure #000)
  and warm off-whites (#F4F1EC, #FAF8F5 rather than pure #FFF).
- Metallics come from *gradient + material*, never from a flat gold hex.
- Test the whole palette in both a dark and light section before committing.
- Contrast still has to pass WCAG AA for body text. Elegance is not an excuse.

## Composition & negative space

- Negative space is the primary luxury signal. If a section feels full, remove something.
- Use an asymmetric grid. A 12-column grid used symmetrically produces the template look.
- Anchor content off-centre; let one element break the grid deliberately.
- Vertical rhythm: define a spacing scale (4/8-based or a 1.5 ratio) and *use only it*.
- Section padding in luxury is generous — 12–20vh vertical is normal, not 64px.
- One focal point per viewport. Two focal points = no focal point.

## Photography & product

- Direct the imagery: crop, lighting, background, scale, motion.
- Macro detail shots carry more luxury than full product shots. Show craft.
- Full-bleed imagery with type overlapping it reads editorial; imagery inside a
  rounded card reads e-commerce template.
- Consistent lighting direction across all imagery. Mixed lighting kills cohesion.
- Specify aspect ratios and art direction per breakpoint — never just `object-fit: cover`
  a desktop crop onto mobile.

## Hierarchy

Every section: one primary, one secondary, everything else tertiary.
Achieve hierarchy with **scale, weight, space and position** — not with colour boxes,
borders and shadows. If you need a border to separate two things, the spacing is wrong.

## Premium e-commerce specifics

- Product pages are editorial spreads, not spec sheets. Story first, then detail.
- Price is stated calmly, never shouted, never struck through with a red badge.
- Variant selectors are refined controls, not chunky buttons.
- "Add to cart" is confident and quiet. Urgency banners destroy luxury instantly.
- Delegate the component craft to `luxury-ui-system`.

## Reviewing an existing design

Walk it: type scale → spacing rhythm → hierarchy → colour discipline → imagery →
negative space → the one question at the top. Report the 3 worst offences and fix them.
