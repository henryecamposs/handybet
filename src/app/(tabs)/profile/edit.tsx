import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, Switch, Modal, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Save, Lock, X, Check, ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import { handyBetUsers } from '../../../mockdata/handyBetMock';

const AVAILABLE_CATEGORIES = [
  'Deportes ⚽',
  'Loterías & Animalitos 🎲',
  'Hipismo 🏇',
  'Casino 🎰',
  'Noticias Deportivas 📰',
  'Minijuegos 🎮'
];

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  // Cargamos los datos del usuario actual (por defecto usr_admin)
  const currentUser = handyBetUsers.find((u) => u.id === 'usr_admin') || handyBetUsers[0];

  // Estados locales del formulario
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '');
  const [birthDate, setBirthDate] = useState(currentUser.birthDate || '');
  const [country, setCountry] = useState(currentUser.location?.country || '');
  const [stateName, setStateName] = useState(currentUser.location?.state || '');

  const [favoriteCategories, setFavoriteCategories] = useState<string[]>(
    currentUser.preferences?.favoriteCategories || []
  );
  const [receiveNewsletter, setReceiveNewsletter] = useState(
    currentUser.preferences?.receiveNewsletter ?? true
  );
  const [receiveNotifications, setReceiveNotifications] = useState(
    currentUser.preferences?.receiveNotifications ?? true
  );
  const [acceptedTerms, setAcceptedTerms] = useState(
    currentUser.preferences?.acceptedTerms ?? false
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper para validar mayoría de edad
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

  // Manejar selección de categorías
  const toggleCategory = (category: string) => {
    if (favoriteCategories.includes(category)) {
      setFavoriteCategories(favoriteCategories.filter((c) => c !== category));
    } else {
      setFavoriteCategories([...favoriteCategories, category]);
    }
  };

  // Validaciones y Guardar
  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    // Validar Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'El formato del correo electrónico no es válido.';
    }

    // Validar WhatsApp
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    if (!phoneRegex.test(whatsapp)) {
      newErrors.whatsapp = 'Ingresa un número válido con código de país (ej: +584121234567).';
    }

    // Validar Edad
    if (!birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida.';
    } else if (!validateAge(birthDate)) {
      newErrors.birthDate = 'Debes tener al menos 18 años para usar HandyBet.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Alert.alert('Error de Validación', 'Por favor corrige los campos marcados antes de continuar.');
      return;
    }

    // Limpiar errores e imitar guardado en mockdata/DB local
    setErrors({});
    const dbUser = handyBetUsers.find((u) => u.id === 'usr_admin');
    if (dbUser) {
      dbUser.name = name;
      dbUser.bio = bio;
      dbUser.email = email;
      dbUser.whatsapp = whatsapp;
      dbUser.birthDate = birthDate;
      if (dbUser.location) {
        dbUser.location.country = country;
        dbUser.location.state = stateName;
      }
      if (dbUser.preferences) {
        dbUser.preferences.favoriteCategories = favoriteCategories;
        dbUser.preferences.receiveNewsletter = receiveNewsletter;
        dbUser.preferences.receiveNotifications = receiveNotifications;
        dbUser.preferences.acceptedTerms = acceptedTerms;
      }
    }

    Alert.alert('Éxito', 'Tu perfil ha sido actualizado correctamente.', [
      { text: 'Aceptar', onPress: () => router.back() }
    ]);
  };

  return (
    <HubDetailLayout
      logoType="default"
      backRoute="/(tabs)/follows"
      onBack={() => router.back()}
      hideHeader={true}
    >
      <View className="px-4 pt-1">
        <View className="mb-6 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-2 rounded-full bg-background/80 hover:bg-primary/20 transition-colors border border-border">
            <ArrowLeft size={22} color={colors.foreground} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-foreground font-black text-2xl tracking-tight">Editar Perfil</Text>
            <Text className="text-muted-foreground text-sm mt-1 font-medium">Personaliza tu perfil y configura tus preferencias de juego.</Text>
          </View>
        </View>

        {/* Sección 1: Información Básica */}
        <View className="bg-background/80  p-5 border border-border mb-6">
          <Text className="text-foreground font-black text-sm uppercase tracking-wider mb-5 border-b border-border  pb-2">Información Básica</Text>

          <View className="items-center mb-6 relative">
            <View className="p-1 bg-background rounded-full border border-border">
              <Image
                source={{ uri: currentUser.avatar }}
                className="w-24 h-24 rounded-full bg-background/80"
              />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-1/3 translate-x-3 bg-primary w-9 h-9 rounded-full items-center justify-center border-4 border-background hover:bg-primary-dark transition-colors">
              <Camera size={16} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Nombre para mostrar</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Nombre para mostrar"
                placeholderTextColor={colors.mutedForeground}
                className="bg-background/80 text-foreground p-3.5  border border-border font-semibold text-sm"
              />
            </View>

            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Nombre de Usuario (Username)</Text>
              <View className="relative flex justify-center items-center">
                <TextInput
                  value={currentUser.username}
                  placeholderTextColor={colors.mutedForeground}
                  editable={false}
                  className="bg-background/30 text-muted-foreground p-3.5  border border-border font-semibold text-sm w-full pr-12"
                />
                <Lock size={16} color={colors.mutedForeground} className="absolute right-4" />
              </View>
              <Text className="text-muted-foreground text-[10px] mt-1 font-medium">El nombre de usuario no puede ser modificado.</Text>
            </View>

            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Biografía</Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Escribe algo sobre ti..."
                placeholderTextColor={colors.mutedForeground}
                multiline
                numberOfLines={3}
                className="bg-background/80 text-foreground p-3.5  border border-border font-semibold text-sm"
              />
            </View>
          </View>
        </View>

        {/* Sección 2: Información Personal & Ubicación */}
        <View className="bg-background/80  p-5 border border-border mb-6">
          <Text className="text-foreground font-black text-sm uppercase tracking-wider mb-5 border-b border-border  pb-2">Información Personal & Ubicación</Text>

          <View className="space-y-4">
            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Correo Electrónico</Text>
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
                className={`bg-background/80 text-foreground p-3.5  border font-semibold text-sm ${errors.email ? 'border-red-500' : 'border-border'}`}
              />
              {errors.email && <Text className="text-red-500 text-[10px] mt-1 font-semibold">{errors.email}</Text>}
            </View>

            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Número de WhatsApp</Text>
              <TextInput
                value={whatsapp}
                onChangeText={(val) => {
                  setWhatsapp(val);
                  if (errors.whatsapp) setErrors({ ...errors, whatsapp: '' });
                }}
                placeholder="+584121234567"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                className={`bg-background/80 text-foreground p-3.5  border font-semibold text-sm ${errors.whatsapp ? 'border-red-500' : 'border-border'}`}
              />
              {errors.whatsapp && <Text className="text-red-500 text-[10px] mt-1 font-semibold">{errors.whatsapp}</Text>}
            </View>

            <View>
              <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Fecha de Nacimiento (YYYY-MM-DD)</Text>
              <TextInput
                value={birthDate}
                onChangeText={(val) => {
                  setBirthDate(val);
                  if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.mutedForeground}
                className={`bg-background/80 text-foreground p-3.5  border font-semibold text-sm ${errors.birthDate ? 'border-red-500' : 'border-border'}`}
              />
              {errors.birthDate ? (
                <Text className="text-red-500 text-[10px] mt-1 font-semibold">{errors.birthDate}</Text>
              ) : (
                <Text className="text-muted-foreground text-[10px] mt-1 font-medium">Debes tener al menos 18 años para usar la plataforma.</Text>
              )}
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">País</Text>
                <TextInput
                  value={country}
                  onChangeText={setCountry}
                  placeholder="Venezuela"
                  placeholderTextColor={colors.mutedForeground}
                  className="bg-background/80 text-foreground p-3.5  border border-border font-semibold text-sm"
                />
              </View>
              <View className="flex-1">
                <Text className="text-foreground font-bold text-xs uppercase mb-2 tracking-wider">Estado / Región</Text>
                <TextInput
                  value={stateName}
                  onChangeText={setStateName}
                  placeholder="Miranda"
                  placeholderTextColor={colors.mutedForeground}
                  className="bg-background/80 text-foreground p-3.5  border border-border font-semibold text-sm"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Sección 3: Categorías de Interés */}
        <View className="bg-background/80  p-5 border border-border mb-6">
          <Text className="text-foreground font-black text-sm uppercase tracking-wider mb-2 border-b border-border  pb-2">Preferencias Deportivas y de Juego</Text>
          <Text className="text-muted-foreground text-xs font-medium mb-4">Selecciona tus áreas de interés favoritas para personalizar tu feed:</Text>

          <View className="flex-row flex-wrap gap-2">
            {AVAILABLE_CATEGORIES.map((category) => {
              const isSelected = favoriteCategories.includes(category);
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => toggleCategory(category)}
                  className={`px-4 py-2.5 rounded-full border transition-colors ${isSelected ? 'bg-secondary/20 border-secondary' : 'bg-background/80 border-border/50'}`}
                >
                  <Text className={`font-bold text-xs ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sección 4: Notificaciones y Suscripciones */}
        <View className="bg-background/80  p-5 border border-border mb-6">
          <Text className="text-foreground font-black text-sm uppercase tracking-wider mb-5 border-b border-border  pb-2">Configuración de Comunicaciones</Text>

          <View className="space-y-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-4">
                <Text className="text-foreground font-bold text-sm">Recibir Boletines</Text>
                <Text className="text-muted-foreground text-xs mt-0.5 font-medium">Alertas semanales, pronósticos destacados y análisis estadísticos.</Text>
              </View>
              <Switch
                value={receiveNewsletter}
                onValueChange={setReceiveNewsletter}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor={receiveNewsletter ? '#000' : '#a1a1aa'}
              />
            </View>

            <View className="flex-row items-center justify-between border-t border-border  pt-4">
              <View className="flex-1 pr-4">
                <Text className="text-foreground font-bold text-sm">Notificaciones Activas</Text>
                <Text className="text-muted-foreground text-xs mt-0.5 font-medium">Recibe alertas push sobre sorteos iniciados, respuestas en chats e información de taquilla.</Text>
              </View>
              <Switch
                value={receiveNotifications}
                onValueChange={setReceiveNotifications}
                trackColor={{ false: '#3f3f46', true: colors.primary }}
                thumbColor={receiveNotifications ? '#000' : '#a1a1aa'}
              />
            </View>
          </View>
        </View>

        {/* Sección 5: Aceptación Legal y Botón Guardar */}
        <View className="bg-background/80  p-5 border border-border mb-8">
          <TouchableOpacity
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            className="flex-row items-start gap-3 mb-6"
            activeOpacity={0.8}
          >
            <View className={`w-6 h-6 rounded-xs border items-center justify-center mt-0.5 ${acceptedTerms ? 'bg-primary border-primary' : 'border-border'}`}>
              {acceptedTerms && <Check size={14} color="#000" />}
            </View>
            <Text className="text-foreground text-sm flex-1 font-medium leading-5">
              Declaro que he leído y acepto el{' '}
              <Text
                onPress={() => setModalVisible(true)}
                className="text-primary font-bold underline"
              >
                Acuerdo de Uso de la Red Social HandyBet
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!acceptedTerms}
            className={`py-3.5  flex-row justify-center items-center transition-colors ${acceptedTerms ? 'bg-primary' : 'bg-muted border border-border/20'}`}
          >
            <Save size={20} color={acceptedTerms ? colors.primaryForeground : colors.mutedForeground} className="mr-2" />
            <Text className={`font-black text-base ${acceptedTerms ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal del Acuerdo de Uso */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="bg-background border border-border  w-full max-h-[85%] p-5 shadow-2xl">
            {/* Header del Modal */}
            <View className="flex-row items-center justify-between border-b border-border  pb-3">
              <Text className="text-foreground font-black text-base uppercase tracking-wider">Acuerdo de Uso</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-1 rounded-full hover:bg-muted">
                <X size={20} color={colors.foreground} />
              </TouchableOpacity>
            </View>

            {/* Contenido Legal Scrollable */}
            <ScrollView showsVerticalScrollIndicator={true} className="my-4 pr-1">
              <Text className="text-foreground font-black text-sm text-center mb-3">
                ACUERDO DE USO Y CONDICIONES DE SERVICIO DE LA RED SOCIAL HANDYBET
              </Text>
              <Text className="text-muted-foreground text-[10px] font-bold text-center mb-4">
                Última actualización: 17 de Julio de 2026
              </Text>

              <Text className="text-foreground text-xs leading-5 mb-4 text-justify">
                Bienvenido a HandyBet, una red social orientada al entretenimiento deportivo, análisis de datos, sorteos e interacción comunitaria. Al registrarte y utilizar nuestra plataforma, aceptas de manera expresa y sin reservas los siguientes términos y condiciones de uso:
              </Text>

              <Text className="text-foreground font-bold text-xs mb-2">
                1. CAPACIDAD LEGAL Y JUEGO RESPONSABLE
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 mb-4 text-justify">
                HandyBet es una plataforma reservada exclusivamente para personas mayores de dieciocho (18) años de edad (o la mayoría de edad legal aplicable en su jurisdicción). Está terminantemente prohibido el acceso a menores de edad. Promovemos el juego responsable y el entretenimiento sano; la información y herramientas que proveemos tienen un fin estrictamente recreativo, estadístico e interactivo.
              </Text>

              <Text className="text-foreground font-bold text-xs mb-2">
                2. USO DE LA PLATAFORMA Y CONTENIDO DE USUARIO
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 mb-4 text-justify">
                Como usuario de HandyBet, te comprometes a:{"\n"}
                • Utilizar tu identidad real o alias de forma respetuosa. Está prohibida la suplantación de identidad de terceros o administradores.{"\n"}
                • No publicar, difundir ni compartir contenido difamatorio, obsceno, acosador, racista, violento o ilegal en nuestros canales, chats o grupos.{"\n"}
                • No utilizar la plataforma para realizar spam, esquemas piramidales, venta de servicios de apuestas no autorizados o enlaces fraudulentos.
              </Text>

              <Text className="text-foreground font-bold text-xs mb-2">
                3. TRATAMIENTO DE DATOS Y PRIVACIDAD
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 mb-4 text-justify">
                Para mejorar tu experiencia, HandyBet recopila y procesa datos personales como tu correo electrónico, número de WhatsApp (para alertas comunitarias y de taquilla), fecha de nacimiento (para validación de mayoría de edad) y tu ubicación geográfica (con el fin de mostrarte taquillas locales y sorteos autorizados en tu zona). Tus datos son tratados de acuerdo con nuestras políticas de confidencialidad y nunca serán vendidos a terceros sin tu consentimiento explícito.
              </Text>

              <Text className="text-foreground font-bold text-xs mb-2">
                4. EXCLUSIÓN DE RESPONSABILIDAD
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 mb-4 text-justify">
                HandyBet ofrece simulaciones de apuestas, estadísticas deportivas, pronósticos recreativos y cobro de premios simulados (puntos) para el entretenimiento de la comunidad. No somos una casa de apuestas online ni un operador de juegos de azar con dinero real directo en la app social. Cualquier interacción, apuesta o acuerdo económico privado realizado entre usuarios fuera de las funcionalidades oficiales de la plataforma es responsabilidad exclusiva de las partes.
              </Text>

              <Text className="text-foreground font-bold text-xs mb-2">
                5. MODERACIÓN Y CANCELACIÓN DE CUENTA
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 mb-4 text-justify">
                Nos reservamos el derecho de moderar las publicaciones, suspender de forma temporal o cancelar permanentemente cualquier cuenta de usuario que viole las normas de convivencia o este Acuerdo de Uso, sin previo aviso y sin derecho a reclamación alguna.
              </Text>
            </ScrollView>

            {/* Footer de Acciones del Modal */}
            <View className="flex-row gap-3 border-t border-border  pt-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-background/80 py-3 rounded-xs border border-border items-center justify-center"
              >
                <Text className="text-foreground font-bold text-sm">Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAcceptedTerms(true);
                  setModalVisible(false);
                }}
                className="flex-1 bg-primary py-3 rounded-xs items-center justify-center"
              >
                <Text className="text-black font-bold text-sm">Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </HubDetailLayout>
  );
}
