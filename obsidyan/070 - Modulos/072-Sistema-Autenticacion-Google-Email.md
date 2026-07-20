---
id: 072
title: Sistema de Autenticación Híbrida (Google OAuth + Email) & Triggers
category: 070 - Modulos
tags: [auth, google-oauth, supabase, trigger, rls, handybet]
status: aprobado
date: 2026-07-20
---

# 072 — Sistema de Autenticación, Registro y Recuperación de Usuarios

Define el flujo unificado de autenticación de **HandyBet**, integrando registro instantáneo con **Google OAuth 2.0**, autenticación por **Email y Contraseña**, restablecimiento de claves y sincronización atómica con la tabla `public.profiles` mediante Triggers de PostgreSQL.

---

## 1. Estrategia de Registro Recomendada

1. **Google OAuth 2.0 (1-Click Signup):** Método primario recomendado para eliminar la fricción de registro. Extrae el correo verificado, avatar (`picture`) y nombre completo directamente desde los metadatos de Google.
2. **Email + Contraseña:** Método secundario con validación de contraseña segura y flujo de recuperación vía correo electrónico (*Password Reset Mail*).

---

## 2. Vinculación Atómica en Supabase (`auth.users` -> `public.profiles`)

Cualquier registro generado en `auth.users` (vía Google o Email) desencadena el Trigger `on_auth_user_created`, el cual inserta de forma inmediata el perfil en `public.profiles` y crea el monedero inicial de bienvenida.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::text, 1, 4)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', 'https://i.pravatar.cc/150'),
    NEW.email,
    'player'
  )
  ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

  -- Billetera inicial de bienvenida
  INSERT INTO public.wallets (user_id, group_id, balance)
  SELECT NEW.id, g.id, 100.00 FROM public.groups g LIMIT 1
  ON CONFLICT (user_id, group_id) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 3. Servicios TypeScript (`authService.ts`)

- `signInWithGoogle()`: Inicia el flujo OAuth con el proveedor de Google.
- `signUpWithEmail(email, password, fullName, username)`: Registro por correo electrónico.
- `login(emailOrUsername, password)`: Inicio de sesión híbrido.
- `recoverPassword(email)`: Envío de enlace de restablecimiento.
- `updatePassword(newPassword)`: Modificación de clave.
- `updateUserProfile(userId, updates)`: Edición de campos extendidos del perfil.
