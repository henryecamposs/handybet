import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { Search, Plus, ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useRouter } from 'expo-router';

export interface HubLayoutTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface HubLayoutProps {
  title: string;
  subtitle: string;
  showBack?: boolean;
  onBack?: () => void;

  // Hero Banner (opcional)
  heroBanner?: React.ReactNode;

  // Buscador (opcional)
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;

  // Categorías / Tabs (opcional)
  tabs?: HubLayoutTab[];
  activeTabId?: string;
  onTabChange?: (id: string) => void;

  // Sección horizontal "Mis Ítems" (opcional)
  myItemsTitle?: string;
  myItems?: any[];
  renderMyItem?: (item: any, index: number) => React.ReactNode;
  onAddNewItem?: () => void;
  addNewItemLabel?: string;

  // Sección principal de descubrimiento
  discoverTitle?: string;
  discoverItems?: any[];
  renderDiscoverItem?: (item: any, index: number) => React.ReactNode;
  discoverLayout?: 'list' | 'grid'; // Grid de 2 columnas o lista

  // Estados de carga y vacío
  isLoading?: boolean;
  emptyState?: React.ReactNode;

  // Secciones Modulares (Nuevas)
  carrusel?: React.ReactNode;
  tabContainer?: React.ReactNode;
  seccionLista?: React.ReactNode;
  postContainer?: React.ReactNode;

  // Hijos para inyección de modales o componentes adicionales
  children?: React.ReactNode;
}

export default function HubLayout({
  title,
  subtitle,
  showBack,
  onBack,
  heroBanner,
  searchPlaceholder = 'Buscar...',
  searchValue,
  onSearchChange,
  tabs,
  activeTabId,
  onTabChange,
  myItemsTitle,
  myItems = [],
  renderMyItem,
  onAddNewItem,
  addNewItemLabel = 'Crear Nuevo',
  discoverTitle,
  discoverItems = [],
  renderDiscoverItem,
  discoverLayout = 'list',
  isLoading = false,
  emptyState,
  carrusel,
  tabContainer,
  seccionLista,
  postContainer,
  children,
}: HubLayoutProps) {
  const colors = useThemeColors();
  const router = useRouter();

  // Determinamos si hay "Mis Ítems" o si mostramos el botón de agregar
  const hasMyItemsSection = myItemsTitle && (myItems.length > 0 || onAddNewItem);

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-2" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6 flex-row items-center">
        {(showBack || onBack) && (
          <TouchableOpacity
            onPress={() => onBack ? onBack() : router.push('/')}
            className="mr-3 p-2 rounded-full bg-background/80 hover:bg-primary/20 transition-colors border border-border"
          >
            <ArrowLeft size={22} color={colors.foreground} />
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-foreground font-bold text-2xl">{title}</Text>
          <Text className="text-foreground text-sm mt-1">{subtitle}</Text>
        </View>
      </View>

      {/* Hero Banner */}
      {heroBanner && <View className="mb-8">{heroBanner}</View>}

      {/* Buscador */}
      {onSearchChange && (
        <View className="bg-input rounded-full flex-row items-center px-4 py-2 border border-border mb-6">
          <Search size={20} color={colors.mutedForeground} />
          <TextInput
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            value={searchValue}
            onChangeText={onSearchChange}
            className="flex-1 text-foreground ml-3 outline-none"
          />
        </View>
      )}

      {/* Categorías / Tabs */}
      {tabs && tabs.length > 0 && (
        <View className="flex-row gap-4 mb-8">
          {tabs.map((tab) => {
            const isActive = activeTabId === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onTabChange?.(tab.id)}
                className={`flex-1 py-3 items-center justify-center transition-colors border-b-[3px] ${isActive
                  ? 'border-primary'
                  : 'border-transparent hover:bg-background/50'
                  }`}
              >
                {tab.icon}
                <Text className={`font-bold text-center mt-2 text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Carrusel Modular */}
      {carrusel}

      {/* Tab Container Modular */}
      {tabContainer}

      {/* Seccion Lista Modular */}
      {seccionLista}

      {/* Carrusel de Mis Ítems (Legacy) */}
      {hasMyItemsSection && (
        <View className="mb-8">
          <Text className="text-foreground font-bold text-lg mb-4">{myItemsTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {/* Botón de Agregar Nuevo */}
            {onAddNewItem && (
              <TouchableOpacity
                onPress={onAddNewItem}
                className="w-32 h-36 bg-muted  border border-dashed border-border items-center justify-center mr-4 hover:bg-background/80/80 transition-colors"
              >
                <View className="w-12 h-12 rounded-full bg-card items-center justify-center mb-2">
                  <Plus size={24} color={colors.secondary} />
                </View>
                <Text className="text-foreground font-bold text-sm text-center">{addNewItemLabel}</Text>
              </TouchableOpacity>
            )}

            {/* Ítems del Carrusel */}
            {myItems.map((item, index) => renderMyItem?.(item, index))}
          </ScrollView>
        </View>
      )}

      {/* Sección Principal / Descubrimiento (Legacy) */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      ) : discoverItems.length === 0 && myItems.length === 0 && !carrusel && !tabContainer && !seccionLista ? (
        // Si no hay nada, mostrar empty state
        emptyState
      ) : (
        // Si hay ítems a descubrir/listar
        (discoverTitle || discoverItems.length > 0) && (
          <View className="mb-8 mt-4">
            {discoverTitle && (
              <Text className="text-foreground font-bold text-lg mb-4">{discoverTitle}</Text>
            )}

            {discoverLayout === 'grid' ? (
              <View className="flex-row flex-wrap gap-4">
                {discoverItems.map((item, index) => renderDiscoverItem?.(item, index))}
              </View>
            ) : (
              <View className="gap-3">
                {discoverItems.map((item, index) => renderDiscoverItem?.(item, index))}
              </View>
            )}
          </View>
        )
      )}

      {/* Post Container Modular */}
      {postContainer}

      {/* Hijos (modales, etc.) */}
      {children}
      <View className="h-16" />
    </ScrollView>
  );
}
