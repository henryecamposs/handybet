import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MessageSquare, Share2, Bookmark } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';
import { useDevicePlatform } from '@/hooks/useDevicePlatform';
import PostActionButton from './PostActionButton';

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
    <View className={`flex-row items-center ${isCompact ? 'gap-4' : 'gap-1'}`}>
      <PostActionButton
        icon={Logo}
        isLogo={true}
        label={isCompact ? likeCount : (!isDesktop ? '' : 'Me gusta')}
        onPress={onLikeToggle}
        isCompact={isCompact}
        isActive={isLiked}
      />
      <PostActionButton
        icon={MessageSquare}
        label={isCompact ? commentCount : (!isDesktop ? '' : 'Comentar')}
        onPress={onCommentPress}
        isCompact={isCompact}
      />
      <PostActionButton
        icon={Share2}
        label={!isDesktop ? undefined : 'Compartir'}
        onPress={onSharePress}
        isCompact={isCompact}
      />
      <PostActionButton
        icon={Bookmark}
        label={!isDesktop ? undefined : 'Guardar'}
        onPress={onSavePress}
        isCompact={isCompact}
        isActive={isSaved}
        fill={isSaved ? colors.primary : "transparent"}
      />
    </View>
  );
}
