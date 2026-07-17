import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface IconButtonProps {
  icon?: any;
  label?: string;
  onPress: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'destructive' | 'ghost' | 'muted' | 'default';
  isActive?: boolean;
  hasBorder?: boolean;
  iconColor?: string;
  className?: string;
  style?: ViewStyle;
}

export default function IconButton({
  icon: Icon,
  label,
  onPress,
  size = 'md',
  variant = 'primary',
  isActive = false,
  hasBorder = true,
  iconColor,
  className = '',
  style
}: IconButtonProps) {
  const colors = useThemeColors();

  const isIconOnly = !!Icon && !label;
  
  let sizeClasses = '';
  let iconSize = 18;
  
  if (isIconOnly) {
    if (size === 'xs') { sizeClasses = 'w-6 h-6 rounded-full'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'w-8 h-8 rounded-full'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'w-10 h-10 rounded-full'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'w-12 h-12 rounded-full'; iconSize = 24; }
  } else {
    if (size === 'xs') { sizeClasses = 'px-2 py-1.5 rounded-xs'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'px-3 py-2 rounded-full'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'px-4 py-2 rounded-full'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'px-6 py-3 rounded-full'; iconSize = 24; }
  }

  let bgClass = 'bg-background/80';
  let borderClass = hasBorder ? 'border border-border' : '';
  let textIconColor = iconColor || colors.primary;
  let hoverClass = 'hover:bg-primary/20';

  if (variant === 'destructive') {
    textIconColor = iconColor || '#ef4444'; // colors.destructive doesn't exist in useThemeColors yet maybe? We will use literal if needed
    hoverClass = 'hover:bg-red-500/20';
  } else if (variant === 'ghost') {
    bgClass = 'bg-transparent';
    hoverClass = 'hover:bg-zinc-800/50';
    textIconColor = iconColor || colors.foreground;
  } else if (variant === 'muted') {
    textIconColor = iconColor || colors.mutedForeground;
    hoverClass = 'hover:bg-zinc-800/50';
  } else if (variant === 'default') {
    textIconColor = iconColor || colors.foreground;
  }

  if (isActive) {
    bgClass = 'bg-primary/10';
    borderClass = hasBorder ? 'border border-primary' : '';
    textIconColor = iconColor || colors.primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className={`flex-row items-center justify-center transition-colors ${bgClass} ${borderClass} ${hoverClass} ${sizeClasses} ${className}`}
    >
      {Icon && <Icon size={iconSize} color={textIconColor} />}
      {label && (
        <Text
          style={{ color: textIconColor }}
          className={`font-semibold ${Icon ? 'ml-2.5' : ''} ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
