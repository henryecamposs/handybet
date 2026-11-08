import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { authService } from '../../services/authService';
import Logo from '../../components/ui/Logo';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [whatsappHandle, setWhatsappHandle] = useState('');
  const [role, setRole] = useState<'player' | 'cashier'>('player');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setMockSession = useHandyBetStore((state) => state.setMockSession);
  const colors = useThemeColors();

  const handleSubmit = async () => {
    if (isLoading) return;
    setErrorMessage(null);

    if (!username || !password) {
      setErrorMessage('Por favor rellena todos los campos requeridos.');
      return;
    }

    if (!isLogin && (!fullName || !phoneWhatsapp)) {
      setErrorMessage('Nombre Completo y WhatsApp son obligatorios.');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        const user = await authService.login(username, password);
        if (user) {
          setMockSession({
            id: user.id,
            username: user.username,
            role: user.role,
          });
        }
      } else {
        const result = await authService.register(
          username,
          password,
          fullName,
          phoneWhatsapp,
          whatsappHandle
        );
        setErrorMessage(result.message);
        setIsLogin(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Ha ocurrido un error inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      resizeMode="cover"
      className="flex-1 w-full justify-center items-center p-6 bg-background"
    >
      <View className="w-full max-w-sm bg-card/85 border border-white/10 p-8 shadow-2xl rounded-2xl backdrop-blur-xl">
        <View className="mb-6 items-center">
          <Logo size="lg" layout="vertical" />
        </View>

        <Text className="text-primary font-bold text-center uppercase tracking-widest mb-6 text-sm">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Text>

        {errorMessage && (
          <View className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl mb-5">
            <Text className="text-rose-400 text-xs font-bold text-center">{errorMessage}</Text>
          </View>
        )}

        {/* Inputs */}
        <View className="space-y-4">
          <View>
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Usuario</Text>
            <TextInput
              placeholder="Ej: admin o pedro_bet"
              placeholderTextColor={withOpacity(colors.foreground, 0.3)}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="bg-black/40 border border-white/10 rounded-full px-5 py-3.5 text-white font-semibold focus:border-primary"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={withOpacity(colors.foreground, 0.3)}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
              className="bg-black/40 border border-white/10 rounded-full px-5 py-3.5 text-white font-semibold focus:border-primary"
            />
          </View>

          {!isLogin && (
            <>
              <View>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Nombre Completo</Text>
                <TextInput
                  placeholder="Ej: Pedro Pérez"
                  placeholderTextColor={withOpacity(colors.foreground, 0.3)}
                  value={fullName}
                  onChangeText={setFullName}
                  className="bg-black/40 border border-white/10 rounded-full px-5 py-3.5 text-white font-semibold focus:border-primary"
                />
              </View>
              <View>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">WhatsApp (Teléfono)</Text>
                <TextInput
                  placeholder="Ej: +58412000000"
                  placeholderTextColor={withOpacity(colors.foreground, 0.3)}
                  value={phoneWhatsapp}
                  onChangeText={setPhoneWhatsapp}
                  keyboardType="phone-pad"
                  className="bg-black/40 border border-white/10 rounded-full px-5 py-3.5 text-white font-semibold focus:border-primary"
                />
              </View>
              <View>
                <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">WhatsApp Handle (@usuario)</Text>
                <TextInput
                  placeholder="Ej: @pedrop"
                  placeholderTextColor={withOpacity(colors.foreground, 0.3)}
                  value={whatsappHandle}
                  onChangeText={setWhatsappHandle}
                  autoCapitalize="none"
                  className="bg-black/40 border border-white/10 rounded-full px-5 py-3.5 text-white font-semibold focus:border-primary"
                />
              </View>
            </>
          )}

          {/* Selección de Rol si es Registro */}
          {!isLogin && (
            <View className="pt-2">
              <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Rol de Acceso</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setRole('player')}
                  className={`flex-1 py-3 rounded-full border items-center transition-all ${role === 'player'
                    ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                    : 'bg-black/40 border-white/10'
                    }`}
                >
                  <Text className={`font-bold text-xs ${role === 'player' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Jugador P2P
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole('cashier')}
                  className={`flex-1 py-3 rounded-full border items-center transition-all ${role === 'cashier'
                    ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20'
                    : 'bg-black/40 border-white/10'
                    }`}
                >
                  <Text className={`font-bold text-xs ${role === 'cashier' ? 'text-primary' : 'text-muted-foreground'}`}>
                    Cajero Taquilla
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Botón de Enviar */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={isLoading}
          className="bg-primary py-4 rounded-full items-center shadow-lg shadow-primary/20 mt-8 active:scale-[0.97]"
        >
          {isLoading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text className="text-background font-extrabold text-sm uppercase tracking-widest">
              {isLogin ? 'Acceder' : 'Registrar'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Switch de modo */}
        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          className="mt-6"
        >
          <Text className="text-muted-foreground hover:text-primary text-xs font-bold text-center transition-colors">
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia Sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
