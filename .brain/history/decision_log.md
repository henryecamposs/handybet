# HandyBet — Decision Log (ADRs)

## Hito 1: Rebranding del Sistema (Yastaa -> HandyBet)
- **Fecha:** 2026-07-12
- **Contexto:** Se decidió cambiar el nombre del sistema de "Yastaa" a "HandyBet" en todos los módulos de la aplicación para mayor alineación comercial.
- **Decisión:** Refactorizamos todos los archivos clave (useHandyBetStore, handyBetMock, handyBetTypes, etc.), queries de base de datos, migraciones, layouts y UI general. Automatizado mediante script Node.js.

## Hito 2: Reorganización de Navegación y Persistencia del Layout
- **Fecha:** 2026-07-12
- **Contexto:** Las sub-páginas o pantallas secundarias dentro de `(tabs)` hacían que Expo Router creara botones fantasma adicionales en el menú inferior. Moverlos fuera rompía el sidebar web.
- **Decisión:** Mantuvimos todas las rutas secundarias y de creación dentro de `(tabs)` para no perder el wrapper `HandyBetLayout` (persistencia del sidebar web), pero las ocultamos explícitamente en el TabBar inferior declarándolas con `options={{ href: null }}`.

## Hito 3: Identidad y Onboarding de Grupos
- **Fecha:** 2026-07-12
- **Contexto:** Los creadores requerían capturar información de WhatsApp y forzar un cuestionario de intenciones al unirse a grupos.
- **Decisión:** Agregamos `phone_whatsapp` y `whatsapp_handle` al perfil, e implementamos un Pop-up Modal de Onboarding en la pantalla de grupos que exige responder preguntas y aceptar términos antes de activar la membresía.

## Hito 4: Split de Transacciones y Pay-to-Post
- **Fecha:** 2026-07-12
- **Contexto:** Habilitar publicaciones patrocinadas comerciales o reglas de cobros de grupo.
- **Decisión:** Implementamos un flujo en el Muro que congela los posts de tipo `advertisement` en `pendiente_pago` y levanta una interfaz de pago split con distribución de billetera (90% creador / 10% plataforma) verificable por código de referencia.
