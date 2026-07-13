import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowUpRight, ArrowDownLeft, Store, History, Settings, MoreHorizontal } from 'lucide-react-native';

export default function WalletDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // En una app real, fetchearías la billetera con el 'id'

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
          <Text className="text-foreground font-bold text-sm">◀ Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-10 h-10 bg-background rounded-full items-center justify-center border border-zinc-800">
          <Settings size={18} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Tarjeta Principal */}
      <View className="bg-gradient-to-br from-secondary/40 to-zinc-900 rounded-3xl p-6 border border-secondary/30 mb-8 relative overflow-hidden">
        <View className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />

        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-secondary/20 items-center justify-center mr-3 border border-secondary/30">
              <Store size={20} color="#34d399" />
            </View>
            <View>
              <Text className="text-foreground font-bold">Taquilla La Imaginaria</Text>
              <Text className="text-secondary text-[10px] uppercase font-bold tracking-widest mt-0.5">Conectada via API</Text>
            </View>
          </View>
        </View>

        <Text className="text-foreground text-xs font-bold uppercase mb-1">Balance Disponible</Text>
        <Text className="text-foreground font-black text-4xl mb-1">450.00 <Text className="text-secondary text-2xl">Bs</Text></Text>
        <Text className="text-foreground text-sm mb-8">Actualizado hace 2 mins</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-1 bg-secondary py-3 rounded-xl flex-row items-center justify-center">
            <ArrowDownLeft size={18} color="#000" className="mr-2" />
            <Text className="text-black font-bold">Depositar</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-background/80/80 py-3 rounded-xl flex-row items-center justify-center border border-zinc-700">
            <ArrowUpRight size={18} color="#d4d4d8" className="mr-2" />
            <Text className="text-foreground font-bold">Retirar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Acciones Rápidas */}
      <View className="flex-row flex-wrap gap-4 mb-8">
        <TouchableOpacity className="flex-1 bg-background p-4 rounded-2xl border border-zinc-800 items-center justify-center hover:bg-background/80 transition-colors">
          <Text className="text-2xl mb-2">📊</Text>
          <Text className="text-foreground font-bold text-xs text-center">Reporte de Caja</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-background p-4 rounded-2xl border border-zinc-800 items-center justify-center hover:bg-background/80 transition-colors">
          <Text className="text-2xl mb-2">🎫</Text>
          <Text className="text-foreground font-bold text-xs text-center">Pagar Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-background p-4 rounded-2xl border border-zinc-800 items-center justify-center hover:bg-background/80 transition-colors">
          <Text className="text-2xl mb-2">🔄</Text>
          <Text className="text-foreground font-bold text-xs text-center">Sincronizar</Text>
        </TouchableOpacity>
      </View>

      {/* Historial Específico */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-foreground font-bold text-lg">Historial de Taquilla</Text>
          <TouchableOpacity>
            <History size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        <View className="bg-background rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Item */}
          <View className="p-4 border-b border-zinc-800/50 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3">
                <ArrowDownLeft size={16} color="#10b981" />
              </View>
              <View>
                <Text className="text-foreground font-medium text-sm">Depósito en Efectivo</Text>
                <Text className="text-foreground text-[10px]">Cajero: Joselin</Text>
              </View>
            </View>
            <Text className="text-secondary font-bold">+100.00 Bs</Text>
          </View>

          {/* Item */}
          <View className="p-4 flex-row justify-between items-center">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
                <ArrowUpRight size={16} color="#ef4444" />
              </View>
              <View>
                <Text className="text-foreground font-medium text-sm">Pago de Premio #459</Text>
                <Text className="text-foreground text-[10px]">Ticket ganador Tripleta</Text>
              </View>
            </View>
            <Text className="text-foreground font-bold">-350.00 Bs</Text>
          </View>
        </View>
      </View>
      <View className="h-16" />
    </ScrollView>
  );
}
