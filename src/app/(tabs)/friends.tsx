import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, UserPlus, MoreHorizontal, MessageCircle, UserMinus } from 'lucide-react-native';
import { handyBetUsers } from '../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';

export default function FriendsScreen() {
  const router = useRouter();
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

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-foreground font-bold text-2xl">Seguidos</Text>
        <Text className="text-foreground text-sm mt-1">Administra los perfiles que sigues y descubre nuevas cuentas.</Text>
      </View>

      {/* Buscador */}
      <View className="bg-background/80 rounded-full flex-row items-center px-4 py-2 border border-zinc-800 mb-6">
        <Search size={20} color="#71717a" />
        <TextInput
          placeholder="Buscar seguidos..."
          placeholderTextColor="#71717a"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className="flex-1 text-foreground ml-3 outline-none"
        />
      </View>

      {/* Sugerencias de seguimiento (Reemplaza a Solicitudes) */}
      <View className="mb-8">
        <Text className="text-foreground font-bold text-lg mb-4">Sugeridos para ti</Text>
        {suggestionsToFollow.map((user) => {
          const isFollowing = !!followingStates[user.id];
          return (
            <View key={`sug-${user.id}`} className="bg-background/80 p-4 rounded-2xl border border-zinc-800 mb-3 flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.push(`/profile/${user.id}` as any)} className="flex-row items-center flex-1">
                <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full bg-background/80 mr-3" />
                <View>
                  <Text className="text-foreground font-bold">{user.name}</Text>
                  <Text className="text-foreground/60 text-xs">{user.mutualFollowers} seguidores en común</Text>
                </View>
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => toggleFollow(user.id)}
                  className={`px-4 py-2 rounded-full ${isFollowing ? 'bg-background/80 border border-zinc-700' : 'bg-primary'}`}
                >
                  <Text className={`font-bold text-xs ${isFollowing ? 'text-foreground' : 'text-black'}`}>
                    {isFollowing ? 'Siguiendo' : 'Seguir'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* Cuentas que sigues */}
      <View className="mb-8">
        <Text className="text-foreground font-bold text-lg mb-4">Cuentas que sigues ({filteredUsers.length})</Text>
        {filteredUsers.length > 0 ? (
          <View className="bg-background/80 rounded-2xl border border-zinc-800 overflow-hidden">
            {filteredUsers.map((user, index) => (
              <View key={user.id} className={`flex-row items-center justify-between p-4 ${index !== filteredUsers.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
                <TouchableOpacity onPress={() => router.push(`/profile/${user.id}` as any)} className="flex-row items-center flex-1">
                  <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full bg-background/80 mr-3" />
                  <View>
                    <Text className="text-foreground font-semibold">{user.name}</Text>
                    <Text className="text-secondary text-xs font-medium">Siguiendo</Text>
                  </View>
                </TouchableOpacity>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => router.push(`/chat/friend/${user.id}` as any)} className="w-9 h-9 rounded-full bg-background/80 items-center justify-center border border-zinc-700 hover:bg-background">
                    <MessageCircle size={18} color="#d4d4d8" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => toggleFollow(user.id)}
                    className="w-9 h-9 rounded-full bg-background/80 items-center justify-center border border-zinc-700 hover:bg-background"
                  >
                    <UserMinus size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="bg-background/80 border border-zinc-800 rounded-2xl p-6 items-center justify-center">
            <Text className="text-foreground/50 text-sm">No sigues a ninguna cuenta que coincida.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
