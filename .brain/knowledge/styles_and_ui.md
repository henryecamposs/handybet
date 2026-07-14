# HandyBet — Guía de Estilos y UI/UX

## 1. Paleta de Colores
HandyBet utiliza un tema semántico y responsivo basado en colores OKLCH declarados dinámicamente en el tema de Tailwind y NativeWind:
- **Background Principal:** `bg-background` / `bg-background-dark` (Mapeado a la variable `--background` en OKLCH).
- **Cards y Contenedores:** `bg-card` / `bg-popover` (Mapeado a la variable `--card`) con bordes semánticos `border-border` o `border-input`.
- **Textos Secundarios:** `text-muted-foreground` (Mapeado a la variable `--muted-foreground`).
- **Destacados de Marca (Primarios):** `text-primary` / `bg-primary` (Color principal de realce deportivo).
- **Destacados Secundarios:** `text-secondary` / `bg-secondary` (Color secundario de acentuación).
- **Destacados de Éxito / Destructive:** Mapeados dinámicamente a través de `text-emerald-500` o variables semánticas `--destructive`.

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

### 3.2 Barra de Reacciones e Interacciones
Las publicaciones (`PostItem.tsx`) muestran la etiqueta de sentimiento (ej: "Me siento Ganador") en la parte inferior izquierda de la tarjeta. Las reacciones (Me gusta, Comentarios, Compartir) se agrupan horizontalmente a la derecha, manteniendo la consistencia responsive.

### 3.3 Creador de Publicaciones Compacto
El creador de posts (`CreatePostWidget.tsx`) utiliza un patrón de barra reducida en el Feed:
- Muestra el avatar y un campo pill con el mensaje *"¿Qué estás pensando, [Nombre]?"*.
- Incluye iconos directos a color para Video (rojo), Foto (verde) y Sentimiento (naranja).
- Al interactuar, abre un Modal enfocado para redactar la publicación y adjuntar archivos/estados de ánimo.

### 3.4 Desplazamiento Independiente en Sidebars
En resoluciones de escritorio, el sidebar derecho (`RightSidebarWidgets.tsx`) está restringido a una altura de `calc(100vh - 64px)` y cuenta con desplazamiento (`ScrollView`) independiente del feed central, optimizando la visualización de widgets.
