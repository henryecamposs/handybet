import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabaseClient';
import { Advertisement } from '../../../types/handyBet';

export default function ChatInboxScreen() {
  const router = useRouter();
  const [adBanner, setAdBanner] = useState<Advertisement | null>(null);
  const [isLoadingAd, setIsLoadingAd] = useState(true);



  async function fetchBannerAd() {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();

      if (!error && data) {
        setAdBanner(data as Advertisement);
      }
    } catch (err) {
      console.log('Error fetching ad banner for chat:', err);
    } finally {
      setIsLoadingAd(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBannerAd();
  }, []);

  const sampleChats = [
    {
      id: 'chat-1',
      name: 'Soporte La Imaginaria',
      avatar: 'https://placehold.co/100',
      lastMessage: 'Su recarga por Pago Móvil de 150 Bs. ha sido procesada con éxito.',
      time: '11:45 AM',
      unreadCount: 1,
    },
    {
      id: 'chat-2',
      name: 'Pronosticador Oficial',
      avatar: 'https://placehold.co/100',
      lastMessage: 'Revisa los triples calientes cargados en la bóveda multimedia.',
      time: 'Ayer',
      unreadCount: 0,
    }
  ];

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12">
      <View className="mb-6">
        <Text className="text-2xl font-black text-white tracking-tight">Chats Privados</Text>
        <Text className="text-foreground text-xs font-bold mt-1">Mensajería directa P2P con soporte y agencias.</Text>
      </View>

      {/* Inbox List */}
      <View className="mb-6">
        {sampleChats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() => router.push(`/chat/${chat.id}` as any)}
            className="bg-background/90 border border-zinc-850 p-4 rounded-3xl flex-row items-center gap-4 mb-3.5 shadow-sm"
          >
            <Image source={{ uri: chat.avatar }} className="w-12 h-12 rounded-full border border-zinc-700" />
            <View className="flex-1">
              <View className="flex-row justify-between items-center">
                <Text className="text-white font-black text-sm">{chat.name}</Text>
                <Text className="text-foreground text-[10px] font-bold">{chat.time}</Text>
              </View>
              <Text className="text-foreground text-xs font-bold mt-1 line-clamp-1" numberOfLines={1}>
                {chat.lastMessage}
              </Text>
            </View>
            {chat.unreadCount > 0 && (
              <View className="bg-secondary w-5 h-5 rounded-full items-center justify-center border border-secondary">
                <Text className="text-foreground text-[9px] font-black">{chat.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Inyección de AdBannerRow en el chat */}
      {!isLoadingAd && adBanner && (
        <View className="bg-background border border-zinc-850 p-4 rounded-3xl shadow-sm mb-6 flex-row gap-4 items-center">
          <Image source={{ uri: adBanner.media_url }} className="w-12 h-12 rounded-2xl border border-zinc-850" />
          <View className="flex-1">
            <Text className="text-secondary text-[9px] font-black uppercase tracking-wider">Publicidad de Interés</Text>
            <Text className="text-white font-black text-xs mt-0.5">{adBanner.business_name}</Text>
            <Text className="text-foreground text-[10px] font-bold mt-0.5" numberOfLines={1}>
              {adBanner.ad_copy}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => adBanner.target_deeplink && router.push(adBanner.target_deeplink as any)}
            className="bg-background/80 border border-zinc-700 px-3 py-1.5 rounded-xl"
          >
            <Text className="text-secondary text-[9px] font-black uppercase">Visitar</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoadingAd && (
        <ActivityIndicator size="small" color="#10b981" className="my-4" />
      )}

      <View className="h-16" />
    </ScrollView>
  );
}
