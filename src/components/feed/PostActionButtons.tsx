import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MessageSquare, Share2 } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';

interface PostActionButtonsProps {
  isLiked: boolean;
  likeCount?: string | number;
  commentCount?: string | number;
  onLikeToggle: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  variant?: 'full' | 'compact';
}

export default function PostActionButtons({
  isLiked,
  likeCount = '0',
  commentCount = '0',
  onLikeToggle,
  onCommentPress,
  onSharePress,
  variant = 'full'
}: PostActionButtonsProps) {
  const isCompact = variant === 'compact';
  const colors = useThemeColors();
  return (
    <View className="flex-row gap-1 items-center">
      <TouchableOpacity
        onPress={onLikeToggle}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors ${isCompact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      >
        <Logo size="xs" showText={false} style={{ opacity: isLiked ? 1 : (isCompact ? 0.3 : 0.4) }} />
        <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold hover:text-secondary transition-colors`}>
          {isCompact ? likeCount : 'Me gusta'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onCommentPress}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors ${isCompact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      >
        <MessageSquare size={isCompact ? 16 : 15} color={isCompact ? colors.mutedForeground : colors.mutedForeground} />
        <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold`}>
          {isCompact ? commentCount : 'Comentar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSharePress}
        className={`flex-row items-center gap-1.5 rounded-xl hover:bg-muted transition-colors ${isCompact ? 'px-2 py-1' : 'px-3 py-1.5'}`}
      >
        <Share2 size={isCompact ? 16 : 15} color={isCompact ? colors.mutedForeground : colors.mutedForeground} />
        <Text className={`${isCompact ? 'text-muted-foreground' : 'text-foreground'} text-xs font-bold`}>
          Compartir
        </Text>
      </TouchableOpacity>
    </View>
  );
}
