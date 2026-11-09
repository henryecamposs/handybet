---
title: 📜 Historial de Cambios y Registro de Decisiones
project: handy-app
tags: [changelog, adr, historial, decisiones]
type: changelog
---

# 📜 Historial de Cambios y Registro de Decisiones (ADR)

## 📌 Registro de Decisiones Arquitectónicas (.brain/history/decision_log.md)
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

## Hito 8: Refactorización de Perfil (Follows/Id) y Estandarización de Hover States
- **Fecha:** 2026-07-18
- **Contexto:** La vista de perfil carecía de la estructura en pestañas y el Hero Banner requeridos por la nueva UI, además de presentar inconsistencias en los estados de hover en los componentes interactivos (Tabs, IconButtons).
- **Decisión:**
  * Empleamos el `HubDetailLayout` en conjunto con `TabContainer` en `FollowDetailScreen` para renderizar el Hero Banner (foto de portada, avatar, métricas) y pestañas modulares (Publicaciones, Información, Fotos, Seguidos, Grupos).
  * Refactorizamos `TabContainer` e `IconButton` utilizando eventos nativos (`onMouseEnter`/`onMouseLeave`) y `useState` para lograr compatibilidad web 100% precisa en los efectos hover (cambios a colores `bg-muted` y `text-secondary`).
  * Desacoplamos la carga de datos del perfil mediante nuevos métodos en `socialService` (`getSuggestedUsers`, `getSuggestedGroups`), integrando íconos estandarizados en listas vacías con `SeccionLista` y `EmptyState`.
## Hito 9: Panel Administrativo Integrado y Captura de Tráfico
- **Fecha:** 2026-07-20
- **Contexto:** Habilitar un área administrativa (`/admin`) segura para visualizar los KPIs y el tráfico, sin romper la redirección base ni entorpecer el flujo de usuarios normales.
- **Decisión:** 
  * Se configuró Expo Router con una carpeta aislada `app/admin` que posee su propio layout y estado de autenticación (contraseña estática).
  * Se modificó el `_layout.tsx` principal para omitir la redirección de rutas cuyo segmento inicie con `admin`.
  * Se integró `@tanstack/react-table` para proveer tablas ordenables de direcciones IP y tiempos de sesión en escritorio web.

## Hito 10: Sistema de Temas Modular, Impeccable Design & Tipado Estricto de Iconos
- **Fecha:** 2026-11-08
- **Contexto:** Refactorización transversal de estilos e interfaces bajo estándares Impeccable Design, modularización del hook de temas en capas funcionales y corrección de compatibilidad en tipados SVG de pestañas.
- **Decisión:**
  * Segmentamos `useThemeColors.ts` en ganchos especializados: `useBrandColors`, `useTextColors` y `useBackgroundColors` para evitar re-renderizados innecesarios y mejorar la legibilidad.
  * Modernizamos `Toast.tsx` con animaciones nativas fluidas, estados semánticos dinámicos e integración de Lucide Icons.
  * Corregimos los tipos en `src/components/ui/icons.tsx` (`IconProps` acepta `ColorValue` de React Native) asegurando compatibilidad 100% con `tabBarIcon` en Expo Router.
  * Perfeccionamos `HandyBetHeader`, `PostItem` y pantallas de Auth/Hub con diseño oscuro pulido y estados reactivos.

## Hito 11: Scrollbar y Controles de Desplazamiento para Juegos y Sorteos
- **Fecha:** 2026-11-08
- **Contexto:** En la pantalla de Juegos y Sorteos (`/games`), el carrusel de tarjetas hero cortaba las tarjetas adyacentes y carecía de scrollbar o controles visibles para usuarios de escritorio.
- **Decisión:**
  * Creamos `GamesHeroBanner.tsx` con una barra de desplazamiento visual interactiva (track con thumb dinámico en color primario), cálculo de progreso exacto, soporte de clic para saltos en la barra, flechas direccionales flotantes y scroll con rueda de ratón en web (`onWheel`).

