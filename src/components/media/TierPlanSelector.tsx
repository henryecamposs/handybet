import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MediaPlan } from '../../types/handyBet';

interface TierPlanSelectorProps {
  plans: MediaPlan[];
  userActiveSubscriptions: string[]; // Lista de ids de planes que el usuario ya tiene activos
  onPurchasePlan: (planId: string) => Promise<void>;
}

export default function TierPlanSelector({
  plans,
  userActiveSubscriptions,
  onPurchasePlan,
}: TierPlanSelectorProps) {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchase = async (planId: string) => {
    if (purchasingId) return; // Bloqueo reactivo inmediato contra doble clics
    setErrorMessage(null);
    setPurchasingId(planId);

    try {
      await onPurchasePlan(planId);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al procesar la suscripción.');
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <View className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-xl w-full max-w-4xl mx-auto my-4">
      <View className="items-center mb-6">
        <Text className="text-2xl font-black text-white tracking-tight">Membresías de Contenido</Text>
        <Text className="text-zinc-400 text-xs font-bold text-center mt-1.5 leading-relaxed max-w-md">
          Selecciona un plan de suscripción para desbloquear el contenido premium utilizando el saldo de tu wallet.
        </Text>
      </View>

      {errorMessage && (
        <View className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl mb-6">
          <Text className="text-rose-500 text-xs font-bold text-center">⚠️ {errorMessage}</Text>
        </View>
      )}

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
        {plans.map((plan) => {
          const isActive = userActiveSubscriptions.includes(plan.id);
          const isProcessing = purchasingId === plan.id;

          // Estética de colores según el plan
          const isHandyBet = plan.name.toLowerCase().includes('handyBet');
          const isFree = plan.price === 0;

          return (
            <View
              key={plan.id}
              className={`w-72 p-6 rounded-3xl border ${isHandyBet
                ? 'bg-secondary/10 border-secondary/80 shadow-md shadow-secondary/5'
                : 'bg-zinc-900 border-zinc-800'
                } flex flex-col justify-between`}
            >
              <View>
                {/* Etiqueta Destacada */}
                {isHandyBet && (
                  <View className="bg-secondary self-start px-2.5 py-1 rounded-full mb-3 border border-secondary">
                    <Text className="text-zinc-900 text-[9px] font-black uppercase tracking-wider">
                      Recomendado
                    </Text>
                  </View>
                )}

                {/* Nombre y Precio */}
                <Text className="text-white text-lg font-black tracking-tight">{plan.name}</Text>
                <View className="flex-row items-baseline mt-2 mb-4">
                  <Text className="text-white text-3xl font-black tracking-tight">
                    {plan.price.toFixed(2)}
                  </Text>
                  <Text className="text-zinc-400 text-xs font-bold ml-1.5 uppercase font-mono">
                    Bs. / {plan.duration_days} días
                  </Text>
                </View>

                {/* Beneficios */}
                <View className="border-t border-zinc-800/80 pt-4 space-y-2 mb-6">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-secondary text-sm">✓</Text>
                    <Text className="text-zinc-300 text-xs font-bold">
                      {plan.max_photos === 0 || plan.max_photos > 9999
                        ? 'Fotos ilimitadas'
                        : `Hasta ${plan.max_photos} fotos premium`}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-secondary text-sm">✓</Text>
                    <Text className="text-zinc-300 text-xs font-bold">
                      {plan.max_videos === 0 || plan.max_videos > 9999
                        ? 'Videos ilimitados'
                        : `Hasta ${plan.max_videos} videos premium`}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-secondary text-sm">✓</Text>
                    <Text className="text-zinc-300 text-xs font-bold">Soporte prioritario P2P</Text>
                  </View>
                </View>
              </View>

              {/* Botón de Compra */}
              <TouchableOpacity
                onPress={() => handlePurchase(plan.id)}
                disabled={isActive || isProcessing}
                className={`w-full py-3.5 rounded-2xl flex-row justify-center items-center ${isActive
                  ? 'bg-zinc-800 border border-zinc-700'
                  : isHandyBet
                    ? 'bg-secondary active:scale-[0.98]'
                    : 'bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98]'
                  }`}
              >
                {isProcessing ? (
                  <ActivityIndicator color={isHandyBet ? '#0f172a' : '#10b981'} />
                ) : (
                  <Text
                    className={`font-black text-xs uppercase ${isActive
                      ? 'text-zinc-500'
                      : isHandyBet
                        ? 'text-zinc-900'
                        : 'text-white'
                      }`}
                  >
                    {isActive ? '✓ Plan Activo' : 'Adquirir Plan'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
