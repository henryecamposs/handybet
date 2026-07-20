import { supabase } from '../lib/supabaseClient';
import { 
  Profile, 
  Channel, 
  Group, 
  Wallet, 
  Bet, 
  Post, 
  PostComment, 
  Membership, 
  Transaction,
  ChannelCreationPayload,
  GroupCreationPayload
} from '../types/handyBet';

/**
 * Servicio unificado de base de datos relacional para HandyBet (Supabase)
 * Adaptado a la base de datos reestructurada con soporte para campos JSONB dinámicos y funciones RPC.
 */
export const databaseService = {
  // ============================================================================
  // 1. PERFILES DE USUARIO (PROFILES)
  // ============================================================================
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[databaseService] Error al obtener perfil:', error.message);
      return null;
    }
    return data as Profile;
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('[databaseService] Error al actualizar perfil:', error.message);
      return null;
    }
    return data as Profile;
  },

  async searchProfiles(query: string, limit = 20): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(limit);

    if (error) {
      console.error('[databaseService] Error al buscar perfiles:', error.message);
      return [];
    }
    return data as Profile[];
  },

  // ============================================================================
  // 2. CANALES (CHANNELS)
  // ============================================================================
  async getChannels(limit = 20): Promise<Channel[]> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[databaseService] Error al obtener canales:', error.message);
      return [];
    }
    return data as Channel[];
  },

  async getChannelById(channelId: string): Promise<Channel | null> {
    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('id', channelId)
      .single();

    if (error) {
      console.error('[databaseService] Error al obtener canal por ID:', error.message);
      return null;
    }
    return data as Channel;
  },

  async createChannel(ownerId: string, payload: ChannelCreationPayload): Promise<Channel | null> {
    const { data, error } = await supabase
      .from('channels')
      .insert([{
        owner_id: ownerId,
        name: payload.name,
        description: payload.description,
        visibility: payload.visibility,
        is_18_plus: payload.is_18_plus,
        target_audience: payload.target_audience,
        interests: payload.interests,
        avatar_url: payload.avatar_url,
        cover_url: payload.cover_url,
        plans: [],
        settings: {}
      }])
      .select()
      .single();

    if (error) {
      console.error('[databaseService] Error al crear canal:', error.message);
      return null;
    }
    return data as Channel;
  },

  // ============================================================================
  // 3. GRUPOS (GROUPS)
  // ============================================================================
  async getGroups(limit = 30): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[databaseService] Error al obtener grupos:', error.message);
      return [];
    }
    return data as Group[];
  },

  async getGroupsByChannel(channelId: string): Promise<Group[]> {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[databaseService] Error al obtener grupos por canal:', error.message);
      return [];
    }
    return data as Group[];
  },

  async createGroup(shortCode: string, payload: GroupCreationPayload): Promise<Group | null> {
    const { data, error } = await supabase
      .from('groups')
      .insert([{
        channel_id: payload.channel_id || null,
        short_code: shortCode,
        name: payload.name,
        description: payload.description,
        type: payload.type,
        tags: payload.tags,
        configured_bots: payload.configured_bots,
        settings: payload.settings,
        config: {}
      }])
      .select()
      .single();

    if (error) {
      console.error('[databaseService] Error al crear grupo:', error.message);
      return null;
    }
    return data as Group;
  },

  // ============================================================================
  // 4. MEMBRESÍAS & MONEDEROS MULTI-WALLET
  // ============================================================================
  async getUserMemberships(userId: string): Promise<Membership[]> {
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[databaseService] Error al obtener membresías:', error.message);
      return [];
    }
    return data as Membership[];
  },

  async getUserWallets(userId: string): Promise<Wallet[]> {
    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[databaseService] Error al obtener monederos:', error.message);
      return [];
    }
    return data as Wallet[];
  },

  // ============================================================================
  // 5. APUESTAS & FINANCIAL RPC (`SECURITY DEFINER`)
  // ============================================================================
  async placeBetViaRPC(groupId: string, betCode: string, betData: any, amount: number): Promise<string | null> {
    const { data, error } = await supabase.rpc('rpc_place_handybet_bet', {
      p_group_id: groupId,
      p_bet_code: betCode,
      p_bet_data: betData,
      p_amount: amount,
    });

    if (error) {
      console.error('[databaseService] Error RPC al colocar apuesta:', error.message);
      throw new Error(error.message);
    }
    return data as string;
  },

  async getUserBets(userId: string): Promise<Bet[]> {
    const { data, error } = await supabase
      .from('bets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[databaseService] Error al obtener apuestas:', error.message);
      return [];
    }
    return data as Bet[];
  },

  async getWalletTransactions(walletId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[databaseService] Error al obtener transacciones:', error.message);
      return [];
    }
    return data as Transaction[];
  },

  // ============================================================================
  // 6. FEEDS, POSTS & COMENTARIOS (VISTA PRE-COMPILADA VIEW_USER_FEED)
  // ============================================================================
  async getFeedPosts(limit = 30): Promise<Post[]> {
    const { data, error } = await supabase
      .from('view_user_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[databaseService] Error al cargar vista de feed:', error.message);
      return [];
    }
    return data as unknown as Post[];
  },

  async createPost(postPayload: Omit<Post, 'id' | 'created_at'>): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .insert([postPayload])
      .select()
      .single();

    if (error) {
      console.error('[databaseService] Error al crear post:', error.message);
      return null;
    }
    return data as Post;
  },

  async getPostComments(postId: string): Promise<PostComment[]> {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*, profiles(full_name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[databaseService] Error al obtener comentarios:', error.message);
      return [];
    }
    return (data || []).map((row: any) => ({
      id: row.id,
      post_id: row.post_id,
      author_id: row.author_id,
      author_name: row.profiles?.full_name || 'Usuario',
      author_avatar: row.profiles?.avatar_url || '',
      content: row.content,
      created_at: row.created_at
    }));
  },

  async addPostComment(postId: string, authorId: string, content: string): Promise<PostComment | null> {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{ post_id: postId, author_id: authorId, content }])
      .select()
      .single();

    if (error) {
      console.error('[databaseService] Error al agregar comentario:', error.message);
      return null;
    }
    return data as PostComment;
  }
};
