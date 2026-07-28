---
name: deploy
description: Skill de despliegue automatizado a producción. Garantiza compilación limpia, actualización del CHANGELOG con propuestas de QA, actualización de Project Brain, sincronización 100% automática con Obsidian (notas 000-900) y push a Git remoto origin main.
---

# Skill de Despliegue Automatizado (`deploy`)

Este skill se encarga de ejecutar el flujo completo de despliegue a producción de forma rigurosa y 100% automática sin solicitar confirmaciones al usuario.

---

## 📋 Pasos Obligatorios del Despliegue

### 1. Compilar y Verificar el Proyecto
- Ejecutar `npm run build`.
- Si hay errores de compilación o de TypeScript/linting, corregirlos inmediatamente antes de continuar.

### 2. Actualizar el CHANGELOG con Propuestas de QA
- Leer o crear `CHANGELOG.md` en la raíz del proyecto.
- Añadir la versión/fecha actual conteniendo:
  - `### Añadido`: Nuevas funcionalidades desarrolladas.
  - `### Modificado`: Cambios, refactorizaciones y optimizaciones.
  - `### Corregido`: Bugs resueltos.
  - `### Recomendaciones y Pruebas de QA` *(Obligatorio)*: Sección generada por el agente **@QA_Revisor** con propuestas concretas de pruebas (escenarios límite, pruebas de estrés, validación de RLS/seguridad y sugerencias de regresión para las nuevas características).

### 3. Actualizar Project Brain
- Ejecutar el skill `project-brain` para actualizar la documentación de arquitectura, decisiones (`decision_log.md`) y estado técnico en la carpeta `.brain/`.

### 4. Sincronización Automática con Obsidian (`obsidian-docs`)
- **Lectura de Configuración**: Leer obligatoriamente el archivo `.obsidian-sync.json` ubicado en la raíz del proyecto para obtener la propiedad `vault_path` y los metadatos de sincronización.
- Ejecutar en silencio el skill `obsidian-docs` **sin pedir autorización ni confirmación previa al usuario**.
- Guardar/actualizar la estructura completa de notas (000- a 900-) directamente en la ruta obtenida de `vault_path` en `.obsidian-sync.json` (ejemplo: `C:\Users\DELL\OneDrive\boveda Conocimientos\Conocimientos\[PrefijoNum] - [Emoticono] [NombreProyecto]\`).
- Garantizar la creación/actualización de la nota `900 - {{emoticono}} {{proyecto}} - Recomendaciones y Pruebas de QA.md`.
- Sincronizar el espejo local en `<proyecto>/obsidian/` e `index.json`.

### 5. Desplegar a Git Remote (`origin main`)
- Ejecutar los comandos Git para publicar en producción:
  - `git add .`
  - `git commit -m "chore: deploy [resumen de cambios + QA proposals]"`
  - `git push origin main`

### 6. Confirmación Final
- Notificar al usuario con un resumen conciso del despliegue indicando la versión compilada, el estado de Git y las recomendaciones clave de QA registradas.
