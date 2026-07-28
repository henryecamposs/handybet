# Especificación Técnica y Análisis Arquitectónico: Sistema de Chat Avanzado P2P, Grupos y Motor de Bots Adaptable

## 1. Visión General y Objetivos

El objetivo de esta arquitectura es definir un **Sistema de Chat Avanzado y de Alta Eficiencia** para la plataforma **HandyBet**, capaz de soportar:
1. **Mensajería Punto a Punto (P2P 1-a-1)** entre usuarios con encriptación lógica, estados de lectura y entrega.
2. **Salas y Grupos Multiusuario** con alta concurrencia, gestión de roles (Owner, Admin, Member, Bot).
3. **Mensajería Enriquecida Multimedia** (Texto, Imágenes, Notas de Voz / Audio, Videos, Emoticones y Fichas de Apuestas / Transacciones).
4. **Motor de Bots Genérico y Adaptable (Bot Flow Engine)**:
   - Activación mediante comandos en texto (ej. `@comprar`, `/ayuda`) o mediante **Botones Interactivos** en las burbujas de mensaje.
   - Ejecución mediante una **Máquina de Estados en Memoria / Persistida (State Machine)** que responde secuencialmente según el flujo programado (ej. Bot ERP de Ventas, Bot de Atención al Cliente, Bot de Sorteos).
   - **Modo Co-piloto Híbrido (Co-piloting)**: Permite que el dueño humano del chat y el Bot interactúen simultáneamente con el cliente sin interrumpir la secuencia de la máquina de estados.

---

## 2. Análisis Comparativo de Comunicación en Tiempo Real

Para garantizar máxima eficiencia, baja latencia y retención offline en Expo / React Native y Web, evaluamos tres enfoques:

| Criterio | Opción A: Polling HTTP / Rest (Corto/Largo) | Opción B: WebSockets Puros (Socket.io / ws Node.js) | Opción C: Supabase Realtime (Broadcast + Postgres Changes) ⭐ *(Recomendado)* |
| :--- | :--- | :--- | :--- |
| **Latencia** | Alta (> 1000ms) | Ultrabaja (< 50ms) | Muy baja (< 100ms) |
| **Escalabilidad** | Deficiente para grupos | Requiere clusterización Redis Pub/Sub propia | Gestionada automáticamente por cluster Erlang de Supabase |
| **Persistencia** | Manual | Manual (Requiere guardar en DB en cada evento) | Automática vía disparadores de base de datos / RPC |
| **Consumo de Batería/Datos** | Alto | Medio-Bajo | Bajo (Conexión única mantenida por WebSocket multiplexado) |
| **Offline-First / Cache** | Difícil | Complejo | Nativo con AsyncStorage / React Query |

### 🛠️ Estrategia Híbrida Recomendada:
- **Supabase Realtime Broadcast / Presence**: Para tipado en tiempo real ("escribiendo..."), estados en línea de usuarios y eventos efímeros del Bot.
- **Supabase Postgres Changes (INSERT en `messages`)**: Para recepción atómica de nuevos mensajes directos y de grupo.
- **RPC `rpc_send_chat_message`**: Disparador transaccional en PostgreSQL que valida RLS, actualiza contadores `unread_count`, actualiza `last_message_at` en una sola operación atómica e invoca el trigger asíncrono del Motor de Bot si el mensaje contiene un comando.

---

## 3. Modelo de Datos y Esquema Relacional (PostgreSQL)

```sql
-- ENUMs de Tipos de Mensajes y Modos de Bot
CREATE TYPE message_type_enum AS ENUM (
  'text', 'image', 'audio', 'video', 'file', 
  'bet_share', 'interactive_buttons', 'bot_command', 'system'
);

CREATE TYPE bot_execution_mode_enum AS ENUM (
  'disabled', 'bot_only', 'copilot_hybrid', 'human_takeover'
);

-- Tabla Principal de Conversaciones (P2P y Grupos)
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group', 'channel_room')),
  title VARCHAR(255),
  avatar_url TEXT,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  copilot_mode bot_execution_mode_enum DEFAULT 'copilot_hybrid',
  active_bot_id VARCHAR(100), -- ID del bot asignado (ej. 'sales_bot_v1')
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participantes de Conversaciones con Contador de No Leídos
CREATE TABLE public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'bot')),
  unread_count INT DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- Tabla Avanzada de Mensajes con Metadata Estructurada
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  content TEXT NOT NULL,
  media_url TEXT,
  audio_duration_seconds INT,
  metadata JSONB DEFAULT '{}'::jsonb, -- Bot buttons, bet IDs, payload
  reply_to_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_bot_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Estado de Sesión del Motor de Bot por Conversación
CREATE TABLE public.bot_session_states (
  conversation_id UUID PRIMARY KEY REFERENCES public.conversations(id) ON DELETE CASCADE,
  bot_id VARCHAR(100) NOT NULL,
  current_node_id VARCHAR(100) NOT NULL, -- Nodo actual en el grafo de flujo
  context_data JSONB DEFAULT '{}'::jsonb, -- Variables capturadas (ej: { item: 'VIP', amount: 50 })
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Contratos de Datos TypeScript

```typescript
export type MessageType = 
  | 'text' 
  | 'image' 
  | 'audio' 
  | 'video' 
  | 'file' 
  | 'bet_share' 
  | 'interactive_buttons' 
  | 'bot_command' 
  | 'system';

export type CopilotMode = 'disabled' | 'bot_only' | 'copilot_hybrid' | 'human_takeover';

export interface InteractiveButton {
  id: string;
  label: string;
  action_type: 'trigger_node' | 'open_link' | 'submit_command';
  payload: string; // ej: '@comprar_vip' o nodo 'node_payment_options'
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
}

