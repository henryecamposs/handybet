import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function WalletScreen() {
  const router = useRouter();

  // Simulamos billeteras creadas por el usuario
  const misBilleteras: any[] = [
    { id: 'wallet_1', name: 'Mi Taquilla' }
  ];

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-zinc-100 font-bold text-2xl">Billeteras</Text>
        <Text className="text-zinc-400 text-sm mt-1">Gestiona tus fondos y taquillas.</Text>
      </View>

      {/* Carrusel de Mis Billeteras */}
      <View className="mb-8">
        <Text className="text-zinc-100 font-bold text-lg mb-4">Tus Billeteras</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {/* Botón de Añadir Billetera */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/wallet/create' as any)}
            className="w-32 h-36 bg-zinc-900 rounded-2xl border border-dashed border-zinc-700 items-center justify-center mr-4 hover:bg-zinc-800/80 transition-colors"
          >
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-2">
              <Plus size={24} color="#caee26" />
            </View>
            <Text className="text-zinc-300 font-bold text-sm text-center">Crear/Añadir</Text>
          </TouchableOpacity>

          {misBilleteras.map((wallet: any, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(`/(tabs)/wallet/${wallet.id}` as any)}
              className="w-32 h-36 bg-zinc-900 rounded-2xl border border-zinc-800 items-center justify-center mr-4 hover:bg-zinc-800/80 transition-colors px-2"
            >
              <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-2">
                <Wallet size={20} color="#d4d4d8" />
              </View>
              <Text className="text-zinc-100 font-bold text-center text-sm px-1" numberOfLines={2}>{wallet.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Si no tiene billeteras creadas */}
      {misBilleteras.length === 0 && (
        <View className="flex-1 items-center justify-center py-6 mb-8 border border-zinc-800 rounded-3xl border-dashed">
          <Wallet size={48} color="#52525b" className="mb-4" />
          <Text className="text-zinc-400 font-bold text-lg text-center">Aún no has creado billeteras</Text>
          <Text className="text-zinc-500 text-sm text-center mt-2 max-w-[250px]">Crea o enlaza tu primera taquilla/billetera para comenzar a jugar.</Text>
        </View>
      )}

      {/* Tarjeta Principal */}
      <View className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-3xl p-6 border border-zinc-700/50 mb-8 relative overflow-hidden">
        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3">
            <Wallet size={20} color="#caee26" />
          </View>
          <Text className="text-zinc-300 font-medium">Balance Total</Text>
        </View>

        <Text className="text-zinc-100 font-black text-4xl mb-1">1,240.50 <Text className="text-primary text-2xl">Bs</Text></Text>
        <Text className="text-zinc-500 text-sm mb-8">Saldo Global (Suma de todos los grupos)</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center">
            <ArrowDownLeft size={18} color="#000" className="mr-2" />
            <Text className="text-black font-bold">Recargar</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-zinc-800 py-3 rounded-xl flex-row items-center justify-center border border-zinc-700">
            <ArrowUpRight size={18} color="#d4d4d8" className="mr-2" />
            <Text className="text-zinc-200 font-bold">Retirar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saldos por Grupos */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-zinc-100 font-bold text-lg">Saldos por Grupos</Text>
        </View>

        {/* Grupo 1 */}
        <View className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex-row items-center justify-between mb-3 hover:bg-zinc-800/80 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-zinc-800 items-center justify-center mr-4 border border-zinc-700">
              <Text className="text-xl">🎲</Text>
            </View>
            <View>
              <Text className="text-zinc-100 font-bold">Animalitos VIP</Text>
              <Text className="text-zinc-400 text-sm">Apuestas y Sorteos</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-secondary font-bold text-lg">50.00 Bs</Text>
            <Text className="text-zinc-500 text-xs mt-1">Disp. para jugar</Text>
          </View>
        </View>

        {/* Grupo 2 */}
        <View className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex-row items-center justify-between mb-3 hover:bg-zinc-800/80 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-zinc-800 items-center justify-center mr-4 border border-zinc-700">
              <Text className="text-xl">🏇</Text>
            </View>
            <View>
              <Text className="text-zinc-100 font-bold">Carreras 5y6</Text>
              <Text className="text-zinc-400 text-sm">Hipismo</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-secondary font-bold text-lg">120.50 Bs</Text>
            <Text className="text-amber-500 text-xs mt-1">Monto pendiente: 30.00 Bs</Text>
          </View>
        </View>
      </View>

      {/* Saldo de Premios (API Taquillas) */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-zinc-100 font-bold text-lg">Premios por Cobrar</Text>
          <TouchableOpacity>
            <Text className="text-primary font-medium text-sm">Retirar todo</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex-row items-center justify-between hover:bg-zinc-800/80 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-secondary/10 items-center justify-center mr-4 border border-secondary/20">
              <Text className="text-xl">🏆</Text>
            </View>
            <View>
              <Text className="text-zinc-100 font-bold">La Imaginaria (API)</Text>
              <Text className="text-zinc-400 text-sm">Premios acumulados</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-primary font-bold text-xl">1,070.00 Bs</Text>
          </View>
        </View>
      </View>

      {/* Historial Reciente */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-zinc-100 font-bold text-lg">Movimientos Recientes</Text>
          <TouchableOpacity>
            <History size={18} color="#71717a" />
          </TouchableOpacity>
        </View>

        <View className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4">
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-zinc-800/50">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3">
                <ArrowDownLeft size={16} color="#10b981" />
              </View>
              <View>
                <Text className="text-zinc-100 font-medium">Recarga Exitosa</Text>
                <Text className="text-zinc-500 text-xs">Hoy, 10:20 AM</Text>
              </View>
            </View>
            <Text className="text-secondary font-bold">+100.00 Bs</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3">
                <ArrowUpRight size={16} color="#ef4444" />
              </View>
              <View>
                <Text className="text-zinc-100 font-medium">Pago Sorteo Animalitos</Text>
                <Text className="text-zinc-500 text-xs">Ayer, 3:45 PM (Grupo: Animalitos VIP)</Text>
              </View>
            </View>
            <Text className="text-zinc-100 font-bold">-50.00 Bs</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// End of file
