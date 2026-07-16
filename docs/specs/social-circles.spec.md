# Especificación Técnica: Modelo Social Unidireccional y Círculos de Confianza

Este documento define la especificación técnica máster para la migración del modelo social de **HandyBet** de una estructura de amistad bidireccional a una arquitectura **Unidireccional (Seguidores)** con **Círculos de Confianza**.

---

## 1. Reglas de Negocio (Business Rules)

### 1.1. Seguidores (RN-SOC-01)
* **Unidireccionalidad:** Cualquier usuario (seguidor) puede seguir a otro (seguido) sin necesidad de aprobación ni confirmación mutua.
* **Consulta Base:** Las relaciones de seguimiento se consultan directamente en la tabla `user_relationships`.
* **Desvinculación:** Un usuario puede dejar de seguir a otro en cualquier momento, lo que automáticamente elimina su acceso a contenido exclusivo de seguidores de ese usuario.

### 1.2. Círculos de Confianza (RN-SOC-02)
* **Clasificación 1:N:** Un usuario creador puede organizar a sus seguidores en uno o varios "Círculos de Confianza" personalizados (ej. "VIP", "Amigos Cercanos", "Inversores").
* **Restricción de Pertenencia:** Un usuario solo puede ser miembro de un círculo si previamente es seguidor del creador de dicho círculo.
* **Control del Autor:** El creador del círculo puede añadir o remover a sus seguidores de sus círculos en cualquier momento.

### 1.3. Visibilidad de Publicaciones (RN-SOC-03)
* **Nivel de Visibilidad (`visibility_level`):** Al crear un post, el autor especifica quién puede leerlo:
  * `todos` (Público): Accesible para cualquier usuario (incluso invitados).
  * `seguidores`: Restringido a usuarios que sigan activamente al autor.
  * `circulo`: Restringido a miembros de un círculo de confianza específico configurado por el autor (`circle_id` no nulo).
* **Seguridad y RLS:** La base de datos denegará cualquier lectura de posts que no cumpla con los privilegios del lector, validando en tiempo real contra `user_relationships` y `follower_circle_membership`.

---

## 2. Esquema de Base de Datos (Supabase PostgreSQL)

```sql
-- 1. Deshabilitar RLS y eliminar tabla de amistades antigua
DROP POLICY IF EXISTS "Friendships lectura propia" ON friendships;
DROP POLICY IF EXISTS "Friendships gestion propia" ON friendships;
DROP TABLE IF EXISTS friendships;

-- 2. Crear tabla de Relaciones de Seguimiento (Unidireccional)
CREATE TABLE user_relationships (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_following CHECK (follower_id <> following_id)
);

-- 3. Crear tabla de Círculos de Confianza
CREATE TABLE follower_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (owner_id, name)
);

-- Crear restricción única adicional para posibilitar clave foránea compuesta
ALTER TABLE follower_circles ADD CONSTRAINT unique_circle_owner UNIQUE (id, owner_id);

-- 4. Crear tabla de Membresía en Círculos
CREATE TABLE follower_circle_membership (
    circle_id UUID NOT NULL,
    follower_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (circle_id, follower_id),
    
    -- FK Compuesta 1: Garantiza que el círculo realmente pertenece al owner_id
    CONSTRAINT fk_circle FOREIGN KEY (circle_id, owner_id) 
        REFERENCES follower_circles(id, owner_id) ON DELETE CASCADE,
        
    -- FK Compuesta 2: Garantiza a nivel de base de datos que el miembro sigue al dueño del círculo
    CONSTRAINT fk_follower_relationship FOREIGN KEY (follower_id, owner_id) 
        REFERENCES user_relationships(follower_id, following_id) ON DELETE CASCADE
);

-- 5. Modificar la estructura de Posts
-- Añadir columna de círculo
ALTER TABLE posts ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES follower_circles(id) ON DELETE SET NULL;

-- Actualizar restricción de tipo de visibilidad
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_visibility_level_check;
ALTER TABLE posts ADD CONSTRAINT posts_visibility_level_check CHECK (visibility_level IN ('todos', 'seguidores', 'circulo'));

-- Restricción de integridad: si la visibilidad es 'circulo', circle_id debe existir.
ALTER TABLE posts ADD CONSTRAINT check_post_circle_visibility 
    CHECK ((visibility_level = 'circulo' AND circle_id IS NOT NULL) OR (visibility_level <> 'circulo'));

-- 6. Índices de Alto Rendimiento
-- Índices B-Tree en llaves foráneas y combinaciones de búsqueda frecuentes
CREATE INDEX idx_user_relationships_following ON user_relationships(following_id);
CREATE INDEX idx_follower_circle_membership_follower ON follower_circle_membership(follower_id);
CREATE INDEX idx_posts_visibility_circle ON posts(visibility_level, circle_id) WHERE circle_id IS NOT NULL;
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Índice GIN en intereses de perfiles para búsquedas eficientes por tags
CREATE INDEX IF NOT EXISTS idx_profiles_interests_gin ON profiles USING GIN (interests);

-- 7. Configuración de RLS (Row Level Security)
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE follower_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follower_circle_membership ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para user_relationships
CREATE POLICY "Lectura libre de relaciones" ON user_relationships
    FOR SELECT USING (true);

CREATE POLICY "Gestión propia de relaciones" ON user_relationships
    FOR ALL USING (auth.uid() = follower_id);

-- Políticas de RLS para follower_circles
CREATE POLICY "Lectura propia de circulos" ON follower_circles
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Gestión propia de circulos" ON follower_circles
    FOR ALL USING (auth.uid() = owner_id);

-- Políticas de RLS para follower_circle_membership
CREATE POLICY "Lectura de membresias propia o del creador" ON follower_circle_membership
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = owner_id);

CREATE POLICY "Gestión de membresias por el creador" ON follower_circle_membership
    FOR ALL USING (auth.uid() = owner_id);

-- Políticas de RLS para posts actualizadas
DROP POLICY IF EXISTS "Posts lectura selectiva" ON posts;
CREATE POLICY "Posts lectura selectiva" ON posts FOR SELECT USING (
    -- Caso 1: El post es público
    visibility_level = 'todos'
    -- Caso 2: El lector es el autor
    OR author_id = auth.uid()
    -- Caso 3: El post es exclusivo de seguidores y el lector sigue al autor
    OR (
        visibility_level = 'seguidores' 
        AND EXISTS (
            SELECT 1 FROM user_relationships 
            WHERE follower_id = auth.uid() AND following_id = posts.author_id
        )
    )
    -- Caso 4: El post es restringido a un círculo y el lector es miembro
    OR (
        visibility_level = 'circulo' 
        AND EXISTS (
            SELECT 1 FROM follower_circle_membership 
            WHERE follower_id = auth.uid() AND circle_id = posts.circle_id
        )
    )
    -- Caso 5: El post pertenece a un grupo del cual el lector es miembro activo
    OR (
        group_id IS NOT NULL 
        AND EXISTS (
            SELECT 1 FROM memberships m 
            WHERE m.group_id = posts.group_id AND m.user_id = auth.uid() AND m.status = 'active'
        )
    )
);
```

