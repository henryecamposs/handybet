-- ============================================================================
-- HANDYBET MASTER RELATIONAL DATABASE SCHEMA & MIGRATION SCRIPT
-- ============================================================================
-- Este script realiza la reestructuración completa de la base de datos de HandyBet.
-- Incluye: Limpieza inicial, ENUMs, Tablas Relacionales, Campos JSONB dinámicos,
-- Índices de alto rendimiento (GIN / Trigram), Vistas, RLS y Funciones RPC Complejas.
-- ============================================================================

-- 1. LIMPIEZA INICIAL DEL ESQUEMA
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- 2. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 3. TIPOS ENUM DE DOMINIO
CREATE TYPE public.handybet_role AS ENUM ('player', 'cashier', 'company_owner', 'admin');
CREATE TYPE public.handybet_group_type AS ENUM ('apuestas', 'pronosticos', 'publicidad', 'compartir_media');
CREATE TYPE public.handybet_bet_status AS ENUM ('pendiente', 'confirmada', 'ganadora', 'perdedora', 'cobrada');
CREATE TYPE public.handybet_tx_type AS ENUM ('deposito', 'retiro', 'debito_apuesta', 'credito_premio', 'compra_suscripcion');
CREATE TYPE public.handybet_tx_status AS ENUM ('pendiente', 'aprobado', 'rechazado');
CREATE TYPE public.visibility_level AS ENUM ('todos', 'seguidores', 'circulo');
CREATE TYPE public.post_type AS ENUM ('regular', 'advertisement');
CREATE TYPE public.payment_status AS ENUM ('none_required', 'pendiente_pago', 'pagado');
CREATE TYPE public.membership_status AS ENUM ('onboarding_pending', 'active', 'blocked');
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'video', 'bet_share', 'system');

-- 4. TABLAS PRINCIPALES DEL SISTEMA

-- 4.1. Perfiles de Usuario (vínculo con auth.users de Supabase)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    bio TEXT,
    email TEXT,
    birth_date DATE,
    phone_whatsapp TEXT,
    address TEXT,
    role public.handybet_role NOT NULL DEFAULT 'player',
    interests TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferred_group_ids UUID[] NOT NULL DEFAULT '{}'::UUID[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.2. Canales (Empresas matrices / Agencias)
CREATE TABLE public.channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    is_18_plus BOOLEAN NOT NULL DEFAULT FALSE,
    target_audience TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    interests TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    avatar_url TEXT,
    cover_url TEXT,
    plans JSONB NOT NULL DEFAULT '[]'::jsonb,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.3. Grupos (Salas autónomas o dependientes de Canales)
CREATE TABLE public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    type public.handybet_group_type NOT NULL DEFAULT 'apuestas',
    tags TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    configured_bots JSONB NOT NULL DEFAULT '[]'::jsonb,
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    settings JSONB NOT NULL DEFAULT '{"wallet_type": "mixed", "allows_recharge": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.4. Membresías en Grupos
CREATE TABLE public.memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id TEXT,
    status public.membership_status NOT NULL DEFAULT 'active',
    onboarding_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- 4.5. Monederos (Wallets aisladas por usuario y grupo)
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0.00),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

-- 4.6. Apuestas (Bets)
CREATE TABLE public.bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    bet_code VARCHAR(20) UNIQUE NOT NULL,
    bet_data JSONB NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0.00),
    potential_prize NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (potential_prize >= 0.00),
    status public.handybet_bet_status NOT NULL DEFAULT 'pendiente',
    ticket_number TEXT,
    payment_proof_url TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.7. Historial de Transacciones Financieras (Ledger)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    type public.handybet_tx_type NOT NULL,
    status public.handybet_tx_status NOT NULL DEFAULT 'pendiente',
    reference_code TEXT,
    receipt_image_url TEXT,
    processed_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.8. Relaciones Sociales Unidireccionales (Seguidores)
