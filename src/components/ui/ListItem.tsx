import React from 'react';
import { View, Text, TouchableOpacity, Image, ViewStyle } from 'react-native';

export type TextVariant = 'muted' | 'primary' | 'secondary' | 'destructive' | 'foreground' | string;

export interface ListItemProps {
  title: string;
  titleVariant?: TextVariant;
  subtitle?: string;
  subtitleVariant?: TextVariant;
  
  avatar?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  
  onPress?: () => void;
  
  hasBorderBottom?: boolean;
  bgClass?: string;
  className?: string;
  style?: ViewStyle;
}

export default function ListItem({
  title,
  titleVariant = 'foreground',
  subtitle,
  subtitleVariant = 'muted',
  avatar,
  leftElement,
  rightElement,
  onPress,
  hasBorderBottom = true,
  bgClass = 'bg-transparent',
  className = '',
  style
}: ListItemProps) {
  
  const getVariantClass = (variant: TextVariant) => {
    if (variant === 'muted') return 'text-muted-foreground';
    if (variant === 'primary') return 'text-primary';
    if (variant === 'secondary') return 'text-secondary';
    if (variant === 'destructive') return 'text-destructive';
    if (variant === 'foreground') return 'text-foreground';
    return '';
  };

  const getVariantStyle = (variant: TextVariant) => {
    if (['muted', 'primary', 'secondary', 'destructive', 'foreground'].includes(variant)) {
      return undefined;
    }
    return { color: variant };
  };

  const titleClass = getVariantClass(titleVariant);
  const titleStyle = getVariantStyle(titleVariant);
  
  const subtitleClass = getVariantClass(subtitleVariant);
  const subtitleStyle = getVariantStyle(subtitleVariant);

  const containerClasses = `flex-row items-center justify-between px-2 py-3 hover:bg-primary/5 transition-colors ${hasBorderBottom ? 'border-b border-border' : ''} ${bgClass} ${className}`;

  const InnerContent = () => (
    <View className="flex-row items-center flex-1">
      {leftElement ? (
        <View className="mr-3">
          {leftElement}
        </View>
      ) : avatar ? (
        <Image source={{ uri: avatar }} className="w-10 h-10 rounded-full bg-background/80 mr-3 border border-border" />
      ) : null}
      
      <View className="flex-1 justify-center">
        <Text style={titleStyle} className={`font-bold text-base ${titleClass}`} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={subtitleStyle} className={`text-xs font-semibold mt-0.5 ${subtitleClass}`} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        className={containerClasses} 
        style={style}
      >
        <InnerContent />
        {rightElement && (
          <View className="flex-row gap-2 ml-2">
            {rightElement}
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View className={containerClasses} style={style}>
      <InnerContent />
      {rightElement && (
        <View className="flex-row gap-2 ml-2">
          {rightElement}
        </View>
      )}
    </View>
  );
}
