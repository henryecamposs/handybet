export interface AnalyticsSession {
  id: string; // UUID
  user_id?: string | null;
  ip_address: string;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  device_type: 'web' | 'mobile_ios' | 'mobile_android' | 'unknown';
  session_start: string; // ISO string
  session_end?: string | null; // ISO string
  duration_seconds?: number | null;
}

export interface KPIDashboard {
  total_users: number;
  active_sessions: number;
  avg_connection_time: number;
  top_countries: { country: string; count: number }[];
}
