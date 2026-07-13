import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Search, Plus, Compass, Tv } from 'lucide-react-native';

export default function CanalesScreen() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulamos canales del usuario (solo para demostración del UI)
  const misCanales = channels.slice(0, 1); // Prueba cambiando a [] para ver empty state



  async function fetchChannels() {
    try {
      const data = await channelService.getChannels();
      setChannels(data || []);
    } catch (err) {
      console.log('Error fetching channels:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchChannels();
  }, []);

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-foreground font-bold text-2xl">Canales</Text>
          <Text className="text-foreground text-sm mt-1">Directorio de empresas y consorcios.</Text>
        </View>
      </View>

      {/* Buscador */}
      <View className="bg-background rounded-full flex-row items-center px-4 py-2 border border-zinc-800 mb-6">
        <Search size={20} color="#71717a" />
        <TextInput
          placeholder="Buscar canales oficiales..."
          placeholderTextColor="#71717a"
          className="flex-1 text-foreground ml-3 outline-none"
        />
      </View>

      {/* Carrusel de Mis Canales */}
      <View className="mb-8">
        <Text className="text-foreground font-bold text-lg mb-4">Mis Canales</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {/* Botón de Crear Nuevo Canal */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/canales/create' as any)}
            className="w-32 h-36 bg-background rounded-2xl border border-dashed border-zinc-700 items-center justify-center mr-4 hover:bg-background/80/80 transition-colors"
          >
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-2">
              <Plus size={24} color="#caee26" />
            </View>
            <Text className="text-foreground font-bold text-sm text-center">Crear Nuevo</Text>
          </TouchableOpacity>

          {misCanales.map((channel) => (
            <TouchableOpacity
              key={channel.id}
              onPress={() => router.push(`/(tabs)/canales/${channel.id}` as any)}
              className="w-32 h-36 bg-background rounded-2xl border border-zinc-800 items-center justify-center mr-4 hover:bg-background/80/80 transition-colors px-2"
            >
              <View className="w-12 h-12 rounded-full bg-background/80 items-center justify-center mb-2">
                <Tv size={20} color="#d4d4d8" />
              </View>
              <Text className="text-foreground font-bold text-center text-sm px-1" numberOfLines={2}>{channel.name}</Text>
              <Text className="text-secondary text-[10px] mt-1 font-bold">Oficial</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Estado Cargando */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#caee26" />
        </View>
      ) : misCanales.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 mt-4">
          <Compass size={48} color="#52525b" className="mb-4" />
          <Text className="text-foreground font-bold text-lg text-center">Aún no has creado canales</Text>
          <Text className="text-foreground text-sm text-center mt-2 max-w-[250px]">Crea tu propio canal oficial para organizar a tus usuarios y ofrecer servicios de apuestas.</Text>
        </View>
      ) : (
        <View className="mb-8 mt-4">
          <Text className="text-foreground font-bold text-lg mb-4">Directorio de Canales</Text>
          <View className="space-y-3">
            {channels.slice(1).map((channel) => (
              <TouchableOpacity
                key={channel.id}
                onPress={() => router.push(`/(tabs)/canales/${channel.id}` as any)}
                className="bg-background border border-zinc-800 p-4 rounded-2xl flex-row justify-between items-center hover:bg-background/80/80 transition-colors"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center mr-4 border border-zinc-700">
                    <Tv size={20} color="#d4d4d8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-base" numberOfLines={1}>{channel.name}</Text>
                    <Text className="text-foreground text-xs mt-1" numberOfLines={1}>Empresa de Apuestas Aliada</Text>
                  </View>
                </View>
                <View className="w-8 h-8 rounded-full bg-background/80 items-center justify-center border border-zinc-700 ml-2">
                  <Text className="text-foreground font-bold text-xs">▶</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      <View className="h-16" />
    </ScrollView>
  );
}
