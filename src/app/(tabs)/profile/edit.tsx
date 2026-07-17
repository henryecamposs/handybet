import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Save, Lock } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/(tabs)/friends"
      onBack={() => router.back()}
    >
      <View className="px-4 pt-6">
        {/* Header Title inside layout children to match the screenshot title placement */}
        <View className="mb-6">
          <Text className="text-foreground font-black text-2xl tracking-tight">Editar Perfil</Text>
          <Text className="text-muted-foreground text-sm mt-1 font-medium">Personaliza cómo te ven los demás.</Text>
        </View>

        <View className="bg-background/80 rounded-3xl p-5 border border-muted-foreground mb-8">
          {/* Avatar Upload */}
          <View className="items-center mb-8 relative">
            <View className="p-1 bg-background rounded-full border border-muted-foreground/35">
              <Image
                source={{ uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Felix&backgroundColor=b6e3f4' }}
                className="w-28 h-28 rounded-full bg-background/80"
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-1/3 translate-x-4 bg-primary w-10 h-10 rounded-full items-center justify-center border-4 border-background/80 hover:bg-primary-dark transition-colors">
              <Camera size={18} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>

          {/* Inputs */}
          <View className="space-y-4 mb-8">
            <View>
              <Text className="text-foreground font-black text-xs uppercase mb-2 tracking-wider">Nombre para mostrar</Text>
              <TextInput
                defaultValue="Félix El Gato"
                placeholderTextColor={colors.mutedForeground}
                className="bg-background/80 text-foreground p-4 rounded-2xl border border-muted-foreground font-semibold text-sm"
              />
            </View>

            <View>
              <Text className="text-foreground font-black text-xs uppercase mb-2 tracking-wider">Nombre de Usuario (Username)</Text>
              <div className="relative flex justify-center items-center">
                <TextInput
                  defaultValue="felix_cat"
                  placeholderTextColor={colors.mutedForeground}
                  editable={false}
                  className="bg-background/30 text-muted-foreground p-4 rounded-2xl border border-muted-foreground/35 font-semibold text-sm w-full pr-12"
                />
                <Lock size={16} color={colors.mutedForeground} className="absolute right-4" />
              </div>
              <Text className="text-muted-foreground text-[10px] mt-1 font-medium">El nombre de usuario no puede ser modificado.</Text>
            </View>

            <View>
              <Text className="text-foreground font-black text-xs uppercase mb-2 tracking-wider">Biografía</Text>
              <TextInput
                defaultValue="Jugador experto de Animalitos 🎲. Siempre activo."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                className="bg-background/80 text-foreground p-4 rounded-2xl border border-muted-foreground font-semibold text-sm"
              />
            </View>
          </View>

          <TouchableOpacity className="bg-primary py-3.5 rounded-2xl flex-row justify-center items-center hover:bg-primary-dark transition-colors">
            <Save size={20} color={colors.primaryForeground} className="mr-2" />
            <Text className="text-primary-foreground font-black text-base">Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </HubDetailLayout>
  );
}
