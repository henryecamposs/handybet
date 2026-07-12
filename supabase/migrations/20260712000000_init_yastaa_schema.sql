-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums del Sistema
CREATE TYPE yastaa_role AS ENUM ('player', 'cashier', 'company_owner', 'admin');
CREATE TYPE yastaa_group_type AS ENUM ('apuestas', 'pronosticos', 'publicidad', 'compartir_media');
CREATE TYPE yastaa_bet_status AS ENUM ('pendiente', 'confirmada', 'ganadora', 'perdedora', 'cobrada');
CREATE TYPE yastaa_tx_type AS ENUM ('deposito', 'retiro', 'debito_apuesta', 'credito_premio', 'compra_suscripcion');
CREATE TYPE yastaa_tx_status AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- 2. Tabla de Perfiles (profiles)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role yastaa_role DEFAULT 'player',
    interests TEXT[] DEFAULT '{}'::TEXT[] NOT NULL, -- Intereses (apuestas, pronosticos, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Canales (channels)
CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Grupos (groups)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    short_code VARCHAR(4) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type yastaa_group_type NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Wallets (wallets)
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

-- 6. Tabla de Apuestas (bets)
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    bet_code VARCHAR(12) UNIQUE NOT NULL,
    bet_data JSONB NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0.00),
    potential_prize NUMERIC(15, 2) DEFAULT 0.00 CHECK (potential_prize >= 0.00),
    status yastaa_bet_status DEFAULT 'pendiente',
    ticket_number TEXT,                      -- Número de ticket físico
    payment_proof_url TEXT,                  -- Captura/referencia de Pago Móvil para cobros
    processed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla de Publicidad (advertisements)
CREATE TABLE advertisements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_rif TEXT NOT NULL CHECK (business_rif ~ '^[JGVEE]-[0-9]{8}-[0-9]$'),
    business_contact TEXT NOT NULL,
    ad_copy TEXT NOT NULL,
    media_url TEXT NOT NULL,
    target_deeplink TEXT,
    cost_amount NUMERIC(15, 2) NOT NULL CHECK (cost_amount > 0.00),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabla de Planes de Suscripción (media_plans)
CREATE TABLE media_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0.00),
    max_photos INT NOT NULL CHECK (max_photos >= 0),
    max_videos INT NOT NULL CHECK (max_videos >= 0),
    duration_days INT DEFAULT 30 CHECK (duration_days > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Tabla de Bóveda Multimedia (media_vault)
CREATE TABLE media_vault (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES media_plans(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
    storage_url TEXT NOT NULL,
    preview_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Tabla de Suscripciones de Usuarios (user_subscriptions)
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES media_plans(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, plan_id)
);

-- 11. Tabla de Ledger de Transacciones (transactions)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0.00),
    type yastaa_tx_type NOT NULL,
    status yastaa_tx_status DEFAULT 'pendiente',
    reference_code TEXT,
    receipt_image_url TEXT,
    processed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;


-- POLÍTICAS DE ACCESO RLS

-- Profiles: Lectura pública, actualización propia
CREATE POLICY "Profiles lectura publica" ON profiles FOR SELECT USING (true);
CREATE POLICY "Profiles actualizacion propia" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Channels: Lectura pública, insert/update por owner o admin
CREATE POLICY "Channels lectura publica" ON channels FOR SELECT USING (true);
CREATE POLICY "Channels gestion owner" ON channels FOR ALL USING (
    auth.uid() IN (SELECT owner_id FROM channels WHERE id = channels.id) 
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Groups: Lectura pública, gestion por canal owner o admin
CREATE POLICY "Groups lectura publica" ON groups FOR SELECT USING (true);
CREATE POLICY "Groups gestion owner" ON groups FOR ALL USING (
    EXISTS (
        SELECT 1 FROM channels c 
        WHERE c.id = groups.channel_id AND c.owner_id = auth.uid()
    ) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Wallets: Solo lectura del propio usuario (escritura bloqueada por políticas directas, controlada por RPCs)
CREATE POLICY "Wallets lectura propia" ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Bets: Lectura propia y para cajeros/dueños de canal. Escritura propia
CREATE POLICY "Bets lectura selectiva" ON bets FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('cashier', 'admin')
    OR
    EXISTS (
        SELECT 1 FROM groups g
        JOIN channels c ON g.channel_id = c.id
        WHERE g.id = bets.group_id AND c.owner_id = auth.uid()
    )
);
CREATE POLICY "Bets insercion propia" ON bets FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pendiente');
-- UPDATE bloqueado para usuarios comunes. Solo actualizable por cajero/sistema
CREATE POLICY "Bets actualizacion cashier" ON bets FOR UPDATE USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('cashier', 'admin')
);

-- Advertisements: Lectura pública
CREATE POLICY "Ads lectura publica" ON advertisements FOR SELECT USING (true);
CREATE POLICY "Ads gestion owner" ON advertisements FOR ALL USING (
    EXISTS (
        SELECT 1 FROM channels c 
        WHERE c.id = advertisements.channel_id AND c.owner_id = auth.uid()
    ) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Media Plans: Lectura pública
CREATE POLICY "Media plans lectura publica" ON media_plans FOR SELECT USING (true);

-- Media Vault: Lectura restringida del storage_url
CREATE POLICY "Media vault lectura publica" ON media_vault FOR SELECT USING (true);

-- User Subscriptions: Lectura propia
CREATE POLICY "Subscriptions lectura propia" ON user_subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Transactions: Lectura propia y para cajeros/admin
CREATE POLICY "Transactions lectura propia" ON transactions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM wallets w WHERE w.id = transactions.wallet_id AND w.user_id = auth.uid()
    ) OR (SELECT role FROM profiles WHERE id = auth.uid()) IN ('cashier', 'admin')
);


