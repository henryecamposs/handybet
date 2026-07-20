# Especificación: Módulo de Analytics y Panel Administrativo (admin-analytics)

## 1. Reglas de Negocio
- **Acceso Restringido:** El área administrativa (`/admin`) está estrictamente protegida. Solo usuarios con la contraseña global `handybet*2026` pueden acceder a esta sección en el cliente.
- **Registro de Actividad (KPIs):** El sistema debe registrar las interacciones de los usuarios en la aplicación (IP, país, estado, ciudad, tiempo de conexión, timestamps de inicio/fin de sesión).
- **Visualización de Datos:** El panel administrativo debe presentar la información en formato de "Cards" (para métricas rápidas) y "Tablas" interactivas (para detalles de sesiones y usuarios).
- **Soporte Multiplataforma:** La interfaz del panel debe ser responsiva, adaptándose perfectamente a Web (escritorio) y Móvil (iOS/Android).

## 2. Contratos de Datos en TypeScript (Interfaces)

```typescript
// src/types/analytics.ts

export interface AnalyticsSession {
  id: string; // UUID
  user_id?: string; // Opcional, si el usuario está logueado
  ip_address: string;
  country?: string;
  region?: string; // Estado / Provincia
  city?: string;
  device_type: 'web' | 'mobile_ios' | 'mobile_android';
  session_start: string; // ISO DateTime
  session_end?: string; // ISO DateTime
  duration_seconds?: number;
}

export interface KPIDashboard {
  total_users: number;
  active_sessions: number;
  avg_connection_time: number;
  top_countries: { country: string; count: number }[];
}
```

## 3. Endpoints del Backend Esperados (Supabase)

Se requerirán las siguientes funciones / RPCs y tablas en Supabase:
- **Tabla `app_analytics_sessions`**: Para guardar cada sesión o visita.
- **RPC `rpc_record_analytics_session`**: Para registrar de forma segura un nuevo inicio de sesión y actualizar tiempos de conexión.
- **RPC `rpc_get_admin_kpis`**: Para obtener métricas agregadas (Dashboard KPIs) de manera eficiente y centralizada.
- **Políticas de Seguridad (RLS)**: La tabla de analíticas debe permitir inserciones públicas (para capturar visitantes anónimos), pero lectura restingida a usuarios administradores. (Para este caso de contraseña global de cliente, es posible que el backend requiera una validación adicional o un RLS basado en un rol `admin`).

## 4. Componentes del Frontend y su Estado

- **(admin)/_layout.tsx**: 
  - **Estado:** `isAuthenticated` (boolean). Valida si se ha ingresado la contraseña correcta.
  - **UI:** Sidebar de navegación (Web) y Drawer/BottomTabs (Móvil). Protege las rutas hijas.
- **(admin)/login.tsx**:
  - **UI:** Formulario simple para ingresar la contraseña `handybet*2026`.
- **(admin)/index.tsx (Dashboard)**:
  - **Estado:** Utiliza React Query para fetching de `KPIDashboard` usando `rpc_get_admin_kpis`.
  - **UI:** Renderiza "Cards" con las métricas.
- **(admin)/traffic.tsx**:
  - **Estado:** Lista de `AnalyticsSession`.
  - **UI:** Usa `@tanstack/react-table` (Web) y listas optimizadas (Móvil) para renderizar la información de los usuarios, IPs y geolocalización.
