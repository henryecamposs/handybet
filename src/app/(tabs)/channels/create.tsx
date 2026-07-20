import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Megaphone, CheckCircle2, ShieldAlert, Lock, Globe, Sparkles, Image as ImageIcon, Heart, Newspaper, ShoppingBag, Dice5, Users } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToastStore } from '@/store/useToastStore';
import { localDB } from '@/lib/localDB';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import InterestChipsSelector from '@/components/ui/InterestChipsSelector';
import HubCover from '@/components/layout/hub/HubCover';
import { TargetAudience } from '@/types/handyBet';

export default function CreateChannelScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addToast } = useToastStore();
  const { mockSession } = useHandyBetStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [is18Plus, setIs18Plus] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<TargetAudience[]>(['general']);
  const [interests, setInterests] = useState<string[]>(['Apuestas Deportivas', 'Noticias Locales']);

  const targetOptions: { id: TargetAudience; label: string; icon: any; desc: string }[] = [
    { id: 'apostadores', label: 'Apostadores & Parley', icon: Dice5, desc: 'Dirigido a pronosticadores y jugadas' },
    { id: 'compartidores_contenido', label: 'Creadores & Media', icon: Sparkles, desc: 'Publicidad y contenido de valor' },
    { id: 'noticias', label: 'Noticias & Actualidad', icon: Newspaper, desc: 'Informativos y primicias' },
    { id: 'amor_citas', label: 'Citas & Entretenimiento', icon: Heart, desc: 'Social y comunidades exclusivas' },
    { id: 'tecnologia_ventas', label: 'Comercio & Ventas', icon: ShoppingBag, desc: 'Comercio y servicios' },
    { id: 'general', label: 'Público General', icon: Users, desc: 'Comunidad abierta a todos' },
  ];

  const toggleTarget = (targetId: TargetAudience) => {
    if (selectedTargets.includes(targetId)) {
      if (selectedTargets.length > 1) {
        setSelectedTargets(selectedTargets.filter((t) => t !== targetId));
      }
    } else {
      setSelectedTargets([...selectedTargets, targetId]);
    }
  };

  const handleCreateChannel = async () => {
    if (!name.trim()) {
      addToast({ title: 'Ingresa un nombre para el canal', variant: 'muted' });
      return;
    }

    try {
      const newChannel = {
        id: localDB.generateId('chn'),
        name: name.trim(),
        owner_id: mockSession?.id || 'usr_owner1',
        description: description.trim(),
        visibility,
        is_18_plus: is18Plus,
        target_audience: selectedTargets,
        interests,
        created_at: new Date().toISOString(),
      };

      await localDB.channels.insert(newChannel);
      addToast({ title: '¡Canal registrado exitosamente!', variant: 'success' });
      router.back();
    } catch (e) {
      console.error(e);
      addToast({ title: 'Error al registrar el canal', variant: 'muted' });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-8 pb-16" showsVerticalScrollIndicator={false}>
      {/* Portada Hero Preview */}
      <View className="mb-4 rounded-xl overflow-hidden border border-border">
        <HubCover variant="primary" containerClasses="h-32" />
        <View className="p-4 bg-card flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center border border-primary">
              <Megaphone size={24} color={colors.primary} />
            </View>
            <View>
              <Text className="text-foreground font-bold text-base">{name || 'Nombre de tu Canal'}</Text>
              <Text className="text-muted-foreground text-xs">{visibility === 'public' ? 'Canal Público' : 'Canal Privado'} • {selectedTargets.length} Targets</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-foreground font-black text-2xl">Crear Canal Oficial</Text>
          <Text className="text-muted-foreground text-xs mt-1">Configura tu consorcio, audiencia y etiquetas.</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="px-3 py-1.5 bg-card border border-border rounded-lg">
          <Text className="text-foreground font-bold text-xs">◀ Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Form Container */}
      <View className="bg-card border border-border p-6 rounded-2xl mb-12 gap-6">

        {/* Verificación Banner */}
        <View className="bg-primary/10 border border-primary/30 p-4 rounded-xl flex-row items-start">
          <CheckCircle2 size={20} color={colors.primary} className="mt-0.5 mr-3" />
          <View className="flex-1">
            <Text className="text-primary font-bold mb-0.5 text-xs uppercase tracking-wider">Verificación de Consorcio</Text>
            <Text className="text-foreground/80 text-xs leading-relaxed">Los canales oficiales identifican marcas y empresas en HandyBet. Al crearlo, podrás vincular grupos y emitir anuncios.</Text>
          </View>
        </View>

        {/* Sección 1: Datos Básicos */}
        <View className="gap-4">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">1. Datos Principales</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre del Canal / Empresa *</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ej. Consorcio Loterías Unidas"
              placeholderTextColor={colors.mutedForeground}
              className="bg-background text-foreground p-4 rounded-xl border border-border font-medium"
            />
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Descripción General</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="¿De qué trata este canal? Tipos de apuestas, sedes, reglas..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              className="bg-background text-foreground p-4 rounded-xl border border-border font-medium"
            />
          </View>
        </View>

        {/* Sección 2: Visibilidad y Control +18 */}
        <View className="gap-4 pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">2. Privacidad y Seguridad</Text>

          {/* Selector Visibilidad */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setVisibility('public')}
              className={`flex-1 p-4 rounded-xl border flex-col items-center gap-2 ${visibility === 'public' ? 'bg-primary/10 border-primary' : 'bg-background border-border'
                }`}
            >
              <Globe size={24} color={visibility === 'public' ? colors.primary : colors.mutedForeground} />
              <Text className={`font-bold text-xs ${visibility === 'public' ? 'text-primary' : 'text-foreground'}`}>Público</Text>
              <Text className="text-[10px] text-muted-foreground text-center">Cualquiera se une</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setVisibility('private')}
              className={`flex-1 p-4 rounded-xl border flex-col items-center gap-2 ${visibility === 'private' ? 'bg-primary/10 border-primary' : 'bg-background border-border'
                }`}
            >
              <Lock size={24} color={visibility === 'private' ? colors.primary : colors.mutedForeground} />
              <Text className={`font-bold text-xs ${visibility === 'private' ? 'text-primary' : 'text-foreground'}`}>Privado</Text>
              <Text className="text-[10px] text-muted-foreground text-center">Solo por invitación</Text>
            </TouchableOpacity>
          </View>

          {/* Requisito Mayor de 18 */}
          <View className="flex-row items-center justify-between p-4 bg-background border border-border rounded-xl">
            <View className="flex-row items-center gap-3 flex-1 pr-4">
              <ShieldAlert size={22} color={is18Plus ? colors.destructive : colors.mutedForeground} />
              <View>
                <Text className="text-foreground font-bold text-xs">Contenido / Apuestas +18</Text>
                <Text className="text-muted-foreground text-[10px]">Activa si el canal trata sobre dinero real, juegos o azar.</Text>
              </View>
            </View>
            <Switch
              value={is18Plus}
              onValueChange={setIs18Plus}
              trackColor={{ false: '#3f3f46', true: colors.primary }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Sección 3: Audiencia Objetivo (Target) */}
        <View className="gap-3 pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">3. Audiencia Objetivo (Target)</Text>
          <Text className="text-muted-foreground text-xs mb-2">Selecciona a quién va dirigido tu canal:</Text>

          <View className="flex-row flex-wrap gap-2">
            {targetOptions.map((tgt) => {
              const isSelected = selectedTargets.includes(tgt.id);
              const IconComp = tgt.icon;
              return (
                <TouchableOpacity
                  key={tgt.id}
                  onPress={() => toggleTarget(tgt.id)}
                  className={`w-[48%] p-3 rounded-xl border flex-row items-center gap-2.5 ${isSelected ? 'bg-primary/20 border-primary' : 'bg-background border-border'
                    }`}
                >
                  <IconComp size={18} color={isSelected ? colors.primary : colors.mutedForeground} />
                  <View className="flex-1">
                    <Text className={`font-bold text-xs ${isSelected ? 'text-primary' : 'text-foreground'}`}>{tgt.label}</Text>
                    <Text className="text-[10px] text-muted-foreground" numberOfLines={1}>{tgt.desc}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sección 4: Chips de Intereses */}
        <View className="pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary mb-3">4. Intereses del Canal</Text>
          <InterestChipsSelector
            selectedInterests={interests}
            onChange={setInterests}
            label="Temas que tratará este Canal"
            allowCustom={true}
          />
        </View>

        {/* Action Button */}
        <TouchableOpacity
          onPress={handleCreateChannel}
          className="bg-primary py-4 rounded-xl flex-row justify-center items-center mt-4 shadow-lg shadow-primary/20"
        >
          <Megaphone size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-base uppercase tracking-wider">Crear Canal Oficial</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
