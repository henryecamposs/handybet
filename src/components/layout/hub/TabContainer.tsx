import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, ScrollView } from 'react-native';

export interface TabItem {
  id: string;
  label: React.ReactNode | ((isActive: boolean) => React.ReactNode) | string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabContainerProps {
  tabs: TabItem[];
  defaultTabId?: string;
  onTabChange?: (tabId: string) => void;
}

export default function TabContainer({ tabs, defaultTabId, onTabChange }: TabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    onTabChange?.(id);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return (
    <View className="w-full">
      {/* Barra de pestañas con altura compacta y scroll horizontal controlado */}
      <View className="w-full border-b border-white/10 mb-4 bg-white/5 rounded-xl overflow-hidden shrink-0">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, height: 46 }}
          contentContainerStyle={{ alignItems: 'center', height: 46 }}
        >
          <View className="flex-row items-center h-[46px] min-w-full">
            {tabs.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <TabItemComponent
                  key={tab.id}
                  tab={tab}
                  isActive={isActive}
                  onPress={() => handleSelectTab(tab.id)}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Contenido de la pestaña activa en flujo natural */}
      <View className="w-full">
        {activeTab?.content}
      </View>
    </View>
  );
}

function TabItemComponent({
  tab,
  isActive,
  onPress,
}: {
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  let bgClass = isActive ? 'bg-primary/10' : 'bg-transparent';
  let textClass = isActive ? 'text-primary font-black' : 'text-muted-foreground font-semibold';
  let borderClass = isActive ? 'border-primary' : 'border-transparent';

  if (isHovered && !isActive) {
    bgClass = 'bg-white/5';
    textClass = 'text-foreground';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore - Web only
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore - Web only
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`min-w-[120px] md:flex-1 h-[46px] px-5 flex-row items-center justify-center transition-colors border-b-2 ${bgClass} ${borderClass}`}
    >
      {tab.icon && <View className="mr-2">{tab.icon}</View>}
      {typeof tab.label === 'string' ? (
        <Text
          className={`text-center text-xs uppercase tracking-wider transition-colors ${textClass}`}
        >
          {tab.label}
        </Text>
      ) : typeof tab.label === 'function' ? (
        tab.label(isActive)
      ) : (
        tab.label
      )}
    </TouchableOpacity>
  );
}
