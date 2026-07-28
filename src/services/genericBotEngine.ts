import salesBotJson from '../data/bots/sales_bot.flow.json';
import bettingBotJson from '../data/bots/betting_bot.flow.json';
import { ChatMessage, InteractiveButton } from '../types/chat';

export interface BotFlowApiConfig {
  url: string;
  method?: 'GET' | 'POST';
  extract_array_path?: string;
  label_field?: string;
  value_field?: string;
  node_id_on_success?: string;
  node_id_on_empty?: string;
  node_id_on_error?: string;
}

export interface BotFlowJsonNode {
  id: string;
  type: 'message' | 'question' | 'api_call' | 'condition' | 'loop_accumulator' | 'human_approval' | 'generate_receipt';
  message_template: string;
  media_url?: string;
  input_type?: 'text' | 'number' | 'array_csv' | 'single_select' | 'multi_select';
  variable_name?: string;
  next_node_id?: string;
  dynamic_options_source?: string;
  options?: Array<{
    label: string;
    value: string;
    target_node_id?: string;
  }>;
  api_config?: BotFlowApiConfig;
  accumulator_config?: {
    target_array_variable: string;
    items_to_push: string[];
    repeat_target_node_id: string;
    finish_target_node_id: string;
  };
  human_approval_config?: {
    approved_node_id: string;
    rejected_node_id: string;
  };
}

export interface BotFlowJsonSchema {
  bot_id: string;
  name: string;
  description: string;
  initial_node_id: string;
  default_command_prefix: string;
  triggers: Array<{ command: string; target_node_id: string }>;
  nodes: Record<string, BotFlowJsonNode>;
}

export interface BotSessionContext {
  conversation_id: string;
  bot_id: string;
  current_node_id: string;
  variables: Record<string, any>;
  accumulated_arrays: Record<string, any[]>;
  status: 'active' | 'waiting_input' | 'waiting_human_approval' | 'completed';
}

/**
 * Motor Intérprete Genérico de Bots Guiado por Archivos JSON
 */
export class GenericBotEngine {
  private static registeredFlows: Record<string, BotFlowJsonSchema> = {
    'sales_bot': salesBotJson as any,
    'betting_bot': bettingBotJson as any
  };

  private static sessions: Record<string, BotSessionContext> = {};

  /**
   * Carga y registra una nueva definición JSON de flujo de bot
   */
  public static registerBotFlow(flowJson: BotFlowJsonSchema) {
    this.registeredFlows[flowJson.bot_id] = flowJson;
  }

