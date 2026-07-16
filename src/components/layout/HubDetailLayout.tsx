import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface HubDetailLayoutProps {
  // Acción de regreso
  backLabel: string;
  onBack: () => void;
  
  // Encabezado
  categoryText?: string;
  title: string;
  
  // Listado
  listTitle: string;
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  
  // Estados de carga y vacío
  isLoading?: boolean;
  emptyLabel?: string;
  notFoundLabel?: string;
  
  // Inyección de elementos adicionales
  children?: React.ReactNode;
}

export default function HubDetailLayout({
  backLabel,
  onBack,
  categoryText,
  title,
  listTitle,
  items = [],
  renderItem,
  isLoading = false,
  emptyLabel = 'No se encontraron elementos.',
  notFoundLabel = 'Contenido no encontrado.',
  children,
}: HubDetailLayoutProps) {
  const colors = useThemeColors();

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Botón de regreso */}
      <TouchableOpacity onPress={onBack} className="flex-row items-center gap-2 mb-6">
        <Text className="text-foreground font-bold text-sm">◀ {backLabel}</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : !title ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-rose-500 font-black text-center">{notFoundLabel}</Text>
        </View>
      ) : (
        <View>
          {/* Encabezado del Detalle */}
          <View className="mb-8">
            {categoryText && (
              <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
                {categoryText}
              </Text>
            )}
            <Text className="text-3xl font-black text-foreground tracking-tight mt-1">
              {title}
            </Text>
          </View>

          {/* Listado Principal de Salas/Subgrupos */}
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
            {listTitle}
          </Text>

          {items.length === 0 ? (
            <View className="bg-background/80 border border-muted-foreground p-6 rounded-3xl items-center border-dashed">
              <Text className="text-foreground font-bold text-sm text-center">
                {emptyLabel}
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {items.map((item, index) => renderItem(item, index))}
            </View>
          )}
        </View>
      )}

      {children}
      <View className="h-16" />
    </ScrollView>
  );
}
