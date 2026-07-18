import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { MessageSquare, Users, Volume2, AtSign, Heart, MessageCircle, Share2, LayoutList, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import { TabContainer } from '@/components/layout/hub';
import PostContainer from '@/components/layout/hub/PostContainer';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import { localDB } from '../../../lib/localDB';

const ACTIVE_USERS = [
  { id: 'usr_joselin', name: 'Joselin La Gata', avatar: 'https://i.pravatar.cc/150?u=joselin' },
  { id: 'usr_diego', name: 'Diego', avatar: 'https://i.pravatar.cc/150?u=diego' },
  { id: 'usr_carlos', name: 'Carlos', avatar: 'https://i.pravatar.cc/150?u=carlos' },
  { id: 'usr_maria', name: 'María', avatar: 'https://i.pravatar.cc/150?u=maria' },
  { id: 'usr_ana', name: 'Ana', avatar: 'https://i.pravatar.cc/150?u=ana' },
  { id: 'usr_roberto', name: 'Roberto', avatar: 'https://i.pravatar.cc/150?u=roberto' }
];

export default function ChatInboxScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const [activeTab, setActiveTab] = useState<'direct' | 'group' | 'channel' | 'mention'>('direct');

  const directChats = [
    {
      id: 'chat-1',
      name: 'Soporte La Imaginaria',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=imaginaria&backgroundColor=b6e3f4',
      lastMessage: 'Su recarga por Pago Móvil de 150 Bs. ha sido procesada con éxito.',
      time: '11:45 AM',
      unreadCount: 1,
      isActive: true
    },
    {
      id: 'chat-2',
      name: 'Pronosticador Oficial',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=pronosticos&backgroundColor=caee26',
      lastMessage: 'Revisa los triples calientes cargados en la bóveda multimedia.',
      time: 'Ayer',
      unreadCount: 0,
      isActive: false
    }
  ];

  const groupChats = [
    {
      id: 'grp_taquilla_ccs',
      name: 'Taquillas Caracas',
      avatar: 'https://picsum.photos/seed/taquillaccs/100',
      lastMessage: 'Diego: ¡Jueguen al 33-PESCADO para las 11:00 AM! 🐟',
      time: '10:30 AM',
      unreadCount: 3,
    },
    {
      id: 'grp_sorteos_vip',
      name: 'Quinielas & Sorteos VIP',
      avatar: 'https://picsum.photos/seed/quinielavip/100',
      lastMessage: 'Sistema: El pozo acumulado para el sorteo del Kino es de 25,000 Bs.',
      time: 'Ayer',
      unreadCount: 0,
    }
  ];

  const channelChats = [
    {
      id: 'ch_joselin',
      name: 'Joselin La Gata VIP 🐾',
      avatar: 'https://i.pravatar.cc/150?u=joselin',
      lastMessage: '🔥 ¡Chicos, ya están disponibles los nuevos videos exclusivos en mi canal Pro!',
      time: 'Hace 1 hora',
      unreadCount: 2,
    },
    {
      id: 'ch_imaginaria',
      name: 'La Imaginaria Anuncios 📢',
      avatar: 'https://api.dicebear.com/7.x/identicon/png?seed=imaginaria',
      lastMessage: '📢 ¡Activados los sorteos de Lotto Activo para esta mañana! Confecciona tu jugada...',
      time: 'Hace 2 horas',
      unreadCount: 0,
    }
  ];

  const mentionPosts = [
    {
      id: 'post_mention_1',
      author: 'Carlos Gómez',
      authorAvatar: 'https://i.pravatar.cc/150?u=carlos',
      content: '¡GANÉ con el triple 777! 🎰💰 Aposté 100 VES y me llevé 5,000 VES. ¡Gracias @admin por la plataforma de #HandyBet! Pedro me pagó al instante.',
      media: [{ type: 'image', uri: 'https://picsum.photos/seed/winner1/600/400' }],
      time: 'Hace 15 min',
      likes: 18,
      replies: 4
    },
    {
      id: 'post_mention_2',
      author: 'Henry Campos',
      authorAvatar: 'https://i.pravatar.cc/150?u=henry',
      content: '🚀 Actualización importante: #HandyBet ahora soporta recarga directa desde Binance P2P. Más rápido, más seguro. ¡Recarguen y jueguen! @admin #Binance',
      media: [{ type: 'image', uri: 'https://picsum.photos/seed/handybet_update/600/400' }],
      time: 'Hace 1 hora',
      likes: 24,
      replies: 7
    },
    {
      id: 'post_mention_3',
      author: 'Diego Pérez',
      authorAvatar: 'https://i.pravatar.cc/150?u=diego',
      content: '📢 ¡Activados los sorteos de Lotto Activo para esta mañana! Confecciona tu jugada desde el feed o deposita directo a tu wallet. El pescado 33 anda súper caliente 🔥🐟 #LottoActivo @admin',
      media: [],
      time: 'Hace 3 horas',
      likes: 8,
      replies: 2
    }
  ];

  const handleUserActivePress = (userId: string) => {
    if (userId === 'usr_joselin') {
      router.push('/chat/follow/usr_joselin');
    } else {
      router.push(`/profile/${userId}`);
    }
  };

  const tabs = [
    {
      id: 'direct',
      label: 'Directos',
      icon: <MessageSquare size={14} color={activeTab === 'direct' ? colors.primary : colors.foreground} />,
      content: (
        <View className="gap-0">
          {directChats.map((chat) => (
            <ListItem
              key={chat.id}
              avatar={chat.avatar}
              title={chat.name}
              subtitle={chat.lastMessage}
              hasBorderBottom={true}
              onPress={() => router.push(`/chat/${chat.id}` as any)}
              rightElement={
                <View className="items-end gap-1">
                  <Text className="text-muted-foreground text-[10px] font-bold">{chat.time}</Text>
                  {chat.unreadCount > 0 && (
                    <View className="bg-secondary w-5 h-5 rounded-full items-center justify-center border border-secondary">
                      <Text className="text-black text-[9px] font-black">{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              }
            />
          ))}
        </View>
      )
    },
    {
      id: 'channel',
      label: 'Canales',
      icon: <Volume2 size={14} color={activeTab === 'channel' ? colors.primary : colors.foreground} />,
      content: (
        <View className="gap-0 border border-border bg-background/50">
          {channelChats.map((chat) => (
            <ListItem
              key={chat.id}
              avatar={chat.avatar}
              title={chat.name}
              subtitle={chat.lastMessage}
              hasBorderBottom={true}
              onPress={() => router.push(`/channels/${chat.id}` as any)}
              rightElement={
                <View className="items-end gap-1">
                  <Text className="text-muted-foreground text-[10px] font-bold">{chat.time}</Text>
                  {chat.unreadCount > 0 && (
                    <View className="bg-secondary w-5 h-5 rounded-full items-center justify-center border border-secondary">
                      <Text className="text-black text-[9px] font-black">{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              }
            />
          ))}
        </View>
      )
    },
    {
      id: 'group',
      label: 'Grupos',
      icon: <Users size={14} color={activeTab === 'group' ? colors.primary : colors.foreground} />,
      content: (
        <View className="gap-0">
          {groupChats.map((chat) => (
            <ListItem
              key={chat.id}
              avatar={chat.avatar}
              title={chat.name}
              subtitle={chat.lastMessage}
              hasBorderBottom={true}
              onPress={() => router.push(`/chat/${chat.id}?fromType=group` as any)}
              rightElement={
                <View className="items-end gap-1">
                  <Text className="text-muted-foreground text-[10px] font-bold">{chat.time}</Text>
                  {chat.unreadCount > 0 && (
                    <View className="bg-secondary w-5 h-5 rounded-full items-center justify-center border border-secondary">
                      <Text className="text-black text-[9px] font-black">{chat.unreadCount}</Text>
                    </View>
                  )}
                </View>
              }
            />
          ))}
        </View>
      )
    },
    {
      id: 'mention',
      label: 'Menciones',
      icon: <AtSign size={14} color={activeTab === 'mention' ? colors.primary : colors.foreground} />,
      content: (
        <View>
          <PostContainer
            title=""
            posts={mentionPosts}
          />
        </View>
      )
    }
  ];

  return (
    <HubDetailLayout
      logoType="chat"
      backRoute="/"
      onBack={() => router.push('/')}
    >
      {/* 1. Usuarios Activos (Tag e Indicador) */}
      <View className="mb-6">
        <Text className="text-foreground font-black text-xs uppercase tracking-wider mb-3">Usuarios Activos</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row"
          contentContainerStyle={{ gap: 14 }}
        >
          {ACTIVE_USERS.map((user) => (
            <TouchableOpacity
              key={user.id}
              onPress={() => handleUserActivePress(user.id)}
              className="items-center"
              activeOpacity={0.8}
            >
              <View className="relative">
                <View className="p-0.5 rounded-full border-2 border-secondary bg-background">
                  <Image source={{ uri: user.avatar }} className="w-12 h-12 rounded-full bg-background" />
                </View>
                {/* Punto verde online */}
                <View className="absolute bottom-0 right-0 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-background items-center justify-center" />
              </View>
              <Text className="text-foreground text-[10px] font-bold mt-1 max-w-[60px] text-center" numberOfLines={1}>
                {user.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="mb-6 flex-1 h-full">
        <TabContainer tabs={tabs} defaultTabId="direct" />
      </View>
    </HubDetailLayout>
  );
}
