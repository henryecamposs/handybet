import React from 'react';
import { ScrollView, TouchableOpacity, View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Bookmark, Tv, Wallet, Gamepad2 } from 'lucide-react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import SidebarPopover from '../layout/SidebarPopover';
import { handyBetGroups, handyBetChannels, handyBetUsers } from '../../mockdata/handyBetMock';
import { localDB } from '../../lib/localDB';

export default function LeftSidebarWidgets() {
  const router = useRouter();
  const { mockSession } = useHandyBetStore();
  const colors = useThemeColors();
  const [savedItems, setSavedItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const items = await localDB.saved_items.getAll();
        setSavedItems(items);
      } catch (error) {
        console.error(error);
      }
    };
    loadSavedItems();
  }, []);

  const suggestions = {
    groups: handyBetGroups.map(g => ({ id: g.id, name: g.name, type: g.type, members: g.members.length * 123 })),
    channels: handyBetChannels.map(c => ({ id: c.id, name: c.name, description: c.description })),
    following: handyBetUsers.filter(u => u.id !== 'usr_admin')
  };

  return (
    <ScrollView className="w-[20%] p-4 bg-primary/5 border border-r-primary/20" showsVerticalScrollIndicator={false}>
      {/* Perfil de Usuario */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center p-2 rounded-xs hover:bg-background/80/50 mb-2">
        <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-9 h-9 rounded-full" />
        <Text className="font-semibold text-foreground ml-3 text-[15px]">{mockSession?.name}</Text>
      </TouchableOpacity>

      {/* Menú de Popovers */}
      <View className="space-y-1">
        <SidebarPopover
          icon={<Users size={24} color={colors.primary} />}
          label="Seguidos"
          items={suggestions.following.map(f => ({ id: f.id, name: f.name, image: f.avatar, path: `/chat/follow/${f.id}` }))}
          viewAllPath="/follows"
        />

        <SidebarPopover
          icon={<Bookmark size={24} color={colors.primary} />}
          label="Guardado"
          items={savedItems.map((item) => {
            const targetId = item.target_id || item.id;
            let path = `/favorites/${item.id}`;
            if (item.type === 'user') path = `/follows/${targetId}`;
            else if (item.type === 'game') path = `/games/${targetId}`;
            else if (item.type === 'channel') path = `/channels/${targetId}`;
            else if (item.type === 'group') path = `/chat/group/${targetId}`;
            else if (item.type === 'post' || item.type === 'advertisement') path = `/feed/${targetId}?from=favorites`;
            return {
              id: item.id,
              name: item.title || item.name || 'Elemento Guardado',
              subtitle: item.type === 'user' ? 'Usuario' : item.type === 'game' ? 'Juego' : item.type === 'channel' ? 'Canal' : item.type === 'group' ? 'Grupo' : 'Publicación',
              path
            };
          })}
          viewAllPath="/favorites"
        />
        <SidebarPopover
          icon={<Users size={24} color={colors.primary} />}
          label="Grupos"
          items={suggestions.groups.map(g => ({ id: g.id, name: g.name, subtitle: `${g.members} miembros`, path: `/chat/group/${g.id}` }))}
          viewAllPath="/grupos"
        />
        <SidebarPopover
          icon={<Tv size={24} color={colors.primary} />}
          label="Canales"
          items={suggestions.channels.map(c => ({ id: c.id, name: c.name, subtitle: c.description, path: `/channels/${c.id}` }))}
          viewAllPath="/channels"
        />
        <SidebarPopover
          icon={<Wallet size={24} color={colors.primary} />}
          label="Billeteras"
          items={[
            { id: 'wallet_1', name: 'Taquilla Principal', subtitle: 'La Imaginaria', path: '/wallet/wallet_1' }
          ]}
          viewAllPath="/wallet"
        />
        <SidebarPopover
          icon={<Gamepad2 size={24} color={colors.primary} />}
          label="Juegos"
          items={[
            { id: 'd1', name: 'Animalitos VIP', subtitle: 'Taquillas', path: '/games/d1' },
            { id: 'd2', name: 'Carreras 5y6', subtitle: 'Taquillas', path: '/games/d2' },
            { id: 'd3', name: 'Quiniela Champions', subtitle: 'Quinielas', path: '/games/d3' }
          ]}
          viewAllPath="/games"
        />
      </View>
    </ScrollView>
  );
}
