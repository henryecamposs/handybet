import { BotFlowDefinition, BotFlowNode, BotSessionState, ChatMessage, InteractiveButton } from '../types/chat';

/**
 * Bot de Ejemplo: Bot ERP de Ventas y Promociones HandyBet
 */
export const salesErpBotDefinition: BotFlowDefinition = {
  bot_id: 'sales_erp_bot',
  name: 'Bot ERP de Ventas HandyBet',
  description: 'Asistente interactivo para venta de tickets VIP y promociones',
  initial_node_id: 'node_welcome',
  triggers: [
    { command: '@comprar', target_node_id: 'node_sales_menu' },
    { command: '/start', target_node_id: 'node_welcome' },
    { command: '/ayuda', target_node_id: 'node_help' }
  ],
  nodes: {
    node_welcome: {
      id: 'node_welcome',
      message: '¡Hola! 👋 Bienvenido al Asistente Oficial HandyBet. ¿En qué podemos ayudarte hoy?',
      buttons: [
        { id: 'btn_1', label: '🛒 Ver Promociones VIP', action_type: 'trigger_node', payload: 'node_sales_menu', variant: 'primary' },
        { id: 'btn_2', label: '❓ Preguntas Frecuentes', action_type: 'trigger_node', payload: 'node_help', variant: 'secondary' }
      ]
    },
    node_sales_menu: {
      id: 'node_sales_menu',
      message: '🎰 *Catálogo de Promociones VIP HandyBet*\nSelecciona la suscripción o pack de jugadas que deseas adquirir:',
      buttons: [
        { id: 'btn_pack_1', label: '⭐ Pack Diamante (50 Bs)', action_type: 'trigger_node', payload: 'node_pack_diamante', variant: 'primary' },
        { id: 'btn_pack_2', label: '🔥 Suscripción VIP Semanal (120 Bs)', action_type: 'trigger_node', payload: 'node_pack_vip', variant: 'primary' },
        { id: 'btn_back', label: '◀ Volver al Menú', action_type: 'trigger_node', payload: 'node_welcome', variant: 'outline' }
      ]
    },
    node_pack_diamante: {
      id: 'node_pack_diamante',
      message: '💎 *Pack Diamante Seleccionado*\nIncluye 5 pronósticos de alta probabilidad y acceso por 7 días.\n\nPara confirmar tu pago, pulsa el botón a continuación:',
      buttons: [
        { id: 'btn_confirm', label: '✅ Confirmar Pago (50.00 Bs)', action_type: 'submit_command', payload: '@confirmar_diamante', variant: 'primary' },
        { id: 'btn_cancel', label: '❌ Cancelar', action_type: 'trigger_node', payload: 'node_sales_menu', variant: 'destructive' }
      ]
    },
    node_pack_vip: {
      id: 'node_pack_vip',
      message: '👑 *Suscripción VIP Semanal*\nAcceso ilimitado a todas las taquillas y grupos exclusivos.\n\nPara confirmar tu pago, pulsa el botón a continuación:',
      buttons: [
        { id: 'btn_confirm_vip', label: '✅ Confirmar Suscripción (120.00 Bs)', action_type: 'submit_command', payload: '@confirmar_vip', variant: 'primary' },
        { id: 'btn_cancel_vip', label: '❌ Cancelar', action_type: 'trigger_node', payload: 'node_sales_menu', variant: 'destructive' }
      ]
    },
    node_help: {
      id: 'node_help',
      message: '💡 *Centro de Ayuda y Comandos Rápidos*\nPuedes interactuar escribiendo cualquiera de estos comandos en el chat:\n\n• *@comprar*: Abrir el catálogo de ventas VIP\n• */start*: Reiniciar el asistente interactivo\n• */ayuda*: Ver este menú explicativo',
      buttons: [
        { id: 'btn_back_home', label: '🏠 Menú Principal', action_type: 'trigger_node', payload: 'node_welcome', variant: 'primary' }
      ]
    }
  }
};

/**
 * Motor Genérico de Evaluación de Flujos de Bots
 */
