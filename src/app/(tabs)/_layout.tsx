import React from 'react';
import { Tabs } from 'expo-router';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';
import HandyBetLayout from '../../components/layout/HandyBetLayout';
import { useThemeColors } from '@/hooks/useThemeColors';
import { ChatIcon, GroupsIcon, FeedIcon, WalletIcon } from '../../components/ui/icons';

export default function TabsLayout() {
  const { isDesktop } = useDevicePlatform();
  const colors = useThemeColors();
  return (
    <HandyBetLayout>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: isDesktop ? 'none' : 'flex',
            backgroundColor: '#0c0d14', // glass-card
            borderTopColor: 'rgba(255,255,255,0.08)', // glass-border
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#71717a', // zinc-400
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Chats',
            tabBarIcon: ({ color }) => (
              <ChatIcon color={color} size={20} />
            ),
          }}
        />
        <Tabs.Screen
          name="grupos"
          options={{
            title: 'Grupos',
            tabBarIcon: ({ color }) => (
              <GroupsIcon color={color} size={20} />
            ),
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Muro',
            tabBarIcon: ({ color }) => (
              <FeedIcon color={color} size={20} />
            ),
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: 'Billetera',
            tabBarIcon: ({ color }) => (
              <WalletIcon color={color} size={20} />
            ),
          }}
        />

        {/* Ocultar todas las sub-rutas secundarias del TabBar para que no aparezcan como botones */}
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="feed/search" options={{ href: null }} />

        <Tabs.Screen name="chat/[chatId]" options={{ href: null }} />
        <Tabs.Screen name="chat/follow/[followId]" options={{ href: null }} />
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

        <Tabs.Screen name="follows/index" options={{ href: null }} />
        <Tabs.Screen name="follows/[id]" options={{ href: null }} />

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