  /**
   * Intérprete Principal: Procesa un input de usuario o evento de botón contra el flujo JSON
   */
  public static processInput(
    conversationId: string,
    botId: string,
    inputText: string,
    buttonPayload?: string,
    userName: string = 'Henry Campos'
  ): ChatMessage | null {
    const flow = this.registeredFlows[botId] || salesBotJson as any;
    let session = this.sessions[conversationId];

    // 1. Inicializar sesión de conversación si no existe
    if (!session || session.bot_id !== botId) {
      session = {
        conversation_id: conversationId,
        bot_id: botId,
        current_node_id: flow.initial_node_id,
        variables: { user_name: userName },
        accumulated_arrays: {},
        status: 'active'
      };
      this.sessions[conversationId] = session;
    }

    const cleanInput = (inputText || '').trim();
    const cleanPayload = (buttonPayload || '').trim();

    // 2. Comprobar Triggers de Comandos (exclusivamente prefijo @)
    const activeCommand = cleanPayload || cleanInput;
    if (activeCommand.startsWith('@')) {
      const matchedTrigger = flow.triggers.find(
        t => t.command.toLowerCase() === activeCommand.toLowerCase()
      );
      if (matchedTrigger) {
        session.current_node_id = matchedTrigger.target_node_id;
        session.status = 'active';
        return this.renderNodeMessage(session, flow, flow.nodes[matchedTrigger.target_node_id]);
      }
    }

    // 3. Procesar Nodo Actual
    let currentNode = flow.nodes[session.current_node_id];
    if (!currentNode) {
      session.current_node_id = flow.initial_node_id;
      currentNode = flow.nodes[flow.initial_node_id];
      return this.renderNodeMessage(session, flow, currentNode);
    }

    // 4. Capturar Variable de Entrada según variable_name e input_type
    if (currentNode.variable_name && (cleanInput || cleanPayload)) {
      const rawValue = cleanPayload || cleanInput;
      if (currentNode.input_type === 'array_csv') {
        session.variables[currentNode.variable_name] = rawValue
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
      } else if (currentNode.input_type === 'number') {
        session.variables[currentNode.variable_name] = parseFloat(rawValue) || 0;
      } else {
        session.variables[currentNode.variable_name] = rawValue;
      }
    }

    // 5. Evaluación de Nodos Especiales (api_call)
    if (currentNode.type === 'api_call') {
      const apiConfig = currentNode.api_config;
      const varName = currentNode.variable_name || 'api_items';

      // Simulación de consulta API dinámica basada en variables del contexto
      const searchKeyword = session.variables['producto_buscado'] || '';
      let mockResults: any[] = [];

      if (searchKeyword.toLowerCase().includes('diamante') || searchKeyword.toLowerCase().includes('pack')) {
        mockResults = [{ code: 'item_10', name_with_price: 'Item #10 - Pack Diamante (50.00 Bs)' }];
      } else if (searchKeyword.toLowerCase().includes('vip')) {
        mockResults = [{ code: 'item_12', name_with_price: 'Item #12 - Suscripción VIP Semanal (120.00 Bs)' }];
      } else if (!searchKeyword || searchKeyword.length > 0) {
        // Mock genérico de productos si la búsqueda es general
        mockResults = [
          { code: 'item_10', name_with_price: 'Item #10 - Pack Diamante (50.00 Bs)' },
          { code: 'item_12', name_with_price: 'Item #12 - Suscripción VIP Semanal (120.00 Bs)' }
        ];
      }

      // Guardar resultados de consulta en la variable indicada (ej: items_encontrados[])
      session.variables[varName] = mockResults;
      session.variables[`${varName}_count`] = mockResults.length;

      // Evaluar la siguiente transición según cantidad de resultados
      let nextApiNodeId = currentNode.next_node_id;
      if (mockResults.length > 0) {
        nextApiNodeId = apiConfig?.node_id_on_success || currentNode.next_node_id || flow.initial_node_id;
      } else {
        nextApiNodeId = apiConfig?.node_id_on_empty || apiConfig?.node_id_on_error || currentNode.next_node_id || flow.initial_node_id;
      }

      if (nextApiNodeId && flow.nodes[nextApiNodeId]) {
        session.current_node_id = nextApiNodeId;
        return this.renderNodeMessage(session, flow, flow.nodes[nextApiNodeId]);
      }
    }

    // 6. Manejo de Bucles Acumuladores (`loop_accumulator`)
    if (currentNode.type === 'loop_accumulator' && currentNode.accumulator_config) {
      const accConfig = currentNode.accumulator_config;
      const arrayVarName = accConfig.target_array_variable;

      if (!session.accumulated_arrays[arrayVarName]) {
        session.accumulated_arrays[arrayVarName] = [];
      }

      const selectedValue = cleanPayload || cleanInput;
      if (selectedValue.toLowerCase().includes('si') || selectedValue === 'Si') {
        const newItem: Record<string, any> = {};
        accConfig.items_to_push.forEach(key => {
          newItem[key] = session.variables[key];
        });
        session.accumulated_arrays[arrayVarName].push(newItem);
        session.variables[`total_${arrayVarName}_count`] = session.accumulated_arrays[arrayVarName].length;

        session.current_node_id = accConfig.repeat_target_node_id;
        return this.renderNodeMessage(session, flow, flow.nodes[accConfig.repeat_target_node_id]);
      } else {
        session.variables[`total_${arrayVarName}_count`] = session.accumulated_arrays[arrayVarName].length;
        session.current_node_id = accConfig.finish_target_node_id;
        return this.renderNodeMessage(session, flow, flow.nodes[accConfig.finish_target_node_id]);
      }
    }

    // 7. Transición de Nodo basada en Opciones seleccionadas o `next_node_id`
    let nextNodeId = currentNode.next_node_id;

    if (currentNode.options && currentNode.options.length > 0) {
      const matchedOption = currentNode.options.find(
        opt => opt.value === cleanPayload || opt.label === cleanInput || opt.value === cleanInput
      );
      if (matchedOption && matchedOption.target_node_id) {
        nextNodeId = matchedOption.target_node_id;
      }
    }

    if (nextNodeId && flow.nodes[nextNodeId]) {
      session.current_node_id = nextNodeId;
      const targetNode = flow.nodes[nextNodeId];
      return this.renderNodeMessage(session, flow, targetNode);
    }

    return null;
  }

  /**
   * Renderiza la plantilla del nodo resolviendo variables interpoladas y opciones dinámicas
   */
  private static renderNodeMessage(
    session: BotSessionContext,
    flow: BotFlowJsonSchema,
    node?: BotFlowJsonNode
  ): ChatMessage | null {
    if (!node) return null;

    let renderedText = node.message_template || '';

    // Interpolación de variables simples {{variable}}
    Object.keys(session.variables).forEach(key => {
      const val = session.variables[key];
      const strVal = Array.isArray(val) ? val.join(', ') : String(val);
      renderedText = renderedText.replace(new RegExp(`{{${key}}}`, 'g'), strVal);
    });

    // Interpolación de variables por defecto
    renderedText = renderedText.replace(/{{random_code}}/g, Math.floor(100000 + Math.random() * 900000).toString());

    // Opciones predefinidas o dinámicas
    let resolvedOptions = node.options || [];

    // Si el nodo especifica dynamic_options_source (ej: "items_encontrados")
    if (node.dynamic_options_source && session.variables[node.dynamic_options_source]) {
      const dynamicItems = session.variables[node.dynamic_options_source];
      if (Array.isArray(dynamicItems) && dynamicItems.length > 0) {
        resolvedOptions = dynamicItems.map(item => ({
          label: item.name_with_price || item.name || item.title || String(item),
          value: item.code || item.value || String(item),
          target_node_id: node.next_node_id
        }));
      }
    }

    // Construcción de Botones Interactivos
    const interactiveButtons: InteractiveButton[] = resolvedOptions.map((opt, idx) => ({
      id: `btn_${node.id}_${idx}`,
      label: opt.label,
      action_type: 'submit_command',
      payload: opt.value,
      variant: 'primary'
    }));

    return {
      id: `bot_msg_${Date.now()}`,
      conversation_id: session.conversation_id,
      sender_id: 'bot_assistant',
      sender_name: flow.name,
      message_type: interactiveButtons.length > 0 ? 'interactive_buttons' : 'text',
      content: renderedText,
      media_url: node.media_url,
      buttons: interactiveButtons,
      is_bot_generated: true,
      created_at: new Date().toISOString()
    };
  }
}
