import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bookmark, Compass } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';

export default function SavedScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const savedItems = [
    { id: '1', title: 'Gran Kino Imaginario', type: 'Sorteo' },
    { id: '2', title: 'Apuesta segura Liga Española', type: 'Post' }
  ];

  const renderSavedItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/(tabs)/saved/${item.id}` as any)}
      className="bg-background/80 p-4 rounded-2xl border border-muted-foreground flex-row justify-between items-center hover:bg-background/80/80 transition-colors"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center mr-4 border border-zinc-700">
          <Bookmark size={20} color={colors.foreground} />
        </View>
        <View>
          <Text className="text-foreground font-bold text-base" numberOfLines={1}>{item.title}</Text>
          <Text className="text-muted-foreground text-xs font-bold mt-1 uppercase">{item.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const emptyState = (
    <View className="flex-1 items-center justify-center py-20 mt-4">
      <Compass size={48} color="#52525b" className="mb-4" />
      <Text className="text-foreground font-bold text-lg text-center">Sin elementos guardados</Text>
      <Text className="text-foreground text-sm text-center mt-2 max-w-[250px]">
        Explora y guarda publicaciones o sorteos que te interesen para verlos más tarde.
      </Text>
    </View>
  );

  return (
    <HubLayout
      title="Guardados"
      subtitle="Tus posts, noticias y elementos favoritos."
      discoverTitle="Elementos Recientes"
      discoverItems={savedItems}
      renderDiscoverItem={renderSavedItem}
      emptyState={emptyState}
      showBack={true}
    />
  );
}
