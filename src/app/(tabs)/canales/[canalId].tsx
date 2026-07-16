import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { localDB } from '../../../lib/localDB';
import { Channel, Group } from '../../../types/handyBet';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function CanalDetailScreen() {
  const { canalId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchCanalDetails() {
    try {
      setIsLoading(true);
      const channelData = await localDB.channels.getById(canalId as string);
      setChannel(channelData as Channel);

      const allGroups = await localDB.groups.getAll();
      const groupsData = allGroups.filter((g: any) => g.channel_id === canalId);
      setGroups(groupsData || []);
    } catch (err) {
      console.log('Error fetching channel details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (canalId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCanalDetails();
    }
  }, [canalId]);

  const getIconForType = (type: string) => {
    switch (type) {
      case 'apuestas': return '🎲';
      case 'pronosticos': return '📈';
      case 'publicidad': return '📢';
      case 'compartir_media': return '🔒';
      default: return '⚡';
    }
  };

  const renderGroupItem = (group: Group) => (
    <TouchableOpacity
      key={group.id}
      onPress={() => router.push(`/chat/group/${group.id}` as any)}
      className="bg-background/80 border border-zinc-800 p-5 rounded-3xl flex-row items-center gap-4 hover:bg-background/80/80 transition-colors"
    >
      <View className="bg-background/80 w-12 h-12 rounded-xl items-center justify-center border border-zinc-700">
        <Text className="text-xl">{getIconForType(group.type)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-bold text-base">{group.name}</Text>
        <Text className="text-foreground text-[10px] font-bold uppercase tracking-wider mt-1">
          Código: <Text className="font-mono text-primary">{group.short_code}</Text> • Sala de {group.type}
        </Text>
      </View>
      <View className="w-8 h-8 rounded-full bg-background/80 items-center justify-center border border-zinc-700">
        <Text className="text-foreground font-bold text-xs">▶</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <HubDetailLayout
      backLabel="Volver a Canales"
      fallbackRoute="/(tabs)/canales"
      categoryText="Consorcio de Loterías"
      title={channel?.name || ''}
      listTitle="Salas y Subgrupos"
      items={groups}
      renderItem={renderGroupItem}
      isLoading={isLoading}
      emptyLabel="Esta empresa no cuenta con grupos habilitados aún."
      notFoundLabel="Empresa no encontrada."
    />
  );
}
