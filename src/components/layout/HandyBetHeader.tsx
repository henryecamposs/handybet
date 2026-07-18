import { View, Text, TouchableOpacity, Image, TextInput, Platform } from 'react-native';
import React, { useState } from 'react';
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
    <View className="h-16 bg-background border-b border-border flex-row items-center justify-between px-4 z-50 shadow-sm">
      {/* Izquierda: Logo y Buscador */}
      <View className="flex-row items-center pr-4">
        <Logo size="sm" layout="horizontal" style={{ marginRight: 16 }} />
        <View className="bg-input rounded-full flex-row items-center px-4 h-10 flex-1 max-w-[280px] border border-border-muted">
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
          return (
            <HeaderTab
              key={item.path}
              item={item}
              isActive={isActive}
              onPress={() => router.push(item.path as any)}
              colors={colors}
            />
          );
        })}
      </View>

      {/* Derecha: Acciones y Perfil */}
      <View className="flex-row items-center justify-end w-[25%] gap-3">
        <HeaderAction
          icon={colorScheme === 'dark' ? Moon : Sun}
          onPress={handleToggleTheme}
          colors={colors}
        />
        <HeaderAction
          icon={MessageCircle}
          colors={colors}
        />
        <HeaderAction
          icon={Bell}
          colors={colors}
        >
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-border items-center justify-center">
            <Text className="text-[9px] font-black text-black">2</Text>
          </View>
        </HeaderAction>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="ml-2 flex-row items-center hover:bg-background/80/50 p-1 rounded-full transition-colors border border-transparent hover:border-border/50 pr-3">
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

function HeaderTab({ item, isActive, onPress, colors }: { item: any, isActive: boolean, onPress: () => void, colors: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = item.icon;

  const iconColor = isActive ? colors.primary : (isHovered ? colors.secondary : colors.mutedForeground);

  return (
    <TouchableOpacity
      onPress={onPress}
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`px-10 h-full items-center justify-center border-b-[3px] transition-colors ${isActive ? 'border-primary' : (isHovered ? 'border-secondary bg-background/50' : 'border-transparent hover:bg-background/50')}`}
    >
      <IconComponent size={28} color={iconColor} />
    </TouchableOpacity>
  );
}

function HeaderAction({ icon: Icon, onPress, colors, children }: { icon: any, onPress?: () => void, colors: any, children?: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  const iconColor = isHovered ? colors.secondary : colors.mutedForeground;

  return (
    <TouchableOpacity
      onPress={onPress}
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`w-10 h-10 rounded-full items-center justify-center transition-colors ${isHovered ? 'bg-muted border border-secondary' : 'bg-background'}`}
    >
      <Icon size={20} color={iconColor} />
      {children}
    </TouchableOpacity>
  );
}
