# HandyBet — Dominio del Negocio y Reglas

## 1. Grupos y Monetización
Cada grupo en HandyBet actúa como una micro-comunidad monetizada con reglas específicas:
- **Planes de Acceso (`group_plans`):** Los administradores pueden requerir tarifas de suscripción (pagos por uso, 24 horas, mensual o anual).
- **Reglas del Grupo (`group_rules`):** Ajustes de moderación, permisos de feeds, cuestionarios de onboarding y tarifas Pay-to-Post.
- **Onboarding de Miembros:** Al intentar unirse, los usuarios deben responder un cuestionario de intenciones y aceptar los términos y avisos legales antes de activarse.
- **Pay-to-Post (Anuncios):** Los posts patrocinados comerciales o reglas del grupo congelan las publicaciones en estado `pendiente_pago` hasta ingresar una referencia válida.
- **Split de Transacciones:** Las compras y pagos a grupos ejecutan un split de fondos automático: 90% para el administrador del grupo y 10% de comisión de servicio para la plataforma.

---

## 2. Feed Engine (El Muro)
El feed de publicaciones se compila dinámicamente mediante consultas estructuradas en PostgreSQL que filtran contenido a través de 3 capas:
1. **Capa Pública:** Posts cuya visibilidad sea `'todos'`.
2. **Capa Relacional:** Publicaciones de amigos directos, de "amigos de amigos" y actividad de grupos donde se es miembro activo.
3. **Capa de Monetización:** Inserción nativa de anuncios patrocinados marcados como `advertisement` y con estado de pago `pagado`.

---

## 3. Interacciones Sociales y Flujos Avanzados

HandyBet integra un motor social optimizado con comportamientos interactivos y retroalimentación mediante Toasts flotantes:
- **Sistema de Seguimiento:** Permite seguir o dejar de seguir creadores directamente desde las tarjetas de publicación.
- **Opciones de Moderación Individual:** Los posts admiten control rápido de notificaciones y la acción de ocultar publicación ("No mostrar"). Ocultar un post genera un reemplazo temporal de la tarjeta con opción "Deshacer".
- **Compartido Avanzado:** Permite propagar publicaciones a destinos específicos categorizados en pestañas: *Grupos*, *Canales*, *Usuarios* y *Amigos*, con filtros de búsqueda rápida.
- **Detalle de Publicaciones (Estilo Twitter):** En lugar de mostrar popups emergentes pesados, al hacer clic sobre el texto de la publicación o la imagen multimedia de la tarjeta se abre la pantalla detallada del post (`PostDetailView.tsx`) en el contenedor central principal de la pantalla, manteniendo el layout exterior y habilitando la redacción e hilado de respuestas cronológicas instantáneas.
- **Publicidad Contextual en Comentarios:** Si el visor de comentarios (`PostMediaViewer.tsx`) se abre para una publicación sin imágenes, la columna de medios renderiza un anuncio interactivo patrocinado con llamada a la acción y enlace externo dinámico.

---

## 4. Estructura de Datos y Seguridad (Supabase PostgreSQL)

El ecosistema opera sobre un esquema físico robusto de base de datos donde la seguridad y las transacciones atómicas son primordiales:
- **Seguridad Financiera RLS:** Las tablas críticas como `wallets`, `bets` y `transactions` tienen habilitado Row Level Security. Los usuarios comunes solo pueden leer sus propios saldos.
- **Funciones Transaccionales Seguras (RPCs):** Para evitar inconsistencias o explotación de saldo del lado del cliente, todas las mutaciones financieras se ejecutan en el servidor mediante funciones SQL con privilegios de definidor (`SECURITY DEFINER`):
  - `confirm_bet_cashier(...)`: Valida y debita de forma atómica el balance del monedero del jugador en el grupo asignado.
  - `payout_bet_cashier(...)`: Acredita ganancias al monedero o documenta retiros de Pago Móvil con auditoría de comprobantes.
  - `purchase_media_subscription(...)`: Adquiere planes de medios cobrando del saldo del grupo y activando membresías temporales.

---

## 5. Glosario de Términos
- **Taquilla/Agencia:** Entidad física o digital que gestiona cobros y pagos de tickets.
- **Cajero:** Usuario con permisos para escanear y liquidar tickets físicos de apuestas mediante códigos QR.
- **Muro (Feed):** Consola principal de descubrimiento donde se mezclan publicaciones sociales, pronósticos y anuncios.
- **Split de Wallet:** División de ingresos generados por los grupos para monetizar el contenido de los creadores de forma transparente.
- **WhatsApp Handle:** Identidad social (`@whatsapp`) obligatoria en el perfil de usuario para agilizar transacciones P2P externas.
