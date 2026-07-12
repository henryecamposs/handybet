import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Save, Lock } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center gap-2 mb-6">
        <TouchableOpacity onPress={() => router.back()} className="mr-2">
          <Text className="text-zinc-400 font-bold text-sm">◀ Volver</Text>
        </TouchableOpacity>
        <View>
          <Text className="text-zinc-100 font-bold text-2xl">Editar Perfil</Text>
          <Text className="text-zinc-400 text-sm mt-1">Personaliza cómo te ven los demás.</Text>
        </View>
      </View>

      <View className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 mb-8">
        
        {/* Avatar Upload */}
        <View className="items-center mb-8 relative">
          <Image 
            source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4' }} 
            className="w-28 h-28 rounded-full border-4 border-zinc-800 bg-zinc-800"
          />
          <TouchableOpacity className="absolute bottom-0 right-1/3 translate-x-4 bg-primary w-10 h-10 rounded-full items-center justify-center border-4 border-zinc-900">
            <Camera size={18} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-zinc-400 font-bold text-xs uppercase mb-2">Nombre para mostrar</Text>
            <TextInput 
              defaultValue="Félix El Gato"
              placeholderTextColor="#52525b"
              className="bg-zinc-800 text-zinc-100 p-4 rounded-xl border border-zinc-700 font-medium"
            />
          </View>

          <View>
            <Text className="text-zinc-400 font-bold text-xs uppercase mb-2">Nombre de Usuario (Username)</Text>
            <View className="relative justify-center">
              <TextInput 
                defaultValue="felix_cat"
                placeholderTextColor="#52525b"
                editable={false}
                className="bg-zinc-800/50 text-zinc-500 p-4 rounded-xl border border-zinc-700/50 font-medium"
              />
              <Lock size={16} color="#71717a" className="absolute right-4" />
            </View>
            <Text className="text-zinc-600 text-[10px] mt-1">El nombre de usuario no puede ser modificado.</Text>
          </View>
          
          <View>
            <Text className="text-zinc-400 font-bold text-xs uppercase mb-2">Biografía</Text>
            <TextInput 
              defaultValue="Jugador experto de Animalitos 🎲. Siempre activo."
              placeholderTextColor="#52525b"
              multiline
              numberOfLines={3}
              className="bg-zinc-800 text-zinc-100 p-4 rounded-xl border border-zinc-700 font-medium"
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity className="bg-primary py-4 rounded-xl flex-row justify-center items-center">
          <Save size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-lg">Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
