---
description: "Flujo de trabajo para refactorizar código de forma segura consultando el grafo de dependencias de Graphify para evitar efectos secundarios."
---

# 🚀 Workflow: Graphify Refactor Segura (`/graph-refactor`)

Este workflow te guía para realizar cambios significativos o refactorizaciones en la base de código asegurando que no se rompan dependencias inesperadas, aprovechando el Knowledge Graph de Graphify.

## Pasos del Workflow

### 1. 🔍 Identificación del Objetivo
- Pregúntale al usuario qué componente, archivo o módulo desea refactorizar.
- Si el usuario no especificó el componente en el comando, detente y solicítalo.

### 2. 🗺️ Análisis de Dependencias (Graph-First)
- ¡NO LEAS EL CÓDIGO FUENTE AÚN!
- Ejecuta un query topológico usando el skill de `graphify`:
  - `graphify query "What are the dependencies and dependents of [COMPONENTE]?"`
  - Alternativamente, usa `graphify path` si necesitas ver la conexión entre el componente a refactorizar y la base de datos o el frontend.
- Analiza la respuesta del grafo. Identifica si el componente es un "God Node" (nodo central con demasiadas conexiones) o un nodo aislado.

### 3. 📝 Plan de Refactorización y Reporte de Impacto
- Basado en los resultados del grafo, genera un plan detallado de refactorización (`implementation_plan.md`).
- En la sección de impacto, enlista explícitamente los módulos "dependientes" que se verán afectados según Graphify.
- Pide la aprobación del usuario ANTES de modificar código.

### 4. 🛠️ Ejecución
- Procede a modificar el código fuente según el plan aprobado.
- Asegúrate de actualizar los tests asociados si los identificaste en el grafo.

### 5. 🔄 Actualización del Grafo
- Una vez finalizada la refactorización, ejecuta OBLIGATORIAMENTE el comando de actualización del grafo para mantener la memoria del proyecto al día:
  - `graphify update`

### 6. ✅ Reporte Final
- Crea o actualiza el archivo `walkthrough.md` indicando el éxito de la operación y cómo la arquitectura se ha simplificado.
