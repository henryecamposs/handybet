import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Shield, Sparkles, Send } from 'lucide-react-native';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import { useToastStore } from '@/store/useToastStore';

const allDraws = [
  { id: 'd1', title: 'Animalitos VIP', sub: 'Cierra en 45 mins', emoji: '🎲', category: 'Taquillas', desc: 'Elige tu animalito de la suerte y multiplica tu jugada.' },
  { id: 'd2', title: 'Carreras 5y6', sub: 'Mañana 2:00 PM', emoji: '🏇', category: 'Taquillas', desc: 'El tradicional juego de carreras de caballos nacional.' },
  { id: 'd3', title: 'Quiniela Champions', sub: 'Cierra en 2 horas', emoji: '⚽', category: 'Quinielas', desc: 'Pronostica los resultados de la jornada de Champions League.' },
  { id: 'd4', title: 'Quiniela LaLiga', sub: 'Cierra en 1 día', emoji: '🏆', category: 'Quinielas', desc: 'Demuestra tus conocimientos de fútbol español y gana.' },
  { id: 'd5', title: 'Flappy Bird Crypto', sub: 'Juega gratis', emoji: '🎮', category: 'Minijuegos', desc: 'Esquiva los obstáculos para acumular puntos canjeables.' },
];

export default function GameDetailScreen() {
  const { gameId } = useLocalSearchParams();
  const router = useRouter();
  const { addToast } = useToastStore();
  const [selectedNumber, setSelectedNumber] = useState('');
  const [amount, setAmount] = useState('');

  const game = allDraws.find((d) => d.id === gameId) || allDraws[0];

  const handlePlaySubmit = () => {
    if (!amount) {
      addToast({
        title: 'Ingresa un monto',
        variant: 'muted',
        position: 'top-right',
      });
      return;
    }
    addToast({
      title: '¡Jugada Procesada con Éxito!',
      variant: 'secondary',
      position: 'top-right',
    });
    setSelectedNumber('');
    setAmount('');
  };

  return (
    <HubDetailLayout
      backRoute="/(tabs)/games"
      logoType="play"
      categoryText={game.category}
      title={game.title}
    >
      {/* Detalle del Juego */}
      <View className="items-center mb-8">
        <View className="w-24 h-24 rounded-3xl bg-background/80 items-center justify-center mb-4 border border-zinc-700 shadow-xl relative">
          <Text className="text-4xl">{game.emoji}</Text>
          <View className="absolute -bottom-2 -right-2 bg-primary w-8 h-8 rounded-full border-4 border-zinc-950 items-center justify-center">
            <Shield size={12} color="#000" />
          </View>
        </View>
        <Text className="text-foreground text-sm text-center px-4 mb-2">{game.desc}</Text>
        <Text className="text-muted-foreground text-xs font-bold uppercase">{game.sub}</Text>
      </View>

      {/* Zona de Jugada Interactiva (Premium) */}
      <View className="bg-background/80 p-6 rounded-3xl border border-zinc-800 mb-8">
        <View className="flex-row items-center gap-2 mb-4">
          <Sparkles size={18} color="#caee26" />
          <Text className="text-foreground font-bold text-base">Realizar Jugada</Text>
        </View>

        {game.category !== 'Minijuegos' ? (
          <View className="gap-4">
            <View>
              <Text className="text-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Tu Pronóstico / Número</Text>
              <TextInput
                value={selectedNumber}
                onChangeText={setSelectedNumber}
                placeholder="Ej. 12 o Real Madrid"
                placeholderTextColor="#71717a"
                className="bg-background border border-zinc-800 p-4 rounded-xs text-foreground text-sm font-semibold"
              />
            </View>

            <View>
              <Text className="text-foreground text-xs font-bold mb-1.5 uppercase tracking-wider">Monto a Apostar (Puntos)</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Ej. 100"
                placeholderTextColor="#71717a"
                className="bg-background border border-zinc-800 p-4 rounded-xs text-foreground text-sm font-semibold"
              />
            </View>

            <TouchableOpacity
              onPress={handlePlaySubmit}
              className="bg-primary py-4 rounded-xs items-center flex-row justify-center mt-2"
            >
              <Send size={16} color="#000" className="mr-2" />
              <Text className="text-black font-bold text-sm">Enviar Jugada</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center py-4">
            <Text className="text-foreground text-sm text-center mb-6">
              Este minijuego se ejecuta en el navegador del dispositivo. ¿Listo para jugar?
            </Text>
            <TouchableOpacity
              onPress={() => {
                addToast({
                  title: 'Iniciando juego...',
                  variant: 'secondary',
                  position: 'top-right',
                });
              }}
              className="bg-primary px-8 py-3.5 rounded-xs"
            >
              <Text className="text-black font-bold text-sm">Iniciar Partida</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </HubDetailLayout>
  );
}
