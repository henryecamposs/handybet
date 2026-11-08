import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Shield, Sparkles, Send, CheckCircle2, QrCode, ArrowLeft } from 'lucide-react-native';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import CrashDemoGame from '@/components/games/CrashDemoGame';
import { useToastStore } from '@/store/useToastStore';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import { localDB } from '@/lib/localDB';
import seedGames from '@/data/games.json';

const legacyDraws = [
  { id: 'd1', title: 'Animalitos VIP', sub: 'Cierra en 45 mins', emoji: '🎲', category: 'animalitos', desc: 'Elige tu animalito de la suerte y multiplica tu jugada x30.' },
  { id: 'd2', title: 'Granja Millonaria', sub: 'Mañana 2:00 PM', emoji: '🐔', category: 'animalitos', desc: 'El tradicional sorteo del campo con pozos acumulados.' },
  { id: 'd3', title: 'Quiniela Champions', sub: 'Cierra en 2 horas', emoji: '⚽', category: 'quinielas', desc: 'Pronostica los resultados de la jornada de Champions League.' },
  { id: 'd4', title: 'Quiniela LaLiga', sub: 'Cierra en 1 día', emoji: '🏆', category: 'quinielas', desc: 'Demuestra tus conocimientos de fútbol español y gana.' },
  { id: 'd5', title: 'Aviator Crash Demo', sub: 'Juega gratis con créditos', emoji: '🚀', category: 'minijuegos', demo_type: 'crash', desc: 'Despega con el cohete, acumula multiplicadores y retírate antes del crash.' },
  { id: 'd6', title: 'Bingo Bailable', sub: 'Empieza a las 9 PM', emoji: '🎫', category: 'bingos', desc: 'Cartones desde 5.00 Bs. ¡Línea y Cartón lleno!' },
];

