---
title: 📡 Referencia de Endpoints y Servicios
project: handy-app
tags: [apis, servicios, supabase, persistencia]
type: api-referencia
---

# 📡 Referencia de Endpoints, Servicios y Persistencia

## 📌 Datos Extraídos del Proyecto

* **Backend as a Service (BaaS)**: Supabase (Auth, PostgreSQL, RLS, Realtime)
* **Gestión de Peticiones y Caché**: TanStack React Query v5

### 📁 Módulos de Servicios Detectados (`src/services/`):
- `src\services\analyticsService.ts`
- `src\services\authService.ts`
- `src\services\botFlowEngine.ts`
- `src\services\channelService.ts`
- `src\services\databaseService.ts`
- `src\services\feedService.ts`
- `src\services\genericBotEngine.ts`
- `src\services\groupMonetizationService.ts`
- `src\services\messagingService.ts`
- `src\services\recommendationService.ts`
- `src\services\socialService.ts`
- `src\services\storageService.ts`


---
## 🤖 Análisis de la IA: Capa de Datos y Persistencia
* **Estrategia de Caché**: El uso de React Query sobre Supabase permite invalidar datos selectivamente y evitar consultas innecesarias a la base de datos.
* **Recomendación**: Implementar políticas de Row Level Security (RLS) estrictas en Supabase para proteger las tablas de transacciones y saldos.

---
## 🔗 Referencias Relacionadas
[[000 - 📱 handy-app - Visión General|📱 Visión General]]
