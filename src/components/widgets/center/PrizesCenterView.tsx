import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Trophy } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import { useHandyBetStore } from '../../../store/useHandyBetStore';

interface PrizesCenterViewProps {
  currentView: 'all-prizes' | 'prize-detail';
  selectedItemId: string | null;
  onBack: () => void;
  onSelectPrize: (id: string) => void;
}

export default function PrizesCenterView({ currentView, selectedItemId, onBack, onSelectPrize }: PrizesCenterViewProps) {
  const colors = useThemeColors();
  const { mockSession } = useHandyBetStore();
  const [prizes, setPrizes] = useState<any[]>([]);

  const loadPrizes = async () => {
    const allPrizes = await localDB.prizes.getAll();
    const userId = mockSession?.id || 'usr_henry';
    setPrizes(allPrizes.filter((p: any) => p.user_id === userId));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrizes();
  }, [mockSession]);

  if (currentView !== 'all-prizes' && currentView !== 'prize-detail') return null;
  const selectedPrize = prizes.find(p => p.id === selectedItemId);

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Backend */}
      <View className="flex-row items-center border-b border-primary/20 py-2 px-4 bg-background/80 sticky top-0 z-10">
        <TouchableOpacity onPress={onBack} className="mr-3 p-1 rounded-full hover:bg-primary/20">
          <ArrowLeft size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground font-bold text-lg">Premios</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Contenido Dinámico */}
        {currentView === 'all-prizes' && (
          <Text className="text-xl font-bold text-foreground mb-4">Todos los Premios</Text>
        )}

        {currentView === 'all-prizes' ? (
          <View className="flex-col gap-4">
            {prizes.map((prize) => (
              <TouchableOpacity
                key={prize.id}
                className="py-4 flex-row items-center gap-4 border-b border-zinc-800/80 hover:bg-zinc-900/50 transition-colors"
                onPress={() => onSelectPrize(prize.id)}
              >
                <View className="w-12 h-12 bg-secondary/10 rounded-full items-center justify-center">
                  <Trophy size={24} color="#00C800" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-1">{prize.title}</Text>
                  <Text className="text-secondary text-sm">{prize.amount} {prize.currency}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="py-8 items-center">
            <View className="w-20 h-20 bg-secondary/10 rounded-full items-center justify-center mb-4 border border-secondary/20">
              <Trophy size={40} color="#00C800" />
            </View>
            <Text className="text-2xl font-bold text-foreground mb-2 text-center">
              {selectedPrize?.title || `Premio ${selectedItemId}`}
            </Text>
            <Text className="text-primary font-bold text-xl mb-4">
              {selectedPrize?.amount} {selectedPrize?.currency}
            </Text>
            <Text className="text-foreground leading-relaxed text-center max-w-[80%]">
              {selectedPrize?.description}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
