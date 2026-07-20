---
id: 321
title: Twitter-Style Post Detail (Contenedor Central)
category: 300 - Frontend y Componentes UI
tags: [ui, react-native, nativewind, feed, layout, glassmorphism]
status: aprobado
date: 2026-07-20
---

# 321 — Detalle de Publicación en Contenedor Central

Especificación y arquitectura visual para la vista detallada de publicaciones estilo Twitter/X dentro del contenedor central responsivo de **HandyBet**.

---

## 1. Reglas de Negocio Visuales (RN-FD)

* **RN-FD-01 (Carga en Contenedor Central):** Al presionar sobre una publicación o sus comentarios, la vista extendida se reemplaza dentro de la columna central de `HandyBetLayout` (60% de ancho en escritorio), manteniendo fijas las barras laterales.
* **RN-FD-02 (Estilo Twitter-Style & OKLCH Glassmorphism):**
  * **Header:** Botón de retorno (flecha atrás) + título `"Post"`.
  * **Cuerpo Principal:** Avatar de usuario, nombre, `@username`, badge de rol, fecha formateada, cuerpo de texto legible y galería de archivos adjuntos.
  * **Métricas:** Conteo interactivo de Megustas, Respuestas y Compartidos.
  * **Caja de Respuesta:** Avatar actual, campo de entrada translucido y botón de acción `"Responder"`.
  * **Hilo de Comentarios:** Listado cronológico de respuestas anidadas.
* **RN-FD-03 (Lightbox de Media Simplificado):** Al hacer clic sobre las imágenes/videos en el detalle, se despliega `PostMediaViewer` para pantalla completa.

---

## 2. Contratos de Interfaces (TypeScript)

```typescript
export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  created_at: string;
}

export interface PostDetailViewProps {
  post: {
    id: string;
    author: { name: string; username: string; avatar: string };
    content: string;
    media?: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
  };
  onBack: () => void;
  onLikeToggle: () => void;
  onMediaPress: (index: number) => void;
}
```

---

## 3. Estilos UI Glassmorphic (NativeWind / OKLCH)

```tsx
// Ejemplo de estructura del contenedor central
<View className="flex-1 bg-surface-dark/80 backdrop-blur-md border-x border-white/10">
  {/* Header de Navegación */}
  <View className="flex-row items-center px-4 py-3 border-b border-white/10 bg-surface-card/40">
    <TouchableOpacity onPress={onBack} className="p-2 rounded-full bg-white/5 active:bg-white/10">
      <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
    </TouchableOpacity>
    <Text className="ml-4 font-bold text-lg text-slate-100">Post</Text>
  </View>
  
  {/* Publicación Destacada */}
  <ScrollView className="flex-1 px-4 py-3">
    {/* Componente Post & Hilo de Comentarios */}
  </ScrollView>
</View>
```
