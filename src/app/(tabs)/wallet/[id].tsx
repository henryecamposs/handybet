import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownLeft, Store, History, Settings } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function WalletDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();

  // En una app real, fetchearías la billetera con el 'id'

  const renderHeaderRight = () => (
    <TouchableOpacity className="w-9 h-9 bg-background/80 rounded-full items-center justify-center border border-muted-foreground/35 hover:bg-background/80/85">
      <Settings size={18} color={colors.foreground} />
    </TouchableOpacity>
  );

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/(tabs)/wallet"
      headerRight={renderHeaderRight()}
    >
      <View className="px-4 pt-6">
        {/* Tarjeta Principal */}
        <View className="bg-gradient-to-br from-secondary/15 to-background rounded-3xl p-5 border border-secondary/35 mb-8 relative overflow-hidden">
          <View className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-3 border border-secondary/30">
                <Store size={20} color={colors.secondary} />
              </View>
              <View>
                <Text className="text-foreground font-bold text-base">Taquilla La Imaginaria</Text>
                <Text className="text-secondary text-[10px] uppercase font-black tracking-widest mt-0.5">Conectada via API</Text>
              </View>
            </View>
          </View>

          <Text className="text-foreground text-[10px] font-bold uppercase tracking-wider mb-1">Balance Disponible</Text>
          <Text className="text-foreground font-black text-4xl mb-1">
            450.00 <Text className="text-secondary text-2xl font-bold">Bs</Text>
          </Text>
          <Text className="text-muted-foreground text-xs mb-8 font-medium">Actualizado hace 2 mins</Text>

          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 bg-secondary py-3.5 rounded-xl flex-row items-center justify-center">
              <ArrowDownLeft size={18} color="#000" className="mr-2" />
              <Text className="text-black font-bold text-sm">Depositar</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-background/80 py-3.5 rounded-xl flex-row items-center justify-center border border-muted-foreground">
              <ArrowUpRight size={18} color={colors.foreground} className="mr-2" />
              <Text className="text-foreground font-bold text-sm">Retirar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Acciones Rápidas */}
        <View className="flex-row flex-wrap gap-4 mb-8">
          <TouchableOpacity className="flex-1 bg-background/80 p-5 rounded-3xl border border-muted-foreground items-center justify-center hover:bg-background/80/85 transition-colors">
            <Text className="text-2xl mb-2">📊</Text>
            <Text className="text-foreground font-bold text-xs text-center">Reporte de Caja</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-background/80 p-5 rounded-3xl border border-muted-foreground items-center justify-center hover:bg-background/80/85 transition-colors">
            <Text className="text-2xl mb-2">🎫</Text>
            <Text className="text-foreground font-bold text-xs text-center">Pagar Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-background/80 p-5 rounded-3xl border border-muted-foreground items-center justify-center hover:bg-background/80/85 transition-colors">
            <Text className="text-2xl mb-2">🔄</Text>
            <Text className="text-foreground font-bold text-xs text-center">Sincronizar</Text>
          </TouchableOpacity>
        </View>

        {/* Historial Específico */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-foreground font-black text-lg uppercase tracking-wider">Historial de Taquilla</Text>
            <TouchableOpacity>
              <History size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <View className="bg-background/80 rounded-3xl border border-muted-foreground overflow-hidden">
            {/* Item */}
            <View className="p-5 border-b border-muted-foreground/15 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3 border border-secondary/10">
                  <ArrowDownLeft size={16} color="#10b981" />
                </View>
                <View>
                  <Text className="text-foreground font-bold text-sm">Depósito en Efectivo</Text>
                  <Text className="text-muted-foreground text-xs mt-0.5">Cajero: Joselin</Text>
                </View>
              </View>
              <Text className="text-secondary font-bold text-base">+100.00 Bs</Text>
            </View>

            {/* Item */}
            <View className="p-5 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3 border border-red-500/10">
                  <ArrowUpRight size={16} color="#ef4444" />
                </View>
                <View>
                  <Text className="text-foreground font-bold text-sm">Pago de Premio #459</Text>
                  <Text className="text-muted-foreground text-xs mt-0.5">Ticket tripleta ganador</Text>
                </View>
              </View>
              <Text className="text-foreground font-bold text-base">-350.00 Bs</Text>
            </View>
          </View>
        </View>
      </View>
    </HubDetailLayout>
  );
}
