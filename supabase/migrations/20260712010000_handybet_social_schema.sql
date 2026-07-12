-- Migración para el núcleo de red social monetizada de HandyBet

-- 1. Extender perfiles para campos de identidad de WhatsApp
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_whatsapp VARCHAR(20);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS whatsapp_handle VARCHAR(50);

-- 2. Modificar la tabla de grupos existente para añadir propietario y nivel de visibilidad
ALTER TABLE groups ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES profiles(id) ON DELETE RESTRICT;
ALTER TABLE groups ADD COLUMN IF NOT EXISTS visibility_level VARCHAR(30) DEFAULT 'todos' CHECK (visibility_level IN (
    'todos', 'amigos', 'amigos_especificos', 'nadie', 'amigos_de_mis_amigos', 'amigos_de_mis_miembros'
));

-- 3. Tabla de Amistades (P2P)
CREATE TABLE IF NOT EXISTS friendships (
    user_id_1 UUID REFERENCES profiles(id) ON DELETE CASCADE,
    user_id_2 UUID REFERENCES profiles(id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted')) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id_1, user_id_2)
);

-- 4. Tabla de Planes de Acceso para Grupos
CREATE TABLE IF NOT EXISTS group_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(15, 2) DEFAULT 0.00 CHECK (price >= 0.00),
    billing_type VARCHAR(30) CHECK (billing_type IN (
        'pay_per_action', '24_hours', 'mensual', 'anual'
    )) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Reglas de Moderación y Ajustes del Grupo
CREATE TABLE IF NOT EXISTS group_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID UNIQUE REFERENCES groups(id) ON DELETE CASCADE,
    permitir_publicar_feeds BOOLEAN DEFAULT TRUE,
    permitir_publicar_publicidad BOOLEAN DEFAULT FALSE,
    terms_text TEXT,
    onboarding_questionnaire JSONB DEFAULT '{"questions": []}'::jsonb,
    pay_to_post_enabled BOOLEAN DEFAULT FALSE,
    pay_to_post_fee DECIMAL(15, 2) DEFAULT 0.00 CHECK (pay_to_post_fee >= 0.00)
);

-- 6. Tabla de Membresías y Respuestas Onboarding
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES group_plans(id) ON DELETE SET NULL,
    status VARCHAR(30) CHECK (status IN ('onboarding_pending', 'active', 'blocked')) DEFAULT 'onboarding_pending',
    onboarding_answers JSONB DEFAULT '{}'::jsonb,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (group_id, user_id)
);

-- 7. Tabla de Publicaciones (Muro)
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE, -- NULL si es personal
    content TEXT NOT NULL,
    media_url TEXT,
    media_type VARCHAR(20) CHECK (media_type IN ('photo', 'video')),
    visibility_level VARCHAR(30) CHECK (visibility_level IN (
        'todos', 'amigos', 'amigos_especificos', 'nadie', 'amigos_de_mis_amigos'
    )) DEFAULT 'todos',
    post_type VARCHAR(20) CHECK (post_type IN ('regular', 'advertisement')) DEFAULT 'regular',
    payment_status VARCHAR(30) CHECK (payment_status IN ('none_required', 'pendiente_pago', 'pagado')) DEFAULT 'none_required',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Extender tabla de Transacciones existente
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS sender_id UUID REFERENCES profiles(id) ON DELETE RESTRICT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receiver_id UUID REFERENCES profiles(id) ON DELETE RESTRICT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS group_id UUID REFERENCES groups(id) ON DELETE CASCADE;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(15, 2) DEFAULT 0.00;

-- 9. Habilitar RLS en nuevas tablas
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 10. Políticas RLS Básicas
CREATE POLICY "Friendships lectura propia" ON friendships FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);
CREATE POLICY "Friendships gestion propia" ON friendships FOR ALL USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);

CREATE POLICY "Group plans lectura publica" ON group_plans FOR SELECT USING (true);
CREATE POLICY "Group plans gestion owner" ON group_plans FOR ALL USING (
    EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
);

CREATE POLICY "Group rules lectura publica" ON group_rules FOR SELECT USING (true);
CREATE POLICY "Group rules gestion owner" ON group_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
);

CREATE POLICY "Memberships lectura publica" ON memberships FOR SELECT USING (true);
CREATE POLICY "Memberships gestion propia y owner" ON memberships FOR ALL USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM groups g WHERE g.id = group_id AND g.owner_id = auth.uid())
);

CREATE POLICY "Posts lectura selectiva" ON posts FOR SELECT USING (
    visibility_level = 'todos'
    OR author_id = auth.uid()
    OR (group_id IS NOT NULL AND EXISTS (SELECT 1 FROM memberships m WHERE m.group_id = posts.group_id AND m.user_id = auth.uid() AND m.status = 'active'))
);
CREATE POLICY "Posts escritura propia" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
