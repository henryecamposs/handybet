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

## Hito 5: Detalle de Posts Estilo Twitter (Sin Popups) y Refactor Modular
- **Fecha:** 2026-07-16
- **Contexto:** Transicionar la vista de publicaciones detalladas y comentarios a un contenedor central fluido, simplificar la UI, optimizar la experiencia de scroll en escritorio, y modularizar la arquitectura del layout de la aplicación.
- **Decisión:**
  * Reemplazamos los popups/modales de detalle de posts por un componente integrado en el área central (`PostDetailView.tsx`), que muestra estadísticas y respuestas cronológicas.
  * Reestructuramos la tarjeta `PostItem.tsx` a dos columnas (avatar izquierda, contenido derecha) y convertimos su menú ⋮ en un popover local absoluto.
  * Solucionamos las barras de scroll redundantes forzando `h-screen max-h-screen overflow-hidden` en `HandyBetLayout.tsx` en escritorio, permitiendo scrollbars fluidos e independientes por columna.
  * Modularizamos la cabecera del layout a [HandyBetHeader.tsx](file:///c:/Users/DELL/Documents/dPana%20Projects/frontends/handy-app/src/components/layout/HandyBetHeader.tsx) y el panel izquierdo a [LeftSidebarWidgets.tsx](file:///c:/Users/DELL/Documents/dPana%20Projects/frontends/handy-app/src/components/widgets/LeftSidebarWidgets.tsx).

## Hito 6: Refactorización de Perfil, Bandeja de Chat y Navegación en Hubs
- **Fecha:** 2026-07-17
- **Contexto:** Se necesitaba mejorar la organización de los chats privados vs grupos, añadir campos extendidos en el perfil de usuario y unificar la navegación (botones Back) en todos los directorios.
- **Decisión:**
  * Rediseñamos el `HandyChat` usando un sistema de pestañas (Directos, Grupos, Canales, Menciones) y un carrusel de usuarios activos.
  * Extendimos `HubLayout.tsx` para soportar un botón universal de retorno al lado de los títulos principales, aplicándolo a todas las vistas de lista.
  * Agregamos los campos de configuración, suscripciones y check de términos de uso en `profile/edit.tsx` (desvinculando el Header estricto).
  * Introdujimos la funcionalidad y rutas ocultas para la sección de "Guardados" (`saved`).

## Hito 7: Unificación de Rutas, Idioma de Código e Integración en Hub
- **Fecha:** 2026-07-17
- **Contexto:** Las secciones de Guardados, Canales y Juegos estaban mal anidadas o presentaban disparidad en el código entre variables en español y rutas. Adicionalmente, el diseño debía cargar dentro del contenedor central de la app persistiendo las barras laterales.
- **Decisión:** 
  * Movimos las rutas de `favorites`, `channels` y `games` de vuelta a la carpeta `(tabs)` y las ocultamos de la barra inferior con `href: null` en `_layout.tsx`, asegurando la renderización en la columna central.
  * Renombramos variables, tipos y directorios (`canales` -> `channels`, `juegos` -> `games`) para mantener un estándar de código en inglés, conservando únicamente las etiquetas visuales (UI) en español.
  * Implementamos búsqueda nativa del `HubLayout` en la sección de Guardados y poblamos los listados rápidos en el menú lateral izquierdo (`LeftSidebarWidgets.tsx`).
