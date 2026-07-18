import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
      <View className="flex-row gap-4 mb-6 br">
        {tabs.map((tab) => {
          const isActive = activeTabId === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTabId(tab.id)}
              className={`flex-1 py-3 items-center justify-center transition-colors border-b-[3px] ${isActive ? 'border-primary' : 'border-transparent hover:bg-background/50'
                }`}
            >
              {tab.icon}
              {typeof tab.label === 'string' ? (
                <Text className={`font-black text-center mt-2 text-xs uppercase tracking-wider ${isActive ? 'text-primary' : 'text-foreground'}`}>
                  {tab.label}
                </Text>
              ) : typeof tab.label === 'function' ? (
                tab.label(isActive)
              ) : (
                tab.label
              )}
            </TouchableOpacity>
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
