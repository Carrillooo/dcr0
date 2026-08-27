# GLOBAL LUXURY DIGITAL STUDIO

Configuración permanente de Claude Code como estudio digital premium especializado en
web design de lujo, creative development, WebGL / Three.js / React Three Fiber,
experiencias 3D, scroll storytelling, GSAP, motion design y dirección artística.

## Instalación

```bash
git clone https://github.com/Carrillooo/dcr0.git
cd dcr0
bash studio/install.sh
```

Copia `CLAUDE.md` y las skills a `~/.claude/`, con backup automático de lo que ya hubiera.
A partir de ahí aplica a **todos** los proyectos y sesiones de Claude Code de esa máquina.

Reinicia Claude Code después de instalar.

## Contenido

`CLAUDE.md` — reglas globales: identidad del estudio, regla de arranque (nunca empezar
por componentes genéricos), tabla de activación automática de skills, prohibición del
"AI website look", diseño único por página, motion y 3D, stack preferido, calidad de
código, política de assets faltantes, verificación visual obligatoria, orden de
prioridades y uso de referencias.

### Skills

| Skill | Función |
|---|---|
| `digital-experience-master` | Orquestador. Proceso PHASE 01→10, WOW moments, reparto entre especialistas |
| `premium-web-upgrade` | Elevar una web que **ya existe** sin romperla. Inspección obligatoria antes de tocar nada |
| `luxury-web-art-director` | Dirección artística de lujo: tipografía, color, composición, espacio negativo, producto |
| `apple-interface-design` | Principios de Apple como estándar de disciplina (no como plantilla visual) |
| `cinematic-web-designer` | La página como secuencia de cine: escenas, cámara, montaje, ritmo, iluminación |
| `3d-web-experience` | Three.js / R3F / Drei / WebGL, pipeline GLTF, PBR, HDRI, cámaras, postprocessing |
| `scroll-storytelling` | El scroll como timeline: ScrollTrigger, scrub, pin, Lenis, cámara sincronizada |
| `gsap-motion-director` | Sistema de motion: timelines, easing, stagger, SVG, coreografía |
| `shader-material-designer` | GLSL y materiales: cristal, diamante, oro, metal líquido, agua, partículas |
| `experimental-layout-designer` | Romper el layout genérico. Composición distinta por página |
| `luxury-ui-system` | Nav, botones, cursor, search, cart, selectores, forms, modals, checkout, estados |
| `page-transition-director` | Transiciones de ruta: continuidad de objeto, cámara a través, máscaras, portales 3D |
| `3d-performance-engineer` | Presupuestos y optimización: FPS, GLB, texturas, DPR, Draco/Meshopt/KTX2, LOD, memoria |
| `mobile-experience-director` | Móvil rediseñado, no reducido: cámara, timeline, gestos y tipografía propios |
| `visual-quality-auditor` | Auditoría final adversarial. Encuentra y **corrige**, no solo enumera |
| `frontend-design` | Copia de la skill oficial de Anthropic (`anthropics/claude-code`). Ver `SOURCE.md` |

### Referencias

`skills/premium-web-upgrade/references/tech-stack.md` — repos oficiales a consultar por
tecnología (three.js, R3F, drei, gltfjsx, react-postprocessing, GSAP, Lenis,
glTF-Transform, y los opcionales rapier / offscreen). Es documentación, no una lista de
dependencias obligatorias.

`skills/premium-web-upgrade/references/external-skills.md` — skills de terceros y el
procedimiento de revisión obligatorio antes de usarlas. Nunca ejecutar scripts
desconocidos automáticamente.

## Actualizar

Edita los archivos en `studio/`, commitea, y vuelve a ejecutar `bash studio/install.sh`.
