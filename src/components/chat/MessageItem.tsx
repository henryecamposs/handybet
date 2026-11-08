import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Smile, Reply, Copy, Trash2 } from 'lucide-react-native';
import { useTextColors, useBrandColors } from '@/hooks/useThemeColors';
import IconButton from '../ui/IconButton';

export interface MessageProps {
  id: string | number;
  sender: 'me' | 'them';
  text: string;
  time: string;
  mediaUrl?: string;
  buttons?: any[];
  isBotGenerated?: boolean;
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
  onPressButton?: (button: any) => void;
}

export default function MessageItem({ msg, onDelete, onReply, onCopy, onPressButton }: MessageItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);

  const emojis = ['👍', '❤️', '😂', '😮', '😢'];
  const isMe = msg.sender === 'me';
  const textColors = useTextColors();
  const brandColors = useBrandColors();

  return (
    <View
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`mb-3 flex-row items-center gap-2 max-w-[80%] ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
    >
      {/* Floating Action Icons on Hover for Sender (render on left of bubble) */}
      {(isHovered || showEmojis) && isMe && (
        <View className="flex-row items-center justify-center gap-1 mr-1 opacity-90 h-full">
          <IconButton icon={Smile} onPress={() => setShowEmojis(!showEmojis)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={brandColors.destructive} size="xs" hasBorder={false} />

          {showEmojis && (
            <View className="absolute -top-10 left-0 bg-card border border-white/15 px-2.5 py-1.5 flex-row gap-2 shadow-2xl rounded-full z-50 backdrop-blur-md">
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
        className={`p-4 border rounded-2xl shadow-lg backdrop-blur-md max-w-full ${isMe ? 'bg-secondary/25 border-secondary/40' : 'bg-card/75 border-border'}`}
      >
        {msg.isBotGenerated && (
          <View className="flex-row items-center gap-1.5 bg-primary/20 self-start px-2 py-0.5 rounded border border-primary/30 mb-2.5">
            <Text className="text-primary text-[9px] uppercase font-extrabold tracking-widest">🤖 Bot ERP Assistant</Text>
          </View>
        )}

        {msg.replyTo && (
          <View className="mb-2.5 pl-2 border-l-2 border-primary bg-black/30 py-1.5 px-2.5 rounded-r-xl">
            <Text className="text-xs font-bold text-primary">{msg.replyTo.sender === 'me' ? 'Tú' : 'Soporte HandyBet'}</Text>
            <Text className="text-xs text-muted-foreground mt-0.5" numberOfLines={1}>{msg.replyTo.text}</Text>
          </View>
        )}

        {msg.mediaUrl && (
          <Image
            source={{ uri: msg.mediaUrl }}
            className="w-64 h-40 bg-black/20 border border-white/10 mb-3 rounded-xl"
            resizeMode="cover"
          />
        )}
        <Text className={`text-sm leading-relaxed font-medium text-foreground`}>
          {msg.text}
        </Text>

        {/* Botones Interactivos si el mensaje los incluye */}
        {msg.buttons && msg.buttons.length > 0 && (
          <View className="mt-3.5 gap-2">
            {msg.buttons.map((btn: any) => (
              <TouchableOpacity
                key={btn.id}
                onPress={() => onPressButton?.(btn)}
                className="bg-primary px-4 py-2.5 rounded-full items-center active:scale-[0.98] transition-all shadow-md shadow-primary/10"
              >
                <Text className="text-foreground font-extrabold text-xs uppercase tracking-wider">{btn.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text className="text-[9px] font-bold text-right mt-2.5 uppercase font-mono text-muted-foreground">
          {msg.time}
        </Text>

        {/* Reaction */}
        {reaction && (
          <View
            className="absolute -bottom-4 right-3 bg-card border border-white/15 rounded-full px-2 py-0.5 flex-row items-center justify-center shadow-lg backdrop-blur-md"
            style={{ zIndex: 50, elevation: 5 }}
          >
            <Text className="text-xs">{reaction}</Text>
          </View>
        )}
      </View>

      {/* Floating Action Icons on Hover for Recipient (render on right of bubble) */}
      {(isHovered || showEmojis) && !isMe && (
        <View className="flex-row items-center justify-center gap-1 ml-1 opacity-90 h-full">
          <IconButton icon={Smile} onPress={() => setShowEmojis(!showEmojis)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Reply} onPress={() => onReply?.(msg.id)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Copy} onPress={() => onCopy?.(msg.text)} variant="ghost" rounded="full" iconColor={textColors.mutedForeground} size="xs" hasBorder={false} />
          <IconButton icon={Trash2} onPress={() => onDelete?.(msg.id)} variant="ghost" rounded="full" iconColor={brandColors.destructive} size="xs" hasBorder={false} />

          {showEmojis && (
            <View className="absolute -top-10 left-0 bg-card border border-white/15 px-2.5 py-1.5 flex-row gap-2 shadow-2xl rounded-full z-50 backdrop-blur-md">
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
