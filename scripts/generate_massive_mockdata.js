const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

console.log('🚀 Iniciando generación masiva de mockdata para HandyBet...');

// ─── 1. USUARIOS (+55 Usuarios) ──────────────────────────────
const roles = ['player', 'tipster', 'vip_creator', 'cashier', 'admin', 'company_owner'];
const interestsList = [
  'apuestas', 'parley', 'lotto_activo', 'champions', 'animalitos',
  'bingo', 'fotos_vip', 'beisbol', 'nba', 'futve', 'crypto', 'ruleta'
];

const users = [
  // Admins & Fundadores
  {
    id: 'usr_admin',
    username: 'admin',
    password: 'admin',
    full_name: 'Administrador Principal',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'admin',
    bio: 'Superusuario y moderación de HandyBet 🛡️',
    interests: ['sistema', 'moderación', 'apuestas'],
    wallet_balance: 999999.00,
    followers_count: 520,
    following_count: 35,
    phone_whatsapp: '+584120000001',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'usr_henry',
    username: 'henry_campos',
    password: 'admin123',
    full_name: 'Henry Campos',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'admin',
    bio: 'Fundador de HandyBet 🎯 | Innovación en entretenimiento y apuestas digitales',
    interests: ['apuestas', 'tecnología', 'parley', 'champions'],
    wallet_balance: 24500.00,
    followers_count: 1450,
    following_count: 85,
    phone_whatsapp: '+584141112233',
    created_at: '2025-01-15T08:00:00Z'
  },
  // Chicas VIP & Creadoras (10)
  {
    id: 'usr_joselin',
    username: 'joselin_lagata',
    password: 'password123',
    full_name: 'Joselin La Gata',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'vip_creator',
    bio: 'Creadora de contenido VIP 🐾 | Sesiones exclusivas y chat privado',
    interests: ['fotos_vip', 'entretenimiento', 'eventos'],
    wallet_balance: 8750.50,
    followers_count: 24500,
    following_count: 42,
    phone_whatsapp: '+584129990011',
    created_at: '2025-02-10T14:30:00Z'
  },
  {
    id: 'usr_valeria',
    username: 'valeria_vip',
    password: 'password123',
    full_name: 'Valeria Gómez',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'vip_creator',
    bio: 'Modelo fitness & creadora digital 💖 Desbloquea mis sets privados en el chat',
    interests: ['fotos_vip', 'fitness', 'moda'],
    wallet_balance: 14200.00,
    followers_count: 18900,
    following_count: 60,
    phone_whatsapp: '+584148887766',
    created_at: '2025-02-12T10:00:00Z'
  },
  {
    id: 'usr_nicole',
    username: 'nicole_rossi',
    password: 'password123',
    full_name: 'Nicole Rossi',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'vip_creator',
    bio: 'Rubia apasionada por los deportes y la buena vida ✨ Canal VIP activo',
    interests: ['fotos_vip', 'deportes', 'viajes'],
    wallet_balance: 9340.00,
    followers_count: 15400,
    following_count: 55,
    phone_whatsapp: '+584163334455',
    created_at: '2025-02-20T11:00:00Z'
  },
  {
    id: 'usr_camila',
    username: 'camila_santos',
    password: 'password123',
    full_name: 'Camila Santos',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    role: 'vip_creator',
    bio: 'Bailarina y host de eventos 💃 Videos y contenido diario sin censura',
    interests: ['fotos_vip', 'baile', 'música'],
    wallet_balance: 6200.00,
    followers_count: 12200,
    following_count: 48,
    phone_whatsapp: '+584241239876',
    created_at: '2025-03-01T15:00:00Z'
  },
  {
    id: 'usr_isabella',
    username: 'isabella_luxe',
    password: 'password123',
    full_name: 'Isabella Morales',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'vip_creator',
    bio: 'Tu compañía favorita en HandyBet 💋 Pide fotos personalizadas al DM',
    interests: ['fotos_vip', 'entretenimiento', 'citas'],
    wallet_balance: 11050.00,
    followers_count: 21000,
    following_count: 38,
    phone_whatsapp: '+584125556677',
    created_at: '2025-03-05T09:00:00Z'
  },
  {
    id: 'usr_andrea',
    username: 'andrea_caracas',
    password: 'password123',
    full_name: 'Andrea Castillo',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'vip_creator',
    bio: 'Caraqueña 100% 🇻🇪 Fotos de estudio y detrás de cámara exclusivo',
    interests: ['fotos_vip', 'modelaje'],
    wallet_balance: 7800.00,
    followers_count: 9800,
    following_count: 70,
    phone_whatsapp: '+584149998811',
    created_at: '2025-03-10T12:00:00Z'
  },
  {
    id: 'usr_gabriela',
    username: 'gaby_sweet',
    password: 'password123',
    full_name: 'Gabriela Mendoza',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150',
    role: 'vip_creator',
    bio: 'Chica gamer y cosplayer 🎮 Fotos exclusivas para suscriptores',
    interests: ['fotos_vip', 'gaming', 'anime'],
    wallet_balance: 8400.00,
    followers_count: 14000,
    following_count: 90,
    phone_whatsapp: '+584167778899',
    created_at: '2025-03-15T18:00:00Z'
  },
  {
    id: 'usr_stefany',
    username: 'stefany_blond',
    password: 'password123',
    full_name: 'Stefany Rivas',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    role: 'vip_creator',
    bio: 'Abogada de día, creadora de noche 🥂 Descubre mi lado atrevido',
    interests: ['fotos_vip', 'fiestas', 'viajes'],
    wallet_balance: 13500.00,
    followers_count: 17600,
    following_count: 45,
    phone_whatsapp: '+584124443322',
    created_at: '2025-03-20T16:00:00Z'
  },
  {
    id: 'usr_natalia',
    username: 'nathy_queen',
    password: 'password123',
    full_name: 'Natalia Peña',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'vip_creator',
    bio: 'Reina de belleza y anfitriona en eventos de póker 👑 Contenido VIP',
    interests: ['fotos_vip', 'poker', 'lujo'],
    wallet_balance: 19800.00,
    followers_count: 28400,
    following_count: 110,
    phone_whatsapp: '+584245551122',
    created_at: '2025-03-25T14:00:00Z'
  },
  {
    id: 'usr_carolina',
    username: 'caro_glam',
    password: 'password123',
    full_name: 'Carolina Herrera V.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'vip_creator',
    bio: 'Glamour, moda y contenido premium ✨ Suscríbete para chat directo 24/7',
    interests: ['fotos_vip', 'glamour', 'moda'],
    wallet_balance: 15400.00,
    followers_count: 22100,
    following_count: 65,
    phone_whatsapp: '+584126669988',
    created_at: '2025-04-01T20:00:00Z'
  },

  // Pronosticadores / Tipsters (12)
  {
    id: 'usr_roberto',
    username: 'roberto_tips',
    password: 'password123',
    full_name: 'Roberto López (El Rey del Parley)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'tipster',
    bio: 'Pronosticador certificado con 82% de efectividad en MLB y Fútbol Europeo 📊',
    interests: ['parley', 'beisbol', 'champions'],
    wallet_balance: 35000.00,
    followers_count: 18500,
    following_count: 32,
    phone_whatsapp: '+584145550011',
    created_at: '2025-01-20T08:00:00Z'
  },
  {
    id: 'usr_don_animalito',
    username: 'don_animalito',
    password: 'password123',
    full_name: 'Don Animalito Oficial',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'tipster',
    bio: 'El matemático de los animalitos 🧮 Datos fijos para Lotto Activo y La Granjita',
    interests: ['lotto_activo', 'animalitos', 'ruleta'],
    wallet_balance: 19400.00,
    followers_count: 31200,
    following_count: 20,
    phone_whatsapp: '+584128889900',
    created_at: '2025-01-22T09:00:00Z'
  },
  {
    id: 'usr_brujo_triples',
    username: 'el_brujo_triples',
    password: 'password123',
    full_name: 'El Brujo de los Triples',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'tipster',
    bio: 'Especialista en Triples de Zulia, Chance y Táchira 🔮 Acertando día a día',
    interests: ['loterias', 'apuestas'],
    wallet_balance: 12800.00,
    followers_count: 25400,
    following_count: 15,
    phone_whatsapp: '+584162223344',
    created_at: '2025-01-25T11:00:00Z'
  },
  {
    id: 'usr_parley_master',
    username: 'parley_master_ve',
    password: 'password123',
    full_name: 'Marcos Parley Master',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'tipster',
    bio: 'Combinadas de alto rendimiento (cuotas 3.50 a 10.00) 📈 Sígueme para ganar',
    interests: ['parley', 'nba', 'champions'],
    wallet_balance: 28900.00,
    followers_count: 16800,
    following_count: 40,
    phone_whatsapp: '+584241113355',
    created_at: '2025-02-01T10:00:00Z'
  },
  {
    id: 'usr_profesor_fija',
    username: 'profesor_la_fija',
    password: 'password123',
    full_name: 'Profesor La Fija',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    role: 'tipster',
    bio: 'Análisis estadístico sabatino y dominical para carreras hípicas y parley 🏇',
    interests: ['parley', 'apuestas'],
    wallet_balance: 16500.00,
    followers_count: 14200,
    following_count: 22,
    phone_whatsapp: '+584147771122',
    created_at: '2025-02-05T14:00:00Z'
  },
  {
    id: 'usr_hipismo_gold',
    username: 'hipismo_gold',
    password: 'password123',
    full_name: 'César Hipismo Gold',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'tipster',
    bio: 'Datos y líneas para el 5y6 nacional de La Rinconada 🐎 ¡Líneas garantizadas!',
    interests: ['apuestas', 'parley'],
    wallet_balance: 21300.00,
    followers_count: 19800,
    following_count: 30,
    phone_whatsapp: '+584127776655',
    created_at: '2025-02-10T11:00:00Z'
  },
  {
    id: 'usr_analista_nba',
    username: 'nba_picks_pro',
    password: 'password123',
    full_name: 'Gabriel NBA Picks',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'tipster',
    bio: 'Over/Under y hándicaps diarios de la NBA 🏀 78% de aciertos esta temporada',
    interests: ['nba', 'parley'],
    wallet_balance: 18450.00,
    followers_count: 11200,
    following_count: 18,
    phone_whatsapp: '+584168884433',
    created_at: '2025-02-15T15:00:00Z'
  },
  {
    id: 'usr_futbol_picks',
    username: 'futve_y_europa',
    password: 'password123',
    full_name: 'Alejandro Golazo Picks',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'tipster',
    bio: 'Especialista en Liga FUTVE, Champions League y Copa Libertadores ⚽',
    interests: ['futve', 'champions', 'parley'],
    wallet_balance: 14200.00,
    followers_count: 13500,
    following_count: 25,
    phone_whatsapp: '+584143336699',
    created_at: '2025-02-20T17:00:00Z'
  },
  {
    id: 'usr_selva_guru',
    username: 'selva_guru',
    password: 'password123',
    full_name: 'El Gurú de la Selva',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'tipster',
    bio: 'Pronósticos exclusivos para Selva Plus y Ruleta Activa 🦁 El león manda',
    interests: ['animalitos', 'lotto_activo'],
    wallet_balance: 9800.00,
    followers_count: 16700,
    following_count: 14,
    phone_whatsapp: '+584121118844',
    created_at: '2025-03-01T08:00:00Z'
  },
  {
    id: 'usr_triple_zulia',
    username: 'zulia_exacto',
    password: 'password123',
    full_name: 'Zulia y Chance Exacto',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'tipster',
    bio: 'Jugadas directas sin caída para las loterías más jugadas de Venezuela 🎯',
    interests: ['loterias', 'apuestas'],
    wallet_balance: 22100.00,
    followers_count: 24100,
    following_count: 19,
    phone_whatsapp: '+584247770022',
    created_at: '2025-03-05T12:00:00Z'
  },
  {
    id: 'usr_tenis_ace',
    username: 'tenis_ace_tips',
    password: 'password123',
    full_name: 'Mateo Tenis Picks',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    role: 'tipster',
    bio: 'Grand Slams y torneos ATP/WTA 🎾 Especialista en apuestas en vivo',
    interests: ['parley', 'apuestas'],
    wallet_balance: 11900.00,
    followers_count: 8900,
    following_count: 33,
    phone_whatsapp: '+584164447788',
    created_at: '2025-03-10T14:00:00Z'
  },
  {
    id: 'usr_crypto_bets',
    username: 'crypto_bets_ve',
    password: 'password123',
    full_name: 'Daniel Crypto & Bets',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'tipster',
    bio: 'Crash games, Plinko y pronósticos con USDT y VES 🪙 Multiplica seguro',
    interests: ['crypto', 'ruleta', 'apuestas'],
    wallet_balance: 45600.00,
    followers_count: 27800,
    following_count: 45,
    phone_whatsapp: '+584120009988',
    created_at: '2025-03-15T19:00:00Z'
  },

  // Taquilleros & Agencias Físicas (10)
  {
    id: 'usr_diego',
    username: 'diego_herrera',
    password: 'password123',
    full_name: 'Diego Herrera (La Imaginaria)',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'company_owner',
    bio: 'Director General de Agencias La Imaginaria | Red líder de taquillas físicas',
    interests: ['taquillas', 'loterias', 'animalitos'],
    wallet_balance: 125000.00,
    followers_count: 8900,
    following_count: 120,
    phone_whatsapp: '+584142220099',
    created_at: '2025-01-10T07:00:00Z'
  },
  {
    id: 'usr_pedro',
    username: 'pedro_cajero',
    password: 'password123',
    full_name: 'Pedro Ramírez',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'cashier',
    bio: 'Cajero principal - Taquilla Caracas Centro 🎟️ Pagos al instante',
    interests: ['taquillas', 'apuestas'],
    wallet_balance: 5400.00,
    followers_count: 3200,
    following_count: 15,
    phone_whatsapp: '+584123334411',
    created_at: '2025-01-12T08:00:00Z'
  },
  {
    id: 'usr_laura',
    username: 'laura_valencia',
    password: 'password123',
    full_name: 'Laura Méndez',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'cashier',
    bio: 'Encargada Taquillas Valencia Norte | Recargas Pago Móvil y Efectivo 💵',
    interests: ['taquillas', 'lotto_activo'],
    wallet_balance: 8900.00,
    followers_count: 4100,
    following_count: 28,
    phone_whatsapp: '+584145558833',
    created_at: '2025-01-18T10:00:00Z'
  },
  {
    id: 'usr_carmen',
    username: 'carmen_maracaibo',
    password: 'password123',
    full_name: 'Carmen Urdaneta',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'cashier',
    bio: 'Taquilla 5 de Julio Maracaibo ☀️ Atención rápida y verificación de tickets',
    interests: ['taquillas', 'loterias'],
    wallet_balance: 6700.00,
    followers_count: 2900,
    following_count: 14,
    phone_whatsapp: '+584161112255',
    created_at: '2025-01-25T11:00:00Z'
  },
  {
    id: 'usr_javier',
    username: 'javier_barquisimeto',
    password: 'password123',
    full_name: 'Javier Colmenares',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'cashier',
    bio: 'Agencia Centro Lara Barquisimeto | Tu jugada segura en HandyBet',
    interests: ['taquillas', 'parley'],
    wallet_balance: 9100.00,
    followers_count: 3600,
    following_count: 21,
    phone_whatsapp: '+584245559988',
    created_at: '2025-02-01T09:00:00Z'
  },
  {
    id: 'usr_patricia',
    username: 'patricia_maracay',
    password: 'password123',
    full_name: 'Patricia Silva',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'cashier',
    bio: 'Taquilla Las Delicias Maracay 🎲 Cobro de premios sin comisiones',
    interests: ['taquillas', 'animalitos'],
    wallet_balance: 7200.00,
    followers_count: 3400,
    following_count: 18,
    phone_whatsapp: '+584129994433',
    created_at: '2025-02-10T12:00:00Z'
  },
  {
    id: 'usr_miguel',
    username: 'miguel_puerto_ordaz',
    password: 'password123',
    full_name: 'Miguel Ángel Rivas',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'cashier',
    bio: 'Taquilla Alta Vista Puerto Ordaz 🏭 Pagos inmediatos en Bs y USDT',
    interests: ['taquillas', 'crypto'],
    wallet_balance: 11500.00,
    followers_count: 2800,
    following_count: 24,
    phone_whatsapp: '+584148882211',
    created_at: '2025-02-15T14:00:00Z'
  },
  {
    id: 'usr_elena',
    username: 'elena_lecheria',
    password: 'password123',
    full_name: 'Elena Fuentes',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'cashier',
    bio: 'Agencia Plaza Mayor Lechería ⛵ Terminal oficial de HandyBet',
    interests: ['taquillas', 'loterias'],
    wallet_balance: 8300.00,
    followers_count: 3900,
    following_count: 19,
    phone_whatsapp: '+584163337711',
    created_at: '2025-02-20T16:00:00Z'
  },
  {
    id: 'usr_raul',
    username: 'raul_san_cristobal',
    password: 'password123',
    full_name: 'Raúl Zambrano',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'cashier',
    bio: 'Taquilla Barrio Obrero San Cristóbal 🏔️ Sellado de lotería Táchira y Zulia',
    interests: ['taquillas', 'loterias'],
    wallet_balance: 14800.00,
    followers_count: 4500,
    following_count: 22,
    phone_whatsapp: '+584247774433',
    created_at: '2025-02-28T09:00:00Z'
  },
  {
    id: 'usr_yaneth',
    username: 'yaneth_margarita',
    password: 'password123',
    full_name: 'Yaneth Marcano',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'cashier',
    bio: 'Taquilla Porlamar Isla de Margarita 🏖️ Atención al turista y residente',
    interests: ['taquillas', 'bingo'],
    wallet_balance: 9600.00,
    followers_count: 3100,
    following_count: 26,
    phone_whatsapp: '+584125550099',
    created_at: '2025-03-05T13:00:00Z'
  },

  // Jugadores & Comunidad (+23)
  {
    id: 'usr_carlos',
    username: 'carlos_ruiz',
    password: 'password123',
    full_name: 'Carlos Ruiz',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'player',
    bio: 'Aficionado al béisbol y a los triples de la tarde ⚾ Ganador de premios HandyBet',
    interests: ['parley', 'beisbol', 'lotto_activo'],
    wallet_balance: 5450.00,
    followers_count: 340,
    following_count: 45,
    phone_whatsapp: '+584141234567',
    created_at: '2025-01-20T08:00:00Z'
  },
  {
    id: 'usr_maria',
    username: 'maria_bet',
    password: 'password123',
    full_name: 'María Fernández',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    role: 'player',
    bio: 'Jugadora de bingo y animalitos 🦁 Fanática de las quinielas de fútbol',
    interests: ['bingo', 'animalitos', 'champions'],
    wallet_balance: 1820.00,
    followers_count: 190,
    following_count: 62,
    phone_whatsapp: '+584129876543',
    created_at: '2025-01-22T10:00:00Z'
  },
  {
    id: 'usr_gabriel',
    username: 'gabo_parley',
    password: 'password123',
    full_name: 'Gabriel Torres',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'player',
    bio: 'El rey de las combinadas locas 🤑 Si no paga 10x no me interesa',
    interests: ['parley', 'nba', 'champions'],
    wallet_balance: 4200.00,
    followers_count: 510,
    following_count: 120,
    phone_whatsapp: '+584164567890',
    created_at: '2025-02-01T12:00:00Z'
  },
  {
    id: 'usr_valentina',
    username: 'valen_suerte',
    password: 'password123',
    full_name: 'Valentina Rojas',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'player',
    bio: 'La suerte me sonríe siempre 🍀 Suscriptora de canales VIP y jugadora de bingo',
    interests: ['bingo', 'fotos_vip', 'animalitos'],
    wallet_balance: 3100.00,
    followers_count: 270,
    following_count: 58,
    phone_whatsapp: '+584243210987',
    created_at: '2025-02-05T15:00:00Z'
  },
  {
    id: 'usr_yorman',
    username: 'yorman_el_duro',
    password: 'password123',
    full_name: 'Yorman Bastidas',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'player',
    bio: 'Apostando desde Petare con fe y cabeza fría 👊 Fijo con los animalitos',
    interests: ['animalitos', 'lotto_activo', 'parley'],
    wallet_balance: 1450.00,
    followers_count: 420,
    following_count: 75,
    phone_whatsapp: '+584145556611',
    created_at: '2025-02-12T09:00:00Z'
  },
  {
    id: 'usr_luis_alfonso',
    username: 'luis_alfonso_picks',
    password: 'password123',
    full_name: 'Luis Alfonso Salazar',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'player',
    bio: 'Ingeniero y analista de números en mis tiempos libres 📐',
    interests: ['loterias', 'champions'],
    wallet_balance: 6780.00,
    followers_count: 310,
    following_count: 40,
    phone_whatsapp: '+584127771199',
    created_at: '2025-02-18T14:00:00Z'
  },
  {
    id: 'usr_andres_champions',
    username: 'andres_ucl',
    password: 'password123',
    full_name: 'Andrés Morales',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'player',
    bio: 'Fanático del Real Madrid y apostador de Champions ⚪ Hala Madrid',
    interests: ['champions', 'parley', 'futve'],
    wallet_balance: 8900.00,
    followers_count: 650,
    following_count: 88,
    phone_whatsapp: '+584140003322',
    created_at: '2025-02-25T11:00:00Z'
  },
  {
    id: 'usr_daniella',
    username: 'dani_poker',
    password: 'password123',
    full_name: 'Daniella Briceño',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'player',
    bio: 'Texas Holdem y Crash games 🚀 Cazadora de multiplicadores altos',
    interests: ['ruleta', 'crypto', 'apuestas'],
    wallet_balance: 12400.00,
    followers_count: 890,
    following_count: 95,
    phone_whatsapp: '+584168880011',
    created_at: '2025-03-01T16:00:00Z'
  },
  {
    id: 'usr_samuel',
    username: 'samuel_mlb',
    password: 'password123',
    full_name: 'Samuel Vargas',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'player',
    bio: 'Leones del Caracas en invierno, Yankees en verano ⚾ Parley todos los días',
    interests: ['beisbol', 'parley'],
    wallet_balance: 3890.00,
    followers_count: 280,
    following_count: 50,
    phone_whatsapp: '+584241118833',
    created_at: '2025-03-05T10:00:00Z'
  },
  {
    id: 'usr_fernanda',
    username: 'fer_bingos',
    password: 'password123',
    full_name: 'Fernanda Ortiz',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'player',
    bio: 'No me pierdo ningún bingo de las 9PM 🎫 La suerte es de los que perseveran',
    interests: ['bingo', 'rifas'],
    wallet_balance: 2150.00,
    followers_count: 175,
    following_count: 39,
    phone_whatsapp: '+584123330088',
    created_at: '2025-03-10T15:00:00Z'
  },
  {
    id: 'usr_javier_kino',
    username: 'javier_kino',
    password: 'password123',
    full_name: 'Javier Pacheco',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'player',
    bio: 'Jugador del Gran Kino y sorteos semanales 🏆',
    interests: ['loterias', 'rifas'],
    wallet_balance: 1450.00,
    followers_count: 120,
    following_count: 30,
    phone_whatsapp: '+584147775522',
    created_at: '2025-03-12T12:00:00Z'
  },
  {
    id: 'usr_claudia',
    username: 'clau_lucky',
    password: 'password123',
    full_name: 'Claudia Medina',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'player',
    bio: 'Me encanta compartir jugadas ganadoras en el muro 📱',
    interests: ['animalitos', 'fotos_vip'],
    wallet_balance: 4120.00,
    followers_count: 310,
    following_count: 65,
    phone_whatsapp: '+584160002233',
    created_at: '2025-03-15T09:00:00Z'
  },
  {
    id: 'usr_ricardo',
    username: 'richi_parley',
    password: 'password123',
    full_name: 'Ricardo Espinoza',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    role: 'player',
    bio: 'Directo al grano: altas y bajas de goles en ligas europeas ⚽',
    interests: ['parley', 'champions'],
    wallet_balance: 5600.00,
    followers_count: 490,
    following_count: 70,
    phone_whatsapp: '+584249991144',
    created_at: '2025-03-18T17:00:00Z'
  },
  {
    id: 'usr_jessica',
    username: 'jessi_vip_fan',
    password: 'password123',
    full_name: 'Jéssica Lucena',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    role: 'player',
    bio: 'Fan #1 de Joselin y Valeria 💖 Apoyando a las creadoras de HandyBet',
    interests: ['fotos_vip', 'entretenimiento'],
    wallet_balance: 2900.00,
    followers_count: 220,
    following_count: 44,
    phone_whatsapp: '+584128881133',
    created_at: '2025-03-20T11:00:00Z'
  },
  {
    id: 'usr_gustavo',
    username: 'tavo_apuesta',
    password: 'password123',
    full_name: 'Gustavo Adolfo Prado',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    role: 'player',
    bio: 'El 11-GATO y el 22-CAMELLO nunca me fallan en la Granjita 🐪',
    interests: ['animalitos', 'lotto_activo'],
    wallet_balance: 1980.00,
    followers_count: 260,
    following_count: 52,
    phone_whatsapp: '+584144440011',
    created_at: '2025-03-22T13:00:00Z'
  },
  {
    id: 'usr_paola',
    username: 'pao_fitness',
    password: 'password123',
    full_name: 'Paola Andrea Silva',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150',
    role: 'player',
    bio: 'Vida fitness y apuestas sanas los fines de semana 💪',
    interests: ['fitness', 'champions'],
    wallet_balance: 3400.00,
    followers_count: 410,
    following_count: 80,
    phone_whatsapp: '+584165559922',
    created_at: '2025-03-25T16:00:00Z'
  },
  {
    id: 'usr_victor',
    username: 'victor_triples',
    password: 'password123',
    full_name: 'Víctor Manuel Gil',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    role: 'player',
    bio: 'Buscando el número millonario todos los días en Chance y Zulia 💸',
    interests: ['loterias', 'apuestas'],
    wallet_balance: 4780.00,
    followers_count: 350,
    following_count: 48,
    phone_whatsapp: '+584242224466',
    created_at: '2025-03-28T10:00:00Z'
  },
  {
    id: 'usr_adriana',
    username: 'adri_maracay',
    password: 'password123',
    full_name: 'Adriana Colmenares',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    role: 'player',
    bio: 'Amante de los animales y de los sorteos de la mañana 🐾',
    interests: ['animalitos', 'bingo'],
    wallet_balance: 1670.00,
    followers_count: 180,
    following_count: 36,
    phone_whatsapp: '+584126663300',
    created_at: '2025-04-01T14:00:00Z'
  },
  {
    id: 'usr_rodrigo',
    username: 'rodrigo_futve',
    password: 'password123',
    full_name: 'Rodrigo Benítez',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'player',
    bio: 'Caracas FC a muerte 🔴 Apuestas de fútbol local e internacional',
    interests: ['futve', 'champions'],
    wallet_balance: 3120.00,
    followers_count: 290,
    following_count: 54,
    phone_whatsapp: '+584149991188',
    created_at: '2025-04-05T18:00:00Z'
  },
  {
    id: 'usr_mariana',
    username: 'mariana_loto',
    password: 'password123',
    full_name: 'Mariana Duarte',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'player',
    bio: '¡A celebrar cuando caiga el pozo del Gran Kino! 🎉',
    interests: ['loterias', 'rifas'],
    wallet_balance: 2850.00,
    followers_count: 210,
    following_count: 42,
    phone_whatsapp: '+584167770044',
    created_at: '2025-04-08T09:00:00Z'
  },
  {
    id: 'usr_alberto',
    username: 'beto_parley',
    password: 'password123',
    full_name: 'Alberto José Núñez',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    role: 'player',
    bio: 'Picks de NBA noche tras noche 🏀 El baloncesto es dinero seguro',
    interests: ['nba', 'parley'],
    wallet_balance: 6200.00,
    followers_count: 460,
    following_count: 67,
    phone_whatsapp: '+584248882299',
    created_at: '2025-04-10T21:00:00Z'
  },
  {
    id: 'usr_sofia',
    username: 'sofi_ruleta',
    password: 'password123',
    full_name: 'Sofía Castellanos',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    role: 'player',
    bio: 'Ruleta activa y juegos rápidos 🎰 Me gusta la adrenalina',
    interests: ['ruleta', 'crypto'],
    wallet_balance: 3890.00,
    followers_count: 340,
    following_count: 60,
    phone_whatsapp: '+584121113377',
    created_at: '2025-04-12T11:00:00Z'
  },
  {
    id: 'usr_kevin',
    username: 'kevin_crash',
    password: 'password123',
    full_name: 'Kevin Alexander Pinto',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'player',
    bio: 'Especialista en Crash Games 🚀 Salgo siempre en 2.0x o 3.0x',
    interests: ['crypto', 'ruleta'],
    wallet_balance: 7850.00,
    followers_count: 530,
    following_count: 72,
    phone_whatsapp: '+584143339900',
    created_at: '2025-04-15T16:00:00Z'
  }
];

fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(users, null, 2));
console.log(`✅ users.json generado con ${users.length} usuarios.`);

// ─── 2. CANALES (+52 Canales) ─────────────────────────────────
const channels = [
  // Loterías & Agencias (10)
  {
    id: 'ch_imaginaria',
    name: 'Agencias La Imaginaria',
    type: 'taquillas',
    owner_id: 'usr_diego',
    description: 'La red más grande de agencias y taquillas de loterías y animalitos de Venezuela 🇻🇪',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 18500,
    plans: [
      { id: 'plan_imaginaria_free', name: 'Cliente General', price: 0, billing_type: 'free', benefits: ['Consulta de resultados', 'Soporte taquilla'] },
      { id: 'plan_imaginaria_vip', name: 'Agenciero VIP', price: 10.00, billing_type: 'mensual', benefits: ['Comisiones preferenciales', 'Reportes de ventas'] }
    ],
    created_at: '2025-01-10T07:00:00Z'
  },
  {
    id: 'ch_loteria_nacional',
    name: 'Lotería Nacional Resultados',
    type: 'loterias',
    owner_id: 'usr_henry',
    description: 'Canal oficial con transmisiones en directo y boletines oficiales de sorteos nacionales 🎯',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 32000,
    plans: [],
    created_at: '2025-01-05T07:00:00Z'
  },
  {
    id: 'ch_lotto_activo_oficial',
    name: 'Lotto Activo Resultados',
    type: 'loterias',
    owner_id: 'usr_diego',
    description: 'Resultados al segundo de la ruleta de la suerte (9:00 AM a 7:00 PM) 🦁',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 45000,
    plans: [],
    created_at: '2025-01-08T08:00:00Z'
  },
  {
    id: 'ch_la_granjita_oficial',
    name: 'La Granjita Oficial',
    type: 'loterias',
    owner_id: 'usr_diego',
    description: 'Sorteos en vivo de La Granjita. Consulta las jugadas premiadas y estadísticas 🐔',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 28900,
    plans: [],
    created_at: '2025-01-12T09:00:00Z'
  },
  {
    id: 'ch_triple_zulia_oficial',
    name: 'Triple Zulia En Vivo',
    type: 'loterias',
    owner_id: 'usr_triple_zulia',
    description: 'Sorteos A, B y Zodiacal de Triple Zulia (12:45 PM y 7:00 PM) 🎰',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 21500,
    plans: [],
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: 'ch_triple_chance_oficial',
    name: 'Triple Chance Astral',
    type: 'loterias',
    owner_id: 'usr_diego',
    description: 'Resultados y transmisiones de Triple Chance y Chance Astral 🔮',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 19800,
    plans: [],
    created_at: '2025-01-18T11:00:00Z'
  },
  {
    id: 'ch_triple_tachira_oficial',
    name: 'Lotería del Táchira',
    type: 'loterias',
    owner_id: 'usr_raul',
    description: 'Canal oficial de la Lotería del Táchira. El juego más tradicional de los andes 🏔️',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 17200,
    plans: [],
    created_at: '2025-01-20T12:00:00Z'
  },
  {
    id: 'ch_selva_plus_oficial',
    name: 'Selva Plus Animalitos',
    type: 'loterias',
    owner_id: 'usr_selva_guru',
    description: 'Ruleta Selva Plus: animales premiados, tabla de pagos y multiplicadores 🐯',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 14600,
    plans: [],
    created_at: '2025-01-25T13:00:00Z'
  },
  {
    id: 'ch_ruleta_activa_oficial',
    name: 'Ruleta Activa Internacional',
    type: 'loterias',
    owner_id: 'usr_diego',
    description: 'La ruleta con sorteos cada hora. Datos y análisis estadístico en vivo 🎡',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 16100,
    plans: [],
    created_at: '2025-02-01T14:00:00Z'
  },
  {
    id: 'ch_gran_kino_oficial',
    name: 'Gran Kino Táchira',
    type: 'loterias',
    owner_id: 'usr_henry',
    description: 'El juego que premia a toda la familia venezolana. Pozo acumulado millonario 💎',
    avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150',
    is_public: true,
    subscribers_count: 38000,
    plans: [],
    created_at: '2025-02-05T15:00:00Z'
  },

  // Chicas VIP & Creadoras (10)
  {
    id: 'ch_joselin',
    name: 'Joselin La Gata VIP',
    type: 'media_sharing',
    owner_id: 'usr_joselin',
    description: 'Contenido exclusivo de videos, fotos y chat directo con Joselin 💖',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    is_public: true,
    subscribers_count: 8900,
    plans: [
      { id: 'plan_jos_free', name: 'Gratis', price: 0, billing_type: 'free', benefits: ['Fotos públicas', 'Comentarios en muro'] },
      { id: 'plan_jos_medium', name: 'Fan Plata', price: 4.99, billing_type: 'mensual', benefits: ['Galería detrás de cámaras', 'Insignia de fan'] },
      { id: 'plan_jos_pro', name: 'VIP Oro', price: 14.99, billing_type: 'mensual', benefits: ['Chat directo 24/7', 'Videos exclusivos', 'Descuento en paywall'] }
    ],
    created_at: '2025-02-10T14:30:00Z'
  },
  {
    id: 'ch_valeria',
    name: 'Valeria Gómez Fitness VIP',
    type: 'media_sharing',
    owner_id: 'usr_valeria',
    description: 'Rutinas, bikinis y sesiones en privado para fans selectos 🔥',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    is_public: true,
    subscribers_count: 7400,
    plans: [
      { id: 'plan_val_free', name: 'Gratis', price: 0, billing_type: 'free', benefits: ['Historias públicas'] },
      { id: 'plan_val_vip', name: 'VIP Elite', price: 9.99, billing_type: 'mensual', benefits: ['Sets de fotos completos', 'Chat privado'] }
    ],
    created_at: '2025-02-12T10:00:00Z'
  },
  {
    id: 'ch_nicole',
    name: 'Nicole Rossi Privé',
    type: 'media_sharing',
    owner_id: 'usr_nicole',
    description: 'Fotos de pasarela, lencería y transmisiones en vivo solo para miembros ✨',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_public: true,
    subscribers_count: 6200,
    plans: [
      { id: 'plan_nic_medium', name: 'Silver Pass', price: 6.99, billing_type: 'mensual', benefits: ['Galería HD', 'Reacciones exclusivas'] },
      { id: 'plan_nic_pro', name: 'Black Diamond', price: 19.99, billing_type: 'mensual', benefits: ['Llamada mensual', 'Audio personalizado', 'Contenido sin censura'] }
    ],
    created_at: '2025-02-20T11:00:00Z'
  },
  {
    id: 'ch_camila',
    name: 'Camila Santos Dance & Glam',
    type: 'media_sharing',
    owner_id: 'usr_camila',
    description: 'Coreografías sensuales y acceso a ensayos privados 💃',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    is_public: true,
    subscribers_count: 5100,
    plans: [
      { id: 'plan_cam_free', name: 'Gratis', price: 0, billing_type: 'free', benefits: ['Posts diarios'] },
      { id: 'plan_cam_vip', name: 'Suscripción VIP', price: 7.99, billing_type: 'mensual', benefits: ['Videos completos', 'Chat privado'] }
    ],
    created_at: '2025-03-01T15:00:00Z'
  },
  {
    id: 'ch_isabella',
    name: 'Isabella Morales Romance',
    type: 'media_sharing',
    owner_id: 'usr_isabella',
    description: 'Tu crush virtual 💋 Fotos exclusivas de buenos días y buenas noches',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    is_public: true,
    subscribers_count: 8100,
    plans: [
      { id: 'plan_isa_vip', name: 'Club de Fans', price: 8.50, billing_type: 'mensual', benefits: ['Fotos exclusivas', 'Chat desbloqueado'] }
    ],
    created_at: '2025-03-05T09:00:00Z'
  },
  {
    id: 'ch_andrea',
    name: 'Andrea Caracas VIP',
    type: 'media_sharing',
    owner_id: 'usr_andrea',
    description: 'Lo mejor de Caracas en fotos y sesiones de playa exclusivas 🏖️',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    is_public: true,
    subscribers_count: 4200,
    plans: [
      { id: 'plan_and_vip', name: 'Playa VIP', price: 5.99, billing_type: 'mensual', benefits: ['Galería de bikinis', 'Direct Message'] }
    ],
    created_at: '2025-03-10T12:00:00Z'
  },
  {
    id: 'ch_gabriela',
    name: 'Gaby Gaming & Cosplay',
    type: 'media_sharing',
    owner_id: 'usr_gabriela',
    description: 'Cosplays atrevidos y streamings jugando con fans 🎮',
    avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150',
    is_public: true,
    subscribers_count: 5900,
    plans: [
      { id: 'plan_gab_gamer', name: 'Gamer Pass', price: 6.00, billing_type: 'mensual', benefits: ['Sesiones de Discord/Chat', 'Cosplays HD'] }
    ],
    created_at: '2025-03-15T18:00:00Z'
  },
  {
    id: 'ch_stefany',
    name: 'Stefany Rivas Platinum',
    type: 'media_sharing',
    owner_id: 'usr_stefany',
    description: 'Contenido exclusivo para personas exigentes. Citas, elegancia y estilo 🥂',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    is_public: true,
    subscribers_count: 6700,
    plans: [
      { id: 'plan_stef_vip', name: 'Platinum Pass', price: 12.00, billing_type: 'mensual', benefits: ['Galería sin censura', 'Mensajería prioritaria'] }
    ],
    created_at: '2025-03-20T16:00:00Z'
  },
  {
    id: 'ch_natalia',
    name: 'Natalia Peña Poker Queen',
    type: 'media_sharing',
    owner_id: 'usr_natalia',
    description: 'La reina de las mesas de apuestas y creadora de alta gama 👑',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    is_public: true,
    subscribers_count: 11400,
    plans: [
      { id: 'plan_nat_vip', name: 'Corona de Oro', price: 15.00, billing_type: 'mensual', benefits: ['Acceso total a contenidos', 'Fotos en torneos'] }
    ],
    created_at: '2025-03-25T14:00:00Z'
  },
  {
    id: 'ch_carolina',
    name: 'Carolina Glamour 360',
    type: 'media_sharing',
    owner_id: 'usr_carolina',
    description: 'Videos en 4K, sesiones de estudio y detrás de cámara en Europa 📸',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_public: true,
    subscribers_count: 9800,
    plans: [
      { id: 'plan_caro_vip', name: 'Glamour VIP', price: 11.99, billing_type: 'mensual', benefits: ['Videos 4K', 'Descuento Paywall 50%'] }
    ],
    created_at: '2025-04-01T20:00:00Z'
  },

  // Pronosticadores & Deportes (12)
  {
    id: 'ch_roberto_tips',
    name: 'Roberto Pronósticos VIP',
    type: 'pronosticadores',
    owner_id: 'usr_roberto',
    description: 'Parleys de MLB, NBA y Fútbol con 82% de acierto comprobado 📊',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_public: true,
    subscribers_count: 14200,
    plans: [
      { id: 'plan_rob_free', name: 'Datos Libres', price: 0, billing_type: 'free', benefits: ['1 jugada diaria', 'Resumen nocturno'] },
      { id: 'plan_rob_vip', name: 'Suscripción VIP Ganadora', price: 9.99, billing_type: 'mensual', benefits: ['3 parleys diarios', 'Jugada de poder', 'Alerta en tiempo real'] }
    ],
    created_at: '2025-01-20T08:00:00Z'
  },
  {
    id: 'ch_don_animalito_vip',
    name: 'La Cátedra de Don Animalito',
    type: 'pronosticadores',
    owner_id: 'usr_don_animalito',
    description: 'Los 3 animales fijos del día para Lotto Activo y La Granjita 🧮',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_public: true,
    subscribers_count: 22800,
    plans: [
      { id: 'plan_don_vip', name: 'Club del Animalito', price: 5.00, billing_type: 'mensual', benefits: ['Datos de las 10AM y 4PM', 'Grupo exclusivo'] }
    ],
    created_at: '2025-01-22T09:00:00Z'
  },
  {
    id: 'ch_el_brujo_triples',
    name: 'Triples Millonarios del Brujo',
    type: 'pronosticadores',
    owner_id: 'usr_brujo_triples',
    description: 'Triples y terminales con cálculo cabalístico para Zulia y Chance 🔮',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    is_public: true,
    subscribers_count: 18900,
    plans: [
      { id: 'plan_brujo_vip', name: 'Línea Directa', price: 7.50, billing_type: 'mensual', benefits: ['2 triples sin caída', 'Mensajes WhatsApp directos'] }
    ],
    created_at: '2025-01-25T11:00:00Z'
  },
  {
    id: 'ch_parley_master',
    name: 'Parley Master Combinadas',
    type: 'pronosticadores',
    owner_id: 'usr_parley_master',
    description: 'Cuotas de 5.00 a 15.00 todos los fines de semana. ¡Gana en grande! 💵',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    is_public: true,
    subscribers_count: 12500,
    plans: [
      { id: 'plan_pm_vip', name: 'Master Club', price: 12.00, billing_type: 'mensual', benefits: ['Todas las combinadas', 'Seguro de fallo 1 logro'] }
    ],
    created_at: '2025-02-01T10:00:00Z'
  },
  {
    id: 'ch_nba_picks',
    name: 'NBA Elite Picks',
    type: 'pronosticadores',
    owner_id: 'usr_analista_nba',
    description: 'Picks matemáticos de básquetbol estadounidense 🏀 Altas, bajas y spreads',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    is_public: true,
    subscribers_count: 9800,
    plans: [
      { id: 'plan_nba_vip', name: 'Pase de Temporada', price: 8.99, billing_type: 'mensual', benefits: ['Picks de toda la jornada', 'Estadísticas avanzadas'] }
    ],
    created_at: '2025-02-15T15:00:00Z'
  },
  {
    id: 'ch_hipismo_rinconada',
    name: 'El 5y6 de La Rinconada',
    type: 'pronosticadores',
    owner_id: 'usr_hipismo_gold',
    description: 'La información hípica más certera del óvalo de Coche 🏇 Datos de última hora',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    is_public: true,
    subscribers_count: 15400,
    plans: [
      { id: 'plan_hip_vip', name: 'Línea de Oro', price: 6.00, billing_type: 'mensual', benefits: ['Cuadro del 5y6', 'Marcas para todas las carreras'] }
    ],
    created_at: '2025-02-10T11:00:00Z'
  },
  {
    id: 'ch_golazo_futve',
    name: 'FUTVE y Libertadores Al Día',
    type: 'pronosticadores',
    owner_id: 'usr_futbol_picks',
    description: 'Todo el fútbol venezolano y de Conmebol analizado para apostar ⚽',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_public: true,
    subscribers_count: 8700,
    plans: [],
    created_at: '2025-02-20T17:00:00Z'
  },
  {
    id: 'ch_selva_plus_tips',
    name: 'Datos Calientes Selva Plus',
    type: 'pronosticadores',
    owner_id: 'usr_selva_guru',
    description: 'El delfín, el tigre y la leona: los datos que más pagan en Selva Plus 🐯',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    is_public: true,
    subscribers_count: 11200,
    plans: [
      { id: 'plan_selv_vip', name: 'Selva VIP', price: 4.50, billing_type: 'mensual', benefits: ['Animal fijo de cada sorteo'] }
    ],
    created_at: '2025-03-01T08:00:00Z'
  },
  {
    id: 'ch_zulia_directo',
    name: 'Zulia y Chance Directos',
    type: 'pronosticadores',
    owner_id: 'usr_triple_zulia',
    description: 'Pronósticos exclusivos de triples con alta probabilidad de acierto 🎯',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_public: true,
    subscribers_count: 13900,
    plans: [],
    created_at: '2025-03-05T12:00:00Z'
  },
  {
    id: 'ch_tenis_picks',
    name: 'Tenis y Wimbledon Picks',
    type: 'pronosticadores',
    owner_id: 'usr_tenis_ace',
    description: 'Los mejores sets, games y ganadores directos de los torneos Grand Slam 🎾',
    avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    is_public: true,
    subscribers_count: 7200,
    plans: [],
    created_at: '2025-03-10T14:00:00Z'
  },
  {
    id: 'ch_crypto_crash',
    name: 'Crash Games & Multiplicadores',
    type: 'pronosticadores',
    owner_id: 'usr_crypto_bets',
    description: 'Estrategias de salida para Aviator, Mines y Plinko con dinero real 🚀',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    is_public: true,
    subscribers_count: 19500,
    plans: [
      { id: 'plan_cr_vip', name: 'Bot de Señales Crash', price: 14.99, billing_type: 'mensual', benefits: ['Alertas de multiplicador 10x+', 'Estrategias automatizadas'] }
    ],
    created_at: '2025-03-15T19:00:00Z'
  },
  {
    id: 'ch_combinadas_béisbol',
    name: 'Parley Béisbol MLB & LVBP',
    type: 'pronosticadores',
    owner_id: 'usr_roberto',
    description: 'La pasión del diamante: pitchers abridores, líneas de dinero y carreras ⚾',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_public: true,
    subscribers_count: 16700,
    plans: [],
    created_at: '2025-03-20T10:00:00Z'
  },

  // Taquillas Regionales (10)
  { id: 'ch_taquilla_ccs', name: 'Taquilla Caracas Centro', type: 'taquillas', owner_id: 'usr_pedro', description: 'Atención física en Sabana Grande y Av. Urdaneta 🎟️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 6500, plans: [], created_at: '2025-01-12T08:00:00Z' },
  { id: 'ch_taquilla_val', name: 'Taquilla Valencia Norte', type: 'taquillas', owner_id: 'usr_laura', description: 'Punto de recarga y cobro rápido en Av. Bolívar de Valencia 💵', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 5800, plans: [], created_at: '2025-01-18T10:00:00Z' },
  { id: 'ch_taquilla_mar', name: 'Taquilla 5 de Julio Maracaibo', type: 'taquillas', owner_id: 'usr_carmen', description: 'La agencia más rápida del Zulia para cobrar tus premios ☀️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 7200, plans: [], created_at: '2025-01-25T11:00:00Z' },
  { id: 'ch_taquilla_barq', name: 'Taquilla Barquisimeto Este', type: 'taquillas', owner_id: 'usr_javier', description: 'Cobro de triples y parley en Lara sin filas 🏜️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 4900, plans: [], created_at: '2025-02-01T09:00:00Z' },
  { id: 'ch_taquilla_mcy', name: 'Taquilla Las Delicias Maracay', type: 'taquillas', owner_id: 'usr_patricia', description: 'Sella tu parley y cobra tus animalitos en Aragua 🎲', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 5300, plans: [], created_at: '2025-02-10T12:00:00Z' },
  { id: 'ch_taquilla_pto', name: 'Taquilla Puerto Ordaz Alta Vista', type: 'taquillas', owner_id: 'usr_miguel', description: 'Punto oficial HandyBet en el estado Bolívar 🏭', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 4200, plans: [], created_at: '2025-02-15T14:00:00Z' },
  { id: 'ch_taquilla_lech', name: 'Taquilla Lechería Plaza Mayor', type: 'taquillas', owner_id: 'usr_elena', description: 'Agencia premium en Anzoátegui para cobro y recarga de saldo ⛵', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 4800, plans: [], created_at: '2025-02-20T16:00:00Z' },
  { id: 'ch_taquilla_sc', name: 'Taquilla San Cristóbal Centro', type: 'taquillas', owner_id: 'usr_raul', description: 'Lotería del Táchira y sellado seguro en la frontera 🏔️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 6100, plans: [], created_at: '2025-02-28T09:00:00Z' },
  { id: 'ch_taquilla_marg', name: 'Taquilla Porlamar Margarita', type: 'taquillas', owner_id: 'usr_yaneth', description: 'Tu jugada en la isla con pago inmediato en bolívares y dólares 🏖️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 4600, plans: [], created_at: '2025-03-05T13:00:00Z' },
  { id: 'ch_taquilla_chacao', name: 'Taquilla Chacao VIP', type: 'taquillas', owner_id: 'usr_diego', description: 'Espacio exclusivo para grandes apostadores en Caracas 🏛️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 8900, plans: [], created_at: '2025-03-12T10:00:00Z' },

  // Bingos & Rifas (10)
  { id: 'ch_bingo_nacional', name: 'Bingo Nacional Millonario', type: 'bingos', owner_id: 'usr_henry', description: 'Salas de bingo en vivo todas las noches a las 9:00 PM con grandes premios 🎫', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 24500, plans: [], created_at: '2025-01-15T15:00:00Z' },
  { id: 'ch_bingo_bailable', name: 'Bingo Bailable Los Fines de Semana', type: 'bingos', owner_id: 'usr_maria', description: 'Música, cartones y premios en efectivo cada sábado y domingo 💃', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 16800, plans: [], created_at: '2025-01-20T18:00:00Z' },
  { id: 'ch_rifas_motos', name: 'Gran Rifa de Motos 0KM', type: 'rifas', owner_id: 'usr_diego', description: 'Gana motos Bera y Empire 0KM con boletos de tan solo 2.00 Bs 🏍️', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 31000, plans: [], created_at: '2025-02-01T12:00:00Z' },
  { id: 'ch_rifas_tecnologia', name: 'Rifas Pro Tech (iPhones & TVs)', type: 'rifas', owner_id: 'usr_henry', description: 'Sorteos verificados por Lotería del Zulia de iPhones 16 Pro y Smart TVs 📱', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 28400, plans: [], created_at: '2025-02-10T14:00:00Z' },
  { id: 'ch_bingo_express', name: 'Bingo Flash 24 Horas', type: 'bingos', owner_id: 'usr_fernanda', description: 'Rondas automáticas cada 15 minutos. Cartones desde 1.00 Bs ⚡', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 14200, plans: [], created_at: '2025-02-18T10:00:00Z' },
  { id: 'ch_rifa_dolares', name: 'Rifa Millonaria en Dólares', type: 'rifas', owner_id: 'usr_diego', description: 'Premios de 500$, 1,000$ y 5,000$ en efectivo directo a tu cuenta 💵', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 29500, plans: [], created_at: '2025-02-25T16:00:00Z' },
  { id: 'ch_bingo_dorado', name: 'Bingo Dorado VIP', type: 'bingos', owner_id: 'usr_henry', description: 'Partidas con pozos acumulados de más de 50,000 Puntos 🏆', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 17800, plans: [], created_at: '2025-03-01T19:00:00Z' },
  { id: 'ch_quinielas_comunidad', name: 'Quinielas de la Comunidad HandyBet', type: 'deportes', owner_id: 'usr_carlos', description: 'Pronostica el marcador exacto de cada fin de semana y gana el pozo total ⚽', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 21300, plans: [], created_at: '2025-03-08T11:00:00Z' },
  { id: 'ch_rifas_navidenas', name: 'Gran Rifa Extraordinaria', type: 'rifas', owner_id: 'usr_diego', description: 'Sorteos mensuales con múltiples ganadores de premios sorpresa 🎁', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 18900, plans: [], created_at: '2025-03-15T15:00:00Z' },
  { id: 'ch_bingo_tradicional', name: 'Bingo Tradicional 75 Bolas', type: 'bingos', owner_id: 'usr_fernanda', description: 'El formato clásico de bingo familiar con locutor en vivo por streaming 🎤', avatar_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=150', is_public: true, subscribers_count: 13500, plans: [], created_at: '2025-03-22T17:00:00Z' }
];

fs.writeFileSync(path.join(dataDir, 'channels.json'), JSON.stringify(channels, null, 2));
console.log(`✅ channels.json generado con ${channels.length} canales.`);

// ─── 3. GRUPOS (+54 Grupos) ──────────────────────────────────
const groups = [];
const groupTypes = ['apuestas', 'multimedia', 'pronosticos', 'social', 'taquillas'];

channels.forEach((ch, idx) => {
  // Crear al menos 1 grupo por canal
  const grpId = `grp_${ch.id.replace('ch_', '')}`;
  const code = (ch.name.substring(0, 3) + (idx + 10)).toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  groups.push({
    id: grpId,
    channel_id: ch.id,
    name: `Comunidad ${ch.name}`,
    short_code: code,
    type: ch.type === 'media_sharing' ? 'multimedia' : (ch.type === 'taquillas' ? 'taquillas' : 'apuestas'),
    is_public: true,
    members: ['usr_henry', 'usr_carlos', 'usr_maria', 'usr_diego', ch.owner_id],
    admins: ['usr_henry', ch.owner_id],
    config: { wallet_type: 'mixed', allows_recharge: true },
    rules: {
      permitir_publicar_feeds: true,
      permitir_publicar_publicidad: false,
      terms_text: `Reglas de convivencia de ${ch.name}. Respeto y juego responsable.`,
      pay_to_post_enabled: false,
      pay_to_post_fee: 0
    },
    plans: ch.plans && ch.plans.length > 0 ? ch.plans : [
      { id: `plan_${grpId}_free`, name: 'Miembro', price: 0, billing_type: 'free' }
    ],
    created_at: ch.created_at
  });
});

// Grupos adicionales para llegar a +54
const extraGroups = [
  { id: 'grp_parley_nba_vip', channel_id: 'ch_nba_picks', name: 'Debate NBA Madrugada', short_code: 'NBANOC', type: 'pronosticos', members: ['usr_carlos', 'usr_alberto'], admins: ['usr_analista_nba'] },
  { id: 'grp_champions_live', channel_id: 'ch_quinielas_comunidad', name: 'Tertulia Champions League', short_code: 'CHAMPL', type: 'social', members: ['usr_henry', 'usr_andres_champions'], admins: ['usr_henry'] },
  { id: 'grp_lotto_10am', channel_id: 'ch_lotto_activo_oficial', name: 'La Jugada de las 10:00 AM', short_code: 'LOTT10', type: 'apuestas', members: ['usr_don_animalito', 'usr_yorman'], admins: ['usr_don_animalito'] },
  { id: 'grp_crash_hunters', channel_id: 'ch_crypto_crash', name: 'Cazadores de Cohetes 100x', short_code: 'CRASHX', type: 'apuestas', members: ['usr_kevin', 'usr_daniella'], admins: ['usr_crypto_bets'] }
];

extraGroups.forEach(eg => {
  groups.push({
    ...eg,
    is_public: true,
    config: { wallet_type: 'mixed', allows_recharge: true },
    rules: { permitir_publicar_feeds: true, permitir_publicar_publicidad: false, terms_text: 'Juego responsable.', pay_to_post_enabled: false, pay_to_post_fee: 0 },
    plans: [{ id: `plan_${eg.id}_free`, name: 'Miembro', price: 0, billing_type: 'free' }],
    created_at: '2025-02-15T12:00:00Z'
  });
});

fs.writeFileSync(path.join(dataDir, 'groups.json'), JSON.stringify(groups, null, 2));
console.log(`✅ groups.json generado con ${groups.length} grupos.`);

// ─── 4. JUEGOS Y SORTEOS (+52 Juegos) ─────────────────────────
const games = [
  // 1. Animalitos (10)
  { id: 'g_lotto_activo', title: 'Lotto Activo', sub: 'Sorteos cada hora de 9AM a 7PM', emoji: '🦁', category: 'animalitos', schedule: 'Cada 1 hora', multiplier: 30, min_bet: 5.00, max_prize: 50000, active: true },
  { id: 'g_la_granjita', title: 'La Granjita', sub: 'La ruleta tradicional del campo', emoji: '🐔', category: 'animalitos', schedule: 'Cada 1 hora', multiplier: 30, min_bet: 5.00, max_prize: 40000, active: true },
  { id: 'g_selva_plus', title: 'Selva Plus', sub: 'Multiplicadores sorpresa hasta 60x', emoji: '🐯', category: 'animalitos', schedule: '10:00 AM a 6:00 PM', multiplier: 60, min_bet: 5.00, max_prize: 60000, active: true },
  { id: 'g_ruleta_activa', title: 'Ruleta Activa', sub: 'Sorteos continuos y ruleta de colores', emoji: '🎡', category: 'animalitos', schedule: 'Cada 45 mins', multiplier: 30, min_bet: 5.00, max_prize: 35000, active: true },
  { id: 'g_guacharo_activo', title: 'Guácharo Activo', sub: 'El pájaro de la suerte oriental', emoji: '🦅', category: 'animalitos', schedule: '11AM, 3PM y 6PM', multiplier: 30, min_bet: 2.00, max_prize: 20000, active: true },
  { id: 'g_granja_millonaria', title: 'Granja Millonaria', sub: 'Premios especiales al mediodía', emoji: '🐮', category: 'animalitos', schedule: 'Mañana 2:00 PM', multiplier: 35, min_bet: 5.00, max_prize: 45000, active: true },
  { id: 'g_fauna_silvestre', title: 'Fauna Silvestre', sub: 'Ruleta ecológica con 38 animales', emoji: '🐘', category: 'animalitos', schedule: 'Cada 2 horas', multiplier: 30, min_bet: 5.00, max_prize: 30000, active: true },
  { id: 'g_jungla_real', title: 'Jungla Real', sub: 'El león y el delfín pagan doble', emoji: '🐬', category: 'animalitos', schedule: '1:00 PM y 5:00 PM', multiplier: 40, min_bet: 10.00, max_prize: 80000, active: true },
  { id: 'g_animalitos_vip', title: 'Animalitos VIP Express', sub: 'Cierra en 45 mins - Pozo acumulado', emoji: '🎲', category: 'animalitos', schedule: 'Cierra en 45 mins', multiplier: 35, min_bet: 10.00, max_prize: 100000, active: true },
  { id: 'g_safari_plus', title: 'Safari Express', sub: 'Sorteos ultrarrápidos cada 30 minutos', emoji: '🦓', category: 'animalitos', schedule: 'Cada 30 mins', multiplier: 30, min_bet: 5.00, max_prize: 25000, active: true },

  // 2. Quinielas (8)
  { id: 'g_quiniela_champions', title: 'Quiniela Champions League', sub: 'Pronostica 6 partidos de octavos', emoji: '⚽', category: 'quinielas', schedule: 'Cierra Martes 3:00 PM', multiplier: 150, min_bet: 10.00, max_prize: 250000, active: true },
  { id: 'g_quiniela_laliga', title: 'Quiniela LaLiga EA Sports', sub: 'Jornada española de fin de semana', emoji: '🏆', category: 'quinielas', schedule: 'Cierra en 1 día', multiplier: 100, min_bet: 10.00, max_prize: 150000, active: true },
  { id: 'g_quiniela_premier', title: 'Quiniela Premier League', sub: 'El fútbol más intenso de Inglaterra', emoji: '🦁', category: 'quinielas', schedule: 'Sábado 9:30 AM', multiplier: 120, min_bet: 10.00, max_prize: 180000, active: true },
  { id: 'g_quiniela_libertadores', title: 'Quiniela Copa Libertadores', sub: 'La gloria eterna del continente', emoji: '🌎', category: 'quinielas', schedule: 'Jueves 7:00 PM', multiplier: 140, min_bet: 10.00, max_prize: 200000, active: true },
  { id: 'g_quiniela_seriea', title: 'Quiniela Serie A Calcio', sub: 'Inter, Milan, Juventus y Napoli', emoji: '🇮🇹', category: 'quinielas', schedule: 'Domingo 12:00 PM', multiplier: 90, min_bet: 5.00, max_prize: 120000, active: true },
  { id: 'g_quiniela_clasico', title: 'Quiniela El Clásico (Real vs Barça)', sub: 'Marcador exacto y primer goleador', emoji: '👑', category: 'quinielas', schedule: 'Especial Domingo', multiplier: 250, min_bet: 20.00, max_prize: 500000, active: true },
  { id: 'g_quiniela_conmebol', title: 'Quiniela Eliminatorias Mundial', sub: 'La Vinotinto y las selecciones de América', emoji: '🇻🇪', category: 'quinielas', schedule: 'Próxima jornada', multiplier: 200, min_bet: 10.00, max_prize: 300000, active: true },
  { id: 'g_quiniela_futve', title: 'Quiniela Liga FUTVE', sub: 'El torneo local: Caracas, Táchira y más', emoji: '🏟️', category: 'quinielas', schedule: 'Viernes 4:00 PM', multiplier: 80, min_bet: 5.00, max_prize: 80000, active: true },

  // 3. Mini Juegos (8)
  { id: 'g_aviator_crash', title: 'Aviator Rocket Crash (Demo)', sub: 'El cohete sube. ¡Haz Cash Out antes de que explote!', emoji: '🚀', category: 'minijuegos', schedule: 'Juego Instantáneo 24/7', multiplier: 100, min_bet: 10.00, max_prize: 100000, active: true, demo_type: 'crash' },
  { id: 'g_flappy_crypto', title: 'Flappy Bird Crypto', sub: 'Esquiva tuberías y multiplica tus créditos', emoji: '🎮', category: 'minijuegos', schedule: 'Juega gratis / Puntos', multiplier: 50, min_bet: 5.00, max_prize: 25000, active: true, demo_type: 'crash' },
  { id: 'g_ruleta_relampago', title: 'Ruleta Relámpago', sub: 'Rayos con multiplicadores de hasta 500x', emoji: '⚡', category: 'minijuegos', schedule: 'En Vivo 24/7', multiplier: 500, min_bet: 5.00, max_prize: 250000, active: true, demo_type: 'crash' },
  { id: 'g_dice_roller', title: 'Dice Roller 100x', sub: 'Elige mayor o menor y ajusta tu riesgo', emoji: '🎲', category: 'minijuegos', schedule: 'Instantáneo', multiplier: 100, min_bet: 1.00, max_prize: 50000, active: true, demo_type: 'crash' },
  { id: 'g_mines_gold', title: 'Mines: En Busca del Oro', sub: 'Descubre diamantes y evita las bombas', emoji: '💣', category: 'minijuegos', schedule: 'Instantáneo', multiplier: 250, min_bet: 5.00, max_prize: 150000, active: true, demo_type: 'crash' },
  { id: 'g_penalty_shootout', title: 'Penalty Shootout', sub: 'Marca el gol decisivo al arquero', emoji: '🥅', category: 'minijuegos', schedule: 'Instantáneo', multiplier: 32, min_bet: 5.00, max_prize: 30000, active: true, demo_type: 'crash' },
  { id: 'g_plinko_lucky', title: 'Plinko Lucky Balls', sub: 'Deja caer la bola y busca las casillas 1000x', emoji: '🔴', category: 'minijuegos', schedule: 'Instantáneo', multiplier: 1000, min_bet: 5.00, max_prize: 500000, active: true, demo_type: 'crash' },
  { id: 'g_hilo_cards', title: 'Hi-Lo Cartas Clásicas', sub: 'Adivina si la siguiente carta es mayor o menor', emoji: '🃏', category: 'minijuegos', schedule: 'Instantáneo', multiplier: 50, min_bet: 2.00, max_prize: 20000, active: true, demo_type: 'crash' },

  // 4. Bingos (8)
  { id: 'g_bingo_bailable', title: 'Bingo Bailable Sabatino', sub: 'Empieza a las 9:00 PM con música en vivo', emoji: '🎫', category: 'bingos', schedule: 'Sábado 9:00 PM', multiplier: 200, min_bet: 5.00, max_prize: 100000, active: true },
  { id: 'g_bingo_mega_x', title: 'Bingo Mega X', sub: 'Cartones desde 5.00 Bs. ¡Participa ya!', emoji: '🎉', category: 'bingos', schedule: 'Hoy 8:30 PM', multiplier: 300, min_bet: 5.00, max_prize: 200000, active: true },
  { id: 'g_bingo_familiar', title: 'Bingo Familiar Dominical', sub: 'Sorteo especial con electrodomésticos y efectivo', emoji: '👨‍👩‍👧‍👦', category: 'bingos', schedule: 'Domingo 4:00 PM', multiplier: 150, min_bet: 10.00, max_prize: 80000, active: true },
  { id: 'g_bingo_millonario', title: 'Gran Bingo Millonario 10k', sub: 'Premio garantizado de 10,000 Puntos a la línea', emoji: '💰', category: 'bingos', schedule: 'Viernes 9:00 PM', multiplier: 500, min_bet: 20.00, max_prize: 350000, active: true },
  { id: 'g_bingo_flash', title: 'Bingo Flash 15 Mins', sub: 'Rondas rápidas sin parar todo el día', emoji: '⚡', category: 'bingos', schedule: 'Cada 15 minutos', multiplier: 50, min_bet: 2.00, max_prize: 15000, active: true },
  { id: 'g_bingo_oro', title: 'Bingo de Oro VIP', sub: 'Acceso solo para miembros con saldo activo', emoji: '🪙', category: 'bingos', schedule: 'Cada 2 horas', multiplier: 250, min_bet: 25.00, max_prize: 250000, active: true },
  { id: 'g_bingo_75_bolas', title: 'Bingo Tradicional 75 Bolas', sub: 'Patrones de letras, cuatro esquinas y cartón lleno', emoji: '🎱', category: 'bingos', schedule: 'Todos los días 7:00 PM', multiplier: 100, min_bet: 5.00, max_prize: 50000, active: true },
  { id: 'g_bingo_nocturno', title: 'Bingo Nocturno Insomnio', sub: 'Para los que juegan de madrugada', emoji: '🌙', category: 'bingos', schedule: '12:00 AM y 2:00 AM', multiplier: 80, min_bet: 5.00, max_prize: 40000, active: true },

  // 5. Parley (8)
  { id: 'g_parley_mlb', title: 'Parley MLB Béisbol Diario', sub: 'Líneas de dinero, carreras y hándicaps', emoji: '⚾', category: 'parley', schedule: 'Partidos desde 1:00 PM', multiplier: 50, min_bet: 10.00, max_prize: 200000, active: true },
  { id: 'g_parley_nba', title: 'Parley NBA Baloncesto', sub: 'Puntos por jugador, altas/bajas de equipo', emoji: '🏀', category: 'parley', schedule: 'Partidos desde 7:00 PM', multiplier: 65, min_bet: 10.00, max_prize: 250000, active: true },
  { id: 'g_parley_futbol_sabado', title: 'Combinada Europea Sábado', sub: 'Premier, LaLiga, Bundesliga y Serie A', emoji: '⚽', category: 'parley', schedule: 'Sábado 8:00 AM', multiplier: 120, min_bet: 10.00, max_prize: 300000, active: true },
  { id: 'g_parley_5_logros', title: 'Super Parley 5 Logros VIP', sub: 'Cuota multiplicada garantizada > 10.00x', emoji: '🔥', category: 'parley', schedule: 'Diario 3:00 PM', multiplier: 100, min_bet: 20.00, max_prize: 400000, active: true },
  { id: 'g_parley_tenis', title: 'Parley Tenis ATP & WTA', sub: 'Apuestas en sets y ganador de match', emoji: '🎾', category: 'parley', schedule: 'Diario mañana', multiplier: 40, min_bet: 10.00, max_prize: 150000, active: true },
  { id: 'g_parley_champions', title: 'Combinada Estelar Champions', sub: 'Picks estelares de martes y miércoles', emoji: '⭐', category: 'parley', schedule: 'Martes y Miércoles 3:00 PM', multiplier: 80, min_bet: 15.00, max_prize: 250000, active: true },
  { id: 'g_parley_goles', title: 'Parley Ambos Anotan & Over 2.5', sub: 'Especialista en estadísticas de goles', emoji: '🥅', category: 'parley', schedule: 'Fines de semana', multiplier: 60, min_bet: 10.00, max_prize: 180000, active: true },
  { id: 'g_parley_nfl', title: 'Parley Fútbol Americano NFL', sub: 'Touchdowns, yardas y hándicap dominical', emoji: '🏈', category: 'parley', schedule: 'Domingo 1:00 PM', multiplier: 75, min_bet: 10.00, max_prize: 200000, active: true },

  // 6. Rifas (5)
  { id: 'g_rifa_moto', title: 'Gran Sorteo Moto Bera 0KM', sub: 'Juega con las últimas 3 cifras de Zulia 7PM', emoji: '🏍️', category: 'rifas', schedule: 'Sábado 7:00 PM', multiplier: 1000, min_bet: 20.00, max_prize: 1500000, active: true },
  { id: 'g_rifa_iphone', title: 'Rifa iPhone 16 Pro Max 256GB', sub: 'Boleto solo 5.00 Bs. 100% verificado', emoji: '📱', category: 'rifas', schedule: 'Viernes 8:00 PM', multiplier: 800, min_bet: 5.00, max_prize: 900000, active: true },
  { id: 'g_rifa_combo_dolares', title: 'Rifa Combo 1,000$ en Efectivo', sub: 'Transferencia directa o entrega en taquilla', emoji: '💵', category: 'rifas', schedule: 'Quincenal', multiplier: 500, min_bet: 10.00, max_prize: 600000, active: true },
  { id: 'g_rifa_tv', title: 'Rifa Smart TV 65" 4K Crystal', sub: 'Ideal para ver los juegos de la Champions', emoji: '📺', category: 'rifas', schedule: 'Fin de mes', multiplier: 400, min_bet: 5.00, max_prize: 350000, active: true },
  { id: 'g_rifa_recarga', title: 'Rifa Recarga 2,000 Puntos Billetera', sub: 'Sorteo exprés entre apostadores del día', emoji: '💳', category: 'rifas', schedule: 'Hoy 10:00 PM', multiplier: 50, min_bet: 2.00, max_prize: 50000, active: true },

  // 7. Loterías Tradicionales (5)
  { id: 'g_triple_zulia', title: 'Triple Zulia 12:45 y 7:00 PM', sub: 'El triple tradicional que más paga', emoji: '🎯', category: 'loterias', schedule: '12:45 PM y 7:00 PM', multiplier: 600, min_bet: 5.00, max_prize: 500000, active: true },
  { id: 'g_triple_chance', title: 'Triple Chance A y B', sub: 'Acierta el triple con su signo zodiacal', emoji: '🔮', category: 'loterias', schedule: '1:00 PM y 8:00 PM', multiplier: 800, min_bet: 5.00, max_prize: 700000, active: true },
  { id: 'g_triple_tachira', title: 'Triple Táchira A, B y Signo', sub: 'Sorteo oficial Lotería del Táchira', emoji: '🏔️', category: 'loterias', schedule: '1:15 PM y 7:15 PM', multiplier: 600, min_bet: 5.00, max_prize: 500000, active: true },
  { id: 'g_triple_caracas', title: 'Triple Caracas Millonario', sub: 'Transmisión en vivo desde la capital', emoji: '🏛️', category: 'loterias', schedule: '12:30 PM y 7:30 PM', multiplier: 600, min_bet: 5.00, max_prize: 500000, active: true },
  { id: 'g_gran_kino_juego', title: 'Gran Kino Imaginario', sub: '¡Gana hasta 5,000 Puntos hoy a las 8:00 PM!', emoji: '🏆', category: 'loterias', schedule: 'Hoy a las 8:00 PM', multiplier: 1000, min_bet: 10.00, max_prize: 1000000, active: true }
];

fs.writeFileSync(path.join(dataDir, 'games.json'), JSON.stringify(games, null, 2));
console.log(`✅ games.json generado con ${games.length} juegos.`);

// ─── 5. PREMIOS GANADOS (+22 Premios) ─────────────────────────
const prizes = [
  { id: 'prz_1', user_id: 'usr_admin', group_id: 'grp_taquilla_ccs', title: '¡Ganador con Triple 777!', description: 'Premio acreditado con Triple Zulia 777 en sorteo 7:00 PM', amount: 5000, currency: 'VES', bet_code: 'BET-777-CCS-001', lottery_name: 'Triple Zulia', draw_time: '7:00 PM', status: 'cobrado', processed_by: 'usr_pedro', created_at: '2025-07-15T20:15:00Z' },
  { id: 'prz_2', user_id: 'usr_henry', group_id: 'grp_taquilla_ccs', title: '¡Ganador en Taquillas Caracas!', description: 'Premio de 450 VES en sorteo 11:00 AM con el 00-BALLENA', amount: 450, currency: 'VES', bet_code: 'BET-000-CCS-002', lottery_name: 'Lotto Activo', draw_time: '11:00 AM', status: 'cobrado', processed_by: 'usr_pedro', created_at: '2025-07-15T14:00:00Z' },
  { id: 'prz_3', user_id: 'usr_henry', group_id: 'grp_taquilla_ccs', title: '¡Ganaste con el León!', description: 'Acertaste el 05-LEÓN en sorteo de las 2:00 PM', amount: 800, currency: 'VES', bet_code: 'BET-005-CCS-003', lottery_name: 'Lotto Activo', draw_time: '2:00 PM', status: 'cobrado', processed_by: 'usr_pedro', created_at: '2025-07-15T19:00:00Z' },
  { id: 'prz_4', user_id: 'usr_admin', group_id: 'grp_taquilla_val', title: 'Parley MLB 4 Logros Cobrado', description: 'Yankees, Dodgers, Braves y Astros cumplieron el pronóstico', amount: 8900, currency: 'VES', bet_code: 'PAR-MLB-VAL-004', lottery_name: 'Parley MLB', draw_time: '11:00 PM', status: 'cobrado', processed_by: 'usr_laura', created_at: '2025-07-16T03:30:00Z' },
  { id: 'prz_5', user_id: 'usr_henry', group_id: 'grp_bingo_nacional', title: 'Línea de Bingo Millonario', description: '¡Línea cantada en el sorteo de las 9:00 PM!', amount: 1500, currency: 'VES', bet_code: 'BNG-9PM-005', lottery_name: 'Bingo Nacional', draw_time: '9:25 PM', status: 'cobrado', processed_by: 'usr_diego', created_at: '2025-07-16T21:30:00Z' },
  { id: 'prz_6', user_id: 'usr_admin', group_id: 'grp_taquilla_ccs', title: 'Acierto 22-CAMELLO La Granjita', description: 'Premio cobrado en taquilla Sabana Grande', amount: 600, currency: 'VES', bet_code: 'GRJ-22-CCS-006', lottery_name: 'La Granjita', draw_time: '4:00 PM', status: 'cobrado', processed_by: 'usr_pedro', created_at: '2025-07-17T16:30:00Z' },
  { id: 'prz_7', user_id: 'usr_luis_alfonso', group_id: 'grp_taquilla_val', title: 'Terminal 33 Chance Astral', description: 'Sorteo nocturno acertado con signo Leo', amount: 3200, currency: 'VES', bet_code: 'CHN-33-VAL-007', lottery_name: 'Triple Chance', draw_time: '8:00 PM', status: 'cobrado', processed_by: 'usr_laura', created_at: '2025-07-17T20:45:00Z' },
  { id: 'prz_8', user_id: 'usr_andres_champions', group_id: 'grp_quinielas_comunidad', title: 'Marcador Exacto Madrid vs City', description: 'Pronóstico 3-2 en cuartos de final de Champions', amount: 7500, currency: 'VES', bet_code: 'QNL-UCL-008', lottery_name: 'Quiniela Champions', draw_time: '5:00 PM', status: 'cobrado', processed_by: 'usr_carlos', created_at: '2025-07-18T17:15:00Z' },
  { id: 'prz_9', user_id: 'usr_daniella', group_id: 'grp_crypto_crash', title: 'Retiro 25.4x en Aviator Crash', description: 'Apuesta de 100 VES retirada a tiempo antes del quiebre', amount: 2540, currency: 'VES', bet_code: 'CRASH-25X-009', lottery_name: 'Aviator Crash', draw_time: 'En vivo', status: 'cobrado', processed_by: 'usr_crypto_bets', created_at: '2025-07-18T22:10:00Z' },
  { id: 'prz_10', user_id: 'usr_samuel', group_id: 'grp_taquilla_mar', title: 'Triple Táchira 814 Signo Cáncer', description: 'Premio mayor cobrado en Taquilla 5 de Julio', amount: 18000, currency: 'VES', bet_code: 'TAC-814-MAR-010', lottery_name: 'Triple Táchira', draw_time: '1:15 PM', status: 'cobrado', processed_by: 'usr_carmen', created_at: '2025-07-19T13:45:00Z' },
  { id: 'prz_11', user_id: 'usr_fernanda', group_id: 'grp_bingo_bailable', title: 'Cartón Lleno Bingo Bailable', description: '¡Premio mayor de la noche! 10,000 VES acreditados', amount: 10000, currency: 'VES', bet_code: 'BNG-BAIL-011', lottery_name: 'Bingo Bailable', draw_time: '10:15 PM', status: 'cobrado', processed_by: 'usr_maria', created_at: '2025-07-19T22:30:00Z' },
  { id: 'prz_12', user_id: 'usr_javier_kino', group_id: 'grp_gran_kino_oficial', title: '12 Aciertos Gran Kino', description: 'Premio secundario del sorteo extraordinario', amount: 4800, currency: 'VES', bet_code: 'KINO-12A-012', lottery_name: 'Gran Kino', draw_time: '8:00 PM', status: 'cobrado', processed_by: 'usr_henry', created_at: '2025-07-20T20:30:00Z' },
  { id: 'prz_13', user_id: 'usr_claudia', group_id: 'grp_selva_plus_oficial', title: 'El Tigre 10 Selva Plus', description: 'Pago multiplicado x60 en taquilla Chacao', amount: 1800, currency: 'VES', bet_code: 'SLV-10-CHAC-013', lottery_name: 'Selva Plus', draw_time: '3:00 PM', status: 'cobrado', processed_by: 'usr_diego', created_at: '2025-07-21T15:20:00Z' },
  { id: 'prz_14', user_id: 'usr_ricardo', group_id: 'grp_parley_master', title: 'Parley Fútbol Europeo 5 Logros', description: 'Todas las altas de goles cumplidas a la perfección', amount: 14200, currency: 'VES', bet_code: 'PAR-EUR-014', lottery_name: 'Parley Master', draw_time: '6:30 PM', status: 'cobrado', processed_by: 'usr_parley_master', created_at: '2025-07-21T18:45:00Z' },
  { id: 'prz_15', user_id: 'usr_gustavo', group_id: 'grp_taquilla_mcy', title: 'Doble Jugada 01-CARNERO y 05-LEÓN', description: 'Premio doble en Maracay', amount: 1200, currency: 'VES', bet_code: 'LTT-DBL-MCY-015', lottery_name: 'Lotto Activo', draw_time: '12:00 PM', status: 'cobrado', processed_by: 'usr_patricia', created_at: '2025-07-22T12:30:00Z' },
  { id: 'prz_16', user_id: 'usr_paola', group_id: 'grp_taquilla_pto', title: 'Terminal 77 Lotería de Caracas', description: 'Cobrado en agencia Alta Vista', amount: 2400, currency: 'VES', bet_code: 'CCS-77-PTO-016', lottery_name: 'Triple Caracas', draw_time: '7:30 PM', status: 'cobrado', processed_by: 'usr_miguel', created_at: '2025-07-22T20:00:00Z' },
  { id: 'prz_17', user_id: 'usr_victor', group_id: 'grp_el_brujo_triples', title: 'Triple Fijo 912 en Zulia B', description: 'Pronóstico del Brujo cobrado al 100%', amount: 12000, currency: 'VES', bet_code: 'ZUL-912-BRU-017', lottery_name: 'Triple Zulia', draw_time: '7:00 PM', status: 'cobrado', processed_by: 'usr_brujo_triples', created_at: '2025-07-23T19:30:00Z' },
  { id: 'prz_18', user_id: 'usr_rodrigo', group_id: 'grp_golazo_futve', title: 'Quiniela Clásico Caracas vs Táchira', description: 'Acertó victoria 2-1 del Caracas FC', amount: 3500, currency: 'VES', bet_code: 'FUTVE-CAR-018', lottery_name: 'Quiniela FUTVE', draw_time: '6:00 PM', status: 'cobrado', processed_by: 'usr_futbol_picks', created_at: '2025-07-24T18:30:00Z' },
  { id: 'prz_19', user_id: 'usr_alberto', group_id: 'grp_nba_picks', title: 'Combinada NBA Lakers + Celtics Over', description: 'Ambos equipos superaron los 115 puntos', amount: 6400, currency: 'VES', bet_code: 'NBA-LAK-019', lottery_name: 'NBA Elite', draw_time: '11:45 PM', status: 'cobrado', processed_by: 'usr_analista_nba', created_at: '2025-07-25T00:15:00Z' },
  { id: 'prz_20', user_id: 'usr_kevin', group_id: 'grp_crypto_crash', title: 'Multiplicador 50x en Flappy Crypto', description: 'Récord del día en minijuegos de HandyBet', amount: 5000, currency: 'VES', bet_code: 'FLP-50X-020', lottery_name: 'Flappy Crypto', draw_time: 'En vivo', status: 'cobrado', processed_by: 'usr_crypto_bets', created_at: '2025-07-25T15:00:00Z' },
  { id: 'prz_21', user_id: 'usr_carlos', group_id: 'grp_taquilla_ccs', title: 'El 17-PAVO en Ruleta Activa', description: 'Acierto en la ruleta de las 3:00 PM', amount: 750, currency: 'VES', bet_code: 'RLT-17-021', lottery_name: 'Ruleta Activa', draw_time: '3:00 PM', status: 'cobrado', processed_by: 'usr_pedro', created_at: '2025-07-26T15:20:00Z' },
  { id: 'prz_22', user_id: 'usr_sofia', group_id: 'grp_bingo_nacional', title: 'Cuatro Esquinas Bingo Flash', description: 'Ganadora en la ronda de las 6:15 PM', amount: 890, currency: 'VES', bet_code: 'BNG-4ESQ-022', lottery_name: 'Bingo Flash', draw_time: '6:15 PM', status: 'cobrado', processed_by: 'usr_fernanda', created_at: '2025-07-26T18:30:00Z' }
];

fs.writeFileSync(path.join(dataDir, 'prizes.json'), JSON.stringify(prizes, null, 2));
console.log(`✅ prizes.json generado con ${prizes.length} premios.`);

// ─── 6. APUESTAS (+30 Bets) ───────────────────────────────────
const bets = [];
prizes.forEach((prz, i) => {
  bets.push({
    id: `bet_${i + 1}`,
    group_id: prz.group_id,
    user_id: prz.user_id,
    bet_code: prz.bet_code,
    bet_data: {
      lotteryId: prz.lottery_name,
      schedule: prz.draw_time,
      gameType: prz.title,
      totalAmount: Math.round(prz.amount / 10)
    },
    amount: Math.round(prz.amount / 10),
    potential_prize: prz.amount,
    status: prz.status,
    ticket_number: `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`,
    processed_by: prz.processed_by,
    created_at: prz.created_at
  });
});

// Agregar apuestas activas/en juego
for (let j = 23; j <= 32; j++) {
  bets.push({
    id: `bet_${j}`,
    group_id: 'grp_taquilla_ccs',
    user_id: 'usr_carlos',
    bet_code: `ACT-00${j}-CCS`,
    bet_data: { lotteryId: 'Lotto Activo', schedule: '5:00 PM', gameType: 'animalitos', totalAmount: 50 },
    amount: 50,
    potential_prize: 1500,
    status: 'activa',
    ticket_number: `TKT-99${j}8877`,
    processed_by: 'usr_pedro',
    created_at: new Date().toISOString()
  });
}

fs.writeFileSync(path.join(dataDir, 'bets.json'), JSON.stringify(bets, null, 2));
console.log(`✅ bets.json generado con ${bets.length} apuestas.`);

// ─── 7. CHATS CON PAYWALL Y CONVERSACIONES (+25 Chats) ─────────
const chats = [
  // Chat VIP con Joselin La Gata (con PAYWALL de fotos/videos)
  {
    id: 'chat_joselin_vip',
    type: 'direct',
    participants: ['usr_henry', 'usr_joselin'],
    messages: [
      { id: 'mj_1', sender_id: 'usr_joselin', content: '¡Hola Henry! ¿Cómo estás? Me encanta ver cómo crece HandyBet 💖', created_at: '2025-07-20T14:00:00Z' },
      { id: 'mj_2', sender_id: 'usr_henry', content: '¡Hola Joselin! Todo excelente, tu canal es uno de los más visitados', created_at: '2025-07-20T14:05:00Z' },
      { id: 'mj_3', sender_id: 'usr_joselin', content: 'Hice una sesión de fotos exclusiva ayer en la piscina que no subí a Instagram 🔥', created_at: '2025-07-20T14:10:00Z' },
      {
        id: 'mj_4_locked',
        sender_id: 'usr_joselin',
        content: '📸 Sesión Exclusiva en la Piscina (Contenido VIP Privado)',
        created_at: '2025-07-20T14:11:00Z',
        is_locked: true,
        unlock_price: 15.00,
        media_type: 'photo',
        preview_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=10',
        media_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
        unlocked_by: []
      },
      { id: 'mj_5', sender_id: 'usr_joselin', content: 'Solo haz clic en Desbloquear y se debita directo de tu billetera 😉 ¿Te gustó?', created_at: '2025-07-20T14:15:00Z' }
    ],
    created_at: '2025-07-20T14:00:00Z'
  },
  // Chat VIP con Valeria Gómez (con PAYWALL)
  {
    id: 'chat_valeria_vip',
    type: 'direct',
    participants: ['usr_henry', 'usr_valeria'],
    messages: [
      { id: 'mv_1', sender_id: 'usr_valeria', content: 'Hola! Bienvenido a mi chat privado ✨', created_at: '2025-07-21T10:00:00Z' },
      { id: 'mv_2', sender_id: 'usr_valeria', content: 'Acabo de terminar mi rutina de piernas y me tomé unas fotos especiales para mis suscriptores', created_at: '2025-07-21T10:02:00Z' },
      {
        id: 'mv_3_locked',
        sender_id: 'usr_valeria',
        content: '🔥 Set Exclusivo Post-Entreno (Solo para fans)',
        created_at: '2025-07-21T10:05:00Z',
        is_locked: true,
        unlock_price: 10.00,
        media_type: 'photo',
        preview_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=10',
        media_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
        unlocked_by: []
      }
    ],
    created_at: '2025-07-21T10:00:00Z'
  },
  // Chat VIP con Nicole Rossi (con PAYWALL)
  {
    id: 'chat_nicole_vip',
    type: 'direct',
    participants: ['usr_carlos', 'usr_nicole'],
    messages: [
      { id: 'mn_1', sender_id: 'usr_carlos', content: 'Hola Nicole, vi tu post en el feed! Increíble', created_at: '2025-07-22T16:00:00Z' },
      { id: 'mn_2', sender_id: 'usr_nicole', content: '¡Hola Carlos! Muchas gracias. Si quieres ver el video completo del desfile:', created_at: '2025-07-22T16:03:00Z' },
      {
        id: 'mn_3_locked',
        sender_id: 'usr_nicole',
        content: '🎥 Video Pasarela y Backstage en Alta Definición',
        created_at: '2025-07-22T16:05:00Z',
        is_locked: true,
        unlock_price: 20.00,
        media_type: 'video',
        preview_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=10',
        media_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
        unlocked_by: []
      }
    ],
    created_at: '2025-07-22T16:00:00Z'
  },
  // Chat con Roberto Tips (Pronósticos)
  {
    id: 'chat_roberto_tips',
    type: 'direct',
    participants: ['usr_carlos', 'usr_roberto'],
    messages: [
      { id: 'mr_1', sender_id: 'usr_carlos', content: 'Roberto, ¿cómo viene la jugada fuerte para hoy?', created_at: '2025-07-23T11:00:00Z' },
      { id: 'mr_2', sender_id: 'usr_roberto', content: 'Hermano, tengo un parley de 4 logros en MLB con cuota 6.50. Te aseguro que los abridores están dominantes', created_at: '2025-07-23T11:02:00Z' },
      { id: 'mr_3', sender_id: 'usr_carlos', content: 'Excelente! Ya me suscribí a tu plan VIP desde tu post en el feed 👍', created_at: '2025-07-23T11:05:00Z' },
      { id: 'mr_4', sender_id: 'usr_roberto', content: '¡Buenísimo! Ya tienes acceso automático a todas las alertas en tiempo real', created_at: '2025-07-23T11:06:00Z' }
    ],
    created_at: '2025-07-23T11:00:00Z'
  },
  // Chat de Taquilla con Pedro Cajero
  {
    id: 'chat_pedro_taquilla',
    type: 'direct',
    participants: ['usr_carlos', 'usr_pedro'],
    messages: [
      { id: 'mp_1', sender_id: 'usr_carlos', content: 'Buenas tardes Pedro, ¿hasta qué hora sellan los triples hoy?', created_at: '2025-07-24T17:00:00Z' },
      { id: 'mp_2', sender_id: 'usr_pedro', content: 'Hola Carlos, hasta las 6:50 PM para el de las 7:00 PM. Puedes recargar por Pago Móvil al instante', created_at: '2025-07-24T17:01:00Z' },
      { id: 'mp_3', sender_id: 'usr_carlos', content: 'Listo, te acabo de enviar 200 Bs para el 777 y el 05-LEÓN', created_at: '2025-07-24T17:03:00Z' },
      { id: 'mp_4', sender_id: 'usr_pedro', content: 'Ticket generado con éxito: TKT-44889922. ¡Mucho éxito en la jugada! 🍀', created_at: '2025-07-24T17:05:00Z' }
    ],
    created_at: '2025-07-24T17:00:00Z'
  }
];

// Generar chats adicionales para completar +25
for (let c = 6; c <= 25; c++) {
  chats.push({
    id: `chat_${c}`,
    type: 'direct',
    participants: ['usr_henry', users[c % users.length].id],
    messages: [
      { id: `m_${c}_1`, sender_id: users[c % users.length].id, content: 'Hola! Saludos a la comunidad de HandyBet 🙌', created_at: '2025-07-25T10:00:00Z' },
      { id: `m_${c}_2`, sender_id: 'usr_henry', content: '¡Bienvenido! Cualquier consulta sobre jugadas o recargas estoy a la orden.', created_at: '2025-07-25T10:05:00Z' }
    ],
    created_at: '2025-07-25T10:00:00Z'
  });
}

fs.writeFileSync(path.join(dataDir, 'chats.json'), JSON.stringify(chats, null, 2));
console.log(`✅ chats.json generado con ${chats.length} chats (incluye paywalls VIP).`);

// ─── 8. PUBLICACIONES (+60 Posts en Feed) ─────────────────────
const posts = [
  {
    id: 'post_1',
    author_id: 'usr_roberto',
    author_name: 'Roberto López (El Rey del Parley)',
    author_role: 'tipster',
    content: '🔥 ¡PARLEY MILLONARIO DEL DÍA COBRADO! 🔥\n\nAyer acertamos los 4 logros con cuota 8.50:\n✅ Yankees ML\n✅ Dodgers Over 8.5\n✅ Real Madrid Gana\n✅ Manchester City +2.5 Goles\n\n¿Quieres mis jugadas exclusivas de hoy? Suscríbete a mi canal VIP directamente abajo 👇',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800'],
    likes_count: 342,
    comments_count: 48,
    tips_count: 15,
    created_at: '2025-07-25T14:00:00Z',
    tags: ['parley', 'ganador', 'mlb', 'champions'],
    plans: [
      { id: 'plan_rob_free', name: 'Datos Libres', price: 0, billing_type: 'free', benefits: ['1 jugada diaria', 'Resumen'] },
      { id: 'plan_rob_vip', name: 'Suscripción VIP Ganadora', price: 9.99, billing_type: 'mensual', benefits: ['3 parleys diarios', 'Jugada de poder', 'Alerta en tiempo real'] }
    ]
  },
  {
    id: 'post_2',
    author_id: 'usr_joselin',
    author_name: 'Joselin La Gata',
    author_role: 'vip_creator',
    content: 'Feliz viernes mis amores 💖 Acabo de dejar un regalo especial en mi chat privado. Los que quieran ver la sesión de fotos completa en la playa pueden abrir el chat y desbloquearla ahora mismo 🐾✨',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800'],
    likes_count: 890,
    comments_count: 125,
    tips_count: 52,
    created_at: '2025-07-25T15:30:00Z',
    tags: ['fotos_vip', 'playa', 'exclusivo'],
    plans: [
      { id: 'plan_jos_pro', name: 'VIP Oro', price: 14.99, billing_type: 'mensual', benefits: ['Chat directo 24/7', 'Videos exclusivos', 'Descuento en paywall'] }
    ]
  },
  {
    id: 'post_3',
    author_id: 'usr_don_animalito',
    author_name: 'Don Animalito Oficial',
    author_role: 'tipster',
    content: '🧮 LA LÍNEA MATEMÁTICA PARA LAS 4:00 PM 🧮\n\nEl 05-LEÓN y el 22-CAMELLO vienen con más de 85% de probabilidad según el algoritmo de HandyBet. ¡Sellando con fuerza en taquillas!',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800'],
    likes_count: 412,
    comments_count: 67,
    tips_count: 24,
    created_at: '2025-07-25T16:00:00Z',
    tags: ['lotto_activo', 'animalitos', 'la_fija'],
    plans: [
      { id: 'plan_don_vip', name: 'Club del Animalito', price: 5.00, billing_type: 'mensual', benefits: ['Datos de las 10AM y 4PM', 'Grupo exclusivo'] }
    ]
  },
  {
    id: 'post_4',
    author_id: 'usr_diego',
    author_name: 'Diego Herrera (La Imaginaria)',
    author_role: 'company_owner',
    content: '📢 ¡AVISO OFICIAL DE TAQUILLAS! 📢\n\nYa está habilitada la recarga automática en 1-clic con Pago Móvil para todas las taquillas de Caracas, Valencia y Maracaibo. Cobro de premios sin intermediarios en menos de 5 minutos.',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800'],
    likes_count: 530,
    comments_count: 32,
    tips_count: 10,
    created_at: '2025-07-25T17:00:00Z',
    tags: ['taquillas', 'pagomovil', 'recargas']
  },
  {
    id: 'post_5',
    author_id: 'usr_valeria',
    author_name: 'Valeria Gómez',
    author_role: 'vip_creator',
    content: 'Terminando el entreno de hoy con toda la energía 💪 Recuerden que en mi chat privado les dejé el set de fotos exclusivo. ¡Vayan a desbloquearlo!',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800'],
    likes_count: 670,
    comments_count: 84,
    tips_count: 30,
    created_at: '2025-07-25T18:00:00Z',
    tags: ['fitness', 'fotos_vip', 'motivacion'],
    plans: [
      { id: 'plan_val_vip', name: 'VIP Elite', price: 9.99, billing_type: 'mensual', benefits: ['Sets de fotos completos', 'Chat privado'] }
    ]
  },
  {
    id: 'post_6',
    author_id: 'usr_crypto_bets',
    author_name: 'Daniel Crypto & Bets',
    author_role: 'tipster',
    content: '🚀 ¡RÉCORD EN AVIATOR CRASH! 🚀\n\nUn miembro de nuestro grupo acaba de cobrar en 25.4x con una apuesta de 100 VES llevándose 2,540 VES limpios. ¡Prueba el simulador demo en la sección de Juegos!',
    media_type: 'photo',
    media_urls: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'],
    likes_count: 780,
    comments_count: 92,
    tips_count: 45,
    created_at: '2025-07-25T19:30:00Z',
    tags: ['crash', 'aviator', 'multiplicador'],
    plans: [
      { id: 'plan_cr_vip', name: 'Bot de Señales Crash', price: 14.99, billing_type: 'mensual', benefits: ['Alertas de multiplicador 10x+', 'Estrategias'] }
    ]
  }
];

// Generar posts adicionales hasta 62 posts
const tagsPool = ['apuestas', 'parley', 'lotto_activo', 'champions', 'animalitos', 'bingo', 'fotos_vip', 'ganador'];
for (let p = 7; p <= 62; p++) {
  const author = users[p % users.length];
  const isTipster = author.role === 'tipster' || author.role === 'vip_creator';
  
  posts.push({
    id: `post_${p}`,
    author_id: author.id,
    author_name: author.full_name,
    author_role: author.role,
    content: `Pronóstico y reporte de jugadas #${p} en HandyBet: ¡La comunidad sigue activa con los mejores resultados y premios cobrados hoy! 🎯🍀`,
    media_type: p % 3 === 0 ? 'photo' : undefined,
    media_urls: p % 3 === 0 ? [`https://picsum.photos/seed/post_${p}/800/500`] : undefined,
    likes_count: Math.floor(50 + Math.random() * 450),
    comments_count: Math.floor(5 + Math.random() * 40),
    tips_count: Math.floor(Math.random() * 20),
    created_at: new Date(Date.now() - (65 - p) * 3600000).toISOString(),
    tags: [tagsPool[p % tagsPool.length], tagsPool[(p + 2) % tagsPool.length]],
    plans: isTipster ? [
      { id: `plan_${author.id}_sub`, name: 'Pase Exclusivo VIP', price: 5.99, billing_type: 'mensual', benefits: ['Alertas directas', 'Contenido premium'] }
    ] : undefined
  });
}

fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2));
console.log(`✅ posts.json generado con ${posts.length} publicaciones.`);

// ─── 9. NOTICIAS Y ANUNCIOS (+20 Noticias) ────────────────────
const news = [
  { id: 'nws_1', title: 'Gran Pozo Acumulado en el Sorteo de las 8:00 PM', summary: 'El Gran Kino Imaginario supera los 50,000 Puntos para la jornada de hoy.', category: 'sorteos', date: 'Hoy, 2:30 PM', url: '/games/g_gran_kino_juego', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600' },
  { id: 'nws_2', title: 'Champions League: Arrancan los Cuartos de Final', summary: 'Pronósticos, estadísticas y quinielas abiertas en HandyBet con cuotas especiales.', category: 'deportes', date: 'Hoy, 11:00 AM', url: '/games/g_quiniela_champions', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600' },
  { id: 'nws_3', title: 'Nueva Taquilla Oficial Inaugurada en Chacao VIP', summary: 'Agencias La Imaginaria abre un nuevo punto de atención y pagos directos.', category: 'taquillas', date: 'Ayer', url: '/channels/ch_taquilla_chacao', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600' },
  { id: 'nws_4', title: 'Récord de Ganadores en Bingo Bailable', summary: 'Más de 15 apostadores cantaron línea y bingo en la última edición sabatina.', category: 'bingos', date: 'Hace 2 días', url: '/games/g_bingo_bailable', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600' },
  { id: 'nws_5', title: 'Simulador Aviator Crash Disponible en HandyBet', summary: 'Los usuarios ya pueden probar la versión demo con créditos ficticios antes de apostar saldo real.', category: 'minijuegos', date: 'Hace 3 días', url: '/games/g_aviator_crash', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600' }
];

for (let n = 6; n <= 20; n++) {
  news.push({
    id: `nws_${n}`,
    title: `Boletín Oficial de Sorteos y Actualidad Deportiva #${n}`,
    summary: `Consulta los números ganadores y estadísticas actualizadas de la jornada en HandyBet.`,
    category: n % 2 === 0 ? 'loterias' : 'deportes',
    date: `Hace ${n - 3} días`,
    url: '/games',
    image: `https://picsum.photos/seed/news_${n}/600/400`
  });
}

fs.writeFileSync(path.join(dataDir, 'news.json'), JSON.stringify(news, null, 2));
console.log(`✅ news.json generado con ${news.length} noticias.`);

// ─── 10. RELACIONES Y SEGUIDORES (+55) ────────────────────────
const relationships = {
  follows: [],
  circles: [],
  follow_suggestions: []
};

// Generar red de seguidores cruzada y sugerencias dirigidas
users.forEach((u, i) => {
  // Seguir a los 5 anteriores
  for (let s = 1; s <= 5; s++) {
    const target = users[(i + s) % users.length];
    relationships.follows.push({
      follower_id: u.id,
      following_id: target.id,
      created_at: '2025-02-01T00:00:00Z'
    });
  }

  // Sugerencias de seguimiento dirigidas a este usuario
  const otherUsers = users.filter(other => other.id !== u.id);
  const pickedCandidates = [
    otherUsers[(i + 3) % otherUsers.length],
    otherUsers[(i + 7) % otherUsers.length],
    otherUsers[(i + 13) % otherUsers.length],
    otherUsers[(i + 19) % otherUsers.length],
    otherUsers[(i + 25) % otherUsers.length],
  ];

  pickedCandidates.forEach((cand, sIdx) => {
    relationships.follow_suggestions.push({
      id: `sug_${u.id}_${cand.id}_${sIdx}`,
      user_id: u.id,
      suggested_id: cand.id,
      mutual_followers: Math.floor(Math.random() * 25) + 3,
      reason: cand.role === 'vip_creator' ? 'Creadora destacada' : (cand.role === 'tipster' ? '82% de aciertos' : 'Jugador popular'),
      category: cand.role
    });
  });
});

fs.writeFileSync(path.join(dataDir, 'relationships.json'), JSON.stringify(relationships, null, 2));
console.log(`✅ relationships.json generado con ${relationships.follows.length} seguimientos y sugerencias.`);

console.log('🎉 ¡Generación masiva de mockdata completada exitosamente!');
