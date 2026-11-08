import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer, GamesHeroBanner } from '@/components/layout/hub';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';

export default function GamesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('animalitos');

  const allDraws = [
    { id: 'd1', title: 'Animalitos VIP', sub: 'Cierra en 45 mins', emoji: '🎲', category: 'animalitos' },
    { id: 'd2', title: 'Granja Millonaria', sub: 'Mañana 2:00 PM', emoji: '🐔', category: 'animalitos' },
    { id: 'd3', title: 'Quiniela Champions', sub: 'Cierra en 2 horas', emoji: '⚽', category: 'quinielas' },
    { id: 'd4', title: 'Quiniela LaLiga', sub: 'Cierra en 1 día', emoji: '🏆', category: 'quinielas' },
    { id: 'd5', title: 'Flappy Bird Crypto', sub: 'Juega gratis', emoji: '🎮', category: 'minijuegos' },
    { id: 'd6', title: 'Bingo Bailable', sub: 'Empieza a las 9 PM', emoji: '🎫', category: 'bingos' },
  ];

  const renderDrawCard = (draw: any) => (
    <ListItem
      key={draw.id}
      title={draw.title}
      subtitle={draw.sub}
      subtitleVariant="muted"
      leftElement={
        <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center border border-border">
          <Text className="text-xl">{draw.emoji}</Text>
        </View>
      }
      rightElement={
        <IconButton
          label="Jugar"
          onPress={() => router.push(`/games/${draw.id}` as any)}
          variant="primary"
          size="xs"
          rounded="full"
          hasBorder={false}
        />
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

  const tabs = [
    {
      id: 'animalitos',
      label: 'Animalitos',
      content: (
        <View className="mt-2">
          <SeccionLista items={allDraws.filter(d => d.category === 'animalitos')} renderItem={renderDrawCard} layout="list" emptyState={emptyState} />
        </View>
      )
    },
    {
      id: 'quinielas',
      label: 'Quinielas',
      content: (
        <View className="mt-2">
          <SeccionLista items={allDraws.filter(d => d.category === 'quinielas')} renderItem={renderDrawCard} layout="list" emptyState={emptyState} />
        </View>
      )
    },
    {
      id: 'minijuegos',
      label: 'Mini Juegos',
      content: (
        <View className="mt-2">
          <SeccionLista items={allDraws.filter(d => d.category === 'minijuegos')} renderItem={renderDrawCard} layout="list" emptyState={emptyState} />
        </View>
      )
    },
    {
      id: 'bingos',
      label: 'Bingos',
      content: (
        <View className="mt-2">
          <SeccionLista items={allDraws.filter(d => d.category === 'bingos')} renderItem={renderDrawCard} layout="list" emptyState={emptyState} />
        </View>
      )
    }
  ];

  return (
    <HubLayout
      title="Juegos y Sorteos"
      subtitle="Diviértete y participa en los sorteos de La Imaginaria."
      heroBanner={<GamesHeroBanner />}
      tabContainer={<TabContainer tabs={tabs} />}
      showBack={true}
    />
  );
}
