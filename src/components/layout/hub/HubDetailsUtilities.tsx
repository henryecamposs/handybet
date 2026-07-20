import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface HubDetailsUtilitiesProps {
  title: string;
  subtitle: string;
  stats?: { value: string | number; label: string }[];
  onBack?: () => void;
  colors: any;
  children?: React.ReactNode; // Botones y links de acción
}

export default function HubDetailsUtilities({ 
  title, 
  subtitle, 
  stats, 
  onBack, 
  colors, 
  children 
}: HubDetailsUtilitiesProps) {
  return (
    <View className="px-4 flex-row justify-between items-start mb-2">
      {/* Lado Izquierdo: Título, Subtítulo y Stats */}
      <View className="flex-1 pr-4">
        <View className="flex-row items-center gap-2 mb-1">
          {onBack && (
            <TouchableOpacity onPress={onBack} className="p-1 -ml-1">
              <ArrowLeft size={24} color={colors.foreground} />
            </TouchableOpacity>
          )}
          <Text className="text-2xl font-black text-foreground tracking-tight" numberOfLines={1}>{title}</Text>
        </View>
        
        <Text className="text-muted-foreground text-sm font-medium mb-1">
          {subtitle.startsWith('@') ? subtitle : `@${subtitle}`}
        </Text>
        
        {stats && stats.length > 0 && (
          <View className="flex-row gap-4 mt-1">
            {stats.map((stat, i) => (
              <View key={i} className="flex-row items-center">
                <Text className="text-foreground font-black text-sm">{stat.value}</Text>
                <Text className="text-muted-foreground text-xs ml-1 font-bold uppercase tracking-wider">{stat.label}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Lado Derecho: Acciones (Botones/Links) */}
      <View className="flex-row gap-2 items-center justify-end pt-1">
        {children}
      </View>
    </View>
  );
}
