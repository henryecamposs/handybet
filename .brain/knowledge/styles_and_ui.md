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

### 3.1 Componente `Logo.tsx`
El logotipo del sistema está centralizado en un componente reutilizable que admite variantes:
- `size`: `'sm'`, `'md'`, `'lg'`, `'xl'` para redimensionar proporcionalmente el isotipo y el texto.
- `layout`: `'horizontal'` o `'vertical'`.
- `showImage` y `showText`: Parámetros booleanos para ocultar o mostrar el isotipo gráfico (PNG de logo) y el texto estilizado "HandyBet".

### 3.2 Barra de Reacciones Centrada al 50%
Las tarjetas del muro/feed de la red social implementan una barra de reacciones (Me gusta, Comentario, Compartir) centrada horizontalmente y limitada al 50% del ancho del post (`w-1/2 items-center`), optimizando la visualización de la interacción y evitando el estiramiento extremo del diseño responsive en pantallas anchas. Usa iconos vectoriales nativos importados de `lucide-react-native`.
