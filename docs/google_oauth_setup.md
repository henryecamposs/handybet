# Guía de Configuración Paso a Paso: Google OAuth 2.0 en Supabase & HandyBet

Esta guía detalla el procedimiento completo para configurar el inicio de sesión rápido con **Google OAuth 2.0** en el panel de **Supabase** y la consola de **Google Cloud Platform (GCP)** para tu aplicación **HandyBet**.

---

## 📋 Recomendación Arquitectónica de Registro

Para ofrecer la mejor experiencia de usuario en **HandyBet**, recomendamos implementar un **Esquema Híbrido de Autenticación**:

1. **Google OAuth 2.0 (Opción Recomendada / 1-Click Signup):**
   - **Ventajas:** Cero fricción de registro, verificación de correo instantánea (proporcionada por Google), importación automática de foto de perfil (`avatar_url`) y nombre completo.
   - **Casos de Uso:** Registro en 2 segundos desde web y dispositivos móviles.
2. **Email + Contraseña (Opción Tradicional):**
   - **Ventajas:** Acceso para usuarios sin cuenta de Google o con correos corporativos/privados.
   - **Seguridad:** Verificación por enlace mágico (*magic link*) o código de confirmación.

---

## 🛠 Paso 1: Configurar Proyecto en Google Cloud Console

1. Accede a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un nuevo proyecto o selecciona uno existente (ej. `HandyBet-Prod`).
3. Navega a **API y servicios > Pantalla de consentimiento de OAuth**:
   - Tipo de usuario: **Externo** (External).
   - Completa el nombre de la aplicación: `HandyBet`.
   - Correo electrónico de soporte y desarrollador: Tu correo corporativo.
   - Presiona **Guardar y continuar**.
4. En la pestaña **Permisos (Scopes)**, agrega los siguientes alcances (*scopes*):
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
5. Navega a **API y servicios > Credenciales**:
   - Presiona **Crear credenciales > ID de cliente de OAuth**.
   - Tipo de aplicación: **Aplicación web** (Web application).
   - Nombre: `Supabase Auth Client`.
   - **URIs de redireccionamiento autorizados:**
     Ingresa la URL de Callback de tu proyecto en Supabase:
     ```text
     https://<TU_REF_DE_PROYECTO_SUPABASE>.supabase.co/auth/v1/callback
     ```
6. Copia el **ID de cliente** (*Client ID*) y el **Secreto de cliente** (*Client Secret*).

---

## ⚡ Paso 2: Activar Google Provider en el Panel de Supabase

1. Inicia sesión en tu panel de [Supabase Dashboard](https://supabase.com/dashboard).
2. Selecciona tu proyecto **HandyBet**.
3. Navega en el menú lateral a **Authentication > Providers**.
4. Busca **Google** en la lista y activa el interruptor `Enable Google provider`.
5. Pega los valores obtenidos en el Paso 1:
   - **Client ID:** *(Pega tu ID de cliente de GCP)*
   - **Client Secret:** *(Pega tu secreto de cliente de GCP)*
6. Haz clic en **Save** (Guardar).

---

## 📱 Paso 3: Configurar Esquemas de Redirección para Expo / React Native

Para permitir que la aplicación móvil y web reciba el token de confirmación tras iniciar sesión con Google:

1. En el panel de Supabase, ve a **Authentication > URL Configuration**.
2. Agrega las siguientes URLs en la lista de **Redirect URLs**:
   ```text
   handyapp://auth/callback
   exp://localhost:8081/--/auth/callback
   http://localhost:8081
   ```

---

## 🔗 Paso 4: Vinculación Automática con `public.profiles`

Gracias a la migración SQL `20260720010000_auth_user_profile_trigger.sql`, el sistema cuenta con un Trigger en PostgreSQL que detecta automáticamente cuando un usuario se registra con Google:

```sql
-- Trigger automático que vincula auth.users con public.profiles
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Comportamiento Automático:
1. El usuario presiona **"Continuar con Google"**.
2. Supabase autentica las credenciales con Google y crea el registro en `auth.users`.
3. El Trigger de PostgreSQL extrae instantáneamente `name`, `picture` y `email` de los metadatos de Google y los guarda en `public.profiles`.
4. Se inicializa el monedero de bienvenida (`wallets`) con $100.00 de saldo promocional.

---

## 🚀 Paso 5: Probar el Inicio de Sesión en el Código

En tus componentes React (ej: `LoginScreen.tsx` o `CreateUserScreen.tsx`), invoca el método `authService.signInWithGoogle()`:

```tsx
import { authService } from '../services/authService';

async function handleGoogleLogin() {
  const { url, error } = await authService.signInWithGoogle();
  if (error) {
    alert('Error al conectar con Google: ' + error);
  } else if (url) {
    // Abrir ventana modal o navegador WebBrowser
    console.log('Navegando a Google OAuth:', url);
  }
}
```
