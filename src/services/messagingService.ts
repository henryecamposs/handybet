import { supabase } from '../lib/supabaseClient';

export interface Conversation {
  id: string;
  title: string | null;
  is_group_chat: boolean;
  last_message_at: string;
  metadata: Record<string, any>;
  created_at: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'video' | 'bet_share' | 'system';
  metadata: Record<string, any>;
  created_at: string;
}

/**
 * Servicio de Mensajería Eficiente y Tiempo Real para HandyBet
 */
export const messagingService = {
  /**
   * Obtiene las conversaciones activas del usuario
   */
  async getUserConversations(userId: string): Promise<Conversation[]> {
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
  },

  /**
   * Obtiene los mensajes de una conversación ordenados cronológicamente
   */
  async getConversationMessages(conversationId: string, limit = 50): Promise<Message[]> {
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
    return data as Message[];
  },

  /**
   * Envía un mensaje vía función RPC segura que actualiza conversaciones y contadores
   */
  async sendMessage(
    conversationId: string,
    content: string,
    messageType: 'text' | 'image' | 'video' | 'bet_share' | 'system' = 'text',
    metadata = {}
  ): Promise<string | null> {
    const { data, error } = await supabase.rpc('rpc_send_message', {
      p_conversation_id: conversationId,
      p_content: content,
      p_message_type: messageType,
      p_metadata: metadata,
    });

    if (error) {
      console.error('Error RPC al enviar mensaje:', error.message);
      return null;
    }
    return data as string;
  },

  /**
   * Se suscribe en tiempo real a los nuevos mensajes de una conversación
   */
  subscribeToConversation(conversationId: string, onNewMessage: (msg: Message) => void) {
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
          onNewMessage(payload.new as Message);
        }
      )
      .subscribe();
  }
};
