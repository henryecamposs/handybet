import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Linking, ActivityIndicator, TextInput , Modal } from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { Advertisement, VisibilityLevel } from '../../types/handyBet';
import { socialService } from '../../services/socialService';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { groupMonetizationService } from '../../services/groupMonetizationService';
import Logo from '@/components/ui/Logo';
import { Heart, MessageSquare, Share2 } from 'lucide-react-native';

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados de la nueva publicación
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'regular' | 'advertisement'>('regular');
  const [visibility, setVisibility] = useState<VisibilityLevel>('todos');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');
  const [pendingPostId, setPendingPostId] = useState<string | null>(null);

  const { mockSession } = useHandyBetStore();

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
        mediaUrl: p.media_url || 'https://placehold.co/600x400/222222/FFF?text=HandyBet+Post'
      }));
      setPosts(mapped);
    } catch (err) {
      console.log('Error fetching posts', err);
    }
  }

  async function fetchActiveAds() {
    try {
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setAds(data || []);
    } catch (err) {
      console.log('Error fetching advertisements:', err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePublishPost() {
    if (!postContent.trim()) return;
    const isAd = postType === 'advertisement';
    try {
      const newPost = await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: null,
        content: postContent,
        visibility_level: visibility,
        post_type: postType,
        payment_status: isAd ? 'pendiente_pago' : 'none_required'
      });

      if (isAd) {
        setPendingPostId(newPost.id);
        setShowPaymentModal(true);
      } else {
        fetchPosts();
      }
      setPostContent('');
    } catch (e) {
      console.error(e);
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

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <Logo size='sm' showImage={true} />
      </View>

      {/* Crear Publicación */}
      <View className="bg-background/90 border border-zinc-850 p-5 rounded-3xl mb-6 shadow-md">
        <Text className="text-foreground font-bold text-xs mb-3 uppercase tracking-wider">Crear Publicación</Text>
        <TextInput
          placeholder="¿Qué estás pensando?"
          placeholderTextColor="#71717a"
          multiline
          numberOfLines={3}
          value={postContent}
          onChangeText={setPostContent}
          className="bg-background border border-zinc-800 rounded-2xl px-4 py-3 text-white text-xs font-bold mb-3 outline-none min-h-[60px]"
        />
        <View className="flex-row justify-between items-center">
          <View className="flex-row gap-2">
            {/* Selector de tipo */}
            <TouchableOpacity
              onPress={() => setPostType(postType === 'regular' ? 'advertisement' : 'regular')}
              className={`px-3 py-1.5 rounded-full border ${postType === 'advertisement' ? 'bg-secondary/15 border-secondary' : 'bg-background border-zinc-850'}`}
            >
              <Text className={`text-[10px] font-black uppercase ${postType === 'advertisement' ? 'text-secondary' : 'text-foreground'}`}>
                {postType === 'advertisement' ? '📢 Anuncio' : '📝 Post Normal'}
              </Text>
            </TouchableOpacity>

            {/* Selector de Visibilidad */}
            <TouchableOpacity
              onPress={() => {
                const levels: VisibilityLevel[] = ['todos', 'amigos', 'amigos_de_mis_amigos'];
                const nextIndex = (levels.indexOf(visibility) + 1) % levels.length;
                setVisibility(levels[nextIndex]);
              }}
              className="px-3 py-1.5 rounded-full border bg-background border-zinc-850"
            >
              <Text className="text-[10px] font-black uppercase text-foreground">
                👁️ {visibility === 'todos' ? 'Público' : visibility === 'amigos' ? 'Amigos' : 'Relacional'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handlePublishPost}
            disabled={!postContent.trim()}
            className="bg-primary px-5 py-2 rounded-full"
          >
            <Text className="text-foreground font-black text-xs uppercase">Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed List */}
      {posts.map((post) => (
        <View key={post.id} className="bg-background/90 border border-zinc-850 p-5 rounded-3xl mb-6 shadow-md">
          {/* Header Publicación */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-3">
              <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border-2 border-primary/20" />
              <View>
                <Text className="text-white font-black text-base">{post.author}</Text>
                <Text className="text-foreground text-xs font-semibold">{post.username} • {post.time}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text className="text-foreground font-black text-xl">⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Texto */}
          <Text className="text-foreground text-sm leading-relaxed mb-4">{post.text}</Text>

          {/* Media */}
          {post.mediaType === 'photo' ? (
            <Image source={{ uri: post.mediaUrl }} className="w-full h-48 rounded-2xl border border-zinc-800" resizeMode="cover" />
          ) : (
            <View className="w-full h-48 rounded-2xl border border-zinc-800 bg-black justify-center items-center relative overflow-hidden">
              <Image source={{ uri: post.mediaUrl }} className="absolute inset-0 opacity-40" resizeMode="cover" />
              <View className="bg-primary/90 w-14 h-14 rounded-full items-center justify-center shadow-lg border border-primary-400/50">
                <Text className="text-white text-2xl ml-1">▶</Text>
              </View>
              <Text className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded text-white text-[10px] font-bold">
                0:15
              </Text>
            </View>
          )}

          {/* Reacciones */}
          <View className="items-center mt-4 border-t border-zinc-800/50 pt-4">
            <View className="flex-row justify-between items-center w-1/2">
              <TouchableOpacity className="flex-row items-center gap-2 px-2 py-1">
                <Heart size={16} color="#caee26" fill="#caee26" />
                <Text className="text-foreground text-xs font-bold hover:text-secondary transition-colors">1.2k</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-2 px-2 py-1">
                <MessageSquare size={16} color="#a1a1aa" />
                <Text className="text-foreground text-xs font-bold">342</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center gap-2 px-2 py-1">
                <Share2 size={16} color="#a1a1aa" />
                <Text className="text-foreground text-xs font-bold">Compartir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Inyección Dinámica de Publicidad */}
      {!isLoading && ads.length > 0 && (
        <View className="mb-8">
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Publicidad Patrocinada</Text>
          {ads.map((ad) => (
            <TouchableOpacity
              key={ad.id}
              onPress={() => handleAdPress(ad.target_deeplink)}
              className="bg-background/90 border border-zinc-850 p-4 rounded-3xl flex-row gap-4 mb-4 shadow-sm"
            >
              <Image source={{ uri: ad.media_url }} className="w-20 h-20 rounded-2xl border border-zinc-850" resizeMode="cover" />
              <View className="flex-1 justify-center">
                <Text className="text-secondary text-[10px] font-black uppercase tracking-wider">Patrocinado</Text>
                <Text className="text-white font-black text-sm mt-0.5">{ad.business_name}</Text>
                <Text className="text-foreground text-xs font-bold mt-1 line-clamp-2" numberOfLines={2}>
                  {ad.ad_copy}
                </Text>
                <Text className="text-foreground text-[10px] font-bold mt-1.5 uppercase font-mono">RIF: {ad.business_rif}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isLoading && (
        <ActivityIndicator size="small" color="#10b981" className="my-6" />
      )}

      {/* Modal de Pago Split (Pay-to-Post) */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-6">
          <View className="bg-background border border-zinc-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <Text className="text-foreground font-black text-lg mb-1">📢 Pago Requerido</Text>
            <Text className="text-foreground text-xs font-bold mb-4">Tu anuncio comercial o regla del grupo requiere activación de pago.</Text>

            <View className="bg-background border border-zinc-850 p-4 rounded-2xl mb-4">
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
                className="bg-background border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
              />
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                className="flex-1 bg-background border border-zinc-800 py-3.5 rounded-2xl items-center"
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

      <View className="h-16" />
    </ScrollView>
  );
}
