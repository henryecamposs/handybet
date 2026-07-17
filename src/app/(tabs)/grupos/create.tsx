import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Save, Shield, Settings2 } from 'lucide-react-native';

export default function CreateGroupScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background/80 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-foreground font-bold text-sm">◀ Volver</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-foreground font-bold text-2xl">Crear Grupo</Text>
          <Text className="text-foreground text-sm mt-1">Empieza tu propia comunidad en La Imaginaria.</Text>
        </View>
      </View>

      <View className="bg-background/80  p-6 border border-border mb-8">
        {/* Avatar Upload (Simulated) */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-background/80 border-2 border-dashed border-border items-center justify-center mb-3">
            <Users size={32} color="#71717a" />
          </View>
          <TouchableOpacity>
            <Text className="text-primary font-bold text-sm">Subir Imagen de Portada</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View className="space-y-4 mb-6">
          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre del Grupo</Text>
            <TextInput
              placeholder="Ej. VIP Animalitos Los Pinos"
              placeholderTextColor="#52525b"
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium"
            />
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Descripción</Text>
            <TextInput
              placeholder="¿De qué trata esta comunidad?"
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              className="bg-background/80 text-foreground p-4 rounded-xs border border-border font-medium"
            />
          </View>
        </View>

        {/* Configuraciones */}
        <Text className="text-foreground font-bold text-xs uppercase mb-4">Privacidad y Categoría</Text>
        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity className="flex-1 bg-primary/20 border border-primary p-4  items-center">
            <Shield size={24} color="#caee26" className="mb-2" />
            <Text className="text-primary font-bold">Privado</Text>
            <Text className="text-foreground text-[10px] text-center mt-1">Solo por invitación</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-background/80 border border-border p-4  items-center opacity-70">
            <Users size={24} color="#71717a" className="mb-2" />
            <Text className="text-foreground font-bold">Público</Text>
            <Text className="text-foreground text-[10px] text-center mt-1">Cualquiera se une</Text>
          </TouchableOpacity>
        </View>

        {/* Categoria Picker (Simulated) */}
        <View className="mb-8 bg-background/80 p-4 rounded-xs border border-border flex-row justify-between items-center">
          <View>
            <Text className="text-foreground text-xs font-bold mb-1">Categoría Principal</Text>
            <Text className="text-foreground font-medium">Apuestas & Sorteos</Text>
          </View>
          <Settings2 size={20} color="#71717a" />
        </View>

        {/* Action Button */}
        <TouchableOpacity className="bg-primary py-4 rounded-xs flex-row justify-center items-center">
          <Save size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-lg">Crear Comunidad</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
