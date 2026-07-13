# HandyBet — Guía de Estilos y UI/UX

## 1. Paleta de Colores
HandyBet utiliza un tema oscuro y elegante basado en la escala de grises de Tailwind (Zinc):
- **Background Principal:** `bg-zinc-950` / `#09090b` (Color ultra-oscuro para contraste premium).
- **Cards y Contenedores:** `bg-zinc-900` / `#18181b` con bordes sutiles `border-zinc-800` / `#27272a`.
- **Textos Secundarios:** `text-zinc-400` / `#a1a1aa` y `text-zinc-500` / `#71717a`.
- **Destacados de Marca (Secondary):** Verde lima/amarillento `#caee26` (Color de realce principal de la marca, usado en botones primarios, iconos activos y elementos seleccionados).
- **Destacados de Éxito:** Esmeralda `text-emerald-400` / `bg-emerald-500`.

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
