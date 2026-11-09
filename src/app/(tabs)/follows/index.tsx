import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import {
  MessageCircle,
  Info,
  LayoutList,
  Sparkles,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserPlus,
} from 'lucide-react-native';
import IconButton from '@/components/ui/IconButton';
import ListItem from '@/components/ui/ListItem';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout } from '../../../components/layout/hub';
import PostItem from '../../../components/feed/PostItem';
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
  const [activeTab, setActiveTab] = useState<'following' | 'suggestions'>('following');
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
      const top4 = followPosts.slice(0, 4);
      const resolved = await Promise.all(top4.map((p) => localDB.resolvePostWithAuthor(p)));
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

  const currentList = activeTab === 'following' ? filteredFollowing : suggestionsToFollow;
  const totalPages = Math.max(1, Math.ceil(currentList.length / PAGE_SIZE));

  // Paginación de 10 elementos
  const paginatedUsers = currentList.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleTabChange = (tab: 'following' | 'suggestions') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  };

  return (
    <HubLayout
      title="Directorio de Miembros"
      subtitle="Comunidad activa de pronosticadores, creadoras VIP y apostadores."
      showBack={true}
    >
      {/* 🟢 BLOQUE 1: CONTENEDOR INDEPENDIENTE DE MIEMBROS CON SCROLL Y PAGINACIÓN */}
      <View className="bg-card/75 border border-white/10 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-md">
        {/* Encabezado del Bloque */}
        <View className="flex-row items-center justify-between pb-4 border-b border-white/10 mb-4 flex-wrap gap-3">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center">
              <Users size={20} color={colors.primary} />
            </View>
            <View>
              <Text className="text-foreground font-black text-lg">Miembros de la Comunidad</Text>
              <Text className="text-muted-foreground text-xs font-semibold">
                Mostrando {paginatedUsers.length} de {currentList.length} cuentas registradas
              </Text>
            </View>
          </View>

          {/* Barra de Búsqueda Local en el Bloque */}
          <View className="bg-white/5 border border-white/10 rounded-full flex-row items-center px-3.5 py-1.5 w-full sm:w-64">
            <Search size={14} color="#71717a" />
            <TextInput
              value={searchTerm}
              onChangeText={handleSearchChange}
              placeholder="Buscar por nombre o @"
              placeholderTextColor="#71717a"
              className="text-foreground text-xs ml-2 flex-1 outline-none font-medium"
            />
          </View>
        </View>

        {/* Selector de Pestañas Compacto (Altura Controlada, Sin Estiramiento) */}
        <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl p-1 mb-4">
          <TouchableOpacity
            onPress={() => handleTabChange('following')}
            activeOpacity={0.8}
            className={`flex-1 py-2 rounded-lg flex-row items-center justify-center gap-2 transition-all ${
              activeTab === 'following'
                ? 'bg-primary shadow-sm'
                : 'hover:bg-white/5'
            }`}
          >
            <UserCheck size={14} color={activeTab === 'following' ? '#000' : '#71717a'} />
            <Text
              className={`text-xs font-black uppercase tracking-wider ${
                activeTab === 'following' ? 'text-black' : 'text-muted-foreground'
              }`}
            >
              Siguiendo ({filteredFollowing.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleTabChange('suggestions')}
            activeOpacity={0.8}
            className={`flex-1 py-2 rounded-lg flex-row items-center justify-center gap-2 transition-all ${
              activeTab === 'suggestions'
                ? 'bg-primary shadow-sm'
                : 'hover:bg-white/5'
            }`}
          >
            <UserPlus size={14} color={activeTab === 'suggestions' ? '#000' : '#71717a'} />
            <Text
              className={`text-xs font-black uppercase tracking-wider ${
                activeTab === 'suggestions' ? 'text-black' : 'text-muted-foreground'
              }`}
            >
              Sugerencias ({suggestionsToFollow.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Miembros (Máximo 10 por página) */}
        {paginatedUsers.length > 0 ? (
          <View className="divide-y divide-white/5 mb-4">
            {paginatedUsers.map((user) => {
              const displayName = user.full_name || user.username;
              const isFollowing = !!followingStates[user.id];
              const roleBadge = user.role?.toUpperCase() || 'MIEMBRO';
              const isVip = user.role === 'vip_creator';
              const isTipster = user.role === 'tipster';

              return (
                <ListItem
                  key={user.id}
                  title={displayName}
                  subtitle={`@${user.username} • ${roleBadge} ${
                    user.mutualFollowers ? `• ${user.mutualFollowers} seguidores` : ''
                  }`}
                  subtitleVariant="muted"
                  avatar={
                    user.avatar_url ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
                  }
                  onPress={() => navigateTo(`/(tabs)/follows/${user.id}`)}
                  className="py-2.5 px-2 hover:bg-white/5 rounded-xl transition-all"
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
        ) : (
          <View className="bg-white/5 border border-white/10 border-dashed rounded-xl p-8 items-center justify-center my-4">
            <Text className="text-muted-foreground font-bold text-sm text-center">
              No se encontraron miembros en esta sección.
            </Text>
          </View>
        )}

        {/* 🔢 BARRA DE PAGINACIÓN DE 10 ELEMENTOS */}
        {currentList.length > 0 && (
          <View className="flex-row items-center justify-between pt-4 mt-2 border-t border-white/10 flex-wrap gap-3">
            <Text className="text-muted-foreground text-xs font-semibold">
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
              {Math.min(currentPage * PAGE_SIZE, currentList.length)} de {currentList.length}{' '}
              miembros
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

              {/* Botones numéricos de página */}
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
        )}
      </View>

      {/* 🟢 BLOQUE 2: CONTENEDOR INDEPENDIENTE DE PUBLICACIONES RECIENTES */}
      <View className="bg-card/75 border border-white/10 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-md">
        <View className="flex-row items-center justify-between pb-4 border-b border-white/10 mb-4">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 items-center justify-center">
              <Sparkles size={20} color="#10b981" />
            </View>
            <View>
              <Text className="text-foreground font-black text-lg">Publicaciones Recientes</Text>
              <Text className="text-muted-foreground text-xs font-semibold">
                Pronósticos, fotos VIP y actualidad compartida por la comunidad
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigateTo('/feed')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full active:scale-95 transition-all"
          >
            <Text className="text-primary font-bold text-xs">Ver todo en el Muro →</Text>
          </TouchableOpacity>
        </View>

        {/* Feed de Publicaciones del Bloque */}
        {latestPosts.length > 0 ? (
          <View className="gap-4">
            {latestPosts.map((post) => {
              const formattedPost = {
                id: post.id,
                author: post.author?.full_name || 'Comunidad',
                username: `@${post.author?.username || 'usuario'}`,
                avatar: post.author?.avatar_url || 'https://i.pravatar.cc/150',
                time: post.created_at
                  ? new Date(post.created_at).toLocaleDateString()
                  : 'Reciente',
                text: post.content,
                mediaType: post.media_type || 'photo',
                mediaUrls:
                  post.media_urls || (post.media_url ? [post.media_url] : []),
                feeling: post.feeling || null,
                plans: post.plans || null,
              };

              return (
                <PostItem
                  key={post.id}
                  post={formattedPost}
                  isLiked={false}
                  onLikeToggle={() => {}}
                  onCommentPress={() => navigateTo(`/feed/search?id=${post.id}`)}
                />
              );
            })}
          </View>
        ) : (
          <View className="bg-white/5 border border-white/10 border-dashed rounded-xl p-6 items-center">
            <Text className="text-muted-foreground font-bold text-xs text-center">
              No hay publicaciones recientes de tus seguidos por el momento.
            </Text>
          </View>
        )}
      </View>
    </HubLayout>
  );
}
