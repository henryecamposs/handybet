# ☁️ Guía de Despliegue de HandyBet en Cloudflare Pages

Esta guía detalla los métodos y configuraciones necesarias para desplegar la versión Web de HandyBet en **Cloudflare Pages**.

---

## 🎯 Resumen de Configuración

| Parámetro | Valor |
| :--- | :--- |
| **Framework Preset** | `None` / `Custom` |
| **Build Command** | `npm run build:web` |
| **Build Output Directory** | `dist` |
| **Root Directory** | `/` (raíz del repositorio) |
| **Node.js Version** | `>= 20.0.0` (recomendado: `20` o `22`) |

---

## 🛠️ Método 1: Despliegue Continuo con Git (Recomendado)

Cada vez que hagas un `git push origin main`, Cloudflare Pages compilará y desplegará automáticamente la web.

### Pasos en Cloudflare Dashboard:
1. Inicia sesión en el panel de Cloudflare: [dash.cloudflare.com](https://dash.cloudflare.com/).
2. Ve a **Workers & Pages** > **Create application** > pestaña **Pages** > **Connect to Git**.
3. Selecciona tu repositorio: `henryecamposs/handybet`.
4. En **Set up builds and deployments**:
   - **Project name:** `handybet` (o tu nombre preferido).
   - **Production branch:** `main`.
   - **Framework preset:** `None`.
   - **Build command:** `npm run build:web`.
   - **Build output directory:** `dist`.
5. En **Environment variables (Variables de entorno)**, añade las variables de Supabase:
   - `EXPO_PUBLIC_SUPABASE_URL`: Tu URL del proyecto Supabase (ejemplo: `https://xyzcompany.supabase.co`).
   - `EXPO_PUBLIC_SUPABASE_KEY`: Tu Anon Public Key de Supabase.
   - `NODE_VERSION`: `20`
6. Haz clic en **Save and Deploy**.

---

## ⚡ Método 2: Despliegue Directo desde Terminal (Wrangler CLI)

Puedes desplegar en 1 solo comando desde tu terminal local utilizando `wrangler` (sin necesidad de configurar Git en Cloudflare):

### 1. Iniciar sesión en Cloudflare (Solo la primera vez)
```bash
npx wrangler login
```

### 2. Compilar y Desplegar a Producción
```bash
npm run deploy:cloudflare
```
*Este comando ejecuta internamente `npm run build:web && npx wrangler pages deploy dist`.*

### 3. Previsualizar Localmente con el Entorno de Cloudflare
```bash
npm run preview:cloudflare
```

---

## 🧭 Enrutamiento SPA y Archivos de Control

Para asegurar que rutas profundas (ej: `/feed/search?id=...`, `/chat/grupo/123`, `/profile/edit`) y recargas de página (`F5`) funcionen perfectamente sin devolver error 404, se han configurado en la carpeta `public/`:

1. **`public/_redirects`**:
   ```
   /*    /index.html   200
   ```
   *Instruye a Cloudflare Pages a enviar todas las peticiones al motor SPA de Expo Router.*

2. **`public/_headers`**:
   Configura caché inmutable para los bundles estáticos generados en `_expo/static/` y cabeceras de seguridad HTTP (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).

3. **`wrangler.toml`**:
   Configura el nombre del proyecto y la carpeta de salida `dist` para despliegues instantáneos vía CLI.
