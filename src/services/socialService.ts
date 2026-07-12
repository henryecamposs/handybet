import { supabase } from '../lib/supabaseClient';
import { Post, Friendship } from '../types/handyBet';

// Mock data de fallback para garantizar que la app siempre funcione en desarrollo
const MOCK_FRIENDSHIPS: Friendship[] = [
  { user_id_1: 'usr_admin', user_id_2: 'usr_player1', status: 'accepted', created_at: new Date().toISOString() },
  { user_id_1: 'usr_player1', user_id_2: 'usr_player2', status: 'accepted', created_at: new Date().toISOString() }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post_1',
    author_id: 'usr_player1',
    author: { id: 'usr_player1', full_name: 'Joselin La Gata', avatar_url: 'https://i.pravatar.cc/150?u=joselin' },
    group_id: 'grp_1',
    group: { id: 'grp_1', name: 'Taquillas Caracas' },
    content: '📢 ¡Activados los sorteos de Lotto Activo para esta mañana! Confecciona tu jugada o deposita a tu wallet. El triple 33 anda súper caliente 🔥',
    media_type: 'photo',
    media_url: 'https://placehold.co/600x400/222222/FFF?text=Contenido+VIP+Joselin',
    visibility_level: 'todos',
    post_type: 'regular',
    payment_status: 'none_required',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  },
  {
    id: 'post_2',
    author_id: 'usr_admin',
    author: { id: 'usr_admin', full_name: 'Administrador HandyBet', avatar_url: 'https://i.pravatar.cc/150?u=admin' },
    group_id: null,
    group: null,
    content: 'Juega seguro, juega móvil. Recarga hoy tu billetera y obtén 10% adicional de bono de bienvenida.',
    media_type: 'photo',
    media_url: 'https://placehold.co/600x400/222222/00C800?text=Bono+HandyBet',
    visibility_level: 'todos',
    post_type: 'advertisement',
    payment_status: 'pagado',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString()
  }
];

export const socialService = {
  // Obtener amistades del usuario actual
  async getFriendships(userId: string): Promise<Friendship[]> {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Usando mock friendships por falla en base de datos:', err);
      return MOCK_FRIENDSHIPS.filter(f => f.user_id_1 === userId || f.user_id_2 === userId);
    }
  },

  // Crear una nueva publicación (con soporte Pay-to-Post)
  async createPost(postData: Omit<Post, 'id' | 'created_at'>): Promise<Post> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select(`
          *,
          author:profiles(id, full_name, avatar_url),
          group:groups(id, name)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Simulando inserción de publicación por falla en DB:', err);
      const newPost: Post = {
        ...postData,
        id: `post_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };
      MOCK_POSTS.unshift(newPost);
      return newPost;
    }
  },

  // Feed principal: Algoritmo de Visibilidad, Sugeridos y Anuncios Monetizados
  async getFeedPosts(userId: string): Promise<Post[]> {
    try {
      // 1. Obtener lista de amigos directos
      const { data: directFriendsData } = await supabase
        .from('friendships')
        .select('user_id_1, user_id_2')
        .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
        .eq('status', 'accepted');

      const directFriends = (directFriendsData || []).map(f => 
        f.user_id_1 === userId ? f.user_id_2 : f.user_id_1
      );

      // 2. Obtener grupos a los que pertenece el usuario
      const { data: memberGroupsData } = await supabase
        .from('memberships')
        .select('group_id')
        .eq('user_id', userId)
        .eq('status', 'active');
      
      const memberGroups = (memberGroupsData || []).map(m => m.group_id);

      // 3. Ejecutar consulta relacional del feed
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url),
          group:groups(id, name)
        `)
        .neq('payment_status', 'pendiente_pago')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filtrado por capas de visibilidad en el cliente (como respaldo a nivel de servidor)
      return (data || []).filter((post: any) => {
        // Capa pública
        if (post.visibility_level === 'todos') return true;
        // Publicidad pagada y activa
        if (post.post_type === 'advertisement' && post.payment_status === 'pagado') return true;
        // Capa de miembros de grupos
        if (post.group_id && memberGroups.includes(post.group_id)) return true;
        // Capa de amigos directos
        if (directFriends.includes(post.author_id) && post.visibility_level === 'amigos') return true;
        
        return post.author_id === userId;
      });

    } catch (err) {
      console.warn('Usando mock feed posts por falla en base de datos:', err);
      return MOCK_POSTS;
    }
  }
};
