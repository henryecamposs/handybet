---
title: ⚙️ Configuración y Entorno (.env)
project: handy-app
tags: [entorno, configuración, variables, scripts]
type: configuración
---

# ⚙️ Configuración del Entorno y Variables (.env)

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
* **Aislamiento de Entornos**: Asegurar que los archivos con credenciales reales (`.env.local`) permanezcan ignorados por Git y que únicamente las plantillas (`.env.example`) sean versionadas.
* **Optimización de Scripts**: Los comandos de ejecución cliente están bien alineados con las herramientas estándar del ecosistema.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
