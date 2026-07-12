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

## 3. Glosario de Términos
- **Taquilla/Agencia:** Entidad física o digital que gestiona cobros y pagos de tickets.
- **Cajero:** Usuario con permisos para escanear y liquidar tickets físicos de apuestas mediante códigos QR.
- **Muro (Feed):** Consola principal de descubrimiento donde se mezclan publicaciones sociales, pronósticos y anuncios.
- **Split de Wallet:** División de ingresos generados por los grupos para monetizar el contenido de los creadores de forma transparente.
- **WhatsApp Handle:** Identidad social (`@whatsapp`) obligatoria en el perfil de usuario para agilizar transacciones P2P externas.
