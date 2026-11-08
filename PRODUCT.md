# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users
Usuarios de apuestas sociales, creadores de contenido (comunidades/grupos), administradores de taquillas virtuales (cajeros) y entusiastas del iGaming y deportes. Buscan un entorno confiable para interactuar, monetizar contenido y gestionar transacciones.

## Product Purpose
HandyBet es una plataforma social descentralizada orientada al iGaming. Combina interacciones de redes sociales (feeds, posts, canales) con micro-comunidades monetizadas (grupos) donde los administradores pueden cobrar suscripciones, configurar bots y gestionar apuestas virtuales mediante códigos QR y tickets físicos.

## Positioning
Una red social P2P donde la economía de la atención se traduce directamente en ingresos. Su diferenciador principal es el "Split de Transacciones" automático (90/10) y la integración nativa de taquillas de cajero con seguridad a nivel transaccional en Supabase, permitiendo que cualquier creador opere su propia agencia/comunidad monetizada con cero fricciones.

## Operating Context
Los usuarios operan en entornos móviles y web rápidos. Utilizan la app tanto para escanear tickets físicos en taquillas (cajeros), como para navegar el "Muro" (Feed) descubriendo pronósticos, noticias y contenido patrocinado. Las interacciones financieras y los saldos son virtuales y referenciales, dependiendo de la confianza y liquidación con el grupo administrativo.

## Capabilities and Constraints
- **Capacidades:** Enrutamiento profundo (Expo Router), Feed de 3 capas (Público, Relacional, Monetizado), Grupos con bots de autorespuesta (Ventas, Loterías, IA), y seguridad financiera RLS en base de datos.
- **Restricciones:** Los saldos son virtuales; la app no asume responsabilidad directa por el manejo de divisas. Existe un estricto control de edad (+18) para comunidades sensibles.

## Brand Commitments
- **Acuerdos:** Cumplimiento normativo mediante Acuerdos de Uso estrictos.
- **Identidad:** Integra un componente social fuerte (estilo Twitter/X) acoplado a un motor financiero seguro.

## Evidence on Hand
- Esquemas relacionales robustos en PostgreSQL (`bets`, `wallets`, `transactions`).
- Sistema de diseño funcional (`NativeWind` y componentes `HubLayout`).
