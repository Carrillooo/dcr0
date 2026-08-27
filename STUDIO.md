# DCRO — Creative direction

The brief this build was made against. Kept in the repo so later sessions
inherit the concept instead of re-inventing it.

---

## 01 · Central idea

> **Light reveals engineering.**

The whole site is one dark studio with a single travelling light in it. Nothing
is presented; things are *found* by the light. Every scene transition is a light
event, every product reveal is a sweep, and the only red on the site is a
trailing edge behind that light.

This is why the loader is a drawing being constructed, why the home opens on an
almost-black frame, and why the category "worlds" change the lighting rather
than the layout.

## 02 · Art direction

**Palette** — narrow by design. `#050505` ground · `#111111` graphite ·
`#F2F2F0` warm white · `#9A9A95` aluminium · `#C8102E` accent.
Red is an event, never a surface: an indicator, a trailing light edge, a rule
under a live filter. If a frame reads as "red and black", it is wrong.

**Type** — Archivo for display (set very large, tracking −0.035em, line-height
0.86), IBM Plex Sans for UI, IBM Plex Mono for every technical value. Chosen for
an engineering register; deliberately not Inter or Roboto.

**Materials** — machined aluminium, hard anodised graphite, brushed stainless,
full-grain leather (sheen, not gloss), optical acrylic, pre-preg carbon.
All procedural: see `src/lib/textures.ts`.

**Grid** — asymmetric. A mono technical rail runs down the left of every act.
Section rhythm is 12–20vh, not 64px.

**Motion** — one easing family (`expo.out` / `power3.out`), one duration scale.
Nothing moves without a reason.

## 03 · Sitemap and per-page concept

Identity is constant — type, colour, UI, cursor, transitions. Composition is not.

| Route | Concept |
|---|---|
| `/` | Cinematic five-act narrative, scroll-scrubbed |
| `/shop` | Edited catalogue: irregular grid, quiet filters |
| `/shop/[category]` | A world — its own light and material, editorial index |
| `/product/[slug]` | Interactive studio, then a disassembly story |
| `/vehicle` | Split composition: selector left, car drawing resolving right |
| `/about` | Documentary editorial — text column against a wide margin |
| `/search` | The input *is* the composition, set at display size |
| `/cart` `/checkout` `/account` | Utility. Clarity beats art direction here |

## 04 · WOW moments

1. **Loader → reveal** — a technical elevation draws itself, resolves, and wipes
   straight into the 3D already in progress behind it.
2. **Light finds the object** — a travelling shaft of light discovers the
   product out of a black stage.
3. **Exploded view** — six components separate and reassemble under scroll, each
   calling itself out as it arrives.
4. **Five worlds** — one continuous lateral move where the light, the material
   and the mood change per category, and the layout does not.
5. **In the cabin** — the camera descends into a dark interior and the product
   is already fitted, with the LUMEN strip lighting the door card.
6. **Camera through object** — at the end of the macro act the camera passes
   through the part; the surface fills the frame and cuts to the next scene.
7. **Vehicle selector** — a wireframe car resolves into a solid body as the four
   choices are completed.

## 05 · Home storyboard (scroll %)

| Act | Pin | 0 → 1 |
|---|---|---|
| 01 Reveal | 300vh | Light crosses · title arrives 22% · product named 68% |
| 02 Exploded | 400vh | Separates 5–78% · callouts 16–85% · reassembles 86–100% |
| 03 Worlds | 500vh | Five 20% bands, each its own light and finish |
| 04 Context | 300vh | Cabin fades in 8–45% · fitment copy · view product |
| 05 Engineering | 300vh | Macro push · four claims · camera-through at 78–100% |

After act 05 the canvas switches off (`SceneGate`) and the page becomes
typographic: featured rail, fitment call, statement, shop.

## 06 · Assets still to supply

Everything 3D and 2D is currently **procedural** — real geometry and real
materials, but authored in code because no final assets exist yet. None of it is
a grey box, and all of it is a drop-in replacement:

| Needed | Spec | Replaces |
|---|---|---|
| `public/models/<slug>.glb` | Draco or Meshopt, KTX2 textures, ≤3 MB, six named parts matching `PART_IDS` | `src/components/canvas/products/ProductModel.tsx` |
| Studio HDRI | 2k `.hdr`, long strip sources | `Studio.tsx` `<Lightformer>` set |
| Product photography | 4:5 and 16:11 crops, one lighting direction throughout | `ProductPlate.tsx` |
| Cabin interior | Low-poly GLB, ≤1 MB, dark matte | `Cabin.tsx` |
| Vehicle silhouettes | Per-model profile paths | `VehicleScene.tsx` `carProfile()` |
| Audio | Short ambient loop + UI clicks | Synthesised in `SoundToggle.tsx` |

Keep the part ids and the explode offsets when swapping in a GLB and every
scroll timeline on the site keeps working unchanged.

## 07 · Performance budget

Desktop 60fps · mobile 60fps (45 acceptable in the heaviest act) · one WebGL
context for the whole site · DPR capped 2 / 1.5 / 1 by tier · three post passes
desktop, none on low tier · canvas switched off entirely for typographic
sections. See `src/lib/quality.ts`.
