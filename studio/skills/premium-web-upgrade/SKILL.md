---
name: premium-web-upgrade
description: Audits and elevates an EXISTING website to a premium, Awwwards-level 3D and scroll experience without rebuilding it. Use when asked to improve, upgrade, polish, level up or make more premium a site that already exists — covering art direction, 3D, scroll narrative, motion, transitions, responsive, performance and visual detail. Starts by inspecting the real stack, dependencies and working features so nothing is changed blindly or destroyed. Not for greenfield projects — use digital-experience-master for those.
---

# Premium Web Upgrade

For a site that **already exists**. Do not start from zero. Do not switch frameworks.
Do not break what works.

Greenfield project → `digital-experience-master` instead.

## PHASE A — Inspect before touching anything (mandatory)

Never make blind changes. Establish, in this order:

1. Full project structure (`git ls-files`, or `find . -not -path '*/node_modules/*'`).
2. `package.json` — scripts, and read them before running any.
3. Existing dependencies and their versions. **Do not reinstall what's already there.**
4. The lockfile → this decides the package manager. `pnpm-lock.yaml` → pnpm,
   `yarn.lock` → yarn, `package-lock.json` → npm. **Never mix them.**
5. Which skills are available in this session (personal, project, plugin).
6. What currently works: run it, open it, scroll it, click it.
7. The real stack: framework, router, styling, state, animation, 3D.
8. Components worth preserving — say which, explicitly.
9. The weakest points visually — name them, ranked.
10. Responsive problems and likely performance problems, with evidence.

Report this inventory before proposing changes. It takes minutes and prevents
destroying working functionality.

**Do not upgrade major versions** to enable a nice-to-have. Do not add a dependency
without answering: *does this genuinely improve this project?* If not, don't install it.
Reference repos in `references/tech-stack.md` are a **toolbox and documentation
source**, not a shopping list.

## PHASE B — The five-second verdict

> *"If someone looks at this for five seconds, does it read as a premium site by a
> creative studio, or as a good AI-generated template?"*

If it reads as a template, **change the visual direction** — don't nudge padding.
Go to PHASE C. If the direction is already strong, skip to PHASE E.

Hunt and remove wherever unjustified: centred standard hero · hero + three cards ·
rounded cards everywhere · purple gradients · free glow · unmotivated glassmorphism ·
unnecessary pills · icons inside squares · Inter/Roboto chosen by default ·
perfectly symmetric three-column grids · fade-up on every section · the same layout on
every route · one huge generic CTA · empty corporate copy.

Cross-check with `frontend-design`, `luxury-web-art-director` and `visual-quality-auditor`.

## PHASE C — Concept and direction

**Central idea** — one sentence that governs the whole site. Write it down.

**Visual direction** — typography, colours, grid, composition, photography, materials,
3D, lighting, motion, negative space. Delegate to `luxury-web-art-director`; use
`frontend-design` for the token system (4–6 named hex values, 2–3 typefaces with roles,
a layout concept, and the one signature element).

Typography specifically: display face, body face, weights, tracking, line-height,
optical balance, responsive scaling, editorial composition. Do not pick a face because
it's popular.

## PHASE D — 3 to 7 WOW moments

Choose only the ones that fit **this brand**. Candidates:

- **Object portal** — camera passes through the product; the object becomes the transition.
- **Exploded view** — scroll disassembles the product to reveal its components.
- **Material transformation** — raw/liquid material progressively becomes the product.
- **Macro journey** — camera travels from wide to extreme macro.
- **Spatial typography** — the product passes in front of and behind huge headlines.
- **Light storytelling** — lighting transforms as the narrative advances.
- **Scroll assembly** — scroll progressively builds the product.
- **Horizontal cinematic journey** — vertical scroll drives a horizontal sequence.

Write each as *trigger → what happens → why it matters to this brand*. Get approval
before implementing the expensive ones.

## PHASE E — Execute the upgrade

Work through these, delegating and **implementing** rather than listing:

| Area | Skill | Focus |
|---|---|---|
| Scroll as timeline | `scroll-storytelling` | Storyboard in %, then scrub/pin/horizontal/parallax |
| 3D beyond autorotate | `3d-web-experience` | Cinematic cameras, decomposition, morphing, portals, macro |
| Materials | `shader-material-designer` | No plastic gold, no cheap glass, never bloom to hide bad materials |
| Lighting | `cinematic-web-designer` | Key / fill / rim / studio cards / environment — light defines volume |
| Motion | `gsap-motion-director` | Duration, easing, sequence, stagger, weight — controlled, not frantic |
| Layout per route | `experimental-layout-designer` | Home ≠ Products ≠ Collection ≠ Detail ≠ About ≠ Contact |
| Transitions | `page-transition-director` | Object continuity, camera-through, masks, morphs, light wipes |
| UI layer | `luxury-ui-system` | Nav, buttons, cursor, cart, forms, all interaction states |
| Discipline | `apple-interface-design` | Spacing, clarity, hierarchy, product-first, accessibility |
| Mobile | `mobile-experience-director` | Own camera, own timeline, own typography — not desktop shrunk |
| Performance | `3d-performance-engineer` | GLB/texture sizes, draw calls, DPR, Draco/Meshopt/KTX2, LOD, re-renders |

Keep the creative idea on mobile; adapt the execution.
Reduce postprocessing and DPR on mobile — **a premium site must not look like a video
game**, so keep bloom restrained everywhere.

## PHASE F — Verify for real

Compiling is not verification. Use the `run` skill and check:
desktop · tablet · mobile · menu · the full scroll · animations · canvas · loading ·
page transitions · console · overflow · resize · touch · FPS · visual hierarchy.

Say plainly what you could not check rather than implying you did.

## PHASE G — Adversarial final audit

Stop. Become a creative director who did not build this. Run `visual-quality-auditor`.

Does it look expensive? Does it look designed? Is there an idea? Is anything memorable
after the tab closes? Is the 3D part of the experience? Does the scroll have narrative?
Are there generic sections? Are the pages different enough? Does the typography have
character? Is mobile still special? Is it fluid?

Any important "no" → fix it, then re-audit.

## The rule that matters most

**Do not end with a list of 50 unimplemented suggestions.**
If an improvement is reasonable and implementable within the project: implement it.
Iterate, review, correct. The final version must be clearly superior to the first.

## References

- `references/tech-stack.md` — official upstream repos to consult per technology,
  and when each is genuinely worth adopting.
- `references/external-skills.md` — third-party skill sources and the vetting
  procedure required before using any of them.
