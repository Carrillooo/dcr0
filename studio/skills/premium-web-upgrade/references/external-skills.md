# Third-party skill sources — and how to vet them

## Official (preferred)

**`anthropics/claude-code`** → `plugins/frontend-design/skills/frontend-design/SKILL.md`
Built specifically for distinctive, production-grade frontend design that avoids generic
AI aesthetics. **Use as the primary frontend-design reference.**
A vendored copy lives at `~/.claude/skills/frontend-design/`. Prefer the official plugin
if it becomes installable via the marketplace, and delete the vendored copy then.

## Third-party — vet before use

**Never run unknown scripts automatically.** Before using any of these:

1. Read `SKILL.md` in full.
2. Read every included script. Anything that curls-and-executes, phones home, touches
   credentials, or writes outside the project is a hard no.
3. Check the licence.
4. Confirm it genuinely adds value to *this* project.
5. Do not install several redundant skills just because they exist — if the personal
   studio skills already cover a capability, skip it.
6. Prefer reading a third-party skill as reference over installing it.

| Repo | Look for | Useful for |
|---|---|---|
| `marcusbey/skills` | `premium-website-builder` | Premium websites, cinematic WebGL, Three.js, R3F, GLSL, HDRI, postprocessing, ScrollTrigger, page transitions, emotional design |
| `xiaopu-ai/web-design` | spec-first workflow | Designing before coding, specifying visual direction, analysing references, converting design into implementation |
| `lotfb86/web-design-skills` | selected parts only | Frontend design, responsive, design guidelines, theme generation, website rebuilds, design systems |
| `hicay/claude-code-skills` | `ui-ux-design` | A useful *second* review pass on spacing, hierarchy, consistency, components, responsive design |

Overlap note: the personal studio skills already cover art direction, 3D, scroll,
motion, shaders, layout, UI, transitions, performance, mobile and final audit.
Reach for a third-party skill only where it adds something those genuinely lack.
