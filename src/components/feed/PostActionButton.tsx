import React, { useState } from 'react';
import { TouchableOpacity, Text, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

export interface PostActionButtonProps {
  icon: any;
  label?: string | number;
  onPress?: () => void;
  isCompact?: boolean;
  isActive?: boolean;
  activeColor?: string;
  defaultColor?: string;
  isLogo?: boolean;
  fill?: string;
}

export default function PostActionButton({
  icon: Icon,
  label,
  onPress,
  isCompact = false,
  isActive = false,
  activeColor,
  defaultColor,
  isLogo = false,
  fill = 'transparent',
}: PostActionButtonProps) {
  const colors = useThemeColors();
  const [isHovered, setIsHovered] = useState(false);
  
  const iconSize = isCompact ? 16 : 18;
  const pxClass = isCompact ? 'px-2 py-1' : 'px-3 py-1.5';
  
  const resolvedDefaultColor = defaultColor || colors.mutedForeground;
  const resolvedActiveColor = activeColor || colors.primary;
  
  // As requested: "eventos: hovel : bg-muted, text-secondary.icon secondary"
  const currentColor = isActive 
    ? resolvedActiveColor 
    : (isHovered ? colors.secondary : resolvedDefaultColor);
    
  const getTextColorClass = () => {
    if (isActive) {
      if (activeColor === colors.primary) return 'text-primary';
      if (activeColor === colors.secondary) return 'text-secondary';
      return 'text-foreground';
    }
    if (isHovered) return 'text-secondary';
    return isCompact ? 'text-muted-foreground' : 'text-foreground';
  };

  const handleMouseEnter = () => {
    if (Platform.OS === 'web') setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    if (Platform.OS === 'web') setIsHovered(false);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      // @ts-ignore
      onMouseEnter={handleMouseEnter}
      // @ts-ignore
      onMouseLeave={handleMouseLeave}
      className={`flex-row items-center gap-1.5 rounded-full transition-colors ${pxClass} ${isHovered ? 'bg-muted' : ''}`}
    >
      {isLogo ? (
        <Icon size="xs" showText={false} style={{ opacity: isActive ? 1 : (isHovered ? 0.6 : (isCompact ? 0.3 : 0.4)) }} />
      ) : (
        <Icon size={iconSize} color={currentColor} fill={fill} />
      )}
      {label !== undefined && label !== '' && label !== null && (
        <Text className={`${getTextColorClass()} text-xs font-bold transition-colors`}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}
