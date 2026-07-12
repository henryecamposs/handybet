# Yastaa Core — Especificación Técnica Maestra

Este documento define la base arquitectónica, las reglas de negocio, los contratos de datos de TypeScript, el diseño de la base de datos de Supabase y las interfaces visuales del ecosistema **Yastaa**, una red social inteligente de iGaming con soporte de multi-wallets por agencias, mensajería privada, inyección de anuncios y bóvedas multimedia.

---

## 1. Reglas de Negocio (Business Rules)

### 1.1. Perfiles e Intereses (RN-PF)
* **RN-PF-01 (Datos de Perfil):** Todo perfil de usuario debe registrar un alias único (`username`), nombre completo, avatar opcional, biografía corta y una lista de intereses seleccionados (múltiple) que definen el contenido sugerido.
* **RN-PF-02 (Privacidad de Invitados):** Los usuarios no autenticados (`guests`) pueden consultar perfiles públicos, publicaciones del feed y canales públicos. No pueden enviar comentarios, publicar fotos/videos, enviar mensajes privados ni interactuar con billeteras.

### 1.2. Estructura de Grupos y Canales (RN-CH)
* **RN-CH-01 (Configuración de Canales):** Un Canal actúa como una organización (ej. "Agencia La Imaginaria"). Cada canal puede albergar múltiples grupos de chat de diferentes categorías.
* **RN-CH-02 (Tipos de Grupos):** Al crear un grupo, se le asigna un tipo rígido que activa componentes UI específicos:
  * `apuestas`: Activa el simulador de jugadas, generación de códigos QR y monederos por agencia.
  * `pronosticos`: Permite la venta de datos y combinaciones de lotería/deporte bloqueados bajo suscripción.
  * `publicidad`: Destinado exclusivamente para la publicación de anuncios con redirección a grupos comerciales.
  * `compartir_media`: Galería de fotos y videos de corta duración (hasta 30 segundos) con barreras de pago P2P.

### 1.3. Motor de Apuestas Inteligente (RN-BT)
* **RN-BT-01 (Billeteras Aisladas - Multi-Wallet):** Un usuario tiene una Billetera Principal y un listado de Billeteras específicas por Agencia o Grupo. El dinero depositado en el grupo de la "Agencia X" solo se puede emplear para validar jugadas dirigidas a esa misma "Agencia X".
* **RN-BT-02 (Matriz de Apuestas y QR):** La jugada armada se codifica en un JSON comprimido que genera un código único de formato `[ID-Grupo]-[ID-Apuesta]` (ej. `1234-123456`) renderizable como código QR de alta densidad.
* **RN-BT-03 (Liquidación de Jugadas):** El cajero del grupo puede cargar la jugada en su terminal de taquilla ingresando el código de 10 dígitos o escaneando el QR. Al confirmarse la apuesta, se debita automáticamente del monedero del usuario en dicho grupo.
* **RN-BT-04 (Reclamación de Premios):** Para cobrar una jugada ganadora, el jugador solicita el cobro en la app. El cajero recibe la notificación en su cola de transacciones pendientes y puede pagar actualizando el balance del monedero o realizando un pago móvil e importando el comprobante correspondiente.

---

## 2. Contratos de Datos (TypeScript)

Los tipos compartidos se ubican en `src/types/yastaa.ts`:

```typescript
export type YastaaRole = 'player' | 'cashier' | 'company_owner' | 'admin';
export type YastaaGroupType = 'apuestas' | 'pronosticos' | 'publicidad' | 'compartir_media';
export type YastaaBetStatus = 'pendiente' | 'confirmada' | 'ganadora' | 'perdedora' | 'cobrada';
export type YastaaTxType = 'deposito' | 'retiro' | 'debito_apuesta' | 'credito_premio' | 'compra_suscripcion';
export type YastaaTxStatus = 'pendiente' | 'aprobado' | 'rechazado';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: YastaaRole;
  interests: string[]; // ['apuestas', 'pronosticos', 'publicidad', 'compartir_media']
  created_at: string;
}

export interface Group {
  id: string;
  channel_id: string;
  short_code: string;
  name: string;
  type: YastaaGroupType;
  config: {
    agencies?: string[];
    export_format?: string; // Formato de exportación del ticket (JSON / TXT)
  };
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  group_id: string;
  balance: number;
  created_at: string;
}

export interface Bet {
  id: string;
  group_id: string;
  user_id: string;
  bet_code: string; // ej: 1234-123456
  bet_data: {
    lotteryId: string;
    schedule: string;
    gameType: string;
    selections: Array<{
      number: string;
      multiplier: number;
    }>;
    totalAmount: number;
  };
  amount: number; // Total jugado
  potential_prize: number;
  status: YastaaBetStatus;
  ticket_number?: string;
  payment_proof_url?: string; // Comprobante de pago móvil si aplica
  processed_by?: string;
  created_at: string;
}
```

---

## 3. Esquema de Base de Datos (Supabase PostgreSQL)

El backend de base de datos se estructura con tablas relacionales fuertes, restricciones de clave foránea e índices de búsqueda rápida:

```sql
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE yastaa_role AS ENUM ('player', 'cashier', 'company_owner', 'admin');
CREATE TYPE yastaa_group_type AS ENUM ('apuestas', 'pronosticos', 'publicidad', 'compartir_media');
CREATE TYPE yastaa_bet_status AS ENUM ('pendiente', 'confirmada', 'ganadora', 'perdedora', 'cobrada');
CREATE TYPE yastaa_tx_type AS ENUM ('deposito', 'retiro', 'debito_apuesta', 'credito_premio', 'compra_suscripcion');
CREATE TYPE yastaa_tx_status AS ENUM ('pendiente', 'aprobado', 'rechazado');

-- Tablas Principales
CREATE TABLE profiles (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role yastaa_role DEFAULT 'player',
    interests TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    short_code VARCHAR(4) UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type yastaa_group_type NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
    balance NUMERIC(15, 2) DEFAULT 0.00 CHECK (balance >= 0.00),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, group_id)
);

CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES groups(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    bet_code VARCHAR(12) UNIQUE NOT NULL,
    bet_data JSONB NOT NULL,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0.00),
    potential_prize NUMERIC(15, 2) DEFAULT 0.00 CHECK (potential_prize >= 0.00),
    status yastaa_bet_status DEFAULT 'pendiente',
    ticket_number TEXT,
    payment_proof_url TEXT,
    processed_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Componentes Visuales Críticos (Frontend)

| Componente | Props | Estado | Descripción |
|------------|-------|--------|-------------|
| `BetMatrixBuilder` | `groupId: string` | `selections`, `totalAmount`, `loading` | Selector interactivo de lotería, combinaciones y montos que empaqueta y genera el borrador en JSON. |
| `QRDisplayZone` | `betCode: string` | Ninguno | Visor del código de jugada formateado y el código QR de alta densidad para escaneo en taquilla. |
| `QRCameraScanner` | `onScanned: (code: string) => void` | `hasPermission`, `scanned` | Escáner integrado para la cámara del cajero que extrae la matriz de apuesta para validación. |
| `YastaaLayout` | Ninguno | `activeTab` | Estructura universal responsiva con Sidebar Izquierda de accesos, centro de contenido e inyección lateral de sugerencias. |

---

## 5. Criterios de Aceptación (Acceptance Criteria)

* **CA-01:** Las apuestas de tipo `apuestas` deben deducirse en caliente del monedero específico del grupo. Si el monedero no posee fondos suficientes, el motor de base de datos debe arrojar una excepción y rechazar la transacción (ACID).
* **CA-02:** Los usuarios invitados (no autenticados) no deben ver publicaciones de grupos marcados como privados ni los pronósticos premium.
* **CA-03:** El hook de plataforma responsivo `useDevicePlatform` debe forzar que las barras laterales se colapsen en un menú tipo Drawer o pestaña inferior si la pantalla tiene un ancho inferior a 768px (pantalla móvil).