export class BotFlowEngine {
  private static registeredBots: Record<string, BotFlowDefinition> = {
    [salesErpBotDefinition.bot_id]: salesErpBotDefinition
  };

  private static sessionsInMemory: Record<string, BotSessionState> = {};

  /**
   * Registra una nueva definición de bot genérico
   */
  public static registerBot(botDef: BotFlowDefinition) {
    this.registeredBots[botDef.bot_id] = botDef;
  }

  /**
   * Procesa un evento de entrada (Texto de usuario o Clic en Botón) y retorna el mensaje de respuesta
   */
  public static processInput(
    conversationId: string,
    botId: string,
    inputText: string,
    buttonPayload?: string
  ): ChatMessage | null {
    const botDef = this.registeredBots[botId] || salesErpBotDefinition;
    let session = this.sessionsInMemory[conversationId];

    // Inicializar sesión si no existe
    if (!session) {
      session = {
        conversation_id: conversationId,
        bot_id: botId,
        current_node_id: botDef.initial_node_id,
        context_data: {},
        last_activity_at: new Date().toISOString()
      };
      this.sessionsInMemory[conversationId] = session;
    }

    let targetNodeId: string | null = null;
    const cleanText = inputText.trim().toLowerCase();

    // 1. Evaluar si es un botón de acción con target_node
    if (buttonPayload) {
      if (buttonPayload.startsWith('@') || buttonPayload.startsWith('/')) {
        // Es un comando enviado desde un botón
        const trigger = botDef.triggers.find(t => t.command.toLowerCase() === buttonPayload.toLowerCase());
        targetNodeId = trigger ? trigger.target_node_id : null;
      } else if (botDef.nodes[buttonPayload]) {
        targetNodeId = buttonPayload;
      }
    }

    // 2. Si no fue por botón, evaluar triggers por texto (@comprar, /start, etc.)
    if (!targetNodeId) {
      const trigger = botDef.triggers.find(t => cleanText.includes(t.command.toLowerCase()));
      if (trigger) {
        targetNodeId = trigger.target_node_id;
      }
    }

    // 3. Manejo de comandos especiales de confirmación
    if (cleanText === '@confirmar_diamante' || buttonPayload === '@confirmar_diamante') {
      session.current_node_id = 'node_welcome';
      return {
        id: `bot_msg_${Date.now()}`,
        conversation_id: conversationId,
        sender_id: 'bot_assistant',
        sender_name: botDef.name,
        message_type: 'text',
        content: '🎉 ¡Pago confirmado exitosamente! Tu Pack Diamante ya se encuentra activo en tu wallet.',
        is_bot_generated: true,
        created_at: new Date().toISOString()
      };
    }

    if (cleanText === '@confirmar_vip' || buttonPayload === '@confirmar_vip') {
      session.current_node_id = 'node_welcome';
      return {
        id: `bot_msg_${Date.now()}`,
        conversation_id: conversationId,
        sender_id: 'bot_assistant',
        sender_name: botDef.name,
        message_type: 'text',
        content: '👑 ¡Excelente! Tu Suscripción VIP Semanal ha sido procesada con éxito.',
        is_bot_generated: true,
        created_at: new Date().toISOString()
      };
    }

    // 4. Si se determinó un nuevo nodo, actualizar la sesión y construir la respuesta
    if (targetNodeId && botDef.nodes[targetNodeId]) {
      session.current_node_id = targetNodeId;
      session.last_activity_at = new Date().toISOString();
      const node = botDef.nodes[targetNodeId];

      return {
        id: `bot_msg_${Date.now()}`,
        conversation_id: conversationId,
        sender_id: 'bot_assistant',
        sender_name: botDef.name,
        message_type: node.buttons && node.buttons.length > 0 ? 'interactive_buttons' : (node.message_type || 'text'),
        content: node.message,
        media_url: node.media_url,
        buttons: node.buttons,
        is_bot_generated: true,
        created_at: new Date().toISOString()
      };
    }

    // Si el texto no coincide con ningún comando ni trigger y no hay nodo objetivo, devolver null (para que responda el humano)
    return null;
  }
}
