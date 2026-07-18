import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Trophy, Ticket, Dice1, Gamepad2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer } from '@/components/layout/hub';
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

  const heroBanner = (
    <View className="mb-4 mt-2">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row rounded-2xl overflow-hidden">
        <View className="w-[85vw] md:w-[600px] bg-primary/20 p-6 border border-border relative overflow-hidden justify-center mr-4 rounded-2xl">
          <View className="bg-primary px-3 py-1 rounded-full self-start mb-3">
            <Text className="text-black font-bold text-xs uppercase">Sorteo Activo</Text>
          </View>
          <Text className="text-primary font-black text-3xl mb-2">Gran Kino Imaginario</Text>
          <Text className="text-foreground font-medium mb-4">¡Gana hasta 5,000 Puntos hoy a las 8:00 PM!</Text>
          <View className="self-start">
            <IconButton
              label="Jugar Ahora"
              onPress={() => router.push('/games/d1' as any)}
              variant="primary"
              rounded="full"
              hasBorder={false}
            />
          </View>
          <Trophy size={120} color="rgba(202, 238, 38, 0.2)" className="absolute right-4 bottom-4 z-0 pointer-events-none" />
        </View>
        <View className="w-[85vw] md:w-[600px] bg-secondary/20 p-6 border border-border relative overflow-hidden justify-center rounded-2xl mr-4">
          <View className="bg-secondary px-3 py-1 rounded-full self-start mb-3">
            <Text className="text-white font-bold text-xs uppercase">Nuevo</Text>
          </View>
          <Text className="text-secondary font-black text-3xl mb-2">Bingo Mega X</Text>
          <Text className="text-foreground font-medium mb-4">Cartones desde 5.00 Bs. ¡Participa ya!</Text>
          <View className="self-start">
            <IconButton
              label="Comprar Cartón"
              onPress={() => router.push('/games/d6' as any)}
              variant="secondary"
              rounded="full"
              hasBorder={false}
            />
          </View>
          <Gamepad2 size={120} color="rgba(16, 185, 129, 0.2)" className="absolute right-4 bottom-4 z-0 pointer-events-none" />
        </View>
      </ScrollView>
    </View>
  );

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
      heroBanner={heroBanner}
      tabContainer={<TabContainer tabs={tabs} />}
      showBack={true}
    />
  );
}
