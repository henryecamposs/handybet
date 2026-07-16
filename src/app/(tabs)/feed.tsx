import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, TextInput, Modal } from 'react-native';
import { socialService } from '../../services/socialService';
import { localDB } from '../../lib/localDB';
import { Advertisement, VisibilityLevel } from '../../types/handyBet';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useToastStore } from '../../store/useToastStore';
import { groupMonetizationService } from '../../services/groupMonetizationService';
import Logo from '@/components/ui/Logo';
import HandyAdsLogo from '@/components/ui/HandyAdsLogo';
import HandyPostLogo from '@/components/ui/HandyPostLogo';
import CreatePostWidget from '@/components/feed/CreatePostWidget';
import PostItem from '@/components/feed/PostItem';
import PostDetailView from '@/components/feed/PostDetailView';
import PostMediaViewer from '@/components/feed/PostMediaViewer';
import ShareModal from '@/components/feed/ShareModal';
import { Heart, MessageSquare, Share2 } from 'lucide-react-native';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de la nueva publicación
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [selectedMediaPost, setSelectedMediaPost] = useState<any | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

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

  async function fetchPosts() {
    try {
      const data = await socialService.getFeedPosts(mockSession?.id || 'usr_player1');
      const mapped = data.map((p) => ({
        id: p.id,
        author: p.author?.full_name || 'Usuario',
        username: `@${p.author_id.slice(0, 8)}`,
        avatar: p.author?.avatar_url || 'https://i.pravatar.cc/150',
        time: p.created_at ? new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hace un momento',
        text: p.content,
        mediaType: p.media_type || 'photo',
        mediaUrls: (p as any).media_urls || (p.media_url ? [p.media_url] : []), // Soportar múltiples imágenes
        feeling: (p as any).feeling || null // Si el backend lo guardara
      }));
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

  async function handlePublishPost(content: string, type: 'regular' | 'advertisement', visibility: VisibilityLevel, feeling?: any, mediaUrls?: string[]): Promise<boolean> {
    if ((!content.trim() && (!mediaUrls || mediaUrls.length === 0))) return false;
    const isAd = type === 'advertisement';
    try {
      const newPost = await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: null,
        content: content,
        visibility_level: visibility,
        post_type: type,
        payment_status: isAd ? 'pendiente_pago' : 'none_required'
      });

      if (isAd) {
        setPendingPostId(newPost.id);
        setShowPaymentModal(true);
      } else {
        // Simulamos que el nuevo post tiene el sentimiento y se agrega localmente
        const mockNewPost = {
          id: newPost.id,
          author: 'Usuario',
          username: '@usr_play',
          avatar: 'https://i.pravatar.cc/150',
          time: 'Ahora mismo',
          text: content,
          mediaType: mediaUrls && mediaUrls.length > 0 && mediaUrls[0].includes('video') ? 'video' : 'photo',
          mediaUrls: mediaUrls || [],
          feeling: feeling
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
      {selectedPost ? (
        <PostDetailView
          post={selectedPost}
          onBack={() => setSelectedPost(null)}
          isLiked={likedPosts.includes(selectedPost)}
          onLikeToggle={() => setLikedPosts(prev => prev.includes(selectedPost) ? prev.filter(p => p !== selectedPost) : [...prev, selectedPost])}
          onMediaPress={() => { }}
          onSharePress={() => {
            setSharingPost(selectedPost);
            setShowShareModal(true);
          }}
        />
      ) : (
        <ScrollView className="flex-1 bg-background/80 px-4 pt-4" showsVerticalScrollIndicator={true}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Logo size='sm' showImage={true} />
          </View>

          {/* Crear Publicación */}
          <CreatePostWidget onPublish={handlePublishPost} />

          {/* Feed List */}
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              isLiked={likedPosts.includes(post)}
              onLikeToggle={() => setLikedPosts(prev => prev.includes(post) ? prev.filter(p => p !== post) : [...prev, post])}
              onMediaPress={() => {
                setSelectedPost(post);
              }}
              onCommentPress={() => {
                setSelectedPost(post);
              }}
              onSharePress={() => {
                setSharingPost(post);
                setShowShareModal(true);
              }}
            />
          ))}

          {/* Inyección Dinámica de Publicidad (Eliminada según solicitud) */}

          {isLoading && (
            <ActivityIndicator size="small" color={colors.secondary} className="my-6" />
          )}
        </ScrollView>
      )}

      {/* Modal de Pago Split (Pay-to-Post) */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-6">
          <View className="bg-background/80 border border-zinc-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <Text className="text-foreground font-black text-lg mb-1">📢 Pago Requerido</Text>
            <Text className="text-foreground text-xs font-bold mb-4">Tu anuncio comercial o regla del grupo requiere activación de pago.</Text>

            <View className="bg-background/80 border border-zinc-850 p-4 rounded-2xl mb-4">
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
                className="bg-background/80 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
              />
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                className="flex-1 bg-background/80 border border-zinc-800 py-3.5 rounded-2xl items-center"
              >
                <Text className="text-foreground font-bold text-xs">Descartar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmPayment}
                disabled={!paymentRef.trim()}
                className="flex-1 bg-primary py-3.5 rounded-2xl items-center"
              >
                <Text className="text-foreground font-black text-xs uppercase">Confirmar Pago</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
