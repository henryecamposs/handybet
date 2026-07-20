import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { localDB } from '../../lib/localDB';
import { useRouter } from 'expo-router';
import { Wallet, Transaction } from '../../types/handyBet';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors } from '../../hooks/useThemeColors';
import HubCover from '../../components/layout/hub/HubCover';
import IconButton from '../../components/ui/IconButton';
import { Edit3, UserPlus, LogOut, Mail, Phone, MapPin, Calendar, Globe, Share2, Send, Sparkles, Shield, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Award, CheckCircle2 } from 'lucide-react-native';

export default function ProfileScreen() {
  const { mockSession, setMockSession } = useHandyBetStore();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const colors = useThemeColors();
  const [wallets, setWallets] = useState<(Wallet & { groupName?: string })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProfileData() {
    try {
      if (!mockSession) return;

      // 1. Fetch Profile
      const profileData = await localDB.users.getById(mockSession.id);
      setProfile(profileData || {
        id: mockSession.id,
        username: mockSession.name.toLowerCase().replace(' ', '_'),
        full_name: mockSession.name,
        role: mockSession.role || 'player',
        avatar_url: mockSession.avatar,
        email: 'usuario@handybet.com',
        birth_date: '1995-08-20',
        bio: 'Apasionado por los pronósticos deportivos y los sorteos en HandyBet.',
        phone_whatsapp: '+584121234567',
        address: 'Caracas, Venezuela',
        interests: ['Apuestas Deportivas', 'Pronósticos', 'Loterías'],
        social_links: {
          instagram: 'usuario_hb',
          twitter: 'usuario_bets',
          telegram: 't.me/usuario_hb'
        }
      });

      // 2. Fetch Wallets (simuladas por grupo)
      const allGroups = await localDB.groups.getAll();
      const userGroups = allGroups.filter((g: any) => g.members?.includes(mockSession.id));
      const simulatedWallets = userGroups.map((g: any) => ({
        id: `wallet_${g.id}`,
        user_id: mockSession.id,
        group_id: g.id,
        groupName: g.name,
        balance: (profileData?.wallet_balance || 150.0) / (userGroups.length || 1),
        created_at: new Date().toISOString()
      }));
      setWallets(simulatedWallets);

      // 3. Fetch Transactions (simuladas)
      const simulatedTx = [
        { id: 'tx_1', amount: 50.00, type: 'deposito', status: 'aprobado', reference_code: 'REF-827391', created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
        { id: 'tx_2', amount: 15.00, type: 'debito_apuesta', status: 'aprobado', reference_code: 'REF-918237', created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
        { id: 'tx_3', amount: 450.00, type: 'credito_premio', status: 'aprobado', reference_code: 'REF-123456', created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      ];
      setTransactions(simulatedTx as any);
    } catch (err) {
      console.log('Error fetching profile details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfileData();
  }, [mockSession]);

  async function handleLogout() {
    setMockSession(null);
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background py-20">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-4 pb-16" showsVerticalScrollIndicator={false}>
      
      {/* 1. CARD HERO PRINCIPAL (Portada, Avatar, Nombre y Acciones) */}
      <View className="bg-card border border-border rounded-2xl overflow-hidden mb-6 shadow-xl">
        <HubCover variant="primary" containerClasses="h-36" />
        
        <View className="p-6 pt-0">
          <View className="flex-row justify-between items-end -mt-14 mb-4">
            <View className="p-1.5 bg-card rounded-full border-2 border-primary shadow-lg">
              <Image
                source={{ uri: profile?.avatar_url || mockSession?.avatar || 'https://i.pravatar.cc/150' }}
                className="w-28 h-28 rounded-full bg-background"
              />
            </View>

            {/* Acciones Principales */}
            <View className="flex-row flex-wrap gap-2 pb-1">
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile/edit' as any)}
                className="flex-row items-center gap-1.5 bg-primary px-4 py-2.5 rounded-xl border border-primary"
              >
                <Edit3 size={16} color="#000" />
                <Text className="text-black font-black text-xs uppercase tracking-wider">Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile/create' as any)}
                className="flex-row items-center gap-1.5 bg-card border border-primary px-3.5 py-2.5 rounded-xl"
              >
                <UserPlus size={16} color={colors.primary} />
                <Text className="text-primary font-bold text-xs">Crear Usuario</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center gap-1 bg-background/80 border border-border px-3 py-2.5 rounded-xl"
              >
                <LogOut size={16} color={colors.destructive} />
                <Text className="text-destructive font-bold text-xs">Salir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Información Básica Header */}
          <View className="mt-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-black text-foreground">{profile?.full_name || mockSession?.name || 'Nombre del Usuario'}</Text>
              <View className="bg-primary/20 px-2.5 py-0.5 rounded-md border border-primary/40">
                <Text className="text-primary text-[10px] uppercase font-bold tracking-wider">
                  {profile?.role === 'admin' ? 'Administrador' : profile?.role === 'cashier' ? 'Cajero Oficial' : 'Jugador VIP'}
                </Text>
              </View>
            </View>
            <Text className="text-primary font-bold text-sm mt-0.5">@{profile?.username || 'usuario'}</Text>
          </View>
        </View>
      </View>

      <View className="flex-col lg:flex-row gap-6 mb-12">
        {/* Columna Izquierda: Información Personal, Contacto, Redes e Intereses */}
        <View className="w-full lg:w-1/2 gap-6">

          {/* CARD 2: Información Personal & Contacto */}
          <View className="bg-card border border-border p-6 rounded-2xl gap-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
              Información Personal & Contacto
            </Text>

            {profile?.bio ? (
              <Text className="text-foreground text-xs leading-relaxed font-medium bg-background/50 p-3 rounded-xl border border-border/50">
                &quot;{profile.bio}&quot;
              </Text>
            ) : null}

            <View className="gap-3">
              <View className="flex-row items-center gap-3 bg-background/60 p-3 rounded-xl border border-border/60">
                <Mail size={18} color={colors.primary} />
                <View>
                  <Text className="text-[10px] text-muted-foreground font-bold uppercase">Correo Electrónico</Text>
                  <Text className="text-foreground font-semibold text-xs">{profile?.email || 'usuario@handybet.com'}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 bg-background/60 p-3 rounded-xl border border-border/60">
                <Phone size={18} color={colors.primary} />
                <View>
                  <Text className="text-[10px] text-muted-foreground font-bold uppercase">WhatsApp / Teléfono</Text>
                  <Text className="text-foreground font-semibold text-xs">{profile?.phone_whatsapp || '+58 412 1234567'}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between bg-background/60 p-3 rounded-xl border border-border/60">
                <View className="flex-row items-center gap-3">
                  <Calendar size={18} color={colors.primary} />
                  <View>
                    <Text className="text-[10px] text-muted-foreground font-bold uppercase">Fecha de Nacimiento</Text>
                    <Text className="text-foreground font-semibold text-xs">{profile?.birth_date || '1995-08-20'}</Text>
                  </View>
                </View>
                <View className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/40">
                  <Text className="text-emerald-400 text-[10px] font-bold">+18 Años</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3 bg-background/60 p-3 rounded-xl border border-border/60">
                <MapPin size={18} color={colors.primary} />
                <View>
                  <Text className="text-[10px] text-muted-foreground font-bold uppercase">Ubicación / Dirección</Text>
                  <Text className="text-foreground font-semibold text-xs">{profile?.address || 'Caracas, Venezuela'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CARD 3: Redes Sociales */}
          <View className="bg-card border border-border p-6 rounded-2xl gap-3">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
              Redes Sociales & Enlaces
            </Text>
            <View className="flex-row flex-wrap gap-2 pt-1">
              <TouchableOpacity className="flex-1 min-w-[140px] flex-row items-center gap-2 p-3 bg-background border border-border rounded-xl">
                <Globe size={16} color={colors.primary} />
                <Text className="text-foreground font-bold text-xs" numberOfLines={1}>
                  {profile?.social_links?.instagram ? `@${profile.social_links.instagram}` : 'Instagram'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 min-w-[140px] flex-row items-center gap-2 p-3 bg-background border border-border rounded-xl">
                <Share2 size={16} color={colors.primary} />
                <Text className="text-foreground font-bold text-xs" numberOfLines={1}>
                  {profile?.social_links?.twitter ? `@${profile.social_links.twitter}` : 'X / Twitter'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className="flex-1 min-w-[140px] flex-row items-center gap-2 p-3 bg-background border border-border rounded-xl">
                <Send size={16} color={colors.primary} />
                <Text className="text-foreground font-bold text-xs" numberOfLines={1}>
                  {profile?.social_links?.telegram ? `@${profile.social_links.telegram}` : 'Telegram'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CARD 4: Intereses & Chips */}
          <View className="bg-card border border-border p-6 rounded-2xl gap-3">
            <View className="flex-row items-center gap-2 border-b border-border pb-2">
              <Sparkles size={16} color={colors.primary} />
              <Text className="text-xs font-bold text-primary uppercase tracking-widest">
                Intereses & Etiquetas Preferidas
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2 pt-2">
              {(profile?.interests || ['Apuestas Deportivas', 'Pronósticos', 'Loterías']).map((tag: string) => (
                <View key={tag} className="px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40">
                  <Text className="text-primary text-xs font-bold">✓ {tag}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>

        {/* Columna Derecha: Multi-Wallets & Ledger Contable */}
        <View className="w-full lg:w-1/2 gap-6">

          {/* CARD 5: Multi-Wallets (Balances por Grupo) */}
          <View className="bg-card border border-border p-6 rounded-2xl gap-4">
            <View className="flex-row items-center justify-between border-b border-border pb-2">
              <View className="flex-row items-center gap-2">
                <WalletIcon size={18} color={colors.primary} />
                <Text className="text-xs font-bold text-primary uppercase tracking-widest">
                  Multi-Wallets (Balances)
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground font-bold">{wallets.length} Salas</Text>
            </View>

            {wallets.length === 0 ? (
              <View className="bg-background/50 border border-border p-4 rounded-xl items-center">
                <Text className="text-muted-foreground font-bold text-xs text-center">
                  Aún no posees balances o wallets registradas en comunidades.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {wallets.map((w) => (
                  <View key={w.id} className="bg-background border border-border p-4 rounded-xl flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center border border-primary/40">
                        <WalletIcon size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text className="text-foreground font-bold text-xs">{w.groupName || 'Taquilla de Grupo'}</Text>
                        <Text className="text-muted-foreground text-[10px]">ID: {w.group_id}</Text>
                      </View>
                    </View>
                    <Text className="text-primary font-black text-base">
                      {w.balance.toFixed(2)} <Text className="text-xs text-muted-foreground">Bs.</Text>
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* CARD 6: Historial Contable (Ledger) */}
          <View className="bg-card border border-border p-6 rounded-2xl gap-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
              Historial Contable (Ledger)
            </Text>

            <View className="gap-3">
              {transactions.map((tx) => {
                const isPositive = tx.type === 'deposito' || tx.type === 'credito_premio';
                return (
                  <View key={tx.id} className="bg-background border border-border p-3.5 rounded-xl flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View className={`w-9 h-9 rounded-full items-center justify-center ${isPositive ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-rose-500/20 border border-rose-500/40'}`}>
                        {tx.type === 'deposito' ? (
                          <ArrowDownLeft size={18} color="#10b981" />
                        ) : tx.type === 'credito_premio' ? (
                          <Award size={18} color="#10b981" />
                        ) : (
                          <ArrowUpRight size={18} color="#f43f5e" />
                        )}
                      </View>
                      <View>
                        <Text className="text-foreground font-bold text-xs uppercase">{tx.type.replace('_', ' ')}</Text>
                        <Text className="text-muted-foreground text-[10px]">{tx.reference_code}</Text>
                      </View>
                    </View>
                    <Text className={`font-black text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? '+' : '-'}{tx.amount.toFixed(2)} Bs.
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  );
}
