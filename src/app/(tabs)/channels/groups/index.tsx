import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { localDB } from '../../../../lib/localDB';
import { useHandyBetStore } from '../../../../store/useHandyBetStore';
import { useGetMediaVault, useSubscribeToMediaPlan } from '../../../../hooks/useHandyBetQueries';
import BetMatrixBuilder from '../../../../components/betting/BetMatrixBuilder';
import QRDisplayZone from '../../../../components/betting/QRDisplayZone';
import MediaVaultGrid from '../../../../components/media/MediaVaultGrid';
import TierPlanSelector from '../../../../components/media/TierPlanSelector';
import { MediaPlan, VisibilityLevel } from '../../../../types/handyBet';
import CreatePostWidget from '../../../../components/feed/CreatePostWidget';
import { socialService } from '../../../../services/socialService';
import { useThemeColors } from '../../../../hooks/useThemeColors';
import { MessageCircle, ArrowLeft, Bookmark, LayoutList, Users, Info, MoreHorizontal, UserCheck, UserPlus, Tv } from 'lucide-react-native';
import HubDetailLayout from '../../../../components/layout/HubDetailLayout';
import { TabContainer } from '../../../../components/layout/hub';
import PostContainer from '../../../../components/layout/hub/PostContainer';
import EmptyState from '../../../../components/ui/EmptyState';
import { useToastStore } from '../../../../store/useToastStore';
import IconButton from '../../../../components/ui/IconButton';

