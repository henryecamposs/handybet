import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageCircle, UserMinus } from 'lucide-react-native';
import { handyBetUsers } from '../../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';
import PostItem from '../../../components/feed/PostItem';
import { localDB } from '../../../lib/localDB';

export default function FollowsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>(
    // Inicializar todos como seguidos por defecto para simular la lista de seguidos
    handyBetUsers.reduce((acc, user) => ({ ...acc, [user.id]: true }), {})
  );

  const toggleFollow = (userId: string) => {
    setFollowingStates(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredUsers = handyBetUsers.filter(user => {
    const isMatchingSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    // Solo mostrar si coincide con la búsqueda y está marcado como seguido
    return isMatchingSearch && followingStates[user.id];
  });

  // Solicitudes del viejo modelo se transforman en sugerencias recomendadas
  const suggestionsToFollow = handyBetUsers.slice(0, 3).map(u => ({
    ...u,
    mutualFollowers: (u.name.length * 3) % 12 + 2
  }));

  async function fetchLatestPosts() {
    try {
      const allPosts = await localDB.posts.getAll();
      const followPosts = allPosts.filter((p: any) => !p.group_id && !p.channel_id);
      followPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const top5 = followPosts.slice(0, 5);
      const resolved = await Promise.all(top5.map(p => localDB.resolvePostWithAuthor(p)));
      setLatestPosts(resolved);
    } catch (err) {
      console.log('Error loading latest posts in follows hub:', err);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchLatestPosts();
    }, 0);
  }, []);

  const renderSuggestCard = (user: typeof suggestionsToFollow[0]) => {
    const isFollowing = !!followingStates[user.id];
    return (
      <View 
        key={`sug-${user.id}`} 
        className="bg-background/80 p-5 rounded-3xl border border-muted-foreground flex-row items-center justify-between"
      >
        <TouchableOpacity 
          onPress={() => router.push(`/follows/${user.id}` as any)} 
          className="flex-row items-center flex-1"
        >
          <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full bg-background/80 mr-3 border border-muted-foreground/35" />
          <View>
            <Text className="text-foreground font-bold text-base">{user.name}</Text>
            <Text className="text-muted-foreground text-xs">{user.mutualFollowers} seguidores en común</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleFollow(user.id)}
          className={`px-5 py-2.5 rounded-full ${isFollowing ? 'bg-background/80 border border-muted-foreground' : 'bg-primary'}`}
        >
          <Text className={`font-bold text-xs ${isFollowing ? 'text-foreground' : 'text-black'}`}>
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <HubLayout
      title="Seguidos"
      subtitle="Administra los perfiles que sigues y descubre nuevas cuentas."
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar seguidos..."
      discoverTitle="Sugeridos para ti"
      discoverItems={suggestionsToFollow}
      renderDiscoverItem={renderSuggestCard}
      showBack={true}
    >
      {/* Sección de Últimas Publicaciones de Seguidos */}
      {latestPosts.length > 0 && (
        <View className="mb-8 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-foreground font-black text-lg uppercase tracking-wider">Últimas Publicaciones</Text>
            {latestPosts[0] && (
              <TouchableOpacity
                onPress={() => router.push(`/feed/search?id=${latestPosts[0].author_id}&from=follow` as any)}
              >
                <Text className="text-primary text-[10px] font-black uppercase">Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="space-y-4">
            {latestPosts.map((rawPost) => {
              let authorName = rawPost.author?.full_name || 'Comunidad';
              let username = `@${rawPost.author?.username || 'usuario'}`;
              let avatar = rawPost.author?.avatar_url || 'https://i.pravatar.cc/150';
              if (rawPost.channel) {
                authorName = rawPost.channel.name;
                username = `@canal_${rawPost.channel_id?.slice(0, 8)}`;
                avatar = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60';
              } else if (rawPost.group) {
                authorName = rawPost.group.name;
                username = `@grupo_${rawPost.group_id?.slice(0, 8)}`;
                avatar = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=60';
              }
              const postForComponent = {
                id: rawPost.id,
                author: authorName,
                username: username,
                avatar: avatar,
                time: rawPost.created_at ? new Date(rawPost.created_at).toLocaleDateString() : 'Novedad',
                text: rawPost.content,
                mediaType: rawPost.media_type || 'photo',
                mediaUrls: rawPost.media_urls || (rawPost.media_url ? [rawPost.media_url] : []),
                feeling: rawPost.feeling || null,
                group_id: rawPost.group_id,
                channel_id: rawPost.channel_id
              };

              return (
                <PostItem
                  key={postForComponent.id}
                  post={postForComponent}
                  isLiked={false}
                  onLikeToggle={() => {}}
                  onCommentPress={() => router.push(`/feed/${postForComponent.id}` as any)}
                  onSharePress={() => {}}
                  onSavePress={() => {}}
                />
              );
            })}
          </View>
        </View>
      )}

      {/* Cuentas que sigues */}
      <View className="mt-8">
        <Text className="text-foreground font-black text-lg uppercase tracking-wider mb-4">
          Cuentas que sigues ({filteredUsers.length})
        </Text>
        
        {filteredUsers.length > 0 ? (
          <View className="bg-background/80 rounded-3xl border border-muted-foreground overflow-hidden">
            {filteredUsers.map((user, index) => (
              <View 
                key={user.id} 
                className={`flex-row items-center justify-between p-5 ${
                  index !== filteredUsers.length - 1 ? 'border-b border-muted-foreground/15' : ''
                }`}
              >
                <TouchableOpacity 
                  onPress={() => router.push(`/follows/${user.id}` as any)} 
                  className="flex-row items-center flex-1"
                >
                  <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full bg-background/80 mr-3 border border-muted-foreground/35" />
                  <View>
                    <Text className="text-foreground font-bold text-base">{user.name}</Text>
                    <Text className="text-secondary text-xs font-semibold">Siguiendo</Text>
                  </View>
                </TouchableOpacity>
                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    onPress={() => router.push(`/chat/follow/${user.id}` as any)} 
                    className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-muted-foreground hover:bg-background/80/85"
                  >
                    <MessageCircle size={18} color={colors.foreground} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleFollow(user.id)}
                    className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-muted-foreground hover:bg-background/80/85"
                  >
                    <UserMinus size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-background/80 border border-muted-foreground border-dashed rounded-3xl p-8 items-center justify-center">
            <Text className="text-muted-foreground font-bold text-sm text-center">
              No sigues a ninguna cuenta que coincida con tu búsqueda.
            </Text>
          </View>
        )}
      </View>
    </HubLayout>
  );
}
