---
description: "Flujo de trabajo para realizar una auditoría de la arquitectura del software basado en los insights y topología generada por Graphify."
---

# 🚀 Workflow: Graphify Auditoría de Arquitectura (`/graph-audit`)

Este workflow te guía para realizar una auditoría arquitectónica del proyecto actual sin necesidad de leer archivos manualmente, utilizando los datos topológicos de Graphify.

## Pasos del Workflow

### 1. 🔍 Verificación del Grafo
- Verifica si la carpeta `graphify-out/` existe en el directorio de trabajo.
- Si no existe, ejecuta `graphify .` para generarla.

### 2. 🗺️ Análisis del Reporte de Arquitectura
- Lee el archivo `graphify-out/GRAPH_REPORT.md` (no el código fuente).
- Extrae la siguiente información:
  - **God Nodes**: Clases, archivos o funciones que tienen demasiadas dependencias (alta centralidad).
  - **Comunidades**: Cómo están divididos los módulos.
  - **Conexiones Sorprendentes**: Dependencias circulares o acoplamiento inesperado.

### 3. 📝 Generación del Reporte de Auditoría
- Crea un artefacto (`analysis_results.md`) con las recomendaciones arquitectónicas.
- Si se detectan dependencias circulares o God Nodes, propone un rediseño (ej. separar en microservicios, usar inyección de dependencias o extraer interfaces).
- Pide al usuario que revise el reporte y decida qué recomendación quiere aplicar primero.

### 4. 🛠️ Ejecución Opcional
- Si el usuario aprueba una mejora, inicializa el workflow `/graph-refactor` para llevarla a cabo con seguridad.
