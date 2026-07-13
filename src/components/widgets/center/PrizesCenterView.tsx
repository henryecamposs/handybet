import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Trophy } from 'lucide-react-native';
import { mockPrizes } from '../RightSidebarWidgets';

interface PrizesCenterViewProps {
  currentView: 'all-prizes' | 'prize-detail';
  selectedItemId: string | null;
  onBack: () => void;
  onSelectPrize: (id: string) => void;
}

export default function PrizesCenterView({ currentView, selectedItemId, onBack, onSelectPrize }: PrizesCenterViewProps) {
  if (currentView !== 'all-prizes' && currentView !== 'prize-detail') return null;

  return (
    <View className="flex-1 bg-card p-6 rounded-2xl border border-zinc-800">
      <TouchableOpacity onPress={onBack} className="mb-6 flex-row items-center">
        <Text className="text-primary font-semibold hover:underline">← Volver al Feed</Text>
      </TouchableOpacity>
      <Text className="text-3xl font-bold text-foreground mb-4">
        {currentView === 'all-prizes' ? 'Todos los Premios' : `Detalle del Premio`}
      </Text>

      {currentView === 'all-prizes' ? (
        <View className="flex-col gap-4">
          {mockPrizes.map((prize) => (
            <TouchableOpacity 
              key={prize.id} 
              className="bg-background border border-zinc-800 p-4 rounded-xl flex-row items-center gap-4 hover:bg-background/80 transition-colors"
              onPress={() => onSelectPrize(prize.id)}
            >
              <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center">
                <Trophy size={24} color="#00C800" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-foreground mb-1">{prize.title}</Text>
                <Text className="text-secondary text-sm">{prize.amount}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View className="bg-background p-6 rounded-xl border border-zinc-800 items-center">
          <View className="w-20 h-20 bg-secondary/10 rounded-full items-center justify-center mb-4">
            <Trophy size={40} color="#00C800" />
          </View>
          <Text className="text-2xl font-bold text-foreground mb-2 text-center">
            {mockPrizes.find(p => p.id === selectedItemId)?.title || `Premio ${selectedItemId}`}
          </Text>
          <Text className="text-primary font-bold text-xl mb-4">
            {mockPrizes.find(p => p.id === selectedItemId)?.amount}
          </Text>
          <Text className="text-foreground leading-relaxed text-center max-w-[80%]">
            {mockPrizes.find(p => p.id === selectedItemId)?.description}
          </Text>
        </View>
      )}
    </View>
  );
}
