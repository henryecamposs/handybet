import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Compass, Tv } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';

export default function CanalesScreen() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();

  // Simulamos canales del usuario (solo para demostración del UI)
  const misCanales = channels.slice(0, 1);

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
    fetchChannels();
  }, []);

  const filteredDiscoverChannels = channels.slice(1).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMyChannelCard = (channel: Channel) => (
    <TouchableOpacity
      key={channel.id}
      onPress={() => router.push(`/(tabs)/canales/${channel.id}` as any)}
      className="w-32 h-36 bg-card rounded-2xl border border-primary/20 items-center justify-center mr-4 hover:bg-background/80/80 transition-colors px-2"
    >
      <View className="w-12 h-12 rounded-full bg-background/80 items-center justify-center mb-2">
        <Tv size={20} color={colors.mutedForeground} />
      </View>
      <Text className="text-foreground font-bold text-center text-sm px-1" numberOfLines={2}>
        {channel.name}
      </Text>
      <Text className="text-secondary text-[10px] mt-1 font-bold">Oficial</Text>
    </TouchableOpacity>
  );

  const renderDiscoverChannelCard = (channel: Channel) => (
    <TouchableOpacity
      key={channel.id}
      onPress={() => router.push(`/(tabs)/canales/${channel.id}` as any)}
      className="bg-background/80 border border-muted-foreground p-4 rounded-2xl flex-row justify-between items-center hover:bg-background/80/80 transition-colors"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center mr-4 border border-muted-foreground">
          <Tv size={20} color={colors.foreground} />
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-base" numberOfLines={1}>
            {channel.name}
          </Text>
          <Text className="text-foreground text-xs mt-1" numberOfLines={1}>
            Empresa de Apuestas Aliada
          </Text>
        </View>
      </View>
      <View className="w-8 h-8 rounded-full bg-background/80 items-center justify-center border border-zinc-700 ml-2">
        <Text className="text-foreground font-bold text-xs">▶</Text>
      </View>
    </TouchableOpacity>
  );

  const emptyState = (
    <View className="flex-1 items-center justify-center py-20 mt-4">
      <Compass size={48} color="#52525b" className="mb-4" />
      <Text className="text-foreground font-bold text-lg text-center">Aún no has creado canales</Text>
      <Text className="text-foreground text-sm text-center mt-2 max-w-[250px]">
        Crea tu propio canal oficial para organizar a tus usuarios y ofrecer servicios de apuestas.
      </Text>
    </View>
  );

  return (
    <HubLayout
      title="Canales"
      subtitle="Directorio de empresas y consorcios."
      searchPlaceholder="Buscar canales oficiales..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      myItemsTitle="Mis Canales"
      myItems={misCanales}
      renderMyItem={renderMyChannelCard}
      onAddNewItem={() => router.push('/(tabs)/canales/create' as any)}
      addNewItemLabel="Crear Nuevo"
      discoverTitle="Directorio de Canales"
      discoverItems={filteredDiscoverChannels}
      renderDiscoverItem={renderDiscoverChannelCard}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}

