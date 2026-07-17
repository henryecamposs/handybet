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
│   │   └── layout/        # Layouts y cabeceras
│   │       └── hub/       # Secciones modulares de HubLayout (Carrusel, SeccionLista)
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
- **Persistent Layout (`HandyBetLayout.tsx`):** Un layout responsive en 3 columnas (Sidebar Izquierdo 20%, Contenedor Central 60%, Panel Publicidad/Widgets Derecho 20%) que persiste en la versión web/escritorio con scroll propio e independiente por columnas. Para mayor modularidad y limpieza del código:
  * El navbar superior está modularizado en [HandyBetHeader.tsx](file:///c:/Users/DELL/Documents/dPana%20Projects/frontends/handy-app/src/components/layout/HandyBetHeader.tsx).
  * La barra lateral izquierda está modularizado en [LeftSidebarWidgets.tsx](file:///c:/Users/DELL/Documents/dPana%20Projects/frontends/handy-app/src/components/widgets/LeftSidebarWidgets.tsx).
- **Pestañas Unificadas (5 Tabs):** Para evitar botones o pestañas fantasma en la barra de navegación móvil, el archivo `(tabs)/_layout.tsx` declara de forma explícita cada sub-ruta secundaria (como `channels/create`, `wallet/[id]`, `favorites/index`, `games/index`, `feed/search`, etc.) con la propiedad `options={{ href: null }}`. Esto asegura que la navegación persista dentro de los paneles laterales en la web, pero no cree botones en el móvil.
- **Ruta de Búsqueda y Feed Filtrado (`feed/search`):** Permite renderizar el muro dinámico de posts filtrados por un `id` query param (pudiendo corresponder a un canal, grupo o usuario). También asume la visualización como vista unitaria (`PostDetailView`) de posts o anuncios particulares.

---

## 4. Componentes Clave del Dominio
- **`CreatePostWidget.tsx`:** Widget compacto que expande un Modal completo para adjuntar contenido y metadatos de apuestas.
- **`PostItem.tsx`:** Tarjeta de publicación con avatar en columna izquierda y contenido en columna derecha (estilo Twitter). Soporta click interactivo para ver detalles y menú popover absoluto ⋮ local.
- **`PostDetailView.tsx`:** Vista detallada de una publicación que se renderiza mediante enrutamiento directo en el contenedor central (`feed/[id]`). Soporta retroceso inteligente con anclaje visual (Scroll To Post) al retornar al Muro.
- **`UserProfileScreen` vs `FriendDetailScreen`:** El usuario gestiona su perfil y preferencias en `profile/[id]`, mientras que el detalle y acciones (como interactuar) hacia sus seguidores/amigos se carga de forma independiente en `friends/[id]`.
- **`PostActionButtons.tsx`:** Barra universal de acciones (Me gusta, Comentar, Compartir) reutilizable. Permite variantes según su contexto de uso (iconos completos o compactos).
- **`PostMediaViewer.tsx`:** Visor de comentarios. Implementa lógica de fallback publicitario contextual (`HandyAds`) cuando la publicación no tiene elementos multimedia.
- **`ShareModal.tsx`:** Modal de compartido avanzado segmentado en pestañas (Grupo, Canal, Usuario, Amigo) con buscador interactivo.
- **`src/components/layout/hub/`**: Contiene los subcomponentes modulares (`Carrusel`, `SeccionLista`, `TabContainer`, `PostContainer`, `HeroBanner`) para ensamblar de forma declarativa las páginas de los hubs de manera reutilizable.
