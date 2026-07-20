import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, Save, Shield, Settings2, Bot, Dice5, ShoppingBag, Sparkles, MessageSquare, Check, HelpCircle, Wallet } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToastStore } from '@/store/useToastStore';
import { localDB } from '@/lib/localDB';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import InterestChipsSelector from '@/components/ui/InterestChipsSelector';
import HubCover from '@/components/layout/hub/HubCover';
import { BotConfig, BotType, HandyBetGroupType } from '@/types/handyBet';

export default function CreateGroupScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addToast } = useToastStore();
  const { mockSession } = useHandyBetStore();

  const [name, setName] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [description, setDescription] = useState('');
  const [groupType, setGroupType] = useState<HandyBetGroupType>('apuestas');
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [channelsList, setChannelsList] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>(['Pronósticos', 'Apuestas Deportivas']);
  
  // Wallet Settings
  const [walletType, setWalletType] = useState<'mixed' | 'direct_pay' | 'credit'>('mixed');
  const [allowsRecharge, setAllowsRecharge] = useState(true);

  // Bots Configuration
  const [bots, setBots] = useState<BotConfig[]>([
    {
      id: 'bot_ai',
      type: 'bot_ai_assistant',
      name: 'Asistente IA de Consultas',
      description: 'Responde preguntas frecuentes del grupo usando inteligencia artificial.',
      is_enabled: true,
    },
    {
      id: 'bot_lottery',
      type: 'bot_lottery',
      name: 'Bot de Loterías & Jugadas',
      description: 'Conecta con la base de datos de loterías para verificar boletos y ganadores.',
      is_enabled: true,
    },
    {
      id: 'bot_sales',
      type: 'bot_sales',
      name: 'Bot ERP de Ventas & Cotizaciones',
      description: 'Conecta con la BD de tu empresa para ofrecer precios y procesar pedidos.',
      is_enabled: false,
    },
    {
      id: 'bot_welcome',
      type: 'bot_welcome',
      name: 'Bot de Bienvenida & Reglas',
      description: 'Envía las normas y da la bienvenida automáticamente a los nuevos miembros.',
      is_enabled: true,
    },
  ]);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const chns = await localDB.channels.getAll();
        setChannelsList(chns || []);
      } catch (e) {
        console.error(e);
      }
    }
    fetchChannels();
  }, []);

  const toggleBot = (botId: string) => {
    setBots(bots.map((b) => (b.id === botId ? { ...b, is_enabled: !b.is_enabled } : b)));
  };

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      addToast({ title: 'Ingresa el nombre del grupo', variant: 'muted' });
      return;
    }

    try {
      const generatedCode = shortCode.trim() || name.substring(0, 4).toUpperCase() + Math.floor(100 + Math.random() * 900);
      const newGroup = {
        id: localDB.generateId('grp'),
        channel_id: selectedChannelId || 'chn_001',
        short_code: generatedCode,
        name: name.trim(),
        description: description.trim(),
        type: groupType,
        tags,
        configured_bots: bots.filter((b) => b.is_enabled),
        settings: {
          wallet_type: walletType,
          allows_recharge: allowsRecharge,
        },
        config: {
          allows_recharge: allowsRecharge,
          wallet_type: walletType,
        },
        members: [mockSession?.id || 'usr_henry'],
        created_at: new Date().toISOString(),
      };

      await localDB.groups.insert(newGroup);
      addToast({ title: '¡Grupo creado exitosamente!', variant: 'success' });
      router.back();
    } catch (e) {
      console.error(e);
      addToast({ title: 'Error al crear el grupo', variant: 'muted' });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-8 pb-16" showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <View className="mb-4 rounded-xl overflow-hidden border border-border">
        <HubCover variant="muted" containerClasses="h-28" />
        <View className="p-4 bg-card flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border border-primary">
              <Users size={24} color={colors.primary} />
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">{name || 'Nombre del Grupo'}</Text>
              <Text className="text-muted-foreground text-xs">
                {groupType.toUpperCase()} • {bots.filter((b) => b.is_enabled).length} Bots Activos
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Title */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-foreground font-black text-2xl">Crear Nuevo Grupo</Text>
          <Text className="text-muted-foreground text-xs mt-1">Configura reglas, tags, bots de autorespuesta y economía.</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="px-3 py-1.5 bg-card border border-border rounded-lg">
          <Text className="text-foreground font-bold text-xs">◀ Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Main Form Card */}
      <View className="bg-card border border-border p-6 rounded-2xl mb-12 gap-6">

        {/* 1. Datos Básicos */}
        <View className="gap-4">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">1. Información del Grupo</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Canal Matriz (Opcional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setSelectedChannelId(null)}
                className={`px-4 py-2.5 rounded-xl border ${
                  selectedChannelId === null ? 'bg-primary/20 border-primary' : 'bg-background border-border'
                }`}
              >
                <Text className={`text-xs font-bold ${selectedChannelId === null ? 'text-primary' : 'text-foreground'}`}>
                  Grupo Autónomo / Independiente
                </Text>
              </TouchableOpacity>
              {channelsList.map((chn) => (
                <TouchableOpacity
                  key={chn.id}
                  onPress={() => setSelectedChannelId(chn.id)}
                  className={`px-4 py-2.5 rounded-xl border ${
                    selectedChannelId === chn.id ? 'bg-primary/20 border-primary' : 'bg-background border-border'
                  }`}
                >
                  <Text className={`text-xs font-bold ${selectedChannelId === chn.id ? 'text-primary' : 'text-foreground'}`}>
                    📢 {chn.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre del Grupo *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. VIP Animalitos Los Pinos"
              placeholderTextColor={colors.mutedForeground}
              className="bg-background text-foreground p-4 rounded-xl border border-border font-medium"
            />
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">Código Corto (Prefix)</Text>
              <TextInput
                value={shortCode}
                onChangeText={setShortCode}
                placeholder="Ej. PINO"
                placeholderTextColor={colors.mutedForeground}
                maxLength={6}
                className="bg-background text-foreground p-4 rounded-xl border border-border font-mono uppercase font-bold"
              />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">Tipo de Grupo</Text>
              <View className="bg-background border border-border rounded-xl p-1 flex-row">
                <TouchableOpacity
                  onPress={() => setGroupType('apuestas')}
                  className={`flex-1 py-3 items-center rounded-lg ${groupType === 'apuestas' ? 'bg-primary' : ''}`}
                >
                  <Text className={`text-xs font-bold ${groupType === 'apuestas' ? 'text-primary-foreground' : 'text-foreground'}`}>Apuestas</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setGroupType('compartir_media')}
                  className={`flex-1 py-3 items-center rounded-lg ${groupType === 'compartir_media' ? 'bg-primary' : ''}`}
                >
                  <Text className={`text-xs font-bold ${groupType === 'compartir_media' ? 'text-primary-foreground' : 'text-foreground'}`}>Media</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Descripción</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="¿De qué trata esta comunidad y qué jugadas o servicios ofrece?"
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              className="bg-background text-foreground p-4 rounded-xl border border-border font-medium"
            />
          </View>
        </View>

        {/* 2. Temas & Chips de Interés */}
        <View className="pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary mb-3">2. Temas & Tags del Grupo</Text>
          <InterestChipsSelector
            selectedInterests={tags}
            onChange={setTags}
            label="Selecciona o añade etiquetas del grupo"
            allowCustom={true}
          />
        </View>

        {/* 3. Configuración de Bots de Autorespuesta */}
        <View className="gap-3 pt-4 border-t border-border/60">
          <View className="flex-row items-center gap-2 mb-1">
            <Bot size={20} color={colors.primary} />
            <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">
              3. Bots de Autorespuesta & Integraciones
            </Text>
          </View>
          <Text className="text-muted-foreground text-xs mb-2">
            Activa los bots que interactuarán automáticamente en el chat de tu grupo:
          </Text>

          <View className="gap-3">
            {bots.map((bot) => (
              <View
                key={bot.id}
                className={`p-4 rounded-xl border flex-row items-center justify-between ${
                  bot.is_enabled ? 'bg-primary/10 border-primary/60' : 'bg-background border-border'
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <View className={`w-10 h-10 rounded-full items-center justify-center ${bot.is_enabled ? 'bg-primary' : 'bg-muted'}`}>
                    <Bot size={20} color={bot.is_enabled ? '#000' : colors.mutedForeground} />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-bold text-xs ${bot.is_enabled ? 'text-primary' : 'text-foreground'}`}>{bot.name}</Text>
                    <Text className="text-muted-foreground text-[10px] leading-4 mt-0.5">{bot.description}</Text>
                  </View>
                </View>
                <Switch
                  value={bot.is_enabled}
                  onValueChange={() => toggleBot(bot.id)}
                  trackColor={{ false: '#3f3f46', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            ))}
          </View>
        </View>

        {/* 4. Economía y Billetera */}
        <View className="gap-4 pt-4 border-t border-border/60">
          <View className="flex-row items-center gap-2 mb-1">
            <Wallet size={20} color={colors.primary} />
            <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">
              4. Economía & Recargas
            </Text>
          </View>

          <View className="flex-row items-center justify-between p-4 bg-background border border-border rounded-xl">
            <View>
              <Text className="text-foreground font-bold text-xs">Permitir Recargas de Saldo</Text>
              <Text className="text-muted-foreground text-[10px]">Los miembros podrán cargar créditos a su billetera en el grupo.</Text>
            </View>
            <Switch
              value={allowsRecharge}
              onValueChange={setAllowsRecharge}
              trackColor={{ false: '#3f3f46', true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleCreateGroup}
          className="bg-primary py-4 rounded-xl flex-row justify-center items-center mt-4 shadow-lg shadow-primary/20"
        >
          <Save size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-base uppercase tracking-wider">Crear Grupo Oficial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
