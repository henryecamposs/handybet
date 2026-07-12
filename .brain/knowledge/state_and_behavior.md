# HandyBet — Manejo de Estado y Comportamiento

## 1. Estado Global con Zustand (`src/store/useHandyBetStore.ts`)
La tienda global Zustand de la aplicación centraliza estados de la interfaz y autenticación simulada:
- `mockSession`: Almacena el usuario logueado en la sesión local (`id`, `username`, `role`).
- `isScannerActive` y `activeTicketCode`: Controla la visualización del visor de cámara QR y el ticket actualmente seleccionado para confirmación de apuestas.
- **Acciones:** `setMockSession`, `setScannerActive`, `setActiveTicketCode`.

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
- **`socialService.ts`:** Proporciona funciones asíncronas para administrar el feed relacional por capas de visibilidad y las amistades directas.
- **`groupMonetizationService.ts`:** Gestiona el procesamiento de cuestionarios de onboarding y split de transacciones (90/10) entre la billetera del creador del grupo y la plataforma.
