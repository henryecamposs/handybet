import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';
import { handyBetGroups, handyBetChannels, handyBetUsers } from '../../mockdata/handyBetMock';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import Logo from '../ui/Logo';
import { Home, Tv, Users, Gamepad2, Search, MessageCircle, Bell, Clock, Bookmark, Wallet, ChevronDown, Trophy, Sun, Moon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import SidebarPopover from './SidebarPopover';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';
import RightSidebarWidgets from '../widgets/RightSidebarWidgets';

interface HandyBetLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function HandyBetLayout({ children, title }: HandyBetLayoutProps) {
  const { isDesktop } = useDevicePlatform();
  const router = useRouter();
  const pathname = usePathname();
  const { mockSession } = useHandyBetStore();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const colors = useThemeColors();
  const handleToggleTheme = () => {
    try {
      toggleColorScheme();
    } catch (e) {
      alert("⚠️ El cambio de temas requiere un reinicio. Por favor detén el servidor web y vuelve a ejecutar 'npm run web'.");
    }
  };

  const navigationItems = [
    { label: 'Inicio', path: '/(tabs)/feed', icon: Home }, // Casa estilo facebook
    { label: 'Canales', path: '/(tabs)/canales', icon: Tv },
    { label: 'Grupos', path: '/(tabs)/grupos', icon: Users },
    { label: 'Juegos', path: '/(tabs)/juegos', icon: Gamepad2 },
  ];

  const suggestions = {
    groups: handyBetGroups.map(g => ({ id: g.id, name: g.name, type: g.type, members: g.members.length * 123 })),
    channels: handyBetChannels.map(c => ({ id: c.id, name: c.name, description: c.description })),
    friends: handyBetUsers.filter(u => u.id !== 'usr_admin')
  };

  if (!isDesktop) {
    return <View className="flex-1 bg-background">{children}</View>;
  }

  return (
    <View className="flex-1 bg-background text-foreground flex-col">
      {/* HEADER TOP NAVBAR */}
      <View className="h-16 bg-background border-b border-zinc-800 flex-row items-center justify-between px-4 z-50 shadow-sm">
        {/* Izquierda: Logo y Buscador */}
        <View className="flex-row items-center pr-4">
          <Logo size="sm" layout="horizontal" style={{ marginRight: 16 }} />
          <View className="bg-primary/5 rounded-full flex-row items-center px-4 h-10 flex-1 max-w-[280px] border border-zinc-700/50">
            <Search size={18} color="#a1a1aa" className="mr-2" />
            <TextInput
              placeholder="Buscar en HandyBet..."
              placeholderTextColor={withOpacity(colors.foreground, 0.2)}
              className="text-white text-[14px] flex-1 outline-none"
            />
          </View>
        </View>

        {/* Centro: Menú principal (Tabs superiores) */}
        <View className="flex-row items-center justify-center  h-full gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            const IconComponent = item.icon;
            return (
              <TouchableOpacity
                key={item.path}
                onPress={() => router.push(item.path as any)}
                className={`px-10 h-full items-center justify-center border-b-[3px] ${isActive ? 'border-primary' : 'border-transparent hover:bg-background/80/50 rounded-lg mx-1 my-1 h-12'
                  }`}
              >
                <IconComponent size={28} color={isActive ? '#FF7700' : '#a1a1aa'} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Derecha: Acciones y Perfil */}
        <View className="flex-row items-center justify-end w-[25%] gap-3">
          <TouchableOpacity
            onPress={handleToggleTheme}
            className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background transition-colors border border-zinc-700/50"
          >
            {colorScheme === 'dark' ? <Moon size={20} color="#d4d4d8" /> : <Sun size={20} color="#52525b" />}
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background transition-colors border border-zinc-700/50">
            <MessageCircle size={20} color="#d4d4d8" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background transition-colors border border-zinc-700/50 relative">
            <Bell size={20} color="#d4d4d8" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-zinc-900 items-center justify-center">
              <Text className="text-[9px] font-black text-black">2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="ml-2 flex-row items-center hover:bg-background/80/50 p-1 rounded-full transition-colors border border-transparent hover:border-zinc-700/50 pr-3">
            <Image
              source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }}
              className="w-9 h-9 rounded-full bg-background/80 border border-zinc-600"
            />
            <Text className="ml-2 font-semibold text-foreground text-[14px]">{mockSession?.name?.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY DE 3 COLUMNAS */}
      <View className="flex-1 flex-row w-full max-w-[1600px] mx-auto relative bg-background">

        {/* 1. SIDEBAR IZQUIERDO (20%) */}
        <ScrollView className="w-[20%] p-4 bg-primary/5" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center p-2 rounded-xl hover:bg-background/80/50 mb-2">
            <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-9 h-9 rounded-full" />
            <Text className="font-semibold text-foreground ml-3 text-[15px]">{mockSession?.name}</Text>
          </TouchableOpacity>

          <View className="space-y-1">
            <SidebarPopover
              icon={<Users size={24} color="#d4d4d8" />}
              label="Amigos"
              items={suggestions.friends.map(f => ({ id: f.id, name: f.name, image: f.avatar, path: `/chat/friend/${f.id}` }))}
              viewAllPath="/friends"
            />

            <SidebarPopover
              icon={<Bookmark size={24} color="#d4d4d8" />}
              label="Guardado"
              items={[]}
            />
            <SidebarPopover
              icon={<Users size={24} color="#d4d4d8" />}
              label="Grupos"
              items={suggestions.groups.map(g => ({ id: g.id, name: g.name, subtitle: `${g.members} miembros`, path: `/chat/group/${g.id}` }))}
              viewAllPath="/grupos"
            />
            <SidebarPopover
              icon={<Tv size={24} color="#d4d4d8" />}
              label="Canales"
              items={suggestions.channels.map(c => ({ id: c.id, name: c.name, subtitle: c.description, path: `/canales/${c.id}` }))}
              viewAllPath="/canales"
            />
            <SidebarPopover
              icon={<Wallet size={24} color="#d4d4d8" />}
              label="Billeteras"
              items={[
                { id: '1', name: 'Taquilla Principal', subtitle: 'La Imaginaria', path: '/(dashboard)/taquilla' }
              ]}
              viewAllPath="/wallet"
            />
            <SidebarPopover
              icon={<Gamepad2 size={24} color="#d4d4d8" />}
              label="Juegos"
              items={[]}
            />
            <TouchableOpacity className="flex-row items-center p-2 rounded-xl hover:bg-background/80/50 mt-1 transition-colors group">
              <View className="w-9 h-9 rounded-full bg-background/80 items-center justify-center group-hover:bg-background transition-colors border border-zinc-700/50">
                <ChevronDown size={16} color="#a1a1aa" />
              </View>
              <Text className="font-medium text-foreground ml-3 text-[15px]">Ver más</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* 2. ÁREA CENTRAL (FEED) (60%) */}
        <View className="w-[60%] flex-col relative z-0">
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 64 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>

        {/* 3. SIDEBAR DERECHO (WIDGETS - Contenedores) (20%) */}
        <RightSidebarWidgets />
      </View>
    </View>
  );
}
