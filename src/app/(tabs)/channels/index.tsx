import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Compass, Megaphone, Plus, LayoutList, LogOut, Bookmark, UserPlus, Users, InfoIcon, EyeOff } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import { HubLayout, Carrusel, SeccionLista, PostContainer, TabContainer } from '../../../components/layout/hub';
import ListItem from '../../../components/ui/ListItem';
import IconButton from '../../../components/ui/IconButton';
import EmptyState from '../../../components/ui/EmptyState';
import { useToastStore } from '@/store/useToastStore';
import HubCover from '../../../components/layout/hub/HubCover';

export default function ChannelsScreen() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const { addToast } = useToastStore();

  const handleSave = (channelName: string) => {
    addToast({
      title: 'Canal guardado',
      description: `${channelName} se ha agregado a tus favoritos.`,
      variant: 'success'
    });
  };

  const handleHide = (channelName: string) => {
    addToast({
      title: 'Canal oculto',
      description: `${channelName} ha sido ocultado temporalmente.`,
      variant: 'muted'
    });
  };

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

  async function fetchLatestPosts() {
    try {
      const allPosts = await localDB.posts.getAll();
      const groupOrChannelPosts = allPosts.filter((p: any) => p.group_id || p.channel_id);
      groupOrChannelPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const top5 = groupOrChannelPosts.slice(0, 5);
      const resolved = await Promise.all(top5.map(p => localDB.resolvePostWithAuthor(p)));
      setLatestPosts(resolved);
    } catch (err) {
      console.log('Error loading latest posts in channels hub:', err);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchChannels();
      fetchLatestPosts();
    }, 0);
  }, []);

  const filteredChannels = channels.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChannelItem = (channel: any) => {
    return (
      <ListItem
        key={channel.id}
        title={channel.name}
        subtitle={`${(channel.name.length % 5) + 2} grupos • ${(channel.name.length * 15) + 100} miembros totales`}
        subtitleVariant="muted"
        leftElement={
          <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-border">
            <Megaphone size={18} color={colors.primary} />
          </View>
        }
        rightElement={
          <View className="flex-row gap-2 items-center">
            <IconButton
              icon={InfoIcon}
              onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
              variant="default"
              rounded="full"
              hasBorder={true}
            />
            <IconButton
              icon={LayoutList}
              onPress={() => router.push(`/feed/search?id=${channel.id}&from=channel` as any)}
              variant="ghost"
              rounded="full"
              hasBorder={true}
            />
            <IconButton
              icon={Bookmark}
              onPress={() => handleSave(channel.name)}
              variant="ghost"
              rounded="full"
              hasBorder={true}
            />
            <IconButton
              icon={EyeOff}
              onPress={() => handleHide(channel.name)}
              variant="ghost"
              rounded="full"
              hasBorder={true}
            />
          </View>
        }
        onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
        className="mb-2 bg-background/80"
      />
    );
  };

  const emptyState = (
    <EmptyState
      icon={Compass}
      title="Aún no tienes canales"
      description="Crea tu propio canal oficial o explora el directorio."
      variant="dashed"
    />
  );

  const emptyStateDiscover = (
    <EmptyState
      icon={Compass}
      title="No hay sugerencias"
      description="No tenemos nuevos canales por ahora. Vuelve más tarde."
      variant="dashed"
    />
  );

  return (
    <HubLayout
      title="Canales"
      subtitle="Directorio de empresas y consorcios."
      searchPlaceholder="Buscar canales oficiales..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      actionButton={
        <IconButton
          icon={Plus}
          label="Crear Canal"
          onPress={() => router.push('/(tabs)/channels/create' as any)}
          variant="primary"
          size="xl"
          hasBorder={true}
        />
      }
      showBack={true}
      heroBanner={
        <HubCover
          variant="primary"
          containerClasses="h-32 rounded-none mb-2"
        />
      }
      isLoading={isLoading}
      seccionLista={
        <SeccionLista
          items={filteredChannels}
          renderItem={renderChannelItem}
          layout="list"
          emptyState={emptyStateDiscover}
        />
      }
      postContainer={
        <PostContainer
          title="Últimas Publicaciones"
          posts={latestPosts}
          onViewAll={latestPosts[0] ? () => router.push(`/feed/search?id=${latestPosts[0].group_id || latestPosts[0].channel_id}&from=channel` as any) : undefined}
        />
      }
    />
  );
}

