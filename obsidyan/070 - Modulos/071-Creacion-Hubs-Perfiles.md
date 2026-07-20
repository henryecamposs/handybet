---
id: 071
title: Creación de Canales, Grupos y Bots Automatizados
category: 070 - Modulos
tags: [modulos, canales, grupos, bots, erp, ia, handybet]
status: aprobado
date: 2026-07-20
---

# 071 — Módulo de Creación de Canales, Grupos y Bots

Define las reglas de negocio, esquemas de datos e integración de **Bots Automatizados** en la creación de Canales (Empresas matrices) y Grupos autónomos en **HandyBet**.

---

## 1. Reglas de Negocio (Business Rules)

### 1.1 Canales (Agencias / Matrices)
* **Restricción de Edad (+18):** Canales con contenido de juegos de azar activa obligatoriamente `is_18_plus = true` y exige verificación de edad.
* **Target & Audiencia:** Clasificación estricta (*Apostadores*, *Creadores de Contenido*, *Noticias*, *General*, *Ventas*).

### 1.2 Grupos & Bots Automatizados
* **Configuración de Bots (`configured_bots`):**
  * `bot_sales`: Integración con base de datos/ERP para cotizaciones y catálogos automáticos.
  * `bot_lottery`: Consulta automática de resultados de sorteos y loterías en tiempo real.
  * `bot_ai_assistant`: Asistente IA para atención de preguntas frecuentes en la comunidad.

---

## 2. Contratos de Datos (TypeScript)

```typescript
export type TargetAudience = 'apostadores' | 'contenido' | 'noticias' | 'general' | 'ventas';
export type BotType = 'bot_sales' | 'bot_lottery' | 'bot_ai_assistant' | 'bot_welcome';

export interface BotConfig {
  id: string;
  type: BotType;
  name: string;
  description: string;
  is_enabled: boolean;
  settings?: Record<string, any>;
}

export interface ChannelCreationPayload {
  name: string;
  description: string;
  visibility: 'public' | 'private';
  is_18_plus: boolean;
  target_audience: TargetAudience[];
  interests: string[];
  avatar_url?: string;
  cover_url?: string;
}

export interface GroupCreationPayload {
  channel_id?: string | null;
  name: string;
  description: string;
  type: 'apuestas' | 'multimedia' | 'ventas' | 'social';
  tags: string[];
  configured_bots: BotConfig[];
  settings: {
    wallet_type: 'mixed' | 'direct_pay' | 'credit';
    allows_recharge: boolean;
  };
}
```
