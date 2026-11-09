import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Trophy, Newspaper, Users, Info } from 'lucide-react-native';
import EmptyState from '../ui/EmptyState';
import HandyAdsLogo from '../ui/HandyAdsLogo';
import { localDB } from '../../lib/localDB';
import { useHandyBetStore } from '../../store/useHandyBetStore';

// Exported for center views that still need access
export const [mockAds, mockNews, mockFollowSuggestions, mockPrizes] = [[], [], [], []] as any;


// --- COMPONENTS ---

export const WidgetContainer = ({ title, children, action }: { title: string | React.ReactNode, children: React.ReactNode, action?: React.ReactNode }) => (
  <View className="mb-6">
    <View className="flex-row justify-between items-center pb-2.5 mb-2 border-b border-white/10">
      {typeof title === 'string' ? (
        <Text className="text-xs font-bold uppercase tracking-wider text-primary">{title}</Text>
      ) : (
        title
      )}
      {action && action}
    </View>
    <View className="gap-1 bg-transparent">
      {children}
    </View>
  </View>
);

export const AdWidget = ({ image, title, domain, size = 'large' }: { image: string, title: string, domain: string, size?: string }) => {
  if (size === 'small') {
    return (
      <TouchableOpacity className="flex-1 hover:opacity-90 rounded-xl transition-all overflow-hidden">
        <Image source={{ uri: image }} className="w-full aspect-square rounded-xl border border-white/10" resizeMode="cover" />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity className="hover:opacity-90 rounded-xl transition-all mb-2 overflow-hidden">
      <Image source={{ uri: image }} className="w-full h-24 rounded-xl border border-white/10" resizeMode="cover" />
    </TouchableOpacity>
  );
};

export const NewsWidget = ({ id, title, time, onSelectNews }: { id: string, title: string, time: string, onSelectNews?: (id: string) => void }) => {
  return (
    <TouchableOpacity
      className="px-1.5 py-1.5 hover:bg-white/5 rounded-lg transition-all"
      onPress={() => onSelectNews ? onSelectNews(id) : undefined}
    >
      <Text className="text-foreground font-bold text-xs leading-normal hover:text-primary transition-colors">{title}</Text>
      <Text className="text-muted-foreground text-[10px] mt-0.5 font-medium">{time}</Text>
    </TouchableOpacity>
  );
};

export const FollowSuggestionWidget = ({ name, avatar, time, mutualFollowers, onFollow }: { name: string, avatar: string, time: string, mutualFollowers: number, onFollow?: () => void }) => {
  const [isFollowing, setIsFollowing] = React.useState(false);

  return (
    <View className="flex-row items-center justify-between py-2 px-1 hover:bg-white/5 rounded-xl transition-all">
      <View className="flex-row items-center flex-1 mr-2">
        <Image source={{ uri: avatar }} className="w-9 h-9 rounded-full mr-2.5 border border-white/10" />
        <View className="flex-1">
          <Text className="font-bold text-foreground text-xs" numberOfLines={1}>{name}</Text>
          <Text className="text-muted-foreground text-[10px] font-medium" numberOfLines={1}>
            {mutualFollowers} seguidores en común
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          setIsFollowing(!isFollowing);
          if (onFollow) onFollow();
        }}
        className={`px-3 py-1 rounded-full items-center active:scale-[0.97] transition-all ${
          isFollowing ? 'bg-white/10 border border-white/20' : 'bg-primary'
        }`}
      >
        <Text className={`font-bold text-[10px] uppercase tracking-wider ${isFollowing ? 'text-foreground' : 'text-black'}`}>
          {isFollowing ? 'Siguiendo' : 'Seguir'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export const PrizeNotificationWidget = ({ id, title, description, onSelectPrize }: { id: string, title: string, description: string, onSelectPrize?: (id: string) => void }) => (
  <TouchableOpacity
    className="p-2 hover:bg-white/5 rounded-xl flex-row items-center gap-3 transition-colors"
    onPress={() => onSelectPrize ? onSelectPrize(id) : undefined}
  >
    <View className="w-8 h-8 bg-secondary/10 rounded-full items-center justify-center border border-secondary/20">
      <Trophy size={15} color="#10b981" />
    </View>
    <View className="flex-1">
      <Text className="text-foreground font-bold text-xs" numberOfLines={1}>{title}</Text>
      <Text className="text-secondary text-[10px] font-semibold mt-0.5" numberOfLines={1}>{description}</Text>
    </View>
  </TouchableOpacity>
);

export const Divider = () => <View className="h-[1px] bg-border my-4" />;

interface RightSidebarWidgetsProps {
  onSelectNews?: (id: string | null) => void;
  onSelectPrize?: (id: string | null) => void;
  onSelectFollowSuggestion?: (id: string | null) => void;
}

export default function RightSidebarWidgets({ onSelectNews, onSelectPrize, onSelectFollowSuggestion }: RightSidebarWidgetsProps) {
  const { mockSession } = useHandyBetStore();
  const [ads, setAds] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [prizes, setPrizes] = useState<any[]>([]);

  const loadData = async () => {
    try {
      // Ads
      const allAds = await localDB.ads.getAll();
      setAds(allAds.filter((a: any) => a.is_active));

      // News
      const allNews = await localDB.news.getAll();
      setNews(allNews.slice(0, 4).map((n: any) => ({
        id: n.id,
        title: n.title,
        time: getRelativeTime(n.created_at),
      })));

      // Follow suggestions
      const userId = mockSession?.id || 'usr_henry';
      let allSuggestions = await localDB.relationships.getFollowSuggestions(userId);
      
      // Fallback si la lista de sugerencias está vacía
      if (!allSuggestions || allSuggestions.length === 0) {
        const allUsers = await localDB.users.getAll();
        const cand = allUsers.filter((u: any) => u.id !== userId && (u.role === 'vip_creator' || u.role === 'tipster' || u.role === 'cashier'));
        allSuggestions = cand.slice(0, 5).map((u: any, idx: number) => ({
          id: `sug_fb_${idx}`,
          suggested_id: u.id,
          mutual_followers: Math.floor(Math.random() * 20) + 5
        }));
      }

      const resolvedSuggestions = (await Promise.all(allSuggestions.slice(0, 6).map(async (s: any) => {
        const targetId = s.suggested_id || s.user_id;
        const user = await localDB.users.getById(targetId);
        if (!user || user.id === userId) return null;
        return {
          id: s.id || `sug_${user.id}`,
          name: user?.full_name || user?.username || 'Usuario',
          avatar: user?.avatar_url || 'https://i.pravatar.cc/150',
          time: 'Activo',
          mutualFollowers: s.mutual_followers || user.followers_count || 12,
        };
      }))).filter(Boolean);
      setSuggestions(resolvedSuggestions);

      // Prizes
      const allPrizes = await localDB.prizes.getAll();
      let userPrizes = allPrizes.filter((p: any) => p.user_id === userId);
      // Si el usuario tiene pocos premios o ninguno, completar con los premios mayores recientes de la plataforma
      if (userPrizes.length < 3) {
        const communityPrizes = allPrizes.filter((p: any) => p.user_id !== userId);
        userPrizes = [...userPrizes, ...communityPrizes].slice(0, 4);
      }
      setPrizes(userPrizes.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        amount: `${p.amount} ${p.currency}`,
      })));
    } catch (e) {
      console.warn('[RightSidebar] Error loading data:', e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [mockSession]);

  return (
    <ScrollView
      style={{ height: 'calc(100vh - 64px)' as any }}
      className="w-[25%] p-4 bg-card/20 border-l border-white/10 hover-scrollbar"
      showsVerticalScrollIndicator={true}
    >

      {/* Contenedor 1: Publicidad */}
      <WidgetContainer title={<HandyAdsLogo size="xs" />}>
        {ads.length === 0 ? (
          <EmptyState title="No hay anuncios disponibles." icon={Info} variant="dashed" />
        ) : (
          <>
            {ads.filter(a => a.size === 'large').map(ad => (
              <AdWidget key={ad.id} image={ad.image_url || ad.image} title={ad.title} domain={ad.domain} size={ad.size} />
            ))}
            <View className="flex-row gap-2">
              {ads.filter(a => a.size === 'small').map(ad => (
                <AdWidget key={ad.id} image={ad.image_url || ad.image} title={ad.title} domain={ad.domain} size={ad.size} />
              ))}
            </View>
          </>
        )}
      </WidgetContainer>

      {/* <Divider /> */}

      {/* Contenedor 2: Noticias */}
      <WidgetContainer
        title="Noticias Destacadas"
        action={
          <TouchableOpacity onPress={() => onSelectNews ? onSelectNews('all') : undefined}>
            <Text className="text-primary text-sm hover:underline">Ver todo</Text>
          </TouchableOpacity>
        }
      >
        {news.length === 0 ? (
          <EmptyState title="No hay noticias destacadas." icon={Newspaper} variant="dashed" />
        ) : (
          news.map(n => (
            <NewsWidget key={n.id} id={n.id} title={n.title} time={n.time} onSelectNews={onSelectNews} />
          ))
        )}
      </WidgetContainer>

      {/* <Divider /> */}

      {/* Contenedor 3: Sugerencias de Seguimiento */}
      <WidgetContainer
        title="Sugerencias de seguimiento"
        action={
          <TouchableOpacity onPress={() => onSelectFollowSuggestion ? onSelectFollowSuggestion('all') : undefined}>
            <Text className="text-primary text-sm hover:underline">Ver todo</Text>
          </TouchableOpacity>
        }
      >
        {suggestions.length === 0 ? (
          <EmptyState title="No hay sugerencias por el momento." icon={Users} variant="dashed" />
        ) : (
          suggestions.map(req => (
            <FollowSuggestionWidget
              key={req.id}
              name={req.name}
              avatar={req.avatar}
              time={req.time}
              mutualFollowers={req.mutualFollowers}
            />
          ))
        )}
      </WidgetContainer>

      {/* <Divider /> */}

      {/* Contenedor 4: Notificador de Premios */}
      <WidgetContainer
        title="Premios Ganados"
        action={
          <TouchableOpacity onPress={() => onSelectPrize ? onSelectPrize('all') : undefined}>
            <Text className="text-primary text-sm hover:underline">Ver todo</Text>
          </TouchableOpacity>
        }
      >
        {prizes.length === 0 ? (
          <EmptyState title="No has ganado premios recientemente." icon={Trophy} variant="dashed" />
        ) : (
          prizes.map(prize => (
            <PrizeNotificationWidget key={prize.id} id={prize.id} title={prize.title} description={prize.description} onSelectPrize={onSelectPrize} />
          ))
        )}
      </WidgetContainer>

    </ScrollView>
  );
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return date.toLocaleDateString('es', { day: 'numeric', month: 'short' });
}
