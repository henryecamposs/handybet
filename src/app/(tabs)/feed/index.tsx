import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, TextInput, Modal, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { socialService } from '../../../services/socialService';
import { localDB } from '../../../lib/localDB';
import { Advertisement, VisibilityLevel } from '../../../types/handyBet';
import { useHandyBetStore } from '../../../store/useHandyBetStore';
import { useToastStore } from '../../../store/useToastStore';
import { groupMonetizationService } from '../../../services/groupMonetizationService';
import Logo from '@/components/ui/Logo';
import HandyAdsLogo from '@/components/ui/HandyAdsLogo';
import HandyPostLogo from '@/components/ui/HandyPostLogo';
import CreatePostWidget from '@/components/feed/CreatePostWidget';
import PostItem from '@/components/feed/PostItem';
import PostDetailView from '@/components/feed/PostDetailView';
import PostMediaViewer from '@/components/feed/PostMediaViewer';
import ShareModal from '@/components/feed/ShareModal';
import { Heart, MessageSquare, Share2, MoreVertical, LogOut, Star, User, Tv, Gamepad2, Bookmark, UserCheck, Users } from 'lucide-react-native';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';
import { useDevicePlatform } from '@/hooks/useDevicePlatform';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDesktop } = useDevicePlatform();
  const router = useRouter();
  const { scrollToPostId } = useLocalSearchParams();
  const scrollViewRef = React.useRef<ScrollView>(null);
  const postLayouts = React.useRef<Record<string, number>>({});
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Estados de la nueva publicación
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [selectedMediaPost, setSelectedMediaPost] = useState<any | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  // Estados de compartir y notificaciones
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharingPost, setSharingPost] = useState<any | null>(null);
  const { addToast } = useToastStore();
  const showToast = (message: string) => {
    addToast({
      title: message,
      variant: 'primary',
      position: 'bottom',
      duration: 3500
    });
  };

  const { mockSession } = useHandyBetStore();
  const colors = useThemeColors();
  useEffect(() => {
    fetchActiveAds();
    fetchPosts();
  }, []);

  useEffect(() => {
    if (scrollToPostId && posts.length > 0 && postLayouts.current[scrollToPostId as string] !== undefined) {
      const yOffset = postLayouts.current[scrollToPostId as string];
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      }, 100);
    }
  }, [scrollToPostId, posts]);

  async function fetchPosts() {
    try {
      const data = await socialService.getFeedPosts(mockSession?.id || 'usr_player1');
      const mapped = data.map((p) => {
        let authorName = p.author?.full_name || 'Usuario';
        let username = `@${p.author_id.slice(0, 8)}`;
        let avatar = p.author?.avatar_url || 'https://i.pravatar.cc/150';

        return {
          id: p.id,
          author: authorName,
          username: username,
          avatar: avatar,
          time: p.created_at ? new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
          text: p.content,
          mediaType: p.media_type || 'photo',
          mediaUrls: (p as any).media_urls || (p.media_url ? [p.media_url] : []),
          feeling: (p as any).feeling || null,
          group_id: p.group_id,
          channel_id: p.channel_id
        };
      });
      setPosts(mapped);
    } catch (err) {
      console.log('Error fetching posts', err);
    }
  }

  async function fetchActiveAds() {
    try {
      const data = await localDB.ads.getAll();
      setAds(data.filter((a: any) => a.is_active));
    } catch (err) {
      console.log('Error fetching advertisements:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublishPost(
    content: string,
    type: 'regular' | 'advertisement',
    visibility: VisibilityLevel,
    feeling?: any,
    mediaUrls?: string[],
    targetGroupId?: string | null,
    targetChannelId?: string | null
  ): Promise<boolean> {
    if ((!content.trim() && (!mediaUrls || mediaUrls.length === 0))) return false;
    const isAd = type === 'advertisement';
    try {
      const newPost = await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: targetGroupId || null,
        channel_id: targetChannelId || null,
        content: content,
        visibility_level: visibility,
        post_type: type,
        payment_status: isAd ? 'pendiente_pago' : 'none_required'
      });

      if (isAd) {
        setPendingPostId(newPost.id);
        setShowPaymentModal(true);
      } else {
        // Resolve target name
        let authorName = 'Usuario';
        let username = '@usr_play';
        let avatar = 'https://i.pravatar.cc/150';

        const mockNewPost = {
          id: newPost.id,
          author: authorName,
          username: username,
          avatar: avatar,
          time: 'Ahora mismo',
          text: content,
          mediaType: mediaUrls && mediaUrls.length > 0 && mediaUrls[0].includes('video') ? 'video' : 'photo',
          mediaUrls: mediaUrls || [],
          feeling: feeling,
          group_id: targetGroupId,
          channel_id: targetChannelId
        };
        setPosts(prev => [mockNewPost, ...prev]);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleConfirmPayment = async () => {
    if (!pendingPostId || !paymentRef.trim()) return;
    try {
      await groupMonetizationService.processSplitPayment(
        mockSession?.id || 'usr_player1',
        'usr_admin',
        'grp_1',
        2.50,
        0.90
      );

      // Activar post simulado en local
      const rawPosts = await socialService.getFeedPosts(mockSession?.id || 'usr_player1');
      const targetPost = rawPosts.find(p => p.id === pendingPostId);
      if (targetPost) {
        targetPost.payment_status = 'pagado';
      }

      alert('Pago verificado. Tu anuncio patrocinado ha sido activado en el feed.');
      setShowPaymentModal(false);
      setPaymentRef('');
      setPendingPostId(null);
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdPress = (deeplink: string | null) => {
    if (deeplink) {
      Linking.openURL(deeplink).catch((err) => console.error("Error opening URL:", err));
    }
  };

  const handleShareSuccess = (destinationName: string, type: string) => {
    addToast({
      title: '¡Compartido!',
      description: `Publicación compartida en ${type}: ${destinationName}`,
      variant: 'success',
      position: 'bottom'
    });
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView ref={scrollViewRef} className="flex-1 bg-background/80 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Logo size={isDesktop ? 'sm' : 'lg'} showImage={true} />

          {!isDesktop && (
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => router.push('/(tabs)/follows' as any)} className="p-1">
                <UserCheck size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/favorites' as any)} className="p-1">
                <Bookmark size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMobileMenu(true)} className="p-1">
                <MoreVertical size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Crear Publicación */}
        <CreatePostWidget onPublish={handlePublishPost} />

        {/* Feed List */}
        {posts.map((post) => (
          <View
            key={post.id}
            onLayout={(e) => {
              postLayouts.current[post.id] = e.nativeEvent.layout.y;
            }}
          >
            <PostItem
              post={post}
              isLiked={likedPosts.includes(post)}
              onLikeToggle={() => setLikedPosts(prev => prev.includes(post) ? prev.filter(p => p !== post) : [...prev, post])}
              isSaved={savedPosts.includes(post)}
              onSavePress={() => {
                const nextVal = !savedPosts.includes(post);
                setSavedPosts(prev => nextVal ? [...prev, post] : prev.filter(p => p !== post));
                showToast(nextVal ? 'Guardado en Favoritos' : 'Eliminado de Favoritos');
              }}
              onMediaPress={() => {
                router.push(`/feed/${post.id}?from=feed` as any);
              }}
              onCommentPress={() => {
                router.push(`/feed/${post.id}?from=feed` as any);
              }}
              onSharePress={() => {
                setSharingPost(post);
                setShowShareModal(true);
              }}
            />
          </View>
        ))}

        {/* Inyección Dinámica de Publicidad (Eliminada según solicitud) */}

        {isLoading && (
          <ActivityIndicator size="small" color={colors.secondary} className="my-6" />
        )}
      </ScrollView>

      {/* Modal de Pago Split (Pay-to-Post) */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-6">
          <View className="bg-background/80 border border-border w-full max-w-sm  p-6 shadow-2xl">
            <Text className="text-foreground font-black text-lg mb-1">📢 Pago Requerido</Text>
            <Text className="text-foreground text-xs font-bold mb-4">Tu anuncio comercial o regla del grupo requiere activación de pago.</Text>

            <View className="bg-background/80 border border-border p-4  mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-foreground text-xs font-bold">Costo del Post:</Text>
                <Text className="text-foreground text-xs font-black">$2.50 USD</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-foreground text-xs font-bold">Split Creador (90%):</Text>
                <Text className="text-secondary text-xs font-black">$2.25 USD</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-foreground text-xs font-bold">Fee Plataforma (10%):</Text>
                <Text className="text-foreground text-xs font-black">$0.25 USD</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Código de Referencia de Pago</Text>
              <TextInput
                placeholder="Ej: PM-9821828"
                placeholderTextColor="#71717a"
                value={paymentRef}
                onChangeText={setPaymentRef}
                className="bg-background/80 border border-border rounded-xs px-4 py-2.5 text-white text-xs font-bold"
              />
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                className="flex-1 bg-background/80 border border-border py-3.5  items-center"
              >
                <Text className="text-foreground font-bold text-xs">Descartar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmPayment}
                disabled={!paymentRef.trim()}
                className="flex-1 bg-primary py-3.5  items-center"
              >
                <Text className="text-foreground font-black text-xs uppercase">Confirmar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Menú Móvil */}
      <Modal
        visible={showMobileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMobileMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-start items-end pt-16 pr-4"
          onPress={() => setShowMobileMenu(false)}
        >
          <View className="bg-background border border-border  w-56 overflow-hidden shadow-xl" onStartShouldSetResponder={() => true}>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 border-b border-border/50 hover:bg-zinc-900"
              onPress={() => { setShowMobileMenu(false); router.push('/(tabs)/channels' as any); }}
            >
              <Tv size={18} color="white" />
              <Text className="text-foreground font-semibold">Canales</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 border-b border-border/50 hover:bg-zinc-900"
              onPress={() => { setShowMobileMenu(false); router.push('/(tabs)/games' as any); }}
            >
              <Gamepad2 size={18} color="white" />
              <Text className="text-foreground font-semibold">Juegos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 border-b border-border/50 hover:bg-zinc-900"
              onPress={() => { setShowMobileMenu(false); router.push('/guardados' as any); }}
            >
              <Bookmark size={18} color="white" />
              <Text className="text-foreground font-semibold">Favoritos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 border-b border-border/50 hover:bg-zinc-900"
              onPress={() => { setShowMobileMenu(false); router.push('/(tabs)/profile'); }}
            >
              <User size={18} color="white" />
              <Text className="text-foreground font-semibold">Mi Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 border-b border-border/50 hover:bg-zinc-900"
              onPress={() => { setShowMobileMenu(false); showToast('Gracias por calificar la aplicación!'); }}
            >
              <Star size={18} color="white" />
              <Text className="text-foreground font-semibold">Calificar App</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center gap-3 p-3.5 hover:bg-red-900/20"
              onPress={() => {
                setShowMobileMenu(false);
                router.replace('/(auth)/login');
              }}
            >
              <LogOut size={18} color="#ef4444" />
              <Text className="text-red-500 font-semibold">Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <PostMediaViewer
        post={selectedMediaPost}
        visible={!!selectedMediaPost}
        initialIndex={selectedMediaIndex}
        onClose={() => {
          setSelectedMediaPost(null);
          setSelectedMediaIndex(0);
        }}
        isLiked={selectedMediaPost ? likedPosts.includes(selectedMediaPost) : false}
        onLikeToggle={() => {
          if (selectedMediaPost) {
            setLikedPosts(prev => prev.includes(selectedMediaPost) ? prev.filter(p => p !== selectedMediaPost) : [...prev, selectedMediaPost]);
          }
        }}
      />

      <ShareModal
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSharingPost(null);
        }}
        onShareSuccess={handleShareSuccess}
      />
    </View>
  );
}
