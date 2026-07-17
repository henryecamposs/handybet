import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Users, Info, Shield, Bell, LogOut, ChevronRight } from 'lucide-react-native';
import { handyBetGroups } from '../../../../../mockdata/handyBetMock';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function GroupInfoScreen() {
  const { groupId } = useLocalSearchParams();

  const group = handyBetGroups.find((g: any) => g.id === groupId) || handyBetGroups[0];

  return (
    <HubDetailLayout
      backRoute="/(tabs)/grupos"
      logoType="chat"
      categoryText={`Sala de ${group.type}`}
      title={group.name}
    >
      {/* Info Principal */}
      <View className="items-center mb-8">
        <View className="w-24 h-24  bg-background/80 items-center justify-center mb-4 border border-border shadow-xl relative">
          <Text className="text-4xl">🎲</Text>
          <View className="absolute -bottom-2 -right-2 bg-primary w-8 h-8 rounded-full border-4 border-zinc-950 items-center justify-center">
            <Shield size={12} color="#000" />
          </View>
        </View>
        <Text className="text-foreground text-sm text-center px-4">Esta es la comunidad oficial para las apuestas VIP. Juega responsablemente.</Text>
      </View>

      {/* Estadísticas / Propiedades */}
      <View className="flex-row gap-4 mb-8">
        <View className="flex-1 bg-background/80 p-4  border border-zinc-800 items-center">
          <Users size={20} color="#caee26" className="mb-1" />
          <Text className="text-foreground font-bold text-lg">{group.members.length}</Text>
          <Text className="text-foreground text-[10px] uppercase">Miembros</Text>
        </View>
        <View className="flex-1 bg-background/80 p-4  border border-zinc-800 items-center">
          <Info size={20} color="#caee26" className="mb-1" />
          <Text className="text-foreground font-bold text-lg">{group.id.slice(0, 6).toUpperCase()}</Text>
          <Text className="text-foreground text-[10px] uppercase">Código</Text>
        </View>
      </View>

      {/* Configuraciones de Usuario */}
      <View className="bg-background/80  border border-zinc-800 overflow-hidden mb-8">
        <TouchableOpacity className="p-4 border-b border-zinc-800/50 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center mr-3">
              <Bell size={18} color="#d4d4d8" />
            </View>
            <Text className="text-foreground font-medium">Notificaciones</Text>
          </View>
          <Text className="text-primary font-bold text-xs">Activadas</Text>
        </TouchableOpacity>

        <TouchableOpacity className="p-4 border-b border-zinc-800/50 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center mr-3">
              <Users size={18} color="#d4d4d8" />
            </View>
            <Text className="text-foreground font-medium">Ver Miembros</Text>
          </View>
          <ChevronRight size={20} color="#71717a" />
        </TouchableOpacity>

        <TouchableOpacity className="p-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center mr-3">
              <Shield size={18} color="#d4d4d8" />
            </View>
            <View>
              <Text className="text-foreground font-medium">Reglas del Grupo</Text>
              <Text className="text-foreground text-[10px]">Lee antes de apostar</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Acciones Peligrosas */}
      <TouchableOpacity className="bg-rose-500/10 border border-rose-500/30 p-4  flex-row items-center justify-center mb-16">
        <LogOut size={18} color="#ef4444" className="mr-2" />
        <Text className="text-rose-500 font-bold">Salir del Grupo</Text>
      </TouchableOpacity>
    </HubDetailLayout>
  );
}
