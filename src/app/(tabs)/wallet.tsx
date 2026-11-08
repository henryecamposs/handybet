import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Wallet, ArrowUpRight, ArrowDownLeft, Eye, MessageCircle, Trophy, Ticket, CheckCircle2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/useThemeColors';
import { HubLayout, SeccionLista, TabContainer } from '@/components/layout/hub';
import ListItem from '@/components/ui/ListItem';
import IconButton from '@/components/ui/IconButton';
import EmptyState from '@/components/ui/EmptyState';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import { useToastStore } from '@/store/useToastStore';
import { localDB } from '@/lib/localDB';
import seedPrizes from '@/data/prizes.json';
import seedBets from '@/data/bets.json';

export default function WalletScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { walletBalance, addBalance } = useHandyBetStore();
  const { addToast } = useToastStore();

  const [prizes, setPrizes] = useState<any[]>(seedPrizes);
  const [bets, setBets] = useState<any[]>(seedBets);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('100');

  useEffect(() => {
    async function loadWalletData() {
      try {
        const loadedPrizes = await localDB.prizes.getAll();
        if (loadedPrizes && loadedPrizes.length > 0) setPrizes(loadedPrizes);

        const loadedBets = await localDB.bets.getAll();
        if (loadedBets && loadedBets.length > 0) setBets(loadedBets);
      } catch (err) {
        console.warn('Error loading wallet data:', err);
      }
    }
    loadWalletData();
  }, []);

  const handleRecharge = () => {
    const amount = parseFloat(rechargeAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({
        title: 'Ingresa un monto válido para recargar.',
        variant: 'danger',
        position: 'top-right',
      });
      return;
    }

    addBalance(amount);
    setShowRechargeModal(false);
    addToast({
      title: `¡Recarga de ${amount.toFixed(2)} Bs. acreditada con éxito!`,
      variant: 'secondary',
      position: 'top-right',
    });
  };

  const handleWithdraw = () => {
    addToast({
      title: 'Solicitud de retiro enviada',
      description: 'Tu orden de pago móvil está siendo procesada por la taquilla central.',
      variant: 'secondary',
      position: 'top-right',
    });
  };

  const cargosPorGrupo = [
    { id: 'grp_taquilla_ccs', title: 'Taquilla Caracas Centro', subtitle: 'Taquilla Oficial La Imaginaria', icon: '🏛️', amount: '85.00 Bs', status: 'Activo', statusColor: 'text-primary' },
    { id: 'grp_taquilla_val', title: 'Taquilla Valencia VIP', subtitle: 'Taquilla Express', icon: '🎰', amount: '120.00 Bs', status: 'Activo', statusColor: 'text-primary' },
    { id: 'grp_animalitos_vip', title: 'Club Animalitos VIP', subtitle: 'Fondo para sorteos', icon: '🎲', amount: '50.00 Bs', status: 'Disponible', statusColor: 'text-secondary' },
    { id: 'grp_parley_master', title: 'Parley Master Combinadas', subtitle: 'Billetera deportiva', icon: '⚽', amount: '65.50 Bs', status: 'Disponible', statusColor: 'text-secondary' },
    { id: 'grp_bingo_nacional', title: 'Bingo Nacional Mega X', subtitle: 'Cartones comprados', icon: '🎫', amount: '25.00 Bs', status: 'En juego', statusColor: 'text-amber-500' }
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
            onPress={() => router.push(`/chat/${item.id}` as any)}
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
      subtitle={`${item.description} • Boleto: ${item.bet_code || item.id}`}
      subtitleVariant="muted"
      leftElement={
        <View className="w-10 h-10 rounded-full bg-secondary/10 items-center justify-center border border-secondary/35">
          <Trophy size={18} color="#10b981" />
        </View>
      }
      rightElement={
        <View className="flex-row items-center gap-3">
          <Text className="text-primary font-black text-base">{item.amount} {item.currency || 'Bs.'}</Text>
          <IconButton
            label={item.status === 'cobrado' ? 'Cobrado' : 'Cobrar'}
            onPress={() => {
              addToast({
                title: `Premio #${item.id} acreditado a tu billetera`,
                variant: 'secondary',
                position: 'top-right'
              });
            }}
            variant={item.status === 'cobrado' ? 'ghost' : 'secondary'}
            rounded="full"
            size="xs"
          />
        </View>
      }
      onPress={() => { }}
      className="mb-2 bg-background/80"
    />
  );

  const renderMovimientoItem = (item: any) => {
    const isWin = item.status === 'ganadora' || item.status === 'cobrada';
    return (
      <ListItem
        key={item.id}
        title={`Apuesta: ${item.game_title || item.lottery_name || 'Sorteo'}`}
        subtitle={`Pronóstico: ${item.selected_option || 'Jugada'} • Estado: ${item.status?.toUpperCase()}`}
        subtitleVariant="muted"
        leftElement={
          <View className={`w-10 h-10 rounded-full items-center justify-center border ${isWin ? 'bg-secondary/10 border-secondary/30' : 'bg-destructive/10 border-destructive/30'}`}>
            {isWin ? (
              <ArrowDownLeft size={16} color="#10b981" />
            ) : (
              <ArrowUpRight size={16} color="#f43f5e" />
            )}
          </View>
        }
        rightElement={
          <View className="flex-row items-center gap-2">
            <Text className={`${isWin ? 'text-secondary' : 'text-foreground'} font-bold text-sm`}>
              {isWin ? `+${item.amount * 2} Bs.` : `-${item.amount} Bs.`}
            </Text>
          </View>
        }
        onPress={() => { }}
        className="mb-2 bg-background/80"
      />
    );
  };

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
      id: 'premios',
      label: `Premios Ganados (${prizes.length})`,
      content: (
        <View className="mt-2">
          <SeccionLista
            items={prizes}
            renderItem={renderPremioItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      )
    },
    {
      id: 'movimientos',
      label: `Historial de Jugadas (${bets.length})`,
      content: (
        <View className="mt-2">
          <SeccionLista
            items={bets}
            renderItem={renderMovimientoItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      )
    },
    {
      id: 'cargos',
      label: `Taquillas y Grupos (${cargosPorGrupo.length})`,
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
    }
  ];

  return (
    <HubLayout
      title="Billetera y Fondos"
      subtitle="Gestiona tus balances, premios cobrados y movimientos en taquillas."
      showBack={true}
      heroBanner={
        <View className="bg-card/75 p-6 md:p-8 mb-4 border border-white/10 rounded-2xl items-center shadow-lg backdrop-blur-md">
          <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center mb-3 border border-primary/20">
            <Wallet size={28} color={colors.primary} />
          </View>
          <Text className="text-muted-foreground font-extrabold text-[10px] uppercase tracking-widest mb-1">
            Saldo Disponible en HandyBet
          </Text>
          <Text className="text-foreground font-black text-4xl md:text-5xl mb-2 text-center">
            {walletBalance.toFixed(2)} <Text className="text-primary text-2xl font-bold">Bs / Puntos</Text>
          </Text>
          <Text className="text-muted-foreground text-xs mb-6 text-center max-w-[280px]">
            Fondos universales utilizables en juegos, chat VIP y taquillas.
          </Text>

          <View className="flex-row gap-3 w-full max-w-[320px] justify-center">
            <View className="flex-1">
              <IconButton
                icon={ArrowDownLeft}
                label="Recargar"
                onPress={() => setShowRechargeModal(true)}
                variant="primary"
                rounded="full"
              />
            </View>
            <View className="flex-1">
              <IconButton
                icon={ArrowUpRight}
                label="Retirar"
                onPress={handleWithdraw}
                variant="default"
                hasBorder={true}
                rounded="full"
              />
            </View>
          </View>
        </View>
      }
      tabContainer={<TabContainer tabs={tabs} />}
    >
      {/* Modal de Recarga Simulada */}
      <Modal
        visible={showRechargeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRechargeModal(false)}
      >
        <View className="flex-1 bg-black/80 items-center justify-center p-4">
          <View className="bg-card border border-white/10 rounded-2xl w-full max-w-sm p-6 relative shadow-2xl">
            <TouchableOpacity
              onPress={() => setShowRechargeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 items-center justify-center hover:bg-white/20"
            >
              <X size={18} color="#fff" />
            </TouchableOpacity>

            <Text className="text-foreground font-black text-lg mb-1">Recargar Saldo</Text>
            <Text className="text-muted-foreground text-xs mb-4">
              Ingresa el monto para simular tu recarga mediante Pago Móvil inmediato.
            </Text>

            <View className="mb-4">
              <Text className="text-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Monto en Bs.</Text>
              <TextInput
                value={rechargeAmount}
                onChangeText={setRechargeAmount}
                keyboardType="numeric"
                className="bg-background border border-border p-3 rounded-xl text-foreground text-sm font-bold"
              />
            </View>

            <View className="flex-row gap-2 mb-4">
              {['50', '100', '250', '500'].map((chip) => (
                <TouchableOpacity
                  key={chip}
                  onPress={() => setRechargeAmount(chip)}
                  className={`flex-1 py-1.5 rounded-lg border items-center ${
                    rechargeAmount === chip
                      ? 'bg-primary/20 border-primary'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <Text className={`text-xs font-bold ${rechargeAmount === chip ? 'text-primary' : 'text-muted-foreground'}`}>
                    +{chip}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleRecharge}
              className="bg-primary py-3 rounded-full items-center active:scale-95 transition-all shadow-md"
            >
              <Text className="text-black font-extrabold text-sm uppercase tracking-wider">Confirmar Recarga</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </HubLayout>
  );
}
