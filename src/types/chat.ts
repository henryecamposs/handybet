/**
 * Tipos e Interfaces Maestras para el Sistema de Chat Avanzado y Motor de Bots en HandyBet
 */

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
  payload: string; // ej: '@comprar' o ID del nodo objetivo ('node_payment_methods')
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
}

export interface ChatMessage {
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

export interface ChatConversation {
  id: string;
  type: 'direct' | 'group' | 'channel_room';
  title?: string | null;
  avatar_url?: string | null;
  group_id?: string | null;
  last_message_text?: string | null;
  last_message_at: string;
  copilot_mode: CopilotMode;
  active_bot_id?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  unread_count?: number;
}

// -------------------------------------------------------------
// MOTOR DE BOTS ADAPTABLE (Bot Flow Definition & State Machine)
// -------------------------------------------------------------

export interface BotFlowNode {
  id: string;
  message: string;
  media_url?: string;
  message_type?: MessageType;
  buttons?: InteractiveButton[];
  input_variable?: string; // Nombre de variable a guardar si espera entrada de texto
  next_node_id?: string;  // Siguiente nodo automático
}

export interface BotTrigger {
  command: string; // ej: '@comprar', '/start', 'menu'
  target_node_id: string;
}

export interface BotFlowDefinition {
  bot_id: string;
  name: string;
  description: string;
  initial_node_id: string;
  triggers: BotTrigger[];
  nodes: Record<string, BotFlowNode>;
}

export interface BotSessionState {
  conversation_id: string;
  bot_id: string;
  current_node_id: string;
  context_data: Record<string, any>;
  last_activity_at: string;
}
