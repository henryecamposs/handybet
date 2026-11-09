const fs = require('fs');
const path = require('path');

const dataDir = path.resolve(__dirname, '../src/data');
const users = JSON.parse(fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8'));
const channels = JSON.parse(fs.readFileSync(path.join(dataDir, 'channels.json'), 'utf8'));
const groups = JSON.parse(fs.readFileSync(path.join(dataDir, 'groups.json'), 'utf8'));

console.log(`📊 Datos cargados: ${users.length} usuarios, ${channels.length} canales, ${groups.length} grupos.`);

// Colecciones de fotos de alta calidad de Unsplash por categoría
const vipPhotos = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800',
];

const sportsPhotos = [
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  'https://images.unsplash.com/photo-1489944445391-11dd35572ac7?w=800',
  'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
  'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800',
  'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=800',
];

const cashierPhotos = [
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800',
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
  'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800',
];

const allPosts = [];
let postCounter = 1;

// ─── PARTE 1: 3 PUBLICACIONES POR CADA MIEMBRO (57 usuarios = 171 posts) ───
users.forEach((user, uIdx) => {
  const role = user.role;
  const name = user.full_name || user.username;
  const baseTime = Date.now() - (users.length - uIdx) * 7200000;

  // Post 1, 2 y 3 contextualizados según el oficio del usuario
  let postConfigs = [];

  if (role === 'vip_creator') {
    postConfigs = [
      {
        content: `¡Hola mis amores de HandyBet! 💖 Les acabo de subir una nueva sesión exclusiva tomada esta semana. Desbloqueen el set privado directamente en mi chat o suscríbanse a mi pase mensual para no perderse nada ✨🐾`,
        mediaUrl: vipPhotos[uIdx % vipPhotos.length],
        tags: ['fotos_vip', 'exclusivo', 'chat_privado'],
        plans: [
          { id: `plan_${user.id}_basic`, name: 'Pase Fans VIP', price: 9.99, billing_type: 'mensual', benefits: ['Chat ilimitado', 'Acceso a galería privada', 'Historias exclusivas'] },
          { id: `plan_${user.id}_premium`, name: 'VIP Diamante', price: 19.99, billing_type: 'mensual', benefits: ['Videollamadas mensuales', 'Sets sin censura', 'Atención 24/7'] }
        ]
      },
      {
        content: `Día de playa y desconexión ☀️🌊 Dejé un regalito especial para todos los suscriptores activos. ¡Abran el chat privado para desbloquear el contenido multimedia antes de que se acabe la promo! 🥂💋`,
        mediaUrl: vipPhotos[(uIdx + 3) % vipPhotos.length],
        tags: ['playa', 'lifestyle', 'fotos_vip'],
        plans: [
          { id: `plan_${user.id}_basic`, name: 'Pase Fans VIP', price: 9.99, billing_type: 'mensual', benefits: ['Chat ilimitado', 'Acceso a galería privada', 'Historias exclusivas'] }
        ]
      },
      {
        content: `¿Quién me acompaña esta noche? Estaré activa respondiendo mensajes directos y compartiendo avances del nuevo contenido. Recuerden que con su suscripción obtienen un 30% de descuento en el paywall 💎✨`,
        mediaUrl: vipPhotos[(uIdx + 6) % vipPhotos.length],
        tags: ['noche_vip', 'chat', 'comunidad'],
        plans: [
          { id: `plan_${user.id}_basic`, name: 'Pase Fans VIP', price: 9.99, billing_type: 'mensual', benefits: ['Chat ilimitado', 'Acceso a galería privada', 'Historias exclusivas'] }
        ]
      }
    ];
  } else if (role === 'tipster') {
    const animalitosNames = ['05-LEÓN', '12-CABALLO', '28-ZAMURO', '18-BURRO', '00-DELFÍN', '33-PESCADO'];
    const animalPick = animalitosNames[uIdx % animalitosNames.length];
    const parleyTeams = ['Yankees ML', 'Real Madrid Gana', 'Dodgers Over 8.5', 'Lakers -4.5', 'Man City +2.5'];

    postConfigs = [
      {
        content: `🎯 ¡PRONÓSTICO DE PODER DEL DÍA! 🎯\n\nAnalizando la tabla matemática de hoy, la línea más clara viene por el ${animalPick} para el sorteo de las 4:00 PM con más de 82% de efectividad.\n\n¡Sellando con fuerza en taquilla! Suscríbete a mi canal para recibir los datos de 10:00 AM y 7:00 PM 🍀📊`,
        mediaUrl: sportsPhotos[uIdx % sportsPhotos.length],
        tags: ['animalitos', 'lotto_activo', 'la_fija', 'pronosticos'],
        plans: [
          { id: `plan_${user.id}_tips`, name: 'Club de Pronósticos VIP', price: 4.99, billing_type: 'mensual', benefits: ['Datos fijos diarios', 'Alertas WhatsApp/Chat', 'Grupo exclusivo'] },
          { id: `plan_${user.id}_parley`, name: 'Parley Master Gold', price: 9.99, billing_type: 'mensual', benefits: ['3 parleys diarios cuota 5+', 'Jugada millonaria semanal', 'Asesoría 1 a 1'] }
        ]
      },
      {
        content: `🔥 PARLEY COMBINADO DE 4 LOGROS (Cuota 7.85) 🔥\n\n1. ${parleyTeams[0]}\n2. ${parleyTeams[1]}\n3. ${parleyTeams[2]}\n4. ${parleyTeams[3]}\n\n¡Ayer cobramos completo! No te quedes por fuera de la jugada nocturna. Activa el botón de suscripción para recibir la tarjeta oficial sellada 👇`,
        mediaUrl: sportsPhotos[(uIdx + 2) % sportsPhotos.length],
        tags: ['parley', 'deportes', 'champions', 'ganador'],
        plans: [
          { id: `plan_${user.id}_tips`, name: 'Club de Pronósticos VIP', price: 4.99, billing_type: 'mensual', benefits: ['Datos fijos diarios', 'Alertas WhatsApp/Chat', 'Grupo exclusivo'] }
        ]
      },
      {
        content: `✅ ¡TAQUILLA PAGANDO! TICKET COBRADO AL 100% 💰\n\nFelicidades a todos los miembros de mi sala que confiaron en la combinada. Cobramos más de 12,400 Bs limpios. ¡La disciplina y la estadística pagan! Suscríbete para sumarte a la racha ganadora 🚀`,
        mediaUrl: sportsPhotos[(uIdx + 4) % sportsPhotos.length],
        tags: ['cobrado', 'apuesta_ganadora', 'exito', 'handybet'],
        plans: [
          { id: `plan_${user.id}_tips`, name: 'Club de Pronósticos VIP', price: 4.99, billing_type: 'mensual', benefits: ['Datos fijos diarios', 'Alertas WhatsApp/Chat', 'Grupo exclusivo'] }
        ]
      }
    ];
  } else if (role === 'cashier') {
    postConfigs = [
      {
        content: `🏛️ TAQUILLA OFICIAL ABIERTA - ATENCIÓN INMEDIATA 🏛️\n\nDisponibles recargas y cobros instantáneos por Pago Móvil Banesco, Mercantil, Venezuela y Bancamiga. ¡Sin demoras ni comisiones ocultas! Escríbenos al chat para procesar tu saldo en 2 minutos ⚡`,
        mediaUrl: cashierPhotos[uIdx % cashierPhotos.length],
        tags: ['taquillas', 'recargas', 'pagomovil', 'saldo']
      },
      {
        content: `🎟️ ¡LOTERÍAS ACTIVAS PARA LA JORNADA DE HOY! 🎟️\n\nSorteos habilitados: Triple Zulia, Chance, Táchira, Caracas y Gran Kino. Además contamos con bono del 10% adicional en tu primera recarga del día en nuestra taquilla. ¡Acércate o juega digital desde HandyBet! 🍀`,
        mediaUrl: cashierPhotos[(uIdx + 1) % cashierPhotos.length],
        tags: ['loterias', 'sorteos', 'taquilla_oficial', 'bono']
      },
      {
        content: `💵 ¡PREMIO MAYOR COBRADO EN TAQUILLA! 💵\n\nAcabamos de liquidar 18,500 Bs. a un ganador de la jugada del mediodía. Garantizamos liquidez total y pagos al instante para todos los miembros. ¡Gracias por preferirnos! 🤝`,
        mediaUrl: cashierPhotos[(uIdx + 2) % cashierPhotos.length],
        tags: ['premios', 'pagos_al_instante', 'confianza', 'taquillas']
      }
    ];
  } else if (role === 'company_owner' || role === 'admin') {
    postConfigs = [
      {
        content: `🛡️ COMUNICADO OFICIAL HANDYBET & LA IMAGINARIA 🛡️\n\nQueremos recordar a toda la comunidad que las billeteras y saldos están respaldados con garantía de liquidez 100%. Las taquillas aliadas y canales oficiales operan 24/7 con soporte directo en la plataforma. ¡Gracias por ser parte del ecosistema! 🚀`,
        mediaUrl: sportsPhotos[uIdx % sportsPhotos.length],
        tags: ['oficial', 'seguridad', 'garantia', 'handybet']
      },
      {
        content: `🚀 ¡NUEVA FUNCIÓN: SIMULADOR DE JUEGOS DEMO! 🎮\n\nYa puedes probar Aviator Crash y los minijuegos en modalidad demo con créditos ficticios antes de jugar tu saldo real. Visita la pestaña de Juegos y perfecciona tu estrategia sin riesgo 🍀`,
        mediaUrl: sportsPhotos[(uIdx + 3) % sportsPhotos.length],
        tags: ['innovacion', 'juegos', 'minijuegos', 'actualizacion']
      },
      {
        content: `📈 GRAN POZO ACUMULADO PARA EL SORTEO NOCTURNO 🌟\n\nEl pozo de hoy supera los 50,000 puntos en premios. Recuerda que puedes seguir a los pronosticadores más acertados y unirte a los grupos de salas oficiales desde el Directorio de Miembros. ¡Éxito a todos los participantes! 🎯`,
        mediaUrl: sportsPhotos[(uIdx + 5) % sportsPhotos.length],
        tags: ['sorteos', 'gran_pozo', 'comunidad', 'premios']
      }
    ];
  } else {
    // Players (jugadores estándar)
    postConfigs = [
      {
        content: `¡Miren lo que acabo de pegar en la taquilla con una jugada de 50 Bs! Me llevé 1,250 Bs limpios con el 12-Caballo 🤑🍀 La suerte estuvo de mi lado hoy, gracias a los datos de la comunidad.`,
        mediaUrl: sportsPhotos[uIdx % sportsPhotos.length],
        tags: ['apuesta_ganadora', 'suerte', 'animalitos']
      },
      {
        content: `¿Quién está viendo el partido de Champions hoy? Tengo una apuesta al Real Madrid +2.5 goles. ¿Cómo ven las probabilidades? Dejen sus comentarios 👇⚽`,
        tags: ['futbol', 'champions', 'parley']
      },
      {
        content: `Probando la demo de Aviator Crash y saqué multiplicador en 18.5x 😱 ¡Increíble la adrenalina! Ya cargué saldo en la billetera para la jugada en vivo de esta noche.`,
        tags: ['aviator', 'minijuegos', 'comunidad']
      }
    ];
  }

  postConfigs.forEach((cfg, pIdx) => {
    allPosts.push({
      id: `post_usr_${user.id}_${pIdx + 1}`,
      author_id: user.id,
      author_name: name,
      author_role: role,
      visibility_level: 'todos',
      content: cfg.content,
      media_type: cfg.mediaUrl ? 'photo' : undefined,
      media_urls: cfg.mediaUrl ? [cfg.mediaUrl] : undefined,
      likes_count: Math.floor(60 + Math.random() * 550),
      comments_count: Math.floor(10 + Math.random() * 65),
      tips_count: Math.floor(Math.random() * 30),
      created_at: new Date(baseTime + pIdx * 2400000).toISOString(),
      tags: cfg.tags || ['handybet', 'comunidad'],
      plans: cfg.plans || undefined
    });
    postCounter++;
  });
});

