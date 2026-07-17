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
  rounded?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'full';
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
  rounded,
  className = '',
  style
}: IconButtonProps) {
  const colors = useThemeColors();

  const isIconOnly = !!Icon && !label;

  let sizeClasses = '';
  let iconSize = 18;

  if (isIconOnly) {
    if (size === 'xs') { sizeClasses = 'w-6 h-6'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'w-8 h-8'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'w-10 h-10'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'w-12 h-12'; iconSize = 24; }
  } else {
    if (size === 'xs') { sizeClasses = 'px-2 py-1.5'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'px-3 py-2'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'px-4 py-2'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'px-6 py-3'; iconSize = 24; }
  }

  const roundedClass = rounded ? `rounded-${rounded}` : (isIconOnly ? 'rounded-full' : (size === 'xs' ? 'rounded-xs' : 'rounded-full'));

  let bgClass = 'bg-background/80';
  let borderClass = hasBorder ? 'border border-border' : '';
  let textIconColor = iconColor || colors.primary;
  let textClass = 'text-primary';
  let hoverClass = 'hover:bg-primary/20';

  if (variant === 'destructive') {
    textIconColor = iconColor || colors.destructive;
    textClass = 'text-destructive';
    hoverClass = 'hover:bg-destructive/20';
  } else if (variant === 'ghost') {
    bgClass = 'bg-transparent';
    hoverClass = 'hover:bg-primary/20';
    textIconColor = iconColor || colors.foreground;
    textClass = 'text-foreground';
  } else if (variant === 'muted') {
    textIconColor = iconColor || colors.mutedForeground;
    textClass = 'text-muted-foreground';
    hoverClass = 'hover:bg-muted/20';
  } else if (variant === 'default') {
    textIconColor = iconColor || colors.foreground;
    textClass = 'text-foreground';
  }

  if (isActive) {
    bgClass = 'bg-primary/10';
    borderClass = hasBorder ? 'border border-primary' : '';
    textIconColor = iconColor || colors.primary;
    textClass = 'text-primary';
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style}
      className={`flex-row items-center justify-center transition-colors ${bgClass} ${borderClass} ${hoverClass} ${sizeClasses} ${roundedClass} ${className}`}
    >
      {Icon && <Icon size={iconSize} color={textIconColor} />}
      {label && (
        <Text
          style={iconColor ? { color: iconColor } : undefined}
          className={`font-semibold ${Icon ? 'ml-2.5' : ''} ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : 'text-base'} ${iconColor ? '' : textClass}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
