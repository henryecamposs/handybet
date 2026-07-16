import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'them',
      text: 'Hola, bienvenido al soporte de La Imaginaria. ¿En qué podemos ayudarte?',
      time: '11:40 AM',
    },
    {
      id: 2,
      sender: 'them',
      text: 'Su recarga por Pago Móvil de 150 Bs. ha sido procesada con éxito.',
      time: '11:45 AM',
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // Registrar nota de voz simulada
      const newMsg = {
        id: messages.length + 1,
        sender: 'me',
        text: '🎤 Nota de voz (0:08)',
        time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true }),
      };
      setMessages([...messages, newMsg]);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 pt-12">
        {/* Cabecera del Chat */}
        <View className="flex-row items-center justify-between px-6 pb-4 border-b border-zinc-900">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-white text-base">◀</Text>
            </TouchableOpacity>
            <Image source={{ uri: 'https://placehold.co/100' }} className="w-9 h-9 rounded-full border border-zinc-700" />
            <View>
              <Text className="text-white font-black text-sm">Soporte La Imaginaria</Text>
              <Text className="text-secondary text-[9px] font-black uppercase tracking-wider">En línea</Text>
            </View>
          </View>
        </View>

        {/* Mensajes */}
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 16 }}>
          {messages.map((msg) => {
            const isMe = msg.sender === 'me';
            return (
              <View
                key={msg.id}
                className={`mb-4 max-w-[80%] rounded-2xl p-4 ${isMe
                  ? 'bg-secondary/10 border border-secondary/20 align-self-end ml-auto'
                  : 'bg-background/80 border border-zinc-850 align-self-start mr-auto'
                  }`}
              >
                <Text className={`text-sm ${isMe ? 'text-secondary font-bold' : 'text-foreground'}`}>
                  {msg.text}
                </Text>
                <Text className="text-[9px] text-foreground font-bold text-right mt-1.5 uppercase font-mono">
                  {msg.time}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Caja de Entrada */}
        <View className="p-4 border-t border-zinc-900 flex-row items-center gap-2 bg-background/40">
          <TextInput
            placeholder={isRecording ? 'Grabando audio...' : 'Escribe tu mensaje...'}
            placeholderTextColor="#64748b"
            editable={!isRecording}
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 bg-background/80 border border-zinc-800 rounded-2xl px-4 py-3 text-white font-bold"
          />

          {/* Grabadora de Voz Nativa simulada */}
          <TouchableOpacity
            onPress={handleToggleRecord}
            className={`w-12 h-12 rounded-2xl justify-center items-center ${isRecording
              ? 'bg-rose-500/20 border border-rose-500'
              : 'bg-background/80 border border-zinc-800'
              }`}
          >
            <Text className="text-white text-base">{isRecording ? '⏹' : '🎤'}</Text>
          </TouchableOpacity>

          {/* Botón de Enviar */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={isRecording || !inputText.trim()}
            className={`w-12 h-12 rounded-2xl justify-center items-center ${!inputText.trim() ? 'bg-background/80 border border-zinc-800/40' : 'bg-secondary border border-secondary'
              }`}
          >
            <Text className={`text-base font-black ${!inputText.trim() ? 'text-foreground' : 'text-foreground'}`}>
              ▶
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