## Hito 12: Ecosistema Masivo de Mockdata, Paywalls de Chat VIP, Suscripciones y Simulador Aviator Crash
- **Fecha:** 2026-11-08
- **Contexto:** La plataforma requería poblar completamente todos los módulos con datos masivos y funcionales (+50 usuarios, +50 canales, +50 grupos, +50 juegos en 7 categorías, premios ganados, apuestas, relaciones), además de dotar a la UI de dinamismo real: monetización VIP en chat mediante paywall multimedia, suscripción a planes de tipsters en posts, y un simulador interactivo de crash games con créditos ficticios.
- **Decisión:**
  * Implementamos `scripts/generate_massive_mockdata.js` para generar datasets coherentes en `src/data/` (57 usuarios con roles reales, 52 canales, 56 grupos, 52 juegos en 7 categorías, 22 premios ganados, 32 apuestas, 25 conversaciones de chat, 62 posts y 285 enlaces relacionales).
  * Extendimos `useHandyBetStore` con saldo global reactivo (`walletBalance`), control de medios desbloqueados (`unlockedMediaIds`), métodos de descuento (`deductBalance`), recarga (`addBalance`) y desbloqueo (`unlockMedia`).
  * Enriquecimos el chat privado (`MessageItem.tsx`) con un paywall multimedia interactivo que oculta imágenes bajo blur/candado y permite comprarlas en 1-clic debitando de la billetera.
  * Dotamos a los posts del feed (`PostItem.tsx`) de un botón "Suscribirse ⭐" con selector modular de planes (`TierPlanSelector.tsx`), activando membresías exclusivas con toasts informativos.
  * Diseñamos y construimos `CrashDemoGame.tsx`, un simulador completo de Aviator Crash con curva exponencial, animación de despegue, balance demo recargable, retiro ("Cash Out") y feed en vivo de jugadores comunitarios.
  * Conectamos los Hubs de Juegos (`index.tsx` y `[gameId].tsx`), Miembros (`follows`), Grupos (`grupos.tsx`) y Billetera (`wallet.tsx`) a la base local masiva, permitiendo emitir boletos con números de serie reales y recargar fondos con Pago Móvil simulado.

## Hito 13: Corrección de Altura en Pestañas, Bloques Modulares con Scroll y Paginación a 10 Elementos
- **Fecha:** 2026-11-08
- **Contexto:** Se reportaron tres problemas de diseño derivados de la navegación y el renderizado en React Native Web: (1) Las pestañas se estiraban verticalmente a una altura desmedida dejando un hueco negro y la línea roja al fondo, (2) En la pantalla de miembros, las publicaciones aparecían superpuestas sobre la lista de miembros, y (3) La lista de miembros carecía de paginación para limitar el volumen visual.
- **Decisión:**
  * Refactorizamos `TabContainer.tsx` limitando la barra de pestañas a una altura fija de 46px (`h-[46px]`, `flexGrow: 0`, `flexShrink: 0`) con centrado vertical, eliminando la expansión infinita de flex en todas las pantallas.
  * Rediseñamos `src/app/(tabs)/follows/index.tsx` creando dos bloques contenedores independientes (`bg-card/75 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md`): uno para el Directorio de Miembros y otro para las Publicaciones Recientes, evitando cualquier superposición.
  * Implementamos un sistema de paginación de 10 elementos por página con botones numéricos, controles "Anterior"/"Siguiente" y resumen de conteo (`PAGE_SIZE = 10`), además de búsqueda en tiempo real que reajusta la página automáticamente.

## Hito 14: Pestañas Transparentes Minimalistas y Supresión de Cajas Outer-Card
- **Fecha:** 2026-11-08
- **Contexto:** El usuario solicitó simplificar la estética visual hacia un estilo minimalista y plano: eliminar el fondo gris tipo cápsula de las pestañas en todas las pantallas, retirar las cajas contenedoras de tarjetas maestras en el directorio de miembros (desplegando los miembros directamente sobre el fondo limpio), y asegurar que cada publicación se mantenga en su propia tarjeta individual.
- **Decisión:**
  * Eliminamos los fondos y bordes cápsula en `TabContainer.tsx`, dejando las pestañas con fondo 100% transparente y la línea indicadora activa pegada al texto.
  * Rediseñamos `src/app/(tabs)/follows/index.tsx` eliminando los contenedores de tarjeta maestros y presentando las filas de miembros directamente sobre la superficie general con paginación de 10 elementos.
  * Ajustamos `PostContainer.tsx` para que cada publicación se renderice como una tarjeta aislada sin envoltorios adicionales.