CREATE TABLE public.user_relationships (
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

-- 4.9. Círculos Privados de Seguidores
CREATE TABLE public.follower_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.follower_circle_memberships (
    circle_id UUID NOT NULL REFERENCES public.follower_circles(id) ON DELETE CASCADE,
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (circle_id, follower_id)
);

-- 4.10. Muro de Publicaciones (Posts)
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.groups(id) ON DELETE SET NULL,
    channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    media_type TEXT CHECK (media_type IN ('photo', 'video')),
    media_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    visibility_level public.visibility_level NOT NULL DEFAULT 'todos',
    circle_id UUID REFERENCES public.follower_circles(id) ON DELETE SET NULL,
    post_type public.post_type NOT NULL DEFAULT 'regular',
    payment_status public.payment_status NOT NULL DEFAULT 'none_required',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.11. Comentarios de Publicaciones
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.12. Bóveda Multimedia (Media Vault Items)
CREATE TABLE public.media_vault_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
    plan_id TEXT,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
    storage_url TEXT NOT NULL,
    preview_url TEXT,
    media_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4.13. SISTEMA DE MENSAJERÍA EFICIENTE DE ALTO RENDIMIENTO
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    is_group_chat BOOLEAN NOT NULL DEFAULT FALSE,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.conversation_participants (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    unread_count INT NOT NULL DEFAULT 0 CHECK (unread_count >= 0),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type public.message_type NOT NULL DEFAULT 'text',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 5. ÍNDICES DE ALTO RENDIMIENTO (OPTIMIZACIÓN DE CONSULTAS)
-- ============================================================================

-- B-Tree Indexes para FK y ordenamientos frecuentes
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_channels_owner ON public.channels(owner_id);
CREATE INDEX idx_groups_channel ON public.groups(channel_id);
CREATE INDEX idx_memberships_user ON public.memberships(user_id);
CREATE INDEX idx_memberships_group ON public.memberships(group_id);
CREATE INDEX idx_wallets_user_group ON public.wallets(user_id, group_id);
CREATE INDEX idx_bets_user_group ON public.bets(user_id, group_id);
CREATE INDEX idx_bets_status ON public.bets(status);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_group ON public.posts(group_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_user_relationships_following ON public.user_relationships(following_id);

-- GIN Indexes para arrays de tags e intereses (búsqueda ultra rápida)
CREATE INDEX idx_profiles_interests_gin ON public.profiles USING GIN(interests);
CREATE INDEX idx_channels_interests_gin ON public.channels USING GIN(interests);
CREATE INDEX idx_groups_tags_gin ON public.groups USING GIN(tags);

-- Trigram Indexes para búsqueda aproximada de texto
CREATE INDEX idx_profiles_username_trgm ON public.profiles USING GIN(username gin_trgm_ops);
CREATE INDEX idx_groups_name_trgm ON public.groups USING GIN(name gin_trgm_ops);

-- ============================================================================
-- 6. VISTAS DE RENDIMIENTO
-- ============================================================================

-- Vista pre-compilada del Feed Principal
CREATE OR REPLACE VIEW public.view_user_feed AS
SELECT 
    p.id AS post_id,
    p.author_id,
    prof.username AS author_username,
    prof.full_name AS author_full_name,
    prof.avatar_url AS author_avatar_url,
    p.group_id,
    g.name AS group_name,
    p.channel_id,
    c.name AS channel_name,
    p.content,
    p.media_url,
    p.media_type,
    p.visibility_level,
    p.circle_id,
    p.post_type,
    p.payment_status,
    p.created_at,
    (SELECT COUNT(*) FROM public.post_comments pc WHERE pc.post_id = p.id) AS comments_count
FROM public.posts p
JOIN public.profiles prof ON p.author_id = prof.id
LEFT JOIN public.groups g ON p.group_id = g.id
LEFT JOIN public.channels c ON p.channel_id = c.id;

-- ============================================================================
-- 7. FUNCIONES RPC COMPLEJAS & PROCEDIMIENTOS ALMACENADOS
-- ============================================================================

-- 7.1. Mutación Financiera Segura de Apuestas (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.rpc_place_handybet_bet(
    p_group_id UUID,
    p_bet_code TEXT,
    p_bet_data JSONB,
    p_amount NUMERIC
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_wallet_id UUID;
    v_current_balance NUMERIC;
    v_bet_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado.';
    END IF;

    -- Obtener y bloquear la wallet específica del grupo
    SELECT id, balance INTO v_wallet_id, v_current_balance
    FROM public.wallets
    WHERE user_id = v_user_id AND group_id = p_group_id
    FOR UPDATE;

    IF v_wallet_id IS NULL THEN
        RAISE EXCEPTION 'No existe monedero registrado para este grupo.';
    END IF;

    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente en el monedero del grupo.';
    END IF;

    -- Debit balance
    UPDATE public.wallets
    SET balance = balance - p_amount,
        updated_at = NOW()
    WHERE id = v_wallet_id;

    -- Crear la apuesta
    INSERT INTO public.bets (group_id, user_id, bet_code, bet_data, amount, status)
    VALUES (p_group_id, v_user_id, p_bet_code, p_bet_data, p_amount, 'pendiente')
    RETURNING id INTO v_bet_id;

    -- Registrar la transacción en el Ledger
    INSERT INTO public.transactions (wallet_id, amount, type, status, reference_code)
    VALUES (v_wallet_id, p_amount, 'debito_apuesta', 'aprobado', p_bet_code);

    RETURN v_bet_id;
END;
$$;

-- 7.2. Algoritmo Inteligente de Sugerencia de Usuarios
CREATE OR REPLACE FUNCTION public.rpc_get_suggested_users(
    p_user_id UUID,
    p_limit INT DEFAULT 10
) RETURNS TABLE (
    suggested_id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    common_interests_count INT,
    mutual_groups_count INT,
    recommendation_score INT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    WITH target_user AS (
        SELECT interests FROM public.profiles WHERE id = p_user_id
    ),
    target_groups AS (
        SELECT group_id FROM public.memberships WHERE user_id = p_user_id
    )
    SELECT 
        p.id AS suggested_id,
        p.username,
        p.full_name,
        p.avatar_url,
        (
            SELECT CARDINALITY(ARRAY(
                SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(tu.interests)
            ))
            FROM target_user tu
        )::INT AS common_interests_count,
        (
            SELECT COUNT(*)::INT 
            FROM public.memberships m 
            WHERE m.user_id = p.id AND m.group_id IN (SELECT group_id FROM target_groups)
        ) AS mutual_groups_count,
        (
            (SELECT CARDINALITY(ARRAY(
                SELECT UNNEST(p.interests) INTERSECT SELECT UNNEST(tu.interests)
            )) FROM target_user tu) * 2 +
            (SELECT COUNT(*)::INT FROM public.memberships m WHERE m.user_id = p.id AND m.group_id IN (SELECT group_id FROM target_groups)) * 3
        )::INT AS recommendation_score
    FROM public.profiles p
    WHERE p.id <> p_user_id
      AND p.id NOT IN (SELECT following_id FROM public.user_relationships WHERE follower_id = p_user_id)
    ORDER BY recommendation_score DESC, p.created_at DESC
    LIMIT p_limit;
END;
$$;

-- 7.3. Envío de Mensaje y Actualización Cruzada de Conversación
CREATE OR REPLACE FUNCTION public.rpc_send_message(
    p_conversation_id UUID,
    p_content TEXT,
    p_message_type public.message_type DEFAULT 'text',
    p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sender_id UUID := auth.uid();
    v_message_id UUID;
BEGIN
    IF v_sender_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado.';
    END IF;

    -- Insertar mensaje
    INSERT INTO public.messages (conversation_id, sender_id, content, message_type, metadata)
    VALUES (p_conversation_id, v_sender_id, p_content, p_message_type, p_metadata)
    RETURNING id INTO v_message_id;

    -- Actualizar fecha del último mensaje en la conversación
    UPDATE public.conversations
    SET last_message_at = NOW()
    WHERE id = p_conversation_id;

    -- Incrementar contador de no leídos para los demás participantes
    UPDATE public.conversation_participants
    SET unread_count = unread_count + 1
    WHERE conversation_id = p_conversation_id AND user_id <> v_sender_id;

    RETURN v_message_id;
END;
$$;

-- 7.4. Toggle Seguimiento Unidireccional
CREATE OR REPLACE FUNCTION public.rpc_toggle_follow(
    p_target_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_follower_id UUID := auth.uid();
    v_is_following BOOLEAN;
BEGIN
    IF v_follower_id IS NULL OR v_follower_id = p_target_id THEN
        RETURN FALSE;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.user_relationships 
        WHERE follower_id = v_follower_id AND following_id = p_target_id
    ) INTO v_is_following;

    IF v_is_following THEN
        DELETE FROM public.user_relationships 
        WHERE follower_id = v_follower_id AND following_id = p_target_id;
        RETURN FALSE;
    ELSE
        INSERT INTO public.user_relationships (follower_id, following_id)
        VALUES (v_follower_id, p_target_id);
        RETURN TRUE;
    END IF;
END;
$$;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Perfiles
CREATE POLICY "Perfiles lecturas públicas" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Perfil actualización propia" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas de Monederos (Wallets)
CREATE POLICY "Lectura de wallet propia" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- Políticas de Apuestas
CREATE POLICY "Lectura apuestas propias" ON public.bets FOR SELECT USING (auth.uid() = user_id);

-- Políticas de Posts
CREATE POLICY "Lectura posts públicos y seguidos" ON public.posts FOR SELECT USING (
    visibility_level = 'todos'
    OR author_id = auth.uid()
    OR (visibility_level = 'seguidores' AND EXISTS (
        SELECT 1 FROM public.user_relationships WHERE follower_id = auth.uid() AND following_id = author_id
    ))
);
CREATE POLICY "Creación de posts autenticados" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Políticas de Mensajería
CREATE POLICY "Lectura conversaciones propias" ON public.conversations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = id AND user_id = auth.uid())
);
CREATE POLICY "Lectura mensajes de conversación propia" ON public.messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.conversation_participants WHERE conversation_id = messages.conversation_id AND user_id = auth.uid())
);
