import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Gamepad2, Trophy, Ticket, Dice1 } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function JuegosScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="mb-6">
        <Text className="text-foreground font-bold text-2xl">Juegos y Sorteos</Text>
        <Text className="text-foreground text-sm mt-1">Diviértete y participa en los sorteos de La Imaginaria.</Text>
      </View>

      {/* Hero Banner Lotería */}
      <View className="bg-primary/20 rounded-2xl p-6 border border-primary/30 mb-8 relative overflow-hidden">
        <View className="z-10">
          <View className="bg-primary px-3 py-1 rounded-full self-start mb-3">
            <Text className="text-black font-bold text-xs uppercase">Sorteo Activo</Text>
          </View>
          <Text className="text-primary font-black text-3xl mb-2">Gran Kino Imaginario</Text>
          <Text className="text-foreground font-medium mb-4">¡Gana hasta 5,000 Puntos hoy a las 8:00 PM!</Text>
          <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl self-start">
            <Text className="text-black font-bold">Jugar Ahora</Text>
          </TouchableOpacity>
        </View>
        <Trophy size={120} color="rgba(202, 238, 38, 0.2)" className="absolute right-4 bottom-4 z-0" />
      </View>

      {/* Categorías */}
      <View className="flex-row gap-4 mb-8">
        <TouchableOpacity className="flex-1 bg-background/80 p-4 rounded-2xl border border-zinc-800 items-center justify-center">
          <Ticket size={28} color="#caee26" className="mb-2" />
          <Text className="text-foreground font-bold text-center">Taquillas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-background/80 p-4 rounded-2xl border border-zinc-800 items-center justify-center">
          <Dice1 size={28} color="#caee26" className="mb-2" />
          <Text className="text-foreground font-bold text-center">Quinielas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-background/80 p-4 rounded-2xl border border-zinc-800 items-center justify-center">
          <Gamepad2 size={28} color="#caee26" className="mb-2" />
          <Text className="text-foreground font-bold text-center">Minijuegos</Text>
        </TouchableOpacity>
      </View>

      {/* Próximos Sorteos */}
      <View className="mb-8">
        <Text className="text-foreground font-bold text-lg mb-4">Próximos Sorteos</Text>
        <View className="bg-background/80 p-4 rounded-2xl border border-zinc-800 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center mr-4 border border-zinc-700">
              <Text className="text-xl">🎲</Text>
            </View>
            <View>
              <Text className="text-foreground font-bold">Animalitos VIP</Text>
              <Text className="text-foreground text-sm">Cierra en 45 mins</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-background/80 px-4 py-2 rounded-full border border-zinc-700">
            <Text className="text-foreground font-bold text-xs">Jugar</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-background/80 p-4 rounded-2xl border border-zinc-800 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl bg-background/80 items-center justify-center mr-4 border border-zinc-700">
              <Text className="text-xl">🏇</Text>
            </View>
            <View>
              <Text className="text-foreground font-bold">Carreras 5y6</Text>
              <Text className="text-foreground text-sm">Mañana 2:00 PM</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-background/80 px-4 py-2 rounded-full border border-zinc-700">
            <Text className="text-foreground font-bold text-xs">Jugar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
