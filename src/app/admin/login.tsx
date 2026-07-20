import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lock } from 'lucide-react-native';

const ADMIN_AUTH_KEY = 'handybet_admin_auth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { replaceRoute } = useAppNavigation();

  const handleLogin = async () => {
    if (password === 'handybet*2026') {
      await AsyncStorage.setItem(ADMIN_AUTH_KEY, 'true');
      replaceRoute('/admin');
    } else {
      setError('Contraseña incorrecta');
      setPassword('');
      Alert.alert('Error', 'Contraseña incorrecta');
    }
  };

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-4">
      <View className="bg-gray-800 p-8 rounded-2xl w-full max-w-md shadow-lg items-center border border-gray-700">
        <View className="bg-blue-500/20 p-4 rounded-full mb-6">
          <Lock size={32} color="#3b82f6" />
        </View>
        <Text className="text-white text-2xl font-bold mb-2">Panel Administrativo</Text>
        <Text className="text-gray-400 mb-8 text-center">Ingresa la contraseña maestra para acceder a los KPIs y Analíticas.</Text>

        <View className="w-full mb-4">
          <Text className="text-gray-300 text-sm font-semibold mb-2">Contraseña</Text>
          <TextInput
            className="w-full bg-gray-700/50 text-white p-4 rounded-xl border border-gray-600 focus:border-blue-500"
            placeholder="********"
            placeholderTextColor="#9ca3af"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            onSubmitEditing={handleLogin}
          />
          {error ? <Text className="text-red-400 text-sm mt-2">{error}</Text> : null}
        </View>

        <TouchableOpacity 
          className="w-full bg-blue-600 p-4 rounded-xl items-center mt-4 active:bg-blue-700"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg">Acceder</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="mt-6"
          onPress={() => replaceRoute('/')}
        >
          <Text className="text-gray-400 text-sm">Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
