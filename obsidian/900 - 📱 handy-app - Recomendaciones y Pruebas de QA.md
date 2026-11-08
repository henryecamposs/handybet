---
title: 🧪 Recomendaciones y Pruebas de QA
project: handy-app
tags: [qa, pruebas, typescript, validación]
type: pruebas
---

# 🧪 Recomendaciones, QA e Itinerario Histórico de Pruebas

## 📌 Checklist Pre-Despliegue a Producción
- [ ] Comprobación estricta de tipos sin errores: `npx tsc --noEmit`
- [ ] Auditoría de código y linters: `npx oxlint` / `npm run lint`
- [ ] Sincronización completa de documentación en Obsidian

---
## 📜 Itinerario Histórico de Pruebas y Recomendaciones de QA (Línea de Tiempo)

### Recomendaciones y Pruebas de QA
- 🧪 **Pruebas de Componentes UI y Notificaciones**:
  - Verificar la correcta aparición, permanencia y auto-cierre con animación fluida del componente `Toast` en sus cuatro variantes (`success`, `error`, `warning`, `info`).
  - Probar el comportamiento de renderizado del `HandyBetHeader` en pantallas reducidas (< 768px) comprobando el despliegue del menú y la navegación inferior de pestañas.
- 📱 **Validación de Navegación y Rutas Expo Router**:
  - Validar que los iconos de pestañas (`ChatIcon`, `GroupsIcon`, `FeedIcon`, `WalletIcon`) adopten correctamente los colores de tinte activo (`primary`) e inactivo (`zinc-400`) sin alertas de tipos en tiempo de ejecución.
  - Asegurar que las sub-rutas con `options={{ href: null }}` se mantengan completamente invisibles en la barra inferior móvil.
- 🎨 **Pruebas de Borde & Consistencia Visual**:
  - Comprobar que los nuevos hooks de color (`useBrandColors`, `useTextColors`, `useBackgroundColors`) respondan adecuadamente a cambios de modo oscuro/claro si el dispositivo conmuta temas.
  - Verificar que las publicaciones con carruseles multimedia o imágenes de dimensiones atípicas en `PostItem.tsx` mantengan la alineación de dos columnas sin desbordar el contenedor.

---

### Auditoría & Plan de Pruebas QA (Matriz de Control de Calidad)
- 🧪 **Pruebas Unitarias e Integración**:
  - Verificación de consultas RPC en Supabase (`rpc_place_handybet_bet`, `rpc_record_analytics_session`, `rpc_get_admin_kpis`, `rpc_send_message`, `rpc_toggle_follow`).
  - Cobertura de métodos de estado global con Zustand y validaciones de formularios cliente con Zod.
- ⚠️ **Pruebas de Borde & Estrés**:
  - Resistencia a latencia y fallback offline/mock mode en feeds dinámicos (`feed/index.tsx`, `feed/search.tsx`).
  - Validación horaria bajo huso horario Venezuela `America/Caracas` (VET UTC-4) para el registro de transacciones y sorteos.
  - Verificación de desbordamientos UI en dispositivos móviles y renderizado responsive de carruseles multimedia.
- 🔒 **Pruebas de Seguridad & RBAC**:
  - Control de acceso estricto al Panel Administrativo (`/admin`) mediante contraseña global (`handybet*2026`).
  - Sanitización de entradas en búsqueda de feeds y parámetros de filtrado para prevenir inyecciones.

---
## 🤖 Análisis de la IA: Calidad y Pruebas
* **Atención Prioritaria**: Garantizar el tipado estricto en los formularios y stores antes del pase a producción.
* **Pruebas de Carga**: Se sugiere integrar pruebas E2E (Cypress o Playwright) para validar el flujo transaccional y la regresión de características clave.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
