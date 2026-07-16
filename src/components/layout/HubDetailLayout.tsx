import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HandyPostLogo from '@/components/ui/HandyPostLogo';
import HandyNewsLogo from '@/components/ui/HandyNewsLogo';
import HandyChatLogo from '@/components/ui/HandyChatLogo';
import HandyPlayLogo from '@/components/ui/HandyPlayLogo';
import Logo from '@/components/ui/Logo';

export interface HubDetailLayoutProps {
  // Ruta de retorno obligatoria
  backRoute: string;
  onBack?: () => void;
  logoType?: 'chat' | 'news' | 'play' | 'post' | 'default';
  
  // Encabezado
  categoryText?: string;
  title: string;
  
  // Listado (Opcional)
  listTitle?: string;
  items?: any[];
  renderItem?: (item: any, index: number) => React.ReactNode;
  
  // Estados de carga y vacío
  isLoading?: boolean;
  emptyLabel?: string;
  notFoundLabel?: string;
  
  // Inyección de elementos adicionales
  children?: React.ReactNode;
}

export default function HubDetailLayout({
  backRoute,
  onBack,
  logoType = 'default',
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
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.replace(backRoute as any);
    }
  };

  const renderHeaderLogo = () => {
    switch (logoType) {
      case 'chat':
        return <HandyChatLogo size="md" />;
      case 'news':
        return <HandyNewsLogo size="md" />;
      case 'play':
        return <HandyPlayLogo size="md" />;
      case 'post':
        return <HandyPostLogo size="md" />;
      case 'default':
      default:
        return <Logo size="sm" showImage={false} />;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Twitter (Imagen 2) */}
      <View className="flex-row items-center border-b border-primary/20 py-2 px-4 bg-background/85 sticky top-0 z-10">
        <TouchableOpacity onPress={handleBack} className="mr-2 p-2 rounded-full hover:bg-primary/20 transition-colors">
          <ArrowLeft size={22} color={colors.foreground} />
        </TouchableOpacity>
        {renderHeaderLogo()}
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
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
            <View className="mb-6">
              {categoryText && (
                <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
                  {categoryText}
                </Text>
              )}
              <Text className="text-3xl font-black text-foreground tracking-tight mt-1">
                {title}
              </Text>
            </View>

            {/* Listado Principal de Salas/Subgrupos si existe */}
            {listTitle && (
              <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                {listTitle}
              </Text>
            )}

            {listTitle && items.length === 0 ? (
              <View className="bg-background/80 border border-muted-foreground p-6 rounded-3xl items-center border-dashed">
                <Text className="text-foreground font-bold text-sm text-center">
                  {emptyLabel}
                </Text>
              </View>
            ) : (
              items.length > 0 && renderItem && (
                <View className="gap-4 mb-6">
                  {items.map((item, index) => renderItem(item, index))}
                </View>
              )
            )}
          </View>
        )}

        {children}
        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
