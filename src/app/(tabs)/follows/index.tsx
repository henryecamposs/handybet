import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageCircle, UserMinus, Info, LayoutList, Sparkles } from 'lucide-react-native';
import IconButton from '@/components/ui/IconButton';
import ListItem from '@/components/ui/ListItem';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, PostContainer, TabContainer } from '../../../components/layout/hub';
import { localDB } from '../../../lib/localDB';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import seedUsers from '@/data/users.json';

export default function FollowsScreen() {
  const colors = useThemeColors();
  const { navigateTo } = useAppNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>(seedUsers);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function initUsers() {
      try {
        const loaded = await localDB.users.getAll();
        const userList = loaded && loaded.length > 0 ? loaded : seedUsers;
        setUsers(userList);

        // Seguidos iniciales (los primeros 25 usuarios)
        const initialFollows: Record<string, boolean> = {};
        userList.forEach((u: any, idx: number) => {
          initialFollows[u.id] = idx < 25;
        });
        setFollowingStates(initialFollows);
      } catch (err) {
        console.warn('Error loading users in follows:', err);
      }
    }
    initUsers();
    fetchLatestPosts();
  }, []);

  const toggleFollow = (userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredUsers = users.filter((user) => {
    const displayName = user.full_name || user.username || '';
    const isMatchingSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatchingSearch && followingStates[user.id];
  });

  const suggestionsToFollow = users
    .filter((user) => !followingStates[user.id])
    .slice(0, 15)
    .map((u) => ({
      ...u,
      mutualFollowers: u.followers_count ? Math.min(u.followers_count, 45) : (u.username.length * 3) % 20 + 4,
    }));

  async function fetchLatestPosts() {
    try {
      const allPosts = await localDB.posts.getAll();
      const followPosts = allPosts.filter((p: any) => !p.group_id && !p.channel_id);
      followPosts.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const top5 = followPosts.slice(0, 5);
      const resolved = await Promise.all(top5.map((p) => localDB.resolvePostWithAuthor(p)));
      setLatestPosts(resolved);
    } catch (err) {
      console.log('Error loading latest posts in follows hub:', err);
    }
  }

  const renderSuggestCard = (user: any) => {
    const isFollowing = !!followingStates[user.id];
    const displayName = user.full_name || user.username;
    return (
      <ListItem
        key={`sug-${user.id}`}
        title={displayName}
        subtitle={`${user.mutualFollowers} seguidores • @${user.username}`}
        subtitleVariant="muted"
        avatar={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
        onPress={() => navigateTo(`/(tabs)/follows/${user.id}`)}
        className="mb-2"
        rightElement={
          <IconButton
            label={isFollowing ? 'Siguiendo' : 'Seguir'}
            onPress={() => toggleFollow(user.id)}
            variant={isFollowing ? 'muted' : 'primary'}
            isActive={!isFollowing}
            hasBorder={true}
            size="xs"
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
              {filteredUsers.map((user) => {
                const displayName = user.full_name || user.username;
                return (
                  <ListItem
                    key={user.id}
                    title={displayName}
                    subtitle={`@${user.username} • ${user.role?.toUpperCase() || 'MIEMBRO'}`}
                    subtitleVariant="secondary"
                    avatar={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    onPress={() => navigateTo(`/(tabs)/follows/${user.id}`)}
                    className="mb-2"
                    rightElement={
                      <View className="flex-row gap-2 mt-2">
                        <IconButton
                          icon={MessageCircle}
                          onPress={() => navigateTo(`/chat/${user.id}`)}
                          variant="default"
                          rounded="full"
                          hasBorder={true}
                          size="xs"
                        />
                        <IconButton
                          icon={LayoutList}
                          onPress={() => navigateTo(`/(tabs)/feed/search?id=${user.id}&from=user`)}
                          variant="default"
                          rounded="full"
                          hasBorder={true}
                          size="xs"
                        />
                        <IconButton
                          icon={Info}
                          onPress={() => navigateTo(`/(tabs)/follows/${user.id}`)}
                          variant="default"
                          rounded="full"
                          hasBorder={true}
                          size="xs"
                        />
                      </View>
                    }
                  />
                );
              })}
            </View>
          ) : (
            <View className="bg-background/80 border border-border border-dashed p-8 items-center justify-center">
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
      label: `Sugeridos (${suggestionsToFollow.length})`,
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
      title="Miembros y Seguidos"
      subtitle="Administra los perfiles de la comunidad de HandyBet y descubre pronosticadores y creadores VIP."
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar miembros por nombre o usuario..."
      showBack={true}
      tabContainer={<TabContainer tabs={tabs} />}
      postContainer={
        <View className="mb-4">
          <PostContainer
            title="Publicaciones Recientes"
            posts={latestPosts}
            onViewAll={
              latestPosts[0]
                ? () => navigateTo(`/feed/search?id=${latestPosts[0].author_id}&from=follow`)
                : undefined
            }
          />
        </View>
      }
    />
  );
}
