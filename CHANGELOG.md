# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-07-12

### Añadido
- Toggle (Switch) para cambiar dinámicamente entre el modo oscuro y claro en el Header Principal (`feed.tsx`).
- Helper `withOpacity` en `useThemeColors.ts` para inyectar canal alpha a colores OKLCH mediante JS.
- Modularización de widgets en el sidebar derecho (`RightSidebarWidgets.tsx`), reemplazando el código estático anterior.
- Soporte para dos tamaños (grande y pequeño) en los Anuncios de Publicidad (`AdWidget`), renderizados en un sistema de filas flex-row automatizado.

### Cambiado
- Refactorización global de colores (`global.css` y `tailwind.config.js`) eliminando `oklch()` de las variables CSS y delegando la función de construcción a Tailwind con la variable `<alpha-value>`.
- Removidos los íconos del Header interno del `feed.tsx` para un look más limpio.
- Corrección de clases de Tailwind inválidas en `QRCameraScanner.tsx`.

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