export default function GrupoDetailScreen() {
  const { id, from } = useLocalSearchParams<{ id: string; from: string }>();
  const router = useRouter();
  const colors = useThemeColors();

  // Estados de Apuesta
  const [generatedBetCode, setGeneratedBetCode] = useState<string | null>(null);

  // Estados de Media Vault / Suscripciones
  const [plans, setPlans] = useState<MediaPlan[]>([]);
  const [userActiveSubs, setUserActiveSubs] = useState<string[]>([]);
  const [showPlansSelector, setShowPlansSelector] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const { data: mediaItems = [], isLoading: isLoadingMedia } = useGetMediaVault(id || '');
  const subscribeMutation = useSubscribeToMediaPlan();

  const [group, setGroup] = useState<any>(null);
  const [groupType, setGroupType] = useState<string>('apuestas');
  const [isAdmin, setIsAdmin] = useState(false);
  const [groupPosts, setGroupPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(true);
  const { addToast } = useToastStore();
  const { mockSession } = useHandyBetStore();

  async function loadGroupData() {
    if (!id) return;
    try {
      const g = await localDB.groups.getById(id as string);
      setGroup(g);
      if (g) {
        setGroupType(g.type || 'apuestas');
        if (mockSession) {
          const channel = await localDB.channels.getById(g.channel_id);
          setIsAdmin(channel?.owner_id === mockSession.id || mockSession.role === 'admin');
        }
      }
      const allPosts = await localDB.posts.getAll();
      const filtered = allPosts.filter((p: any) => p.group_id === id);
      filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const resolved = await Promise.all(filtered.map(p => localDB.resolvePostWithAuthor(p)));
      setGroupPosts(resolved);
    } catch (e) {
      console.log('Error loading group data:', e);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadGroupData();
    }, 0);
  }, [id, mockSession]);

  async function fetchPlansAndSubs() {
    try {
      setIsLoadingPlans(true);
      const userId = mockSession?.id || 'usr_henry';

      const groupData = await localDB.groups.getById(id as string);
      if (groupData && groupData.channel_id) {
        const channel = await localDB.channels.getById(groupData.channel_id);
        setPlans(channel?.plans || []);
      }

      const allSubs = await localDB.user_subscriptions.getAll();
      const userSubs = allSubs.filter((s: any) => s.user_id === userId && s.is_active);
      setUserActiveSubs(userSubs.map((s: any) => s.plan_id));
    } catch (err) {
      console.log('Error fetching plans/subs:', err);
    } finally {
      setIsLoadingPlans(false);
    }
  }

  useEffect(() => {
    if (groupType === 'compartir_media' && id) {
      fetchPlansAndSubs();
    }
  }, [id, groupType]);

  const handlePurchasePlan = async (planId: string) => {
    try {
      await subscribeMutation.mutateAsync(planId);
      setUserActiveSubs([...userActiveSubs, planId]);
      setShowPlansSelector(false);
    } catch (err) {
      throw err;
    }
  };

  const handleBetGenerated = async (betData: any) => {
    try {
      const userId = mockSession?.id || 'usr_henry';
      const prefix = group?.short_code || '0000';
      const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
      const betCode = `${prefix}-${randomSuffix}`;

      await localDB.bets.insert({
        id: localDB.generateId('bet'),
        group_id: id || '',
        user_id: userId,
        bet_code: betCode,
        bet_data: betData,
        amount: betData.totalAmount,
        potential_prize: betData.totalAmount * 50,
        status: 'pendiente',
        created_at: new Date().toISOString()
      });

      setGeneratedBetCode(betCode);
    } catch (err: any) {
      alert(err.message || 'Error al guardar apuesta.');
    }
  };

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
      await socialService.createPost({
        author_id: mockSession?.id || 'usr_player1',
        group_id: id as string,
        channel_id: null,
        content: content,
        visibility_level: visibility,
        post_type: type,
        payment_status: 'none_required'
      });
      alert('¡Publicación creada exitosamente en el grupo!');
      loadGroupData();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleBack = () => {
    if (from === 'channel' && group?.channel_id) {
      router.push(`/channels/${group.channel_id}` as any);
    } else {
      router.push('/(tabs)/grupos' as any);
    }
  };

  const handleChatPress = () => {
    router.push(`/chat/${id}?from=${from}` as any);
  };

  const heroBanner = group && (
    <View className="mb-6">
      {/* Cover Portada */}
      <View className="h-44 bg-background/80 relative w-full border-b border-border-muted ">
        <View className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background/50" />
      </View>

      {/* Avatar y Acciones Rápidas */}
      <View className="px-4 flex-row justify-between items-end -mt-16 mb-4">
        <View className="p-1 bg-background rounded-full border border-border-muted">
          <View className="w-28 h-28 rounded-full bg-background/80 items-center justify-center border border-border">
            <Users size={48} color={colors.primary} />
          </View>
        </View>
        <View className="flex-row gap-2 pb-2">
          <IconButton
            icon={MessageCircle}
            onPress={handleChatPress}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
          <IconButton
            icon={isFollowing ? UserCheck : UserPlus}
            label={isFollowing ? "Siguiendo" : "Seguir"}
            onPress={() => {
              setIsFollowing(!isFollowing);
              addToast({
                title: isFollowing ? 'Dejaste de seguir el grupo' : 'Siguiendo grupo',
                variant: isFollowing ? 'muted' : 'success'
              });
            }}
            variant={isFollowing ? "ghost" : "primary"}
            rounded="full"
            hasBorder={true}
          />
        </View>
      </View>

      {/* Datos del Grupo */}
      <View className="px-4">
        <Text className="text-2xl font-black text-foreground tracking-tight">{group.name}</Text>
        <Text className="text-muted-foreground text-sm font-medium">@{group.short_code || group.name.toLowerCase().replace(' ', '_')}</Text>

        <Text className="text-foreground mt-4 leading-5 text-sm">Grupo y sala de {groupType === 'apuestas' ? 'apuestas oficiales' : 'contenido multimedia'}. Comparte jugadas e información con la comunidad.</Text>

        <View className="flex-row gap-4 mt-4">
          <View className="flex-row items-center">
            <Text className="text-foreground font-black text-sm">{group.members?.length || 0}</Text>
            <Text className="text-muted-foreground text-xs ml-1 font-bold uppercase tracking-wider">Miembros</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const tabs = [
    {
      id: 'tool',
      label: groupType === 'apuestas' ? 'Apuestas' : 'Multimedia',
      content: (
        <View className="mt-2">
          {groupType === 'apuestas' ? (
            <View className="pb-8">
              {generatedBetCode ? (
                <View>
                  <QRDisplayZone betCode={generatedBetCode} />
                  <TouchableOpacity
                    onPress={() => setGeneratedBetCode(null)}
                    className="bg-background/80 border border-border py-3.5 items-center mt-6 w-full max-w-sm mx-auto"
                  >
                    <Text className="text-white font-bold text-sm">Nueva Jugada</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <BetMatrixBuilder groupId={id || ''} onBetGenerated={handleBetGenerated} />
              )}
            </View>
          ) : (
            <View className="pb-8">
              {showPlansSelector ? (
                <View>
                  <TouchableOpacity
                    onPress={() => setShowPlansSelector(false)}
                    className="mb-4 self-start bg-background/80 px-3 py-1.5 rounded-xs border border-border"
                  >
                    <Text className="text-foreground font-bold text-xs">◀ Ver Bóveda</Text>
                  </TouchableOpacity>
                  <TierPlanSelector
                    plans={plans}
                    userActiveSubscriptions={userActiveSubs}
                    onPurchasePlan={handlePurchasePlan}
                  />
                </View>
              ) : (
                <View>
                  {isLoadingMedia ? (
                    <View className="py-20 justify-center items-center">
                      <ActivityIndicator size="large" color="#10b981" />
                    </View>
                  ) : (
                    <MediaVaultGrid
                      groupId={id || ''}
                      mediaItems={mediaItems}
                      userSubscriptions={userActiveSubs}
                      onSelectPlan={(planId) => {
                        setShowPlansSelector(true);
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )
    },
    {
      id: 'posts',
      label: 'Publicaciones',
      content: (
        <View className="mt-2">
          {isAdmin && (
            <View className="mb-4">
              <CreatePostWidget
                onPublish={handlePublishPost}
                forcedTarget={{
                  id: group?.id || '',
                  name: group?.name || '',
                  type: 'group'
                }}
              />
            </View>
          )}
          {groupPosts.length > 0 ? (
            <PostContainer
              title="Publicaciones Recientes"
              posts={groupPosts}
            />
          ) : (
            <EmptyState title="No hay publicaciones en este grupo." icon={LayoutList} variant="dashed" />
          )}
        </View>
      )
    },
    {
      id: 'info',
      label: 'Información',
      content: (
        <View className="mt-2 p-4 bg-background/40 border border-border rounded-xl">
          <Text className="text-white font-black text-sm uppercase tracking-wider mb-2">Reglas del Grupo</Text>
          <Text className="text-zinc-400 text-xs leading-5">
            1. Respete a los demás miembros de la comunidad.{"\n"}
            2. Comparta contenido verificado sobre pronósticos y jugadas.{"\n"}
            3. No se permite spam ni publicidad no autorizada.{"\n"}
            4. El juego de azar es responsabilidad de cada miembro.
          </Text>
        </View>
      )
    }
  ];

  return (
    <HubDetailLayout
      backRoute={from === 'channel' && group?.channel_id ? `/channels/${group.channel_id}` : '/(tabs)/grupos'}
      logoType="default"
      notFoundLabel="Grupo no encontrado."
    >
      {heroBanner}
      {group && (
        <View className="px-4">
          <TabContainer tabs={tabs} defaultTabId="tool" />
        </View>
      )}
    </HubDetailLayout>
  );
}
