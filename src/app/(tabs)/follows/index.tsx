import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  MessageCircle,
  Info,
  LayoutList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react-native';
import IconButton from '@/components/ui/IconButton';
import ListItem from '@/components/ui/ListItem';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, PostContainer, TabContainer } from '../../../components/layout/hub';
import { localDB } from '../../../lib/localDB';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import seedUsers from '@/data/users.json';

const PAGE_SIZE = 10;

export default function FollowsScreen() {
  const colors = useThemeColors();
  const { navigateTo } = useAppNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>(seedUsers);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);

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

  const toggleFollow = (userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  };

  // Filtrado de usuarios según búsqueda
  const filteredFollowing = users.filter((user) => {
    const displayName = user.full_name || user.username || '';
    const isMatching = displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return isMatching && followingStates[user.id];
  });

  const suggestionsToFollow = users
    .filter((user) => !followingStates[user.id])
    .filter((user) => {
      const displayName = user.full_name || user.username || '';
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .map((u) => ({
      ...u,
      mutualFollowers: u.followers_count
        ? Math.min(u.followers_count, 45)
        : (u.username.length * 3) % 20 + 4,
    }));

  const renderPagination = (totalItems: number) => {
    if (totalItems <= PAGE_SIZE) return null;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    return (
      <View className="flex-row items-center justify-between py-4 mt-2 border-t border-white/10 flex-wrap gap-2">
        <Text className="text-muted-foreground text-xs font-semibold">
          Mostrando {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
          {Math.min(currentPage * PAGE_SIZE, totalItems)} de {totalItems} miembros
        </Text>

        <View className="flex-row items-center gap-1.5">
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg border flex-row items-center gap-1 transition-all ${
              currentPage === 1
                ? 'border-white/5 opacity-30 cursor-not-allowed'
                : 'border-white/10 bg-white/5 hover:bg-white/10 active:scale-95'
            }`}
          >
            <ChevronLeft size={14} color={colors.foreground} />
            <Text className="text-foreground text-xs font-bold">Anterior</Text>
          </TouchableOpacity>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <TouchableOpacity
                key={`page-${pageNum}`}
                onPress={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg items-center justify-center border transition-all ${
                  isCurrent
                    ? 'bg-primary border-primary'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <Text
                  className={`text-xs font-black ${
                    isCurrent ? 'text-black' : 'text-foreground'
                  }`}
                >
                  {pageNum}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg border flex-row items-center gap-1 transition-all ${
              currentPage === totalPages
                ? 'border-white/5 opacity-30 cursor-not-allowed'
                : 'border-white/10 bg-white/5 hover:bg-white/10 active:scale-95'
            }`}
          >
            <Text className="text-foreground text-xs font-bold">Siguiente</Text>
            <ChevronRight size={14} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderMemberList = (list: any[]) => {
    const paged = list.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    if (paged.length === 0) {
      return (
        <View className="py-12 items-center justify-center border border-dashed border-white/10 rounded-xl my-4">
          <Text className="text-muted-foreground font-bold text-sm text-center">
            No se encontraron miembros en esta categoría.
          </Text>
        </View>
      );
    }

    return (
      <View className="w-full">
        <View className="divide-y divide-white/5">
          {paged.map((user) => {
            const displayName = user.full_name || user.username;
            const isFollowing = !!followingStates[user.id];
            const roleBadge = user.role?.toUpperCase() || 'MIEMBRO';

            return (
              <ListItem
                key={user.id}
                title={displayName}
                subtitle={`@${user.username} • ${roleBadge}`}
                subtitleVariant="muted"
                avatar={
                  user.avatar_url ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                }
                onPress={() => navigateTo(`/(tabs)/follows/${user.id}`)}
                className="py-3 px-1 hover:bg-white/5 rounded-xl transition-all"
                rightElement={
                  <View className="flex-row items-center gap-2">
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
                    <IconButton
                      label={isFollowing ? 'Siguiendo' : 'Seguir'}
                      onPress={() => toggleFollow(user.id)}
                      variant={isFollowing ? 'muted' : 'primary'}
                      isActive={!isFollowing}
                      hasBorder={true}
                      size="xs"
                      rounded="full"
                    />
                  </View>
                }
              />
            );
          })}
        </View>
        {renderPagination(list.length)}
      </View>
    );
  };

  const tabs = [
    {
      id: 'following',
      label: `Siguiendo (${filteredFollowing.length})`,
      content: (
        <View className="mt-2">
          {renderMemberList(filteredFollowing)}
        </View>
      ),
    },
    {
      id: 'suggestions',
      label: `Sugeridos (${suggestionsToFollow.length})`,
      content: (
        <View className="mt-2">
          {renderMemberList(suggestionsToFollow)}
        </View>
      ),
    },
  ];

  return (
    <HubLayout
      title="Miembros"
      subtitle="Administra los perfiles que sigues y descubre nuevas cuentas de la comunidad."
      onSearchChange={handleSearchChange}
      searchPlaceholder="Buscar por nombre o @"
      showBack={true}
      tabContainer={
        <TabContainer
          tabs={tabs}
          onTabChange={() => setCurrentPage(1)}
        />
      }
      postContainer={
        <PostContainer
          title="Publicaciones Recientes"
          posts={latestPosts}
          onViewAll={() => navigateTo('/feed')}
        />
      }
    />
  );
}
