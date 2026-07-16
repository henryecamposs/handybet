# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.0] - 2026-07-16

### Añadido
- Componente estandarizado `<RepliesSection />` para reutilizar el comportamiento y la interfaz de respuestas/comentarios en múltiples widgets y feeds.

### Cambiado
- Estandarización de colores: Configuración del color base `--muted` para que coincida con `--primary`, atenuación del `--muted-foreground` a un 50% menos de luminosidad (brillo).
- Se configuró el `--border` nativo de la aplicación al equivalente OKLCH del color hexadecimal `#49130D` (marron/rojizo oscuro) y se estableció en Tailwind con 20% de opacidad.
- Se refactorizaron `NewsCenterView` y `PostDetailView` para utilizar el nuevo componente `<RepliesSection />`, manteniendo consistencia visual.
- Se corrigieron variables no declaradas y dependencias de React Hooks (linting errors).

## [1.3.0] - 2026-07-13
- Barra compacta de creación de post (vista reducida) en `CreatePostWidget.tsx` con avatar del usuario y accesos rápidos de multimedia/sentimientos.
- Modal de composición completo para crear publicaciones, desplegado al pulsar la barra compacta.
- Botón interactivo de "Seguir/Siguiendo" en el encabezado de `PostItem.tsx` con retroalimentación visual.
- Menú de opciones en fila horizontal (Compartir, Notificaciones, No mostrar) en la tarjeta de publicación (`PostItem.tsx`).
- Capacidad de ocultar posts localmente ("No mostrar") con banner informativo de reemplazo y botón funcional "Deshacer".
- Modal de compartido avanzado (`ShareModal.tsx`) con pestañas para Grupos, Canales, Usuarios y Amigos, con buscador activo.
- Publicidad patrocinada interactiva en `PostMediaViewer.tsx` cuando se abren los comentarios de posts que no poseen imágenes.
- Sistema de notificaciones Toast flotante para alertas rápidas en el Feed.

### Cambiado
- Corregido error de doble ScrollView anidado en `feed.tsx` que rompía el comportamiento de scroll en web.
- Asignada altura útil de pantalla (`calc(100vh - 64px)`) y scroll independiente en el sidebar derecho (`RightSidebarWidgets.tsx`).
- Aplicado estilo `font-bold` en la segunda palabra del texto de todos los logos de la suite (Post, Chat, Love, News, Pay, Play, Show, Store, etc.).
- Corregidos errores de ESLint por acceso antes de declaración (Temporal Dead Zone) reestructurando y elevando las declaraciones en `monetizacion-ads.tsx` y `[canalId].tsx`.

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