console.log(`✅ ${allPosts.length} publicaciones de miembros creadas.`);

// ─── PARTE 2: 3 PUBLICACIONES POR CADA CANAL (52 canales = 156 posts) ───
channels.forEach((channel, cIdx) => {
  const baseTime = Date.now() - (channels.length - cIdx) * 10800000;
  const authorUser = users.find(u => u.id === channel.owner_id) || users[cIdx % users.length];

  const channelPosts = [
    {
      content: `📢 ¡COMUNICADO OFICIAL DEL CANAL: ${channel.name.toUpperCase()}! 📢\n\nYa están abiertas las salas y taquillas para los sorteos del día de hoy. Todos los resultados se publican en tiempo real con validación directa de La Imaginaria. ¡Entra a nuestras salas para participar! 🍀`,
      mediaUrl: sportsPhotos[cIdx % sportsPhotos.length],
      tags: ['canal_oficial', 'sorteos', 'apuestas', 'horarios']
    },
    {
      content: `🏆 POZO ESPECIAL Y TABLA DE PREMIOS EN ${channel.name.toUpperCase()} 🏆\n\nEl pozo acumulado para esta noche alcanza un nuevo récord. Consulta los términos y participa sellando tus boletos a través de nuestras taquillas autorizadas o saldo digital HandyBet 💰🎯`,
      mediaUrl: cashierPhotos[cIdx % cashierPhotos.length],
      tags: ['pozo_acumulado', 'premios', 'taquilla', 'ganadores']
    },
    {
      content: `✅ RESULTADOS OFICIALES Y COBROS DEL ÚLTIMO SORTEO ✅\n\nFelicitamos a todos los afortunados ganadores de las salas de ${channel.name}. Los pagos se encuentran 100% acreditados en sus billeteras. ¡Nos vemos en la siguiente edición! 🤝✨`,
      mediaUrl: sportsPhotos[(cIdx + 3) % sportsPhotos.length],
      tags: ['resultados', 'cobros_inmediatos', 'verificado', 'comunidad']
    }
  ];

  channelPosts.forEach((cfg, cpIdx) => {
    allPosts.push({
      id: `post_ch_${channel.id}_${cpIdx + 1}`,
      author_id: authorUser.id,
      author_name: authorUser.full_name || authorUser.username,
      author_role: authorUser.role,
      channel_id: channel.id,
      visibility_level: 'todos',
      content: cfg.content,
      media_type: 'photo',
      media_urls: [cfg.mediaUrl],
      likes_count: Math.floor(120 + Math.random() * 600),
      comments_count: Math.floor(15 + Math.random() * 80),
      tips_count: Math.floor(Math.random() * 25),
      created_at: new Date(baseTime + cpIdx * 3600000).toISOString(),
      tags: cfg.tags
    });
    postCounter++;
  });
});

