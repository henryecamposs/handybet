import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { ImageIcon, X, Mic, Square, Send, ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MessageContainer from '../../../components/chat/MessageContainer';
import { MessageProps } from '../../../components/chat/MessageItem';
import { useThemeColors } from '@/hooks/useThemeColors';
import IconButton from '@/components/ui/IconButton';
import * as Clipboard from 'expo-clipboard';
import { useToastStore } from '@/store/useToastStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';

export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();
  const router = useRouter();
  const { goBack, navigateTo } = useAppNavigation();
  const colors = useThemeColors();
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
  const [replyingTo, setReplyingTo] = useState<MessageProps | null>(null);
  const { addToast } = useToastStore();

  const handleDelete = (id: string | number) => {
    setMessages(messages.filter(m => m.id !== id));
    addToast({ title: 'Mensaje eliminado', variant: 'default' });
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    addToast({ title: 'Copiado al portapapeles', variant: 'default' });
  };

  const handleReply = (id: string | number) => {
    const msg = messages.find(m => m.id === id);
    if (msg) setReplyingTo(msg);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: MessageProps = {
      id: messages.length + 1,
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true }),
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender,
      } : undefined,
    };

    setMessages([...messages, newMsg]);
    setInputText('');
    setReplyingTo(null);
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
      <View className="flex-1 pt-2 p-2">
        <View className="flex-row items-center justify-between px-6 pb-2 border-b border-border">
          <View className="flex-row items-center gap-2 flex-1">
            <TouchableOpacity onPress={() => goBack('/(tabs)/chat')} className="mr-1">
              <ArrowLeft size={24} color={colors.foreground} />
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center gap-3 flex-1"
              onPress={() => navigateTo(`/(tabs)/follows/${chatId}`)}
            >
              <Image source={{ uri: 'https://placehold.co/100' }} className="w-10 h-10 rounded-full border border-border/50 shadow-sm" />
              <View>
                <Text className="text-foreground font-black text-sm">Soporte La Imaginaria</Text>
                <Text className="text-secondary text-xs font-bold uppercase tracking-wider">En línea</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mensajes */}
        <MessageContainer
          messages={messages}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onReply={handleReply}
        />

        {/* Contenedor de Referencia (Responder) */}
        {replyingTo && (
          <TouchableOpacity 
            className="px-4 py-2 border-t border-border bg-muted/30 flex-row items-center justify-between"
            onPress={() => { /* Simular scroll al mensaje */ }}
          >
            <View className="flex-1 border-l-4 border-primary pl-2">
              <Text className="text-xs font-bold text-primary">{replyingTo.sender === 'me' ? 'Tú' : 'Soporte La Imaginaria'}</Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>{replyingTo.text}</Text>
            </View>
            <IconButton icon={X} onPress={() => setReplyingTo(null)} variant="ghost" size="xs" iconColor={colors.mutedForeground} hasBorder={false} />
          </TouchableOpacity>
        )}

        {/* Caja de Entrada */}
        <View className="p-2 border-t border-border flex-row items-center gap-1 bg-background/40">
          <IconButton
            icon={ImageIcon}
            onPress={() => { }}
            variant="ghost"
            rounded='full'
            iconColor={colors.mutedForeground}
            hasBorder={false}
          />

          <TextInput
            placeholder={isRecording ? 'Grabando audio...' : 'Escribe tu mensaje...'}
            placeholderTextColor={colors.mutedForeground}
            editable={!isRecording}
            value={inputText}
            onChangeText={setInputText}
            className="flex-1 bg-background/80 border border-border rounded-full px-4 py-3 text-white font-bold  outline-none"
          />

          {/* Grabadora de Voz Nativa simulada */}
          <IconButton
            icon={isRecording ? Square : Mic}
            onPress={handleToggleRecord}
            variant={isRecording ? 'destructive' : 'ghost'}
            rounded='full'
            iconColor={isRecording ? 'white' : colors.mutedForeground}
            hasBorder={false}
          />

          {/* Botón de Enviar */}
          <IconButton
            icon={Send}
            onPress={handleSend}
            variant={!inputText.trim() ? 'ghost' : 'primary'}
            rounded="full"
            iconColor={!inputText.trim() ? colors.mutedForeground : colors.primary}
            hasBorder={false}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
