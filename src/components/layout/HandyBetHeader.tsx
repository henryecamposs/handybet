import { View, Text, TouchableOpacity, Image, TextInput, Platform, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Search, MessageCircle, Bell, Sun, Moon, Home, Megaphone, Bookmark, Gamepad2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import Logo from '../ui/Logo';
import FloatingPopup from '../ui/FloatingPopup';

const POPUP_CHATS = [
  { id: '1', name: 'Soporte La Imaginaria', msg: 'Su recarga por Pago Móvil...', unread: true, avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=imaginaria&backgroundColor=b6e3f4' },
  { id: '2', name: 'Joselin La Gata VIP', msg: '🔥 ¡Chicos, ya están disponibles...', unread: true, avatar: 'https://i.pravatar.cc/150?u=joselin' },
  { id: '3', name: 'Pronosticador Oficial', msg: 'Revisa los triples calientes...', unread: false, avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=pronosticos&backgroundColor=caee26' },
];

const POPUP_NOTIFS = [
  { id: '1', text: 'Diego Pérez comenzó a seguirte.', unread: true, time: 'Hace 5 min' },
  { id: '2', text: 'La Imaginaria Anuncios publicó una actualización.', unread: true, time: 'Hace 1 hora' },
  { id: '3', text: 'Carlos Gómez le dio me gusta a tu post.', unread: false, time: 'Hace 3 horas' },
];

export default function HandyBetHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { mockSession } = useHandyBetStore();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const colors = useThemeColors();

  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const chatAnchorRef = useRef<View>(null);
  const notifAnchorRef = useRef<View>(null);

  const handleToggleTheme = () => {
    try {
      toggleColorScheme();
    } catch (e) {
      alert("⚠️ El cambio de temas requiere un reinicio. Por favor detén el servidor web y vuelve a ejecutar 'npm run web'.");
    }
  };

  const navigationItems = [
    { label: 'Inicio', path: '/(tabs)/feed', match: '/feed', icon: Home },
    { label: 'Canales', path: '/(tabs)/channels', match: '/channels', icon: Megaphone },
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
        <View ref={chatAnchorRef}>
          <HeaderAction
            icon={MessageCircle}
            colors={colors}
            onPress={() => setShowChatPopup(!showChatPopup)}
          />
        </View>

        <FloatingPopup
          isVisible={showChatPopup}
          onClose={() => setShowChatPopup(false)}
          anchorRef={chatAnchorRef as React.RefObject<View>}
          location="bottom"
          size="md"
        >
          <View className="flex-row items-center p-3 border-b border-border gap-2">
            <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-8 h-8 rounded-full border border-border" />
            <Text className="text-foreground font-black text-sm flex-1">Mensajes</Text>
            <TouchableOpacity onPress={() => { setShowChatPopup(false); router.push('/(tabs)/chat'); }}>
              <Text className="text-primary font-black text-xs uppercase">Ver Todos</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-64">
            {POPUP_CHATS.map(chat => (
              <TouchableOpacity key={chat.id} className="p-3 border-b border-border flex-row items-center gap-3 bg-background/80 hover:bg-muted" onPress={() => { setShowChatPopup(false); router.push(`/chat/${chat.id}` as any); }}>
                <Image source={{ uri: chat.avatar }} className="w-10 h-10 rounded-full border border-border" />
                <View className="flex-1">
                  <Text className={`text-sm ${chat.unread ? 'text-foreground font-black' : 'text-muted-foreground font-normal'}`}>{chat.name}</Text>
                  <Text className={`text-xs mt-0.5 ${chat.unread ? 'text-foreground font-bold' : 'text-muted-foreground font-normal'}`} numberOfLines={1}>{chat.msg}</Text>
                </View>
                {chat.unread && (
                  <View className="w-2 h-2 rounded-full bg-secondary" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FloatingPopup>

        <View ref={notifAnchorRef}>
          <HeaderAction
            icon={Bell}
            colors={colors}
            onPress={() => setShowNotifPopup(!showNotifPopup)}
          >
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-border items-center justify-center">
              <Text className="text-[9px] font-black text-black">2</Text>
            </View>
          </HeaderAction>
        </View>

        <FloatingPopup
          isVisible={showNotifPopup}
          onClose={() => setShowNotifPopup(false)}
          anchorRef={notifAnchorRef as React.RefObject<View>}
          location="bottom"
          size="md"
        >
          <View className="flex-row items-center p-3 border-b border-border gap-2">
            <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-8 h-8 rounded-full border border-border" />
            <Text className="text-foreground font-black text-sm flex-1">Notificaciones</Text>
            <TouchableOpacity onPress={() => { setShowNotifPopup(false); router.push('/(tabs)/notifications'); }}>
              <Text className="text-primary font-black text-xs uppercase">Ver Todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="max-h-64">
            {POPUP_NOTIFS.map(notif => (
              <TouchableOpacity key={notif.id} className="p-3 border-b border-border flex-row items-start gap-3 bg-background/80 hover:bg-muted" onPress={() => setShowNotifPopup(false)}>
                <View className="mt-1 w-2 h-2 rounded-full bg-secondary opacity-0" style={{ opacity: notif.unread ? 1 : 0 }} />
                <View className="flex-1">
                  <Text className={`text-sm ${notif.unread ? 'text-foreground font-black' : 'text-muted-foreground font-normal'}`}>{notif.text}</Text>
                  <Text className="text-muted-foreground text-[10px] mt-1 font-bold">{notif.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </FloatingPopup>
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
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`px-10 h-full items-center justify-center border-b-[3px] transition-colors ${isActive ? 'border-primary' : (isHovered ? 'border-secondary bg-background/50' : 'border-transparent hover:bg-background/50')}`}
    >
      <IconComponent size={28} color={iconColor} />
    </TouchableOpacity>
  );
}

const HeaderAction = React.forwardRef(({ icon: Icon, onPress, colors, children }: { icon: any, onPress?: () => void, colors: any, children?: React.ReactNode }, ref: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconColor = isHovered ? colors.secondary : colors.mutedForeground;

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`w-10 h-10 rounded-full items-center justify-center transition-colors ${isHovered ? 'bg-muted border border-secondary' : 'bg-background'}`}
    >
      <Icon size={20} color={iconColor} />
      {children}
    </TouchableOpacity>
  );
});
HeaderAction.displayName = 'HeaderAction';
