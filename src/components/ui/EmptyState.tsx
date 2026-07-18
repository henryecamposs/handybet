import React from 'react';
import { View, Text } from 'react-native';

export interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  iconSize?: number;
  iconColor?: string;
  variant?: 'dashed' | 'solid' | 'transparent';
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  iconSize = 48,
  iconColor = '#52525b',
  variant = 'dashed',
  className = '',
}: EmptyStateProps) {
  let bgClass = '';
  switch (variant) {
    case 'solid':
      bgClass = 'bg-card border border-border';
      break;
    case 'dashed':
      bgClass = 'bg-background/50 border border-dashed border-border';
      break;
    case 'transparent':
      bgClass = '';
      break;
  }

  return (
    <View className={`flex-1 items-center justify-center min-h-[40vh] rounded-2xl p-6 mt-2 ${bgClass} ${className}`}>
      {Icon && <Icon size={iconSize} color={iconColor} className="mb-4" />}
      <Text className="text-foreground font-bold text-lg text-center">{title}</Text>
      {description && (
        <Text className="text-muted-foreground text-sm text-center mt-2 max-w-[250px]">
          {description}
        </Text>
      )}
    </View>
  );
}
