import { supabase } from '@/lib/supabaseClient';
import { AnalyticsSession, KPIDashboard } from '@/types/analytics';
import { Platform } from 'react-native';

class AnalyticsService {
  /**
   * Registra una nueva sesión de usuario en la base de datos de analíticas.
   */
  async recordSession(userId?: string): Promise<string | null> {
    try {
      // Obtenemos la IP usando un servicio gratuito (solo como ejemplo demostrativo, en prod usar edge function)
      let ip_address = 'Unknown';
      let country = 'Unknown';
      let region = 'Unknown';
      let city = 'Unknown';

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.ip) {
          ip_address = data.ip;
          country = data.country_name || data.country;
          region = data.region;
          city = data.city;
        }
      } catch (e) {
        console.log('Error fetching IP data:', e);
      }

      let device_type = 'unknown';
      if (Platform.OS === 'web') device_type = 'web';
      else if (Platform.OS === 'ios') device_type = 'mobile_ios';
      else if (Platform.OS === 'android') device_type = 'mobile_android';

      const { data, error } = await supabase.rpc('rpc_record_analytics_session', {
        p_user_id: userId || null,
        p_ip_address: ip_address,
        p_device_type: device_type,
        p_country: country,
        p_region: region,
        p_city: city,
      });

      if (error) {
        console.error('Error recording session:', error);
        return null;
      }

      return data as string; // UUID
    } catch (error) {
      console.error('Unexpected error in recordSession:', error);
      return null;
    }
  }

  /**
   * Actualiza el tiempo de fin de la sesión y calcula la duración.
   */
  async endSession(sessionId: string, durationSeconds: number): Promise<void> {
    try {
      const { error } = await supabase.rpc('rpc_update_analytics_session_end', {
        p_session_id: sessionId,
        p_duration_seconds: durationSeconds,
      });

      if (error) {
        console.error('Error ending session:', error);
      }
    } catch (error) {
      console.error('Unexpected error in endSession:', error);
    }
  }

  /**
   * Obtiene los KPIs para el panel administrativo.
   */
  async getAdminKPIs(): Promise<KPIDashboard | null> {
    try {
      const { data, error } = await supabase.rpc('rpc_get_admin_kpis');

      if (error) {
        console.error('Error fetching Admin KPIs:', error);
        return null;
      }

      return data as KPIDashboard;
    } catch (error) {
      console.error('Unexpected error in getAdminKPIs:', error);
      return null;
    }
  }

  /**
   * Obtiene la lista cruda de las sesiones recientes para la tabla de tráfico.
   */
  async getRecentTraffic(limit = 100): Promise<AnalyticsSession[]> {
    try {
      const { data, error } = await supabase
        .from('app_analytics_sessions')
        .select('*')
        .order('session_start', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent traffic:', error);
        return [];
      }

      return data as AnalyticsSession[];
    } catch (error) {
      console.error('Unexpected error in getRecentTraffic:', error);
      return [];
    }
  }
}

export const analyticsService = new AnalyticsService();
