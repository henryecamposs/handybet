import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import HandyPostLogo from '../ui/HandyPostLogo';
import PostActionButtons from './PostActionButtons';
import PostMediaCarousel from './PostMediaCarousel';
import RepliesSection from './RepliesSection';
import { useToastStore } from '../../store/useToastStore';

interface PostDetailViewProps {
  post: any;
  onBack: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
  onMediaPress?: (index: number) => void;
  onSharePress?: () => void;
}

export default function PostDetailView({
  post,
  onBack,
  isLiked,
  onLikeToggle,
  onMediaPress,
  onSharePress
}: PostDetailViewProps) {
  const { addToast } = useToastStore();
  const colors = useThemeColors();
  const [isFollowing, setIsFollowing] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Twitter */}
      <View className="flex-row items-center border-b border-primary/20 py-2 px-4 bg-background/80 sticky top-0 z-10">
        <TouchableOpacity onPress={onBack} className="mr-2 p-1 rounded-full hover:bg-primary">
          <ArrowLeft size={22} color={colors.foreground} />
        </TouchableOpacity>
        <HandyPostLogo size="md" />
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Perfil del Autor */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border-2 border-primary/20" />
            <View>
              <Text className="text-white font-black text-base leading-tight">{post.author}</Text>
              <Text className="text-muted-foreground text-xs font-semibold">{post.username}</Text>
            </View>
          </View>
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
        </View>

        {/* Contenido / Texto */}
        <Text className="text-foreground text-[16px] leading-relaxed mb-4">{post.text}</Text>

        {/* Media (Imágenes / Videos) */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <View className="mb-4">
            <PostMediaCarousel
              mediaUrls={post.mediaUrls}
              mediaType={post.mediaType}
              onMediaPress={onMediaPress}
              height={300}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Sentimiento */}
        {post.feeling && (
          <View className="flex-row items-center gap-2 bg-zinc-900 border border-zinc-800 self-start px-3 py-1.5 rounded-full mb-4">
            <Text className="text-foreground text-xs font-semibold">
              Me siento <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
            </Text>
          </View>
        )}

        {/* Timestamp */}
        <View className="py-3 border-b border-zinc-800/80">
          <Text className="text-zinc-500 text-xs font-semibold">
            {post.time} · {new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </View>

        {/* Métricas / Stats de Interacción y Botones de Acción (Estilo Twitter Combinado) */}
        <View className="flex-row justify-between items-center py-2.5 border-b border-zinc-800/80 gap-2">
          {/* Métricas a la izquierda */}
          <View className="flex-row gap-4 items-center">
            <Text className="text-zinc-400 text-xs font-bold">
              <Text className="text-white font-black">{commentsCount}</Text> Respuestas
            </Text>
            <Text className="text-zinc-400 text-xs font-bold">
              <Text className="text-white font-black">{isLiked ? '1,201' : '1,200'}</Text> Likes
            </Text>
          </View>

          {/* Botones de Acción a la derecha */}
          <PostActionButtons
            isLiked={isLiked}
            onLikeToggle={onLikeToggle}
            onSharePress={onSharePress}
          />
        </View>

        <RepliesSection
          targetId={post.id}
          targetUsername={`@${post.username}`}
          onCommentsCountChange={setCommentsCount}
        />
      </ScrollView>
    </View>
  );
}
