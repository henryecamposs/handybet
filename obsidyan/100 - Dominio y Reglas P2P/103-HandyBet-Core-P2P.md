---
id: 103
title: HandyBet Core — Especificación Técnica Maestra
category: 100 - Dominio y Reglas P2P
tags: [handybet, p2p, multi-wallet, supabase, rpc, arquitectura]
status: aprobado
date: 2026-07-20
---

# 103 — HandyBet Core P2P & Motor iGaming

Este documento define la base arquitectónica, las reglas de negocio, los contratos de datos en TypeScript, el esquema relacional de Supabase y las interfaces visuales del ecosistema **HandyBet**.

---

## 1. Reglas de Negocio (Business Rules)

### 1.1 Perfiles e Intereses (RN-PF)
* **RN-PF-01 (Perfil Social Unidireccional):** Todo perfil registra un alias único (`@username`), nombre completo, avatar, biografía y lista de intereses seleccionados. Las conexiones sociales son unidireccionales (Seguidores) y soportan visibilidad granular mediante Círculos Privados.
* **RN-PF-02 (Privacidad Guest):** Los usuarios no autenticados (`guests`) solo pueden consultar feeds públicos y perfiles públicos. No pueden enviar comentarios, publicar multimedia ni interactuar con billeteras.

### 1.2 Estructura de Canales y Grupos (RN-CH)
* **RN-CH-01 (Agencias / Canales):** Un Canal actúa como una organización matriz (ej. "Agencia La Imaginaria"). Cada canal alberga múltiples grupos con categorías rígidas.
* **RN-CH-02 (Tipos de Grupos):**
  * `apuestas`: Simulador de jugadas, generación de QR y monederos aislados por agencia.
  * `pronosticos`: Contenido premium y combinaciones bloqueadas bajo suscripción.
  * `publicidad`: Anuncios orientados con redirección comercial.
  * `compartir_media`: Galería multimedia (imágenes y clips <30s) con barreras de pago P2P.

### 1.3 Motor de Apuestas & Multi-Wallet Aislado (RN-BT)
* **RN-BT-01 (Billeteras Aisladas - Multi-Wallet):** Cada usuario posee un monedero independiente por Grupo/Agencia. El saldo del Grupo A solo se usa para validar jugadas dirigidas al Grupo A.
* **RN-BT-02 (Matriz & Código QR):** Las jugadas se empaquetan en un formato comprimido `[ID-Grupo]-[ID-Apuesta]` (ej. `1234-123456`) renderizable como código QR.
* **RN-BT-03 (Seguridad Financiera Supabase):** Prohibidas las mutaciones directas `INSERT/UPDATE` desde cliente sobre la tabla `wallets`. Todas las transacciones se realizan vía funciones RPC con `SECURITY DEFINER`.

---

## 2. Contratos de Datos (TypeScript)

```typescript
export type HandyBetRole = 'player' | 'cashier' | 'company_owner' | 'admin';
export type HandyBetGroupType = 'apuestas' | 'pronosticos' | 'publicidad' | 'compartir_media';
export type HandyBetBetStatus = 'pendiente' | 'confirmada' | 'ganadora' | 'perdedora' | 'cobrada';

export interface Profile {
  id: string;
  username: string; // @handle
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: HandyBetRole;
  interests: string[];
  created_at: string;
}

export interface Group {
  id: string;
  channel_id: string;
  short_code: string;
  name: string;
  type: HandyBetGroupType;
  config: Record<string, any>;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  group_id: string;
  balance: number;
  created_at: string;
}

export interface Bet {
  id: string;
  group_id: string;
  user_id: string;
  bet_code: string; // ej: 1234-123456
  bet_data: {
    lotteryId: string;
    schedule: string;
    gameType: string;
    selections: Array<{ number: string; multiplier: number }>;
    totalAmount: number;
  };
  amount: number;
  potential_prize: number;
  status: HandyBetBetStatus;
  processed_by?: string;
  created_at: string;
}
```

---

## 3. Base de Datos (Supabase PostgreSQL & Security RPC)

```sql
-- Tablas Principales
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'player',
    interests TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID NOT NULL,
    balance NUMERIC(15, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

-- RLS: Seguridad estricta
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura de balance propio" ON public.wallets
    FOR SELECT USING (auth.uid() = user_id);

-- RPC con SECURITY DEFINER para debitar saldo de apuestas de forma segura
CREATE OR REPLACE FUNCTION rpc_place_handybet_bet(
    p_group_id UUID,
    p_bet_code TEXT,
    p_bet_data JSONB,
    p_amount NUMERIC
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_wallet_id UUID;
    v_current_balance NUMERIC;
    v_bet_id UUID;
BEGIN
    -- Verificar balance del monedero del grupo
    SELECT id, balance INTO v_wallet_id, v_current_balance
    FROM public.wallets
    WHERE user_id = auth.uid() AND group_id = p_group_id
    FOR UPDATE;

    IF v_current_balance IS NULL OR v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Saldo insuficiente en el monedero del grupo.';
    END IF;

    -- Descontar saldo de forma atómica
    UPDATE public.wallets
    SET balance = balance - p_amount
    WHERE id = v_wallet_id;

    -- Registrar la apuesta
    INSERT INTO public.bets (group_id, user_id, bet_code, bet_data, amount, status)
    VALUES (p_group_id, auth.uid(), p_bet_code, p_bet_data, p_amount, 'pendiente')
    RETURNING id INTO v_bet_id;

    RETURN v_bet_id;
END;
$$;
```
