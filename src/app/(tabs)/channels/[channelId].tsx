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
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import { MessageCircle, Bookmark, LayoutList, Tv } from 'lucide-react-native';
import { useToastStore } from '@/store/useToastStore';

export default function ChannelDetailScreen() {
  const { channelId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const { mockSession } = useHandyBetStore();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToastStore();

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

  const handleSaveGroup = (groupName: string) => {
    addToast({
      title: 'Grupo guardado',
      description: `${groupName} se ha agregado a tus favoritos.`,
      variant: 'success'
    });
  };

  const handleFollowGroup = (groupName: string, isFollowing: boolean) => {
    addToast({
      title: isFollowing ? 'Dejaste de seguir' : 'Siguiendo grupo',
      description: isFollowing ? `Ya no sigues a ${groupName}` : `Ahora sigues a ${groupName}`,
      variant: isFollowing ? 'muted' : 'success'
    });
  };

  const renderGroupItem = (group: Group) => (
    <ListItem
      key={group.id}
      title={group.name}
      subtitle={`Código: ${group.short_code} • Sala de ${group.type}`}
      subtitleVariant="secondary"
      leftElement={
        <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-border">
          <Text className="text-lg">{getIconForType(group.type)}</Text>
        </View>
      }
      rightElement={
        <View className="flex-row gap-2 items-center">
          <IconButton
            icon={LayoutList}
            onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={MessageCircle}
            onPress={() => router.push(`/chat/${group.id}?fromType=group` as any)}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={Bookmark}
            onPress={() => handleSaveGroup(group.name)}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            label="Seguir"
            onPress={() => handleFollowGroup(group.name, false)}
            variant="primary"
            rounded="full"
            hasBorder={true}
          />
        </View>
      }
      onPress={() => router.push(`/channels/groups?id=${group.id}&from=channel` as any)}
      className="mb-2 bg-background/80"
    />
  );

  const isAdmin = channel && mockSession && channel.owner_id === mockSession.id;

  return (
    <HubDetailLayout
      backRoute="/(tabs)/channels"
      logoType="channels"
      isLoading={isLoading}
      notFoundLabel="Empresa no encontrada."
    >
      {channel && (
        <View className="mt-4 gap-6">
          {/* Hero Banner del Canal */}
          <View className="border border-border rounded-xl overflow-hidden bg-background/40">
            {/* Portada Cover */}
            <View className="h-28 bg-gradient-to-r from-primary/10 to-secondary/10 relative">
              <View className="absolute top-2 right-2 bg-background/85 px-2 py-1 rounded-full border border-border">
                <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
                  Consorcio de Loterías
                </Text>
              </View>
            </View>
            
            {/* Info del Canal */}
            <View className="p-4 flex-row items-center gap-4 border-t border-border/50">
              <View className="w-16 h-16 rounded-full bg-background/80 border border-border items-center justify-center -mt-10 shadow-sm">
                <Tv size={28} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-2xl font-black text-foreground tracking-tight">{channel.name}</Text>
                <Text className="text-xs text-muted-foreground mt-0.5">Canal de Apuestas Oficial</Text>
              </View>
            </View>
          </View>

          {/* Listado de Salas y Subgrupos */}
          <View>
            <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
              Salas y Subgrupos
            </Text>
            {groups.length === 0 ? (
              <View className="bg-background/80 border border-border p-6 items-center border-dashed rounded-xl">
                <Text className="text-foreground font-bold text-sm text-center">
                  Esta empresa no cuenta con grupos habilitados aún.
                </Text>
              </View>
            ) : (
              <View className="gap-2">
                {groups.map((group) => renderGroupItem(group))}
              </View>
            )}
          </View>

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
