import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HandyPostLogo from '@/components/ui/HandyPostLogo';
import HandyNewsLogo from '@/components/ui/HandyNewsLogo';
import HandyChatLogo from '@/components/ui/HandyChatLogo';
import HandyPlayLogo from '@/components/ui/HandyPlayLogo';
import HandyShowLogo from '@/components/ui/HandyShowLogo';
import HandyRoomLogo from '@/components/ui/HandyRoomLogo';
import HandyPayLogo from '@/components/ui/HandyPayLogo';
import Logo from '@/components/ui/Logo';

export interface HubDetailLayoutProps {
  // Ruta de retorno obligatoria
  backRoute: string;
  onBack?: () => void;
  logoType?: 'chat' | 'news' | 'play' | 'post' | 'channel' | 'channels' | 'canal' | 'canales' | 'guardados' | 'guardado' | 'favorite' | 'favorites' | 'wallet' | 'default';

  // Encabezado
  categoryText?: string;
  title?: string;
  headerRight?: React.ReactNode;
  hideHeader?: boolean;

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
  headerRight,
  hideHeader = false,
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
      case 'channels':
      case 'channel':
      case 'canal':
      case 'canales':
        return <HandyRoomLogo size="md" />;
      case 'favorite':
      case 'favorites':
      case 'guardados':
      case 'guardado':
        return <Text className="text-foreground font-bold text-lg">{title || 'Guardados'}</Text>;
      case 'wallet':
        return <HandyPayLogo size="md" />;
      case 'default':
      default:
        return <Logo size="sm" showImage={false} />;
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Twitter (Imagen 2) */}
      {!hideHeader && (
        <View className="flex-row items-center justify-between border-b border-white/10 py-3 px-6 bg-background sticky top-0 z-10">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={handleBack} className="mr-3 p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 active:scale-95 transition-all">
              <ArrowLeft size={18} color={colors.foreground} />
            </TouchableOpacity>
            {renderHeaderLogo()}
          </View>
          {headerRight}
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <View className="px-6 pt-5">
            {/* Encabezado del Detalle */}
            {title && (
              <View className="mb-6">
                {categoryText && (
                  <Text className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                    {categoryText}
                  </Text>
                )}
                <Text className="text-3xl font-black text-foreground tracking-tight mt-1">
                  {title}
                </Text>
              </View>
            )}

            {/* Listado Principal de Salas/Subgrupos si existe */}
            {listTitle && (
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                {listTitle}
              </Text>
            )}

            {listTitle && items.length === 0 ? (
              <View className="bg-card/50 border border-white/10 border-dashed rounded-2xl p-6 items-center backdrop-blur-md">
                <Text className="text-muted-foreground font-bold text-sm text-center">
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

        <View className="px-6">
          {children}
        </View>
        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
