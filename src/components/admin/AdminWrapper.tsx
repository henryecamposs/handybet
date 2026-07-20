import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { usePathname } from 'expo-router';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { LayoutDashboard, Users, Activity, Settings, LogOut, Menu, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ADMIN_AUTH_KEY = 'handybet_admin_auth';

export function AdminWrapper({ children, title }: { children: React.ReactNode, title: string }) {
  const { navigateDirect, replaceRoute } = useAppNavigation();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(ADMIN_AUTH_KEY);
    replaceRoute('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} color={pathname === '/admin' ? '#3b82f6' : '#9ca3af'} /> },
    { name: 'Tráfico Web', path: '/admin/traffic', icon: <Activity size={20} color={pathname === '/admin/traffic' ? '#3b82f6' : '#9ca3af'} /> },
  ];

  return (
    <View className="flex-1 bg-gray-900 flex-row">
      {/* Sidebar - Desktop */}
      {Platform.OS === 'web' && (
        <View className="hidden md:flex w-64 bg-gray-800 border-r border-gray-700 p-4">
          <View className="mb-8 mt-4">
            <Text className="text-white text-2xl font-bold">HandyBet Admin</Text>
          </View>
          <View className="flex-1 space-y-2">
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.path}
                className={`flex-row items-center p-3 rounded-lg ${pathname === item.path ? 'bg-blue-500/10' : 'hover:bg-gray-700/50'}`}
                onPress={() => navigateDirect(item.path)}
              >
                {item.icon}
                <Text className={`ml-3 font-medium ${pathname === item.path ? 'text-blue-500' : 'text-gray-300'}`}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            className="flex-row items-center p-3 rounded-lg hover:bg-gray-700/50 mt-auto"
            onPress={handleLogout}
          >
            <LogOut size={20} color="#f87171" />
            <Text className="ml-3 font-medium text-red-400">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Content */}
      <View className="flex-1 flex-col">
        {/* Header - Mobile & Desktop */}
        <View className="bg-gray-800 border-b border-gray-700 p-4 flex-row justify-between items-center z-20">
          <View className="flex-row items-center">
            {Platform.OS !== 'web' || true ? (
              <TouchableOpacity className="md:hidden mr-4" onPress={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
              </TouchableOpacity>
            ) : null}
            <Text className="text-white text-xl font-semibold">{title}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} className="md:hidden">
             <LogOut size={20} color="#f87171" />
          </TouchableOpacity>
        </View>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <View className="absolute top-[68px] left-0 right-0 bg-gray-800 border-b border-gray-700 z-10 shadow-lg md:hidden">
            {navItems.map((item) => (
              <TouchableOpacity
                key={item.path}
                className={`flex-row items-center p-4 border-b border-gray-700/50 ${pathname === item.path ? 'bg-blue-500/10' : ''}`}
                onPress={() => {
                  setMenuOpen(false);
                  navigateDirect(item.path);
                }}
              >
                {item.icon}
                <Text className={`ml-3 font-medium text-lg ${pathname === item.path ? 'text-blue-500' : 'text-gray-300'}`}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <ScrollView className="flex-1 p-4 md:p-8" contentContainerStyle={{ paddingBottom: 40 }}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}
