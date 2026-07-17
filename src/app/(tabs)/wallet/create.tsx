import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Store, Link2, ShieldAlert } from 'lucide-react-native';

export default function CreateWalletScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-foreground font-bold text-sm">◀ Volver</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-foreground font-bold text-2xl">Añadir Billetera</Text>
          <Text className="text-foreground text-sm mt-1">Conecta una taquilla o añade un fondo.</Text>
        </View>
      </View>

      <View className="bg-background/80  p-6 border border-zinc-800 mb-8">

        {/* Tipo de Billetera */}
        <Text className="text-foreground font-bold text-xs uppercase mb-4">Tipo de Conexión</Text>
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity className="flex-1 bg-background/80 border border-border p-4  items-center opacity-70">
            <Wallet size={24} color="#71717a" className="mb-2" />
            <Text className="text-foreground font-bold text-center">Billetera Personal</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-primary/20 border border-primary p-4  items-center">
            <Store size={24} color="#caee26" className="mb-2" />
            <Text className="text-primary font-bold text-center">API Taquilla</Text>
            <View className="absolute -top-2 -right-2 bg-primary px-2 py-0.5 rounded-full">
              <Text className="text-black font-bold text-[8px] uppercase">Recomendado</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Alias de la Billetera</Text>
            <TextInput
              placeholder="Ej. Taquilla Centro Piso 1"
              placeholderTextColor="#52525b"
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium"
            />
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Token de Acceso (API Key)</Text>
            <TextInput
              placeholder="sk_live_XXXXXXXXXXXXXXXX"
              placeholderTextColor="#52525b"
              secureTextEntry
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium font-mono"
            />
          </View>
        </View>

        <View className="bg-amber-500/10 border border-amber-500/30 p-4  mb-8 flex-row items-center">
          <ShieldAlert size={20} color="#f59e0b" className="mr-3" />
          <Text className="text-amber-400/80 text-xs flex-1">Nunca compartas tu API Key. Esto dará acceso a los retiros automáticos de tu programa de terceros.</Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity className="bg-primary py-4 rounded-xs flex-row justify-center items-center">
          <Link2 size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-lg">Enlazar Taquilla</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
