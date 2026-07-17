import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trophy, Ticket, Dice1, Gamepad2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';

export default function GamesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('taquillas');

  const tabs = [
    {
      id: 'taquillas',
      label: 'Taquillas',
      icon: <Ticket size={28} color={activeTab === 'taquillas' ? colors.primary : colors.mutedForeground} />
    },
    {
      id: 'quinielas',
      label: 'Quinielas',
      icon: <Dice1 size={28} color={activeTab === 'quinielas' ? colors.primary : colors.mutedForeground} />
    },
    {
      id: 'minijuegos',
      label: 'Minijuegos',
      icon: <Gamepad2 size={28} color={activeTab === 'minijuegos' ? colors.primary : colors.mutedForeground} />
    },
  ];

  const allDraws = [
    { id: 'd1', title: 'Animalitos VIP', sub: 'Cierra en 45 mins', emoji: '🎲', category: 'taquillas' },
    { id: 'd2', title: 'Carreras 5y6', sub: 'Mañana 2:00 PM', emoji: '🏇', category: 'taquillas' },
    { id: 'd3', title: 'Quiniela Champions', sub: 'Cierra en 2 horas', emoji: '⚽', category: 'quinielas' },
    { id: 'd4', title: 'Quiniela LaLiga', sub: 'Cierra en 1 día', emoji: '🏆', category: 'quinielas' },
    { id: 'd5', title: 'Flappy Bird Crypto', sub: 'Juega gratis', emoji: '🎮', category: 'minijuegos' },
  ];

  const filteredDraws = allDraws.filter(draw => draw.category === activeTab);

  const heroBanner = (
    <View className="bg-primary/20 rounded-2xl p-6 border border-primary/30 relative overflow-hidden">
      <View className="z-10">
        <View className="bg-primary px-3 py-1 rounded-full self-start mb-3">
          <Text className="text-black font-bold text-xs uppercase">Sorteo Activo</Text>
        </View>
        <Text className="text-primary font-black text-3xl mb-2">Gran Kino Imaginario</Text>
        <Text className="text-foreground font-medium mb-4">¡Gana hasta 5,000 Puntos hoy a las 8:00 PM!</Text>
        <TouchableOpacity
          onPress={() => router.push('/games/d1' as any)}
          className="bg-primary px-6 py-3 rounded-xs self-start"
        >
          <Text className="text-black font-bold">Jugar Ahora</Text>
        </TouchableOpacity>
      </View>
      <Trophy size={120} color="rgba(202, 238, 38, 0.2)" className="absolute right-4 bottom-4 z-0" />
    </View>
  );

  const renderDrawCard = (draw: typeof allDraws[0]) => (
    <View
      key={draw.id}
      className="bg-background/80 p-4 rounded-2xl border border-muted-foreground flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center mr-4 border border-zinc-700">
          <Text className="text-xl">{draw.emoji}</Text>
        </View>
        <View>
          <Text className="text-foreground font-bold">{draw.title}</Text>
          <Text className="text-foreground text-sm">{draw.sub}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/games/${draw.id}` as any)}
        className="bg-background/80 px-4 py-2 rounded-full border border-zinc-700"
      >
        <Text className="text-foreground font-bold text-xs">Jugar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <HubLayout
      title="Juegos y Sorteos"
      subtitle="Diviértete y participa en los sorteos de La Imaginaria."
      heroBanner={heroBanner}
      tabs={tabs}
      activeTabId={activeTab}
      onTabChange={setActiveTab}
      discoverTitle="Próximos Sorteos"
      discoverItems={filteredDraws}
      renderDiscoverItem={renderDrawCard}
      showBack={true}
    />
  );
}
