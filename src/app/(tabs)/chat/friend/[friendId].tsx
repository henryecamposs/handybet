import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Image as ImageIcon, Smile, Mic, Info, ArrowLeft } from 'lucide-react-native';
import { handyBetUsers } from '../../../../mockdata/handyBetMock';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function FriendChatScreen() {
  const { friendId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const [message, setMessage] = useState('');

  const friend = handyBetUsers.find((u: any) => u.id === friendId) || { name: 'Amigo', avatar: 'https://i.pravatar.cc/150' };

  return (
    <View className="flex-1 bg-background">
      {/* Header del Chat estilo Twitter */}
      <View className="flex-row items-center justify-between border-b border-primary/20 py-2 px-4 bg-background/85 sticky top-0 z-10">
        <View className="flex-row items-center">
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)/friends' as any)} 
            className="mr-3 p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push(`/profile/${friendId}` as any)}
          >
            <Image source={{ uri: friend.avatar }} className="w-10 h-10 rounded-full bg-background/80 mr-3 border border-muted-foreground/35" />
            <View>
              <Text className="text-foreground font-bold text-base">{friend.name}</Text>
              <Text className="text-secondary text-xs font-semibold">En línea</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-9 h-9 bg-background/80 rounded-full items-center justify-center border border-muted-foreground/35 hover:bg-background/80/85">
          <Info size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Historial de Mensajes (Simulado) */}
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center mb-6">
          <Text className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Hoy, 9:20 AM</Text>
        </View>

        <View className="flex-row mb-4">
          <Image source={{ uri: friend.avatar }} className="w-8 h-8 rounded-full mr-2 border border-muted-foreground/15" />
          <View className="bg-background/80 rounded-2xl rounded-tl-sm p-3 max-w-[80%] border border-muted-foreground/15">
            <Text className="text-foreground text-sm">¡Hola! ¿Viste los nuevos sorteos de La Imaginaria?</Text>
          </View>
        </View>

        <View className="flex-row mb-4 justify-end">
          <View className="bg-primary rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
            <Text className="text-black font-semibold text-sm">Sí, acabo de verlos. Voy a recargar saldo en mi billetera.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input de Mensaje */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="border-t border-muted-foreground/15 p-4 bg-background/50 flex-row items-center">
          <TouchableOpacity className="p-2">
            <Smile size={24} color={colors.mutedForeground} />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ImageIcon size={24} color={colors.mutedForeground} />
          </TouchableOpacity>
          <View className="flex-1 bg-background/80 rounded-full flex-row items-center px-4 min-h-[40px] mx-2 border border-muted-foreground/35">
            <TextInput
              className="flex-1 text-foreground ml-1 outline-none text-sm"
              placeholder={`Escríbele a ${friend.name.split(' ')[0]}...`}
              placeholderTextColor={colors.mutedForeground}
              value={message}
              onChangeText={setMessage}
              multiline
            />
          </View>
          {message.length > 0 ? (
            <TouchableOpacity className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Send size={18} color="#000" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="p-2">
              <Mic size={24} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
