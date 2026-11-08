# Ecosistema Completo de Red Social y Apuestas HandyBet — Especificación Técnica (`social-betting-ecosystem-mockdata-and-features.spec.md`)

## 1. Contexto y Objetivo
Transformar HandyBet en una red social de apuestas y entretenimiento digital completamente poblada, orgánica y funcional a la vista. El objetivo es eliminar cualquier sensación de vacío o plantilla demo, proporcionando un catálogo hiper-realista de:
- **+50 Usuarios y Miembros** (Modelos/Chicas VIP, Pronosticadores/Tipsters, Taquilleros de agencia, Jugadores profesionales y casuales).
- **+50 Canales** estructurados por nicho (Loterías, Animalitos, Pronósticos deportivos, Contenido VIP/Modelos, Taquillas físicas, Bingos, Rifas).
- **+50 Grupos/Salas de Apuestas** vinculados a canales matrices con bots automatizados y reglas de acceso.
- **+50 Juegos y Sorteos** organizados en 7 categorías (`animalitos`, `quinielas`, `minijuegos`, `bingos`, `parley`, `rifas`, `loterias`).
- **+20 Premios Ganados** verificables con números de ticket y acreditación a billetera.
- **+60 Publicaciones y Noticias** con interacciones, multimedia y comentarios.

Además, se integran tres mecánicas interactivas clave:
1. **Paywall de Chat Directo con Creadoras VIP**: Mensajes multimedia bloqueados con botón de desbloqueo mediante saldo ficticio/real.
2. **Botón de Suscripción en Posts de Pronosticadores**: Acceso directo a planes Tier (Free, Medium, Pro) desde el propio feed.
3. **Simulador de Crash Game Demo**: Mini-juego interactivo en tiempo real con multiplicador ascendente, botón de apuesta y retiro de créditos ficticios.

---

## 2. Reglas de Negocio (Business Rules)

### 2.1 Desbloqueo de Contenido en Chat VIP (Pay-to-Unlock Media)
- **RN-CHAT-01**: Los mensajes de chat marcados con `is_locked: true` deben mostrar la imagen/video con desenfoque (`blur-md`), candado de seguridad y el precio de desbloqueo en VES / Puntos.
- **RN-CHAT-02**: Al presionar *"Desbloquear Contenido"*, el sistema verifica el saldo de `wallet_balance` en `useHandyBetStore`. Si cuenta con saldo suficiente, se descuenta el monto, se añade el ID del usuario actual a `unlocked_by` y el mensaje se renderiza en alta resolución.
- **RN-CHAT-03**: Si el saldo es insuficiente, se despliega un Toast informativo invitando a recargar en la Billetera.

### 2.2 Suscripción Directa a Pronosticadores y Creadores en Feed
- **RN-POST-01**: En `PostItem.tsx`, si el autor de la publicación posee planes de suscripción activos (`plans.length > 0`) o rol `company_owner` / `tipster`, se mostrará una insignia y botón *"Suscribirse ⭐"*.
- **RN-POST-02**: Al presionar *"Suscribirse"*, se despliega el modal interactivo de planes (`TierPlanSelector`), permitiendo al usuario activar la suscripción y actualizar su estado en `user_subscriptions.json` / `localDB`.

### 2.3 Simulador de Crash Game Demo con Créditos Ficticios
- **RN-GAME-01**: En la sección de Juegos (`/games/[gameId]`), los juegos de tipo Crash/Mini-juego incluirán un simulador dinámico con curva de multiplicador exponencial (`1.00x -> 100.00x`) con probabilidad de quiebre aleatorio ("Crash").
- **RN-GAME-02**: El usuario puede ingresar una apuesta en créditos demo (saldo inicial 500 créditos o saldo de billetera), iniciar la ronda ("Despegar") y presionar *"Retirarse / Cash Out"* antes del Crash para multiplicar su apuesta y recibir ganancias ficticias inmediatas.

