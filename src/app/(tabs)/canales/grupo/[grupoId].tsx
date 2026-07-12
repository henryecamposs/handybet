import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../../lib/supabaseClient';
import { useGetMediaVault, useSubscribeToMediaPlan } from '../../../../hooks/useHandyBetQueries';
import BetMatrixBuilder from '../../../../components/betting/BetMatrixBuilder';
import QRDisplayZone from '../../../../components/betting/QRDisplayZone';
import MediaVaultGrid from '../../../../components/media/MediaVaultGrid';
import TierPlanSelector from '../../../../components/media/TierPlanSelector';
import { MediaPlan } from '../../../../types/handyBet';

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

  useEffect(() => {
    if (type === 'compartir_media' && grupoId) {
      fetchPlansAndSubs();
    }
  }, [grupoId, type]);

  const fetchPlansAndSubs = async () => {
    try {
      setIsLoadingPlans(true);
      // 1. Obtener planes del grupo
      const { data: plansData, error: plansError } = await supabase
        .from('media_plans')
        .select('*')
        .eq('group_id', grupoId);

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // 2. Obtener suscripciones activas de usuario
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: subsData, error: subsError } = await supabase
          .from('user_subscriptions')
          .select('plan_id')
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (subsError) throw subsError;
        setUserActiveSubs((subsData || []).map(s => s.plan_id));
      }
    } catch (err) {
      console.log('Error fetching plans/subs:', err);
    } finally {
      setIsLoadingPlans(false);
    }
  };

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado.');

      // 1. Obtener short_code de grupo
      const { data: groupData } = await supabase
        .from('groups')
        .select('short_code')
        .eq('id', grupoId)
        .single();

      const prefix = groupData?.short_code || '0000';
      // Correlativo aleatorio de 6 dígitos
      const randomSuffix = Math.floor(100000 + Math.random() * 900000).toString();
      const betCode = `${prefix}-${randomSuffix}`;

      // 2. Guardar en base de datos
      const { error } = await supabase.from('bets').insert({
        group_id: grupoId,
        user_id: user.id,
        bet_code: betCode,
        bet_data: betData,
        amount: betData.totalAmount,
        status: 'pendiente'
      });

      if (error) throw error;
      setGeneratedBetCode(betCode);
    } catch (err: any) {
      alert(err.message || 'Error al guardar apuesta.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-12">
      {/* Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
        <Text className="text-zinc-400 font-bold text-xs">◀ Salas</Text>
      </TouchableOpacity>

      {/* Switch de Renderizado */}
      {type === 'apuestas' ? (
        <View className="pb-8">
          {generatedBetCode ? (
            <View>
              <QRDisplayZone betCode={generatedBetCode} />
              <TouchableOpacity
                onPress={() => setGeneratedBetCode(null)}
                className="bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl items-center mt-6 w-full max-w-sm mx-auto"
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
                className="mb-4 self-start bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800"
              >
                <Text className="text-zinc-400 font-bold text-xs">◀ Ver Bóveda</Text>
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
      <View className="h-16" />
    </ScrollView>
  );
}
