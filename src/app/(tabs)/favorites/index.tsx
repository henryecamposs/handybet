import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Bookmark, Compass } from 'lucide-react-native';
import { localDB } from '../../../lib/localDB';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer } from '../../../components/layout/hub';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';

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
        router.push(`/chat/${targetId}` as any);
        break;
      case 'advertisement':
      case 'post':
        router.push(`/feed/${targetId}` as any);
        break;
      default:
        router.push(`/favorites/${item.id}` as any);
    }
  };

  const renderSavedItem = (item: any) => (
    <ListItem
      key={item.id}
      title={item.title || item.name || 'Elemento Guardado'}
      subtitle={getTypeName(item.type)?.toUpperCase()}
      subtitleVariant="muted"
      leftElement={
        <View className="w-10 h-10 items-center justify-center rounded-full border border-border bg-background/80">
          <Bookmark size={18} color={colors.foreground} />
        </View>
      }
      rightElement={
        <IconButton
          icon={Bookmark}
          onPress={() => handleItemPress(item)}
          variant="ghost"
          hasBorder={false}
          size="sm"
          rounded="full"
          iconColor={colors.primary}
        />
      }
      onPress={() => handleItemPress(item)}
      className="mb-2 bg-background/80"
    />
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

  const tabs = [
    {
      id: 'all',
      label: 'Todos',
      content: (
        <SeccionLista
          items={filteredItems}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
    {
      id: 'posts',
      label: 'Publicaciones',
      content: (
        <SeccionLista
          items={filteredItems.filter(item => item.type === 'post' || item.type === 'advertisement')}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
    {
      id: 'groups',
      label: 'Grupos',
      content: (
        <SeccionLista
          items={filteredItems.filter(item => item.type === 'group')}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
    {
      id: 'channels',
      label: 'Canales',
      content: (
        <SeccionLista
          items={filteredItems.filter(item => item.type === 'channel')}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
    {
      id: 'games',
      label: 'Juegos',
      content: (
        <SeccionLista
          items={filteredItems.filter(item => item.type === 'game')}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
    {
      id: 'follows',
      label: 'Miembros',
      content: (
        <SeccionLista
          items={filteredItems.filter(item => item.type === 'user')}
          renderItem={renderSavedItem}
          emptyState={emptyState}
        />
      ),
    },
  ];

  return (
    <HubLayout
      title="Guardados"
      subtitle="Tus posts, noticias y elementos favoritos."
      searchPlaceholder="Buscar en guardados..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showBack={true}
      isLoading={isLoading}
      tabContainer={<TabContainer tabs={tabs} />}
    />
  );
}
