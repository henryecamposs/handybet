import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Send, Image as ImageIcon, Smile, Mic, Info, ArrowLeft } from 'lucide-react-native';
import { localDB } from '../../../../lib/localDB';
import { useHandyBetStore } from '../../../../store/useHandyBetStore';

export default function GroupChatScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [group, setGroup] = useState<any>({ name: 'Cargando...', members: [] });
  const [messages, setMessages] = useState<any[]>([]);
  const user = useHandyBetStore((state) => state.mockSession);

  const loadData = React.useCallback(async () => {
    const groupData = await localDB.groups.getById(groupId as string);
    if (groupData) setGroup(groupData);

    const allChats = await localDB.chats.getAll();
    const chatData = allChats.find((c: any) => c.type === 'group' && c.group_id === groupId);
    
    if (chatData) {
      // populate with users
      const populated = await Promise.all(
        chatData.messages.map(async (m: any) => {
          const sender = await localDB.users.getById(m.sender_id);
          return { ...m, sender_name: sender?.full_name || 'Usuario', sender_avatar: sender?.avatar_url };
        })
      );
      setMessages(populated);
    }
  }, [groupId]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [groupId, loadData]);

  return (
    <View className="flex-1 bg-background">
      {/* Header del Chat */}
      <View className="h-16 border-b border-zinc-800 flex-row items-center px-4 bg-background/50">
        <TouchableOpacity 
          className="mr-3" 
          onPress={() => router.replace('/(tabs)/grupos' as any)}
        >
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        
        <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center mr-3">
          <Text className="text-xl">🏢</Text>
        </View>
        <View className="flex-1">
          <Text className="text-foreground font-bold text-lg">{group.name}</Text>
          <Text className="text-foreground text-xs">{group.members.length} miembros</Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 bg-background/80 rounded-full items-center justify-center border border-zinc-700 ml-2"
          onPress={() => router.push(`/(tabs)/chat/group/${groupId}/info` as any)}
        >
          <Info size={18} color="#71717a" />
        </TouchableOpacity>
      </View>

      {/* Historial de Mensajes (Desde LocalDB) */}
      <ScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg, index) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <View key={msg.id || index} className={`flex-row mb-4 ${isMe ? 'justify-end' : ''}`}>
              {!isMe && (
                <View className="w-8 h-8 rounded-full bg-background/80 mr-2 items-center justify-center overflow-hidden">
                  {msg.sender_avatar ? (
                    <Image source={{ uri: msg.sender_avatar }} className="w-full h-full" />
                  ) : (
                    <Text className="text-foreground text-xs">{msg.sender_name?.[0]}</Text>
                  )}
                </View>
              )}
              <View className={`${isMe ? 'bg-primary rounded-tr-sm' : 'bg-background/80 rounded-tl-sm'} rounded-2xl p-3 max-w-[80%]`}>
                {!isMe && <Text className="text-primary text-[10px] font-bold mb-1">{msg.sender_name}</Text>}
                <Text className={isMe ? 'text-black font-medium' : 'text-foreground'}>{msg.content}</Text>
                <Text className={`${isMe ? 'text-black/50' : 'text-muted-foreground'} text-[10px] mt-1 text-right`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input de Mensaje */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View className="border-t border-zinc-800 p-4 bg-background/50 flex-row items-center">
          <TouchableOpacity className="p-2">
            <Smile size={24} color="#71717a" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <ImageIcon size={24} color="#71717a" />
          </TouchableOpacity>
          <View className="flex-1 bg-background/80/80 rounded-full flex-row items-center px-4 min-h-[40px] mx-2 border border-zinc-700/50">
            <TextInput
              className="flex-1 text-foreground outline-none"
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
