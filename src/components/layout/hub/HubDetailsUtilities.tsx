import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, ChevronLeft } from 'lucide-react-native';

interface HubDetailsUtilitiesProps {
  avatarNode: React.ReactNode;
  title: string;
  subtitle: string;
  stats?: { value: string | number; label: string }[];
  onBack?: () => void;
  colors: any;
  children?: React.ReactNode; // Botones y links de acción
}

export default function HubDetailsUtilities({
  avatarNode,
  title,
  subtitle,
  stats,
  onBack,
  colors,
  children
}: HubDetailsUtilitiesProps) {
  return (
    <View className="px-4 flex-row items-end -mt-16 mb-2">
      {/* Columna Izquierda: Avatar */}
      <View className=" flex-row items-center gap-1 pr-2">
        <View className=" mr-3 self-start">
          {avatarNode}
        </View>
        {onBack && (
          <TouchableOpacity onPress={onBack} className="absolute p-1 -ml-1 rounded-full bg-card hover:bg-primary">
            <ChevronLeft size={20} color={colors.foreground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Columna Derecha: Título, utilidades y stats */}
      <View className="flex-1 pb-1">
        <View className="flex-row justify-between items-start">
          {/* Título y Botón Volver */}
          <Text className="text-xl font-black text-foreground tracking-tight" numberOfLines={1}>{title}</Text>

          {/* Acciones (Botones/Links) */}
          <View className="flex-row gap-2 items-center">
            {children}
          </View>
        </View>

        {/* Subtítulo y Stats */}
        <View className="flex-row gap-2 items-center">
          <Text className="text-muted-foreground text-xs font-medium">
            {subtitle.startsWith('@') ? subtitle : `@${subtitle}`}
          </Text>
          {stats && stats.length > 0 && (
            <View className="flex-row gap-4">
              {stats.map((stat, i) => (
                <View key={i} className="flex-row items-center justify-center">
                  <Text className="text-foreground font-semibold text-xs">{stat.value}</Text>
                  <Text className="text-muted-foreground text-[10px] ml-1 font-bold uppercase tracking-wider">{stat.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
