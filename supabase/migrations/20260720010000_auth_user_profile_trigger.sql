-- ============================================================================
-- AUTOMATIC AUTH USER TO PUBLIC PROFILE LINKING TRIGGER
-- ============================================================================
-- Este script crea una función y disparador (Trigger) en PostgreSQL que vincula
-- automáticamente cada nuevo registro en auth.users (vía Email o Google OAuth)
-- con la tabla public.profiles de HandyBet.
-- ============================================================================

-- 1. Función manejadora con SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_avatar_url TEXT;
BEGIN
  -- Extraer o generar username único
  v_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'preferred_username',
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 4)
  );

  -- Extraer nombre completo
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    SPLIT_PART(NEW.email, '@', 1)
  );

  -- Extraer URL de avatar
  v_avatar_url := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    'https://i.pravatar.cc/150?u=' || v_username
  );

  -- Insertar registro en public.profiles
  INSERT INTO public.profiles (
    id,
    username,
    full_name,
    avatar_url,
    email,
    role,
    interests,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    v_username,
    v_full_name,
    v_avatar_url,
    NEW.email,
    'player',
    '{"apuestas"}'::TEXT[],
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(public.profiles.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url),
    updated_at = NOW();

  -- Inicializar monedero de bienveida (Wallet principal)
  INSERT INTO public.wallets (user_id, group_id, balance)
  SELECT NEW.id, g.id, 100.00
  FROM public.groups g
  LIMIT 1
  ON CONFLICT (user_id, group_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- 2. Disparador en la tabla auth.users de Supabase
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
