import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PostDetailView from '@/components/feed/PostDetailView';
import { localDB } from '../../../lib/localDB';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function FeedPostDetailScreen() {
  const { id, from } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadPost = React.useCallback(async () => {
    try {
      let found = await localDB.posts.getById(id as string);
      if (found) {
        // Resolve author from DB
        const resolved = await localDB.resolvePostWithAuthor(found);
        
        let authorName = resolved.author?.full_name || 'Usuario';
        let username = `@${resolved.author_id.slice(0, 8)}`;
        let avatar = resolved.author?.avatar_url || 'https://i.pravatar.cc/150';

        if (resolved.channel) {
          authorName = resolved.channel.name;
          username = `@canal_${resolved.channel.id.slice(0, 8)}`;
          avatar = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60';
        } else if (resolved.group) {
          authorName = resolved.group.name;
          username = `@grupo_${resolved.group.id.slice(0, 8)}`;
          avatar = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=60';
        }

        const mappedPost = {
          id: resolved.id,
          author: authorName,
          username: username,
          avatar: avatar,
          time: resolved.created_at ? new Date(resolved.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
          text: resolved.content,
          mediaType: resolved.media_type || 'photo',
          mediaUrls: resolved.media_urls || (resolved.media_url ? [resolved.media_url] : []),
          feeling: (resolved as any).feeling || null,
          group_id: resolved.group_id,
          channel_id: resolved.channel_id
        };
        setPost(mappedPost);
      } else {
        // If not found in posts, try ads
        const ad = await localDB.ads.getById(id as string);
        if (ad) {
          const mappedAd = {
            id: ad.id,
            author: ad.business_name || 'Anuncio Patrocinado',
            username: `@${ad.domain || 'patrocinado'}`,
            avatar: 'https://i.pravatar.cc/150?u=ads',
            time: ad.created_at ? new Date(ad.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Anuncio',
            text: `${ad.title}\n\n${ad.description}`,
            mediaType: 'photo',
            mediaUrls: ad.image_url ? [ad.image_url] : [],
            feeling: null
          };
          setPost(mappedAd);
        } else {
          setPost(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPost();
  }, [id, loadPost]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View className="flex-1 bg-background justify-center items-center p-4">
        <Text className="text-foreground text-lg text-center mb-4">La publicación no está disponible o ha sido eliminada.</Text>
        <TouchableOpacity onPress={() => router.back()} className="px-6 py-3 bg-primary rounded-xl">
          <Text className="text-background font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <PostDetailView 
        post={post}
        isLiked={false}
        onLikeToggle={() => {}}
        onBack={() => {
          if (from === 'feed') {
            router.replace({ pathname: '/(tabs)/feed', params: { scrollToPostId: id } });
          } else {
            router.back();
          }
        }}
      />
    </View>
  );
}
