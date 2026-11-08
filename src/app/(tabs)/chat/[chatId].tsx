import React, { useState, useEffect } from 'react';
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
import BotActionBar from '../../../components/chat/BotActionBar';
import { CopilotMode, InteractiveButton } from '../../../types/chat';
import { messagingService } from '../../../services/messagingService';
import { localDB } from '../../../lib/localDB';

export default function ChatDetailScreen() {
  const { chatId } = useLocalSearchParams();
  const { goBack, navigateTo } = useAppNavigation();
  const colors = useThemeColors();
  const [copilotMode, setCopilotMode] = useState<CopilotMode>('copilot_hybrid');
  const { addToast } = useToastStore();

  const [messages, setMessages] = useState<MessageProps[]>([
    {
      id: 1,
      sender: 'them',
      text: '¡Hola! Bienvenid@ a Soporte HandyBet y Bot ERP. ¿En qué podemos ayudarte?',
      time: '11:40 AM',
      isBotGenerated: true,
      buttons: [
        { id: 'btn_1', label: '🛒 Ver Catalogo VIP (@comprar)', action_type: 'submit_command', payload: '@comprar' },
        { id: 'btn_2', label: '❓ Preguntas Frecuentes (/ayuda)', action_type: 'submit_command', payload: '/ayuda' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<MessageProps | null>(null);

  useEffect(() => {
    async function loadChatMessages() {
      if (!chatId) return;
      try {
        const allChats = await localDB.chats.getAll();
        const found = allChats.find((c: any) => c.id === chatId);
        if (found && found.messages && found.messages.length > 0) {
          const formatted: MessageProps[] = found.messages.map((m: any, idx: number) => ({
            id: m.id || idx,
            sender: m.sender_id === 'usr_henry' ? 'me' : 'them',
            text: m.content || m.text || '',
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true }) : '12:00 PM',
            mediaUrl: m.media_url,
            is_locked: m.is_locked,
            unlock_price: m.unlock_price,
            preview_url: m.preview_url,
            media_type: m.media_type,
            buttons: m.buttons
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.warn('Error loading chat messages:', err);
      }
    }
    loadChatMessages();
  }, [chatId]);

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

  const handleSendMessage = async (textToSend: string, buttonPayload?: string) => {
    if (!textToSend.trim() && !buttonPayload) return;

    const currentTime = new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true });

    // 1. Mensaje del Usuario
    const userMsg: MessageProps = {
      id: Date.now(),
      sender: 'me',
      text: textToSend.trim() || buttonPayload || '',
      time: currentTime,
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text,
        sender: replyingTo.sender,
      } : undefined,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setReplyingTo(null);

    // 2. Si el modo Co-Piloto está activo, procesar mediante el Bot Engine
    if (copilotMode !== 'human_takeover' && copilotMode !== 'disabled') {
      const result = await messagingService.sendMessage(
        (chatId as string) || 'conv_demo',
        'usr_me',
        textToSend,
        'text',
        undefined,
        { active_bot_id: 'sales_erp_bot' },
        buttonPayload
      );

      if (result.botMessage) {
        setTimeout(() => {
          const botMsg: MessageProps = {
            id: Date.now() + 1,
            sender: 'them',
            text: result.botMessage!.content,
            time: new Date().toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: true }),
            mediaUrl: result.botMessage!.media_url,
            buttons: result.botMessage!.buttons,
            isBotGenerated: true
          };
          setMessages(prev => [...prev, botMsg]);
        }, 400);
      }
    }
  };

  const handlePressButton = (btn: InteractiveButton) => {
    handleSendMessage(btn.label, btn.payload);
  };

  const handleToggleRecord = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      const newMsg: MessageProps = {
        id: Date.now(),
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
        {/* Encabezado del Chat */}
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
                <Text className="text-foreground font-black text-sm">Soporte HandyBet & Bot ERP</Text>
                <Text className="text-primary text-xs font-bold uppercase tracking-wider">En línea • Co-Piloto Activo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de Comandos Rápidos del Bot y Switch Co-Piloto */}
        <BotActionBar
          copilotMode={copilotMode}
          onToggleCopilotMode={setCopilotMode}
          onSelectCommand={(cmd) => handleSendMessage(cmd, cmd)}
        />

        {/* Muro de Mensajes Virtualizados */}
        <MessageContainer
          messages={messages}
          onDelete={handleDelete}
          onCopy={handleCopy}
          onReply={handleReply}
          onPressButton={handlePressButton}
        />

        {/* Contenedor de Referencia (Responder) */}
        {replyingTo && (
          <TouchableOpacity
            className="px-4 py-2 border-t border-border bg-muted/30 flex-row items-center justify-between"
          >
            <View className="flex-1 border-l-4 border-primary pl-2">
              <Text className="text-xs font-bold text-primary">{replyingTo.sender === 'me' ? 'Tú' : 'Soporte'}</Text>
              <Text className="text-xs text-muted-foreground" numberOfLines={1}>{replyingTo.text}</Text>
            </View>
            <IconButton icon={X} onPress={() => setReplyingTo(null)} variant="ghost" size="xs" iconColor={colors.mutedForeground} hasBorder={false} />
          </TouchableOpacity>
        )}

        {/* Caja de Entrada de Texto */}
        <View className="p-2 border-t border-border flex-row items-center gap-1 bg-background/40">
          <IconButton
            icon={ImageIcon}
            onPress={() => { }}
            variant="ghost"
            rounded="full"
            iconColor={colors.mutedForeground}
            hasBorder={false}
          />

          <TextInput
            placeholder={isRecording ? 'Grabando audio...' : 'Escribe tu mensaje o @comando...'}
            placeholderTextColor={colors.mutedForeground}
            editable={!isRecording}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage(inputText)}
            className="flex-1 bg-background/80 border border-border rounded-full px-4 py-3 text-white font-bold outline-none"
          />

          <IconButton
            icon={isRecording ? Square : Mic}
            onPress={handleToggleRecord}
            variant={isRecording ? 'destructive' : 'ghost'}
            rounded="full"
            iconColor={isRecording ? 'white' : colors.mutedForeground}
            hasBorder={false}
          />

          <IconButton
            icon={Send}
            onPress={() => handleSendMessage(inputText)}
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
