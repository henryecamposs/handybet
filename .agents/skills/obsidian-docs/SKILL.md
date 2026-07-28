---
name: obsidian-docs
description: Sincronizador dinámico y documentador técnico con análisis de IA para Obsidian. Extrae la memoria del proyecto (.brain/), variables de entorno (.env, .env.local) y genera/actualiza automáticamente las 11 notas numeradas enriquecidas con análisis arquitectónico profundo sin solicitar autorizaciones en terminal.
---

# Documentador y Sincronizador Automático de Proyectos para Obsidian (`obsidian-docs`)

Este skill estructura, extrae dinámicamente datos reales y genera documentación técnica exhaustiva para cualquier proyecto (Frontend React/Vite/Next.js, Backend Node.js/Express, Móvil Expo/React Native, etc.) tanto en la bóveda principal de Obsidian (`C:\Users\DELL\OneDrive\boveda Conocimientos\Conocimientos\`) como en el espejo local (`<proyecto>/obsidian/`).

> **REQUISITO OBLIGATORIO DE VARIABLES DE ENTORNO**: El skill escanea dinámicamente todos los archivos de entorno (`.env`, `.env.local`, `.env.example`, `.env.development`, `.env.production`) y guarda la matriz completa de variables de entorno sanitizadas dentro de la nota `100 - Configuración y Entorno (.env).md`.

---

## 📑 Lista Obligatoria de las 11 Notas Numeradas a Generar

El sistema DEBE generar y sincronizar exactamente estas 11 notas con su prefijo numérico estricto:

1. `000 - {{emoticono}} {{proyecto}} - Visión General.md` (MOC / Mapa de Conocimiento principal)
2. `100 - {{emoticono}} {{proyecto}} - Configuración y Entorno (.env).md` (Matriz completa de variables de entorno .env, .env.local, scripts y comandos)
3. `200 - {{emoticono}} {{proyecto}} - Integración de IA (Generative AI).md` (Orquestador Failsafe, modelos, SDD y sub-agentes)
4. `300 - {{emoticono}} {{proyecto}} - Referencia de Endpoints y Uso.md` (APIs, Supabase, Servicios y Persistencia)
5. `400 - {{emoticono}} {{proyecto}} - Historial de Cambios y Relaciones.md` (CHANGELOG + Registro de Decisiones ADR)
6. `500 - {{emoticono}} {{proyecto}} - Stack Tecnológico y Arquitectura.md` (Estructura src/, capas y módulos)
7. `600 - {{emoticono}} {{proyecto}} - Estrategias Avanzadas y Patrones.md` (Gestión de estado, Zustand, React Query y rendimiento)
8. `700 - {{emoticono}} {{proyecto}} - Conocimientos Adicionales y Guías.md` (Dominio de negocio y reglas operativas)
9. `800 - {{emoticono}} {{proyecto}} - Puntos Claves y Buenas Prácticas.md` (UI/UX, Estilos, NativeWind/Tailwind y buenas prácticas)
10. `900 - {{emoticono}} {{proyecto}} - Recomendaciones y Pruebas de QA.md` (QA, auditorías de linters y verificación)
11. `1000 - {{emoticono}} {{proyecto}} - Notas Personales y Tareas.md` (Notas del programador, deudas técnicas y roadmap)
12. `_meta_id.md` (Identificador único de metadatos)

---

## 🎯 Reglas de Estructura de Cada Documento

Cada uno de los 11 documentos DEBE estar dividido obligatoriamente en dos grandes bloques:

1. **📌 Información Extraída del Repositorio, Entorno (`.env`) y Cerebro (`.brain/`)**:
   - Escaneo dinámico y 100% veraz de `.env`, `.env.local`, `.env.example`, `package.json`, `CHANGELOG.md` y archivos de `.brain/` (`architecture.md`, `domain_context.md`, `state_and_behavior.md`, `styles_and_ui.md`, `decision_log.md`, `personal_notes.md`, `roadmap.md`).
   - Registro permanente de todas las variables de entorno en la nota `100` con máscara de seguridad para llaves sensibles (`••••`).
   - Queda estrictamente prohibido inventar o hardcodear tecnologías backend no presentes en el repositorio.

2. **🤖 Análisis y Recomendaciones de la IA (Tech Lead Assessment)**:
   - Sección redactada explícitamente por la IA al ejecutar el skill.
   - Profundiza en el *porqué* de las decisiones de diseño, identifica riesgos no documentados en variables de entorno o arquitectura, propone mejoras de refactorización y explica la estructura como un mentor técnico.

---

## ⚡ Flujo de Ejecución Silencioso (Sin Prompts de Permiso)

1. El skill ejecuta la inspección inicial y preparación mediante Node.js:
   ```bash
   node C:\Users\DELL\.gemini\config\skills\obsidian-docs\scripts\sync-obsidian.js
   ```