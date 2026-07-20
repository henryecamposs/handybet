import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { X, Shield, Lock, Key, Smartphone, CheckCircle2, Eye, EyeOff, FileText, AlertCircle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useToastStore } from '@/store/useToastStore';

export interface PrivacySecurityModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacySecurityModal({ visible, onClose }: PrivacySecurityModalProps) {
  const colors = useThemeColors();
  const { addToast } = useToastStore();

  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionAlerts, setSessionAlerts] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showWalletsPublic, setShowWalletsPublic] = useState(false);

  const handleSaveSecurity = () => {
    addToast({ title: 'Ajustes de privacidad y seguridad guardados', variant: 'success' });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center p-4 z-50">
        <View className="bg-background border border-border w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <View className="bg-card border-b border-border p-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center border border-primary/40">
                <Shield size={22} color={colors.primary} />
              </View>
              <View>
                <Text className="text-foreground font-black text-lg">Privacidad & Seguridad</Text>
                <Text className="text-muted-foreground text-xs">Protección de cuenta, RLS y cifrado de datos.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2 rounded-full hover:bg-muted">
              <X size={18} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Body Content */}
          <ScrollView className="max-h-[420px] p-5 gap-5">
            
            {/* Status Card RLS */}
            <View className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl flex-row items-start gap-3">
              <CheckCircle2 size={22} color="#10b981" className="mt-0.5" />
              <View className="flex-1">
                <Text className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Cifrado de Extremo a Extremo & RLS Activo</Text>
                <Text className="text-foreground/80 text-xs leading-relaxed mt-1">
                  Todas las transacciones y datos financieros en HandyBet se ejecutan bajo políticas estrictas de Row Level Security (RLS) en Supabase PostgreSQL.
                </Text>
              </View>
            </View>

            {/* Ajustes de Seguridad */}
            <View className="gap-3">
              <Text className="text-foreground font-bold text-xs uppercase tracking-wider text-primary">Controles de Seguridad</Text>

              <View className="flex-row items-center justify-between p-3.5 bg-card border border-border rounded-xl">
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <Key size={18} color={colors.primary} />
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-xs">Autenticación en Dos Pasos (2FA)</Text>
                    <Text className="text-muted-foreground text-[10px]">Solicita código de confirmación en retiros y operaciones.</Text>
                  </View>
                </View>
                <Switch
                  value={twoFactor}
                  onValueChange={setTwoFactor}
                  trackColor={{ false: '#3f3f46', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="flex-row items-center justify-between p-3.5 bg-card border border-border rounded-xl">
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <Smartphone size={18} color={colors.primary} />
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-xs">Alertas de Inicio de Sesión</Text>
                    <Text className="text-muted-foreground text-[10px]">Notifica inmediatamente si se accede desde un nuevo dispositivo.</Text>
                  </View>
                </View>
                <Switch
                  value={sessionAlerts}
                  onValueChange={setSessionAlerts}
                  trackColor={{ false: '#3f3f46', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            {/* Ajustes de Privacidad */}
            <View className="gap-3">
              <Text className="text-foreground font-bold text-xs uppercase tracking-wider text-primary">Privacidad del Perfil</Text>

              <View className="flex-row items-center justify-between p-3.5 bg-card border border-border rounded-xl">
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <Eye size={18} color={colors.primary} />
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-xs">Perfil Público</Text>
                    <Text className="text-muted-foreground text-[10px]">Permite que otros usuarios encuentren tu handle en búsquedas.</Text>
                  </View>
                </View>
                <Switch
                  value={publicProfile}
                  onValueChange={setPublicProfile}
                  trackColor={{ false: '#3f3f46', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>

              <View className="flex-row items-center justify-between p-3.5 bg-card border border-border rounded-xl">
                <View className="flex-row items-center gap-3 flex-1 pr-3">
                  <EyeOff size={18} color={colors.primary} />
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-xs">Mostrar Balances en Perfil</Text>
                    <Text className="text-muted-foreground text-[10px]">Visibilidad de saldos virtuales de billeteras a terceros.</Text>
                  </View>
                </View>
                <Switch
                  value={showWalletsPublic}
                  onValueChange={setShowWalletsPublic}
                  trackColor={{ false: '#3f3f46', true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>

            {/* Sesiones Activas */}
            <View className="gap-2">
              <Text className="text-foreground font-bold text-xs uppercase tracking-wider text-primary">Dispositivo Actual</Text>
              <View className="p-3 bg-card border border-border rounded-xl flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Smartphone size={18} color={colors.primary} />
                  <View>
                    <Text className="text-foreground font-bold text-xs">Navegador Web / Windows</Text>
                    <Text className="text-muted-foreground text-[10px]">Sesión activa ahora • Caracas, VE</Text>
                  </View>
                </View>
                <View className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                  <Text className="text-emerald-400 text-[10px] font-bold">En Línea</Text>
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          <View className="bg-card border-t border-border p-4 flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="px-4 py-2 bg-background border border-border rounded-full">
              <Text className="text-foreground font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSaveSecurity}
              className="px-5 py-2 bg-primary rounded-full"
            >
              <Text className="text-primary-foreground font-black text-xs uppercase">Guardar Ajustes</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}
