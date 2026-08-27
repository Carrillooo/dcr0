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
