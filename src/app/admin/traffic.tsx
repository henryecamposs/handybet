import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { AdminWrapper } from '@/components/admin/AdminWrapper';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSession } from '@/types/analytics';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Monitor, Smartphone, HelpCircle } from 'lucide-react-native';

const columnHelper = createColumnHelper<AnalyticsSession>();

const columns = [
  columnHelper.accessor('ip_address', {
    header: 'Dirección IP',
    cell: info => <Text className="text-white font-medium">{info.getValue()}</Text>,
  }),
  columnHelper.accessor('country', {
    header: 'Ubicación',
    cell: info => (
      <Text className="text-gray-300">
        {info.getValue()} {info.row.original.city && `- ${info.row.original.city}`}
      </Text>
    ),
  }),
  columnHelper.accessor('device_type', {
    header: 'Dispositivo',
    cell: info => {
      const type = info.getValue();
      if (type === 'web') return <Monitor size={16} color="#3b82f6" />;
      if (type?.includes('mobile')) return <Smartphone size={16} color="#10b981" />;
      return <HelpCircle size={16} color="#9ca3af" />;
    },
  }),
  columnHelper.accessor('session_start', {
    header: 'Inicio de Conexión',
    cell: info => {
      const date = new Date(info.getValue());
      return <Text className="text-gray-400 text-xs">{date.toLocaleString()}</Text>;
    },
  }),
  columnHelper.accessor('duration_seconds', {
    header: 'Duración',
    cell: info => {
      const secs = info.getValue();
      if (!secs) return <Text className="text-yellow-500 text-xs">Activa</Text>;
      const mins = Math.floor(secs / 60);
      return <Text className="text-gray-300 text-xs">{mins}m {secs % 60}s</Text>;
    },
  }),
];

export default function AdminTraffic() {
  const [data, setData] = useState<AnalyticsSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTraffic();
  }, []);

  const fetchTraffic = async () => {
    setLoading(true);
    const traffic = await analyticsService.getRecentTraffic(50);
    if (traffic && traffic.length > 0) {
      setData(traffic);
    } else {
      // Mock Data
      setData([
        { id: '1', ip_address: '192.168.1.1', country: 'Colombia', city: 'Bogota', device_type: 'web', session_start: new Date().toISOString(), duration_seconds: 120 },
        { id: '2', ip_address: '190.24.55.12', country: 'Mexico', city: 'CDMX', device_type: 'mobile_ios', session_start: new Date(Date.now() - 3600000).toISOString(), duration_seconds: null },
        { id: '3', ip_address: '185.14.22.1', country: 'Spain', city: 'Madrid', device_type: 'mobile_android', session_start: new Date(Date.now() - 7200000).toISOString(), duration_seconds: 450 },
        { id: '4', ip_address: '185.14.22.1', country: 'Argentina', city: 'Buenos Aires', device_type: 'web', session_start: new Date(Date.now() - 8200000).toISOString(), duration_seconds: 15 },
      ]);
    }
    setLoading(false);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AdminWrapper title="Tráfico y Sesiones">
      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <View className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-lg">
          {Platform.OS === 'web' ? (
            // Vista de Tabla para Web/Desktop
            <ScrollView horizontal>
              <View className="min-w-full">
                {/* Header */}
                <View className="flex-row bg-gray-900 border-b border-gray-700">
                  {table.getHeaderGroups().map(headerGroup => (
                    <React.Fragment key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <View key={header.id} className="flex-1 p-4 justify-center min-w-[150px]">
                          <Text className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                            {typeof header.column.columnDef.header === 'string' 
                              ? header.column.columnDef.header 
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </Text>
                        </View>
                      ))}
                    </React.Fragment>
                  ))}
                </View>
                {/* Body */}
                {table.getRowModel().rows.map(row => (
                  <View key={row.id} className="flex-row border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <View key={cell.id} className="flex-1 p-4 justify-center min-w-[150px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : (
            // Vista de Lista (Cards) para Móvil
            <View className="p-2">
              {data.map((item, idx) => (
                <View key={item.id || idx} className="bg-gray-700/40 p-4 rounded-xl mb-3 border border-gray-700">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold">{item.ip_address}</Text>
                    <View className="bg-gray-800 px-2 py-1 rounded-md">
                      {item.device_type === 'web' ? <Monitor size={14} color="#3b82f6" /> : <Smartphone size={14} color="#10b981" />}
                    </View>
                  </View>
                  <Text className="text-gray-300 text-sm mb-1">{item.country} - {item.city}</Text>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-gray-500 text-xs">{new Date(item.session_start).toLocaleTimeString()}</Text>
                    <Text className="text-gray-400 text-xs font-semibold">
                      {item.duration_seconds ? `${Math.floor(item.duration_seconds / 60)}m` : <Text className="text-yellow-500">Activa</Text>}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </AdminWrapper>
  );
}
