import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { ImageIcon } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MessageContainer from '../../../components/chat/MessageContainer';
import { MessageProps } from '../../../components/chat/MessageItem';
export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<MessageProps[]>([
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

    const newMsg: MessageProps = {
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
      const newMsg: MessageProps = {
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
        <View className="flex-row items-center justify-between px-6 pb-4 border-b border-border">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()} className="p-1">
              <Text className="text-white text-base">◀</Text>
            </TouchableOpacity>
            <Image source={{ uri: 'https://placehold.co/100' }} className="w-9 h-9 rounded-full border border-border" />
            <View>
              <Text className="text-white font-black text-sm">Soporte La Imaginaria</Text>
              <Text className="text-secondary text-[9px] font-black uppercase tracking-wider">En línea</Text>
            </View>
          </View>
        </View>

        {/* Mensajes */}
        <MessageContainer 
          messages={messages} 
          onDelete={(id) => setMessages(messages.filter(m => m.id !== id))}
        />

        {/* Caja de Entrada */}
        <View className="p-4 border-t border-border flex-row items-center gap-2 bg-background/40">
          <TouchableOpacity
            className="w-12 h-12 justify-center items-center bg-background/80 border border-border rounded-none hover:bg-muted/50 transition-colors"
          >
            <ImageIcon size={20} color="#64748b" />
          </TouchableOpacity>

          <TextInput
            placeholder={isRecording ? 'Grabando audio...' : 'Escribe tu mensaje...'}
            placeholderTextColor="#64748b"
            editable={!isRecording}
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 bg-background/80 border border-border px-4 py-3 text-white font-bold rounded-none outline-none"
          />

          {/* Grabadora de Voz Nativa simulada */}
          <TouchableOpacity
            onPress={handleToggleRecord}
            className={`w-12 h-12 justify-center items-center rounded-none transition-colors ${isRecording
              ? 'bg-rose-500/20 border border-rose-500'
              : 'bg-background/80 border border-border hover:bg-muted/50'
              }`}
          >
            <Text className="text-white text-base">{isRecording ? '⏹' : '🎤'}</Text>
          </TouchableOpacity>

          {/* Botón de Enviar */}
          <TouchableOpacity
            onPress={handleSend}
            disabled={isRecording || !inputText.trim()}
            className={`w-12 h-12  justify-center items-center ${!inputText.trim() ? 'bg-background/80 border border-border/40' : 'bg-secondary border border-secondary'
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
