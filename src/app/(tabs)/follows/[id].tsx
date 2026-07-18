import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, UserPlus, UserCheck, MoreHorizontal, Info, Image as ImageIcon, Users, LayoutList } from 'lucide-react-native';
import { handyBetUsers, mockPosts } from '../../../mockdata/handyBetMock';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import { TabContainer } from '@/components/layout/hub';
import PostContainer from '@/components/layout/hub/PostContainer';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';

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

  const userPosts = mockPosts.filter((post) => post.author?.username === user.username) || [];

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
            onPress={() => {}}
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
          {userPosts.length > 0 ? (
            <PostContainer 
              title="Publicaciones Recientes"
              posts={userPosts}
            />
          ) : (
            <View>
              <Text className="text-foreground font-black text-lg uppercase tracking-wider mb-2">Publicaciones Recientes</Text>
              <EmptyState title="No hay publicaciones nuevas." variant="solid" className="min-h-[120px]" />
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
      content: <EmptyState title="No sigues a nadie aún." icon={Users} variant="dashed" />
    },
    {
      id: 'groups',
      label: 'Grupos',
      content: <EmptyState title="No perteneces a ningún grupo." icon={LayoutList} variant="dashed" />
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
