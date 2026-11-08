import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { Smile, Reply, Copy, Trash2, Lock, Unlock, Sparkles } from 'lucide-react-native';
import { useTextColors, useBrandColors } from '@/hooks/useThemeColors';
import IconButton from '../ui/IconButton';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import { useToastStore } from '@/store/useToastStore';

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
  is_locked?: boolean;
  unlock_price?: number;
  preview_url?: string;
  media_type?: string;
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

  const { unlockedMediaIds, unlockMedia } = useHandyBetStore();
  const { addToast } = useToastStore();
  const isUnlocked = !msg.is_locked || unlockedMediaIds.includes(String(msg.id));

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

        {/* Paywall / Contenido Bloqueado VIP */}
        {msg.is_locked && !isUnlocked ? (
          <View className="w-64 bg-black/50 border border-amber-500/40 rounded-xl overflow-hidden mb-3 relative">
            <Image
              source={{ uri: msg.preview_url || msg.mediaUrl }}
              className="w-full h-44 opacity-30"
              blurRadius={Platform.OS === 'web' ? 20 : 15}
              resizeMode="cover"
            />
            <View className="absolute inset-0 items-center justify-center p-3 bg-black/40">
              <View className="w-10 h-10 rounded-full bg-amber-500/20 items-center justify-center mb-1.5 border border-amber-500/40">
                <Lock size={18} color="#f59e0b" />
              </View>
              <Text className="text-white font-extrabold text-xs text-center mb-0.5">
                Contenido VIP Exclusivo
              </Text>
              <Text className="text-amber-400 font-black text-xs mb-2">
                💎 {msg.unlock_price ?? 15}.00 VES / Pts
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const success = unlockMedia(String(msg.id), msg.unlock_price ?? 15);
                  if (success) {
                    addToast({ title: '¡Contenido Desbloqueado con éxito! 🔓', variant: 'success' });
                  } else {
                    addToast({ title: 'Saldo insuficiente en tu billetera. Recarga saldo.', variant: 'danger' });
                  }
                }}
                className="bg-amber-500 hover:bg-amber-400 active:scale-95 px-4 py-2 rounded-full flex-row items-center gap-1.5 shadow-lg"
              >
                <Sparkles size={14} color="#000000" />
                <Text className="text-black font-black text-[11px] uppercase tracking-wider">
                  Desbloquear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          (msg.mediaUrl || (msg.is_locked && isUnlocked)) && (
            <View className="mb-3">
              <Image
                source={{ uri: msg.mediaUrl || msg.preview_url }}
                className="w-64 h-44 bg-black/20 border border-white/10 rounded-xl"
                resizeMode="cover"
              />
              {msg.is_locked && isUnlocked && (
                <View className="flex-row items-center gap-1 mt-1.5 self-start bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  <Unlock size={11} color="#10b981" />
                  <Text className="text-emerald-400 text-[10px] font-bold">Desbloqueado</Text>
                </View>
              )}
            </View>
          )
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
