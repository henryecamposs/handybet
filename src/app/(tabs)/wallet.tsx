import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer } from '@/components/layout/hub';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';

export default function WalletScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const cargosPorGrupo = [
    { id: '1', title: 'Animalitos VIP', subtitle: 'Apuestas y Sorteos', icon: '🎲', amount: '50.00 Bs', status: 'Disp. para jugar', statusColor: 'text-muted-foreground' },
    { id: '2', title: 'Carreras 5y6', subtitle: 'Hipismo', icon: '🏇', amount: '120.50 Bs', status: 'Pendiente: 30.00 Bs', statusColor: 'text-amber-500' }
  ];

  const premiosPorCobrar = [
    { id: '1', title: 'La Imaginaria (API)', subtitle: 'Premios acumulados', icon: '🏆', amount: '1,070.00 Bs', status: '' }
  ];

  const movimientosRecientes = [
    { id: '1', title: 'Recarga Exitosa', subtitle: 'Hoy, 10:20 AM', type: 'in', amount: '+100.00 Bs' },
    { id: '2', title: 'Pago Sorteo Animalitos', subtitle: 'Ayer, 3:45 PM (Grupo: Animalitos VIP)', type: 'out', amount: '-50.00 Bs' }
  ];

  const renderCargoItem = (item: any) => (
    <ListItem
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      subtitleVariant="muted"
      leftElement={
        <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-border">
          <Text className="text-lg">{item.icon}</Text>
        </View>
      }
      rightElement={
        <View className="items-end">
          <Text className="text-secondary font-bold text-base">{item.amount}</Text>
          <Text className={`${item.statusColor} text-[9px] uppercase font-bold tracking-wider mt-0.5`}>{item.status}</Text>
        </View>
      }
      onPress={() => {}}
      className="mb-2 bg-background/80"
    />
  );

  const renderPremioItem = (item: any) => (
    <ListItem
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      subtitleVariant="muted"
      leftElement={
        <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center border border-secondary/35">
          <Text className="text-lg">{item.icon}</Text>
        </View>
      }
      rightElement={
        <View className="flex-row items-center gap-3">
          <Text className="text-primary font-bold text-lg">{item.amount}</Text>
          <IconButton
            icon={ArrowUpRight}
            onPress={() => {}}
            variant="primary"
            size="xs"
            rounded="full"
          />
        </View>
      }
      onPress={() => {}}
      className="mb-2 bg-background/80"
    />
  );

  const renderMovimientoItem = (item: any) => (
    <ListItem
      key={item.id}
      title={item.title}
      subtitle={item.subtitle}
      subtitleVariant="muted"
      leftElement={
        <View className={`w-10 h-10 rounded-full items-center justify-center border ${item.type === 'in' ? 'bg-secondary/10 border-secondary/10' : 'bg-destructive/10 border-destructive/10'}`}>
          {item.type === 'in' ? (
            <ArrowDownLeft size={16} color={colors.secondary} />
          ) : (
            <ArrowUpRight size={16} color={colors.destructive} />
          )}
        </View>
      }
      rightElement={
        <Text className={`${item.type === 'in' ? 'text-secondary' : 'text-foreground'} font-bold text-base`}>
          {item.amount}
        </Text>
      }
      onPress={() => {}}
      className="mb-2 bg-background/80"
    />
  );

  const emptyState = (
    <EmptyState
      icon={Wallet}
      title="Sin registros"
      description="Aún no hay actividad en esta sección."
      variant="dashed"
    />
  );

  const tabs = [
    {
      id: 'cargos',
      label: 'Cargos por Grupo',
      content: (
        <View className="mt-2">
          <SeccionLista
            items={cargosPorGrupo}
            renderItem={renderCargoItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      )
    },
    {
      id: 'premios',
      label: 'Premios por Cobrar',
      content: (
        <View className="mt-2">
          <SeccionLista
            items={premiosPorCobrar}
            renderItem={renderPremioItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      )
    },
    {
      id: 'movimientos',
      label: 'Historial',
      content: (
        <View className="mt-2">
          <SeccionLista
            items={movimientosRecientes}
            renderItem={renderMovimientoItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      )
    }
  ];

  return (
    <HubLayout
      title="Billeteras"
      subtitle="Gestiona tus fondos y taquillas."
      showBack={true}
      tabContainer={<TabContainer tabs={tabs} />}
    >
      {/* Tarjeta Principal de Balance */}
      <View className="bg-background/80  p-6 border border-border mb-6 mt-2 relative overflow-hidden">
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
          <TouchableOpacity className="flex-1 bg-background/80 py-3.5 rounded-xs flex-row items-center justify-center border border-border">
            <ArrowUpRight size={18} color={colors.foreground} className="mr-2" />
            <Text className="text-foreground font-bold text-sm">Retirar</Text>
          </TouchableOpacity>
        </View>
      </View>

    </HubLayout>
  );
}

// End of file
