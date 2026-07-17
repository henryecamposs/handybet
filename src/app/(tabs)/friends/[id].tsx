import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MessageCircle, UserPlus, UserCheck, MoreHorizontal } from 'lucide-react-native';
import { handyBetUsers } from '../../../mockdata/handyBetMock';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function FriendDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const [isFollowing, setIsFollowing] = useState(true);

  const user = handyBetUsers.find((u: any) => u.id === id) || {
    name: 'Usuario Desconocido',
    avatar: 'https://i.pravatar.cc/150',
    bio: 'No hay información disponible.'
  };

  const handleMessagePress = () => {
    router.push(`/chat/friend/${id}` as any);
  };

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/(tabs)/friends"
    >
      {/* Cover Portada */}
      <View className="h-44 bg-background/80 relative w-full border-b border-muted-foreground/15">
        {/* Portada simulada con gradiente */}
        <View className="absolute inset-0 bg-gradient-to-b from-muted to-background/50" />
      </View>

      {/* Info Container */}
      <View className="px-4 pb-6">
        {/* Avatar y Acciones Rápidas */}
        <View className="flex-row justify-between items-end -mt-16 mb-4">
          <View className="p-1 bg-background rounded-full border border-muted-foreground/35">
            <Image
              source={{ uri: user.avatar }}
              className="w-28 h-28 rounded-full bg-background/80"
            />
          </View>
          <View className="flex-row gap-2 pb-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-muted-foreground hover:bg-background/80/85">
              <MoreHorizontal size={20} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleMessagePress}
              className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-muted-foreground hover:bg-background/80/85"
            >
              <MessageCircle size={20} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              className={`flex-row h-10 px-4 rounded-full items-center justify-center ${isFollowing ? 'bg-background/80 border border-muted-foreground hover:bg-background/80/85' : 'bg-primary'}`}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={18} color={colors.foreground} />
                  <Text className="text-foreground font-bold ml-2">Siguiendo</Text>
                </>
              ) : (
                <>
                  <UserPlus size={18} color="#000" />
                  <Text className="text-black font-bold ml-2">Seguir</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Datos Personales */}
        <View className="mb-6">
          <Text className="text-2xl font-black text-foreground tracking-tight">{user.name}</Text>
          <Text className="text-muted-foreground text-sm font-medium">@{(user as any).username || user.name.toLowerCase().replace(' ', '_')}</Text>

          <Text className="text-foreground mt-4 leading-5 text-sm">{(user as any).bio || 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.'}</Text>

          <View className="flex-row gap-4 mt-4">
            <View className="flex-row items-center">
              <Text className="text-foreground font-bold text-sm">120</Text>
              <Text className="text-muted-foreground text-xs ml-1 uppercase tracking-wider font-bold">Seguidores</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-foreground font-bold text-sm">15</Text>
              <Text className="text-muted-foreground text-xs ml-1 uppercase tracking-wider font-bold">Grupos</Text>
            </View>
          </View>
        </View>

        {/* Separador */}
        <View className="h-px bg-muted-foreground/15 my-2" />

        {/* Feed del Usuario */}
        <View className="py-4">
          <Text className="text-foreground font-black text-lg uppercase tracking-wider mb-4">Publicaciones Recientes</Text>
          <View className="bg-background/80 border border-muted-foreground rounded-3xl p-5 items-center justify-center h-32">
            <Text className="text-muted-foreground font-bold text-sm">No hay publicaciones nuevas.</Text>
          </View>
        </View>
      </View>
    </HubDetailLayout>
  );
}
