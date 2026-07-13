import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MessageSquare, Share2, Bell, EyeOff, X } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors } from '../../hooks/useThemeColors';

interface PostItemProps {
  post: any;
  isLiked: boolean;
  onLikeToggle: () => void;
  onMediaPress?: (index: number) => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onShowToast?: (message: string) => void;
}

export default function PostItem({ post, isLiked, onLikeToggle, onMediaPress, onCommentPress, onSharePress, onShowToast }: PostItemProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const colors = useThemeColors();

  if (isHidden) {
    return (
      <View className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl mb-6 flex-row items-center justify-between shadow-sm">
        <Text className="text-zinc-400 text-xs font-bold">Publicación oculta de {post.author}</Text>
        <TouchableOpacity 
          onPress={() => {
            setIsHidden(false);
            onShowToast?.("Publicación restaurada");
          }}
          className="bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30"
        >
          <Text className="text-primary text-[10px] font-black uppercase">Deshacer</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View className="bg-primary/5 border border-primary/20 p-5 rounded-3xl mb-6 shadow-md">
      {/* Header Publicación */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-3">
          <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border-2 border-primary/20" />
          <View>
            <Text className="text-white font-semibold text-base">{post.author}</Text>
            <Text className="text-foreground text-xs font-semibold">{post.username} • {post.time}</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={() => {
              const nextVal = !isFollowing;
              setIsFollowing(nextVal);
              onShowToast?.(nextVal ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`);
            }}
            className={`border px-2.5 py-1 rounded-full ${
              isFollowing 
                ? 'border-zinc-700 bg-transparent' 
                : 'border-primary bg-primary/5'
            }`}
          >
            <Text className={`text-[10px] font-normal ${
              isFollowing ? 'text-zinc-500' : 'text-primary'
            }`}>
              {isFollowing ? 'Siguiendo' : 'Seguir'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptionsModal(true)}>
            <Text className="text-foreground font-black text-xl px-1">⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Texto */}
      <Text className="text-foreground text-sm leading-relaxed mb-4">{post.text}</Text>

      {/* Media */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <View 
          className="w-full mb-4" 
          onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
        >
          {layoutWidth > 0 && (
            <>
              <ScrollView 
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false}
                className="w-full rounded-2xl overflow-hidden border border-zinc-800"
              >
                {post.mediaUrls.map((url: string, index: number) => (
                  <TouchableOpacity 
                    key={index} 
                    activeOpacity={0.9} 
                    onPress={() => onMediaPress?.(index)}
                    style={{ width: layoutWidth, height: 192 }} // 192 = h-48
                  >
                    {post.mediaType === 'photo' ? (
                      <Image source={{ uri: url }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <View className="w-full h-full bg-black justify-center items-center relative overflow-hidden">
                        <Image source={{ uri: url }} className="absolute inset-0 opacity-40" resizeMode="cover" />
                        <View className="bg-primary/90 w-14 h-14 rounded-full items-center justify-center shadow-lg border border-primary-400/50">
                          <Text className="text-white text-2xl ml-1">▶</Text>
                        </View>
                        <Text className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded text-white text-[10px] font-bold">
                          0:15
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              {/* Pagination Dots */}
              {post.mediaUrls.length > 1 && (
                <View className="flex-row justify-center items-center gap-1.5 mt-3">
                  {post.mediaUrls.map((_: any, i: number) => (
                    <View key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* Reacciones y Sentimiento Inferior */}
      <View className="flex-row items-center justify-between mt-4 border-t border-zinc-800/50 pt-4">
        <View className="flex-1">
          {post.feeling && (
            <View className="flex-row items-center gap-2 bg-background border border-zinc-800 self-start px-3 py-1.5 rounded-full">
              {post.feeling.icon && React.createElement(post.feeling.icon, { size: 14, color: post.feeling.color })}
              <Text className="text-foreground text-xs font-semibold">
                Me siento <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="flex-row items-center gap-1.5 px-2 py-1"
            onPress={onLikeToggle}
          >
            <Logo size="xs" showText={false} style={{ opacity: isLiked ? 1 : 0.4 }} />
            <Text className="text-foreground text-xs font-bold hover:text-secondary transition-colors">
              {isLiked ? '1.2k' : '1.1k'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onCommentPress}
            className="flex-row items-center gap-1.5 px-2 py-1"
          >
            <MessageSquare size={16} color="#a1a1aa" />
            <Text className="text-foreground text-xs font-bold">342</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={onSharePress}
            className="flex-row items-center gap-1.5 px-2 py-1"
          >
            <Share2 size={16} color="#a1a1aa" />
            <Text className="text-foreground text-xs font-bold">Compartir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Opciones (3 puntos) en Fila */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 bg-black/60 justify-center items-center p-4"
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View 
            className="bg-background border border-zinc-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative"
            onStartShouldSetResponder={() => true}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white font-black text-lg">Opciones</Text>
              <TouchableOpacity onPress={() => setShowOptionsModal(false)} className="bg-zinc-900 p-2 rounded-full absolute -right-2 -top-2">
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Fila de Opciones */}
            <View className="flex-row justify-between gap-2.5">
              {/* Compartir */}
              <TouchableOpacity 
                onPress={() => {
                  setShowOptionsModal(false);
                  onSharePress?.();
                }}
                className="flex-1 bg-zinc-900 border border-zinc-850 p-3 rounded-2xl items-center hover:bg-zinc-800"
              >
                <Share2 size={20} color="#a1a1aa" className="mb-2" />
                <Text className="text-white text-[10px] font-bold text-center">Compartir</Text>
              </TouchableOpacity>

              {/* Recibir Notificaciones */}
              <TouchableOpacity 
                onPress={() => {
                  const nextVal = !isNotificationsEnabled;
                  setIsNotificationsEnabled(nextVal);
                  setShowOptionsModal(false);
                  onShowToast?.(nextVal ? "Notificaciones activadas para esta publicación" : "Notificaciones desactivadas");
                }}
                className={`flex-1 border p-3 rounded-2xl items-center ${
                  isNotificationsEnabled ? 'bg-primary/10 border-primary' : 'bg-zinc-900 border-zinc-850'
                }`}
              >
                <Bell size={20} color={isNotificationsEnabled ? colors.primary : '#a1a1aa'} className="mb-2" />
                <Text className={`text-[10px] font-bold text-center ${
                  isNotificationsEnabled ? 'text-primary' : 'text-white'
                }`}>
                  {isNotificationsEnabled ? 'Notif. Activas' : 'Notificar'}
                </Text>
              </TouchableOpacity>

              {/* No Mostrar */}
              <TouchableOpacity 
                onPress={() => {
                  setIsHidden(true);
                  setShowOptionsModal(false);
                  onShowToast?.("Publicación oculta");
                }}
                className="flex-1 bg-zinc-900 border border-zinc-850 p-3 rounded-2xl items-center hover:bg-zinc-800"
              >
                <EyeOff size={20} color="#ef4444" className="mb-2" />
                <Text className="text-white text-[10px] font-bold text-center">No mostrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