---

## 📄 CHANGELOG.md Completo
# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.17.0] - 2026-11-08

### Modificado
- **Pestañas 100% Transparentes y Minimalistas (`TabContainer.tsx`)**: Eliminado por completo el fondo gris/pill (`bg-white/5`, `rounded-xl`) y los fondos de ítems. Las pestañas ahora descansan limpiamente sobre el fondo oscuro natural de la app con la línea roja indicadora activa (`border-b-2 border-primary`) y tipografía tenue en estado inactivo.
- **Eliminación de Contenedores Outer-Card en Miembros (`follows/index.tsx`)**: Se eliminaron los contenedores envolventes gruesos. La lista de miembros se presenta directamente sobre el fondo de la pantalla con filas de usuario limpias y hover sutil, conservando la paginación de 10 elementos por página y los controles de anterior/siguiente.
- **Filosofía Minimalista "Cada Publicación en un Card" (`PostContainer.tsx`)**: Cabecera transparente sin cajas maestras; cada post vive en su propia tarjeta independiente (`PostItem`) con bordes sutiles y glassmorphism elegante.

## [1.16.0] - 2026-11-08

### Corregido
- **Altura y Estiramiento Vertical en Pestañas (`TabContainer.tsx`)**: Se corrigió el estiramiento vertical excesivo del contenedor de pestañas en React Native Web fijando una altura compacta estricta de 46px (`h-[46px]`, `flexGrow: 0`, `flexShrink: 0`) y posicionando la línea indicadora activa directamente debajo de las etiquetas de pestañas en todos los módulos (`/follows`, `/channels`, `/games`, `/grupos`, `/wallet`).
- **Superposición de Publicaciones sobre la Lista de Miembros (`follows/index.tsx`)**: Eliminada la superposición visual mediante la división de la pantalla en dos bloques modulares independientes con estilos de tarjeta glassmorphism (`bg-card/75 border border-white/10 rounded-2xl`).

### Añadido
- **Paginación a 10 Elementos en Directorio de Miembros (`follows/index.tsx`)**:
  - Paginación dinámica que muestra exactamente 10 usuarios por página.
  - Controles ergonómicos con contador de rango (`Mostrando 1 - 10 de 25 miembros`), botones de salto numérico de página y botones directos `Anterior` y `Siguiente`.
  - Búsqueda en tiempo real que reajusta automáticamente la paginación a la página inicial.
- **Bloque de Muro y Publicaciones Recientes Aislado**: Contenedor secundario con cabecera y enlace rápido al muro completo (`/feed`), garantizando un flujo de lectura limpio sin colisiones entre listas.

### Modificado
- **Tarjetas de Salas y Grupos en Detalle de Canal (`channels/[channelId].tsx`)**: Estilizado con `bg-card/60 border border-white/10 rounded-xl p-1` para evitar desbordes y mejorar la jerarquía visual de acciones en dispositivos de escritorio y móviles.

## [1.15.0] - 2026-11-08

### Añadido
- **Ecosistema Masivo de Mockdata Activo y Completo**: Generación y carga dinámica de datos de alta fidelidad en `src/data/` y persistencia en `localDB`:
  - `users.json`: 57 usuarios (Administradores, Creadoras VIP, Pronosticadores, Taquilleros, Apostadores).
  - `channels.json`: 52 canales con planes de monetización y descripción.
  - `groups.json`: 56 grupos comunitarios asociados a canales con reglas y bots.
  - `games.json`: 52 juegos distribuidos en 7 categorías (`animalitos`, `quinielas`, `minijuegos`, `bingos`, `parley`, `rifas`, `loterias`).
  - `prizes.json`: 22 premios ganados con códigos de boleto y montos en VES.
  - `bets.json`: 32 boletos de apuestas con estados de confirmación y cobro.
  - `chats.json`: 25 salas de chat directo con paywalls de contenido multimedia.
  - `posts.json`: 62 publicaciones con planes de suscripción de creadores y tags deportivos.
  - `news.json`: 20 noticias y boletines oficiales de sorteos y actualidad.
  - `relationships.json`: 285 enlaces de seguimiento y recomendaciones cruzadas.
