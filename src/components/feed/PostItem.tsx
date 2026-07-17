import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MessageSquare, Share2, Bell, EyeOff, X } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import PostActionButtons from './PostActionButtons';
import PostMediaCarousel from './PostMediaCarousel';
import { useToastStore } from '../../store/useToastStore';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';

interface PostItemProps {
  post: any;
  isLiked: boolean;
  onLikeToggle: () => void;
  onMediaPress?: (index: number) => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  isSaved?: boolean;
  onSavePress?: () => void;
}

export default function PostItem({ post, isLiked, onLikeToggle, onMediaPress, onCommentPress, onSharePress, isSaved, onSavePress }: PostItemProps) {
  const { addToast } = useToastStore();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const colors = useThemeColors();
  const { isDesktop } = useDevicePlatform();
  const isMobile = !isDesktop;

  if (isHidden) {
    return (
      <View className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-3xl mb-6 flex-row items-center justify-between shadow-sm">
        <Text className="text-zinc-400 text-xs font-bold">Publicación oculta de {post.author}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsHidden(false);
            addToast({ title: "Publicación restaurada", variant: "success", position: "bottom" });
          }}
          className="bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30"
        >
          <Text className="text-primary text-[10px] font-black uppercase">Deshacer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isMobile) {
    const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
    const limit = hasMedia ? 90 : 240;
    const postText = post.text || '';
    const isLongText = postText.length > limit;
    const displayText = isLongText && !expanded ? `${postText.slice(0, limit)}...` : postText;

    return (
      <View className="bg-primary/5 border border-primary/20 p-4 rounded-3xl mb-6 shadow-md flex-col">
        {/* Header: Mostrar avatar de usuario y nombre, seguir y el icono con popup */}
        <View className="flex-row items-center justify-between mb-3 relative z-50">
          <View className="flex-row items-center gap-3">
            <Image source={{ uri: post.avatar }} className="w-10 h-10 rounded-full border-2 border-primary/20" />
            <View>
              <Text className="text-foreground font-black text-sm">{post.author}</Text>
              <Text className="text-muted-foreground text-[10px] font-medium">{post.time}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                const nextVal = !isFollowing;
                setIsFollowing(nextVal);
                addToast({
                  title: nextVal ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`,
                  variant: nextVal ? 'secondary' : 'muted',
                  position: 'top-right'
                });
              }}
              className={`border px-2.5 py-1 rounded-full ${isFollowing
                ? 'border-muted-foreground bg-transparent'
                : 'border-primary bg-primary/5'
                }`}
            >
              <Text className={`text-[10px] font-normal ${isFollowing ? 'text-muted-foreground' : 'text-primary'
                }`}>
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptionsModal(!showOptionsModal)}>
              <Text className="text-primary font-black text-xl px-1">⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Menú desplegable local en movil */}
          {showOptionsModal && (
            <View className="absolute right-0 top-10 bg-background border border-primary/20 p-1.5 rounded-2xl w-40 z-50 shadow-2xl">
              <TouchableOpacity
                onPress={() => {
                  setShowOptionsModal(false);
                  onSharePress?.();
                }}
                className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
              >
                <Share2 size={15} color={colors.foreground} />
                <Text className="text-foreground text-xs font-semibold">Compartir</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const nextVal = !isNotificationsEnabled;
                  setIsNotificationsEnabled(nextVal);
                  setShowOptionsModal(false);
                  addToast({
                    title: nextVal ? "Notificaciones activadas" : "Notificaciones desactivadas",
                    variant: nextVal ? 'info' : 'muted',
                    position: 'bottom'
                  });
                }}
                className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
              >
                <Bell size={15} color={isNotificationsEnabled ? colors.primary : colors.foreground} />
                <Text className={`text-xs font-semibold ${isNotificationsEnabled ? 'text-primary' : 'text-foreground'}`}>
                  {isNotificationsEnabled ? 'Notif. Activas' : 'Notificar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsHidden(true);
                  setShowOptionsModal(false);
                  addToast({
                    title: "Publicación oculta",
                    variant: 'warning',
                    position: 'bottom'
                  });
                }}
                className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
              >
                <EyeOff size={15} color="#ef4444" />
                <Text className="text-red-500 text-xs font-semibold">No mostrar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Texto con límite de líneas y botón Ver más */}
        <TouchableOpacity activeOpacity={0.9} onPress={onCommentPress} className="mb-2 px-1">
          <Text className="text-foreground text-sm leading-relaxed">
            {displayText}
            {isLongText && !expanded && (
              <Text
                onPress={(e) => {
                  e.stopPropagation();
                  setExpanded(true);
                }}
                className="text-primary font-black ml-1"
              >
                {' '}Ver más
              </Text>
            )}
          </Text>
        </TouchableOpacity>

        {/* Sentimiento y Barra de Acciones (si no hay media) */}
        <View className="flex-row items-center justify-between border-zinc-800/50 py-1 my-1 px-1">
          <View className="flex-1">
            {post.feeling && (
              <View className="flex-row items-center gap-1.5 bg-background/80 border border-zinc-800 px-2.5 py-1 rounded-full self-start">
                {post.feeling.icon && React.createElement(post.feeling.icon, { size: 12, color: post.feeling.color })}
                <Text className="text-muted-foreground text-[10px] font-bold">
                  <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
                </Text>
              </View>
            )}
          </View>
          {!hasMedia && (
            <View className="flex-row items-center justify-center flex-1 ml-4 mt-1">
              <PostActionButtons
                isLiked={isLiked}
                likeCount={isLiked ? '1.2k' : '1.1k'}
                commentCount="342"
                onLikeToggle={onLikeToggle}
                onCommentPress={onCommentPress}
                onSharePress={onSharePress}
                isSaved={isSaved}
                onSavePress={onSavePress}
                variant="compact"
              />
            </View>
          )}
        </View>

        {/* Media content expandido en alto y ancho */}
        {hasMedia && (
          <View className="w-full rounded-2xl overflow-hidden mt-1 relative">
            <PostMediaCarousel
              mediaUrls={post.mediaUrls}
              mediaType={post.mediaType}
              onMediaPress={onMediaPress}
              height={320}
              resizeMode="cover"
            />
            {/* Action Bar Overlay sobre el contenido multimedia centrado horizontalmente */}
            <View className="absolute bottom-3 w-full items-center z-10">
              <View className="bg-black/50 backdrop-blur-md rounded-2xl px-2 py-1 shadow-lg border border-white/10">
                <PostActionButtons
                isLiked={isLiked}
                likeCount={isLiked ? '1.2k' : '1.1k'}
                commentCount="342"
                onLikeToggle={onLikeToggle}
                onCommentPress={onCommentPress}
                onSharePress={onSharePress}
                isSaved={isSaved}
                onSavePress={onSavePress}
                variant="compact"
              />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
  return (
    <View className="bg-primary/5 border border-primary/20 p-2 rounded-3xl mb-6 shadow-md flex-row gap-2">
      {/* Columna Izquierda: Foto de Perfil */}
      <View className="items-center">
        <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border-2 border-primary/20" />
      </View>

      {/* Columna Derecha: Todo el resto del contenido */}
      <View className="flex-1 relative">
        {/* Header Publicación */}
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center gap-1.5 flex-wrap">
            <Text className="text-foreground font-semibold text-base">{post.author}</Text>
            <Text className="text-muted-foreground text-xs font-semibold">{post.username} • {post.time}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => {
                const nextVal = !isFollowing;
                setIsFollowing(nextVal);
                addToast({
                  title: nextVal ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`,
                  variant: nextVal ? 'secondary' : 'muted',
                  position: 'top-right'
                });
              }}
              className={`border px-2.5 py-1 rounded-full ${isFollowing
                ? 'border-muted-foreground bg-transparent'
                : 'border-primary bg-primary/5'
                }`}
            >
              <Text className={`text-[10px] font-normal ${isFollowing ? 'text-muted-foreground' : 'text-primary'
                }`}>
                {isFollowing ? 'Siguiendo' : 'Seguir'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowOptionsModal(!showOptionsModal)}>
              <Text className="text-primary font-black text-xl px-1">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menú desplegable local (estilo Popover desde el icono) */}
        {showOptionsModal && (
          <View className="absolute right-0 top-8 bg-background border border-primary/20 p-1.5 rounded-2xl w-40 z-50 shadow-2xl">
            <TouchableOpacity
              onPress={() => {
                setShowOptionsModal(false);
                onSharePress?.();
              }}
              className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              <Share2 size={15} color={colors.foreground} />
              <Text className="text-foreground text-xs font-semibold">Compartir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const nextVal = !isNotificationsEnabled;
                setIsNotificationsEnabled(nextVal);
                setShowOptionsModal(false);
                addToast({
                  title: nextVal ? "Notificaciones activadas" : "Notificaciones desactivadas",
                  variant: nextVal ? 'info' : 'muted',
                  position: 'bottom'
                });
              }}
              className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              <Bell size={15} color={isNotificationsEnabled ? colors.primary : colors.foreground} />
              <Text className={`text-xs font-semibold ${isNotificationsEnabled ? 'text-primary' : 'text-foreground'}`}>
                {isNotificationsEnabled ? 'Notif. Activas' : 'Notificar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsHidden(true);
                setShowOptionsModal(false);
                addToast({
                  title: "Publicación oculta",
                  variant: 'warning',
                  position: 'bottom'
                });
              }}
              className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
            >
              <EyeOff size={15} color="#ef4444" />
              <Text className="text-red-500 text-xs font-semibold">No mostrar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Texto clickable */}
        <TouchableOpacity activeOpacity={0.8} onPress={onCommentPress} className="mb-1">
          <Text className="text-foreground text-sm leading-relaxed">{post.text}</Text>
        </TouchableOpacity>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <View className="w-full mb-1">
            <PostMediaCarousel
              mediaUrls={post.mediaUrls}
              mediaType={post.mediaType}
              onMediaPress={onMediaPress}
              height={192}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Reacciones y Sentimiento Inferior */}
        <View className="items-center mt-3 border-t border-zinc-800/50 pt-3 w-full">
          {post.feeling && (
            <View className="flex-row items-center gap-2 bg-background/80 border border-zinc-800 self-start px-3 py-1.5 rounded-full mb-3">
              {post.feeling.icon && React.createElement(post.feeling.icon, { size: 14, color: post.feeling.color })}
              <Text className="text-muted-foreground text-xs font-semibold">
                Me siento <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
              </Text>
            </View>
          )}

          <View className="flex-row justify-center w-full">
            <PostActionButtons
            isLiked={isLiked}
            likeCount={isLiked ? '1.2k' : '1.1k'}
            commentCount="342"
            onLikeToggle={onLikeToggle}
            onCommentPress={onCommentPress}
            onSharePress={onSharePress}
            isSaved={isSaved}
            onSavePress={onSavePress}
            variant="compact"
            />
          </View>
        </View>
      </View>


    </View>
  );
}
