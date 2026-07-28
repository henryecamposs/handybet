# Especificación Técnica: Homologación Visual de Hubs (Miembros, Usuarios y Canales)

## 1. Visión General
Esta especificación define la unificación del sistema visual de contenedores en HandyBet. Todas las pantallas de detalle de la aplicación (**Miembros/Usuarios**, **Perfil Propio** y **Canales**) deben alinearse al estándar visual establecido en **Grupos** (`channels/groups/index.tsx`).

---

## 2. Reglas de Diseño e Interfaz

### 2.1 Estructura en Grid de 2 Columnas (Desktop Breakpoint `lg:`)
- **Columna Izquierda (`w-full lg:w-1/3 gap-4`)**: Contendrá tarjetas informativas (`bg-card border border-border p-4 rounded-2xl`).
- **Columna Derecha (`w-full lg:w-2/3 gap-4`)**: Contendrá la zona interactiva de publicación (`CreatePostWidget`) y el muro de publicaciones (`PostContainer`).

### 2.2 Consistencia de Pestañas (`TabContainer`)

| Módulo | Pestaña 1 (Predeterminada) | Pestaña 2 | Pestaña 3 | Pestaña 4 | Pestaña 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Grupos** *(Referencia)* | `TODOS` (2 Col) | `MIEMBROS` | `APUESTAS / MEDIA` | `INFORMACIÓN` | - |
| **Miembros / Usuarios** | `PUBLICACIONES` (2 Col) | `INFORMACIÓN` | `FOTOS` | `MIEMBROS` | `GRUPOS` |
| **Perfil Propio** | `PUBLICACIONES` (2 Col) | `INFORMACIÓN` | `WALLETS & LEDGER` | `FOTOS` | `GRUPOS` |
| **Canales** | `TODOS` (2 Col) | `GRUPOS / SALAS` | `INFORMACIÓN` | - | - |

---

## 3. Especificación de Componentes Frontend

### 3.1 `follows/[id].tsx` (Detalle de Usuario/Miembro)
- **Grid Layout en Pestaña `PUBLICACIONES`**:
  - **Izquierda**:
    1. Card *Descripción*: Bio del usuario.
    2. Card *Información & Contacto*: Email, WhatsApp, Rol.
    3. Card *Intereses & Etiquetas*: Listado de chips.
  - **Derecha**:
    1. `CreatePostWidget` (para interacciones en el perfil).
    2. `PostContainer` con `PUBLICACIONES RECIENTES`.

### 3.2 `profile.tsx` (Perfil del Usuario Autenticado)
- Encapsulamiento dentro de `HubDetailLayout` + `HubCover` + `HubDetailsUtilities`.
- Matriz de pestañas idéntica a los perfiles de otros miembros, añadiendo la pestaña de `WALLETS & LEDGER`.
- Layout de 2 columnas en la pestaña `PUBLICACIONES`.

### 3.3 `channels/[channelId].tsx` (Detalle de Canal)
- **Grid Layout en Pestaña `TODOS`**:
  - **Izquierda**:
    1. Card *Descripción*: Resumen del canal.
    2. Card *Detalles & Configuración*: Tipo de canal, salas activas, fecha de creación.
    3. Card *Salas Destacadas*: Vista rápida de las primeras 3 salas con sus íconos y badges.
  - **Derecha**:
    1. `CreatePostWidget` (activado si el usuario es administrador/owner).
    2. `PostContainer` con `PUBLICACIONES RECIENTES` del canal.

---

## 4. Criterios de Aceptación (QA)
1. **Responsividad**: La disposición en 2 columnas se activa únicamente en pantallas `lg` (escritorio/web) y colapsa limpiamente a 1 columna en pantallas móviles.
2. **Pestañas**: Todas las pestañas renderizan correctamente su contenido mediante `TabContainer` sin solapamiento de estilos.
3. **TypeScript**: Cero errores de compilación (`npx tsc --noEmit`).
4. **Linter**: Cero violaciones de hooks o inmutabilidad (`npm run lint`).
