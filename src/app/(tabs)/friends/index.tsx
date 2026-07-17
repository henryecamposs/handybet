import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageCircle, UserMinus } from 'lucide-react-native';
import { handyBetUsers } from '../../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';

export default function FriendsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
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
    mutualFollowers: Math.floor(Math.random() * 15) + 2
  }));

  const renderSuggestCard = (user: typeof suggestionsToFollow[0]) => {
    const isFollowing = !!followingStates[user.id];
    return (
      <View 
        key={`sug-${user.id}`} 
        className="bg-background/80 p-5 rounded-3xl border border-muted-foreground flex-row items-center justify-between"
      >
        <TouchableOpacity 
          onPress={() => router.push(`/friends/${user.id}` as any)} 
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
                  onPress={() => router.push(`/friends/${user.id}` as any)} 
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
                    onPress={() => router.push(`/chat/friend/${user.id}` as any)} 
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
