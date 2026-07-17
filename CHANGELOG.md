# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.6.0] - 2026-07-17

### Añadido
- Nueva pantalla de feed de búsqueda `/feed/search?id=` para visualizar el muro particular de un Canal, un Grupo de Chat o un Usuario con soporte in-situ para publicación de posts de admins.
- Sección de "Últimas Publicaciones" en el Hub de Grupos (`grupos.tsx`) mostrando las últimas 5 novedades y un botón directo para acceder a la sala de feed correspondiente.
- Integración del widget de creación y publicación de posts (`CreatePostWidget`) directamente en las vistas detalladas de Canales (`channels/[channelId].tsx`) y Grupos (`channels/grupo/[grupoId].tsx`) para dueños/administradores.

### Cambiado
- Eliminación de la pestaña "profile" en la barra principal de tabs (`src/app/(tabs)/_layout.tsx`) ocultando la pestaña del layout principal mientras mantiene el registro de la ruta interna.
- Rebranding de la marca HandyChannel: Se eliminó el logo antiguo y se creó el componente estandarizado `HandyRoomLogo.tsx` reflejando "HandyRoom".
- Soporte en `socialService.createPost` y en la interfaz de usuario de creación de posts para que los administradores elijan si publican de forma personal o en representación del grupo o canal que gestionan.
- Ajuste de hoisting y dependencias de React Hooks (ESLint) en `PostMediaCarousel.tsx`, `RepliesSection.tsx`, `friends/index.tsx` (eliminando Math.random para pureza), `favorites/index.tsx`, `favorites/[id].tsx`, `feed/[id].tsx`, y `feed/search.tsx`.

## [1.5.0] - 2026-07-17

### Añadido
- Vista de detalle de usuario `friends/[id].tsx` para visualizar perfil de seguidores, independizándolo del componente de perfil propio.
- Resolución enriquecida de autores de posts en el detalle del Feed mediante `localDB.resolvePostWithAuthor`.

### Cambiado
- Corrección del enrutamiento de Guardados (`favorites/index.tsx`) y el widget lateral para que los perfiles de usuarios guíen a `/friends/[id]`.
- Refactorización de la pantalla Muro (`feed/index.tsx`) para eliminar el renderizado en línea, utilizando ahora una navegación directa a `feed/[id]`.
- Implementación de estado de contexto (`from`) para determinar si el usuario llegó al detalle del Post desde Guardados o desde el Feed, controlando la lógica del botón de Retroceso (`router.back` vs `router.replace`).
- Implementación de scroll automático al volver desde el detalle de publicación hacia el Feed (`scrollToPostId` con referencias de layout `y`).
- Refinamiento del renderizado de detalles y disclaimers colapsables en la pantalla de Billetera (`wallet/[id].tsx`).
- Integración de los componentes de logo estandarizados `HandyPayLogo` y `HandyChannelLogo` en los Hubs correspondientes.
- Solución de falsos positivos en el Linter (React Hooks deps y ref access) en el componente `Toast.tsx`.

## [1.4.0] - 2026-07-16

### Añadido
- Componente estandarizado `<RepliesSection />` para reutilizar el comportamiento y la interfaz de respuestas/comentarios en múltiples widgets y feeds.
- Componente contenedor reutilizable `<HubLayout />` para estructurar de manera coherente las vistas iniciales de Canales, Grupos y Juegos.
- Componente contenedor reutilizable `<HubDetailLayout />` para estandarizar las vistas detalladas de un elemento seleccionado (como en Canales/[canalId]).

### Cambiado
- Estandarización de colores: Configuración del color base `--muted` para que coincida con `--primary`, atenuación del `--muted-foreground` a un 50% menos de luminosidad (brillo).
- Se configuró el `--border` nativo de la aplicación al equivalente OKLCH del color hexadecimal `#49130D` (marron/rojizo oscuro) y se estableció en Tailwind con 20% de opacidad.
- Se refactorizaron `NewsCenterView` y `PostDetailView` para utilizar el nuevo componente `<RepliesSection />`, manteniendo consistencia visual.
- Se corrigieron variables no declaradas y dependencias de React Hooks (linting errors) en `NewsCenterView`, `PrizesCenterView`, `RightSidebarWidgets` y `FriendRequestsCenterView`.

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
