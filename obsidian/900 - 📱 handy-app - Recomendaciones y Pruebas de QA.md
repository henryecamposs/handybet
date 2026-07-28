---
title: 🧪 Recomendaciones y Pruebas de QA
project: handy-app
tags: [qa, pruebas, typescript, validación]
type: pruebas
---

# 🧪 Recomendaciones, QA y Auditorías

## 📌 Checklist Pre-Despliegue a Producción
- [ ] Comprobación estricta de tipos sin errores: `npx tsc --noEmit`
- [ ] Auditoría de código y linters: `npx oxlint` / `npm run lint`
- [ ] Sincronización completa de documentación en Obsidian

---
## 🤖 Análisis de la IA: Calidad y Pruebas
* **Atención Prioritaria**: Corregir los desacoples de tipos en los formularios del Dashboard de Admin antes de autorizar el pase a producción.
* **Pruebas de Carga**: Se sugiere integrar pruebas E2E (Cypress o Playwright) para validar el flujo transaccional de depósitos y jugadas.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
