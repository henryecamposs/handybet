export const handyBetUsers = [
  {
    id: 'usr_admin',
    username: 'admin',
    password: 'admin', // En un entorno real esto estaría hasheado
    name: 'Administrador HandyBet',
    avatar: 'https://i.pravatar.cc/150?u=admin',
    bio: 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.',
    wallet_balance: 5000.00,
    email: 'admin@handybet.com',
    whatsapp: '+584121234567',
    birthDate: '1995-05-15',
    location: {
      country: 'Venezuela',
      state: 'Distrito Capital'
    },
    preferences: {
      favoriteCategories: ['Deportes ⚽', 'Loterías & Animalitos 🎲'],
      receiveNewsletter: true,
      receiveNotifications: true,
      acceptedTerms: false
    }
  },
  {
    id: 'usr_joselin',
    username: 'joselin_lagata',
    password: 'password123',
    name: 'Joselin La Gata',
    avatar: 'https://i.pravatar.cc/150?u=joselin',
    bio: 'Creadora de contenido VIP y entusiasta del hipismo.',
    wallet_balance: 1200.50,
    email: 'joselin@handybet.com',
    whatsapp: '+584149876543',
    birthDate: '2000-10-25',
    location: {
      country: 'Venezuela',
      state: 'Miranda'
    },
    preferences: {
      favoriteCategories: ['Hipismo 🏇', 'Casino 🎰'],
      receiveNewsletter: false,
      receiveNotifications: true,
      acceptedTerms: true
    }
  }
];

export const handyBetChannels = [
  {
    id: 'ch_joselin',
    name: 'Joselin La Gata VIP',
    type: 'media_sharing', // compartir medias
    owner_id: 'usr_joselin',
    description: 'Contenido exclusivo de videos y fotos',
    is_public: true, // Visible sin iniciar sesión
    plans: [
      { id: 'plan_free', name: 'Gratis', price: 0, benefits: ['Acceso a contenido público', 'Comentarios básicos'] },
      { id: 'plan_medium', name: 'Medio', price: 5.99, benefits: ['Videos exclusivos', 'Insignia de fan'] },
      { id: 'plan_pro', name: 'Pro', price: 14.99, benefits: ['Chat directo', 'Videos sin censura', 'Pedidos personalizados'] },
    ]
  },
  {
    id: 'ch_imaginaria',
    name: 'La Imaginaria',
    type: 'lottery_sales', // Empresa de ventas de loterias
    owner_id: 'usr_admin',
    description: 'La mejor agencia de loterías y animalitos de Venezuela',
    is_public: true,
    plans: [] // Sin planes de suscripción, ganan por apuestas
  }
];

export const handyBetGroups = [
  {
    id: 'grp_taquilla_ccs',
    channel_id: 'ch_imaginaria',
    name: 'Taquillas Caracas',
    type: 'betting_office',
    is_public: false, // Requiere solicitud para unirse
    members: ['usr_admin'],
    settings: {
      wallet_type: 'mixed', // Pago por apuesta o acumulación de saldo
      allows_recharge: true
    },
    // Datos de la taquilla para animalitos
    lottery_data: {
      name: 'Lotto Activo',
      type: 'animalitos_venezuela',
      draws: [
        { time: '09:00 AM', status: 'closed', winning_number: '00-BALLENA' },
        { time: '10:00 AM', status: 'closed', winning_number: '33-PESCADO' },
        { time: '11:00 AM', status: 'open' },
        { time: '12:00 PM', status: 'pending' },
      ],
      numbers: [
        { number: '00', name: 'BALLENA' },
        { number: '0', name: 'DELFIN' },
        { number: '01', name: 'CARNERO' },
        { number: '02', name: 'TORO' },
        // ... (resto de los animalitos)
        { number: '33', name: 'PESCADO' },
        { number: '34', name: 'VENADO' },
        { number: '35', name: 'JIRAFA' },
        { number: '36', name: 'CULEBRA' }
      ]
    }
  }
];
