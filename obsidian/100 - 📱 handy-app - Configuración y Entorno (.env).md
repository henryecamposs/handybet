---
title: ⚙️ Configuración y Entorno (.env)
project: handy-app
tags: [entorno, configuración, variables, scripts, rutas-api]
type: configuración
---

# ⚙️ Configuración del Entorno, Rutas API y Variables (.env)

## 📌 Datos Extraídos del Proyecto
* **Categoría**: Aplicación Móvil / Web Universal (Expo / React Native)
* **Punto de Entrada**: `expo-router/entry`

### 🔑 Matriz de Variables de Entorno Detectadas

#### 📄 Archivo `.env`
| Variable | Valor (Sanitizado) | Estado |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://uhyhawddwpsowuzpyitf.supabase.co` | ✅ Presente |
| `EXPO_PUBLIC_SUPABASE_KEY` | `sb_p...d_--` | ✅ Presente |


#### 📄 Archivo `.env.production`
| Variable | Valor (Sanitizado) | Estado |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://uhyhawddwpsowuzpyitf.supabase.co` | ✅ Presente |
| `EXPO_PUBLIC_SUPABASE_KEY` | `sb_p...d_--` | ✅ Presente |


---

### 🌐 Configuración del Entorno y Rutas API Consumidas

#### 📡 Endpoints Base y Servicios Configurados
- **Supabase Backend Services**:
  - **URL Base**: `EXPO_PUBLIC_SUPABASE_URL` / `VITE_SUPABASE_URL`
  - **Anon Key**: `EXPO_PUBLIC_SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY`
  - **Servicios Integrados**: PostgreSQL, Auth, Realtime WebSockets, Storage RLS.
- **Pollinations AI API**:
  - **URL Base**: `https://pollinations.ai/p/` & `https://text.pollinations.ai/`
  - **Recursos**: Generación multimedia de imágenes, audio, video y completado de modelos LLM.
- **Pasarela / Gateways de Pago & Bancos**:
  - Rutas transaccionales de pago móvil, depósitos bancarios y gestión de saldo de billetera integradas mediante Supabase RPC / REST endpoints.

---

### 📜 Scripts de Ejecución (`package.json`)
- `npm run start`: `expo start`
- `npm run reset-project`: `node ./scripts/reset-project.js`
- `npm run android`: `expo start --android`
- `npm run ios`: `expo start --ios`
- `npm run web`: `expo start --web`
- `npm run lint`: `expo lint`

---
## 🤖 Análisis de la IA: Seguridad y Entornos
* **Registro de Variables de Entorno**: Se han escaneado dinámicamente 4 variables de entorno. Se aplica una máscara de protección a credenciales sensibles para prevenir filtraciones en la documentación.
* **Manejo de Rutas API**: La aplicación centraliza la conexión con APIs externas mediante clientes instanciados en `src/lib/` (ej. Supabase SDK) y hooks reactivos en `src/hooks/queries/`.
* **Aislamiento de Entornos**: Asegurar que los archivos con credenciales reales (`.env.local`) permanezcan ignorados por Git y que únicamente las plantillas (`.env.example`) sean versionadas.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
