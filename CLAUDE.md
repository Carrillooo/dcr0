# dcr0

Este repositorio usa la configuración **GLOBAL LUXURY DIGITAL STUDIO**.

Las reglas de diseño y desarrollo se importan desde `studio/`:

@studio/CLAUDE.md

Las skills del estudio viven en `studio/skills/`. Para que estén disponibles
globalmente en esta máquina (todos los proyectos, todas las sesiones):

```bash
bash studio/install.sh
```

En un contenedor remoto nuevo, ejecútalo al empezar — `~/.claude` es efímero allí.
Ver `studio/README.md` para el detalle de cada skill.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
