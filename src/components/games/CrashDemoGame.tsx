import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Rocket, Sparkles, RefreshCw, Trophy, AlertTriangle, Play, CheckCircle } from 'lucide-react-native';
import { useToastStore } from '@/store/useToastStore';
import { useThemeColors } from '@/hooks/useThemeColors';

interface PlayerBet {
  username: string;
  amount: number;
  cashedOutAt?: number;
  crashed?: boolean;
}

export default function CrashDemoGame() {
  const colors = useThemeColors();
  const { addToast } = useToastStore();

  const [demoBalance, setDemoBalance] = useState(500.0);
  const [betAmount, setBetAmount] = useState('25');
  const [gameState, setGameState] = useState<'idle' | 'flying' | 'crashed' | 'cashed_out'>('idle');
  const [multiplier, setMultiplier] = useState(1.0);
  const [cashOutMultiplier, setCashOutMultiplier] = useState(1.0);
  const [winAmount, setWinAmount] = useState(0);

  const [livePlayers, setLivePlayers] = useState<PlayerBet[]>([
    { username: '@kevin_crash', amount: 50, cashedOutAt: 2.15 },
    { username: '@dani_poker', amount: 100, cashedOutAt: 3.40 },
    { username: '@carlos_ruiz', amount: 25, crashed: true },
    { username: '@gabo_parley', amount: 75, cashedOutAt: 1.85 },
  ]);

  const intervalRef = useRef<any>(null);
  const crashPointRef = useRef(2.5);

  const parsedBet = parseFloat(betAmount) || 0;

  // Iniciar la ronda de juego
  const startGame = () => {
    if (parsedBet <= 0) {
      addToast({ title: 'Ingresa un monto de apuesta válido', variant: 'danger' });
      return;
    }
    if (parsedBet > demoBalance) {
      addToast({ title: 'Créditos demo insuficientes. ¡Usa el botón de recargar!', variant: 'danger' });
      return;
    }

    // Descontar apuesta
    setDemoBalance(prev => Math.max(0, prev - parsedBet));
    setMultiplier(1.0);
    setGameState('flying');

    // Calcular punto de Crash aleatorio (probabilidad ponderada)
    const rand = Math.random();
    let crashTarget = 1.2 + Math.random() * 4.0;
    if (rand > 0.7) crashTarget = 5.0 + Math.random() * 15.0; // 30% de multiplicadores altos
    if (rand > 0.95) crashTarget = 25.0 + Math.random() * 50.0; // 5% de súper multiplicadores
    crashPointRef.current = parseFloat(crashTarget.toFixed(2));

    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Curva de aceleración exponencial
      const currentMult = parseFloat((1.0 + Math.pow(elapsed * 0.9, 1.45)).toFixed(2));

      if (currentMult >= crashPointRef.current) {
        clearInterval(intervalRef.current);
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        addToast({ title: `💥 ¡CRASH EN ${crashPointRef.current.toFixed(2)}x!`, variant: 'danger' });
      } else {
        setMultiplier(currentMult);
      }
    }, 60);
  };

  // Retirarse antes del crash (Cash Out)
  const cashOut = () => {
    if (gameState !== 'flying') return;
    clearInterval(intervalRef.current);

    const won = parseFloat((parsedBet * multiplier).toFixed(2));
    setCashOutMultiplier(multiplier);
    setWinAmount(won);
    setDemoBalance(prev => prev + won);
    setGameState('cashed_out');

    addToast({
      title: `🎉 ¡Cobraste ${won} Créditos a ${multiplier.toFixed(2)}x!`,
      variant: 'success'
    });
  };

  // Limpiar timer si el componente se desmonta
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <View className="bg-card/90 border border-border p-5 rounded-3xl mb-6 shadow-2xl backdrop-blur-xl">
      {/* Cabecera del Simulador */}
      <View className="flex-row items-center justify-between mb-4 border-b border-white/10 pb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-full bg-primary/20 items-center justify-center border border-primary/40">
            <Rocket size={18} color={colors.primary} />
          </View>
          <View>
            <Text className="text-foreground font-black text-base">Aviator Rocket Crash</Text>
            <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">Simulador Demo Oficial</Text>
          </View>
        </View>

        {/* Balance Ficticio y Recarga */}
        <View className="flex-row items-center gap-2">
          <View className="bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <Text className="text-[9px] text-muted-foreground uppercase font-bold">Créditos Demo</Text>
            <Text className="text-primary font-black text-sm">{demoBalance.toFixed(2)} PTS</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDemoBalance(prev => prev + 500);
              addToast({ title: '+500 Créditos Demo añadidos 🪙', variant: 'success' });
            }}
            className="w-8 h-8 rounded-full bg-white/10 items-center justify-center hover:bg-white/20 active:scale-95"
          >
            <RefreshCw size={14} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pantalla de Vuelo / Multiplicador */}
      <View className="h-56 bg-black/70 rounded-2xl border border-white/10 items-center justify-center relative overflow-hidden mb-4">
        {/* Grilla de Fondo */}
        <View className="absolute inset-0 opacity-15">
          <View className="h-full w-full border-b border-dashed border-white/40" />
        </View>

        {/* Cohete Animado */}
        {gameState === 'flying' && (
          <View className="absolute animate-bounce mb-12">
            <Rocket size={42} color={colors.primary} />
            <Sparkles size={20} color="#f59e0b" className="absolute -bottom-2 -left-2" />
          </View>
        )}

        {/* Display del Multiplicador */}
        <View className="items-center z-10">
          <Text
            className={`text-6xl font-black tracking-tight font-mono ${
              gameState === 'crashed'
                ? 'text-rose-500'
                : gameState === 'cashed_out'
                ? 'text-emerald-400'
                : 'text-primary'
            }`}
          >
            {multiplier.toFixed(2)}x
          </Text>
          <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">
            {gameState === 'idle' && 'Listo para el despegue'}
            {gameState === 'flying' && '🚀 Cohete en ascenso...'}
            {gameState === 'crashed' && '💥 ¡EXPLOTÓ EL COHETE!'}
            {gameState === 'cashed_out' && `✅ Retiro Exitoso a ${cashOutMultiplier.toFixed(2)}x (+${winAmount} PTS)`}
          </Text>
        </View>

        {/* Indicador de Ganancia Potencial en Vuelo */}
        {gameState === 'flying' && (
          <View className="absolute bottom-3 bg-white/10 px-4 py-1 rounded-full border border-white/20">
            <Text className="text-white text-xs font-extrabold">
              Cobro actual: <Text className="text-primary font-black">{(parsedBet * multiplier).toFixed(2)} PTS</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Panel de Control de Apuesta */}
      <View className="flex-row items-center gap-3 mb-4">
        <View className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-4 py-2 flex-row items-center justify-between">
          <Text className="text-muted-foreground text-xs font-bold">Apuesta:</Text>
          <TextInput
            value={betAmount}
            onChangeText={setBetAmount}
            keyboardType="numeric"
            editable={gameState === 'idle' || gameState === 'crashed' || gameState === 'cashed_out'}
            className="text-right text-white font-black text-lg w-28 p-0"
          />
        </View>

        {/* Botón Principal (Apostar o Cash Out) */}
        {gameState === 'flying' ? (
          <TouchableOpacity
            onPress={cashOut}
            className="flex-1 bg-emerald-500 hover:bg-emerald-400 active:scale-95 py-3.5 rounded-2xl items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Text className="text-black font-black text-sm uppercase tracking-wider">
              ¡Retirar {(parsedBet * multiplier).toFixed(2)} PTS!
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startGame}
            className="flex-1 bg-primary hover:bg-primary-light active:scale-95 py-3.5 rounded-2xl items-center justify-center shadow-lg shadow-primary/30"
          >
            <Text className="text-black font-black text-sm uppercase tracking-wider">
              {gameState === 'crashed' || gameState === 'cashed_out' ? 'Jugar Otra Ronda' : 'Lanzar Cohete'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chips Rápidos de Apuesta */}
      <View className="flex-row items-center justify-between mb-4 gap-2">
        {['10', '25', '50', '100', '250'].map(val => (
          <TouchableOpacity
            key={val}
            onPress={() => setBetAmount(val)}
            disabled={gameState === 'flying'}
            className="flex-1 bg-white/5 border border-white/10 py-1.5 rounded-xl items-center hover:bg-white/10 active:scale-95"
          >
            <Text className="text-white text-xs font-bold">+{val}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => setBetAmount(String(Math.floor(demoBalance)))}
          disabled={gameState === 'flying'}
          className="flex-1 bg-primary/20 border border-primary/30 py-1.5 rounded-xl items-center hover:bg-primary/30 active:scale-95"
        >
          <Text className="text-primary text-xs font-black">MAX</Text>
        </TouchableOpacity>
      </View>

      {/* Registro de Apuestas en Vivo de la Comunidad */}
      <View className="border-t border-white/10 pt-3">
        <Text className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-2">
          Comunidad HandyBet Jugando en Vivo
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {livePlayers.map((p, idx) => (
            <View key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex-row items-center gap-1.5">
              <Text className="text-white text-xs font-semibold">{p.username}</Text>
              <Text className="text-muted-foreground text-[10px]">{p.amount} PTS</Text>
              {p.cashedOutAt ? (
                <Text className="text-emerald-400 text-xs font-black">+{p.cashedOutAt}x</Text>
              ) : (
                <Text className="text-rose-400 text-xs font-bold">Crash</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

