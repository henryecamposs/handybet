---
id: 340
title: Rediseño de Perfil y Registro de Usuario
category: 300 - Frontend y Componentes UI
tags: [ui, profile, cards, forms, nativewind, handybet]
status: aprobado
date: 2026-07-20
---

# 340 — Perfil de Usuario & Formulario de Registro

Especificación de arquitectura de UI modular basada en Tarjetas (*Cards*) para el perfil del usuario (`profile.tsx`) y el flujo de alta/edición de datos (`profile/create.tsx`).

---

## 1. Módulos Visuales del Perfil (Cards UI)

1. **Tarjeta de Cabecera (Hero & Avatar):** Portada superior `HubCover`, avatar circular de alta resolución, `@username`, badge de rol (`Jugador`, `Cajero`, `Propietario`), y acciones rápidas (*Editar Perfil*, *Crear Usuario*, *Cerrar Sesión*).
2. **Tarjeta de Información Personal:** Biografía corta, e-mail verificado, teléfono/WhatsApp de contacto, dirección física y estado de verificación (+18).
3. **Tarjeta de Redes Sociales:** Enlaces directos conectados (Instagram, Twitter/X, Telegram).
4. **Tarjeta de Intereses & Preferencias:** Visualización mediante Chips interactivos seleccionados.
5. **Tarjeta Multi-Wallets:** Resumen de saldos por Agencia/Grupo de apuestas.
6. **Tarjeta de Historial Contable:** Registro cronológico de transacciones (Depósitos, Débitos, Premios).

---

## 2. Contratos de Datos (TypeScript)

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
