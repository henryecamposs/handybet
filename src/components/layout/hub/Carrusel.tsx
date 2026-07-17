import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface CarruselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onAddNew?: () => void;
  addNewLabel?: string;
}

export default function Carrusel({ title, items, renderItem, onAddNew, addNewLabel = 'Crear Nuevo' }: CarruselProps<any>) {
  const colors = useThemeColors();

  return (
    <View className="mb-8">
      <Text className="text-foreground font-black text-lg mb-4">{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {onAddNew && (
          <TouchableOpacity
            onPress={onAddNew}
            className="w-32 h-36 bg-muted rounded-2xl border border-dashed border-muted-foreground items-center justify-center mr-4 hover:bg-background/80/80 transition-colors"
          >
            <View className="w-12 h-12 rounded-full bg-card items-center justify-center mb-2">
              <Plus size={24} color={colors.secondary} />
            </View>
            <Text className="text-foreground font-bold text-sm text-center">{addNewLabel}</Text>
          </TouchableOpacity>
        )}
        {items.map((item, index) => renderItem(item, index))}
      </ScrollView>
    </View>
  );
}
