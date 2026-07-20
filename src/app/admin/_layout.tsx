import { Stack, useSegments } from 'expo-router';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const ADMIN_AUTH_KEY = 'handybet_admin_auth';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { replaceRoute } = useAppNavigation();
  const segments = useSegments();

  const checkAuth = async () => {
    try {
      const authVal = await AsyncStorage.getItem(ADMIN_AUTH_KEY);
      if (authVal === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, [segments]);

  if (isAuthenticated === null) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Si no está autenticado y no está en la página de login, no mostramos el layout de admin
  if (!isAuthenticated && segments[segments.length - 1] !== 'login') {
    // Es mejor redirigir después de montar en un layout, 
    // pero si devolvemos null, no mostrará el contenido antes del useEffect redirigiendo
    setTimeout(() => replaceRoute('/admin/login'), 0);
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#111827' } }}>
      <Stack.Screen name="login" options={{ presentation: 'fullScreenModal' }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="traffic" />
    </Stack>
  );
}
