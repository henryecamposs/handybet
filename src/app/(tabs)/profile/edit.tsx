import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Save, ArrowLeft, AtSign, Globe, MapPin, Share2, Send, Mail, Phone, Calendar, Image as ImageIcon, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import { useToastStore } from '@/store/useToastStore';
import { localDB } from '@/lib/localDB';
import InterestChipsSelector from '@/components/ui/InterestChipsSelector';
import HubCover from '@/components/layout/hub/HubCover';

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addToast } = useToastStore();
  const { mockSession, setMockSession } = useHandyBetStore();

  const [name, setName] = useState(mockSession?.name || '');
  const [username, setUsername] = useState(mockSession?.name?.toLowerCase().replace(/\s+/g, '_') || 'joseperez');
  const [bio, setBio] = useState('Apasionado por los pronósticos deportivos y los sorteos en HandyBet.');
  const [email, setEmail] = useState('usuario@handybet.com');
  const [whatsapp, setWhatsapp] = useState('+584121234567');
  const [birthDate, setBirthDate] = useState('1995-08-20');
  const [address, setAddress] = useState('Caracas, Venezuela');
  const [coverVariant, setCoverVariant] = useState<'primary' | 'muted'>('primary');
  const [avatarSeed, setAvatarSeed] = useState(mockSession?.avatar || 'https://i.pravatar.cc/150');

  // Redes Sociales
  const [instagram, setInstagram] = useState('usuario_official');
  const [twitter, setTwitter] = useState('usuario_bets');
  const [telegram, setTelegram] = useState('t.me/usuario_hb');

  const [interests, setInterests] = useState<string[]>(['Pronósticos', 'Apuestas Deportivas', 'Loterías']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAge = (dateStr: string) => {
    if (!dateStr) return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const today = new Date();
    const birth = new Date(dateStr);
    if (isNaN(birth.getTime())) return false;
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre no puede estar vacío.';
    if (!username.trim()) newErrors.username = 'El handle no puede estar vacío.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'El formato del correo electrónico no es válido.';
    if (!birthDate.trim() || !validateAge(birthDate)) newErrors.birthDate = 'Debes tener al menos 18 años (YYYY-MM-DD).';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({ title: 'Por favor corrige los campos marcados', variant: 'muted' });
      return;
    }

    try {
      const updatedData = {
        full_name: name.trim(),
        username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        bio: bio.trim(),
        email: email.trim(),
        phone_whatsapp: whatsapp.trim(),
        birth_date: birthDate.trim(),
        address: address.trim(),
        interests,
        avatar_url: avatarSeed,
        social_links: {
          instagram: instagram.trim() || undefined,
          twitter: twitter.trim() || undefined,
          telegram: telegram.trim() || undefined,
        },
      };

      if (mockSession?.id) {
        await localDB.users.upsert(mockSession.id, updatedData);
        setMockSession({
          ...mockSession,
          name: updatedData.full_name,
          avatar: updatedData.avatar_url,
        });
      }

      addToast({ title: '¡Perfil actualizado con éxito!', variant: 'success' });
      router.back();
    } catch (e) {
      console.error(e);
      addToast({ title: 'Error al actualizar el perfil', variant: 'muted' });
    }
  };

  const cycleAvatar = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setAvatarSeed(`https://i.pravatar.cc/150?u=${randomId}`);
    addToast({ title: 'Nueva foto de perfil seleccionada', variant: 'info' });
  };

  const cycleCover = () => {
    const variants: ('primary' | 'muted')[] = ['primary', 'muted'];
    const nextIndex = (variants.indexOf(coverVariant) + 1) % variants.length;
    setCoverVariant(variants[nextIndex]);
    addToast({ title: `Portada cambiada a tema ${variants[nextIndex]}`, variant: 'info' });
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-8 pb-16" showsVerticalScrollIndicator={false}>
      {/* Title */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-foreground font-black text-2xl">Editar Perfil</Text>
          <Text className="text-muted-foreground text-xs mt-1">Personaliza tu información pública y preferencias.</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="px-3.5 py-2 bg-card border border-border rounded-full flex-row items-center gap-1.5">
          <ArrowLeft size={14} color={colors.foreground} />
          <Text className="text-foreground font-bold text-xs">Volver</Text>
        </TouchableOpacity>
      </View>

      <View className="gap-6 mb-12">
        {/* CARD 1: Portada y Avatar */}
        <View className="bg-card border border-border rounded-2xl overflow-hidden p-6 shadow-md gap-4">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">1. Imágenes de Portada y Perfil</Text>
          
          <View className="rounded-xl overflow-hidden border border-border relative">
            <HubCover variant={coverVariant} containerClasses="h-32" />
            <TouchableOpacity
              onPress={cycleCover}
              className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex-row items-center gap-1.5"
            >
              <ImageIcon size={14} color="#fff" />
              <Text className="text-white text-[10px] font-bold">Cambiar Portada</Text>
            </TouchableOpacity>

            <View className="absolute bottom-2 left-4 flex-row items-end">
              <View className="relative">
                <Image
                  source={{ uri: avatarSeed }}
                  className="w-20 h-20 rounded-full border-2 border-primary bg-background"
                />
                <TouchableOpacity
                  onPress={cycleAvatar}
                  className="absolute bottom-0 right-0 bg-primary p-1.5 rounded-full border border-background shadow-md"
                >
                  <Camera size={14} color="#000" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* CARD 2: Datos de Identificación */}
        <View className="bg-card border border-border p-6 rounded-2xl gap-4 shadow-md">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">2. Datos de Identificación</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre para mostrar *</Text>
            <TextInput
              value={name}
              onChangeText={(val) => {
                setName(val);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              placeholder="Nombre Completo"
              placeholderTextColor={colors.mutedForeground}
              className={`bg-background text-foreground px-4 py-3.5 rounded-full border font-semibold text-sm ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.name && <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.name}</Text>}
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Identificador en la Red (@Handle) *</Text>
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <AtSign size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={username}
                onChangeText={(val) => {
                  setUsername(val.toLowerCase().replace(/[^a-z0-9_]/g, ''));
                  if (errors.username) setErrors({ ...errors, username: '' });
                }}
                placeholder="joseperez"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3.5 font-bold text-sm"
              />
            </View>
            {errors.username && <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.username}</Text>}
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Biografía / Presentación</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Escribe algo sobre ti..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              className="bg-background text-foreground p-4 rounded-2xl border border-border font-medium"
            />
          </View>
        </View>

        {/* CARD 3: Contacto & Edad (+18) */}
        <View className="bg-card border border-border p-6 rounded-2xl gap-4 shadow-md">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">3. Contacto & Verificación de Edad</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Correo Electrónico *</Text>
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <Mail size={16} color={colors.mutedForeground} className="mr-2" />
              <TextInput
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-foreground py-3.5 font-semibold text-sm"
              />
            </View>
            {errors.email && <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.email}</Text>}
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Fecha de Nacimiento (YYYY-MM-DD) *</Text>
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <Calendar size={16} color={colors.mutedForeground} className="mr-2" />
              <TextInput
                value={birthDate}
                onChangeText={(val) => {
                  setBirthDate(val);
                  if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3.5 font-semibold text-sm"
              />
            </View>
            {errors.birthDate ? (
              <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.birthDate}</Text>
            ) : (
              <Text className="text-muted-foreground text-[10px] mt-1 font-medium">Requisito de mayoría de edad (+18) para operaciones contables.</Text>
            )}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">WhatsApp / Teléfono</Text>
              <View className="flex-row items-center bg-background border border-border rounded-full px-4">
                <Phone size={16} color={colors.mutedForeground} className="mr-2" />
                <TextInput
                  value={whatsapp}
                  onChangeText={setWhatsapp}
                  placeholder="+584121234567"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="phone-pad"
                  className="flex-1 text-foreground py-3.5 font-semibold text-sm"
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">Ubicación</Text>
              <View className="flex-row items-center bg-background border border-border rounded-full px-4">
                <MapPin size={16} color={colors.mutedForeground} className="mr-2" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Caracas, Venezuela"
                  placeholderTextColor={colors.mutedForeground}
                  className="flex-1 text-foreground py-3.5 font-semibold text-sm"
                />
              </View>
            </View>
          </View>
        </View>

        {/* CARD 4: Redes Sociales */}
        <View className="bg-card border border-border p-6 rounded-2xl gap-3 shadow-md">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">4. Redes Sociales & Enlaces</Text>
          <View className="gap-3">
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <Globe size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={instagram}
                onChangeText={setInstagram}
                placeholder="usuario_instagram"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <Share2 size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={twitter}
                onChangeText={setTwitter}
                placeholder="usuario_twitter"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
            <View className="flex-row items-center bg-background border border-border rounded-full px-4">
              <Send size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={telegram}
                onChangeText={setTelegram}
                placeholder="t.me/usuario_telegram"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
          </View>
        </View>

        {/* CARD 5: Intereses & Chips */}
        <View className="bg-card border border-border p-6 rounded-2xl shadow-md">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary mb-3">5. Intereses & Etiquetas</Text>
          <InterestChipsSelector
            selectedInterests={interests}
            onChange={setInterests}
            label="Tus Temas de Preferencia"
            allowCustom={true}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          className="bg-primary py-4 rounded-full flex-row justify-center items-center mt-2 shadow-lg shadow-primary/20"
        >
          <Save size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-base uppercase tracking-wider">Guardar Cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
