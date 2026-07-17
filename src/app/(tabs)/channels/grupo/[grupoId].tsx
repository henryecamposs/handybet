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

export default function GrupoDetailScreen() {
  const { grupoId, type } = useLocalSearchParams<{ grupoId: string; type: string }>();
  const router = useRouter();

  // Estados de Apuesta
  const [generatedBetCode, setGeneratedBetCode] = useState<string | null>(null);

  // Estados de Media Vault / Suscripciones
  const [plans, setPlans] = useState<MediaPlan[]>([]);
  const [userActiveSubs, setUserActiveSubs] = useState<string[]>([]);
  const [showPlansSelector, setShowPlansSelector] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const { data: mediaItems = [], isLoading: isLoadingMedia } = useGetMediaVault(grupoId || '');
  const subscribeMutation = useSubscribeToMediaPlan();

  const { mockSession } = useHandyBetStore();
  const [group, setGroup] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  async function loadGroupData() {
    if (!grupoId) return;
    try {
      const g = await localDB.groups.getById(grupoId as string);
      setGroup(g);
      if (g && mockSession) {
        const channel = await localDB.channels.getById(g.channel_id);
        setIsAdmin(channel?.owner_id === mockSession.id || mockSession.role === 'admin');
      }
    } catch (e) {
      console.log('Error loading group data:', e);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      loadGroupData();
    }, 0);
  }, [grupoId, mockSession]);

  async function fetchPlansAndSubs() {
    try {
      setIsLoadingPlans(true);
      const userId = mockSession?.id || 'usr_henry';

      // 1. Obtener planes del grupo (a través de su canal)
      const group = await localDB.groups.getById(grupoId as string);
      if (group && group.channel_id) {
        const channel = await localDB.channels.getById(group.channel_id);
        setPlans(channel?.plans || []);
      }

      // 2. Obtener suscripciones activas de usuario
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
    if (type === 'compartir_media' && grupoId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPlansAndSubs();
    }
  }, [grupoId, type]);

  const handlePurchasePlan = async (planId: string) => {
    try {
      await subscribeMutation.mutateAsync(planId);
      // Actualizar listado de suscripciones
      setUserActiveSubs([...userActiveSubs, planId]);
      setShowPlansSelector(false);
    } catch (err) {
      throw err;
    }
  };

  const handleBetGenerated = async (betData: any) => {
    try {
      const userId = mockSession?.id || 'usr_henry';

      // 1. Obtener short_code de grupo
      const group = await localDB.groups.getById(grupoId as string);
      const prefix = group?.short_code || '0000';

      // Correlativo aleatorio de 6 dígitos
      const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
      const betCode = `${prefix}-${randomSuffix}`;

      // 2. Guardar en base de datos local
      await localDB.bets.insert({
        id: localDB.generateId('bet'),
        group_id: grupoId,
        user_id: userId,
        bet_code: betCode,
        bet_data: betData,
        amount: betData.totalAmount,
        potential_prize: betData.totalAmount * 50, // Multiplicador mock de 50x
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
        group_id: grupoId as string,
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

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12">
      {/* Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <Text className="text-foreground font-bold text-xs">◀ Salas</Text>
      </TouchableOpacity>

      {/* Switch de Renderizado */}
      {type === 'apuestas' ? (
        <View className="pb-8">
          {generatedBetCode ? (
            <View>
              <QRDisplayZone betCode={generatedBetCode} />
              <TouchableOpacity
                onPress={() => setGeneratedBetCode(null)}
                className="bg-background/80 border border-zinc-800 py-3.5 rounded-2xl items-center mt-6 w-full max-w-sm mx-auto"
              >
                <Text className="text-white font-bold text-sm">Nueva Jugada</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <BetMatrixBuilder groupId={grupoId || ''} onBetGenerated={handleBetGenerated} />
          )}
        </View>
      ) : type === 'compartir_media' ? (
        <View className="pb-8">
          {showPlansSelector ? (
            <View>
              <TouchableOpacity
                onPress={() => setShowPlansSelector(false)}
                className="mb-4 self-start bg-background/80 px-3 py-1.5 rounded-xl border border-zinc-800"
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
                  groupId={grupoId || ''}
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
            Este tipo de grupo ({type}) no cuenta con una interfaz configurada.
          </Text>
        </View>
      )}

      {group && (
        <View className="mt-8 border-t border-zinc-850 pt-6">
          <TouchableOpacity
            onPress={() => router.push(`/feed/search?id=${group.id}` as any)}
            className="bg-primary/20 border border-primary/30 p-4 rounded-3xl items-center justify-center mb-6"
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
