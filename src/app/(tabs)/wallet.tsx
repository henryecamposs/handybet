import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubLayout from '@/components/layout/HubLayout';

export default function WalletScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  // Simulamos billeteras creadas por el usuario
  const misBilleteras: any[] = [
    { id: 'wallet_1', name: 'Mi Taquilla' }
  ];

  const renderMyWalletItem = (wallet: any, index: number) => (
    <TouchableOpacity
      key={wallet.id || index}
      onPress={() => router.push(`/(tabs)/wallet/${wallet.id}` as any)}
      className="w-32 h-36 bg-background/80 rounded-3xl border border-muted-foreground items-center justify-center mr-4 hover:bg-background/80/85 transition-colors px-2"
    >
      <View className="w-12 h-12 rounded-full bg-background/80 items-center justify-center mb-2 border border-muted-foreground/35">
        <Wallet size={20} color={colors.foreground} />
      </View>
      <Text className="text-foreground font-bold text-center text-sm px-1" numberOfLines={2}>{wallet.name}</Text>
    </TouchableOpacity>
  );

  return (
    <HubLayout
      title="Billeteras"
      subtitle="Gestiona tus fondos y taquillas."
      myItemsTitle="Tus Billeteras"
      myItems={misBilleteras}
      renderMyItem={renderMyWalletItem}
      onAddNewItem={() => router.push('/(tabs)/wallet/create' as any)}
      addNewItemLabel="Crear/Añadir"
      showBack={true}
    >
      {/* Si no tiene billeteras creadas */}
      {misBilleteras.length === 0 && (
        <View className="items-center justify-center py-8 mb-8 border border-muted-foreground rounded-3xl border-dashed">
          <Wallet size={48} color={colors.mutedForeground} className="mb-4" />
          <Text className="text-foreground font-bold text-lg text-center">Aún no has creado billeteras</Text>
          <Text className="text-muted-foreground text-sm text-center mt-2 max-w-[250px]">Crea o enlaza tu primera taquilla/billetera para comenzar a jugar.</Text>
        </View>
      )}

      {/* Tarjeta Principal de Balance */}
      <View className="bg-background/80 rounded-3xl p-6 border border-muted-foreground mb-8 relative overflow-hidden">
        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

        <View className="flex-row items-center mb-6">
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center mr-3 border border-primary/35">
            <Wallet size={20} color={colors.primary} />
          </View>
          <Text className="text-foreground font-medium text-base">Balance Total</Text>
        </View>

        <Text className="text-foreground font-black text-4xl mb-1">
          1,240.50 <Text className="text-primary text-2xl font-bold">Bs</Text>
        </Text>
        <Text className="text-muted-foreground text-sm mb-8 font-medium">Saldo Global (Suma de todos los grupos)</Text>

        <View className="flex-row gap-4">
          <TouchableOpacity className="flex-1 bg-primary py-3.5 rounded-xs flex-row items-center justify-center">
            <ArrowDownLeft size={18} color="#000" className="mr-2" />
            <Text className="text-black font-bold text-sm">Recargar</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-background/80 py-3.5 rounded-xs flex-row items-center justify-center border border-muted-foreground">
            <ArrowUpRight size={18} color={colors.foreground} className="mr-2" />
            <Text className="text-foreground font-bold text-sm">Retirar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saldos por Grupos */}
      <View className="mb-8">
        <Text className="text-foreground font-black text-lg uppercase tracking-wider mb-4">Saldos por Grupos</Text>

        {/* Grupo 1 */}
        <View className="bg-background/80 p-5 rounded-3xl border border-muted-foreground flex-row items-center justify-between mb-3 hover:bg-background/80/85 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center mr-4 border border-muted-foreground/35">
              <Text className="text-xl">🎲</Text>
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">Animalitos VIP</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Apuestas y Sorteos</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-secondary font-bold text-lg">50.00 Bs</Text>
            <Text className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider mt-1">Disp. para jugar</Text>
          </View>
        </View>

        {/* Grupo 2 */}
        <View className="bg-background/80 p-5 rounded-3xl border border-muted-foreground flex-row items-center justify-between mb-3 hover:bg-background/80/85 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xs bg-background/80 items-center justify-center mr-4 border border-muted-foreground/35">
              <Text className="text-xl">🏇</Text>
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">Carreras 5y6</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Hipismo</Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-secondary font-bold text-lg">120.50 Bs</Text>
            <Text className="text-amber-500 text-[10px] uppercase font-bold tracking-wider mt-1">Pendiente: 30.00 Bs</Text>
          </View>
        </View>
      </View>

      {/* Saldo de Premios (API Taquillas) */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-foreground font-black text-lg uppercase tracking-wider">Premios por Cobrar</Text>
          <TouchableOpacity>
            <Text className="text-primary font-bold text-xs uppercase tracking-wider">Retirar todo</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-background/80 p-5 rounded-3xl border border-muted-foreground flex-row items-center justify-between hover:bg-background/80/85 transition-colors">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xs bg-secondary/10 items-center justify-center mr-4 border border-secondary/35">
              <Text className="text-xl">🏆</Text>
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">La Imaginaria (API)</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Premios acumulados</Text>
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
          <Text className="text-foreground font-black text-lg uppercase tracking-wider">Movimientos Recientes</Text>
          <TouchableOpacity>
            <History size={18} color={colors.mutedForeground} />
          </TouchableOpacity>
        </View>

        <View className="bg-background/80 rounded-3xl border border-muted-foreground p-5">
          <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-muted-foreground/15">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center mr-3 border border-secondary/10">
                <ArrowDownLeft size={16} color="#10b981" />
              </View>
              <View>
                <Text className="text-foreground font-bold text-sm">Recarga Exitosa</Text>
                <Text className="text-muted-foreground text-xs mt-0.5">Hoy, 10:20 AM</Text>
              </View>
            </View>
            <Text className="text-secondary font-bold text-base">+100.00 Bs</Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-red-500/10 items-center justify-center mr-3 border border-red-500/10">
                <ArrowUpRight size={16} color="#ef4444" />
              </View>
              <View>
                <Text className="text-foreground font-bold text-sm">Pago Sorteo Animalitos</Text>
                <Text className="text-muted-foreground text-xs mt-0.5">Ayer, 3:45 PM (Grupo: Animalitos VIP)</Text>
              </View>
            </View>
            <Text className="text-foreground font-bold text-base">-50.00 Bs</Text>
          </View>
        </View>
      </View>
    </HubLayout>
  );
}

// End of file
