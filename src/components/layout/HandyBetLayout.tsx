import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';
import { handyBetGroups, handyBetChannels, handyBetUsers } from '../../mockdata/handyBetMock';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import Logo from '../ui/Logo';
import { Home, Tv, Users, Gamepad2, Search, MessageCircle, Bell, Clock, Bookmark, Wallet, ChevronDown, Trophy } from 'lucide-react-native';
import SidebarPopover from './SidebarPopover';

interface HandyBetLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function HandyBetLayout({ children, title }: HandyBetLayoutProps) {
  const { isDesktop } = useDevicePlatform();
  const router = useRouter();
  const pathname = usePathname();
  const { mockSession } = useHandyBetStore();

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
    return <View className="flex-1 bg-zinc-950">{children}</View>;
  }

  return (
    <View className="flex-1 bg-zinc-950 text-zinc-100 flex-col">
      {/* HEADER TOP NAVBAR */}
      <View className="h-16 bg-zinc-900 border-b border-zinc-800 flex-row items-center justify-between px-4 z-50 shadow-sm">
        {/* Izquierda: Logo y Buscador */}
        <View className="flex-row items-center pr-4">
          <Logo size="sm" layout="horizontal" style={{ marginRight: 16 }} />
          <View className="bg-zinc-800/80 rounded-full flex-row items-center px-4 h-10 flex-1 max-w-[280px] border border-zinc-700/50">
            <Search size={18} color="#a1a1aa" className="mr-2" />
            <TextInput
              placeholder="Buscar en HandyBet..."
              placeholderTextColor="#a1a1aa"
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
                className={`px-10 h-full items-center justify-center border-b-[3px] ${isActive ? 'border-primary' : 'border-transparent hover:bg-zinc-800/50 rounded-lg mx-1 my-1 h-12'
                  }`}
              >
                <IconComponent size={28} color={isActive ? '#FF7700' : '#a1a1aa'} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Derecha: Acciones y Perfil */}
        <View className="flex-row items-center justify-end w-[20%] gap-3">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-zinc-800/80 items-center justify-center hover:bg-zinc-700 transition-colors border border-zinc-700/50">
            <MessageCircle size={20} color="#d4d4d8" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-zinc-800/80 items-center justify-center hover:bg-zinc-700 transition-colors border border-zinc-700/50 relative">
            <Bell size={20} color="#d4d4d8" />
            <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-zinc-900 items-center justify-center">
              <Text className="text-[9px] font-black text-black">2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="ml-2 flex-row items-center hover:bg-zinc-800/50 p-1 rounded-full transition-colors border border-transparent hover:border-zinc-700/50 pr-3">
            <Image
              source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }}
              className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-600"
            />
            <Text className="ml-2 font-semibold text-zinc-200 text-[14px]">{mockSession?.name?.split(' ')[0]}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY DE 3 COLUMNAS */}
      <View className="flex-1 flex-row w-full max-w-[1600px] mx-auto relative bg-zinc-950">

        {/* 1. SIDEBAR IZQUIERDO (20%) */}
        <ScrollView className="w-[20%] p-4" showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} className="flex-row items-center p-2 rounded-xl hover:bg-zinc-800/50 mb-2">
            <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-9 h-9 rounded-full" />
            <Text className="font-semibold text-zinc-100 ml-3 text-[15px]">{mockSession?.name}</Text>
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
            <TouchableOpacity className="flex-row items-center p-2 rounded-xl hover:bg-zinc-800/50 mt-1 transition-colors group">
              <View className="w-9 h-9 rounded-full bg-zinc-800 items-center justify-center group-hover:bg-zinc-700 transition-colors border border-zinc-700/50">
                <ChevronDown size={16} color="#a1a1aa" />
              </View>
              <Text className="font-medium text-zinc-300 ml-3 text-[15px]">Ver más</Text>
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
        <ScrollView className="w-[20%] p-4" showsVerticalScrollIndicator={false}>

          {/* Contenedor 1: Publicidad */}
          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-zinc-400 mb-3 px-2">Publicidad</Text>
            <View className="bg-transparent space-y-2">
              <AdWidget
                image="https://placehold.co/300x300/222/555?text=Musica+AI"
                title="Creación de Música Programática"
                domain="elevenlabs.io"
              />
              <AdWidget
                image="https://placehold.co/300x300/222/555?text=10+Free+Credits"
                title="Try it with 10 free credits!"
                domain="moises.ai"
              />
            </View>
          </View>

          <View className="h-[1px] bg-zinc-800 my-4 mx-2" />

          {/* Contenedor 2: Noticias */}
          <View className="mb-4">
            <Text className="text-[17px] font-semibold text-zinc-400 mb-3 px-2">Noticias Destacadas</Text>
            <View className="bg-transparent px-2">
              <Text className="text-zinc-100 font-medium text-[15px] mb-1">Nueva Taquilla Activa en Chacao</Text>
              <Text className="text-zinc-500 text-[13px] mb-3">Hace 2 horas</Text>

              <Text className="text-zinc-100 font-medium text-[15px] mb-1">¡Joselin lanza su canal VIP!</Text>
              <Text className="text-zinc-500 text-[13px]">Hace 5 horas</Text>
            </View>
          </View>

          <View className="h-[1px] bg-zinc-800 my-4 mx-2" />

          {/* Contenedor 3: Solicitudes de Amistad */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-3 px-2">
              <Text className="text-[17px] font-semibold text-zinc-400">Solicitudes de amistad</Text>
              <TouchableOpacity><Text className="text-primary text-sm hover:underline">Ver todo</Text></TouchableOpacity>
            </View>
            <View className="space-y-2">
              {suggestions.friends.map(friend => (
                <View key={friend.id} className="flex-row items-center p-2 hover:bg-zinc-800/30 rounded-xl">
                  <Image source={{ uri: friend.avatar }} className="w-16 h-16 rounded-full mr-3" />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="font-semibold text-zinc-100 text-[15px]">{friend.name}</Text>
                      <Text className="text-zinc-500 text-[13px]">2 d</Text>
                    </View>
                    <Text className="text-zinc-400 text-[13px] mb-2">12 amigos en común</Text>
                    <View className="flex-row gap-2">
                      <TouchableOpacity className="flex-1 bg-primary py-1.5 rounded-lg items-center">
                        <Text className="text-black font-bold text-[15px]">Confirmar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-zinc-800 py-1.5 rounded-lg items-center">
                        <Text className="text-zinc-200 font-bold text-[15px]">Eliminar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className="h-[1px] bg-zinc-800 my-4 mx-2" />

          {/* Contenedor 4: Notificador de Premios */}
          <View className="mb-6">
            <Text className="text-[17px] font-semibold text-zinc-400 mb-3 px-2">Premios Ganados</Text>
            <View className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex-row items-center gap-4 mx-2 shadow-sm">
              <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center">
                <Trophy size={24} color="#00C800" />
              </View>
              <View className="flex-1">
                <Text className="text-zinc-100 font-bold text-sm">¡Ganador en Taquillas Caracas!</Text>
                <Text className="text-secondary text-xs font-semibold mt-1">Has ganado 450 VES en el sorteo 11:00 AM. Revisa tu Wallet.</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

// El SidebarItem original ya no es necesario, lo removemos.

const AdWidget = ({ image, title, domain }: { image: string, title: string, domain: string }) => (
  <TouchableOpacity className="flex-row items-center hover:bg-zinc-800/50 p-2 rounded-xl transition-colors">
    <Image source={{ uri: image }} className="w-32 h-32 rounded-lg" resizeMode="cover" />
    <View className="flex-1 ml-3">
      <Text className="text-zinc-100 font-semibold text-[15px] leading-tight" numberOfLines={2}>{title}</Text>
      <Text className="text-zinc-500 text-[13px] mt-1">{domain}</Text>
    </View>
  </TouchableOpacity>
);