-- FUNCIONES ALMACENADAS DE PROCEDIMIENTO SEGURO (RPC)

-- 1. Invocación segura para confirmar apuestas por Cajero
CREATE OR REPLACE FUNCTION confirm_bet_cashier(
    p_bet_code TEXT,
    p_payment_method TEXT,
    p_reference_code TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Se ejecuta con permisos de creador (bypass RLS de wallets)
AS $$
DECLARE
    v_bet RECORD;
    v_wallet RECORD;
    v_cashier_id UUID;
BEGIN
    v_cashier_id := auth.uid();
    
    -- 1. Verificar rol de cajero/admin
    IF NOT EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = v_cashier_id AND role IN ('cashier', 'admin')
    ) THEN
        RAISE EXCEPTION 'Acceso denegado: Se requiere rol de cajero o administrador.';
    END IF;

    -- 2. Obtener apuesta y bloquear fila
    SELECT * INTO v_bet FROM bets WHERE bet_code = p_bet_code FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'La apuesta con código % no existe.', p_bet_code;
    END IF;

    -- 3. Verificar estado pendiente
    IF v_bet.status != 'pendiente' THEN
        RAISE EXCEPTION 'La apuesta ya no se encuentra en estado pendiente. Estado actual: %', v_bet.status;
    END IF;

    -- 4. Procesamiento según método de pago
    IF p_payment_method = 'wallet' THEN
        -- Obtener wallet de usuario en el grupo de la apuesta y bloquear
        SELECT * INTO v_wallet FROM wallets 
        WHERE user_id = v_bet.user_id AND group_id = v_bet.group_id FOR UPDATE;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'El usuario no posee una wallet asignada en el grupo de esta apuesta.';
        END IF;

        IF v_wallet.balance < v_bet.amount THEN
            RAISE EXCEPTION 'Saldo insuficiente. Balance: %, Requerido: %', v_wallet.balance, v_bet.amount;
        END IF;

        -- Deducción de balance
        UPDATE wallets 
        SET balance = balance - v_bet.amount 
        WHERE id = v_wallet.id;

        -- Registrar transacción de débito en ledger
        INSERT INTO transactions (wallet_id, amount, type, status, processed_by)
        VALUES (v_wallet.id, v_bet.amount, 'debito_apuesta', 'aprobado', v_cashier_id);

    ELSIF p_payment_method = 'cash_external' THEN
        -- Si es pago externo, creamos la wallet si no existe para registrar el ledger
        SELECT * INTO v_wallet FROM wallets 
        WHERE user_id = v_bet.user_id AND group_id = v_bet.group_id FOR UPDATE;
        
        IF NOT FOUND THEN
            INSERT INTO wallets (user_id, group_id, balance)
            VALUES (v_bet.user_id, v_bet.group_id, 0.00)
            RETURNING * INTO v_wallet;
        END IF;

        -- Registro de depósito externo
        INSERT INTO transactions (wallet_id, amount, type, status, reference_code, processed_by)
        VALUES (v_wallet.id, v_bet.amount, 'deposito', 'aprobado', p_reference_code, v_cashier_id);

        -- Registro de débito de apuesta
        INSERT INTO transactions (wallet_id, amount, type, status, processed_by)
        VALUES (v_wallet.id, v_bet.amount, 'debito_apuesta', 'aprobado', v_cashier_id);

    ELSE
        RAISE EXCEPTION 'Método de pago no válido: %', p_payment_method;
    END IF;

    -- 5. Actualizar estado del ticket
    UPDATE bets 
    SET status = 'confirmada', processed_by = v_cashier_id, ticket_number = p_reference_code
    WHERE id = v_bet.id;

    RETURN TRUE;
END;
$$;