- **Paywall Multimedia Interactivo en Chat VIP (`MessageItem.tsx`)**: Visualización de contenido bloqueado con efecto blur, insignia de candado, precio en VES/Puntos y botón reactivo para desbloquear con el saldo de la billetera en `useHandyBetStore`.
- **Botón y Modal de Suscripción en Publicaciones (`PostItem.tsx` + `TierPlanSelector.tsx`)**: Integración de planes de membresía (`Datos Libres`, `VIP Oro`, `Club del Animalito`) en publicaciones de creadores con modal de suscripción, deducción de balance en 1-clic y retroalimentación con toasts.
- **Simulador Interactivo Crash Game Aviator (`CrashDemoGame.tsx`)**: Minijuego con curva exponencial de multiplicador, animación de cohete, balance demo con recarga ilimitada, retiro manual ("Cash Out") y feed en vivo de apuestas comunitarias.
- **Expansión de Hub de Juegos a 7 Categorías (`(tabs)/games/index.tsx`)**: Carga dinámica desde `localDB.games`, pestañas de navegación horizontal fluida y contenedor de minijuegos con el simulador Crash integrado.
- **Zona de Apuestas Oficial e Interactiva en Detalle de Juego (`(tabs)/games/[gameId].tsx`)**: Emisión de boletos con código serial, registro automático en `localDB.bets`, deducción de saldo y simulador Crash para juegos de tipo demo.
- **Billetera y Taquillas Dinámica (`(tabs)/wallet.tsx`)**: Vinculación del saldo global reactivo (`walletBalance`), listado de premios cobrables desde `localDB.prizes`, historial de jugadas y modal interactivo para recargas inmediatas con Pago Móvil simulado.

### Modificado
- **Contenedor de Pestañas con Desplazamiento Horizontal (`TabContainer.tsx`)**: Soporte de scroll horizontal (`showsHorizontalScrollIndicator={false}`) para alojar sin desbordes las 7 categorías de sorteos y grupos.
- **Widgets de Barra Lateral Derecha (`RightSidebarWidgets.tsx`)**: Resiliencia y fallback automático para sugerencias de seguimiento y premios ganados, evitando cajas vacías o estados huérfanos.
- **Caché Reactiva de Base de Datos Local (`localDB.ts`)**: Validación automática de volumen de datos (`users.length >= 50 && games.length >= 50`) para re-sembrar automáticamente el storage si existían datos heredados.

### Corregido
- **Variantes de Notificaciones Toast**: Corrección de valores de variante de Toast a `'danger'` y tipado TypeScript estricto en todos los componentes interactivos.

### Recomendaciones y Pruebas de QA
- 🧪 **Pruebas de Desbloqueo VIP**:
  - Abrir chat con creadoras VIP (ej. Joselin, Valeria) y verificar el botón "Desbloquear (15.00 VES)". Confirmar descuento reactivo del balance global y revelación de imagen en alta resolución.
- 🚀 **Pruebas de Simulador Crash**:
  - Ingresar a la pestaña "Mini Juegos" o `/games/g_aviator_crash`, apostar 25 créditos demo, presionar "Despegar" y comprobar que "Cobrar (Cash Out)" acredita las ganancias al balance ficticio antes del estallido.
- ⭐ **Pruebas de Suscripción a Pronosticadores**:
  - En el Feed, pulsar "Suscribirse ⭐" en publicaciones de tipsters (ej. Don Animalito o Roberto). Elegir plan y confirmar la activación del estado "Suscrito".

## [1.14.0] - 2026-11-08

