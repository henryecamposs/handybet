import { View, Text, TouchableOpacity, Image, TextInput, Platform, ScrollView } from 'react-native';
import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { Search, MessageCircle, Bell, Sun, Moon, Home, Megaphone, Bookmark, Gamepad2, LogOut, HelpCircle, ShieldAlert, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useBrandColors, useTextColors, withOpacity } from '../../hooks/useThemeColors';
import Logo from '../ui/Logo';
import FloatingPopup from '../ui/FloatingPopup';
import SupportModal from '../modals/SupportModal';
import PrivacySecurityModal from '../modals/PrivacySecurityModal';

const POPUP_CHATS = [
  { id: '1', name: 'Soporte HandyBet', msg: 'Su recarga por Pago Móvil...', unread: true, avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=imaginaria&backgroundColor=b6e3f4' },
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
  const brandColors = useBrandColors();
  const textColors = useTextColors();

  const [showChatPopup, setShowChatPopup] = useState(false);
  const [showNotifPopup, setShowNotifPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const chatAnchorRef = useRef<View>(null);
  const notifAnchorRef = useRef<View>(null);
  const profileAnchorRef = useRef<View>(null);

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
    <View className="h-16 bg-background border-b border-white/10 flex-row items-center justify-between px-6 z-50 shadow-xl">
      {/* Izquierda: Logo y Buscador */}
      <View className="flex-row items-center pr-4">
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/feed')}
          activeOpacity={0.8}
          className="cursor-pointer"
        >
          <Logo size="sm" layout="horizontal" style={{ marginRight: 16 }} />
        </TouchableOpacity>
        <View className="bg-black/30 rounded-full flex-row items-center px-4 h-10 flex-1 max-w-[280px] border border-white/10 focus:border-primary">
          <Search size={16} color={brandColors.primary} className="mr-2" />
          <TextInput
            placeholder="Buscar en HandyBet..."
            placeholderTextColor={withOpacity(textColors.foreground, 0.3)}
            className="text-white text-[13px] flex-1 outline-none font-medium"
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
              brandColors={brandColors}
              textColors={textColors}
            />
          );
        })}
      </View>

      {/* Derecha: Acciones y Perfil */}
      <View className="flex-row items-center justify-end w-[25%] gap-3">
        <HeaderAction
          icon={colorScheme === 'dark' ? Moon : Sun}
          onPress={handleToggleTheme}
          brandColors={brandColors}
          textColors={textColors}
        />
        <View ref={chatAnchorRef}>
          <HeaderAction
            icon={MessageCircle}
            brandColors={brandColors}
            textColors={textColors}
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
          <View className="bg-card/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <View className="flex-row items-center p-3 border-b border-white/10 gap-2 bg-black/20">
              <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-8 h-8 rounded-full border border-white/20" />
              <Text className="text-foreground font-bold text-sm flex-1">Mensajes</Text>
              <TouchableOpacity onPress={() => { setShowChatPopup(false); router.push('/(tabs)/chat'); }}>
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Ver Todos</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-64">
              {POPUP_CHATS.map(chat => (
                <TouchableOpacity key={chat.id} className="p-3 border-b border-white/5 flex-row items-center gap-3 bg-card/20 hover:bg-white/5" onPress={() => { setShowChatPopup(false); router.push(`/chat/${chat.id}` as any); }}>
                  <Image source={{ uri: chat.avatar }} className="w-10 h-10 rounded-full border border-white/15" />
                  <View className="flex-1">
                    <Text className={`text-sm ${chat.unread ? 'text-foreground font-bold' : 'text-muted-foreground font-normal'}`}>{chat.name}</Text>
                    <Text className={`text-xs mt-0.5 ${chat.unread ? 'text-foreground font-semibold' : 'text-muted-foreground font-normal'}`} numberOfLines={1}>{chat.msg}</Text>
                  </View>
                  {chat.unread && (
                    <View className="w-2.5 h-2.5 rounded-full bg-secondary shadow-lg shadow-secondary/50" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </FloatingPopup>

        <View ref={notifAnchorRef}>
          <HeaderAction
            icon={Bell}
            brandColors={brandColors}
            textColors={textColors}
            onPress={() => setShowNotifPopup(!showNotifPopup)}
          >
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full items-center justify-center shadow-md shadow-primary/30">
              <Text className="text-[9px] font-extrabold text-background">2</Text>
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
          <View className="bg-card/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <View className="flex-row items-center p-3 border-b border-white/10 gap-2 bg-black/20">
              <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-8 h-8 rounded-full border border-white/20" />
              <Text className="text-foreground font-bold text-sm flex-1">Notificaciones</Text>
              <TouchableOpacity onPress={() => { setShowNotifPopup(false); router.push('/(tabs)/notifications'); }}>
                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Ver Todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-64">
              {POPUP_NOTIFS.map(notif => (
                <TouchableOpacity key={notif.id} className="p-3 border-b border-white/5 flex-row items-start gap-3 bg-card/20 hover:bg-white/5" onPress={() => setShowNotifPopup(false)}>
                  <View className="mt-1.5 w-2 h-2 rounded-full bg-secondary shadow-lg shadow-secondary/50 opacity-0" style={{ opacity: notif.unread ? 1 : 0 }} />
                  <View className="flex-1">
                    <Text className={`text-sm ${notif.unread ? 'text-foreground font-semibold' : 'text-muted-foreground font-normal'}`}>{notif.text}</Text>
                    <Text className="text-muted-foreground text-[10px] mt-1 font-semibold">{notif.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </FloatingPopup>
        <View ref={profileAnchorRef}>
          <TouchableOpacity
            onPress={() => setShowProfilePopup(!showProfilePopup)}
            className="ml-2 flex-row items-center bg-white/5 hover:bg-white/10 p-1.5 rounded-full border border-white/10 transition-colors pr-3"
          >
            <Image
              source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }}
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <Text className="ml-2 font-bold text-foreground text-xs">{mockSession?.name?.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Popover Popup */}
        <FloatingPopup
          isVisible={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
          anchorRef={profileAnchorRef as React.RefObject<View>}
          location="bottom"
          size="sm"
        >
          <View className="bg-card/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
            <View className="p-4 border-b border-white/10 flex-row items-center gap-3 bg-black/20">
              <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-10 h-10 rounded-full border border-primary/40" />
              <View className="flex-1">
                <Text className="text-foreground font-bold text-sm">{mockSession?.name || 'Usuario'}</Text>
                <Text className="text-primary font-bold text-xs">@{mockSession?.name?.toLowerCase().replace(' ', '_') || 'usuario'}</Text>
              </View>
            </View>

            <View className="p-2 gap-1 bg-card/40">
              <TouchableOpacity
                onPress={() => { setShowProfilePopup(false); router.push('/(tabs)/profile'); }}
                className="flex-row items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <User size={15} color={brandColors.primary} />
                <Text className="text-foreground font-bold text-xs">Ver Mi Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setShowProfilePopup(false); setShowSupportModal(true); }}
                className="flex-row items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <HelpCircle size={15} color={brandColors.primary} />
                <Text className="text-foreground font-bold text-xs">Soporte HandyBet</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => { setShowProfilePopup(false); setShowPrivacyModal(true); }}
                className="flex-row items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
              >
                <ShieldAlert size={15} color={brandColors.primary} />
                <Text className="text-foreground font-bold text-xs">Privacidad & Seguridad</Text>
              </TouchableOpacity>

              <View className="h-px bg-white/10 my-1.5" />

              <TouchableOpacity
                onPress={() => { setShowProfilePopup(false); useHandyBetStore.getState().setMockSession(null); }}
                className="flex-row items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors"
              >
                <LogOut size={15} color={brandColors.destructive} />
                <Text className="text-destructive font-bold text-xs">Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </FloatingPopup>
        {/* Modales de Soporte y Privacidad */}
        <SupportModal
          visible={showSupportModal}
          onClose={() => setShowSupportModal(false)}
        />
        <PrivacySecurityModal
          visible={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />
      </View>
    </View>
  );
}

function HeaderTab({ item, isActive, onPress, brandColors, textColors }: { item: any, isActive: boolean, onPress: () => void, brandColors: any, textColors: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = item.icon;

  const iconColor = isActive ? brandColors.primary : (isHovered ? brandColors.secondary : textColors.mutedForeground);

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`px-10 h-full items-center justify-center border-b-[3px] transition-all duration-200 ${isActive ? 'border-primary' : (isHovered ? 'border-secondary bg-white/5' : 'border-transparent hover:bg-white/5')}`}
    >
      <IconComponent size={22} color={iconColor} />
    </TouchableOpacity>
  );
}

const HeaderAction = React.forwardRef(({ icon: Icon, onPress, brandColors, textColors, children }: { icon: any, onPress?: () => void, brandColors: any, textColors: any, children?: React.ReactNode }, ref: any) => {
  const [isHovered, setIsHovered] = useState(false);

  const iconColor = isHovered ? brandColors.primary : textColors.mutedForeground;

  return (
    <TouchableOpacity
      ref={ref}
      onPress={onPress}
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`w-9 h-9 rounded-full items-center justify-center transition-all ${isHovered ? 'bg-white/10 border border-white/20' : 'bg-white/5'}`}
    >
      <Icon size={16} color={iconColor} />
      {children}
    </TouchableOpacity>
  );
});
HeaderAction.displayName = 'HeaderAction';
