import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Search, MessageCircle, Bell, Sun, Moon, Home, Tv, Bookmark, Gamepad2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import Logo from '../ui/Logo';

export default function HandyBetHeader() {
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
    { label: 'Inicio', path: '/(tabs)/feed', match: '/feed', icon: Home },
    { label: 'Canales', path: '/(tabs)/channels', match: '/channels', icon: Tv },
    { label: 'Guardados', path: '/favorites', match: '/favorites', icon: Bookmark },
    { label: 'Juegos', path: '/(tabs)/games', match: '/games', icon: Gamepad2 },
  ];

  return (
    <View className="h-16 bg-background/80 border-b border-primary/20 flex-row items-center justify-between px-4 z-50 shadow-sm">
      {/* Izquierda: Logo y Buscador */}
      <View className="flex-row items-center pr-4">
        <Logo size="sm" layout="horizontal" style={{ marginRight: 16 }} />
        <View className="bg-primary/5 rounded-full flex-row items-center px-4 h-10 flex-1 max-w-[280px] border border-zinc-700/50">
          <Search size={18} color={colors.mutedForeground} className="mr-2" />
          <TextInput
            placeholder="Buscar en HandyBet..."
            placeholderTextColor={withOpacity(colors.foreground, 0.2)}
            className="text-white text-[14px] flex-1 outline-none"
          />
        </View>
      </View>

      {/* Centro: Menú principal (Tabs superiores) */}
      <View className="flex-row items-center justify-center h-full gap-2">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.match);
          const IconComponent = item.icon;
          return (
            <TouchableOpacity
              key={item.path}
              onPress={() => router.push(item.path as any)}
              className={`px-10 h-full items-center justify-center border-b-[3px] transition-colors ${isActive ? 'border-primary' : 'border-transparent hover:bg-background/50'}`}
            >
              <IconComponent size={28} color={isActive ? colors.primary : colors.mutedForeground} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Derecha: Acciones y Perfil */}
      <View className="flex-row items-center justify-end w-[25%] gap-3">
        <TouchableOpacity
          onPress={handleToggleTheme}
          className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background/80 transition-colors border border-zinc-700/50"
        >
          {colorScheme === 'dark' ? <Moon size={20} color="#d4d4d8" /> : <Sun size={20} color="#52525b" />}
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background/80 transition-colors border border-zinc-700/50">
          <MessageCircle size={20} color="#d4d4d8" />
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 rounded-full bg-background/80/80 items-center justify-center hover:bg-background/80 transition-colors border border-zinc-700/50 relative">
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
  );
}
