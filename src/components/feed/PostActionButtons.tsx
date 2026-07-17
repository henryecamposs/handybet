import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MessageSquare, Share2, Bookmark } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';
import { useDevicePlatform } from '@/hooks/useDevicePlatform';

interface PostActionButtonsProps {
  isLiked: boolean;
  isSaved?: boolean;
  likeCount?: string | number;
  commentCount?: string | number;
  onLikeToggle: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onSavePress?: () => void;
  variant?: 'full' | 'compact';
}

export default function PostActionButtons({
  isLiked,
  isSaved = false,
  likeCount = '0',
  commentCount = '0',
  onLikeToggle,
  onCommentPress,
  onSharePress,
  onSavePress,
  variant = 'full'
}: PostActionButtonsProps) {
  const isCompact = variant === 'compact';
  const colors = useThemeColors();
  const { isDesktop } = useDevicePlatform();
  return (
    <View className={`flex-row items-center ${isCompact ? 'gap-4' : 'gap-2'}`}>
      <TouchableOpacity
        onPress={onLikeToggle}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors px-1 py-1`}
      >
        <Logo size="xs" showText={false} style={{ opacity: isLiked ? 1 : (isCompact ? 0.3 : 0.4) }} />
        <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold hover:text-secondary transition-colors`}>
          {isCompact ? likeCount : (!isDesktop ? '' : 'Me gusta')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCommentPress}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors px-1 py-1`}
      >
        <MessageSquare size={isCompact ? 16 : 15} color={isCompact ? colors.mutedForeground : colors.mutedForeground} />
        <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold`}>
          {isCompact ? commentCount : (!isDesktop ? '' : 'Comentar')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSharePress}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors px-1 py-1`}
      >
        <Share2 size={isCompact ? 16 : 15} color={isCompact ? colors.mutedForeground : colors.mutedForeground} />
        {!isDesktop ? null : (
          <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold`}>
            Compartir
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSavePress}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors px-1 py-1`}
      >
        <Bookmark size={isCompact ? 16 : 15} color={isSaved ? colors.primary : colors.mutedForeground} fill={isSaved ? colors.primary : "transparent"} />
        {!isDesktop ? null : (
          <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold`}>
            Guardar
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
