# HandyBet — Arquitectura del Proyecto

## 1. Stack Tecnológico
- **Frontend Core:** React Native (Expo SDK 57) + TypeScript.
- **Routing:** Expo Router v3 (File-system routing).
- **Manejo de Estado Local:** Zustand v5 (estado de UI, escáner, sesión simulada).
- **Manejo de Estado del Servidor:** React Query v5 (caching de datos de apuestas y transacciones).
- **Estilos:** NativeWind v4 (Tailwind CSS universal).
- **Base de Datos / Backend:** PostgreSQL vía Supabase client (AsyncStorage persistencia).

---

## 2. Estructura de Directorios
```
yastaa-app/
├── .agents/               # Reglas locales y Skills de IA (Local)
├── .brain/                # Cerebro portátil del proyecto (Documentación de Contexto)
├── assets/                # Iconos del sistema y splash screen nativo
├── components/            # Componentes compartidos del dominio (apuestas, qr)
├── src/
│   ├── app/               # Sistema de Enrutamiento (Expo Router)
│   │   ├── (auth)/        # Autenticación (Login, Registro)
│   │   ├── (dashboard)/   # Taquilla de cajero y administración
│   │   └── (tabs)/        # Barra de navegación principal (5 pestañas)
│   ├── assets/            # Logo y recursos multimedia de la aplicación
│   ├── components/        # Componentes comunes de diseño y UI (Logo, Layouts)
│   ├── hooks/             # Custom Hooks (Queries, Platform detection)
│   ├── lib/               # Clientes y librerías externas (Supabase Client)
│   ├── mockdata/          # Semillas y datos de prueba para desarrollo
│   ├── services/          # Consumo de base de datos y lógica asíncrona
│   ├── store/             # Tiendas globales de estado (useHandyBetStore)
│   └── types/             # Tipos e interfaces globales de TypeScript
└── supabase/              # Migraciones de PostgreSQL y políticas RLS
```

---

## 3. Flujo de Navegación y Rutas
La aplicación utiliza un esquema de enrutamiento basado en **Expo Router** optimizado para web y móvil:
- **Persistent Layout (`HandyBetLayout.tsx`):** Un layout responsive en 3 columnas (Sidebar Izquierdo 20%, Contenedor Central 60%, Panel Publicidad Derecho 20%) que persiste en la versión web/escritorio.
- **Pestañas Unificadas (5 Tabs):** Para evitar botones o pestañas fantasma en la barra de navegación móvil, el archivo `(tabs)/_layout.tsx` declara de forma explícita cada sub-ruta secundaria (como `canales/create`, `wallet/[id]`, etc.) con la propiedad `options={{ href: null }}`. Esto asegura que la navegación persista dentro de los paneles laterales en la web, pero no cree botones en el móvil.