### Añadido
- **Barra de Desplazamiento y Carrusel Interactivo (`GamesHeroBanner.tsx`)**: Implementación de barra de desplazamiento personalizada (scroll track y thumb interactivo) para la sección de Juegos y Sorteos, con soporte de desplazamiento con rueda de ratón en web (`onWheel`), botones de navegación direccionales flotantes y mini-controles auxiliares.
- **Hooks Modulares de Tema (`useThemeColors`)**: Desacoplamiento del hook central en ganchos especializados (`useBrandColors`, `useTextColors`, `useBackgroundColors`) y optimización de la función utilitaria `withOpacity` para componentes deportivos dinámicos.
- **Sistema de Feedback & Notificaciones Visuales (`Toast.tsx`)**: Rediseño integral de notificaciones flotantes con soporte de variantes semánticas (`success`, `error`, `warning`, `info`), mapeo dinámico de Lucide Icons y animaciones suaves combinadas de opacidad y desplazamiento (`Animated.parallel`).
- **Directrices y Tokens Impeccable Design**: Creación de documentación de diseño en `DESIGN.md`, `PRODUCT.md` y `.impeccable/design.json` para estandarización estética en modo oscuro de alta fidelidad.

### Modificado
- **Refactorización de Cabecera Global (`HandyBetHeader.tsx`)**: Reorganización de elementos de navegación, mejoras responsivas para desktop y mobile, avatar interactivo de usuario e integración con el sistema modular de colores.
- **Estructura y Estilizado de Publicaciones (`PostItem.tsx`)**: Refinamiento tipográfico y de márgenes en tarjetas de posts, tags de apuestas y botones de interacción social unificados.
- **Formularios de Autenticación (`login.tsx`)**: Optimización de estados de entrada, validaciones y diseño glass-dark consistente con la experiencia premium de la app.
- **Componentes de Layout (`HubLayout.tsx`, `HubDetailLayout.tsx`)**: Alineación visual de portadas Hero y posicionamiento ergonómico de acciones primarias (`actionButton`).

### Corregido
- **Tipado TypeScript en Iconos de Pestañas (`icons.tsx` & `(tabs)/_layout.tsx`)**: Se corrigió el error `TS2322 (ColorValue no asignable a string | undefined)` permitiendo que `IconProps` acepte `ColorValue` (`OpaqueColorValue` / `string`), garantizando compilación estricta y limpia con Expo Router y React Native.
- **Limpieza de Importaciones Huérfanas**: Eliminadas variables y módulos sin uso (`View`, `Logo`, `withOpacity`) en layouts y widgets laterales reportados por linters.

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

## [1.13.0] - 2026-07-28

### Añadido
- **Arquitectura de Chat Avanzado y Bots**: Implementación completa de chat P2P y grupal con soporte de Bots transaccionales interactivos y barra de acciones (`BotActionBar`, `InteractiveButtonsGroup`). 
- **Motores de Bot (`genericBotEngine`, `botFlowEngine`)**: Soporte para nodos conversacionales definidos en JSON con respuestas automáticas y recolección de entradas del usuario.
- **Especificaciones SDD**: Nuevos documentos arquitectónicos (`advanced-chat-bot-architecture.spec.md`, `generic-json-bot-engine.spec.md`, `hubs-ui-alignment.spec.md`).
- **Migración de Base de Datos**: Migración SQL maestra (`20260722000000_advanced_chat_and_bot_schema.sql`) que da soporte a las nuevas características de mensajería avanzada.
- **Inicialización de Skills Locales**: Volcado de un amplio catálogo de skills (`deploy`, `graphify`, `obsidian-docs`, `oxlint`, `polli`, `project-init`, `react-hook-form`, `vite`) al directorio `.agents/skills/`.

### Cambiado
- **Interfaz y Experiencia de Usuario**: Modificaciones en `HandyBetLayout` y refactorización de `LeftSidebarWidgets` para alinear el diseño de los Hubs.

## [1.12.0] - 2026-07-24

### Añadido
- **Inicialización de Proyecto con `project-init`**: Bootstrapeo y sincronización inteligente de los 20 skills globales de desarrollo, arquitectura y QA a `.agents/skills/`.
- **Integración y Sincronización Automática con Obsidian (`obsidian-docs`)**: Configuración de `.obsidian-sync.json` y generación del conjunto completo de 11 notas numeradas (000 a 1000) en la bóveda global (`050 - 📱 handy-app`) y espejo local (`obsidian/`).
- **Volcado Íntegro de CHANGELOG en Obsidian (Nota 400)**: Sincronización 100% fiel de todo el historial de cambios e hitos técnicos en `400 - 📱 handy-app - Historial de Cambios y Relaciones.md`.

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