### 2.4 Matriz Integral de Mockdata (+50 Entidades por Dimensión)
- **RN-DATA-01 (Usuarios)**: Mínimo 50 perfiles únicos distribuidos entre `@chicas_vip`, `@pronosticadores`, `@agencias_taquilla`, y `@jugadores`. Cada perfil debe contar con biografía realista, intereses, saldo, número de WhatsApp y avatar estandarizado (`pravatar` o `picsum`).
- **RN-DATA-02 (Canales)**: Mínimo 50 canales clasificados por categorías: Loterías (12), Pronósticos (12), Chicas VIP (10), Animalitos (8), Bingos/Rifas (8).
- **RN-DATA-03 (Grupos)**: Mínimo 50 grupos con códigos cortos únicos (`short_code`), bots asociados y políticas de acceso.
- **RN-DATA-04 (Juegos)**: Mínimo 50 juegos estructurados en un nuevo archivo `src/data/games.json` cargado a través de `localDB.ts`, con emojis, horarios de cierre y multiplicadores.
- **RN-DATA-05 (Premios y Apuestas)**: Mínimo 20 premios ganados con estados `cobrado` o `pendiente` y 25 tickets de apuestas en curso.

---

## 3. Contratos de Datos (TypeScript Interfaces)

```typescript
// Extensión de Mensaje de Chat con Paywall
export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  // Campos de Paywall multimedia
  is_locked?: boolean;
  unlock_price?: number;
  preview_url?: string;
  media_url?: string;
  media_type?: 'photo' | 'video';
  unlocked_by?: string[]; // IDs de usuarios que pagaron por el contenido
}

// Contrato de Juego / Sorteo Centralizado
export interface GameDrawItem {
  id: string;
  title: string;
  sub: string;
  emoji: string;
  category: 'animalitos' | 'quinielas' | 'minijuegos' | 'bingos' | 'parley' | 'rifas' | 'loterias';
  schedule?: string;
  multiplier?: number;
  min_bet?: number;
  max_prize?: number;
  active?: boolean;
  demo_type?: 'crash' | 'roulette' | 'lottery_picker' | 'iframe';
  demo_url?: string;
}

// Extensión de Post con Información de Suscripción del Autor
export interface PostAuthorPlan {
  id: string;
  name: string;
  price: number;
  billing_type: 'free' | 'mensual';
  benefits: string[];
}

export interface SocialPost {
  id: string;
  author_id: string;
  author_name: string;
  author_role?: string;
  content: string;
  media_type?: string;
  media_urls?: string[];
  likes_count: number;
  comments_count: number;
  tips_count?: number;
  created_at: string;
  tags?: string[];
  plans?: PostAuthorPlan[]; // Planes si el autor es creador/pronosticador
}
```

---

## 4. Persistencia Local (`localDB.ts`) y Archivos JSON
Se crean y expanden los siguientes repositorios de datos en `src/data/`:

| Archivo JSON | Cantidad de Registros | Descripción y Propósito |
| :--- | :--- | :--- |
| `src/data/users.json` | 55 registros | Perfiles completos de jugadores, pronosticadores y modelos VIP |
| `src/data/channels.json` | 52 registros | Canales de loterías, taquillas, pronósticos y creadoras |
| `src/data/groups.json` | 54 registros | Salas de apuestas, tertulias deportivas y chats exclusivos |
| `src/data/games.json` | 50 registros | Catálogo maestro de juegos en 7 categorías con demo triggers |
| `src/data/prizes.json` | 22 registros | Historial de premios cobrados con serial de taquilla |
| `src/data/bets.json` | 30 tickets | Jugadas activas y cerradas de parley, animalitos y triples |
| `src/data/news.json` | 20 noticias | Noticias del deporte, sorteos extraordinarios y taquillas |
| `src/data/posts.json` | 60 posts | Feed social activo con fotos, jugadas fijas y contenido premium |
| `src/data/chats.json` | 25 chats | Conversaciones con soporte, amigos, creadoras VIP y grupos |

---

## 5. Componentes Frontend Involucrados

