import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { X, HelpCircle, MessageCircle, Send, CheckCircle2, Shield, Headphones, FileText, ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToastStore } from '@/store/useToastStore';
import { useRouter } from 'expo-router';

export interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SupportModal({ visible, onClose }: SupportModalProps) {
  const colors = useThemeColors();
  const { addToast } = useToastStore();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'ticket' | 'faq'>('ticket');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Recargas & Pagos');

  const categories = ['Recargas & Pagos', 'Apuestas & Tickets', 'Canales & Grupos', 'Cuenta & Seguridad'];

  const faqs = [
    {
      q: '¿Cómo recargo saldo en un grupo o taquilla?',
      a: 'Para recargar saldo, selecciona el grupo en tu pantalla de Grupos, presiona "Billeteras" e ingresa la referencia de Pago Móvil o Zelle proporcionada por la agencia.'
    },
    {
      q: '¿Cuánto tardan en procesarse los retiros y premios?',
      a: 'Los premios confirmados por el cajero son acreditados de forma inmediata a la wallet del grupo correspondiente. Los retiros a tu banco toman entre 5 y 15 minutos.'
    },
    {
      q: '¿Cómo verifico si un canal es oficial?',
      a: 'Los canales oficiales cuentan con la insignia de Verificación de Consorcio y están marcados por el equipo de La Imaginaria.'
    },
    {
      q: '¿Qué hago si mi transacción figura como pendiente?',
      a: 'Puedes enviar un ticket directamente desde este formulario adjuntando el código de referencia para que un operador de Soporte de La Imaginaria lo atienda.'
    }
  ];

  const handleSendTicket = () => {
    if (!subject.trim() || !message.trim()) {
      addToast({ title: 'Ingresa un asunto y descripción para el ticket', variant: 'muted' });
      return;
    }

    addToast({ title: '¡Ticket de soporte enviado a La Imaginaria!', variant: 'success' });
    setSubject('');
    setMessage('');
    onClose();
  };

  const handleOpenLiveChat = () => {
    onClose();
    router.push('/(tabs)/chat');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center p-4 z-50">
        <View className="bg-background border border-border w-full max-w-lg max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl flex-col">

          {/* Header */}
          <View className="bg-card border-b border-border p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center border border-primary/40">
                <Headphones size={22} color={colors.primary} />
              </View>
              <View>
                <Text className="text-foreground font-black text-lg">Soporte HandyBet</Text>
                <Text className="text-muted-foreground text-xs">Atención al cliente y resolución de dudas 24/7.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full hover:bg-muted">
              <X size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Quick Chat Switch */}
          <View className="p-4 bg-primary/10 border-b border-primary/20 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2.5 flex-1 pr-2">
              <MessageCircle size={20} color={colors.primary} />
              <Text className="text-foreground text-xs font-bold leading-4">
                ¿Necesitas atención en vivo con un operador?
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleOpenLiveChat}
              className="bg-primary px-3.5 py-2 rounded-full"
            >
              <Text className="text-primary-foreground font-black text-xs">Chat en Vivo</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs Selector */}
          <View className="flex-row border-b border-border bg-card">
            <TouchableOpacity
              onPress={() => setActiveTab('ticket')}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'ticket' ? 'border-primary bg-background/50' : 'border-transparent'
                }`}
            >
              <Text className={`text-xs font-bold ${activeTab === 'ticket' ? 'text-primary' : 'text-muted-foreground'}`}>
                Enviar Ticket
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab('faq')}
              className={`flex-1 py-3 items-center border-b-2 ${activeTab === 'faq' ? 'border-primary bg-background/50' : 'border-transparent'
                }`}
            >
              <Text className={`text-xs font-bold ${activeTab === 'faq' ? 'text-primary' : 'text-muted-foreground'}`}>
                Preguntas Frecuentes (FAQ)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Body */}
          <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={true}>
            {activeTab === 'ticket' ? (
              <View className="gap-4">
                <View>
                  <Text className="text-foreground font-bold text-xs uppercase mb-2">Categoría de la Consulta</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        onPress={() => setCategory(cat)}
                        className={`px-3.5 py-2 rounded-full border ${category === cat ? 'bg-primary/20 border-primary' : 'bg-card border-border'
                          }`}
                      >
                        <Text className={`text-xs font-bold ${category === cat ? 'text-primary' : 'text-foreground'}`}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-foreground font-bold text-xs uppercase mb-2">Asunto *</Text>
                  <TextInput
                    value={subject}
                    onChangeText={setSubject}
                    placeholder="Ej. Problema con acreditación de pago"
                    placeholderTextColor={colors.mutedForeground}
                    className="bg-card text-foreground px-4 py-3 rounded-full border border-border font-medium text-xs"
                  />
                </View>

                <View>
                  <Text className="text-foreground font-bold text-xs uppercase mb-2">Mensaje / Detalles *</Text>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Describe el inconveniente o tu duda con el mayor detalle posible..."
                    placeholderTextColor={colors.mutedForeground}
                    multiline
                    numberOfLines={4}
                    className="bg-card text-foreground p-4 rounded-2xl border border-border font-medium text-xs"
                  />
                </View>

                <TouchableOpacity
                  onPress={handleSendTicket}
                  className="bg-primary py-3.5 rounded-full flex-row items-center justify-center gap-2 mt-1 shadow-lg shadow-primary/20"
                >
                  <Send size={16} color="#000" />
                  <Text className="text-black font-black text-xs uppercase tracking-wider">Enviar Consulta</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-3">
                {faqs.map((faq, idx) => (
                  <View key={idx} className="bg-card border border-border p-4 rounded-xl gap-1.5">
                    <View className="flex-row items-center gap-2">
                      <HelpCircle size={16} color={colors.primary} />
                      <Text className="text-foreground font-bold text-xs flex-1">{faq.q}</Text>
                    </View>
                    <Text className="text-muted-foreground text-xs leading-relaxed pl-6">{faq.a}</Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="bg-card border-t border-border p-3 flex-row items-center justify-between">
            <Text className="text-muted-foreground text-[10px]">HandyBet Support System v1.9</Text>
            <TouchableOpacity onPress={onClose} className="px-4 py-1.5 bg-background border border-border rounded-full">
              <Text className="text-foreground font-bold text-xs">Cerrar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