## [1.11.0] - 2026-07-20

### Añadido
- **Panel Administrativo (`/admin`)**: Sistema integrado de analíticas protegido por contraseña global (`handybet*2026`) y redirección inteligente desde el layout principal sin afectar a usuarios anónimos ni autenticados en el frontend general.
- **Analíticas en Supabase**: Tablas `app_analytics_sessions` gestionadas con RLS e inserción pública mediante las funciones RPC `rpc_record_analytics_session` y `rpc_get_admin_kpis`.
- **Dashboard y Tráfico Multiplataforma**: Interfaces `index.tsx` y `traffic.tsx` (con soporte `@tanstack/react-table` en web) con UI Sidebar interactiva basada en Expo Router.

## [1.10.0] - 2026-07-20

### Añadido
- **Cerebro Portátil**: Integración de especificaciones bajo el estándar Johnny.Decimal para documentar Core P2P, Hubs de Creación, Detalles de Posts y Rediseño de Perfiles.
- **Reestructuración Completa de Base de Datos Relacional**: Migración SQL maestra con 10 ENUMs, UUIDs, RLS, vistas pre-compiladas (`view_user_feed`), funciones RPC (`rpc_place_handybet_bet`, `rpc_get_suggested_users`, `rpc_send_message`, `rpc_toggle_follow`) e índices GIN/Trigram.
- **Estructuración de Almacenamiento & Hook `useStorage`**: Estandarización de rutas en Supabase Storage bajo el formato `{bucket}/{entityId}/{timestamp}.{extension}` para grupos, canales, miembros, posts y recibos.
- **Sistema de Autenticación Híbrida & Google OAuth 2.0**: Soporte para inicio de sesión en 1-click con Google, registro e inicio de sesión por Email/Password, recuperación de claves y Trigger PostgreSQL atómico (`20260720010000_auth_user_profile_trigger.sql`) para la vinculación automática con `public.profiles`. Guía detallada en `docs/google_oauth_setup.md`.

## [1.9.0] - 2026-07-20

### Añadido
- **Especificación SDD (`creation-hubs-profiles.spec.md`)**: Cobertura arquitectónica completa para flujos de creación de Canales, Grupos con Bots y Perfiles de Miembros.
- **Componente `InterestChipsSelector.tsx`**: Selector interactivo de etiquetas categorizadas alimentado desde `mockdata/interests.json` con soporte para añadir etiquetas personalizadas.
- **Rediseño de Creación de Canales (`channels/create.tsx`)**: Portada Hero, selector de visibilidad, interruptor de contenido +18 obligatorio, tarjetas de Audiencia Target (*Apostadores*, *Creadores*, *Noticias*, *Citas*, *Comercio*, *General*) y selector de Chips.
- **Rediseño de Creación de Grupos (`grupos/create.tsx`)**: Vinculación a canal matriz, selector de tags y módulo de **Bots de Autorespuesta** (*Bot ERP de Ventas*, *Bot de Loterías*, *Asistente IA*, *Bot de Bienvenida*) inicializados como desactivados por defecto (`is_enabled: false`).
- **Rediseño de Perfil de Miembro (`profile/edit.tsx`)**: Edición de identificador único `@handle`, datos de contacto (Email, WhatsApp, Fecha de Nacimiento con control +18, Dirección física), redes sociales (Instagram, Twitter/X, Telegram) y chips de interés.
- **Soporte de Tamaño `xl` en `IconButton.tsx`**: Botón visual grande para acciones principales (`px-7 py-3.5`, icono `28px`, texto `text-lg font-black`).
- **Propiedad `actionButton` en `HubLayout.tsx`**: Ubicación declarativa de botones de creación (`+ Crear Grupo`, `+ Crear Canal`) al lado derecho del buscador principal.

