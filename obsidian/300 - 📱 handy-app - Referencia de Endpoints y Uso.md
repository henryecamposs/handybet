---
title: 📡 Referencia de Endpoints, Servicios y Persistencia
project: handy-app
tags: [apis, servicios, supabase, hooks, stores, zustand, persistencia]
type: api-referencia
---

# 📡 Referencia de Endpoints, Servicios y Persistencia

## 📌 Mapa Completo de Comunicación y Persistencia

### 💾 1. Cliente de Persistencia y Base de Datos (Supabase SDK)
* **Ubicación Principal**: `src/lib/supabase.ts`
* **Motor**: PostgreSQL + Supabase JS Client (`@supabase/supabase-js`)
* **Capacidades**:
  - **Autenticación**: Supabase Auth (Manejo de sesiones, JWT, OAuth y persistencia local).
  - **Base de Datos**: Consultas tipadas, RPCs para transacciones financieras y políticas Row Level Security (RLS).
  - **Realtime**: Suscripciones a cambios en vivo sobre las tablas de juegos, apuestas y saldo de billetera.

---

### 🎣 2. Hooks Personalizados de React (`src/hooks/`)
- `src/hooks/useAppNavigation.ts`
- `src/hooks/useDevicePlatform.ts`
- `src/hooks/useHandyBetQueries.ts`
- `src/hooks/useHubUtilities.ts`
- `src/hooks/useStorage.ts`
- `src/hooks/useThemeColors.ts`

#### ⚡ Consultas y Mutaciones React Query (`src/hooks/queries/`):
- **`useGetWallet.ts`**: Consulta y sincronización reactiva del balance del usuario.
- **`useGetGames.ts`**: Obtención del catálogo de juegos y mercados activos.
- **`useGetTransactions.ts`**: Historial transaccional de depósitos, retiros y apuestas.
- **`useCreateTransaction.ts`**: Creación de transacciones financieras (depósitos y retiros).
- **`usePlaceBet.ts`**: Ejecución de jugadas y validación de apuestas en tiempo real.

---

### 📦 3. Stores de Gestión de Estado Global (Zustand `src/stores/`)
- Stores globalizados en `src/stores`.
- **`admin-store.ts`**: Estado del panel de administración, gestión de usuarios, auditoría y control de juegos.
- **`games-store.ts`**: Selección de juegos activos, estado de partidas, filtros de categoría y resultados.
- **`wallet-store.ts`**: Estado del saldo en billetera, moneda activa, datos bancarios y formulario transaccional.
- **`ui-store.ts`**: Estado de la interfaz, temas (dark/light), modales, drawers y navegación.

---

### 🔌 4. Servicios de Integración Externa (`src/services/` y `src/lib/`)
- `src/services/analyticsService.ts`
- `src/services/authService.ts`
- `src/services/botFlowEngine.ts`
- `src/services/channelService.ts`
- `src/services/databaseService.ts`
- `src/services/feedService.ts`
- `src/services/genericBotEngine.ts`
- `src/services/groupMonetizationService.ts`
- `src/services/messagingService.ts`
- `src/services/recommendationService.ts`
- `src/services/socialService.ts`
- `src/services/storageService.ts`
- **`walletService.ts`**: Fachada de servicios para procesar operaciones financieras de entrada y salida con la base de datos y pasarelas de pago.
- **`alerts.ts`**: Utilidad global de alertas interactivas basadas en SweetAlert2 (`sweetalert2`).

---
## 🤖 Análisis de la IA: Capa de Datos y Persistencia
* **Estrategia de Caché**: El uso de TanStack React Query v5 sobre Supabase permite invalidar datos selectivamente y evitar llamadas redundantes a la base de datos.
* **Seguridad Transaccional**: Toda operación de mutación (apuestas y transferencias) se canaliza a través de procedimientos RPC o servicios validados con Zod en el frontend antes de la persistencia.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
