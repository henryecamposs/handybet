import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Compass, Tv, Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import { HubLayout, Carrusel, SeccionLista, PostContainer, TabContainer } from '../../../components/layout/hub';

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

  const renderMyChannelCard = (channel: Channel) => (
    <TouchableOpacity
      key={channel.id}
      onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
      className="w-32 h-36 bg-card  border border-border items-center justify-center mr-4 hover:bg-background/80/80 transition-colors px-2"
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
      onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
      className="bg-background/80 border border-border p-4  flex-row justify-between items-center hover:bg-background/80/80 transition-colors"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center mr-4 border border-border">
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
      <View className="w-8 h-8 rounded-full bg-background/80 items-center justify-center border border-border ml-2">
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

  const tabs = [
    {
      id: 'my-channels',
      label: 'Mis Canales',
      content: (
        <View className="mt-2">
          {myChannels.length > 0 ? (
            <View className="flex-row flex-wrap gap-4">
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/channels/create' as any)}
                className="w-[48%] h-36 bg-muted  border border-dashed border-border items-center justify-center hover:bg-background/80/80 transition-colors"
              >
                <View className="w-12 h-12 rounded-full bg-card items-center justify-center mb-2">
                  <Plus size={24} color={colors.secondary} />
                </View>
                <Text className="text-foreground font-bold text-sm text-center">Crear Nuevo</Text>
              </TouchableOpacity>
              {myChannels.map((channel) => (
                <TouchableOpacity
                  key={channel.id}
                  onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
                  className="w-[48%] h-36 bg-card  border border-border items-center justify-center hover:bg-background/80/80 transition-colors px-2"
                >
                  <View className="w-12 h-12 rounded-full bg-background/80 items-center justify-center mb-2">
                    <Tv size={20} color={colors.mutedForeground} />
                  </View>
                  <Text className="text-foreground font-bold text-center text-sm px-1" numberOfLines={2}>
                    {channel.name}
                  </Text>
                  <Text className="text-secondary text-[10px] mt-1 font-bold">Oficial</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="flex-1">
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/channels/create' as any)}
                className="w-full bg-primary p-4  items-center justify-center mb-6"
              >
                <Text className="text-black font-black text-xs uppercase">Crear Nuevo Canal</Text>
              </TouchableOpacity>
              {emptyState}
            </View>
          )}
        </View>
      ),
    },
    {
      id: 'discover',
      label: 'Canales Sugeridos',
      content: (
        <SeccionLista
          items={filteredDiscoverChannels}
          renderItem={renderDiscoverChannelCard}
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

