import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabaseClient';
import { Channel, Group } from '../../../types/handyBet';

export default function CanalDetailScreen() {
  const { canalId } = useLocalSearchParams();
  const router = useRouter();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (canalId) {
      fetchCanalDetails();
    }
  }, [canalId]);

  const fetchCanalDetails = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch Canal Info
      const { data: channelData, error: channelError } = await supabase
        .from('channels')
        .select('*')
        .eq('id', canalId)
        .single();

      if (channelError) throw channelError;
      setChannel(channelData as Channel);

      // 2. Fetch Groups of Canal
      const { data: groupsData, error: groupsError } = await supabase
        .from('groups')
        .select('*')
        .eq('channel_id', canalId);

      if (groupsError) throw groupsError;
      setGroups(groupsData || []);
    } catch (err) {
      console.log('Error fetching channel details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'apuestas': return '🎲';
      case 'pronosticos': return '📈';
      case 'publicidad': return '📢';
      case 'compartir_media': return '🔒';
      default: return '⚡';
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header back */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <Text className="text-foreground font-bold text-sm">◀ Volver a Canales</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : !channel ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-rose-500 font-black text-center">Empresa no encontrada.</Text>
        </View>
      ) : (
        <View>
          {/* Nombre Canal */}
          <View className="mb-8">
            <Text className="text-[10px] font-black text-primary uppercase tracking-widest">Consorcio de Loterías</Text>
            <Text className="text-3xl font-black text-foreground tracking-tight mt-1">{channel.name}</Text>
          </View>

          {/* Subgrupos */}
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Salas y Subgrupos</Text>
          {groups.length === 0 ? (
            <View className="bg-background border border-zinc-800 p-6 rounded-3xl items-center border-dashed">
              <Text className="text-foreground font-bold text-sm text-center">
                Esta empresa no cuenta con grupos habilitados aún.
              </Text>
            </View>
          ) : (
            <View className="space-y-4">
              {groups.map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => router.push(`/chat/group/${group.id}` as any)}
                  className="bg-background border border-zinc-800 p-5 rounded-3xl flex-row items-center gap-4 hover:bg-background/80/80 transition-colors"
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
              ))}
            </View>
          )}
        </View>
      )}
      <View className="h-16" />
    </ScrollView>
  );
}
