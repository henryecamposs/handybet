import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trophy } from 'lucide-react-native';

// --- MOCK DATA ---

export const mockAds = [
  {
    id: 'ad1',
    image: 'https://placehold.co/200x100/222/555?text=Ad+Grande',
    title: 'Creación de Música Programática',
    domain: 'elevenlabs.io',
    size: 'large'
  },
  {
    id: 'ad2',
    image: 'https://placehold.co/100x100/222/555?text=Ad+Chico+1',
    title: 'Try it with 10 free credits!',
    domain: 'moises.ai',
    size: 'small'
  },
  {
    id: 'ad3',
    image: 'https://placehold.co/100x100/222/555?text=Ad+Chico+2',
    title: 'Más publicidad',
    domain: 'sponsor.com',
    size: 'small'
  }
];

export const mockNews = [
  {
    id: 'n1',
    title: 'Nueva Taquilla Activa en Chacao',
    time: 'Hace 2 horas',
  },
  {
    id: 'n2',
    title: '¡Joselin lanza su canal VIP!',
    time: 'Hace 5 horas',
  },
];

export const mockFriendRequests = [
  {
    id: 'fr1',
    name: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    time: '2 d',
    mutualFriends: 12,
  }
];

export const mockPrizes = [
  {
    id: 'p1',
    title: '¡Ganador en Taquillas Caracas!',
    description: 'Has ganado 450 VES en el sorteo 11:00 AM. Revisa tu Wallet.',
    amount: '450 VES',
  }
];

// --- COMPONENTS ---

export const WidgetContainer = ({ title, children, action }: { title: string, children: React.ReactNode, action?: React.ReactNode }) => (
  <View className="mb-4">
    <View className="flex-row justify-between items-center mb-3 px-2">
      <Text className="text-xs font-semibold text-foreground">{title}</Text>
      {action && action}
    </View>
    <View className="bg-transparent space-y-2">
      {children}
    </View>
  </View>
);

export const AdWidget = ({ image, title, domain, size = 'large' }: { image: string, title: string, domain: string, size?: string }) => {
  if (size === 'small') {
    return (
      <TouchableOpacity className="flex-1 hover:bg-background/50 p-1 rounded-xl transition-colors">
        <Image source={{ uri: image }} className="w-full aspect-square rounded-lg" resizeMode="cover" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity className="hover:bg-background/50 p-1 rounded-xl transition-colors mb-2">
      <Image source={{ uri: image }} className="w-full h-24 rounded-lg" resizeMode="cover" />
    </TouchableOpacity>
  );
};

export const NewsWidget = ({ title, time }: { title: string, time: string }) => (
  <View className="px-1 mb-3">
    <Text className="text-foreground font-semibold text-sm mb-1">{title}</Text>
    <Text className="text-foreground text-xs">{time}</Text>
  </View>
);

export const FriendRequestWidget = ({ name, avatar, time, mutualFriends }: { name: string, avatar: string, time: string, mutualFriends: number }) => (
  <View className="flex-row items-center p-2 hover:bg-background/80 rounded-xl transition-colors">
    <Image source={{ uri: avatar }} className="w-16 h-16 rounded-full mr-3" />
    <View className="flex-1">
      <View className="flex-row justify-between items-center">
        <Text className="font-semibold text-foreground text-[15px]">{name}</Text>
        <Text className="text-foreground text-[13px]">{time}</Text>
      </View>
      <Text className="text-foreground text-[13px] mb-2">{mutualFriends} amigos en común</Text>
      <View className="flex-row gap-2">
        <TouchableOpacity className="flex-1 bg-primary py-1.5 rounded-lg items-center">
          <Text className="text-primary-foreground font-bold text-[15px]">Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-background/80 py-1.5 rounded-lg items-center border border-zinc-800">
          <Text className="text-foreground font-bold text-[15px]">Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

export const PrizeNotificationWidget = ({ title, description }: { title: string, description: string }) => (
  <View className="bg-background border border-zinc-800 p-4 rounded-xl flex-row items-center gap-4 mx-2 shadow-sm">
    <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center">
      <Trophy size={24} color="#00C800" />
    </View>
    <View className="flex-1">
      <Text className="text-foreground font-bold text-sm">{title}</Text>
      <Text className="text-secondary text-xs font-semibold mt-1">{description}</Text>
    </View>
  </View>
);

export const Divider = () => <View className="h-[1px] bg-background/80 my-4 mx-2" />;

export default function RightSidebarWidgets() {
  return (
    <ScrollView className="w-[20%] p-1 bg-primary/5" showsVerticalScrollIndicator={false}>

      {/* Contenedor 1: Publicidad */}
      <WidgetContainer title="Publicidad">
        {mockAds.filter(a => a.size === 'large').map(ad => (
          <AdWidget key={ad.id} image={ad.image} title={ad.title} domain={ad.domain} size={ad.size} />
        ))}
        <View className="flex-row gap-2">
          {mockAds.filter(a => a.size === 'small').map(ad => (
            <AdWidget key={ad.id} image={ad.image} title={ad.title} domain={ad.domain} size={ad.size} />
          ))}
        </View>
      </WidgetContainer>

      <Divider />

      {/* Contenedor 2: Noticias */}
      <WidgetContainer title="Noticias Destacadas">
        {mockNews.map(news => (
          <NewsWidget key={news.id} title={news.title} time={news.time} />
        ))}
      </WidgetContainer>

      <Divider />

      {/* Contenedor 3: Solicitudes de Amistad */}
      <WidgetContainer
        title="Solicitudes de amistad"
        action={<TouchableOpacity><Text className="text-primary text-sm hover:underline">Ver todo</Text></TouchableOpacity>}
      >
        {mockFriendRequests.map(req => (
          <FriendRequestWidget
            key={req.id}
            name={req.name}
            avatar={req.avatar}
            time={req.time}
            mutualFriends={req.mutualFriends}
          />
        ))}
      </WidgetContainer>

      <Divider />

      {/* Contenedor 4: Notificador de Premios */}
      <WidgetContainer title="Premios Ganados">
        {mockPrizes.map(prize => (
          <PrizeNotificationWidget key={prize.id} title={prize.title} description={prize.description} />
        ))}
      </WidgetContainer>

    </ScrollView>
  );
}
