import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { localDB } from '../../../lib/localDB';
import { socialService } from '../../../services/socialService';
import { useHandyBetStore } from '../../../store/useHandyBetStore';
import { useThemeColors } from '../../../hooks/useThemeColors';
import PostItem from '../../../components/feed/PostItem';
import CreatePostWidget from '../../../components/feed/CreatePostWidget';
import PostDetailView from '../../../components/feed/PostDetailView';
import { VisibilityLevel } from '../../../types/handyBet';

export default function FeedSearchScreen() {
  const { id, from } = useLocalSearchParams<{ id: string, from?: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const { mockSession } = useHandyBetStore();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
  const [entity, setEntity] = useState<any>(null); // Channel, Group, User, or Post
  const [entityType, setEntityType] = useState<'channel' | 'group' | 'user' | 'post' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // States for interactive actions inside search
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const loadData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      if (id.startsWith('post_')) {
        setEntityType('post');
        const postData = await localDB.posts.getById(id);
        if (postData) {
          const resolved = await localDB.resolvePostWithAuthor(postData);
          setEntity(resolved);
        } else {
          // Check ads
          const ad = await localDB.ads.getById(id);
          if (ad) {
            setEntity({
              id: ad.id,
              author_id: 'ads',
              content: `${ad.business_name}\n\n${ad.ad_copy}`,
              media_urls: [ad.media_url],
              media_type: 'photo',
              post_type: 'advertisement',
              created_at: ad.created_at,
              author: { full_name: ad.business_name, avatar_url: 'https://i.pravatar.cc/150?u=ads' }
            });
          }
        }
      } else if (id.startsWith('ch_')) {
        setEntityType('channel');
        const channelData = await localDB.channels.getById(id);
        setEntity(channelData);
        
        // Is admin?
        if (channelData && mockSession) {
          setIsAdmin(channelData.owner_id === mockSession.id);
        }

        // Fetch posts for this channel
        const allPosts = await localDB.posts.getAll();
        const filtered = allPosts.filter((p: any) => p.channel_id === id);
        // Sort descending by date
        filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        const resolved = await Promise.all(filtered.map(p => localDB.resolvePostWithAuthor(p)));
        setPosts(resolved);
      } else if (id.startsWith('grp_')) {
        setEntityType('group');
        const groupData = await localDB.groups.getById(id);
        setEntity(groupData);

        // Is admin?
        if (groupData && mockSession) {
          // If group's channel is owned by current user
          const channelData = await localDB.channels.getById(groupData.channel_id);
          setIsAdmin(channelData?.owner_id === mockSession.id || mockSession.role === 'admin');
        }

        // Fetch posts for this group
        const allPosts = await localDB.posts.getAll();
        const filtered = allPosts.filter((p: any) => p.group_id === id);
        // Sort descending
        filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const resolved = await Promise.all(filtered.map(p => localDB.resolvePostWithAuthor(p)));
        setPosts(resolved);
      } else if (id.startsWith('usr_')) {
        setEntityType('user');
        const userData = await localDB.users.getById(id);
        setEntity(userData);
        setIsAdmin(userData?.id === mockSession?.id);

        // Fetch posts by this user
        const allPosts = await localDB.posts.getAll();
        const filtered = allPosts.filter((p: any) => p.author_id === id);
        // Sort
        filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        const resolved = await Promise.all(filtered.map(p => localDB.resolvePostWithAuthor(p)));
        setPosts(resolved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id, mockSession]);

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [id, loadData]);

  const handlePublishPost = async (
    content: string,
    type: 'regular' | 'advertisement',
    visibility: VisibilityLevel,
    feeling?: any,
    mediaUrls?: string[],
    targetGroupId?: string | null,
    targetChannelId?: string | null
  ): Promise<boolean> => {
    if (!content.trim() && (!mediaUrls || mediaUrls.length === 0)) return false;
    try {
      const newPost = await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: targetGroupId || null,
        channel_id: targetChannelId || null,
        content: content,
        visibility_level: visibility,
        post_type: type,
        payment_status: 'none_required'
      });

      // Reload posts
      loadData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleLikeToggle = async (postId: string) => {
    if (!mockSession) return;
    try {
      const liked = await socialService.toggleLike(postId, mockSession.id);
      if (liked) {
        setLikedPosts(prev => [...prev, postId]);
      } else {
        setLikedPosts(prev => prev.filter(p => p !== postId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveToggle = async (post: any) => {
    if (!mockSession) return;
    try {
      const allSaved = await localDB.saved_items.getAll();
      const existing = allSaved.find((s: any) => s.target_id === post.id && s.user_id === mockSession.id);
      if (existing) {
        await localDB.saved_items.delete(existing.id);
        setSavedPosts(prev => prev.filter(p => p !== post.id));
      } else {
        await localDB.saved_items.insert({
          id: localDB.generateId('sv'),
          user_id: mockSession.id,
          target_id: post.id,
          type: 'post',
          title: post.content ? post.content.slice(0, 40) + '...' : 'Publicación Guardada',
          created_at: new Date().toISOString()
        });
        setSavedPosts(prev => [...prev, post.id]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // Si es un post unitario (detailfeed)
  if (entityType === 'post' && entity) {
    const mappedPost = {
      id: entity.id,
      author: entity.channel?.name || entity.group?.name || entity.author?.full_name || 'Usuario',
      username: entity.channel ? `@canal_${entity.channel_id?.slice(0, 8)}` : entity.group ? `@grupo_${entity.group_id?.slice(0, 8)}` : `@${entity.author_id.slice(0, 8)}`,
      avatar: entity.channel ? 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60' : entity.group ? 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=60' : entity.author?.avatar_url || 'https://i.pravatar.cc/150',
      time: entity.created_at ? new Date(entity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
      text: entity.content,
      mediaType: entity.media_type || 'photo',
      mediaUrls: entity.media_urls || (entity.media_url ? [entity.media_url] : []),
      feeling: entity.feeling || null
    };

    return (
      <View className="flex-1 bg-background">
        <PostDetailView
          post={mappedPost}
          isLiked={likedPosts.includes(entity.id)}
          onLikeToggle={() => handleLikeToggle(entity.id)}
          isSaved={savedPosts.includes(entity.id)}
          onSavePress={() => handleSaveToggle(entity)}
          onBack={() => router.back()}
        />
      </View>
    );
  }

  // Determinar titulo del header
  let headerTitle = 'Búsqueda';
  let categoryText = 'Publicaciones';
  if (entityType === 'channel' && entity) {
    headerTitle = entity.name;
    categoryText = 'Canal Oficial';
  } else if (entityType === 'group' && entity) {
    headerTitle = entity.name;
    categoryText = 'Grupo y Sala';
  } else if (entityType === 'user' && entity) {
    headerTitle = `@${entity.username}`;
    categoryText = 'Perfil del Creador';
  }

  const handleBack = () => {
    if (from === 'channel') {
      router.push('/(tabs)/channels' as any);
    } else if (from === 'group') {
      router.push('/(tabs)/grupos' as any);
    } else if (from === 'follow') {
      router.push('/(tabs)/follows' as any);
    } else if (from === 'feed') {
      router.push('/(tabs)/feed' as any);
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header Estilo Twitter */}
      <View className="flex-row items-center justify-between border-b border-primary/20 py-2.5 px-4 bg-background/85 sticky top-0 z-10">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-zinc-800"
          >
            <ArrowLeft size={22} color={colors.foreground} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-white font-black text-sm uppercase tracking-wider leading-tight" numberOfLines={1}>{headerTitle}</Text>
            <Text className="text-zinc-500 text-[10px] font-bold uppercase">{categoryText} • {posts.length} Posts</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Editor de publicaciones (CreatePostWidget) para administradores */}
        {isAdmin && (entityType === 'channel' || entityType === 'group') && (
          <CreatePostWidget
            onPublish={handlePublishPost}
            forcedTarget={{
              id: entity.id,
              name: entity.name,
              type: entityType
            }}
          />
        )}

        {/* Listado de posts */}
        {posts.length === 0 ? (
          <View className="py-20 items-center justify-center border border-dashed border-zinc-800 rounded-3xl bg-primary/5">
            <Text className="text-foreground font-black text-md">Sin Publicaciones</Text>
            <Text className="text-zinc-500 text-xs mt-1.5 text-center px-6">
              Este {entityType === 'channel' ? 'canal' : 'grupo'} aún no registra publicaciones en su feed.
            </Text>
          </View>
        ) : (
          posts.map((p) => {
            let authorName = p.author?.full_name || 'Usuario';
            let username = `@${p.author_id.slice(0, 8)}`;
            let avatar = p.author?.avatar_url || 'https://i.pravatar.cc/150';

            if (p.channel) {
              authorName = p.channel.name;
              username = `@canal_${p.channel.id.slice(0, 8)}`;
              avatar = 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=150&auto=format&fit=crop&q=60';
            } else if (p.group) {
              authorName = p.group.name;
              username = `@grupo_${p.group.id.slice(0, 8)}`;
              avatar = 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=60';
            }

            const mappedPost = {
              id: p.id,
              author: authorName,
              username: username,
              avatar: avatar,
              time: p.created_at ? new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
              text: p.content,
              mediaType: p.media_type || 'photo',
              mediaUrls: p.media_urls || (p.media_url ? [p.media_url] : []),
              feeling: p.feeling || null
            };

            return (
              <PostItem
                key={p.id}
                post={mappedPost}
                isLiked={likedPosts.includes(p.id)}
                onLikeToggle={() => handleLikeToggle(p.id)}
                isSaved={savedPosts.includes(p.id)}
                onSavePress={() => handleSaveToggle(p)}
                onCommentPress={() => router.push(`/feed/${p.id}?from=search&searchId=${id}` as any)}
              />
            );
          })
        )}
        <View className="h-16" />
      </ScrollView>
    </View>
  );
}
