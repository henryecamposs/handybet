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
- **Publicación Multicanal:** Los administradores de canales y grupos pueden crear publicaciones asignadas a sus respectivos consorcios/salas. Estas publicaciones aparecen de forma inmediata en el feed principal y en el feed exclusivo del grupo/canal. Al redactar el post, los administradores eligen si publican a título personal o bajo la identidad y marca del canal o grupo.
- **Visualización de Feed de Canal o Grupo (Feed Search):** Mediante la ruta `/feed/search?id=`, los usuarios pueden visualizar la cartelera completa de posts oficiales y comunitarios de un canal o grupo. Si el usuario logueado posee permisos administrativos en esa entidad, se le habilita in-situ la creación de posts pre-configurados para ese destino.
- **Sistema de Seguimiento:** Permite seguir o dejar de seguir creadores directamente desde las tarjetas de publicación.
- **Opciones de Moderación Individual:** Los posts admiten control rápido de notificaciones y la acción de ocultar publicación ("No mostrar"). Ocultar un post genera un reemplazo temporal de la tarjeta con opción "Deshacer".
- **Compartido Avanzado:** Permite propagar publicaciones a destinos específicos categorizados en pestañas: *Grupos*, *Canales*, *Usuarios* y *Amigos*, con filtros de búsqueda rápida.
- **Guardados (Bookmarks):** Los usuarios pueden marcar elementos de interés (posts, sorteos, noticias) para verlos más tarde. Estos elementos se agrupan en un repositorio personal (`(tabs)/favorites/index`).
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

---

## 6. Perfil de Usuario y Preferencias
- **Extensibilidad de Perfil:** El perfil permite definir preferencias deportivas (categorías), configurar notificaciones y vincular el handle de WhatsApp.
- **Acuerdos de Uso:** Para garantizar la moderación y el cumplimiento normativo, los usuarios deben aceptar explícitamente el Acuerdo de Uso de la Red Social para poder modificar su perfil.

---

## 7. Gestión de Billeteras Virtuales y Responsabilidad
- **Saldos Referenciales:** Las billeteras (wallets) de la aplicación son entornos **virtuales**. Los saldos mostrados son **únicamente referenciales** y funcionan como un administrador contable de operaciones (compras, apuestas, premios).
- **Sincronización:** Para conocer un comportamiento real del saldo, el usuario debe sincronizar siempre con el grupo al que realiza los depósitos, interactuando con el administrador (ej. mediante comandos sociales como `@pagar`, `@cobrar`, `@saldo`).
- **Cláusula de Exención de Responsabilidad:** La aplicación no es responsable de las operaciones financieras, depósitos ni de las tasas de conversión en ningún tipo de moneda. Toda transacción y resguardo de fondos recae bajo la responsabilidad de la agencia, taquilla o grupo administrativo.

---

## 8. Canales Oficiales, Audiencias y Restricción de Edad (+18)
- **Audiencia Objetivo (Targeting):** Al crear un canal oficial, los consorcios seleccionan la audiencia objetivo (*Apostadores & Parley*, *Creadores & Media*, *Noticias & Actualidad*, *Citas & Entretenimiento*, *Comercio & Ventas*, *Público General*).
- **Control +18 (`is_18_plus`):** Interruptor de seguridad para canales con contenido sensible, juegos de azar o dinero real, restringiendo el acceso a mayores de 18 años.

---

## 9. Grupos y Bots de Autorespuesta
- **Integración de Bots de Autorespuesta (`configured_bots`):** Los administradores pueden integrar bots automatizados que interactúan en el chat del grupo:
  1. 🤖 *Bot ERP de Ventas*: Cotizaciones e inventario de productos.
  2. 🎲 *Bot de Loterías*: Verificación automática de billetes y sorteos.
  3. 💡 *Asistente IA*: Respuestas automatizadas a preguntas frecuentes.
  4. 📜 *Bot de Bienvenida*: Mensajes de normas e intenciones.
- **Desactivación por Defecto:** Todos los bots inician desactivados (`is_enabled: false`) al registrar un nuevo grupo para dar control total al creador.

---

## 10. Perfil de Miembro Extendidos e Intereses en Chips
- **Identificador Único (`@handle`):** Formato estricto `@username`.
- **Datos de Contacto:** Email, WhatsApp/Teléfono directo, Dirección física y Fecha de Nacimiento (con control estricto de mayoría de edad).
- **Redes Sociales:** Enlaces integrados de Instagram, Twitter/X y Telegram.
- **Chips de Intereses (`InterestChipsSelector`):** Selección múltiple de intereses dinámicos por categorías desde `interests.json` con opción de añadir etiquetas personalizadas.
