import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Smile, Reply, Copy, Trash2 } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import IconButton from '../ui/IconButton';

export interface MessageProps {
  id: string | number;
  sender: 'me' | 'them';
  text: string;
  time: string;
  mediaUrl?: string;
}

interface MessageItemProps {
  msg: MessageProps;
  onDelete?: (id: string | number) => void;
  onReply?: (id: string | number) => void;
  onCopy?: (text: string) => void;
}

export default function MessageItem({ msg, onDelete, onReply, onCopy }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isMe = msg.sender === 'me';
  const colors = useThemeColors();

  return (
    <View
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`mb-2 w-3/4 p-4 transition-colors rounded-xl flex-row ${isHovered ? 'bg-muted/50' : ''} ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
    >
      {/* Floating Action Icons on Hover */}
      {isHovered && isMe && (
        <View className="flex-row items-center justify-center gap-1 mr-3 opacity-80 h-full">
          <IconButton icon={Smile} onPress={() => {}} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.destructive} size="xs" hasBorder={false} />
        </View>
      )}

      {/* Message Content Card */}
      <View
        className={`w-full p-4 border border-border/50 rounded-xl shadow-sm  ${isMe ? 'bg-secondary/10 border-secondary/20' : 'bg-background/80'
          }`}
      >
        {msg.mediaUrl && (
          <Image
            source={{ uri: msg.mediaUrl }}
            className="w-full h-40 bg-muted border border-border/20 mb-3 rounded-none"
            resizeMode="cover"
          />
        )}
        <Text className={`text-sm leading-5 font-medium ${isMe ? 'text-secondary' : 'text-foreground'}`}>
          {msg.text}
        </Text>
        <Text className={`text-[9px] font-bold text-right mt-2 uppercase font-mono ${isMe ? 'text-secondary/70' : 'text-muted-foreground'}`}>
          {msg.time}
        </Text>
      </View>

      {/* Floating Action Icons on Hover for 'Them' */}
      {isHovered && !isMe && (
        <View className="flex-row items-center justify-center gap-1 ml-3 opacity-80 h-full">
          <IconButton icon={Smile} onPress={() => {}} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.destructive} size="xs" hasBorder={false} />
        </View>
      )}
    </View>
  );
}
