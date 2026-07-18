import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { localDB } from '../../../lib/localDB';
import { Channel, Group, VisibilityLevel } from '../../../types/handyBet';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import CreatePostWidget from '@/components/feed/CreatePostWidget';
import { useHandyBetStore } from '../../../store/useHandyBetStore';
import { socialService } from '../../../services/socialService';

export default function ChannelDetailScreen() {
  const { channelId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const { mockSession } = useHandyBetStore();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchChannelDetails() {
    try {
      setIsLoading(true);
      const channelData = await localDB.channels.getById(channelId as string);
      setChannel(channelData as Channel);

      const allGroups = await localDB.groups.getAll();
      const groupsData = allGroups.filter((g: any) => g.channel_id === channelId);
      setGroups(groupsData || []);
    } catch (err) {
      console.log('Error fetching channel details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (channelId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchChannelDetails();
    }
  }, [channelId]);

  const handlePublishPost = async (
    content: string,
    type: 'regular' | 'advertisement',
    visibility: VisibilityLevel,
    feeling?: any,
    mediaUrls?: string[],
    targetGroupId?: string | null,
    targetChannelId?: string | null
  ): Promise<boolean> => {
    if (!content.trim() && (!mediaUrls || mediaUrls.length === 0)) return false;
    try {
      await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: null,
        channel_id: channelId as string,
        content: content,
        visibility_level: visibility,
        post_type: type,
        payment_status: 'none_required'
      });
      alert('¡Publicación creada exitosamente en el canal!');
      return true;
    } catch (e) {
      console.error(e);
      return false;
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

  const renderGroupItem = (group: Group) => (
    <TouchableOpacity
      key={group.id}
      onPress={() => router.push(`/chat/${group.id}?fromType=group` as any)}
      className="bg-background/80 border border-border p-5  flex-row items-center gap-4 hover:bg-background/80/80 transition-colors"
    >
      <View className="bg-background/80 w-12 h-12 rounded-xs items-center justify-center border border-border">
        <Text className="text-xl">{getIconForType(group.type)}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-foreground font-bold text-base">{group.name}</Text>
        <Text className="text-foreground text-[10px] font-bold uppercase tracking-wider mt-1">
          Código: <Text className="font-mono text-primary">{group.short_code}</Text> • Sala de {group.type}
        </Text>
      </View>
      <View className="w-8 h-8 rounded-full bg-background/80 items-center justify-center border border-border">
        <Text className="text-foreground font-bold text-xs">▶</Text>
      </View>
    </TouchableOpacity>
  );

  const isAdmin = channel && mockSession && channel.owner_id === mockSession.id;

  return (
    <HubDetailLayout
      backRoute="/(tabs)/channels"
      logoType="channels"
      categoryText="Consorcio de Loterías"
      title={channel?.name || ''}
      listTitle="Salas y Subgrupos"
      items={groups}
      renderItem={renderGroupItem}
      isLoading={isLoading}
      emptyLabel="Esta empresa no cuenta con grupos habilitados aún."
      notFoundLabel="Empresa no encontrada."
    >
      {channel && (
        <View className="mt-4 gap-4">
          <TouchableOpacity
            onPress={() => router.push(`/feed/search?id=${channel.id}&from=channel` as any)}
            className="bg-primary/20 border border-border p-4  items-center justify-center hover:bg-primary/30 transition-colors"
          >
            <Text className="text-primary font-black text-sm uppercase tracking-wider">Ver Feed / Publicaciones del Canal 📢</Text>
          </TouchableOpacity>

          {isAdmin && (
            <View className="mt-2 border-t border-border pt-6">
              <Text className="text-white font-black text-sm uppercase tracking-wider mb-4">Publicar en el Canal</Text>
              <CreatePostWidget
                onPublish={handlePublishPost}
                forcedTarget={{
                  id: channel.id,
                  name: channel.name,
                  type: 'channel'
                }}
              />
            </View>
          )}
        </View>
      )}
    </HubDetailLayout>
  );
}
