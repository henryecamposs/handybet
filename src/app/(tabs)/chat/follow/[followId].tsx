import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Image as ImageIcon, Smile, Mic, Info, ArrowLeft } from 'lucide-react-native';
import { handyBetUsers } from '../../../../mockdata/handyBetMock';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function FollowChatScreen() {
  const { followId } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();
  const [message, setMessage] = useState('');

  const followUser = handyBetUsers.find((u: any) => u.id === followId) || { name: 'Usuario', avatar: 'https://i.pravatar.cc/150' };

  return (
    <View className="flex-1 bg-background">
      {/* Header del Chat estilo Twitter */}
      <View className="flex-row items-center justify-between border-b border-border py-2 px-4 bg-background/85 sticky top-0 z-10">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)/follows' as any)}
            className="mr-3 p-2 rounded-full hover:bg-primary/20 transition-colors"
          >
            <ArrowLeft size={22} color={colors.foreground} />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() => router.push(`/profile/${followId}` as any)}
          >
            <Image source={{ uri: followUser.avatar }} className="w-10 h-10 rounded-full bg-background/80 mr-3 border border-border/35" />
            <View>
              <Text className="text-foreground font-bold text-base">{followUser.name}</Text>
              <Text className="text-secondary text-xs font-semibold">En línea</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="w-9 h-9 bg-background/80 rounded-full items-center justify-center border border-border/35 hover:bg-background/80/85">
          <Info size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Área de Mensajes */}
      <ScrollView className="flex-1 px-4 py-4">
        {/* Mensaje Recibido */}
        <View className="flex-row items-end mb-4 max-w-[85%]">
          <Image source={{ uri: followUser.avatar }} className="w-8 h-8 rounded-full mr-2 border border-border/15" />
          <View className="bg-background/80  rounded-bl-sm p-3 border border-border/15">
            <Text className="text-foreground text-[15px]">¡Hola! ¿Cómo vas con las apuestas de hoy?</Text>
            <Text className="text-muted-foreground text-[10px] self-end mt-1">10:42 AM</Text>
          </View>
        </View>

        {/* Mensaje Enviado */}
        <View className="flex-row items-end mb-4 self-end max-w-[85%] justify-end">
          <View className="bg-primary/90  rounded-br-sm p-3">
            <Text className="text-primary-foreground font-medium text-[15px]">¡Todo excelente! Acabo de armar una buena taquilla.</Text>
            <Text className="text-primary-foreground/70 text-[10px] self-end mt-1">10:45 AM</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input de Mensaje */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="flex-row items-end px-3 py-3 bg-background border-t border-border">
          <TouchableOpacity className="p-2 mr-1">
            <ImageIcon size={22} color={colors.primary} />
          </TouchableOpacity>
          <View className="flex-1 bg-background/80 rounded-full flex-row items-center px-4 py-1.5 border border-border/35 mr-2">
            <TextInput
              className="flex-1 text-foreground text-[15px] max-h-24 pt-2 pb-2"
              placeholder={`Escríbele a ${followUser.name.split(' ')[0]}...`}
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
