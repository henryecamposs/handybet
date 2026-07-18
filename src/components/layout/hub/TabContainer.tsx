import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';

export interface TabItem {
  id: string;
  label: React.ReactNode | ((isActive: boolean) => React.ReactNode) | string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabContainerProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

export default function TabContainer({ tabs, defaultTabId }: TabContainerProps) {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <View className="flex-1">
      {/* Selector de pestañas */}
      <View className="flex-row mb-6 br">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <TabItemComponent
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onPress={() => setActiveTabId(tab.id)}
            />
          );
        })}
      </View>

      {/* Contenido de la pestaña activa */}
      <View className="flex-1 pb-4 border-b-[3px] border-border-muted">
        {activeTab?.content}
      </View>
    </View>
  );
}

function TabItemComponent({ tab, isActive, onPress }: { tab: TabItem; isActive: boolean; onPress: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  let bgClass = isActive ? 'bg-background' : 'bg-muted';
  let textClass = isActive ? 'text-primary' : 'text-muted-foreground';
  let borderClass = isActive ? 'border-primary' : 'border-b-[1px] border-border-muted';

  if (isHovered && !isActive) {
    bgClass = 'bg-background';
    textClass = 'text-secondary';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore - Web only
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore - Web only
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`flex-1 py-3 items-center justify-center transition-colors border-b-[3px] ${bgClass} ${borderClass}`}
    >
      {tab.icon}
      {typeof tab.label === 'string' ? (
        <Text className={`font-black text-center mt-2 text-xs uppercase tracking-wider transition-colors ${textClass}`}>
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

