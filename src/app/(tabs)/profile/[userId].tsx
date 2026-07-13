import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MessageCircle, UserPlus, MoreHorizontal } from 'lucide-react-native';
import { handyBetUsers } from '../../../mockdata/handyBetMock';

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams();

  const user = handyBetUsers.find((u: any) => u.id === userId) || {
    name: 'Usuario Desconocido',
    avatar: 'https://i.pravatar.cc/150',
    bio: 'No hay información disponible.'
  };

  return (
    <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
      {/* Cover Portada */}
      <View className="h-48 bg-background/80 relative w-full">
        {/* Aquí iría la imagen de portada. Se simula con un gradiente o color sólido */}
        <View className="absolute inset-0 bg-gradient-to-b from-zinc-800 to-zinc-900" />
      </View>

      {/* Info Container */}
      <View className="px-4 pb-4">
        {/* Avatar y Acciones Rápidas */}
        <View className="flex-row justify-between items-end -mt-16 mb-4">
          <View className="p-1 bg-background rounded-full">
            <Image
              source={{ uri: user.avatar }}
              className="w-32 h-32 rounded-full bg-background/80"
            />
          </View>
          <View className="flex-row gap-2 pb-2">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-zinc-700">
              <MoreHorizontal size={20} color="#d4d4d8" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-zinc-700">
              <MessageCircle size={20} color="#d4d4d8" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row h-10 px-4 rounded-full bg-primary items-center justify-center">
              <UserPlus size={18} color="#000" />
              <Text className="text-black font-bold ml-2">Amigos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Datos Personales */}
        <View className="mb-6">
          <Text className="text-2xl font-black text-foreground">{user.name}</Text>
          <Text className="text-foreground font-medium">@{(user as any).username || user.name.toLowerCase().replace(' ', '_')}</Text>

          <Text className="text-foreground mt-4 leading-5">{(user as any).bio || 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.'}</Text>

          <View className="flex-row gap-4 mt-4">
            <View className="flex-row items-center">
              <Text className="text-foreground font-bold">120</Text>
              <Text className="text-foreground ml-1">Amigos</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-foreground font-bold">15</Text>
              <Text className="text-foreground ml-1">Grupos</Text>
            </View>
          </View>
        </View>

        {/* Separador */}
        <View className="h-px bg-background/80 my-2" />

        {/* Feed del Usuario */}
        <View className="py-4">
          <Text className="text-foreground font-bold text-lg mb-4">Publicaciones Recientes</Text>
          <View className="bg-background border border-zinc-800 rounded-2xl p-4 items-center justify-center h-32">
            <Text className="text-foreground">No hay publicaciones nuevas.</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
