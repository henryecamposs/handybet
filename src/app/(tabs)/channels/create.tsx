import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Tv, CheckCircle2, FileText } from 'lucide-react-native';

export default function CreateChannelScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-foreground font-bold text-sm">◀ Volver</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-foreground font-bold text-2xl">Crear Canal Oficial</Text>
          <Text className="text-foreground text-sm mt-1">Registra tu empresa o consorcio autorizado.</Text>
        </View>
      </View>

      <View className="bg-background/80  p-6 border border-zinc-800 mb-8">

        <View className="bg-secondary/10 border border-secondary/30 p-4  mb-6 flex-row items-start">
          <CheckCircle2 size={20} color="#10b981" className="mt-1 mr-3" />
          <View className="flex-1">
            <Text className="text-secondary font-bold mb-1">Verificación de Canal</Text>
            <Text className="text-foreground text-xs leading-relaxed">Los canales están destinados a entidades verificadas. Al registrar el canal, deberás esperar la aprobación del equipo de La Imaginaria.</Text>
          </View>
        </View>

        {/* Inputs */}
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre de la Empresa</Text>
            <TextInput
              placeholder="Ej. Consorcio Loterías Unidas"
              placeholderTextColor="#52525b"
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium"
            />
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Registro de Información Fiscal (RIF)</Text>
            <TextInput
              placeholder="J-12345678-9"
              placeholderTextColor="#52525b"
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium uppercase font-mono"
            />
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Descripción del Consorcio</Text>
            <TextInput
              placeholder="Servicios, tipos de apuestas, sedes..."
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium"
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity className="bg-primary py-4 rounded-xs flex-row justify-center items-center">
          <FileText size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-lg">Enviar Solicitud</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
