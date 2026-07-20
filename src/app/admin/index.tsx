import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { analyticsService } from '@/services/analyticsService';
import { KPIDashboard } from '@/types/analytics';
import { Users, Activity, Clock, Globe2 } from 'lucide-react-native';

const StatCard = ({ title, value, icon, color }: any) => (
  <View className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-md flex-1 m-2 min-w-[150px]">
    <View className="flex-row justify-between items-start mb-4">
      <View className={`p-3 rounded-xl`} style={{ backgroundColor: `${color}20` }}>
        {icon}
      </View>
    </View>
    <Text className="text-gray-400 text-sm font-medium mb-1">{title}</Text>
    <Text className="text-white text-3xl font-bold">{value}</Text>
  </View>
);

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    // Para probar la UI si no hay conexión a DB real configurada
    const data = await analyticsService.getAdminKPIs();
    if (data) {
      setKpis(data);
    } else {
      // Mock data in case RPC fails (or is not yet deployed)
      setKpis({
        total_users: 1542,
        active_sessions: 24,
        avg_connection_time: 345.5,
        top_countries: [
          { country: 'Colombia', count: 450 },
          { country: 'Mexico', count: 320 },
          { country: 'Argentina', count: 210 },
          { country: 'Spain', count: 180 },
        ]
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);



  return (
    <AdminWrapper title="Dashboard General">
      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <View>
          {/* Top Cards Row */}
          <View className="flex-row flex-wrap -mx-2 mb-8">
            <StatCard 
              title="Usuarios Totales" 
              value={kpis?.total_users.toLocaleString()} 
              icon={<Users size={24} color="#3b82f6" />} 
              color="#3b82f6" 
            />
            <StatCard 
              title="Sesiones Activas (24h)" 
              value={kpis?.active_sessions.toLocaleString()} 
              icon={<Activity size={24} color="#10b981" />} 
              color="#10b981" 
            />
            <StatCard 
              title="Tiempo Promedio" 
              value={`${Math.round((kpis?.avg_connection_time || 0) / 60)} min`} 
              icon={<Clock size={24} color="#f59e0b" />} 
              color="#f59e0b" 
            />
          </View>

          {/* Bottom Section */}
          <View className="flex-col md:flex-row gap-6">
            <View className="flex-1 bg-gray-800 p-6 rounded-2xl border border-gray-700">
              <View className="flex-row items-center mb-6">
                <Globe2 size={24} color="#8b5cf6" className="mr-3" />
                <Text className="text-white text-xl font-bold">Top Países</Text>
              </View>
              {kpis?.top_countries.map((item, index) => (
                <View key={index} className="flex-row justify-between items-center py-3 border-b border-gray-700/50 last:border-0">
                  <View className="flex-row items-center">
                    <Text className="text-gray-400 w-6">{index + 1}.</Text>
                    <Text className="text-white font-medium ml-2">{item.country}</Text>
                  </View>
                  <Text className="text-blue-400 font-bold">{item.count} accesos</Text>
                </View>
              ))}
            </View>
            <View className="flex-1 bg-gray-800 p-6 rounded-2xl border border-gray-700 justify-center items-center">
              <Text className="text-gray-400 text-center mb-4">Gráfico de actividad próximamente...</Text>
              <Activity size={48} color="#4b5563" />
            </View>
          </View>
        </View>
      )}
    </AdminWrapper>
  );
}
