import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface SeccionListaProps<T> {
  title?: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  layout?: 'list' | 'grid';
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export default function SeccionList({
  title,
  items,
  renderItem,
  layout = 'list',
  isLoading = false,
  emptyState,
}: SeccionListaProps<any>) {
  const colors = useThemeColors();

  if (isLoading) {
    return (
      <View className="justify-center items-center py-10">
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (items.length === 0) {
    return emptyState ? <>{emptyState}</> : null;
  }

  return (
    <View className="mb-4 mt-2">
      {title && <Text className="text-foreground font-black text-lg mb-4">{title}</Text>}
      {layout === 'grid' ? (
        <View className="flex-row flex-wrap gap-2">
          {items.map((item, index) => renderItem(item, index))}
        </View>
      ) : (
        <View className="gap-2">
          {items.map((item, index) => renderItem(item, index))}
        </View>
      )}
    </View>
  );
}
