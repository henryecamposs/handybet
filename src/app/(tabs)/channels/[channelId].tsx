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
import { MessageCircle, Bookmark, LayoutList, Users, Info, MoreHorizontal, Megaphone, ArrowLeft } from 'lucide-react-native';
import { useToastStore } from '@/store/useToastStore';
import HubDetailsUtilities from '@/components/layout/hub/HubDetailsUtilities';
import HubCover from '@/components/layout/hub/HubCover';
import { TabContainer, SeccionLista } from '@/components/layout/hub';
import { useHubUtilities } from '@/hooks/useHubUtilities';
import PostContainer from '@/components/layout/hub/PostContainer';
import EmptyState from '@/components/ui/EmptyState';

export default function ChannelDetailScreen() {
  const { channelId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const { handleBack, handleSaveToggle } = useHubUtilities();
  const [isSaved, setIsSaved] = useState(false);
  const { mockSession } = useHandyBetStore();

  const [channel, setChannel] = useState<Channel | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [channelPosts, setChannelPosts] = useState<any[]>([]);
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

      const allPosts = await localDB.posts.getAll();
      const filteredPosts = allPosts.filter((p: any) => p.channel_id === channelId);
      filteredPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const resolvedPosts = await Promise.all(filteredPosts.map(p => localDB.resolvePostWithAuthor(p)));
      setChannelPosts(resolvedPosts);
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

  const handleSaveChannel = (channelName: string) => {
    addToast({
      title: 'Canal guardado',
      description: `${channelName} se ha agregado a tus favoritos.`,
      variant: 'success'
    });
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
            onPress={() => router.push(`/feed/search?id=${group.id}` as any)}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={MessageCircle}
            onPress={() => router.push(`/chat/${group.id}` as any)}
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
      className="mb-2 bg-card/60 border border-white/10 rounded-xl p-1"
    />
  );

  const isAdmin = channel && mockSession && (channel.owner_id === mockSession.id || mockSession.role === 'admin');

  const heroBanner = channel && (
    <View className="mb-6">
      {/* Cover Portada */}
      <HubCover 
        variant="primary" 
        containerClasses="bg-gradient-to-t from-background/80 to-white bg-background/80" 
      />

      {/* Avatar y Utilidades */}
      <HubDetailsUtilities
        avatarNode={
          <View className="p-1 bg-background rounded-full border border-border-muted">
            <View className="w-28 h-28 rounded-full bg-background/80 items-center justify-center border border-border">
              <Megaphone size={48} color={colors.primary} />
            </View>
          </View>
        }
        title={channel.name}
        subtitle="Canal Oficial"
        stats={[{ value: groups.length, label: 'Salas / Grupos' }]}
        onBack={() => handleBack('/(tabs)/canales')}
        colors={colors}
      >
        <IconButton
          icon={Bookmark}
          onPress={() => handleSaveToggle(isSaved, 'channel', channel.name, setIsSaved)}
          variant={isSaved ? "primary" : "ghost"}
          rounded="full"
          hasBorder={true}
        />
      </HubDetailsUtilities>


      {/* Datos del Canal */}
      <View className="px-4">
        <Text className="text-foreground mt-2 leading-5 text-sm">Empresa de apuestas aliada. Accede a nuestras salas y subgrupos oficiales.</Text>
      </View>
    </View>
  );

  const tabs = [
    {
      id: 'todos',
      label: 'TODOS',
      content: (
        <View className="flex-col lg:flex-row gap-6 mt-4">
          {/* Columna Izquierda: Información y Salas del Canal */}
          <View className="w-full lg:w-1/3 gap-4">
            <View className="bg-card border border-border rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Info size={18} color={colors.primary} />
                <Text className="text-foreground font-bold text-base">Descripción</Text>
              </View>
              <Text className="text-foreground/80 text-sm leading-5">
                {channel?.description || 'Empresa de apuestas aliada. Accede a nuestras salas y subgrupos oficiales.'}
              </Text>
            </View>

            <View className="bg-card border border-border rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-3">
                <Megaphone size={18} color={colors.primary} />
                <Text className="text-foreground font-bold text-base">Detalles del Canal</Text>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between py-1.5 border-b border-border/50">
                  <Text className="text-foreground/70 text-xs">Salas Habilitadas</Text>
                  <Text className="text-primary font-bold text-xs">{groups.length} Grupos</Text>
                </View>
                <View className="flex-row justify-between py-1.5 border-b border-border/50">
                  <Text className="text-foreground/70 text-xs">Tipo de Entidad</Text>
                  <Text className="text-foreground font-medium text-xs">Canal Oficial</Text>
                </View>
                <View className="flex-row justify-between py-1.5">
                  <Text className="text-foreground/70 text-xs">Verificación</Text>
                  <Text className="text-emerald-400 font-bold text-xs">✓ Empresa Aliada</Text>
                </View>
              </View>
            </View>

            <View className="bg-card border border-border rounded-xl p-4">
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center gap-2">
                  <Users size={18} color={colors.primary} />
                  <Text className="text-foreground font-bold text-base">Salas Destacadas ({groups.length})</Text>
                </View>
              </View>
              {groups.slice(0, 3).map((group) => (
                <TouchableOpacity
                  key={group.id}
                  onPress={() => router.push(`/channels/groups?id=${group.id}&from=channel` as any)}
                  className="flex-row items-center justify-between py-2 border-b border-border/40 last:border-0"
                >
                  <Text className="text-foreground text-xs font-semibold" numberOfLines={1}>{group.name}</Text>
                  <Text className="text-primary text-[10px] uppercase font-bold">Ver Sala ›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Columna Derecha: Widget de Creación y Muro de Publicaciones */}
          <View className="w-full lg:w-2/3">
            {isAdmin && (
              <View className="mb-4">
                <CreatePostWidget
                  onPublish={handlePublishPost}
                  forcedTarget={{
                    id: channel?.id || '',
                    name: channel?.name || '',
                    type: 'channel'
                  }}
                />
              </View>
            )}
            {channelPosts.length > 0 ? (
              <PostContainer
                title="Publicaciones Recientes"
                posts={channelPosts}
              />
            ) : (
              <EmptyState title="No hay publicaciones en este canal." icon={LayoutList} variant="dashed" />
            )}
          </View>
        </View>
      )
    },
    {
      id: 'groups',
      label: 'Grupos / Salas',
      content: (
        <View className="mt-4">
          {groups.length === 0 ? (
            <EmptyState title="Esta empresa no cuenta con grupos habilitados aún." icon={Users} variant="dashed" />
          ) : (
            <View className="gap-2">
              {groups.map((group) => renderGroupItem(group))}
            </View>
          )}
        </View>
      )
    },
    {
      id: 'info',
      label: 'Información',
      content: (
        <View className="mt-4 p-4 bg-background/40 border border-border rounded-xl">
          <Text className="text-white font-black text-sm uppercase tracking-wider mb-2">Acerca del Canal Oficial</Text>
          <Text className="text-zinc-400 text-xs leading-5">
            Canal verificado de la red HandyBet. Todas las salas y subgrupos vinculados a este canal cuentan con soporte directo del administrador.
          </Text>
        </View>
      )
    }
  ];

  return (
    <HubDetailLayout
      hideHeader={true}
      backRoute="/(tabs)/channels"
      logoType="channels"
      isLoading={isLoading}
      notFoundLabel="Empresa no encontrada."
    >
      {heroBanner}
      {channel && (
        <View className="px-4">
          <TabContainer tabs={tabs} defaultTabId="todos" />
        </View>
      )}
    </HubDetailLayout>
  );
}
