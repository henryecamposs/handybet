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
  replyTo?: {
    id: string | number;
    text: string;
    sender: 'me' | 'them';
  };
}

interface MessageItemProps {
  msg: MessageProps;
  onDelete?: (id: string | number) => void;
  onReply?: (id: string | number) => void;
  onCopy?: (text: string) => void;
}

export default function MessageItem({ msg, onDelete, onReply, onCopy }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢'];
  const isMe = msg.sender === 'me';
  const colors = useThemeColors();

  return (
    <View
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`w-3/4 p-3 transition-colors rounded-xl flex-row ${isHovered ? 'bg-muted/50' : ''} ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
    >
      {/* Floating Action Icons on Hover */}
      {(isHovered || showEmojis) && isMe && (
        <View className="flex-row items-center justify-center gap-1 mr-1 opacity-80 h-full">
          <IconButton icon={Smile} onPress={() => setShowEmojis(!showEmojis)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.destructive} size="xs" hasBorder={false} />
          
          {showEmojis && (
            <View className="absolute -top-10 left-0 bg-popover border border-border px-2 py-1 flex-row gap-2 shadow-sm rounded-full z-50">
              {emojis.map(e => (
                <TouchableOpacity key={e} onPress={() => { setReaction(e); setShowEmojis(false); }}>
                  <Text className="text-base">{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Message Content Card */}
      <View
        className={`w-full p-2 border border-border/50 rounded-xl shadow-sm  ${isMe ? 'bg-primary/10 border-primary/20' : 'bg-background/80'
          }`}
      >
        {msg.replyTo && (
          <View className="mb-2 pl-2 border-l-4 border-primary bg-background/30 py-1 px-2 rounded-r-md">
            <Text className="text-xs font-bold text-primary">{msg.replyTo.sender === 'me' ? 'Tú' : 'Soporte La Imaginaria'}</Text>
            <Text className="text-xs text-muted-foreground" numberOfLines={1}>{msg.replyTo.text}</Text>
          </View>
        )}

        {msg.mediaUrl && (
          <Image
            source={{ uri: msg.mediaUrl }}
            className="w-full h-40 bg-muted border border-border/20 mb-3 rounded-none"
            resizeMode="cover"
          />
        )}
        <Text className={`text-sm leading-5 font-medium ${isMe ? 'text-primary' : 'text-foreground'}`}>
          {msg.text}
        </Text>
        <Text className={`text-[9px] font-bold text-right mt-2 uppercase font-mono ${isMe ? 'text-primary/70' : 'text-muted-foreground'}`}>
          {msg.time}
        </Text>
        
        {/* Reaction */}
        {reaction && (
          <View className={`absolute -bottom-3 ${isMe ? '-left-3' : '-right-3'} bg-background border border-border/50 rounded-full w-6 h-6 items-center justify-center`}>
            <Text className="text-xs">{reaction}</Text>
          </View>
        )}
      </View>

      {/* Floating Action Icons on Hover for 'Them' */}
      {(isHovered || showEmojis) && !isMe && (
        <View className="flex-row items-center justify-center gap-1 ml-3 opacity-80 h-full">
          <IconButton icon={Smile} onPress={() => setShowEmojis(!showEmojis)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={colors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={colors.destructive} size="xs" hasBorder={false} />

          {showEmojis && (
            <View className="absolute -top-10 left-0 bg-popover border border-border px-2 py-1 flex-row gap-2 shadow-sm rounded-full z-50">
              {emojis.map(e => (
                <TouchableOpacity key={e} onPress={() => { setReaction(e); setShowEmojis(false); }}>
                  <Text className="text-base">{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
