import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, ActivityIndicator } from 'react-native';
import { useHandyBetStore } from '../store/useHandyBetStore';
import { useColorScheme } from 'nativewind';
import '../global.css'; // Archivo CSS global para NativeWind v4

const queryClient = new QueryClient();

export default function RootLayout() {
  const { mockSession } = useHandyBetStore();
  const [isLoading, setIsLoading] = useState(true);
  const { colorScheme, setColorScheme } = useColorScheme();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Forzar modo oscuro inicial (protegido contra caché antiguo de Metro)
    try {
      setColorScheme('dark');
    } catch (e) {
      console.warn("⚠️ Debes reiniciar el servidor de desarrollo para aplicar darkMode: 'class'");
    }

    // Simulamos un tiempo de carga inicial mínimo para evitar parpadeos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [setColorScheme]);

  // Redirección reactiva basada en mockSession
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inDashboardGroup = segments[0] === '(dashboard)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!mockSession) {
      // Redirigir a login si no está autenticado
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else {
      // Si está autenticado, por ahora redirigimos al Feed (Inicio) de la red social
      if (!inTabsGroup && !inAuthGroup && !inDashboardGroup) {
        router.replace('/(tabs)/feed');
      } else if (inAuthGroup) {
        // Si trata de ir a login estando logueado
        router.replace('/(tabs)/feed');
      }
    }
  }, [mockSession, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
