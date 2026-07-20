import React, { useState } from 'react';
import { TouchableOpacity, Text, ViewStyle, Platform } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface IconButtonProps {
  icon?: any;
  label?: string;
  onPress: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'muted' | 'default';
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

  const [isHovered, setIsHovered] = useState(false);

  const isIconOnly = !!Icon && !label;

  let sizeClasses = '';
  let iconSize = 18;

  if (isIconOnly) {
    if (size === 'xs') { sizeClasses = 'w-6 h-6'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'w-8 h-8'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'w-10 h-10'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'w-12 h-12'; iconSize = 24; }
    else if (size === 'xl') { sizeClasses = 'w-14 h-14'; iconSize = 28; }
  } else {
    if (size === 'xs') { sizeClasses = 'px-2 py-1.5'; iconSize = 14; }
    else if (size === 'sm') { sizeClasses = 'px-3 py-1'; iconSize = 16; }
    else if (size === 'md') { sizeClasses = 'px-4 py-2'; iconSize = 18; }
    else if (size === 'lg') { sizeClasses = 'px-6 py-3'; iconSize = 24; }
    else if (size === 'xl') { sizeClasses = 'px-7 py-3.5'; iconSize = 28; }
  }

  const roundedClass = rounded ? `rounded-${rounded}` : (isIconOnly ? 'rounded-full' : (size === 'xs' ? 'rounded-xs' : 'rounded-full'));

  let bgClass = 'bg-background/80';
  let borderClass = hasBorder ? 'border border-border' : '';
  let textIconColor = iconColor || colors.primary;
  let textClass = 'text-primary';

  if (variant === 'destructive') {
    textIconColor = iconColor || colors.destructive;
    textClass = 'text-destructive';
  } else if (variant === 'secondary') {
    textIconColor = iconColor || colors.secondary;
    textClass = 'text-secondary';
  } else if (variant === 'ghost') {
    bgClass = 'bg-transparent';
    textIconColor = iconColor || colors.foreground;
    textClass = 'text-foreground';
  } else if (variant === 'muted') {
    textIconColor = iconColor || colors.mutedForeground;
    textClass = 'text-muted-foreground';
  } else if (variant === 'default') {
    textIconColor = iconColor || colors.foreground;
    textClass = 'text-foreground';
  }

  let overrideStyle: any = iconColor ? { color: iconColor } : undefined;

  if (isActive) {
    bgClass = 'bg-primary/10';
    borderClass = hasBorder ? 'border border-primary' : '';
    textIconColor = iconColor || colors.primary;
    textClass = 'text-primary';
  }

  if (isHovered && !isActive) {
    bgClass = 'bg-muted';
    if (variant === 'ghost' || variant === 'secondary') {
      textIconColor = colors.secondary;
      textClass = 'text-secondary';
      overrideStyle = undefined;
    } else {
      textIconColor = iconColor || colors.secondary;
      textClass = 'text-secondary';
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore - Web only
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore - Web only
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      style={style}
      className={`flex-row items-center justify-center transition-colors ${bgClass} ${borderClass} ${sizeClasses} ${roundedClass} ${className}`}
    >
      {Icon && <Icon size={iconSize} color={textIconColor} />}
      {label && (
        <Text
          style={overrideStyle}
          className={`font-semibold ${Icon ? 'ml-2.5' : ''} ${size === 'xs' ? 'text-xs' : size === 'sm' ? 'text-sm' : size === 'xl' ? 'text-lg font-black' : 'text-base'} ${overrideStyle ? '' : textClass}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
