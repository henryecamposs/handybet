---
title: ⚡ Estrategias Avanzadas y Patrones
project: handy-app
tags: [estrategias, zustand, react-query, rendimiento, animación, optimización]
type: optimización
---

# ⚡ Estrategias Avanzadas, Funciones Especiales y Rendimiento

## 📌 Gestión de Estado y Comportamiento (.brain/knowledge/state_and_behavior.md)
# HandyBet — Manejo de Estado y Comportamiento

## 1. Estado Global con Zustand (`src/store/useHandyBetStore.ts`)
La tienda global Zustand de la aplicación centraliza estados de la interfaz y autenticación simulada:
- `mockSession`: Almacena el usuario logueado en la sesión local (`id`, `username`, `role`).
- `isScannerActive` y `activeTicketCode`: Controla la visualización del visor de cámara QR y el ticket actualmente seleccionado para confirmación de apuestas.
- **Acciones:** `setMockSession`, `setScannerActive`, `setActiveTicketCode`.

> **Nota Arquitectónica:** Según análisis topológicos (Graphify), `useHandyBetStore` es un "God Node" (nodo altamente acoplado con >50 conexiones). Muchas de estas dependencias provienen de utilidades secundarias (ej. `QRCameraScanner`). Como regla de diseño, se debe evitar inyectar este store en componentes de presentación pura para prevenir re-renders innecesarios o acoplamientos rígidos.

### 1.1 Navegación e Historial (`src/store/useNavigationStore.ts`)
- Mantiene una pila de historial de navegación (`historyStack`) basada en las rutas previas.
- Resuelve problemas nativos del `expo-router` donde `router.back()` pierde contexto direccional.
- Se gestiona exclusivamente a través del hook `useAppNavigation` que proporciona `navigateTo`, `goBack` y `replaceRoute`.

### 1.2 Custom Hook de Utilidades de Hub (`src/hooks/useHubUtilities.ts`)
- Centraliza manejadores globales para botones de interacciones comunes (Canal, Grupo, Miembro, Usuario):
  - `handleChat(id, type)`: Dirige a la conversación directa.
  - `handleFollowToggle(isFollowing, type, onToggle)`: Ejecuta el cambio de seguimiento y emite un toast global.
  - `handleSaveToggle(isSaved, type, entityName, onToggle)`: Alterna guardados (bookmarks) con feedback visual.
  - `handleViewPosts(id, type)`: Dirige al muro filtrado `/feed/search?id=`.
  - `handleViewProfile(id, type)`: Navega a la vista de perfil o detalle correspondiente.

---

## 2. Estado del Servidor con React Query (`src/hooks/useHandyBetQueries.ts`)
React Query gestiona el estado asíncrono y las peticiones al backend (con Supabase o mock fallbacks):
- **Queries:**
  - `useGetBetByCode(code)`: Consulta detalles de un ticket de apuesta mediante su código de control.
- **Mutations:**
  - `useConfirmQRBet()`: Confirma una apuesta física deduciendo fondos y actualizando el estado de la base de datos.
  - `usePayoutQRBet()`: Transfiere fondos para liquidar el premio de un ticket ganador.

---

## 3. Servicios del Backend y Supabase (`src/services/`)
- **`supabaseClient.ts`:** Inicializa la conexión con Supabase utilizando AsyncStorage para guardar la sesión JWT de forma persistente en React Native y web (seguro contra fallas de SSR).
- **`socialService.ts`:** Proporciona funciones asíncronas para administrar el feed relacional por capas de visibilidad y las amistades directas. Incluye métodos para la gestión de respuestas:
  * `getPostComments(postId)`: Obtiene los comentarios de una publicación en orden cronológico.
  * `createPostComment(postId, commentData)`: Agrega una nueva respuesta a una publicación.
  * *Nota:* Implementa una capa de persistencia simulada en memoria para probar interacciones sin conexión activa de base de datos.
- **`groupMonetizationService.ts`:** Gestiona el procesamiento de cuestionarios de onboarding y split de transacciones (90/10) entre la billetera del creador del grupo y la plataforma.


---

## 🚀 Estrategias Tecnológicas y Funciones Especiales

### 1. Gestión de Caché e Invalidation Strategies (TanStack React Query v5)
- **Invalidación Selectiva**: Las mutaciones de apuestas (`usePlaceBet`) y transacciones (`useCreateTransaction`) invocan la invalidación de claves de consulta (`wallet-balance`, `transactions-list`) para actualización instantánea sin recarga de página.
- **Stale Time Optimizado**: Se configuran tiempos de expiración diferenciados entre el catálogo de juegos (estático/duradero) y el saldo del usuario (dinámico/reactivo).

### 2. Actualizaciones Optimistas (Optimistic UI Updates)
- Cuando el usuario realiza una jugada o registro de transacción, el estado de Zustand refrena visualmente el saldo antes de confirmar el payload en la base de datos, eliminando la latencia percibida.

### 3. Rendimiento en Listado de Assets con FlashList
- Uso de `@shopify/flash-list` en lugar de `FlatList` estándar para renderizar catálogos de juegos y tablas transaccionales masivas sin caídas de framerate en dispositivos móviles ni en Web.

### 4. Animaciones de Alta Fidelidad y Micro-interacciones
- **React Native Reanimated 4**: Animaciones procesadas a nivel nativo en el UI Thread sin saturar el JS Bridge.
- **NativeWind v4 + Tailwind CSS**: Estilos compilados con utilidades CSS óptimas, garantizando una estética oscura premium sin sobrecarga de runtime.

### 5. Optimización Head & SEO Dinámico
- Integración de `react-helmet-async` para actualizar etiquetas OpenGraph, títulos y descripciones de meta dinámicamente según la vista activa.

---
## 🤖 Análisis de la IA: Patrones de Rendimiento
* **Evaluación de Fluidez**: La integración de FlashList y React Native Reanimated coloca la aplicación en el estándar de apps nativas de alta gama.
* **Sincronización Realtime**: Se recomienda estrechar la integración entre WebSockets de Supabase y las invalidaciones de React Query para asegurar consistencia del balance ante eventos concurrentes.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
