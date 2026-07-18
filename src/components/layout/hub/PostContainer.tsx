import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import PostItem from '../../feed/PostItem';

export interface PostContainerProps {
  title?: string;
  posts: any[];
  onViewAll?: () => void;
  viewAllLabel?: string;
  onLikeToggle?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
}

export default function PostContainer({
  title = 'Últimas Publicaciones',
  posts,
  onViewAll,
  viewAllLabel = 'Ver todas',
  onLikeToggle,
  onCommentPress,
}: PostContainerProps) {
  if (posts.length === 0) return null;

  return (
    <View className="mb-8 mt-6">
      <View className="flex-row justify-between bg-muted items-center mb-4 p-2">
        <Text className="text-foreground font-semibold text-lig uppercase tracking-wider  ">{title}</Text>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text className="text-muted-foreground text-xs font-bold  hover:text-secondary">{viewAllLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View className="space-y-4">
        {posts.map((rawPost) => {
          let authorName = rawPost.author?.full_name || 'Comunidad';
          let username = `@${rawPost.author?.username || 'usuario'}`;
          let avatar = rawPost.author?.avatar_url || 'https://i.pravatar.cc/150';
          if (rawPost.channel) {
            authorName = rawPost.channel.name;
            username = `@canal_${rawPost.channel_id?.slice(0, 8)}`;
            avatar = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60';
          } else if (rawPost.group) {
            authorName = rawPost.group.name;
            username = `@grupo_${rawPost.group_id?.slice(0, 8)}`;
            avatar = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=60';
          }
          const postForComponent = {
            id: rawPost.id,
            author: authorName,
            username: username,
            avatar: avatar,
            time: rawPost.created_at ? new Date(rawPost.created_at).toLocaleDateString() : 'Novedad',
            text: rawPost.content,
            mediaType: rawPost.media_type || 'photo',
            mediaUrls: rawPost.media_urls || (rawPost.media_url ? [rawPost.media_url] : []),
            feeling: rawPost.feeling || null,
            group_id: rawPost.group_id,
            channel_id: rawPost.channel_id
          };

          return (
            <PostItem
              key={postForComponent.id}
              post={postForComponent}
              isLiked={false}
              onLikeToggle={() => onLikeToggle?.(rawPost.id)}
              onCommentPress={() => onCommentPress?.(rawPost.id)}
              onSharePress={() => { }}
              onSavePress={() => { }}
            />
          );
        })}
      </View>
    </View>
  );
}
