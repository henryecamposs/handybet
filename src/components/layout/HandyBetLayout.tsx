import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';
import LeftSidebarWidgets from '../widgets/LeftSidebarWidgets';
import HandyBetHeader from './HandyBetHeader';
import RightSidebarWidgets from '../widgets/RightSidebarWidgets';
import NewsCenterView from '../widgets/center/NewsCenterView';
import PrizesCenterView from '../widgets/center/PrizesCenterView';
import FriendRequestsCenterView from '../widgets/center/FriendRequestsCenterView';

interface HandyBetLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function HandyBetLayout({ children, title }: HandyBetLayoutProps) {
  type LayoutView = 'feed' | 'all-news' | 'news-detail' | 'all-prizes' | 'prize-detail' | 'all-follow-suggestions' | 'follow-suggestion-detail';
  const [currentView, setCurrentView] = useState<LayoutView>('feed');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSelectNews = (id: string | null) => {
    if (id === null) { setCurrentView('feed'); setSelectedItemId(null); }
    else if (id === 'all') { setCurrentView('all-news'); setSelectedItemId(null); }
    else { setCurrentView('news-detail'); setSelectedItemId(id); }
  };

  const handleSelectPrize = (id: string | null) => {
    if (id === null) { setCurrentView('feed'); setSelectedItemId(null); }
    else if (id === 'all') { setCurrentView('all-prizes'); setSelectedItemId(null); }
    else { setCurrentView('prize-detail'); setSelectedItemId(id); }
  };

  const handleSelectFollowSuggestion = (id: string | null) => {
    if (id === null) { setCurrentView('feed'); setSelectedItemId(null); }
    else if (id === 'all') { setCurrentView('all-follow-suggestions'); setSelectedItemId(null); }
    else { setCurrentView('follow-suggestion-detail'); setSelectedItemId(id); }
  };

  const { isDesktop } = useDevicePlatform();




  if (!isDesktop) {
    return <View className="flex-1 bg-background">{children}</View>;
  }

  return (
    <View className="flex-1 h-screen max-h-screen overflow-hidden bg-background/80 text-foreground flex-col">
      {/* HEADER TOP NAVBAR */}
      <HandyBetHeader />

      {/* BODY DE 3 COLUMNAS */}
      <View className="flex-1 flex-row w-full max-w-[1600px] mx-auto relative bg-background">

        {/* 1. SIDEBAR IZQUIERDO (20%) */}
        <LeftSidebarWidgets />

        {/* 2. ÁREA CENTRAL (FEED) (60%) */}
        <View className="w-[60%] flex-col relative z-0">
          <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 2, paddingTop: 2, paddingBottom: 14 }} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>

          {/* CAPA SUPERPUESTA PARA WIDGETS */}
          {currentView !== 'feed' && (
            <View className="absolute inset-0 bg-background/80 z-50">
              <NewsCenterView
                currentView={currentView as any}
                selectedItemId={selectedItemId}
                onBack={() => handleSelectNews(null)}
                onSelectNews={handleSelectNews}
              />
              <PrizesCenterView
                currentView={currentView as any}
                selectedItemId={selectedItemId}
                onBack={() => handleSelectPrize(null)}
                onSelectPrize={handleSelectPrize}
              />
              <FriendRequestsCenterView
                currentView={currentView as any}
                selectedItemId={selectedItemId}
                onBack={() => handleSelectFollowSuggestion(null)}
              />
            </View>
          )}
        </View>

        {/* 3. SIDEBAR DERECHO (WIDGETS - Contenedores) (20%) */}
        <RightSidebarWidgets
          onSelectNews={handleSelectNews}
          onSelectPrize={handleSelectPrize}
          onSelectFollowSuggestion={handleSelectFollowSuggestion}
        />
      </View>
    </View>
  );
}
