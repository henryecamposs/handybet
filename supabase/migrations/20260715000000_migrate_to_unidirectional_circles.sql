-- Migración para modelo social unidireccional y círculos de confianza en HandyBet

-- 1. Eliminar políticas y tabla de amistades antigua
DROP POLICY IF EXISTS "Friendships lectura propia" ON friendships;
DROP POLICY IF EXISTS "Friendships gestion propia" ON friendships;
DROP TABLE IF EXISTS friendships;

-- 2. Crear tabla de Relaciones de Seguimiento (Unidireccional)
CREATE TABLE IF NOT EXISTS user_relationships (
    follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_following CHECK (follower_id <> following_id)
);

-- 3. Crear tabla de Círculos de Confianza
CREATE TABLE IF NOT EXISTS follower_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (owner_id, name)
);

-- Crear restricción única adicional para posibilitar clave foránea compuesta
ALTER TABLE follower_circles DROP CONSTRAINT IF EXISTS unique_circle_owner;
ALTER TABLE follower_circles ADD CONSTRAINT unique_circle_owner UNIQUE (id, owner_id);

-- 4. Crear tabla de Membresía en Círculos
CREATE TABLE IF NOT EXISTS follower_circle_membership (
    circle_id UUID NOT NULL,
    follower_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (circle_id, follower_id),
    
    -- FK Compuesta 1: Garantiza que el círculo pertenece al owner_id
    CONSTRAINT fk_circle FOREIGN KEY (circle_id, owner_id) 
        REFERENCES follower_circles(id, owner_id) ON DELETE CASCADE,
        
    -- FK Compuesta 2: Garantiza que el miembro sigue al dueño del círculo
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
ALTER TABLE posts DROP CONSTRAINT IF EXISTS check_post_circle_visibility;
ALTER TABLE posts ADD CONSTRAINT check_post_circle_visibility 
    CHECK ((visibility_level = 'circulo' AND circle_id IS NOT NULL) OR (visibility_level <> 'circulo'));

-- 6. Índices de Alto Rendimiento
CREATE INDEX IF NOT EXISTS idx_user_relationships_following ON user_relationships(following_id);
CREATE INDEX IF NOT EXISTS idx_follower_circle_membership_follower ON follower_circle_membership(follower_id);
CREATE INDEX IF NOT EXISTS idx_posts_visibility_circle ON posts(visibility_level, circle_id) WHERE circle_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);

-- Índice GIN en intereses de perfiles para búsquedas eficientes por tags
CREATE INDEX IF NOT EXISTS idx_profiles_interests_gin ON profiles USING GIN (interests);

-- 7. Configuración de RLS (Row Level Security)
ALTER TABLE user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE follower_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE follower_circle_membership ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para user_relationships
DROP POLICY IF EXISTS "Lectura libre de relaciones" ON user_relationships;
CREATE POLICY "Lectura libre de relaciones" ON user_relationships
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Gestión propia de relaciones" ON user_relationships;
CREATE POLICY "Gestión propia de relaciones" ON user_relationships
    FOR ALL USING (auth.uid() = follower_id);

-- Políticas de RLS para follower_circles;
DROP POLICY IF EXISTS "Lectura propia de circulos" ON follower_circles;
CREATE POLICY "Lectura propia de circulos" ON follower_circles
    FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Gestión propia de circulos" ON follower_circles;
CREATE POLICY "Gestión propia de circulos" ON follower_circles
    FOR ALL USING (auth.uid() = owner_id);

-- Políticas de RLS para follower_circle_membership
DROP POLICY IF EXISTS "Lectura de membresias propia o del creador" ON follower_circle_membership;
CREATE POLICY "Lectura de membresias propia o del creador" ON follower_circle_membership
    FOR SELECT USING (auth.uid() = follower_id OR auth.uid() = owner_id);

DROP POLICY IF EXISTS "Gestión de membresias por el creador" ON follower_circle_membership;
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