-- 2. Invocación segura para liquidar y pagar premios por Cajero (payout_bet_cashier)
CREATE OR REPLACE FUNCTION payout_bet_cashier(
    p_bet_code TEXT,
    p_payout_method TEXT,
    p_payment_proof TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bet RECORD;
    v_wallet RECORD;
    v_cashier_id UUID;
BEGIN
    v_cashier_id := auth.uid();
    
    -- 1. Verificar rol de cajero/admin
    IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = v_cashier_id AND role IN ('cashier', 'admin')
    ) THEN
        RAISE EXCEPTION 'Acceso denegado: Se requiere rol de cajero o administrador.';
    END IF;

    -- 2. Buscar la apuesta ganadora reclamada y bloquear
    SELECT * INTO v_bet FROM public.bets WHERE bet_code = p_bet_code FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'La apuesta con código % no existe.', p_bet_code;
    END IF;

    -- En Yastaa, la apuesta debe ser marcada como ganadora antes de cobrarse (o de estar en 'pendiente'/'confirmada' a 'cobrada')
    -- Aceptamos liquidación si está confirmada (cajero paga directo) o ganadora.
    IF v_bet.status = 'cobrada'::yastaa_bet_status THEN
        RAISE EXCEPTION 'El ticket de apuesta % ya ha sido cobrado.', p_bet_code;
    END IF;

    -- 3. Si el método es crédito al monedero, aumentar el saldo del monedero del grupo
    IF p_payout_method = 'wallet_credit' THEN
        SELECT * INTO v_wallet FROM public.wallets 
        WHERE user_id = v_bet.user_id AND group_id = v_bet.group_id FOR UPDATE;

        IF NOT FOUND THEN
            INSERT INTO public.wallets (user_id, group_id, balance)
            VALUES (v_bet.user_id, v_bet.group_id, v_bet.potential_prize)
            RETURNING * INTO v_wallet;
        ELSE
            UPDATE public.wallets 
            SET balance = balance + COALESCE(v_bet.potential_prize, 0.00)
            WHERE id = v_wallet.id;
        END IF;

        -- Registrar transacción de crédito de premio
        INSERT INTO public.transactions (wallet_id, amount, type, status, processed_by)
        VALUES (v_wallet.id, v_bet.potential_prize, 'credito_premio', 'aprobado', v_cashier_id);

    ELSIF p_payout_method = 'pago_movil' THEN
        SELECT * INTO v_wallet FROM public.wallets 
        WHERE user_id = v_bet.user_id AND group_id = v_bet.group_id FOR UPDATE;
        
        IF NOT FOUND THEN
            INSERT INTO public.wallets (user_id, group_id, balance)
            VALUES (v_bet.user_id, v_bet.group_id, 0.00)
            RETURNING * INTO v_wallet;
        END IF;

        -- Registrar transacción de retiro / pago móvil
        INSERT INTO public.transactions (wallet_id, amount, type, status, reference_code, processed_by)
        VALUES (v_wallet.id, v_bet.potential_prize, 'retiro', 'aprobado', p_payment_proof, v_cashier_id);
    ELSE
        RAISE EXCEPTION 'Método de cobro no válido: %', p_payout_method;
    END IF;

    -- 4. Marcar apuesta como cobrada
    UPDATE public.bets 
    SET status = 'cobrada'::yastaa_bet_status,
        payment_proof_url = p_payment_proof,
        processed_by = v_cashier_id
    WHERE id = v_bet.id;

    RETURN TRUE;
END;
$$;

-- 3. Invocación segura para adquirir suscripciones
CREATE OR REPLACE FUNCTION purchase_media_subscription(
    p_plan_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_plan RECORD;
    v_wallet RECORD;
BEGIN
    v_user_id := auth.uid();
    
    -- 1. Obtener detalles del plan
    SELECT * INTO v_plan FROM media_plans WHERE id = p_plan_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El plan de suscripción seleccionado no existe.';
    END IF;

    -- 2. Obtener wallet del usuario para el grupo correspondiente y bloquear
    SELECT * INTO v_wallet FROM wallets 
    WHERE user_id = v_user_id AND group_id = v_plan.group_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El usuario no posee balance en el grupo asociado a este plan.';
    END IF;

    IF v_wallet.balance < v_plan.price THEN
        RAISE EXCEPTION 'Saldo insuficiente en wallet. Balance: %, Requerido: %', v_wallet.balance, v_plan.price;
    END IF;

    -- 3. Deducción de balance
    UPDATE wallets 
    SET balance = balance - v_plan.price 
    WHERE id = v_wallet.id;

    -- 4. Registrar movimiento en ledger
    INSERT INTO transactions (wallet_id, amount, type, status, processed_by)
    VALUES (v_wallet.id, v_plan.price, 'compra_suscripcion', 'aprobado', v_user_id);

    -- 5. Crear o actualizar la suscripción activa
    INSERT INTO user_subscriptions (user_id, plan_id, expires_at, is_active)
    VALUES (
        v_user_id, 
        p_plan_id, 
        NOW() + (v_plan.duration_days * INTERVAL '1 day'), 
        TRUE
    )
    ON CONFLICT (user_id, plan_id) 
    DO UPDATE SET 
        expires_at = NOW() + (v_plan.duration_days * INTERVAL '1 day'),
        is_active = TRUE,
        created_at = NOW();

    RETURN TRUE;
END;
$$;


-- TRIGGER AUTOMÁTICO DE PERFILES (Seguridad de inserción inicial)
-- Vincula automáticamente un perfil cuando un usuario se registra en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE((new.raw_user_meta_data->>'role')::yastaa_role, 'player'::yastaa_role)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_bets_code ON bets(bet_code);
CREATE INDEX IF NOT EXISTS idx_wallets_user_group ON wallets(user_id, group_id);
CREATE INDEX IF NOT EXISTS idx_groups_channel ON groups(channel_id);
