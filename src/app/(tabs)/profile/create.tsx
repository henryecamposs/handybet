import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, Save, ShieldAlert, AtSign, Mail, Phone, MapPin, Globe, Share2, Send, Sparkles, ArrowLeft, Camera } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToastStore } from '@/store/useToastStore';
import { localDB } from '@/lib/localDB';
import { useHandyBetStore } from '@/store/useHandyBetStore';
import InterestChipsSelector from '@/components/ui/InterestChipsSelector';
import HubCover from '@/components/layout/hub/HubCover';
import { Profile } from '@/types/handyBet';

export default function CreateUserScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addToast } = useToastStore();
  const { setMockSession } = useHandyBetStore();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState<'player' | 'cashier' | 'company_owner'>('player');

  // Redes Sociales
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');

  // Intereses & Chips
  const [interests, setInterests] = useState<string[]>(['Apuestas Deportivas', 'Pronósticos']);

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

  const handleCreateUser = async () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Ingresa el nombre completo.';
    if (!username.trim()) newErrors.username = 'Ingresa el identificador @handle.';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Ingresa un correo electrónico válido.';
    if (!birthDate.trim() || !validateAge(birthDate)) newErrors.birthDate = 'Debes ingresar una fecha válida (YYYY-MM-DD) mayor de 18 años.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({ title: 'Por favor corrige los campos indicados', variant: 'muted' });
      return;
    }

    try {
      const newUserId = localDB.generateId('usr');
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');

      const newUser: Profile = {
        id: newUserId,
        username: cleanUsername,
        full_name: fullName.trim(),
        avatar_url: `https://i.pravatar.cc/150?u=${newUserId}`,
        role: role,
        interests: interests,
        created_at: new Date().toISOString(),
        email: email.trim(),
        birth_date: birthDate.trim(),
        bio: bio.trim(),
        phone_whatsapp: phone.trim(),
        address: address.trim(),
        social_links: {
          instagram: instagram.trim() || undefined,
          twitter: twitter.trim() || undefined,
          telegram: telegram.trim() || undefined,
        },
      };

      await localDB.users.insert(newUser);

      // Iniciar sesión con este nuevo usuario
      setMockSession({
        id: newUser.id,
        name: newUser.full_name || `@${newUser.username}`,
        role: newUser.role,
        avatar: newUser.avatar_url || 'https://i.pravatar.cc/150',
      });

      addToast({ title: '¡Usuario registrado exitosamente!', variant: 'success' });
      router.push('/(tabs)/profile');
    } catch (e) {
      console.error(e);
      addToast({ title: 'Error al registrar el usuario', variant: 'muted' });
    }
  };

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-8 pb-16" showsVerticalScrollIndicator={false}>
      {/* Portada & Avatar Header Preview */}
      <View className="mb-4 rounded-2xl overflow-hidden border border-border bg-card">
        <HubCover variant="primary" containerClasses="h-32" />
        <View className="px-6 pb-4 pt-0 flex-row items-end justify-between -mt-12">
          <View className="relative">
            <View className="w-24 h-24 rounded-full bg-background border-2 border-primary overflow-hidden items-center justify-center">
              <Image
                source={{ uri: `https://i.pravatar.cc/150?u=${username || 'new'}` }}
                className="w-full h-full"
              />
            </View>
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-foreground font-black text-lg">{fullName || 'Nombre del Usuario'}</Text>
            <Text className="text-primary font-bold text-xs">@{username || 'handle'}</Text>
          </View>
        </View>
      </View>

      {/* Title */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-foreground font-black text-2xl">Crear Nuevo Usuario</Text>
          <Text className="text-muted-foreground text-xs mt-1">Registra la cuenta, redes sociales y preferencias.</Text>
        </View>
        <TouchableOpacity onPress={() => router.back()} className="px-3 py-1.5 bg-card border border-border rounded-lg flex-row items-center gap-1">
          <ArrowLeft size={14} color={colors.foreground} />
          <Text className="text-foreground font-bold text-xs">Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Main Form */}
      <View className="bg-card border border-border p-6 rounded-2xl mb-12 gap-6">

        {/* 1. Datos de Identificación */}
        <View className="gap-4">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">1. Identificación de la Cuenta</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Nombre Completo *</Text>
            <TextInput
              value={fullName}
              onChangeText={(val) => {
                setFullName(val);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              placeholder="Ej. José Pérez"
              placeholderTextColor={colors.mutedForeground}
              className={`bg-background text-foreground px-4 py-3.5 rounded-full border font-semibold text-sm ${
                errors.fullName ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.fullName && <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.fullName}</Text>}
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Identificador en la Red (@Handle) *</Text>
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5">
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
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Rol del Usuario</Text>
            <View className="flex-row gap-2 bg-background border border-border rounded-xl p-1">
              <TouchableOpacity
                onPress={() => setRole('player')}
                className={`flex-1 py-2.5 items-center rounded-lg ${role === 'player' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-xs font-bold ${role === 'player' ? 'text-primary-foreground' : 'text-foreground'}`}>Jugador</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRole('cashier')}
                className={`flex-1 py-2.5 items-center rounded-lg ${role === 'cashier' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-xs font-bold ${role === 'cashier' ? 'text-primary-foreground' : 'text-foreground'}`}>Cajero</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setRole('company_owner')}
                className={`flex-1 py-2.5 items-center rounded-lg ${role === 'company_owner' ? 'bg-primary' : ''}`}
              >
                <Text className={`text-xs font-bold ${role === 'company_owner' ? 'text-primary-foreground' : 'text-foreground'}`}>Propietario</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. Contacto & Edad +18 */}
        <View className="gap-4 pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">2. Contacto & Edad</Text>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Correo Electrónico *</Text>
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5">
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
            <TextInput
              value={birthDate}
              onChangeText={(val) => {
                setBirthDate(val);
                if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
              }}
              placeholder="1998-05-15"
              placeholderTextColor={colors.mutedForeground}
              className={`bg-background text-foreground px-4 py-3.5 rounded-full border font-semibold text-sm ${
                errors.birthDate ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.birthDate ? (
              <Text className="text-red-500 text-[10px] mt-1 font-bold">{errors.birthDate}</Text>
            ) : (
              <Text className="text-muted-foreground text-[10px] mt-1 font-medium">Requisito obligatorio (+18 años) para juegos de azar.</Text>
            )}
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">WhatsApp / Teléfono</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+584121234567"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                className="bg-background text-foreground px-4 py-3.5 rounded-full border border-border font-semibold text-sm"
              />
            </View>
            <View className="flex-1">
              <Text className="text-foreground font-bold text-xs uppercase mb-2">Dirección Física</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Caracas, Venezuela"
                placeholderTextColor={colors.mutedForeground}
                className="bg-background text-foreground px-4 py-3.5 rounded-full border border-border font-semibold text-sm"
              />
            </View>
          </View>

          <View>
            <Text className="text-foreground font-bold text-xs uppercase mb-2">Biografía / Descripción</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Escribe una breve presentación..."
              placeholderTextColor={colors.mutedForeground}
              multiline
              numberOfLines={3}
              className="bg-background text-foreground p-4 rounded-xl border border-border font-medium"
            />
          </View>
        </View>

        {/* 3. Redes Sociales */}
        <View className="gap-3 pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary">3. Redes Sociales</Text>
          <View className="gap-3">
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5">
              <Globe size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={instagram}
                onChangeText={setInstagram}
                placeholder="Instagram: usuario_ig"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5">
              <Share2 size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={twitter}
                onChangeText={setTwitter}
                placeholder="X / Twitter: usuario_tw"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
            <View className="flex-row items-center bg-background border border-border rounded-xl px-3.5">
              <Send size={16} color={colors.primary} className="mr-2" />
              <TextInput
                value={telegram}
                onChangeText={setTelegram}
                placeholder="Telegram: t.me/usuario_tg"
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 text-foreground py-3 font-semibold text-xs"
              />
            </View>
          </View>
        </View>

        {/* 4. Intereses & Chips */}
        <View className="pt-4 border-t border-border/60">
          <Text className="text-foreground font-bold text-sm uppercase tracking-wider text-primary mb-3">4. Temas & Chips de Interés</Text>
          <InterestChipsSelector
            selectedInterests={interests}
            onChange={setInterests}
            label="Selecciona o agrega tus categorías deportivas y de contenido"
            allowCustom={true}
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleCreateUser}
          className="bg-primary py-4 rounded-xl flex-row justify-center items-center mt-4 shadow-lg shadow-primary/20"
        >
          <UserPlus size={20} color="#000" className="mr-2" />
          <Text className="text-black font-black text-base uppercase tracking-wider">Registrar Usuario</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
