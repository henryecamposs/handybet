import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Compass, Tv, Plus, LayoutList, LogOut, Bookmark, UserPlus } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import { HubLayout, Carrusel, SeccionLista, PostContainer, TabContainer } from '../../../components/layout/hub';
import ListItem from '../../../components/ui/ListItem';
import IconButton from '../../../components/ui/IconButton';
import EmptyState from '../../../components/ui/EmptyState';

export default function ChannelsScreen() {
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = useThemeColors();
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  // Simulamos canales del usuario (solo para demostración del UI)
  const myChannels = channels.slice(0, 1);

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

  const filteredDiscoverChannels = channels.slice(1).filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChannelItem = (channel: any) => {
    const isMember = myChannels.some((c: Channel) => c.id === channel.id);
    return (
      <ListItem
        key={channel.id}
        title={channel.name}
        subtitle="Empresa de Apuestas Aliada"
        subtitleVariant="muted"
        leftElement={
          <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-border">
            <Tv size={18} color={isMember ? colors.primary : colors.mutedForeground} />
          </View>
        }
        rightElement={
          isMember ? (
            <View className="flex-row gap-2 items-center">
              <IconButton
                icon={LayoutList}
                onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
                variant="default"
                rounded="full"
                hasBorder={true}
              />
              <IconButton
                icon={LogOut}
                onPress={() => { }}
                variant="destructive"
                rounded="full"
                hasBorder={true}
              />
            </View>
          ) : (
            <View className="flex-row gap-2 items-center">
              <IconButton
                icon={LayoutList}
                onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
                variant="ghost"
                rounded="full"
                hasBorder={true}
              />
              <IconButton
                icon={Bookmark}
                onPress={() => {}}
                variant="ghost"
                rounded="full"
                hasBorder={true}
              />
              <IconButton
                icon={UserPlus}
                onPress={() => {}}
                variant="primary"
                rounded="full"
                hasBorder={true}
              />
            </View>
          )
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

  const tabs = [
    {
      id: 'my-channels',
      label: ((isActive: boolean) => (
        <View className="flex-row items-center justify-center mt-2">
          <Text className={`font-black text-center text-xs uppercase tracking-wider ${isActive ? 'text-primary' : 'text-foreground'}`}>
            Mis Canales ({myChannels.length})
          </Text>
          <View className="-my-2 ml-1">
            <IconButton
              icon={Plus}
              onPress={() => router.push('/(tabs)/channels/create' as any)}
              variant={isActive ? 'primary' : 'ghost'}
              hasBorder={false}
              size="lg"
              rounded="full"
            />
          </View>
        </View>
      )),
      content: (
        <View className="mt-2">
          <SeccionLista
            items={myChannels}
            renderItem={renderChannelItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      ),
    },
    {
      id: 'discover',
      label: `Canales Sugeridos (${filteredDiscoverChannels.length})`,
      content: (
        <SeccionLista
          items={filteredDiscoverChannels}
          renderItem={renderChannelItem}
          layout="list"
          emptyState={emptyStateDiscover}
        />
      ),
    },
  ];

  return (
    <HubLayout
      title="Canales"
      subtitle="Directorio de empresas y consorcios."
      searchPlaceholder="Buscar canales oficiales..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showBack={true}
      isLoading={isLoading}
      tabContainer={<TabContainer tabs={tabs} />}
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

