# HandyBet — Guía de Estilos y UI/UX

## 1. Paleta de Colores
HandyBet utiliza un tema semántico y responsivo basado en colores OKLCH declarados dinámicamente en el tema de Tailwind y NativeWind:
- **Background Principal:** `bg-background` / `bg-background-dark` (Mapeado a la variable `--background` en OKLCH).
- **Cards y Contenedores:** `bg-card` / `bg-popover` (Mapeado a la variable `--card`) con bordes semánticos `border-border` o `border-input`.
- **Textos Secundarios:** `text-muted-foreground` (Mapeado a la variable `--muted-foreground`).
- **Destacados de Marca (Primarios):** `text-primary` / `bg-primary` (Color principal de realce deportivo).
- **Destacados Secundarios:** `text-secondary` / `bg-secondary` (Color secundario de acentuación).
- **Destacados de Éxito / Destructive:** Mapeados dinámicamente a través de `text-secondary` o variables semánticas `--destructive`.

---

## 2. Tipografía y Micro-animaciones
- **Tipografía:** Se priorizan fuentes del sistema con pesos fuertes (`font-black` y `font-bold`) para títulos y etiquetas uppercase de menor tamaño para dar un aire deportivo y de alta fidelidad.
- **Transiciones:** Hover sutiles en botones y tarjetas en web con escalados discretos (`active:scale-[0.98]`) y transiciones de color de fondo (`transition-colors`).

---

## 3. Componentes Visuales Clave

### 3.1 Componente `Logo.tsx` y variantes `Handy*Logo`
El logotipo del sistema está centralizado en un componente reutilizable `Logo.tsx` (que renderiza "HandyBet"). Adicionalmente, existen logotipos específicos para cada módulo de la suite (p. ej. `HandyPostLogo`, `HandyAdsLogo`, `HandyChatLogo`, etc.).
- **Regla Tipográfica:** La primera palabra ("Handy") se escribe con peso normal (`font-normal`), mientras que la segunda palabra distintiva ("Bet", "Post", "Ads", "Chat", etc.) se escribe con peso negrita (`font-bold`) para acentuar el módulo correspondiente.
- **Tamaños admitidos:** `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'`.

### 3.2 Estructura estilo Twitter/X en PostItem.tsx
Las publicaciones (`PostItem.tsx`) se estructuran en dos columnas:
- **Columna Izquierda (Estrecha):** Muestra el avatar del autor en la parte superior.
- **Columna Derecha (Flexible):** Contiene el nombre del autor, username, tiempo de publicación, texto clickable (que abre el detalle en la columna central), carrusel multimedia y la barra de reacciones.
- **Menú de Opciones (Popover):** El icono de los tres puntos ⋮ despliega un popover local absoluto directamente abajo del botón, abandonando el modal central clásico para un diseño ágil.

### 3.3 Barra Universal de Acciones (PostActionButtons.tsx)
Las acciones de "Me gusta", "Comentar" y "Compartir" de las publicaciones están unificadas en un componente universal `PostActionButtons.tsx` que soporta variantes según el contexto:
- **Variante `full`**: Muestra los iconos seguidos de los verbos descriptivos completos (ej. "Me gusta"). Usada principalmente en vistas amplias o detalladas como `PostDetailView.tsx`.
- **Variante `compact`**: Muestra los iconos y métricas condensadas (contadores o letras mínimas) junto a ellos. Ideal para el feed y layouts reducidos (`PostItem.tsx`).

### 3.4 Creador de Publicaciones Compacto
El creador de posts (`CreatePostWidget.tsx`) utiliza un patrón de barra reducida en el Feed:
- Muestra el avatar y un campo pill con el mensaje *\"¿Qué estás pensando, [Nombre]?\"*.
- Incluye iconos directos a color para Video (rojo), Foto (verde) y Sentimiento (naranja).
- Al interactuar, abre un Modal enfocado para redactar la publicación y adjuntar archivos/estados de ánimo.

### 3.5 Desplazamiento Independiente en Layout y Sidebars
En resoluciones de escritorio, el layout principal está limitado a `h-screen max-h-screen overflow-hidden` eliminando la scrollbar global de la ventana. Las tres columnas se desplazan independientemente mediante `ScrollView`s internos:
- **Sidebar Izquierdo:** `LeftSidebarWidgets.tsx` con su propio scrollbar oculto.
- **Columna Central:** `feed.tsx` o `PostDetailView.tsx` scrollable independientemente.
- **Sidebar Derecho:** `RightSidebarWidgets.tsx` con altura de `calc(100vh - 64px)` y scroll de widgets independiente.

### 3.6 Sistema Estandarizado de Respuestas (RepliesSection.tsx)
La lógica e interfaz para comentar o responder a publicaciones y noticias se ha estandarizado en un componente centralizado `RepliesSection.tsx`. 
- Incorpora un campo de texto *inline* con estado activo/inactivo (50% y 20% de opacidad en sus textos y botones, respectivamente).
- Las vistas como `PostDetailView.tsx` y `NewsCenterView.tsx` delegan exclusivamente en este componente para garantizar consistencia visual en toda la aplicación.

### 3.7 Contenedores Genéricos de Hub y Detalle
Para unificar el look and feel de las secciones de Canales, Grupos y Juegos, se crearon dos layouts contenedores reutilizables:
- **`HubLayout.tsx`**: Modula la pantalla de inicio (Hub) de estas secciones, manejando buscador, banners principales, tabs de categoría y carruseles horizontales.
- **`HubDetailLayout.tsx`**: Unifica la vista detallada de un elemento seleccionado (como en Canales/[canalId]). Mantiene el estilo visual del encabezado (categoría en mayúsculas pequeñas de color primario, título destacado) y el listado de sub-elementos.

## 4. Estándares de Color
- **`--muted`**: Estandarizado para coincidir cromáticamente con el `--primary` (0.657 0.229 29.729 en OKLCH). Las clases `bg-muted` funcionarán visualmente como un tono primario pero se usan para fondos atenuados o estados deshabilitados.
- **`--muted-foreground`**: Configurado a la mitad de su luminosidad original (50% menos brillo) para suavizar contrastes (ej. textos inactivos o descripciones secundarias).
- **`--border`**: Sobrescrito al color rojizo oscuro (`#49130D` o `oklch(0.277 0.083 29.660)`) globalmente. En Tailwind se expone con una transparencia base predeterminada (`border: "oklch(var(--border) / 0.2)"`), logrando bordes primarios al 20% de forma nativa.
