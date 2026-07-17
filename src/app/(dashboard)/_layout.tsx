import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { useHandyBetStore } from '../../store/useHandyBetStore';

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { setMockSession } = useHandyBetStore();

  const handleLogout = async () => {
    setMockSession(null);
  };

  return (
    <View className="flex-1 flex-row bg-background">
      {/* Sidebar para Taquilla / Escritorio */}
      <View className="w-64 border-r border-border bg-background/40 p-6 justify-between hidden md:flex">
        <View>
          <Text className="text-xl font-black text-white tracking-widest mb-8">
            HANDYBET TAQUILLA
          </Text>

          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/taquilla')}
              className={`px-4 py-3.5 rounded-xs ${pathname.includes('/taquilla') ? 'bg-secondary/10 border border-secondary/20' : 'bg-transparent'
                }`}
            >
              <Text className={`font-black text-xs uppercase ${pathname.includes('/taquilla') ? 'text-secondary' : 'text-foreground'}`}>
                🎟 Procesar Ticket
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/(dashboard)/monetizacion-ads')}
              className={`px-4 py-3.5 rounded-xs ${pathname.includes('/monetizacion-ads') ? 'bg-secondary/10 border border-secondary/20' : 'bg-transparent'
                }`}
            >
              <Text className={`font-black text-xs uppercase ${pathname.includes('/monetizacion-ads') ? 'text-secondary' : 'text-foreground'}`}>
                📢 Configuración Ads
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-background/80 border border-border p-4 rounded-xs items-center"
        >
          <Text className="text-rose-500 text-xs font-black uppercase">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <View className="flex-1">
        <Slot />
      </View>
    </View>
  );
}
