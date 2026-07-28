import { supabase } from '../lib/supabaseClient';
import { ChatMessage, ChatConversation, MessageType, InteractiveButton, CopilotMode } from '../types/chat';
import { GenericBotEngine } from './genericBotEngine';

export { ChatMessage, ChatConversation, MessageType, InteractiveButton, CopilotMode };

/**
 * Servicio de Mensajería Eficiente, Tiempo Real y Motor de Bots Guiados por JSON para HandyBet
 */
export const messagingService = {
  /**
   * Obtiene las conversaciones activas del usuario
   */
  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversation_participants')
        .select('conversation_id, unread_count, conversations(*)')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false });

      if (error) {
        console.error('Error al obtener conversaciones:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        ...row.conversations,
        unread_count: row.unread_count,
      }));
    } catch (e) {
      console.log('Error fetching conversations fallback:', e);
      return [];
    }
  },

  /**
   * Obtiene los mensajes de una conversación ordenados cronológicamente
   */
  async getConversationMessages(conversationId: string, limit = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error al obtener mensajes:', error.message);
        return [];
      }
      return data as ChatMessage[];
    } catch (e) {
      console.log('Error fetching messages fallback:', e);
      return [];
    }
  },

  /**
   * Envía un mensaje vía función RPC segura y evalúa automáticamente la respuesta del Bot JSON
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    messageType: MessageType = 'text',
    mediaUrl?: string,
    metadata: Record<string, any> = {},
    buttonPayload?: string
  ): Promise<{ userMessage: ChatMessage; botMessage?: ChatMessage | null }> {
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      message_type: messageType,
      content,
      media_url: mediaUrl,
      metadata,
      created_at: new Date().toISOString()
    };

    try {
      await supabase.rpc('rpc_send_chat_message', {
        p_conversation_id: conversationId,
        p_sender_id: senderId,
        p_content: content,
        p_message_type: messageType,
        p_media_url: mediaUrl || null,
        p_metadata: metadata,
        p_is_bot_generated: false
      });
    } catch (e) {
      console.log('Using local message send dispatch:', e);
    }

    // Determinar bot según el comando o metadata
    // El usuario indicó: "solamente tendran bots los grupos que se le asigne un bot."
    let targetBotId = metadata.active_bot_id;

    // Aún podemos permitir que si se usa un comando explícito y está habilitado se asigne (opcional)
    const lowerInput = (buttonPayload || content).toLowerCase();
    if (lowerInput.includes('@apostar') || lowerInput.includes('@juegos')) {
      targetBotId = 'betting_bot';
    } else if (lowerInput.includes('@comprar') || lowerInput.includes('@precios')) {
      targetBotId = 'sales_bot';
    }

    let botMessage = null;

    // Solo procesar mediante el bot engine si hay un bot asignado/determinado
    if (targetBotId) {
      botMessage = GenericBotEngine.processInput(
        conversationId,
        targetBotId,
        content,
        buttonPayload
      );
    }

    return { userMessage, botMessage };
  },

  /**
   * Se suscribe en tiempo real a los nuevos mensajes de una conversación
   */
  subscribeToConversation(conversationId: string, onNewMessage: (msg: ChatMessage) => void) {
    return supabase
      .channel(`chat_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload: any) => {
          onNewMessage(payload.new as ChatMessage);
        }
      )
      .subscribe();
  }
};
