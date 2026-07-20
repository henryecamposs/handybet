# Especificación de Rediseño de Perfil y Creación de Usuario (`user-profile-redesign.spec.md`)

## 1. Visión General
Esta especificación establece la reestructuración completa de la pantalla del Perfil del Usuario (`src/app/(tabs)/profile.tsx`) y la creación del flujo y formulario para el Registro / Creación de Nuevo Usuario (`src/app/(tabs)/profile/create.tsx`).

---

## 2. Reglas de Negocio (Business Rules)

### 2.1 Pantalla de Perfil de Usuario (`profile.tsx`)
- **Diseño basado en Tarjetas (Cards UI)**: En lugar del contenedor oscuro simple actual, el perfil se dividirá en módulos visuales limpios:
  1. **Tarjeta de Cabecera (Hero Cover & Avatar)**: Muestra la portada (`HubCover`), foto de perfil circular, nombre completo, identificador `@username`, rol de la cuenta (`Jugador`, `Cajero`, `Propietario`), y botones de acción rápida (*Editar Perfil*, *Crear Usuario*, *Cerrar Sesión*).
  2. **Tarjeta de Información Personal & Contacto**: Biografía/descripción, Correo electrónico verificado, número de WhatsApp/Teléfono directo, Fecha de nacimiento y Dirección física.
  3. **Tarjeta de Redes Sociales**: Enlaces conectados (Instagram, Twitter/X, Telegram).
  4. **Tarjeta de Intereses & Preferencias**: Visualización de los Chips de intereses seleccionados por el usuario.
  5. **Tarjeta de Balances (Multi-Wallets)**: Saldos por grupo de taquilla con insignias de estado.
  6. **Tarjeta de Historial Contable (Ledger)**: Registro cronológico de transacciones con badges de tipo (Depósitos, Débitos, Premios).

### 2.2 Formulario de Creación de Usuario (`profile/create.tsx`)
- **Campos Requeridos**:
  - Foto de Portada (Cover) y Foto de Perfil (Avatar).
  - Nombre Completo y Handle único (`@username`).
  - Correo Electrónico.
  - Fecha de Nacimiento (con validación de mayoría de edad +18).
  - Biografía / Descripción personal.
  - WhatsApp / Teléfono de contacto.
  - Dirección Física (País, Estado, Dirección).
  - Enlaces a Redes Sociales (Instagram, X, Telegram).
  - Selector de Chips de Intereses (`InterestChipsSelector`).

---

## 3. Contratos de Datos en TypeScript

```typescript
export interface UserProfileFull {
  id: string;
  username: string; // @handle
  full_name: string;
  email: string;
  birth_date: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  role: 'player' | 'cashier' | 'company_owner' | 'admin';
  phone_whatsapp?: string;
  address?: string;
  location?: {
    country?: string;
    state?: string;
  };
  social_links?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  interests: string[];
  created_at: string;
}

export interface CreateUserPayload {
  username: string;
  full_name: string;
  email: string;
  birth_date: string;
  bio: string;
  phone_whatsapp?: string;
  address?: string;
  social_links?: {
    instagram?: string;
    twitter?: string;
    telegram?: string;
  };
  interests: string[];
  avatar_url?: string;
  cover_url?: string;
}
```

---

## 4. Endpoints Backend Esperados

- `POST /api/users` -> Registra un nuevo usuario con avatar, portada, handle e intereses.
- `GET /api/users/me` -> Obtiene los datos extendidos del perfil del usuario en sesión.
- `PUT /api/users/me` -> Actualiza campos del perfil e intereses.

---

## 5. Componentes Frontend y Estado

1. **`ProfileScreen` (`src/app/(tabs)/profile.tsx`)**:
   - Layout modular organizado en cards con gradientes y bordes primarios.
   - Integración con `HubCover`, `InterestChipsSelector` e `IconButton`.
2. **`CreateUserScreen` (`src/app/(tabs)/profile/create.tsx`)**:
   - Formulario completo por secciones (1. Identificación, 2. Contacto & Edad +18, 3. Redes Sociales, 4. Chips de Intereses).
