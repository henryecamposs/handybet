-- Migración para el sistema de Analytics Administrativo

-- 1. Crear la tabla de sesiones de analíticas
CREATE TABLE IF NOT EXISTS public.app_analytics_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Vincula si hay sesión
    ip_address TEXT,
    country TEXT,
    region TEXT,
    city TEXT,
    device_type TEXT CHECK (device_type IN ('web', 'mobile_ios', 'mobile_android', 'unknown')),
    session_start TIMESTAMPTZ DEFAULT now(),
    session_end TIMESTAMPTZ,
    duration_seconds INTEGER
);

-- 2. Habilitar RLS en la tabla
ALTER TABLE public.app_analytics_sessions ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Seguridad (RLS)
-- Todos pueden insertar (ya que los visitantes no autenticados también generan tráfico)
CREATE POLICY "Permitir inserción pública para analytics" ON public.app_analytics_sessions
    FOR INSERT WITH CHECK (true);

-- Permitir lectura general (protegida por app en UI)
CREATE POLICY "Permitir lectura general (protegida por app en UI)" ON public.app_analytics_sessions
    FOR SELECT USING (true);


-- 4. Función RPC para registrar una sesión
CREATE OR REPLACE FUNCTION rpc_record_analytics_session(
    p_user_id UUID,
    p_ip_address TEXT,
    p_device_type TEXT,
    p_country TEXT DEFAULT 'Unknown',
    p_region TEXT DEFAULT 'Unknown',
    p_city TEXT DEFAULT 'Unknown'
) RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
BEGIN
    INSERT INTO public.app_analytics_sessions (
        user_id, ip_address, device_type, country, region, city
    ) VALUES (
        p_user_id, p_ip_address, p_device_type, p_country, p_region, p_city
    ) RETURNING id INTO v_session_id;
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Función RPC para actualizar el final de sesión y duración
CREATE OR REPLACE FUNCTION rpc_update_analytics_session_end(
    p_session_id UUID,
    p_duration_seconds INTEGER
) RETURNS VOID AS $$
BEGIN
    UPDATE public.app_analytics_sessions
    SET 
        session_end = now(),
        duration_seconds = p_duration_seconds
    WHERE id = p_session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Función RPC para obtener KPIs del Dashboard Administrativo
CREATE OR REPLACE FUNCTION rpc_get_admin_kpis()
RETURNS JSON AS $$
DECLARE
    v_total_users INTEGER;
    v_active_sessions INTEGER;
    v_avg_connection_time NUMERIC;
    v_top_countries JSON;
BEGIN
    -- Usuarios registrados
    SELECT COUNT(*) INTO v_total_users FROM public.profiles;
    
    -- Sesiones activas (aquellas sin session_end registradas en las últimas 24 horas)
    SELECT COUNT(*) INTO v_active_sessions 
    FROM public.app_analytics_sessions 
    WHERE session_end IS NULL AND session_start > (now() - interval '24 hours');
    
    -- Promedio de tiempo de conexión (en segundos)
    SELECT COALESCE(AVG(duration_seconds), 0) INTO v_avg_connection_time 
    FROM public.app_analytics_sessions 
    WHERE duration_seconds IS NOT NULL;
    
    -- Top países
    SELECT json_agg(row_to_json(t)) INTO v_top_countries
    FROM (
        SELECT country, COUNT(*) as count
        FROM public.app_analytics_sessions
        GROUP BY country
        ORDER BY count DESC
        LIMIT 5
    ) t;

    RETURN json_build_object(
        'total_users', v_total_users,
        'active_sessions', v_active_sessions,
        'avg_connection_time', ROUND(v_avg_connection_time, 2),
        'top_countries', COALESCE(v_top_countries, '[]'::JSON)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
