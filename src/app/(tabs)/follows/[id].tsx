import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, UserPlus, UserCheck, MoreHorizontal, Info, Image as ImageIcon, Users, LayoutList, User, Bookmark, Eye } from 'lucide-react-native';
import { handyBetUsers } from '../../../mockdata/handyBetMock';
import { localDB } from '../../../lib/localDB';
import { socialService } from '../../../services/socialService';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useHandyBetStore } from '../../../store/useHandyBetStore';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import { TabContainer, SeccionLista } from '@/components/layout/hub';
import PostContainer from '@/components/layout/hub/PostContainer';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';
import ListItem from '@/components/ui/ListItem';
import CreatePostWidget from '@/components/feed/CreatePostWidget';

export default function FollowDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const [isFollowing, setIsFollowing] = useState(true);

  const user = handyBetUsers.find((u: any) => u.id === id) || {
    name: 'Usuario Desconocido',
    avatar: 'https://i.pravatar.cc/150',
    bio: 'No hay información disponible.',
    username: 'usuario_desconocido'
  };

  const handleMessagePress = () => {
    router.push(`/chat/follow/${id}` as any);
  };

  const [userPosts, setUserPosts] = React.useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = React.useState<any[]>([]);
  const [suggestedGroups, setSuggestedGroups] = React.useState<any[]>([]);
  const { mockSession } = useHandyBetStore();

  React.useEffect(() => {
    localDB.posts.getAll().then((allPosts) => {
      setUserPosts(allPosts.filter((post: any) => post.author?.username === user.username));
    });

    if (mockSession?.id) {
      socialService.getSuggestedUsers(mockSession.id).then(users => {
        setSuggestedUsers(users);
      });
      socialService.getSuggestedGroups(mockSession.id).then(groups => {
        setSuggestedGroups(groups);
      });
    } else {
      // Fallback si no hay sesión
      localDB.users.getAll().then(users => setSuggestedUsers(users.slice(0, 5)));
      localDB.groups.getAll().then(groups => setSuggestedGroups(groups.slice(0, 5)));
    }
  }, [user.username, mockSession?.id]);

  const renderSuggestedActions = () => (
    <View className="flex-row items-center gap-1">
      <IconButton icon={LayoutList} variant="ghost" rounded="full" onPress={() => { }} />
      <IconButton icon={MessageCircle} variant="ghost" rounded="full" onPress={() => { }} />
      <IconButton icon={Bookmark} variant="ghost" rounded="full" onPress={() => { }} />
      <View className="ml-1">
        <IconButton icon={UserPlus} label="Seguir" variant="primary" rounded="full" onPress={() => { }} />
      </View>
    </View>
  );

  const heroBanner = (
    <View className="mb-6">
      {/* Cover Portada */}
      <View className="h-44 bg-background/80 relative w-full border-b border-border-muted ">
        {/* Portada simulada con gradiente */}
        <View className="absolute inset-0 bg-gradient-to-b from-muted to-background/50" />
      </View>

      {/* Avatar y Acciones Rápidas */}
      <View className="px-4 flex-row justify-between items-end -mt-16 mb-4">
        <View className="p-1 bg-background rounded-full border border-border-muted">
          <Image
            source={{ uri: user.avatar }}
            className="w-28 h-28 rounded-full bg-background/80"
          />
        </View>
        <View className="flex-row gap-2 pb-2">
          <IconButton
            icon={MoreHorizontal}
            onPress={() => { }}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={MessageCircle}
            onPress={handleMessagePress}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={isFollowing ? UserCheck : UserPlus}
            label={isFollowing ? "Siguiendo" : "Seguir"}
            onPress={() => setIsFollowing(!isFollowing)}
            variant={isFollowing ? "ghost" : "primary"}
            rounded="full"
            hasBorder={true}
          />
        </View>
      </View>

      {/* Datos Personales */}
      <View className="px-4">
        <Text className="text-2xl font-black text-foreground tracking-tight">{user.name}</Text>
        <Text className="text-muted-foreground text-sm font-medium">@{(user as any).username || user.name.toLowerCase().replace(' ', '_')}</Text>

        <Text className="text-foreground mt-4 leading-5 text-sm">{(user as any).bio || 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.'}</Text>

        <View className="flex-row gap-4 mt-4">
          <View className="flex-row items-center">
            <Text className="text-foreground font-black text-sm">120</Text>
            <Text className="text-muted-foreground text-xs ml-1 font-bold uppercase tracking-wider">Seguidores</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="text-foreground font-black text-sm">15</Text>
            <Text className="text-muted-foreground text-xs ml-1 font-bold uppercase tracking-wider">Grupos</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const tabs = [
    {
      id: 'posts',
      label: 'Publicaciones',
      content: (
        <View className="mt-2">
          <View className="mb-4">
            <CreatePostWidget onPublish={async () => true} />
          </View>
          {userPosts.length > 0 ? (
            <PostContainer
              title="Publicaciones Recientes"
              posts={userPosts}
            />
          ) : (
            <View>
              <EmptyState title="No hay publicaciones nuevas." icon={LayoutList} variant="dashed" />
            </View>
          )}
        </View>
      )
    },
    {
      id: 'info',
      label: 'Información',
      content: <EmptyState title="No hay información disponible." icon={Info} variant="dashed" />
    },
    {
      id: 'photos',
      label: 'Fotos',
      content: <EmptyState title="No hay fotos subidas." icon={ImageIcon} variant="dashed" />
    },
    {
      id: 'following',
      label: 'Seguidos',
      content: (
        <View>
          <EmptyState title="No sigues a nadie aún." icon={User} variant="dashed" />
          <View className="mt-6">
            <SeccionLista
              title="Sugerencias para seguir"
              items={suggestedUsers}
              renderItem={(u, index) => (
                <ListItem
                  key={u.id || index}
                  title={u.name}
                  subtitle={`@${u.username}`}
                  avatar={u.avatar}
                  rightElement={renderSuggestedActions()}
                />
              )}
            />
          </View>
        </View>
      )
    },
    {
      id: 'groups',
      label: 'Grupos',
      content: (
        <View>
          <EmptyState title="No perteneces a ningún grupo." icon={Users} variant="dashed" />
          <View className="mt-6">
            <SeccionLista
              title="Grupos sugeridos"
              items={suggestedGroups}
              renderItem={(g, index) => (
                <ListItem
                  key={g.id || index}
                  title={g.name}
                  subtitle={`${g.members?.length || 0} miembros`}
                  avatar={g.image || 'https://via.placeholder.com/150'}
                  rightElement={renderSuggestedActions()}
                />
              )}
            />
          </View>
        </View>
      )
    }
  ];

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/(tabs)/follows"
    >
      {heroBanner}

      <View className="px-4">
        <TabContainer tabs={tabs} defaultTabId="posts" />
      </View>
    </HubDetailLayout>
  );
}