---

## 3. Contratos de Datos (TypeScript)

Los siguientes tipos se actualizarán en `src/types/handyBet.ts`:

```typescript
export type VisibilityLevel = 'todos' | 'seguidores' | 'circulo';

export interface UserRelationship {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface FollowerCircle {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
}

export interface FollowerCircleMembership {
  circle_id: string;
  follower_id: string;
  owner_id: string;
  created_at: string;
}

// Extensión del tipo Post en el frontend
export interface Post {
  id: string;
  author_id: string;
  author?: {
    id: string;
    full_name: string;
    avatar_url?: string | null;
  };
  group_id: string | null;
  group?: {
    id: string;
    name: string;
  } | null;
  content: string;
  media_url?: string | null;
  media_type?: 'photo' | 'video' | null;
  visibility_level: VisibilityLevel;
  circle_id?: string | null; // Círculo específico si aplica
  post_type: PostType;
  payment_status: PaymentStatus;
  created_at: string;
}
```

---

## 4. Consultas CTE Eficientes (Ejemplo de Feed)

Para obtener el feed de publicaciones visibles para el usuario actual utilizando una consulta CTE optimizada, se implementa la siguiente estructura en el backend/servicio:

```sql
WITH 
-- 1. Obtener la lista de perfiles que el usuario sigue
user_following AS (
    SELECT following_id 
    FROM user_relationships 
    WHERE follower_id = :current_user_id
),
-- 2. Obtener los IDs de los círculos en los que el usuario es miembro
user_circle_memberships AS (
    SELECT circle_id 
    FROM follower_circle_membership 
    WHERE follower_id = :current_user_id
),
-- 3. Obtener los IDs de los grupos donde es miembro activo
user_group_memberships AS (
    SELECT group_id 
    FROM memberships 
    WHERE user_id = :current_user_id AND status = 'active'
)
-- 4. Consulta final de posts combinando filtros por CTE
SELECT p.*, pr.full_name as author_name, pr.avatar_url as author_avatar
FROM posts p
LEFT JOIN profiles pr ON p.author_id = pr.id
WHERE 
    p.author_id = :current_user_id -- Posts propios
    OR p.visibility_level = 'todos' -- Posts públicos
    OR (p.visibility_level = 'seguidores' AND p.author_id IN (SELECT following_id FROM user_following)) -- Posts de seguidos
    OR (p.visibility_level = 'circulo' AND p.circle_id IN (SELECT circle_id FROM user_circle_memberships)) -- Posts de círculos a los que pertenezco
    OR (p.group_id IN (SELECT group_id FROM user_group_memberships)) -- Posts de grupos del usuario
ORDER BY p.created_at DESC;
```
