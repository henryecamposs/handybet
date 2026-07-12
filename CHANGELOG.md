# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-07-12

### Añadido
- Identidad gráfica completa de **HandyBet** con soporte paramétrico (Logo.tsx).
- Flujo de *Onboarding* de Grupos con cuestionarios de intenciones.
- Flujo de monetización *Pay-to-Post* y simulador de *Split de Transacciones* (90/10).
- Atributos `phone_whatsapp` y `whatsapp_handle` en los perfiles de usuario.
- Cerebro portátil (`.brain/`) para documentar arquitectura, dependencias y registro de decisiones.
- Skill local `deploy-and-brain` para gestión automatizada del ciclo de despliegue y documentación.

### Cambiado
- Rebranding completo de la aplicación (de Yastaa a HandyBet).
- Reorganización arquitectónica del esquema de base de datos (`handybet-core.spec.md` y migraciones SQL) para incorporar la Capa Social (Grupos, Posts, Amistades, Planes).
- Refactor del `(tabs)/_layout.tsx` para forzar un diseño estricto de 5 pestañas persistentes (hiding sub-routes) para mantener compatibilidad Web/Móvil.
- Centrado y reestructuración del contenedor de iconos en la barra de reacciones (`feed.tsx`) al 50% de ancho.
- Migración de emojis a íconos vectoriales `lucide-react-native` (`Heart`, `MessageSquare`, `Share2`, `Bell`).
