import React from 'react';
import { ScrollView, TouchableOpacity, View, Image, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Bookmark, Tv, Wallet, Gamepad2 } from 'lucide-react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import SidebarPopover from '../layout/SidebarPopover';
import { handyBetGroups, handyBetChannels, handyBetUsers } from '../../mockdata/handyBetMock';

export default function LeftSidebarWidgets() {
  const router = useRouter();
  const { mockSession } = useHandyBetStore();
  const colors = useThemeColors();

  const suggestions = {
    groups: handyBetGroups.map(g => ({ id: g.id, name: g.name, type: g.type, members: g.members.length * 123 })),
    channels: handyBetChannels.map(c => ({ id: c.id, name: c.name, description: c.description })),
    following: handyBetUsers.filter(u => u.id !== 'usr_admin')
  };

  return (
    <ScrollView className="w-[20%] p-4 bg-primary/5 border border-r-primary/20" showsVerticalScrollIndicator={false}>
      {/* Perfil de Usuario */}
      <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center p-2 rounded-xl hover:bg-background/80/50 mb-2">
        <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-9 h-9 rounded-full" />
        <Text className="font-semibold text-foreground ml-3 text-[15px]">{mockSession?.name}</Text>
      </TouchableOpacity>

      {/* Menú de Popovers */}
      <View className="space-y-1">
        <SidebarPopover
          icon={<Users size={24} color={colors.primary} />}
          label="Seguidos"
          items={suggestions.following.map(f => ({ id: f.id, name: f.name, image: f.avatar, path: `/chat/friend/${f.id}` }))}
          viewAllPath="/friends"
        />

        <SidebarPopover
          icon={<Bookmark size={24} color={colors.primary} />}
          label="Guardado"
          items={[]}
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
          items={suggestions.channels.map(c => ({ id: c.id, name: c.name, subtitle: c.description, path: `/canales/${c.id}` }))}
          viewAllPath="/canales"
        />
        <SidebarPopover
          icon={<Wallet size={24} color={colors.primary} />}
          label="Billeteras"
          items={[
            { id: '1', name: 'Taquilla Principal', subtitle: 'La Imaginaria', path: '/(dashboard)/taquilla' }
          ]}
          viewAllPath="/wallet"
        />
        <SidebarPopover
          icon={<Gamepad2 size={24} color={colors.primary} />}
          label="Juegos"
          items={[]}
        />
      </View>
    </ScrollView>
  );
}
