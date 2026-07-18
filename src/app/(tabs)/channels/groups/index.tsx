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
import IconButton from '../../../../components/ui/IconButton';
import { MessageCircle, ArrowLeft } from 'lucide-react-native';

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

  const { mockSession } = useHandyBetStore();
  const [group, setGroup] = useState<any>(null);
  const [groupType, setGroupType] = useState<string>('apuestas');
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12">
      {/* Header Fila con Volver y Chat */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={handleBack} className="flex-row items-center gap-2">
          <ArrowLeft size={18} color={colors.foreground} />
          <Text className="text-foreground font-bold text-xs">Volver</Text>
        </TouchableOpacity>

        {group && (
          <IconButton 
            icon={MessageCircle} 
            label="Chat de Grupo"
            onPress={handleChatPress} 
            variant="primary" 
            rounded="full" 
          />
        )}
      </View>

      {group && (
        <View className="mb-6">
          <Text className="text-[10px] font-black text-primary uppercase tracking-widest">
            {groupType === 'apuestas' ? 'Sala de Apuestas' : 'Sala de Multimedia'}
          </Text>
          <Text className="text-3xl font-black text-foreground tracking-tight mt-1">
            {group.name}
          </Text>
        </View>
      )}

      {/* Switch de Renderizado */}
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
      ) : groupType === 'compartir_media' ? (
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
      ) : (
        <View className="py-20 justify-center items-center">
          <Text className="text-rose-500 font-bold text-center">
            Este tipo de grupo ({groupType}) no cuenta con una interfaz configurada.
          </Text>
        </View>
      )}

      {group && (
        <View className="mt-8 border-t border-border pt-6">
          <TouchableOpacity
            onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
            className="bg-primary/20 border border-border p-4 items-center justify-center mb-6"
          >
            <Text className="text-primary font-black text-xs uppercase tracking-wider">Ver Feed / Publicaciones del Grupo 📢</Text>
          </TouchableOpacity>

          {isAdmin && (
            <View className="mb-4">
              <Text className="text-white font-black text-xs uppercase tracking-wider mb-3">Publicar en el Grupo</Text>
              <CreatePostWidget
                onPublish={handlePublishPost}
                forcedTarget={{
                  id: group.id,
                  name: group.name,
                  type: 'group'
                }}
              />
            </View>
          )}
        </View>
      )}

      <View className="h-16" />
    </ScrollView>
  );
}
