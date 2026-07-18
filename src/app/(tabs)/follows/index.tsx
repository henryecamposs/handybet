import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageCircle, UserMinus } from 'lucide-react-native';
import IconButton from '@/components/ui/IconButton';
import ListItem from '@/components/ui/ListItem';
import { handyBetUsers } from '../../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, Carrusel, SeccionLista, PostContainer, TabContainer } from '../../../components/layout/hub';
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
      <ListItem
        key={`sug-${user.id}`}
        title={user.name}
        subtitle={`${user.mutualFollowers} seguidores en común`}
        subtitleVariant="muted"
        avatar={user.avatar}
        onPress={() => router.push(`/follows/${user.id}` as any)}
        className="mb-2"
        rightElement={
          <IconButton
            label={isFollowing ? 'Siguiendo' : 'Seguir'}
            onPress={() => toggleFollow(user.id)}
            variant={isFollowing ? 'muted' : 'primary'}
            isActive={!isFollowing}
            hasBorder={true}
            size='xs'
            rounded="full"
          />
        }
      />
    );
  };

  const tabs = [
    {
      id: 'following',
      label: `Siguiendo (${filteredUsers.length})`,
      content: (
        <View className="mt-2">
          {filteredUsers.length > 0 ? (
            <View className="bg-background/80 overflow-hidden">
              {filteredUsers.map((user, index) => (
                <ListItem
                  key={user.id}
                  title={user.name}
                  subtitle="Siguiendo"
                  subtitleVariant="secondary"
                  avatar={user.avatar}
                  onPress={() => router.push(`/follows/${user.id}` as any)}
                  className="mb-2"
                  rightElement={
                    <>
                      <IconButton
                        icon={MessageCircle}
                        onPress={() => router.push(`/chat/${user.id}?fromType=user` as any)}
                        variant="default"
                      />
                      <IconButton
                        icon={UserMinus}
                        onPress={() => toggleFollow(user.id)}
                        variant="destructive"
                      />
                    </>
                  }
                />
              ))}
            </View>
          ) : (
            <View className="bg-background/80 border border-border border-dashed  p-8 items-center justify-center">
              <Text className="text-muted-foreground font-bold text-sm text-center">
                No sigues a ninguna cuenta que coincida con tu búsqueda.
              </Text>
            </View>
          )}
        </View>
      ),
    },
    {
      id: 'suggestions',
      label: 'Sugeridos',
      content: (
        <View className="mt-2">
          {suggestionsToFollow.length > 0 ? (
            <View className="bg-background/80 overflow-hidden">
              {suggestionsToFollow.map((user) => renderSuggestCard(user))}
            </View>
          ) : (
            <View className="bg-background/80 border border-border border-dashed p-8 items-center justify-center">
              <Text className="text-muted-foreground font-bold text-sm text-center">
                No hay sugerencias en este momento.
              </Text>
            </View>
          )}
        </View>
      ),
    },
  ];

  return (
    <HubLayout
      title="Seguidos"
      subtitle="Administra los perfiles que sigues y descubre nuevas cuentas."
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar seguidos..."
      showBack={true}
      tabContainer={<TabContainer tabs={tabs} />}
      postContainer={
        <PostContainer
          title="Últimas Publicaciones"
          posts={latestPosts}
          onViewAll={latestPosts[0] ? () => router.push(`/feed/search?id=${latestPosts[0].author_id}&from=follow` as any) : undefined}
        />
      }
    />
  );
}
