import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, Compass } from 'lucide-react-native';
import { localDB } from '../../../lib/localDB';
import { useThemeColors } from '../../../hooks/useThemeColors';
import HubLayout from '../../../components/layout/HubLayout';

export default function GuardadosScreen() {
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const colors = useThemeColors();

  const loadSavedItems = React.useCallback(async () => {
    try {
      const items = await localDB.saved_items.getAll();
      setSavedItems(items);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSavedItems();
  }, [loadSavedItems]);

  const getTypeName = (type: string) => {
    switch (type) {
      case 'post': return 'Publicación';
      case 'user': return 'Usuario';
      case 'group': return 'Grupo';
      case 'channel': return 'Canal';
      case 'game': return 'Juego';
    }
  };

  const handleItemPress = (item: any) => {
    const targetId = item.target_id || item.id;
    switch (item.type) {
      case 'user':
        router.push(`/follows/${targetId}` as any);
        break;
      case 'game':
        router.push(`/games/${targetId}` as any);
        break;
      case 'channel':
        router.push(`/channels/${targetId}` as any);
        break;
      case 'group':
        router.push(`/chat/group/${targetId}` as any);
        break;
      case 'advertisement':
      case 'post':
        router.push(`/feed/${targetId}?from=favorites` as any);
        break;
      default:
        router.push(`/favorites/${item.id}` as any);
    }
  };

  const renderSavedItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => handleItemPress(item)}
      className="bg-background/80 p-4 rounded-2xl border border-muted-foreground flex-row justify-between items-center hover:bg-background/80/80 transition-colors mb-3"
    >
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center mr-4 border border-zinc-700">
          <Bookmark size={20} color={colors.foreground} />
        </View>
        <View>
          <Text className="text-foreground font-bold text-base" numberOfLines={1}>
            {item.title || item.name || 'Elemento Guardado'}
          </Text>
          <Text className="text-muted-foreground text-xs font-bold mt-1 uppercase">
            {getTypeName(item.type)}
          </Text>
        </View>
      </View>
      <Bookmark size={18} color={colors.primary} fill={colors.primary} />
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

  const filteredItems = savedItems.filter(item => {
    const title = item.title || item.name || 'Elemento Guardado';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <HubLayout
      title="Guardados"
      subtitle="Tus posts, noticias y elementos favoritos."
      searchPlaceholder="Buscar en guardados..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      discoverTitle="Elementos Guardados"
      discoverItems={filteredItems}
      renderDiscoverItem={renderSavedItem}
      emptyState={emptyState}
      showBack={true}
      isLoading={isLoading}
    />
  );
}
