---
title: 📝 Notas Personales y Tareas
project: handy-app
tags: [notas, roadmap, tareas, pendientes]
type: notas-personales
---

# 📝 Observaciones del Programador y Roadmap

## 📌 Notas del Programador (.brain/tasks/personal_notes.md)
Observaciones del programador y deudas técnicas.

## 📌 Roadmap y Deuda Técnica (.brain/tasks/roadmap.md)
# HandyBet — Roadmap y Objetivos Técnicos

## Objetivos a Corto Plazo (Q3 2026)
- [ ] **Autenticación Real:** Migrar del inicio de sesión asíncrono simulado a la autenticación nativa de Supabase (`supabase.auth.signUp` y `signInWithPassword`).
- [ ] **Ejecución de Migraciones:** Ejecutar la migración SQL `20260712010000_handybet_social_schema.sql` en la consola de Supabase de producción y habilitar las tablas físicas reales.
- [ ] **Notificaciones Push:** Integrar Expo Notifications y configurar notificaciones en segundo plano para avisos de resultados de apuestas y comentarios en el muro.

## Objetivos a Mediano Plazo (Q4 2026)
- [ ] **Pasarela de Pago Real:** Reemplazar el simulador de transacciones split por una API real de split de pagos (como Stripe Connect, MercadoPago split o integraciones de Pago Móvil de bancos locales).
- [ ] **Escáner Físico de Cámara:** Testear el módulo `QRCameraScanner` en dispositivos reales iOS y Android asegurando el enfoque automático y permisos de cámara.
- [ ] **Búsqueda Avanzada:** Implementar un motor de búsqueda indexado en Postgres (Full-Text Search) para canales, grupos y posts comerciales.


---
## 🤖 Análisis de la IA: Plan de Acción Sugerido
1. **Prioridad 1**: Solucionar el tipado estricto en `AdminGamesList` y `AdminHomeSectionsList`.
2. **Prioridad 2**: Reemplazar la simulación local del balance en Zustand por la persistencia e integración Realtime directa de Supabase.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
