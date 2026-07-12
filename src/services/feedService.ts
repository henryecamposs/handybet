// Usaremos mock data o supabase según proceda
import { handyBetUsers } from '../mockdata/handyBetMock';

export const feedService = {
  async getFeedPosts(): Promise<any[]> {
    // Retornamos las publicaciones simuladas conectadas a la mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            author: 'Joselin La Gata',
            username: '@joselin_lagata',
            avatar: 'https://i.pravatar.cc/150?u=joselin',
            time: 'Hace 10 min',
            text: '🔥 ¡Chicos, ya están disponibles los nuevos videos exclusivos en mi canal Pro! Además estaré enviando saludos personalizados hoy en la noche. No te quedes por fuera 🐾',
            mediaType: 'photo',
            mediaUrl: 'https://placehold.co/600x400/222222/FFF?text=Contenido+VIP+Joselin',
          },
          {
            id: 2,
            author: 'La Imaginaria (Taquilla Caracas)',
            username: '@taquillas_ccs',
            avatar: 'https://i.pravatar.cc/150?u=admin',
            time: 'Hace 35 min',
            text: '📢 ¡Activados los sorteos de Lotto Activo para esta mañana! Confecciona tu jugada desde el feed o deposita directo a tu wallet. El pescado 33 anda súper caliente 🔥',
            mediaType: 'video',
            mediaUrl: 'https://placehold.co/600x400/222222/00C800?text=Sorteo+En+Vivo',
          }
        ]);
      }, 500);
    });
  }
};
