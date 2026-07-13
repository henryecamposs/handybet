import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { mockNews } from '../RightSidebarWidgets';

interface NewsCenterViewProps {
  currentView: 'all-news' | 'news-detail';
  selectedItemId: string | null;
  onBack: () => void;
  onSelectNews: (id: string) => void;
}

export default function NewsCenterView({ currentView, selectedItemId, onBack, onSelectNews }: NewsCenterViewProps) {
  if (currentView !== 'all-news' && currentView !== 'news-detail') return null;

  return (
    <View className="flex-1 bg-card p-6 rounded-2xl border border-zinc-800">
      <TouchableOpacity onPress={onBack} className="mb-6 flex-row items-center">
        <Text className="text-primary font-semibold hover:underline">← Volver al Feed</Text>
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-foreground mb-4">
        {currentView === 'all-news' ? 'Todas las Noticias' : `Noticia Destacada`}
      </Text>

      {currentView === 'all-news' ? (
        <View className="flex-col gap-4">
          {mockNews.map((news) => (
            <TouchableOpacity 
              key={news.id} 
              className="bg-primary/5 p-4 rounded-xl border border-primary/10 hover:bg-primary/10 transition-colors"
              onPress={() => onSelectNews(news.id)}
            >
              <Text className="text-lg font-bold text-foreground mb-1">{news.title}</Text>
              <Text className="text-muted-foreground text-sm">{news.time}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="bg-primary/5 p-4 rounded-xl border border-primary/20">
          <Text className="text-xl font-bold text-foreground mb-2">
            {mockNews.find(n => n.id === selectedItemId)?.title || `Noticia ${selectedItemId}`}
          </Text>
          <Text className="text-muted-foreground text-xs mb-4">
            {mockNews.find(n => n.id === selectedItemId)?.time}
          </Text>
          <Text className="text-foreground leading-relaxed">
            Este es el contenido completo de la noticia seleccionada. Aquí iría el texto detallado, imágenes u otros medios asociados con esta noticia importante de HandyBet.
          </Text>
        </View>
      )}
    </View>
  );
}
