# Especificación de Creación de Canales, Grupos y Perfiles de Miembro (`creation-hubs-profiles.spec.md`)

## 1. Visión General
Esta especificación define la arquitectura de datos, validaciones y diseño visual para la creación y edición completa de:
1. **Canales (`Channel`)**: Entidades raíz/empresas con portada, avatar, restricción de edad (+18), visibilidad, intereses principales y público objetivo (*Target*).
2. **Grupos (`Group`)**: Salas dependientes o independientes con selección de etiquetas (*tags*) heredadas o específicas, reglas de negocio y configuración de **Bots Automatizados** (IA Consultas, Bot de Ventas ERP, Bot de Loterías & Sorteos, Auto-Respuestas).
3. **Perfiles de Miembro (`Profile` / `User`)**: Perfil social extendido con identificador único (`@handle`), fecha de nacimiento, contacto (email, teléfono/WhatsApp, dirección), redes sociales, lista de intereses con chips dinámicos y selección de grupos de preferencia.

---

## 2. Reglas de Negocio (Business Rules)

### 2.1 Canales
- **Restricción de Edad (`is_18_plus`)**: Si el canal trata sobre apuestas de azar, contenido sensible o juegos reales, el interruptor `is_18_plus` se activa de forma obligatoria y bloquea el acceso a menores de edad.
- **Target / Audiencia Objetivo**: Debe seleccionarse al menos una audiencia (*Apostadores*, *Creadores de Contenido*, *Noticias & Actualidad*, *General*, *Citas & Entretenimiento*).
- **Intereses & Tags**: Selección mediante selector de Chips dinámicos desde `interests.json` con capacidad de añadir etiquetas personalizadas.

### 2.2 Grupos
- **Vinculación con Canal**: Un grupo puede pertenecer a un canal matriz o existir de forma autónoma.
- **Integración de Bots de Auto-respuesta (`configured_bots`)**:
  - `bot_sales`: Conexión con base de datos de productos/inventario para cotizaciones automáticas.
  - `bot_lottery`: Consulta en tiempo real de resultados de loterías y jugadas válidas.
  - `bot_ai_assistant`: Respuestas automatizadas impulsadas por IA para dudas frecuentes del grupo.
- **Categoría & Moneda**: Definición de tipo (`apuestas`, `multimedia`, `ventas`, `social`) y políticas de recarga de saldo.

### 2.3 Miembros (Perfiles)
- **Identificador Único (`handle`)**: Formato estricto `@username` (alfanumérico, sin espacios).
- **Intereses Dinámicos**: Selección múltiple con componentes de Chips visuales interactivos.
- **Datos de Contacto y Redes**: Dirección física opcional, WhatsApp directo, correo electrónico verificado y enlaces sociales (Instagram, X, Telegram).

---

## 3. Contratos de Datos en TypeScript (Interfaces)

```typescript
export type TargetAudience = 
  | 'apostadores' 
  | 'compartidores_contenido' 
  | 'noticias' 
  | 'general' 
  | 'amor_citas' 
  | 'tecnologia_ventas';

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

export interface MemberProfilePayload {
  username: string; // @handle
  full_name: string;
  email: string;
  birth_date: string;
  phone_whatsapp?: string;
  address?: string;
  interests: string[];
  social_links?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  preferred_group_ids?: string[];
}
```

---

## 4. Endpoints del Backend Esperados (Contracts API)

- `POST /api/channels` -> Crea un nuevo canal con su cover, avatar, audiencia target e intereses.
- `POST /api/groups` -> Registra un grupo asociando bots seleccionados e intereses heredados.
- `PUT /api/profiles/me` -> Actualiza el perfil completo del miembro (handle, chips de interés, contacto).
- `GET /api/interests` -> Devuelve las categorías e intereses base del archivo `interests.json`.

---

## 5. Componentes Frontend y Estado

1. **`CreateChannelModal.tsx` / `CreateChannelScreen.tsx`**:
   - Formulario por pasos (Tabs o Stepper) con selector de visibilidad, toggle de +18, subida de foto/portada y Chips de Intereses.
2. **`CreateGroupModal.tsx` / `CreateGroupScreen.tsx`**:
   - Formulario modal con sección especial "Configuración de Bots" que permite activar/desactivar bots (Bot de Ventas ERP, Bot de Loterías, Asistente IA).
3. **`MemberProfileEditor.tsx`**:
   - Componente de perfil de usuario con campos estructurados, selector de fecha de nacimiento, redes sociales y selector de Chips.
4. **`InterestChipsSelector.tsx`**:
   - Componente reusable de selección de etiquetas/chips con opción de presionar (+) para ingresar un nuevo tag personalizado.
