import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer, GamesHeroBanner } from '@/components/layout/hub';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';
import CrashDemoGame from '@/components/games/CrashDemoGame';
import { localDB } from '@/lib/localDB';
import seedGames from '@/data/games.json';

export default function GamesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [games, setGames] = useState<any[]>(seedGames as any[]);

  useEffect(() => {
    localDB.games.getAll().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setGames(loaded);
      }
    });
  }, []);

  const renderDrawCard = (draw: any) => (
    <ListItem
      key={draw.id}
      title={draw.title}
      subtitle={`${draw.sub} • Min: ${draw.min_bet || 5} Bs.`}
      subtitleVariant="muted"
      leftElement={
        <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center border border-white/10 shadow-sm">
          <Text className="text-2xl">{draw.emoji}</Text>
        </View>
      }
      rightElement={
        <View className="flex-row items-center gap-2">
          {draw.multiplier && (
            <View className="bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full hidden sm:flex">
              <Text className="text-amber-400 font-bold text-[10px]">{draw.multiplier}x</Text>
            </View>
          )}
          <IconButton
            label="Jugar"
            onPress={() => router.push(`/games/${draw.id}` as any)}
            variant="primary"
            size="xs"
            rounded="full"
            hasBorder={false}
          />
        </View>
      }
      onPress={() => router.push(`/games/${draw.id}` as any)}
      className="mb-2 bg-background/80"
    />
  );

  const emptyState = (
    <EmptyState
      icon={Ticket}
      title="No hay juegos"
      description="Actualmente no hay juegos disponibles en esta categoría."
      variant="dashed"
    />
  );

  const categories = [
    { id: 'animalitos', label: 'Animalitos' },
    { id: 'quinielas', label: 'Quinielas' },
    { id: 'minijuegos', label: 'Mini Juegos' },
    { id: 'bingos', label: 'Bingos' },
    { id: 'parley', label: 'Parley' },
    { id: 'rifas', label: 'Rifas' },
    { id: 'loterias', label: 'Loterías' },
  ];

  const tabs = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    content: (
      <View className="mt-2">
        {cat.id === 'minijuegos' && (
          <View className="mb-6">
            <CrashDemoGame />
          </View>
        )}
        <SeccionLista
          items={games.filter((g) => g.category === cat.id)}
          renderItem={renderDrawCard}
          layout="list"
          emptyState={emptyState}
        />
      </View>
    ),
  }));

  return (
    <HubLayout
      title="Juegos y Sorteos"
      subtitle="Diviértete y participa en los sorteos y minijuegos de La Imaginaria."
      heroBanner={<GamesHeroBanner />}
      tabContainer={<TabContainer tabs={tabs} />}
      showBack={true}
    />
  );
}