console.log(`✅ ${channels.length * 3} publicaciones de canales creadas.`);

// ─── PARTE 3: 3 PUBLICACIONES POR CADA GRUPO (56 grupos = 168 posts) ───
groups.forEach((group, gIdx) => {
  const baseTime = Date.now() - (groups.length - gIdx) * 9000000;
  const authorUser = users[(gIdx + 5) % users.length];

  const groupPosts = [
    {
      content: `💬 ¡BIENVENIDOS A LA SALA: ${group.name.toUpperCase()}! 💬\n\nEsta es la sala oficial para compartir pronósticos, debatir jugadas y celebrar los aciertos de la comunidad. Código de sala: ${group.short_code}. Recuerden respetar las normas de convivencia 🤝`,
      tags: ['sala_oficial', 'comunidad', 'debate', 'grupo']
    },
    {
      content: `🔥 SEÑALES Y DEBATE EN VIVO EN ${group.name.toUpperCase()} 🔥\n\nLos miembros activos están analizando las opciones más fuertes para los eventos de hoy. ¡Entra al chat grupal y no te quedes por fuera de la conversación! ⚡🎯`,
      mediaUrl: sportsPhotos[gIdx % sportsPhotos.length],
      tags: ['chat_en_vivo', 'senales', 'pronosticos', 'grupo']
    },
    {
      content: `🎉 ¡GANADOR EN NUESTRA SALA ${group.name.toUpperCase()}! 🎉\n\nUn integrante de este grupo acaba de cantar acierto con cuota alta. ¡Felicidades a los que siguieron la señal! La unión hace la fuerza en HandyBet 🍀💸`,
      mediaUrl: sportsPhotos[(gIdx + 2) % sportsPhotos.length],
      tags: ['ganador_en_sala', 'exito_grupal', 'cobrado']
    }
  ];

  groupPosts.forEach((cfg, gpIdx) => {
    allPosts.push({
      id: `post_grp_${group.id}_${gpIdx + 1}`,
      author_id: authorUser.id,
      author_name: authorUser.full_name || authorUser.username,
      author_role: authorUser.role,
      group_id: group.id,
      visibility_level: 'todos',
      content: cfg.content,
      media_type: cfg.mediaUrl ? 'photo' : undefined,
      media_urls: cfg.mediaUrl ? [cfg.mediaUrl] : undefined,
      likes_count: Math.floor(40 + Math.random() * 380),
      comments_count: Math.floor(8 + Math.random() * 50),
      tips_count: Math.floor(Math.random() * 15),
      created_at: new Date(baseTime + gpIdx * 2800000).toISOString(),
      tags: cfg.tags
    });
    postCounter++;
  });
});

console.log(`✅ ${groups.length * 3} publicaciones de grupos creadas.`);
console.log(`🎉 Total de publicaciones generadas: ${allPosts.length}`);

// Guardar en src/data/posts.json
fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(allPosts, null, 2));
console.log(`💾 Guardado exitoso en ${path.join(dataDir, 'posts.json')}`);
