---
description: "Flujo de trabajo para agregar nuevas funcionalidades utilizando el contexto estructural de Graphify para asegurar coherencia."
---

# 🚀 Workflow: Graphify Nueva Feature (`/graph-feature`)

Este workflow te guía para crear nuevas funcionalidades en el proyecto asegurando que la arquitectura existente se respete, utilizando la memoria semántica de Graphify para ahorrar contexto.

## Pasos del Workflow

### 1. 🔍 Elicitación y Contexto (Graph-First)
- Detalla la nueva funcionalidad solicitada.
- Antes de leer el código fuente, utiliza `graphify query "Which modules, services or components handle [Dominio relacionado con la nueva feature]?"`
- Ejemplo: Si la funcionalidad es un nuevo reporte de pagos, consulta qué módulos ya manejan pagos actualmente.

### 2. 📝 Diseño Dirigido por Especificaciones (SDD)
- Con el conocimiento topológico extraído, diseña un `.spec.md` para la nueva feature.
- En la especificación, indica explícitamente a qué nodos (componentes existentes detectados por Graphify) se conectará la nueva feature.
- Pide la aprobación del usuario antes de codificar.

### 3. 🛠️ Ejecución Modular
- Codifica la nueva funcionalidad limitándote estrictamente a lo establecido en la especificación, conectando los módulos apropiados descubiertos previamente.

### 4. 🔄 Actualización Topológica
- Una vez los tests pasen, ejecuta OBLIGATORIAMENTE el comando:
  - `graphify update`
- Esto garantiza que los nuevos nodos (archivos/funciones) creados se integren a la red de Graphify para futuras interacciones.
