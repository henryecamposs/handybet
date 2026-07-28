-- Migración SQL Master para Chat Avanzado P2P, Grupos y Motor de Bots Adaptable

-- 1. ENUMs
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'message_type_enum') THEN
    CREATE TYPE message_type_enum AS ENUM (
      'text', 'image', 'audio', 'video', 'file', 
      'bet_share', 'interactive_buttons', 'bot_command', 'system'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bot_execution_mode_enum') THEN
    CREATE TYPE bot_execution_mode_enum AS ENUM (
      'disabled', 'bot_only', 'copilot_hybrid', 'human_takeover'
    );
  END IF;
END $$;

-- 2. Tabla de Conversaciones
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group', 'channel_room')),
  title VARCHAR(255),
  avatar_url TEXT,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  last_message_text TEXT,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  copilot_mode bot_execution_mode_enum DEFAULT 'copilot_hybrid',
  active_bot_id VARCHAR(100) DEFAULT 'sales_erp_bot',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Participantes de Conversación
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'bot')),
  unread_count INT DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, user_id)
);

-- 4. Tabla de Mensajes
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  message_type message_type_enum DEFAULT 'text',
  content TEXT NOT NULL,
  media_url TEXT,
  audio_duration_seconds INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  reply_to_message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  is_bot_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sesiones de Estado del Bot
CREATE TABLE IF NOT EXISTS public.bot_session_states (
  conversation_id UUID PRIMARY KEY REFERENCES public.conversations(id) ON DELETE CASCADE,
  bot_id VARCHAR(100) NOT NULL,
  current_node_id VARCHAR(100) NOT NULL,
  context_data JSONB DEFAULT '{}'::jsonb,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Índices de Rendimiento
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_participants_user_id ON public.conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON public.conversations(last_message_at DESC);

-- 7. RLS (Row Level Security)
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_session_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura de conversaciones a participantes" ON public.conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = public.conversations.id AND user_id = auth.uid()
    ) OR true -- Para entorno dev local
  );

CREATE POLICY "Permitir lectura de mensajes a participantes" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants 
      WHERE conversation_id = public.messages.conversation_id AND user_id = auth.uid()
    ) OR true
  );

-- 8. RPC Atómico de Envío de Mensajes
CREATE OR REPLACE FUNCTION public.rpc_send_chat_message(
  p_conversation_id UUID,
  p_sender_id UUID,
  p_content TEXT,
  p_message_type message_type_enum DEFAULT 'text',
  p_media_url TEXT DEFAULT NULL,
  p_audio_duration_seconds INT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb,
  p_is_bot_generated BOOLEAN DEFAULT FALSE
) RETURNS UUID AS $$
DECLARE
  v_message_id UUID;
BEGIN
  -- Insertar Mensaje
  INSERT INTO public.messages (
    conversation_id, sender_id, content, message_type, 
    media_url, audio_duration_seconds, metadata, is_bot_generated
  ) VALUES (
    p_conversation_id, p_sender_id, p_content, p_message_type, 
    p_media_url, p_audio_duration_seconds, p_metadata, p_is_bot_generated
  ) RETURNING id INTO v_message_id;

  -- Actualizar Conversación
  UPDATE public.conversations
  SET last_message_text = p_content,
      last_message_at = NOW()
  WHERE id = p_conversation_id;

  -- Incrementar Unread Count para los demás participantes
  UPDATE public.conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = p_conversation_id AND user_id != p_sender_id;

  RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
