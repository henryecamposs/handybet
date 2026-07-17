import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { channelService } from '../../../services/channelService';
import { Channel } from '../../../types/handyBet';
import { Compass, Tv } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';
import { localDB } from '../../../lib/localDB';

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
      onPress={() => router.push(`/(tabs)/channels/${channel.id}` as any)}
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
      myItems={myChannels}
      renderMyItem={renderMyChannelCard}
      onAddNewItem={() => router.push('/(tabs)/channels/create' as any)}
      addNewItemLabel="Crear Nuevo"
      discoverTitle="Directorio de Canales"
      discoverItems={filteredDiscoverChannels}
      renderDiscoverItem={renderDiscoverChannelCard}
      isLoading={isLoading}
      emptyState={emptyState}
      showBack={true}
    >
      {/* Sección de Últimas Publicaciones de Grupos/Canales */}
      {latestPosts.length > 0 && (
        <View className="mb-8 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-foreground font-black text-lg uppercase tracking-wider">Últimas Publicaciones</Text>
            {latestPosts[0] && (
              <TouchableOpacity
                onPress={() => router.push(`/feed/search?id=${latestPosts[0].group_id || latestPosts[0].channel_id}` as any)}
              >
                <Text className="text-primary text-[10px] font-black uppercase">Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="space-y-4">
            {latestPosts.map((post) => {
              const authorName = post.channel?.name || post.group?.name || post.author?.full_name || 'Comunidad';
              const targetId = post.group_id || post.channel_id;
              return (
                <View key={post.id} className="bg-primary/5 border border-primary/10 p-4 rounded-3xl mb-4">
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center gap-2">
                      <View className="bg-background/85 w-8 h-8 rounded-full items-center justify-center border border-zinc-800">
                        <Text className="text-sm">{post.channel_id ? '📢' : '👥'}</Text>
                      </View>
                      <View>
                        <Text className="text-white font-black text-xs leading-tight">{authorName}</Text>
                        <Text className="text-zinc-500 text-[9px] font-bold uppercase">{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Novedad'}</Text>
                      </View>
                    </View>
                    {targetId && (
                      <TouchableOpacity
                        onPress={() => router.push(`/feed/search?id=${targetId}` as any)}
                        className="bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full"
                      >
                        <Text className="text-white text-[9px] font-bold">Ver Sala</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className="text-foreground text-xs leading-relaxed" numberOfLines={3}>{post.content}</Text>
                  
                  <TouchableOpacity
                    onPress={() => router.push(`/feed/${post.id}` as any)}
                    className="mt-3 flex-row items-center gap-1 self-start"
                  >
                    <Text className="text-primary text-[10px] font-black uppercase">Detalles & Comentarios →</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </HubLayout>
  );
}