### Cambiado
- **Navegación en Sidebar (`SidebarPopover.tsx`)**: Se dividió la interacción para que al presionar la fila/texto del ítem se navegue directamente a la vista general ("Ver todos"), mientras que al hacer clic exclusivamente en el chevron (`>`) se despliegue el menú emergente.
- **Formulario de Canal**: Se eliminó el campo y bloque de "Registro Fiscal / RIF".
- **Botón de Publicaciones en Miembros**: Al presionar la acción de publicaciones en listas de miembros o contenedores de posts, la app abre directamente la sala de búsqueda `/feed/search?id=`.

## [1.8.0] - 2026-07-20

### Añadido
- Estados vacíos (`EmptyState`) amigables y consistentes para los contenedores de la barra lateral derecha (`RightSidebarWidgets`) cuando no existen anuncios, noticias, premios o sugerencias, mejorando drásticamente el UX en escenarios sin contenido.
- Botones en línea de retroceso (`ArrowLeft`) con soporte nativo de router en las vistas de detalle para navegar de vuelta en el historial fácilmente.
- Mecanismo de auto-etiquetado inteligente en el publicador del Feed de búsqueda: Al intentar publicar en un canal o grupo a través de la búsqueda con id, se añade el handle correspondiente automáticamente.
- Se agregó el componente `HubCover` a manera de Hero Banner en el tope del directorio de canales.
- Ahora los ítems de canales muestran estadísticas reales/mock de Grupos y Miembros Totales.

### Cambiado
- Ocultamiento inteligente de la barra superior global (`HandyBetHeader`) en pantallas de Detalles (Canales, Grupos y Perfil de Usuario) apoyándose en enrutamiento para maximizar el área de uso de los Hero Banners.
- Reorganización manual en el Layout (`LeftSidebarWidgets`) y reemplazo de iconos estándar por Megáfonos (`Megaphone`) para el área de Canales, distinguiéndolo más de la sección "Grupos" que utiliza usuarios/salas.
- Modificación del esquema de color `--card` en Tailwind para mejor contraste oscuro en la UI del sidebar derecho.
- Los popovers de atajos de la barra lateral izquierda ahora enlazan correctamente a los perfiles, canales y grupos en vez de abrir inmediatamente un chat de manera forzada.
- Removidos los parámetros huérfanos `from` y `fromType` de las URL al depender enteramente de la pila de historial en `useAppNavigation`.

### Corregido
- Eliminada la sobrescritura accidental del Nombre de Autor que impedía que publicaciones elaboradas desde una sala se mostraran correctamente bajo la identidad real del usuario (Henry).
- El estado vacío ("Sin publicaciones") del feed de búsqueda ahora se concatena inteligentemente indicando el nombre real del canal, grupo o usuario al que se apunta.

## [1.7.0] - 2026-07-17

### Añadido
- Subcomponentes modulares para `HubLayout` en la carpeta `src/components/layout/hub`: `HeroBanner.tsx`, `Carrusel.tsx`, `SeccionLista.tsx`, `TabContainer.tsx` y `PostContainer.tsx`.
- Pestañas internas en las vistas de Canales, Grupos y Seguidos para separar y organizar contenidos (ej: Mis Canales vs Canales Sugeridos).

### Cambiado
- Refactorización de las vistas de Canales, Grupos y Seguidos para utilizar los subcomponentes compostados (`TabContainer`, `SeccionLista`, `PostContainer`) en lugar de código inline.
- Estandarización de los estados de íconos activos en el menú superior (`HandyBetHeader.tsx`) utilizando `pathname.startsWith` para resolver la omisión de grupos de rutas (`(tabs)`).
- Unificación visual del renderizado de posts en Canales, Grupos y Seguidos a través del componente común `PostItem`, vinculando el click a la ruta `/feed/[id]`.

### Corregido
- Corrección de la ruta de importación de `PostItem` en la vista de seguidos (`follows/index.tsx`) para Metro bundler.
- Solución de sintaxis duplicada de bloques `return` generados durante la inyección de código de los hubs de canales y grupos.

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


---
## 🤖 Análisis de la IA: Evolución del Sistema
* **Trazabilidad Arquitectónica**: Las decisiones registradas (ADRs) demuestran una resolución efectiva de problemas de layout y modularización de componentes.
* **Control de Versiones**: El seguimiento con Keep a Changelog asegura transparencia en los despliegues.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