export interface ChatMessagePayload {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  sender_avatar?: string;
  message_type: MessageType;
  content: string;
  media_url?: string;
  audio_duration_seconds?: number;
  buttons?: InteractiveButton[];
  metadata?: Record<string, any>;
  reply_to_message_id?: string;
  is_bot_generated?: boolean;
  created_at: string;
}

// -------------------------------------------------------------
// CONTRATO DEL MOTOR DE BOTS GENÉRICO (Bot Flow Schema)
// -------------------------------------------------------------

export interface BotFlowNode {
  id: string;
  message: string;
  media_url?: string;
  message_type?: MessageType;
  buttons?: InteractiveButton[];
  input_variable?: string; // Nombre de variable a guardar en contexto si espera texto
  next_node_id?: string;  // Siguiente nodo por defecto
}

export interface BotTrigger {
  command: string; // ej: '@comprar', '/ayuda', 'start'
  target_node_id: string;
}

export interface BotFlowDefinition {
  bot_id: string;
  name: string;
  description: string;
  initial_node_id: string;
  triggers: BotTrigger[];
  nodes: Record<string, BotFlowNode>; // Diccionario de Nodos indexed por node_id
}
```

---

## 5. Arquitectura del Motor de Bot Genérico (Bot Flow Engine)

### 5.1 Diagrama del Flujo de Interacción Co-Piloto (Bot + Humano)

```
 [Usuario / Cliente]
         │
         │  1. Envía mensaje o pulsa Botón "@comprar"
         ▼
 ┌───────────────────────────────────────────────────────────┐
 │ API / Realtime Disparador (rpc_send_chat_message)        │
 └─────────────────────────────┬─────────────────────────────┘
                               │
                2. Valida Modo Co-Piloto
                               │
         ┌─────────────────────┴─────────────────────┐
         ▼                                           ▼
┌──────────────────────────────┐           ┌──────────────────────────────┐
│ [Modo Bot_Only / Hybrid]     │           │ [Modo Human_Takeover]       │
│  Bot Engine evalúa comando   │           │  Notifica al Dueño Humano;   │
│  o nodo activo en memoria    │           │  El Bot permanece silenciado │
└──────────────┬───────────────┘           └──────────────────────────────┘
               │
               ├─────────────────────────────────────────┐
               ▼                                         ▼
 ┌───────────────────────────┐             ┌───────────────────────────┐
 │ Genera Mensaje de Bot con │             │ Dueño Humano puede        │
 │ Botones Intermediarios    │             │ intervenir en el chat     │
 └─────────────┬─────────────┘             │ sin destruir el estado    │
               │                           └───────────────────────────┘
               ▼
 ┌───────────────────────────────────────────────────────────┐
 │ Actualiza `bot_session_states` en DB & Emit via Realtime │
 └───────────────────────────────────────────────────────────┘
```

---

## 6. Endpoints, Funciones RPC y Canales Realtime

### 6.1 RPC de Envío de Mensaje Atómico (`rpc_send_chat_message`)
- **Parámetros**: `p_conversation_id`, `p_content`, `p_message_type`, `p_media_url`, `p_metadata`.
- **Efecto**:
  1. Inserta el registro en `messages`.
  2. Actualiza `last_message_text` y `last_message_at` en `conversations`.
  3. Incrementa `unread_count` para todos los participantes excepto el emisor.
  4. Retorna la fila del mensaje recién creado.

### 6.2 RPC de Transición de Nodo de Bot (`rpc_process_bot_step`)
- **Parámetros**: `p_conversation_id`, `p_input_text`, `p_button_payload`.
- **Efecto**:
  1. Recupera la definición del bot activo (`bot_id`) y el estado actual de `bot_session_states`.
  2. Evalúa si el texto coincide con un comando trigger (`@comprar`, `/start`) o si avanza al nodo definido por el `button_payload`.
  3. Guarda las variables capturadas en `context_data`.
  4. Ejecuta e inserta automáticamente el mensaje de respuesta con `is_bot_generated = true`.

---

## 7. Componentes Frontend (React Native / Expo)

1. **`ChatScreenContainer.tsx`**:
   - Manejo de lista virtualizada con scroll invertido (`inverted`).
   - Escucha de canal Realtime (`supabase.channel('chat_' + id)`).
2. **`ChatMessageItem.tsx`**:
   - Burbuja con estilos según emisor (Usuario, Co-Piloto Humano, Bot Assistant).
   - Soporte para audio player integrado (`expo-av`), visor de imágenes, y `InteractiveButtonsGroup`.
3. **`BotActionBar.tsx`**:
   - Selector de comandos rápidos (Pop-up desplegable al escribir `@` o `/`).
   - Botón de alternancia de modo Co-Piloto para el dueño del chat (Switch: Bot Activo / Intervención Humana).
4. **`AudioRecorderWidget.tsx`**:
   - Grabador de notas de voz con temporizador y vista previa con `expo-av`.

---

## 8. Hoja de Ruta e Implementación por Fases

- [x] **Fase 1: Especificación y Diseño de Datos** (Documento `.spec.md` redactado)
- [ ] **Fase 2: Migraciones SQL y RPCs** (Creación de tablas `messages`, `conversations`, `bot_session_states` y funciones RPC en Supabase)
- [ ] **Fase 3: Motor de Bot Genérico (Bot Flow Engine)** (Implementación de la clase `BotFlowEngine` en TypeScript)
- [ ] **Fase 4: Componentes UI de Chat & Multimedia** (Actualización de `ChatScreenContainer`, reproductor de audio y burbujas de botones)
- [ ] **Fase 5: Integración Realtime & Pruebas QA** (Suscripciones Postgres Changes y pruebas E2E con bots de prueba)
