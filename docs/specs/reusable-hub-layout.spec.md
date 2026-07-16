# Especificación de Requisitos: Componente HubLayout Reutilizable

Este documento define la especificación técnica para la creación del componente contenedor `HubLayout` en la aplicación HandyBet. El objetivo es unificar la interfaz visual de las pantallas de Canales, Grupos y Juegos/Sorteos bajo una estructura común, garantizando la consistencia visual y facilitando la reutilización del código.

## 1. Reglas de Negocio y Requisitos Visuales

El componente `HubLayout` debe ser altamente paramétrico y adaptable a las necesidades de cada sección:

1. **Header Principal**: Título grande (`text-2xl font-bold`) y subtítulo explicativo (`text-sm text-foreground/70`).
2. **Buscador (Opcional)**: Input de búsqueda con icono. Se renderiza únicamente si se provee una función de callback para cambios de texto.
3. **Hero Banner (Opcional)**: Banner publicitario o promocional destacado (utilizado en la vista de Juegos).
4. **Categorías/Tabs en Cards (Opcional)**: Fila horizontal de tarjetas interactivas para filtrar contenidos (por ejemplo, Taquilla, Quinielas en Juegos).
5. **Carrusel Horizontal "Mis Ítems" (Opcional)**:
   - Título de sección (ej. "Tus Grupos", "Mis Canales").
   - Botón opcional "Crear Nuevo" con borde dashed.
   - Lista horizontal scrollable de tarjetas de ítems que posee el usuario.
6. **Lista Principal/Grilla de Descubrimiento**:
   - Título de sección (ej. "Descubrir Nuevos Grupos", "Directorio de Canales").
   - Soporte para renderizado dinámico de tarjetas (cada pantalla define su propio diseño de tarjeta mediante una función render).
   - Soporta estado de carga (`ActivityIndicator`) y estado vacío (`EmptyState`).
7. **Estilo y Colores**:
   - Respetar los colores definidos en la hoja de estilos (`bg-background/80`, `border-muted-foreground`, etc.).

---

## 2. Contratos de Datos (TypeScript Interfaces)

Definiremos los tipos en `src/types/handyBet.ts` o directamente expuestos en el componente si son específicos de UI.

```typescript
export interface HubLayoutTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface HubLayoutProps {
  title: string;
  subtitle: string;
  
  // Hero Banner
  heroBanner?: React.ReactNode;
  
  // Buscador
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  
  // Categorías / Tabs
  tabs?: HubLayoutTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;
  
  // Sección horizontal (Mis Canales / Tus Grupos)
  myItemsTitle?: string;
  myItems?: any[];
  renderMyItem?: (item: any) => React.ReactNode;
  onAddNewItem?: () => void;
  addNewItemLabel?: string;
  
  // Sección principal de descubrimiento
  discoverTitle?: string;
  discoverItems?: any[];
  renderDiscoverItem?: (item: any) => React.ReactNode;
  discoverLayout?: 'list' | 'grid'; // Grid de 2 columnas para grupos, lista para canales
  
  // Estado de carga y vacío
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  
  // Hijos para inyección de modales o componentes adicionales
  children?: React.ReactNode;
}
```

---

## 3. Arquitectura del Componente

El componente será creado en:
- `[NEW] src/components/layout/HubLayout.tsx`

Las pantallas que lo consumirán son:
- `[MODIFY] src/app/(tabs)/canales/index.tsx`
- `[MODIFY] src/app/(tabs)/grupos.tsx`
- `[MODIFY] src/app/(tabs)/juegos.tsx`

---

## 4. Diseño del Componente y Comportamiento de UI

### Mapeo de pantallas actuales al nuevo `HubLayout`:

| Pantalla | Hero Banner | Buscador | Mis Ítems Carousel | Descubrimiento (Grid/List) | Tabs/Categorías |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Canales** | No | Sí | Sí | Lista (Directorio) | No |
| **Grupos** | No | Sí | Sí | Grid (Descubrir) | No |
| **Juegos** | Sí | No | No | Lista (Sorteos) | Sí |
