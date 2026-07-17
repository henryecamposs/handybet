import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function SavedDetailScreen() {
  const { savedId } = useLocalSearchParams();
  const router = useRouter();

  return (
    <HubDetailLayout
      title={`Elemento Guardado #${savedId}`}
      categoryText="DETALLE DE GUARDADO"
      logoType="default"
      backRoute="/(tabs)/saved"
      onBack={() => router.back()}
    >
      <View className="bg-background/80 p-6 rounded-3xl border border-muted-foreground mt-4">
        <Text className="text-foreground text-sm leading-6">
          Aquí se muestra el contenido del elemento guardado con ID: {savedId}.
          Puedes integrar esto con los posts, noticias o cualquier otra entidad específica del backend.
        </Text>
      </View>
    </HubDetailLayout>
  );
}
