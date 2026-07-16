# Especificación Técnica: Twitter-Style Post Detail (Carga en Contenedor Central)

Este documento define las reglas de negocio, interfaces de datos y comportamiento del componente de detalle de publicaciones dentro del feed de HandyBet.

---

## 1. Reglas de Negocio (Business Rules)

* **RN-FD-01 (Carga en Contenedor Central):** Al interactuar con los comentarios o el texto de una publicación en el feed general, la vista detallada de dicha publicación debe cargarse dentro del área central del layout responsivo (`HandyBetLayout`), reemplazando de forma temporal el listado principal de posts.
* **RN-FD-02 (Estructura Visual Twitter-Style):** La vista detallada de la publicación debe seguir un flujo lineal vertical:
  1. Cabecera superior con botón de navegación hacia atrás (flecha izquierda) y el texto "Post".
  2. Publicación original destacada (Avatar, Nombre completo, Alias `@username`, hora de creación, cuerpo de texto en tamaño legible, galería de imágenes/videos con scroll horizontal si contiene media).
  3. Métrica de interacción (Likes, Comentarios, Compartidos).
  4. Caja de entrada de texto de respuesta con el avatar del usuario actual y un botón de "Responder".
  5. Listado de comentarios/respuestas en orden cronológico justo debajo de la caja de entrada.
* **RN-FD-03 (Navegación de Retorno):** Al presionar el botón de retorno, el área central debe volver a mostrar el listado del feed conservando la posición o el listado de posts originales.
* **RN-FD-04 (Acción de Media Lightbox):** Si el usuario hace clic sobre la imagen/video en la vista detallada o en el feed, se debe abrir un modal de media simplificado (`PostMediaViewer`) únicamente para mostrar la imagen en pantalla completa (sin la columna de comentarios lateral que ahora se visualiza en el contenedor central).

---

## 2. Contratos de Datos (TypeScript)

Los contratos se ubicarán en `src/types/yastaa.ts` o en `src/types/handyBet.ts`:

```typescript
export interface PostComment {
  id: string;          // UUID del comentario
  post_id: string;     // Relación con el Post
  author_id: string;   // ID del perfil que comenta
  author_name: string; // Nombre a mostrar
  author_avatar: string; // URL del avatar
  content: string;     // Texto de la respuesta
  created_at: string;  // Fecha de creación ISO
}
```

---

## 3. Endpoints del Backend / Servicios

### API de Comentarios (socialService)
* `getPostComments(postId: string): Promise<PostComment[]>`
  Obtiene la lista de comentarios asociados a una publicación, ordenados cronológicamente por `created_at` (ascendente).
* `createPostComment(postId: string, commentData: Omit<PostComment, 'id' | 'created_at'>): Promise<PostComment>`
  Crea una nueva respuesta para la publicación en base de datos (o la simula localmente en su fallback de mock data).

---

## 4. Componentes Frontend y Estados

### Componente `PostDetailView`
* **Props**:
  * `post: any`: La publicación seleccionada.
  * `onBack: () => void`: Callback para retornar a la lista principal.
  * `onLikeToggle: () => void`: Callback para registrar megustas.
  * `onMediaPress: (index: number) => void`: Callback para abrir la media.
  * `onSharePress: () => void`: Callback para compartir.
* **Estado Local**:
  * `comments: PostComment[]`: Listado de comentarios cargados.
  * `newCommentText: string`: Texto de la caja de entrada para el nuevo comentario.
  * `isSubmitting: boolean`: Estado de carga durante el envío de un comentario.

---

## 5. Criterios de Aceptación (Acceptance Criteria)

* **CA-01:** La transición entre la lista del feed y la vista detallada debe ser instantánea y ocurrir completamente dentro de la sección central (60% del ancho en Desktop), sin alterar la posición ni visibilidad de las barras laterales.
* **CA-02:** Los mensajes/respuestas de otros usuarios deben renderizarse de forma apilada debajo de la caja de comentarios de la publicación del usuario actual.
* **CA-03:** Al presionar "Atrás", el feed general debe recargar o restaurarse inmediatamente.
