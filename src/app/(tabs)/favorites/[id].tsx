import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { localDB } from '../../../lib/localDB';
import { useThemeColors } from '../../../hooks/useThemeColors';
import HubDetailLayout from '../../../components/layout/HubDetailLayout';

export default function GuardadosDetailScreen() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    try {
      const savedItem = await localDB.saved_items.getById(id as string);
      setItem(savedItem);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 bg-background p-4 justify-center items-center">
        <Text className="text-foreground text-lg">Elemento no encontrado</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 p-3 bg-zinc-900 rounded-xl">
          <Text className="text-white">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <HubDetailLayout title={item.title || 'Detalle Guardado'} backRoute="/favorites" logoType="favorites">
      <View className="p-4">
        <Text className="text-foreground text-lg font-bold mb-2">Detalle de {item.type}</Text>
        <Text className="text-muted-foreground">{JSON.stringify(item, null, 2)}</Text>
        {/* Aquí puedes renderizar el contenido específico según el tipo (post, grupo, etc) */}
      </View>
    </HubDetailLayout>
  );
}
