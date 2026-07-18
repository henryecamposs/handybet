import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, MessageCircle } from 'lucide-react-native';
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
        <View className="flex-row items-center gap-3">
          <View className="items-end">
            <Text className="text-secondary font-bold text-base">{item.amount}</Text>
            <Text className={`${item.statusColor} text-[9px] uppercase font-bold tracking-wider mt-0.5`}>{item.status}</Text>
          </View>
          <IconButton
            icon={MessageCircle}
            onPress={() => { }}
            variant="ghost"
            rounded="full"
            hasBorder={true}
          />
        </View>
      }
      onPress={() => { }}
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
            label="Cobrar"
            onPress={() => { }}
            variant="secondary"
            rounded="full"
          />
        </View>
      }
      onPress={() => { }}
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
        <View className="flex-row items-center gap-3">
          <Text className={`${item.type === 'in' ? 'text-secondary' : 'text-foreground'} font-bold text-base`}>
            {item.amount}
          </Text>
          {item.type === 'in' && (
            <IconButton
              icon={Eye}
              onPress={() => { }}
              variant="ghost"
              size="xs"
              rounded="full"
              hasBorder={true}
            />
          )}
        </View>
      }
      onPress={() => { }}
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
      heroBanner={
        <View className="bg-card p-8 mb-4 border-b border-border items-center">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4 border border-primary/20">
            <Wallet size={32} color={colors.primary} />
          </View>
          <Text className="text-muted-foreground font-bold text-xs uppercase tracking-widest mb-2">Balance Global</Text>
          <Text className="text-foreground font-black text-5xl mb-2 text-center">
            1,240.50 <Text className="text-primary text-3xl font-bold">Bs</Text>
          </Text>
          <Text className="text-muted-foreground text-xs mb-8 text-center max-w-[200px]">Suma de todos tus fondos disponibles.</Text>

          <View className="flex-row gap-4 w-full max-w-[300px] justify-center">
            <View className="flex-1">
              <IconButton
                icon={ArrowDownLeft}
                label="Recargar"
                onPress={() => { }}
                variant="primary"
                rounded="full"
              />
            </View>
            <View className="flex-1">
              <IconButton
                icon={ArrowUpRight}
                label="Retirar"
                onPress={() => { }}
                variant="default"
                hasBorder={true}
                rounded="full"
              />
            </View>
          </View>
        </View>
      }
      tabContainer={<TabContainer tabs={tabs} />}
    />
  );
}

// End of file