export default function GameDetailScreen() {
  const { gameId } = useLocalSearchParams();
  const router = useRouter();
  const { addToast } = useToastStore();
  const { walletBalance, deductBalance } = useHandyBetStore();

  const [game, setGame] = useState<any>(null);
  const [selectedNumber, setSelectedNumber] = useState('');
  const [amount, setAmount] = useState('10');
  const [recentTicket, setRecentTicket] = useState<any>(null);

  useEffect(() => {
    // Buscar en seedGames o legacyDraws
    const found =
      seedGames.find((g: any) => g.id === gameId) ||
      legacyDraws.find((d: any) => d.id === gameId);

    if (found) {
      setGame(found);
    } else {
      localDB.games.getById(gameId as string).then((g) => {
        setGame(g || seedGames[0]);
      });
    }
  }, [gameId]);

  if (!game) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-foreground text-sm font-semibold">Cargando detalles del juego...</Text>
      </View>
    );
  }

  const isCrashGame =
    game.id === 'g_aviator_crash' ||
    game.id === 'd5' ||
    game.demo_type === 'crash' ||
    game.category === 'minijuegos';

  const handlePlaySubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast({
        title: 'Ingresa un monto válido para apostar.',
        variant: 'danger',
        position: 'top-right',
      });
      return;
    }

    if (!selectedNumber.trim()) {
      addToast({
        title: 'Ingresa tu número o pronóstico.',
        variant: 'danger',
        position: 'top-right',
      });
      return;
    }

    const hasBalance = deductBalance(numAmount);
    if (!hasBalance) {
      addToast({
        title: `Saldo insuficiente (${walletBalance.toFixed(2)} Bs.). Recarga para continuar.`,
        variant: 'danger',
        position: 'top-right',
      });
      return;
    }

    const ticketSerial = `TKT-${Math.floor(100000 + Math.random() * 900000)}-${game.category.substring(0, 3).toUpperCase()}`;
    const newBet = {
      id: `bet_${Date.now()}`,
      user_id: 'usr_henry',
      group_id: 'grp_taquilla_ccs',
      game_id: game.id,
      game_title: game.title,
      selected_option: selectedNumber,
      amount: numAmount,
      currency: 'VES',
      status: 'confirmada',
      ticket_serial: ticketSerial,
      created_at: new Date().toISOString(),
    };

    await localDB.bets.insert(newBet);

    setRecentTicket(newBet);
    addToast({
      title: `¡Jugada Confirmada! Boleto #${ticketSerial}`,
      variant: 'secondary',
      position: 'top-right',
    });
  };

  return (
    <HubDetailLayout
      backRoute="/(tabs)/games"
      logoType="play"
      categoryText={game.category?.toUpperCase() || 'JUEGOS'}
      title={game.title}
    >
      {/* Detalle del Juego */}
      <View className="items-center mb-6">
        <View className="w-20 h-20 bg-background/80 items-center justify-center mb-3 border border-border shadow-xl relative rounded-2xl">
          <Text className="text-4xl">{game.emoji || '🎮'}</Text>
          <View className="absolute -bottom-2 -right-2 bg-primary w-7 h-7 rounded-full border-2 border-zinc-950 items-center justify-center">
            <Shield size={12} color="#000" />
          </View>
        </View>
        <Text className="text-foreground text-sm text-center px-4 mb-1 font-medium">
          {game.desc || game.sub || 'Participa y multiplica tus ganancias con HandyBet.'}
        </Text>
        <Text className="text-primary text-xs font-black uppercase tracking-wider">
          {game.schedule ? `Frecuencia: ${game.schedule}` : game.sub}
        </Text>
      </View>

      {/* Si es Crash Game / Aviator Demo, renderizar el juego interactivo */}
      {isCrashGame ? (
        <View className="mb-8">
          <CrashDemoGame />
        </View>
      ) : (
        /* Zona de Jugada Interactiva */
        <View className="bg-background/80 p-6 border border-border rounded-2xl mb-8 shadow-lg">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <Sparkles size={18} color="#caee26" />
              <Text className="text-foreground font-bold text-base">Realizar Apuesta Oficial</Text>
            </View>
            <View className="bg-primary/20 border border-primary/30 px-3 py-1 rounded-full">
              <Text className="text-primary font-bold text-xs">
                Saldo: {walletBalance.toFixed(2)} Bs.
              </Text>
            </View>
          </View>

          {recentTicket ? (
            /* Comprobante de Boleto emitido */
            <View className="bg-card/90 border border-secondary/40 p-5 rounded-xl mb-4 items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <CheckCircle2 size={20} color="#10b981" />
                <Text className="text-secondary font-black text-sm uppercase">¡Boleto Emitido Exitosamente!</Text>
              </View>
              <Text className="text-foreground font-mono font-bold text-base mb-1">{recentTicket.ticket_serial}</Text>
              <Text className="text-muted-foreground text-xs mb-3">
                Pronóstico: <Text className="text-foreground font-bold">{recentTicket.selected_option}</Text> • Monto: <Text className="text-primary font-bold">{recentTicket.amount} Bs.</Text>
              </Text>
              <View className="flex-row gap-2 w-full mt-2">
                <TouchableOpacity
                  onPress={() => setRecentTicket(null)}
                  className="flex-1 bg-primary py-2.5 rounded-full items-center active:scale-95"
                >
                  <Text className="text-black font-bold text-xs uppercase tracking-wider">Realizar Otra Jugada</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/wallets' as any)}
                  className="flex-1 bg-white/10 py-2.5 rounded-full items-center border border-white/10 active:scale-95"
                >
                  <Text className="text-foreground font-bold text-xs uppercase tracking-wider">Ver en Billetera</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View className="gap-4">
              <View>
                <Text className="text-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">
                  Tu Pronóstico / Número / Selección
                </Text>
                <TextInput
                  value={selectedNumber}
                  onChangeText={setSelectedNumber}
                  placeholder="Ej. 05-LEÓN, Real Madrid o 777"
                  placeholderTextColor="#71717a"
                  className="bg-card border border-border p-3.5 rounded-xl text-foreground text-sm font-semibold"
                />
              </View>

              <View>
                <Text className="text-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">
                  Monto a Apostar (Bs. / Puntos)
                </Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholder="Ej. 25"
                  placeholderTextColor="#71717a"
                  className="bg-card border border-border p-3.5 rounded-xl text-foreground text-sm font-semibold"
                />
              </View>

              {/* Botones de montos rápidos */}
              <View className="flex-row gap-2">
                {['5', '10', '25', '50', '100'].map((chip) => (
                  <TouchableOpacity
                    key={chip}
                    onPress={() => setAmount(chip)}
                    className={`flex-1 py-1.5 rounded-lg border items-center ${
                      amount === chip
                        ? 'bg-primary/20 border-primary'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        amount === chip ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      +{chip}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={handlePlaySubmit}
                activeOpacity={0.85}
                className="bg-primary py-3.5 rounded-full items-center flex-row justify-center mt-2 shadow-md active:scale-95 transition-all"
              >
                <Send size={16} color="#000" className="mr-2" />
                <Text className="text-black font-extrabold text-sm uppercase tracking-wider">Confirmar y Emitir Boleto</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </HubDetailLayout>
  );
}
