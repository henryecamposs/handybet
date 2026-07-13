import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { mockFriendRequests } from '../RightSidebarWidgets';

interface FriendRequestsCenterViewProps {
  currentView: 'all-friend-requests' | 'friend-request-detail';
  selectedItemId: string | null;
  onBack: () => void;
}

export default function FriendRequestsCenterView({ currentView, selectedItemId, onBack }: FriendRequestsCenterViewProps) {
  if (currentView !== 'all-friend-requests' && currentView !== 'friend-request-detail') return null;

  return (
    <View className="flex-1 bg-card p-6 rounded-2xl border border-zinc-800">
      <TouchableOpacity onPress={onBack} className="mb-6 flex-row items-center">
        <Text className="text-primary font-semibold hover:underline">← Volver al Feed</Text>
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-foreground mb-6">
        {currentView === 'all-friend-requests' ? 'Todas las Solicitudes' : 'Detalle de Solicitud'}
      </Text>
      
      {currentView === 'all-friend-requests' ? (
        <View className="flex-col gap-4">
          {mockFriendRequests.map(req => (
            <View key={req.id} className="bg-background border border-zinc-800 p-4 rounded-xl flex-row items-center gap-4 hover:bg-background/80 transition-colors">
              <Image source={{ uri: req.avatar }} className="w-16 h-16 rounded-full" />
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-semibold text-foreground text-lg">{req.name}</Text>
                  <Text className="text-muted-foreground text-sm">{req.time}</Text>
                </View>
                <Text className="text-secondary text-sm mb-3">{req.mutualFriends} amigos en común</Text>
                <View className="flex-row gap-2 max-w-[250px]">
                  <TouchableOpacity className="flex-1 bg-primary py-2 rounded-lg items-center">
                    <Text className="text-primary-foreground font-bold text-sm">Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 bg-background/80 py-2 rounded-lg items-center border border-zinc-700">
                    <Text className="text-foreground font-bold text-sm">Eliminar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-background border border-zinc-800 p-6 rounded-xl flex-row items-center gap-6 max-w-2xl mx-auto w-full">
          <Image source={{ uri: mockFriendRequests.find(r => r.id === selectedItemId)?.avatar || 'https://i.pravatar.cc/150' }} className="w-24 h-24 rounded-full" />
          <View className="flex-1">
            <Text className="font-bold text-foreground text-2xl mb-1">{mockFriendRequests.find(r => r.id === selectedItemId)?.name || 'Usuario'}</Text>
            <Text className="text-secondary text-md mb-4">{mockFriendRequests.find(r => r.id === selectedItemId)?.mutualFriends || 0} amigos en común</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="flex-1 bg-primary py-3 rounded-lg items-center">
                <Text className="text-primary-foreground font-bold text-md">Confirmar Amistad</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 bg-background/80 py-3 rounded-lg items-center border border-zinc-700">
                <Text className="text-foreground font-bold text-md">Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
