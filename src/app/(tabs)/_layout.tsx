import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';
import HandyBetLayout from '../../components/layout/HandyBetLayout';
import Logo from '../../components/ui/Logo';

export default function TabsLayout() {
  const { isDesktop } = useDevicePlatform();

  return (
    <HandyBetLayout>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: isDesktop ? 'none' : 'flex',
            backgroundColor: '#09090b', // zinc-955
            borderTopColor: '#27272a', // zinc-800
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: '#caee26',
          tabBarInactiveTintColor: '#a1a1aa',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
          },
        }}
      >
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>💬</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="grupos"
          options={{
            title: 'Grupos',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>👥</Text>
            ),
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: '', 
            tabBarIcon: ({ focused }) => (
              <View className="mt-3">
                <Logo size="sm" showImage={true} showText={false} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Billetera',
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>💳</Text>
            ),
          }}
        />

        {/* Ocultar todas las sub-rutas secundarias del TabBar para que no aparezcan como botones */}
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="feed/search" options={{ href: null }} />
        
        <Tabs.Screen name="chat/[chatId]" options={{ href: null }} />
        <Tabs.Screen name="chat/friend/[friendId]" options={{ href: null }} />
        <Tabs.Screen name="chat/group/[groupId]" options={{ href: null }} />
        <Tabs.Screen name="chat/group/[groupId]/info" options={{ href: null }} />
        
        <Tabs.Screen name="grupos/create" options={{ href: null }} />
        
        <Tabs.Screen name="wallet/create" options={{ href: null }} />
        <Tabs.Screen name="wallet/[id]" options={{ href: null }} />
        
        <Tabs.Screen name="profile/edit" options={{ href: null }} />
        
        <Tabs.Screen name="channels/index" options={{ href: null }} />
        <Tabs.Screen name="channels/[channelId]" options={{ href: null }} />
        <Tabs.Screen name="channels/create" options={{ href: null }} />
        <Tabs.Screen name="channels/grupo/[grupoId]" options={{ href: null }} />
        
        <Tabs.Screen name="favorites/index" options={{ href: null }} />
        <Tabs.Screen name="favorites/[id]" options={{ href: null }} />
        
        <Tabs.Screen name="friends/index" options={{ href: null }} />
        <Tabs.Screen name="friends/[id]" options={{ href: null }} />
        
        <Tabs.Screen name="games/index" options={{ href: null }} />
        <Tabs.Screen name="games/[gameId]" options={{ href: null }} />
        <Tabs.Screen name="feed/[id]" options={{ href: null }} />
        
        <Tabs.Screen name="saved/index" options={{ href: null }} />
        <Tabs.Screen name="saved/[savedId]" options={{ href: null }} />

        <Tabs.Screen name="guardados/index" options={{ href: null }} />
        <Tabs.Screen name="guardados/[id]" options={{ href: null }} />
      </Tabs>
    </HandyBetLayout>
  );
}
