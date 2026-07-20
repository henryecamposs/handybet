import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, UserPlus, UserCheck, MoreHorizontal, Info, Image as ImageIcon, Users, LayoutList, User, Bookmark, Eye, ArrowLeft } from 'lucide-react-native';
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
import { useToastStore } from '@/store/useToastStore';
import HubDetailsUtilities from '@/components/layout/hub/HubDetailsUtilities';
import HubCover from '@/components/layout/hub/HubCover';
import { useHubUtilities } from '@/hooks/useHubUtilities';

const SuggestedItemActions = ({ item, type, router }: { item: any; type: 'user' | 'group'; router: any }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { handleFollowToggle, handleSaveToggle, handleChat, handleViewProfile } = useHubUtilities();

  const onSave = () => handleSaveToggle(isSaved, type, item.name, setIsSaved);
  const onFollow = () => handleFollowToggle(isFollowing, type, setIsFollowing);
  const onChat = () => handleChat(item.id, type);
  const onView = () => handleViewProfile(item.id, type);

  return (
    <View className="flex-row gap-2 mt-3">
      <IconButton
        icon={Bookmark}
        onPress={onSave}
        variant={isSaved ? "primary" : "ghost"}
        rounded="full"
        hasBorder={true}
        size='sm'
      />
      <IconButton
        icon={MessageCircle}
        onPress={onChat}
        variant="ghost"
        rounded="full"
        hasBorder={true}
        size='sm'
      />
      <IconButton
        icon={isFollowing ? UserCheck : UserPlus}
        label={isFollowing ? "Siguiendo" : "Seguir"}
        onPress={onFollow}
        variant={isFollowing ? "ghost" : "primary"}
        rounded="full"
        hasBorder={true}
        size='sm'
      />
    </View>
  );
};

export default function FollowDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const { handleBack, handleFollowToggle, handleChat } = useHubUtilities();
  const [isFollowing, setIsFollowing] = useState(false);

  const user = handyBetUsers.find((u: any) => u.id === id) || {
    name: 'Usuario Desconocido',
    avatar: 'https://i.pravatar.cc/150',
    bio: 'No hay información disponible.',
    username: 'usuario_desconocido'
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
      localDB.users.getAll().then(users => setSuggestedUsers(users.slice(0, 5)));
      localDB.groups.getAll().then(groups => setSuggestedGroups(groups.slice(0, 5)));
    }
  }, [user.username, mockSession?.id]);

  const heroBanner = (
    <View className="mb-6">
      <HubCover variant="muted" />

      <HubDetailsUtilities
        avatarNode={
          <Image
            source={{ uri: user.avatar }}
            className="w-28 h-28 rounded-full bg-background/80"
          />
        }
        title={user.name}
        subtitle={(user as any).username || user.name.toLowerCase().replace(' ', '_')}
        stats={[
          { value: 120, label: 'Seguidores' },
          { value: 15, label: 'Grupos' }
        ]}
        onBack={() => handleBack('/(tabs)/follows')}
        colors={colors}
      >
        <IconButton
          icon={MoreHorizontal}
          onPress={() => { }}
          variant="ghost"
          rounded="full"
          hasBorder={true}
          size='sm'
        />
        <IconButton
          icon={MessageCircle}
          onPress={() => handleChat(id as string, 'user')}
          variant="ghost"
          rounded="full"
          hasBorder={true}
          size='sm'
        />
        <IconButton
          icon={isFollowing ? UserCheck : UserPlus}
          label={isFollowing ? "Siguiendo" : "Seguir"}
          onPress={() => handleFollowToggle(isFollowing, 'user', setIsFollowing)}
          variant={isFollowing ? "ghost" : "primary"}
          rounded="full"
          hasBorder={true}
          size='sm'
        />
      </HubDetailsUtilities>

      {/* Datos Personales Adicionales */}
      <View className="px-4">
        <Text className="text-foreground mt-2 leading-5 text-sm">{(user as any).bio || 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.'}</Text>
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
      label: 'Miembros',
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
                  rightElement={<SuggestedItemActions item={u} type="user" router={router} />}
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
                  rightElement={<SuggestedItemActions item={g} type="group" router={router} />}
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
      hideHeader
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
