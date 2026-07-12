import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { Search, UserPlus, MoreHorizontal, MessageCircle } from 'lucide-react-native';
import { handyBetUsers } from '../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';

export default function FriendsScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-zinc-100 font-bold text-2xl">Amigos</Text>
        <Text className="text-zinc-400 text-sm mt-1">Administra tus conexiones y encuentra nuevos amigos.</Text>
      </View>

      {/* Buscador */}
      <View className="bg-zinc-900 rounded-full flex-row items-center px-4 py-2 border border-zinc-800 mb-6">
        <Search size={20} color="#71717a" />
        <TextInput
          placeholder="Buscar amigos..."
          placeholderTextColor="#71717a"
          className="flex-1 text-zinc-100 ml-3 outline-none"
        />
      </View>

      {/* Solicitudes de Amistad */}
      <View className="mb-8">
        <Text className="text-zinc-100 font-bold text-lg mb-4">Solicitudes (2)</Text>
        {handyBetUsers.slice(0, 2).map((user) => (
          <View key={user.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 mb-3 flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.push(`/profile/${user.id}` as any)} className="flex-row items-center flex-1">
              <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full bg-zinc-800 mr-3" />
              <View>
                <Text className="text-zinc-100 font-bold">{user.name}</Text>
                <Text className="text-zinc-500 text-xs">Te ha enviado una solicitud</Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row gap-2">
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-full">
                <Text className="text-black font-bold text-xs">Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-zinc-800 px-4 py-2 rounded-full border border-zinc-700">
                <Text className="text-zinc-300 font-bold text-xs">Ignorar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Todos los amigos */}
      <View className="mb-8">
        <Text className="text-zinc-100 font-bold text-lg mb-4">Todos tus amigos ({handyBetUsers.length})</Text>
        <View className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {handyBetUsers.map((user, index) => (
            <View key={user.id} className={`flex-row items-center justify-between p-4 ${index !== handyBetUsers.length - 1 ? 'border-b border-zinc-800/50' : ''}`}>
              <TouchableOpacity onPress={() => router.push(`/profile/${user.id}` as any)} className="flex-row items-center flex-1">
                <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full bg-zinc-800 mr-3" />
                <View>
                  <Text className="text-zinc-100 font-semibold">{user.name}</Text>
                  <Text className="text-secondary text-xs font-medium">En línea</Text>
                </View>
              </TouchableOpacity>
              <View className="flex-row gap-2">
                <TouchableOpacity onPress={() => router.push(`/chat/friend/${user.id}` as any)} className="w-9 h-9 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700 hover:bg-zinc-700">
                  <MessageCircle size={18} color="#d4d4d8" />
                </TouchableOpacity>
                <TouchableOpacity className="w-9 h-9 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700 hover:bg-zinc-700">
                  <MoreHorizontal size={18} color="#d4d4d8" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