| Componente | Ruta | Responsabilidad |
| :--- | :--- | :--- |
| `MessageItem.tsx` | `src/components/chat/MessageItem.tsx` | Renderizar mensajes de chat regulares y tarjetas paywall bloqueadas con botón de desbloqueo dinámico. |
| `PostItem.tsx` | `src/components/feed/PostItem.tsx` | Botón *"Suscribirse ⭐"* en posts de pronosticadores/VIP con apertura del modal `TierPlanSelector`. |
| `CrashDemoGame.tsx` | `src/components/games/CrashDemoGame.tsx` | Simulador interactivo de Crash Game con multiplicador en tiempo real, apuestas ficticias y sonido/feedback visual. |
| `GamesScreen` | `src/app/(tabs)/games/index.tsx` | Carga dinámica desde `games.json` de 50+ juegos con filtro de 7 pestañas y búsqueda instantánea. |
| `GameDetailScreen` | `src/app/(tabs)/games/[gameId].tsx` | Vista de detalle de juego con taquilla de apuestas simulada o simulador Crash integrado. |

---

## 6. Flujo de Usuario (UX)

### 6.1 Desbloqueo de Fotos/Videos VIP en Chat
```
[Usuario abre Chat con Joselin o Modelo VIP]
                  │
                  ▼
[Ve mensaje con foto censurada / blur: "Contenido Exclusivo - 15.00 VES"]
                  │
                  ▼
      [Clic en "Desbloquear Contenido"]
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
[Saldo Suficiente]   [Saldo Insuficiente]
        │                   │
        │ Débito de saldo   └─► [Toast: "Saldo insuficiente. Recarga en tu billetera"]
        ▼
[Se remueve el desenfoque y muestra la foto completa en alta definición]
```

### 6.2 Suscripción Rápida a Pronosticador desde el Muro
1. El usuario navega en el feed y ve una publicación de pronóstico deportivo de `@roberto_tips`.
2. Al lado del nombre del pronosticador se muestra el badge dorado *"Pronosticador Verificado"* y el botón *"Suscribirse"*.
3. Al hacer clic, se abre una tarjeta modal con los planes del pronosticador (Gratis, Premium 5.00 Bs, VIP 15.00 Bs).
4. El usuario elige un plan y se activa de inmediato la suscripción con confirmación Toast.

### 6.3 Simulación de Crash Game en Juegos
1. El usuario ingresa a **Juegos y Sorteos** y selecciona *"Aviator Rocket Crash"* o *"Flappy Bird Crypto"*.
2. Se renderiza el panel de juego demo con un balance demo inicial (ej. 500 créditos).
3. El usuario define el importe (ej. 25 créditos) y pulsa *"Lanzar Cohete"*.
4. El multiplicador se eleva dinámicamente (`1.10x... 1.85x... 3.20x...`).
5. El usuario pulsa *"Cobrar (Cash Out)"* y se le abonan las ganancias calculadas al instante. Si espera demasiado y ocurre el "CRASH", pierde la apuesta.

---

## 7. Criterios de Aceptación (Checklist de Verificación QA)
- [ ] **CA-01 (Volumen de Datos)**: Se comprueba la existencia de >= 50 usuarios, >= 50 canales, >= 50 grupos, >= 50 juegos y >= 20 premios en los archivos JSON de `src/data/`.
- [ ] **CA-02 (Carga Centralizada)**: `localDB.ts` inicializa y expone `games`, `users`, `channels`, `groups`, `bets`, `prizes` y `chats` sin pérdida de persistencia.
- [ ] **CA-03 (Paywall en Chat)**: El chat con creadoras VIP muestra elementos bloqueados y permite desbloquearlos debitando el saldo simulado de la billetera.
- [ ] **CA-04 (Suscripciones en Feed)**: Posts de autores con planes muestran el botón *"Suscribirse"* y abren la selección de planes.
- [ ] **CA-05 (Mini-juego Demo)**: El simulador de Crash Game permite apostar, ver multiplicadores dinámicos y cobrar ganancias ficticias.
- [ ] **CA-06 (Filtros en Juegos)**: La pantalla de Juegos permite filtrar las 7 categorías de juegos con contador exacto de ítems.
- [ ] **CA-07 (Compilación y Verificación)**: `npx tsc --noEmit` y `npm run build:web` compilan en verde con cero errores de tipado.

