import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
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
        // Simular Login con Servicio
        const user = await authService.login(username, password);
        if (user) {
          setMockSession({
            id: user.id,
            username: user.username,
            role: user.role,
          });
        }
      } else {
        // Simular Registro con Servicio
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
    <View className="flex-1 bg-background/80 justify-center items-center p-6">
      <View className="w-full max-w-sm bg-background/90 border border-border p-8  shadow-xl rounded-xl">
        <View className="mb-4">
          <Logo size="lg" layout="vertical" />
        </View>
        <Text className="text-foreground text-xs font-bold text-center uppercase tracking-widest mb-8">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </Text>

        {errorMessage && (
          <View className="bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xs mb-4">
            <Text className="text-rose-500 text-xs font-bold text-center">{errorMessage}</Text>
          </View>
        )}

        {/* Inputs */}
        <View className="space-y-4">
          <View>
            <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Usuario</Text>
            <TextInput
              placeholder="Ej: admin o joselin_lagata"
              placeholderTextColor={withOpacity(colors.foreground, 0.2)}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              className="bg-primary/5 border border-border rounded-full px-4 py-3 text-white font-bold"
            />
          </View>

          <View>
            <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Contraseña</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#64748b"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              onSubmitEditing={handleSubmit}
              className="bg-primary/5 border border-border rounded-full px-4 py-3 text-white font-bold"
            />
          </View>

          {!isLogin && (
            <>
              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Nombre Completo</Text>
                <TextInput
                  placeholder="Ej: Pedro Pérez"
                  placeholderTextColor="#64748b"
                  value={fullName}
                  onChangeText={setFullName}
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>
              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">WhatsApp (Teléfono)</Text>
                <TextInput
                  placeholder="Ej: +584120000000"
                  placeholderTextColor="#64748b"
                  value={phoneWhatsapp}
                  onChangeText={setPhoneWhatsapp}
                  keyboardType="phone-pad"
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>
              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">WhatsApp Handle (@usuario)</Text>
                <TextInput
                  placeholder="Ej: @pedrop"
                  placeholderTextColor="#64748b"
                  value={whatsappHandle}
                  onChangeText={setWhatsappHandle}
                  autoCapitalize="none"
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>
            </>
          )}

          {/* Selección de Rol si es Registro */}
          {!isLogin && (
            <View>
              <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Rol de Acceso</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setRole('player')}
                  className={`flex-1 py-2.5 rounded-xs border items-center ${role === 'player'
                    ? 'bg-secondary/20 border-secondary'
                    : 'bg-background/80 border-border'
                    }`}
                >
                  <Text className={`font-bold text-xs ${role === 'player' ? 'text-secondary' : 'text-foreground'}`}>
                    Jugador P2P
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole('cashier')}
                  className={`flex-1 py-2.5 rounded-xs border items-center ${role === 'cashier'
                    ? 'bg-secondary/20 border-secondary'
                    : 'bg-background/80 border-border'
                    }`}
                >
                  <Text className={`font-bold text-xs ${role === 'cashier' ? 'text-secondary' : 'text-foreground'}`}>
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
          className="bg-primary py-3.5 rounded-full items-center border  mt-6 active:scale-[0.98]"
        >
          {isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : (
            <Text className="text-foreground font-black text-sm uppercase">
              {isLogin ? 'Acceder' : 'Registrar'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Switch de modo */}
        <TouchableOpacity
          onPress={() => setIsLogin(!isLogin)}
          className="mt-6"
        >
          <Text className="text-foreground text-xs font-bold text-center">
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia Sesión'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
