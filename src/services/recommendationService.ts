import { supabase } from '../lib/supabaseClient';

export interface SuggestedUser {
  suggested_id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  common_interests_count: number;
  mutual_groups_count: number;
  recommendation_score: number;
}

/**
 * Servicio de Recomendaciones Inteligentes e Indexación Social
 */
export const recommendationService = {
  /**
   * Obtiene sugerencias de usuarios basadas en el algoritmo RPC de la base de datos
   */
  async getSuggestedUsers(userId: string, limit = 10): Promise<SuggestedUser[]> {
    const { data, error } = await supabase.rpc('rpc_get_suggested_users', {
      p_user_id: userId,
      p_limit: limit,
    });

    if (error) {
      console.error('Error al consultar sugerencias de usuarios:', error.message);
      return [];
    }
    return data as SuggestedUser[];
  },

  /**
   * Alterna el estado de seguimiento unidireccional de un usuario objetivo
   */
  async toggleFollowUser(targetUserId: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('rpc_toggle_follow', {
      p_target_id: targetUserId,
    });

    if (error) {
      console.error('Error al cambiar seguimiento:', error.message);
      return false;
    }
    return Boolean(data);
  },

  /**
   * Busca grupos afines filtrando por etiquetas e intereses
   */
  async searchGroupsByTags(tags: string[], limit = 20) {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .overlaps('tags', tags)
      .limit(limit);

    if (error) {
      console.error('Error al buscar grupos por tags:', error.message);
      return [];
    }
    return data;
  }
};
