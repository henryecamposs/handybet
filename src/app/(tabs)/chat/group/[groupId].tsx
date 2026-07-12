import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Image as ImageIcon, Smile, Mic, Info } from 'lucide-react-native';
import { handyBetGroups } from '../../../../mockdata/handyBetMock';

export default function GroupChatScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const group = handyBetGroups.find((g: any) => g.id === groupId) || { name: 'Chat Grupal', members: [] };

  return (
    <View className="flex-1 bg-zinc-950">
      {/* Header del Chat */}
      <View className="h-16 border-b border-zinc-800 flex-row items-center px-4 bg-zinc-900/50">
        <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mr-3">
          <Text className="text-xl">🏢</Text>
        </View>
        <View className="flex-1">
          <Text className="text-zinc-100 font-bold text-lg">{group.name}</Text>
          <Text className="text-zinc-400 text-xs">{group.members.length} miembros</Text>
        </View>
        <TouchableOpacity 
          className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center border border-zinc-700 ml-2"
          onPress={() => router.push(`/(tabs)/chat/group/${groupId}/info` as any)}
        >
          <Info size={18} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Historial de Mensajes (Simulado) */}
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
        <View className="items-center mb-6">
          <Text className="text-zinc-600 text-xs">Hoy, 10:45 AM</Text>
        </View>
        
        <View className="flex-row mb-4">
          <View className="w-8 h-8 rounded-full bg-zinc-800 mr-2 items-center justify-center">
            <Text className="text-zinc-400 text-xs">A</Text>
          </View>
          <View className="bg-zinc-800 rounded-2xl rounded-tl-sm p-3 max-w-[80%]">
            <Text className="text-zinc-100">¡Hola a todos! ¿Alguien activo para jugar?</Text>
          </View>
        </View>

        <View className="flex-row mb-4 justify-end">
          <View className="bg-primary rounded-2xl rounded-tr-sm p-3 max-w-[80%]">
            <Text className="text-black font-medium">Sí, ya me conecto. Pásame la sala.</Text>
          </View>
        </View>
      </ScrollView>

      {/* Input de Mensaje */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="border-t border-zinc-800 p-4 bg-zinc-900/50 flex-row items-center">
          <TouchableOpacity className="p-2">
            <Smile size={24} color="#71717a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ImageIcon size={24} color="#71717a" />
          </TouchableOpacity>
          <View className="flex-1 bg-zinc-800/80 rounded-full flex-row items-center px-4 min-h-[40px] mx-2 border border-zinc-700/50">
            <TextInput 
              className="flex-1 text-zinc-100 outline-none"
              placeholder="Escribe un mensaje..."
              placeholderTextColor="#71717a"
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
              <Mic size={24} color="#71717a" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
