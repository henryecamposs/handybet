# Especificación Arquitectónica: Motor de Bots Declarativo Interprete de JSON (Generic BotFlow Engine)

## 1. Objetivos del Sistema

Esta especificación define un **Motor Interprete Genérico de Bots (`GenericBotEngine`)** guiado 100% por archivos de configuración de flujo en formato **JSON (`*.flow.json`)**.

### Principios Fundamentales:
1. **Comandos Homologados con `@`**: Todos los comandos de activación utilizan exclusivamente el prefijo `@` (ej: `@start`, `@comprar`, `@apostar`, `@soporte`), facilitando la escritura desde dispositivos móviles.
2. **Cero Código Hardcodeado por Bot**: Cualquier flujo de conversación (Ventas ERP, Apuestas, Loterías, Soporte) se construye simplemente creando un archivo JSON. El motor actúa únicamente como el **Intérprete** de las instrucciones declaradas en el JSON.
3. **Consumo Dinámico de APIs Externas (`api_call`)**: Capacidad de realizar peticiones HTTP (GET/POST) durante la conversación, extraer arrays de datos mediante mapeo de propiedades (`response_mapping`) y renderizar listas o selecciones automáticas de botones.
4. **Transformadores de Entradas (`input_type`)**:
   - `text`: Captura de texto libre.
   - `number`: Conversión a valor numérico.
   - `array_csv`: Transformación automática de cadenas separadas por coma (ej: `"05, 12, 23"` -> `["05", "12", "23"]`).
   - `single_select`: Botones para selección única.
   - `multi_select`: Botones para selección múltiple acumulativa.
5. **Bucles de Acumulación (`loop_accumulation`)**: Capacidad de acumular objetos en arreglos de variables (ej: `apuestas[]` o `items_carrito[]`) al responder "¿Desea agregar otro?".
6. **Validación Humana & Co-Piloto (`human_approval`)**: Estado de pausa donde el bot espera la confirmación o firma del dueño humano del chat (ej: validación de referencia de pago `refpago`).

---

## 2. Esquema JSON Declarativo (`BotFlowSchema`)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "bot_id": "string",
  "name": "string",
  "description": "string",
  "default_command_prefix": "@",
  "triggers": [
    {
      "command": "@start",
      "target_node_id": "string"
    }
  ],
  "nodes": {
    "node_id": {
      "id": "string",
      "type": "message | question | api_call | condition | loop_accumulator | human_approval | generate_receipt",
      "message_template": "Texto con interpolación de {{variables}}",
      "media_url": "string (opcional)",
      "input_type": "text | number | array_csv | single_select | multi_select",
      "variable_name": "nombre_de_variable_en_contexto",
      "options": [
        {
          "label": "Texto del Botón",
          "value": "valor_o_payload",
          "target_node_id": "siguiente_nodo_id"
        }
      ],
      "api_config": {
        "url": "https://api.ejemplo.com/juegos",
        "method": "GET | POST",
        "headers": {},
        "extract_array_path": "data.items",
        "label_field": "nombre",
        "value_field": "code",
        "target_node_after_fetch": "nodo_siguiente"
      },
      "condition_config": {
        "variable": "respuesta_usuario",
        "operator": "equals | contains | greater_than | is_true",
        "compare_value": "Sí",
        "then_node_id": "nodo_exito",
        "else_node_id": "nodo_fallo"
      },
      "accumulator_config": {
        "target_array_variable": "apuestas",
        "items_to_push": ["juego_seleccionado", "numeros", "monto_apuesta"],
        "ask_repeat_message": "¿Desea realizar otra apuesta?",
        "repeat_target_node_id": "node_select_juego",
        "finish_target_node_id": "node_payment_methods"
      },
      "human_approval_config": {
        "waiting_message": "⏳ Esperando validación del pago por el administrador...",
        "approved_node_id": "node_generate_ticket",
        "rejected_node_id": "node_payment_failed"
      }
    }
  }
}
```

---

## 3. Especificación de los Dos Flujos Ejemplo

### 3.1 Flujo 1: Bot de Ventas ERP (`sales_bot.flow.json`)
```
 1. Usuario envía @start
 2. Bot saluda e interroga: "¿Qué desea hacer?" [🛒 Comprar | ❓ Consultar Precios]
 3. Usuario elige "Consultar Precios"
 4. Bot pide escribir el nombre del producto (`input_type: text`, `variable: producto_buscado`)
 5. Bot ejecuta `api_call` (Simulada/DB) -> Filtra ítems -> Muestra opciones encontradas
 6. Usuario selecciona el Item #10
 7. Bot muestra detalles y precio -> "¿Desea comprar?"
 8. Usuario indica "Sí" -> Bot solicita forma de pago -> Genera voucher de orden.
```

### 3.2 Flujo 2: Bot de Apuestas Deportivo / Loterías (`betting_bot.flow.json`)
```
 1. Usuario envía @start
 2. Bot ejecuta `api_call` a endpoint de juegos activos -> Muestra botones de selección múltiple (`multi_select`)
 3. Usuario selecciona juego -> Guarda en variable `juegos`
 4. Bot pregunta por números a apostar (Formato: "05, 12, 23") (`input_type: array_csv`, `variable: numeros`)
 5. Engine parsea la cadena y la convierte en arreglo `["05", "12", "23"]`
 6. Bot pregunta por el monto individual por número -> Guarda en `monto_apuesta`
 7. Bot pregunta: "¿Desea apostar de nuevo?"
    - Si "Sí": Evaluador `loop_accumulator` empuja `{ juegos, numeros, monto_apuesta }` al array `apuestas[]` y regresa a Selección de Juegos.
    - Si "No": Avanza a resumen total y formas de pago.
 8. Bot muestra cuentas bancarias / Pago Móvil -> Usuario ingresa `refpago`
 9. Bot entra en estado `human_approval` ("Esperando confirmación del dueño del chat...")
10. El humano aprueba -> Engine genera la factura digital / recibo de la jugada.
```

---

## 4. Contratos TypeScript del Intérprete

```typescript
export interface BotContextData {
  session_id: string;
  conversation_id: string;
  bot_id: string;
  current_node_id: string;
  status: 'active' | 'waiting_input' | 'waiting_human_approval' | 'completed';
  variables: Record<string, any>; // Acumulador dinámico de respuestas
  accumulated_arrays: Record<string, any[]>; // p.ej. apuestas: [{...}, {...}]
}
```

---

## 5. Plan de Implementación de los Intérpretes

1. **Creación de Archivos JSON**: `src/data/bots/sales_bot.flow.json` y `src/data/bots/betting_bot.flow.json`.
2. **Motor Intérprete `GenericBotEngine.ts`**:
   - Lógica de resolución de variables `{{variable}}`.
   - Conversor de CSV a arreglos.
   - Manejador de bucles acumuladores.
   - Ejecutor de consultas HTTP/API.
3. **Barra de Comandos UI `BotActionBar.tsx`**:
   - Cambio de comandos a formato exclusivo `@` (`@start`, `@comprar`, `@apostar`).
