import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Smile, Reply, Copy, MoreHorizontal, Trash2 } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

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
  const [showOptions, setShowOptions] = useState(false);
  const isMe = msg.sender === 'me';
  const colors = useThemeColors();

  return (
    <View
      // @ts-ignore
      onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
      // @ts-ignore
      onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
      className={`mb-4 w-3/4 p-4 transition-colors rounded-none flex-row ${isHovered ? 'bg-muted/50' : ''} ${isMe ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
    >
      {/* Floating Action Icons on Hover */}
      {isHovered && isMe && (
        <View className="flex-row items-center justify-center gap-2 mr-3 opacity-80 h-full">
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors">
            <Smile size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => onReply?.(msg.id)}>
            <Reply size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => onCopy?.(msg.text)}>
            <Copy size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => setShowOptions(!showOptions)}>
            <MoreHorizontal size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          
          {/* Options Popup (Delete) */}
          {showOptions && (
            <TouchableOpacity 
              onPress={() => onDelete?.(msg.id)}
              className="absolute -top-10 bg-popover border border-border px-3 py-2 flex-row items-center gap-2 shadow-sm z-50 rounded-none"
            >
              <Trash2 size={14} color={colors.destructive} />
              <Text className="text-foreground text-xs font-black">Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Message Content Card */}
      <View
        className={`w-full p-4 border border-border/50 shadow-sm rounded-none ${
          isMe ? 'bg-secondary/10 border-secondary/20' : 'bg-background/80'
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
        <View className="flex-row items-center justify-center gap-2 ml-3 opacity-80 h-full">
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors">
            <Smile size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => onReply?.(msg.id)}>
            <Reply size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => onCopy?.(msg.text)}>
            <Copy size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-1 hover:bg-background rounded-full transition-colors" onPress={() => setShowOptions(!showOptions)}>
            <MoreHorizontal size={16} color={colors.mutedForeground} />
          </TouchableOpacity>
          
          {/* Options Popup (Report/Delete) */}
          {showOptions && (
            <TouchableOpacity 
              onPress={() => onDelete?.(msg.id)}
              className="absolute -top-10 bg-popover border border-border px-3 py-2 flex-row items-center gap-2 shadow-sm z-50 rounded-none"
            >
              <Trash2 size={14} color={colors.destructive} />
              <Text className="text-foreground text-xs font-black">Eliminar</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
