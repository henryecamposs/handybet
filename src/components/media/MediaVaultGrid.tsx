import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { MediaVaultItem } from '../../types/handyBet';

interface MediaVaultGridProps {
  groupId: string;
  mediaItems: MediaVaultItem[];
  userSubscriptions: string[]; // Lista de ids de planes a los que está suscrito
  onSelectPlan: (planId: string) => void;
}

const { width } = Dimensions.get('window');
const numColumns = width > 768 ? 4 : 2;
const cardSize = (width - 48) / numColumns;

export default function MediaVaultGrid({
  groupId,
  mediaItems,
  userSubscriptions,
  onSelectPlan,
}: MediaVaultGridProps) {

  const renderItem = ({ item }: { item: MediaVaultItem }) => {
    // Verificar si el recurso requiere un plan y si el usuario está suscrito
    const requiresPlan = item.plan_id !== null;
    const hasAccess = !requiresPlan || userSubscriptions.includes(item.plan_id!);

    return (
      <View
        style={{ width: cardSize, height: cardSize }}
        className="m-2  bg-background/80 border border-zinc-800 overflow-hidden relative"
      >
        {/* Imagen o Miniatura con Blur */}
        <Image
          source={{ uri: hasAccess ? item.storage_url : (item.preview_url || 'https://placehold.co/300') }}
          style={{ width: '100%', height: '100%' }}
          blurRadius={hasAccess ? 0 : 25} // Desenfoque por hardware en el cliente
          resizeMode="cover"
        />

        {/* Detalles del Recurso */}
        <View className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-950 to-zinc-900/10">
          <Text className="text-white text-xs font-black truncate">{item.title}</Text>
          <Text className="text-foreground text-[10px] uppercase font-bold mt-0.5">
            {item.media_type === 'video' ? '📹 Video' : '📷 Foto'}
          </Text>
        </View>

        {/* Overlay de Bloqueo */}
        {!hasAccess && (
          <View className="absolute inset-0 bg-background/40 justify-center items-center p-3">
            <View className="bg-background/90 border border-border/80 p-3.5  items-center shadow-lg backdrop-blur-md">
              <Text className="text-xl mb-1">🔒</Text>
              <Text className="text-white text-[10px] font-black text-center uppercase tracking-wider mb-2">
                Contenido Premium
              </Text>
              <TouchableOpacity
                onPress={() => item.plan_id && onSelectPlan(item.plan_id)}
                className="bg-secondary px-3 py-1.5 rounded-lg border border-secondary"
              >
                <Text className="text-foreground text-[10px] font-black uppercase">
                  Comprar Plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 p-4 bg-background">
      <View className="mb-4">
        <Text className="text-2xl font-black text-white tracking-tight">Bóveda Multimedia</Text>
        <Text className="text-foreground text-xs font-bold mt-1">
          Contenido exclusivo y pronósticos monetizables de la agencia.
        </Text>
      </View>

      {mediaItems.length === 0 ? (
        <View className="flex-1 justify-center items-center py-20">
          <Text className="text-5xl mb-4">📂</Text>
          <Text className="text-foreground font-bold text-sm text-center">
            No se han subido archivos a esta bóveda todavía.
          </Text>
        </View>
      ) : (
        <FlatList
          data={mediaItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns} // Re-renderiza al cambiar la cantidad de columnas
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </View>
  );
}
