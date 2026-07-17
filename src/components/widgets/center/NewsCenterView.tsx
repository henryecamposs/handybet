import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, ActivityIndicator } from 'react-native';
import { ArrowLeft, Newspaper, Send } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import PostActionButtons from '../../feed/PostActionButtons';
import RepliesSection from '../../feed/RepliesSection';

interface NewsCenterViewProps {
  currentView: 'all-news' | 'news-detail';
  selectedItemId: string | null;
  onBack: () => void;
  onSelectNews: (id: string) => void;
}

export default function NewsCenterView({ currentView, selectedItemId, onBack, onSelectNews }: NewsCenterViewProps) {
  const colors = useThemeColors();
  const [news, setNews] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const loadNews = async () => {
    const allNews = await localDB.news.getAll();
    setNews(allNews);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNews();
  }, []);

  if (currentView !== 'all-news' && currentView !== 'news-detail') return null;
  const selectedNews = news.find(n => n.id === selectedItemId);

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Backend */}
      <View className="flex-row items-center border-b border-border py-2 px-4 bg-background/80 sticky top-0 z-10">
        <TouchableOpacity onPress={onBack} className="mr-3 p-1 rounded-full hover:bg-primary/20">
          <ArrowLeft size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground font-bold text-lg">Noticias Destacadas</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Contenido Dinámico */}
        {currentView === 'all-news' && (
          <Text className="text-xl font-bold text-foreground mb-4">Todas las Noticias</Text>
        )}

        {currentView === 'all-news' ? (
          <View className="flex-col gap-4">
            {news.map((n) => (
              <TouchableOpacity
                key={n.id}
                className="py-4 border-b border-zinc-800/80 hover:bg-zinc-900/50 transition-colors"
                onPress={() => onSelectNews(n.id)}
              >
                <Text className="text-lg font-bold text-foreground mb-1">{n.title}</Text>
                <Text className="text-muted-foreground text-sm mb-3">{n.summary || n.time}</Text>
                <View className="flex-row items-center border-t border-zinc-800/30 pt-3">
                  <PostActionButtons
                    isLiked={false}
                    likeCount="120"
                    commentCount="15"
                    onLikeToggle={() => { }}
                    onCommentPress={() => onSelectNews(n.id)}
                    onSharePress={() => { }}
                    variant="compact"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="py-6">
            <Text className="text-2xl font-black text-foreground mb-2">
              {selectedNews?.title || `Noticia ${selectedItemId}`}
            </Text>
            <Text className="text-zinc-500 text-xs font-semibold mb-6">
              {selectedNews?.category?.toUpperCase()} · {new Date(selectedNews?.created_at || '').toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            <Text className="text-foreground text-[16px] leading-relaxed mb-6">
              {selectedNews?.content || 'Contenido no disponible.'}
            </Text>

            {/* Métricas / Stats de Interacción y Botones de Acción */}
            <View className="flex-row justify-between items-center py-2.5 border-b border-t border-zinc-800/80 gap-2 mb-2">
              <View className="flex-row gap-4 items-center">
                <Text className="text-zinc-400 text-xs font-bold">
                  <Text className="text-white font-black">{commentsCount}</Text> Respuestas
                </Text>
                <Text className="text-zinc-400 text-xs font-bold">
                  <Text className="text-white font-black">{isLiked ? '121' : '120'}</Text> Likes
                </Text>
              </View>

              <PostActionButtons
                isLiked={isLiked}
                onLikeToggle={() => setIsLiked(!isLiked)}
                onSharePress={() => { }}
              />
            </View>

            <RepliesSection
              targetId={selectedItemId || ''}
              targetUsername="@HandyBet"
              onCommentsCountChange={setCommentsCount}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
