import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import EmptyState from '@/components/ui/EmptyState';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/"
    >
      <View className="p-4 flex-1 h-full">
        <Text className="text-foreground font-black text-2xl tracking-tight mb-6">Notificaciones</Text>
        <EmptyState 
          title="No tienes notificaciones nuevas." 
          icon={Bell} 
          variant="dashed" 
        />
      </View>
    </HubDetailLayout>
  );
}
