import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'expo-router';
import { Wallet, Transaction } from '../../types/handyBet';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const [wallets, setWallets] = useState<(Wallet & { groupName?: string })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [isLoading, setIsLoading] = useState(true);



  async function fetchProfileData() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // 2. Fetch Wallets
      const { data: walletsData } = await supabase
        .from('wallets')
        .select('*, groups(name)');

      const processedWallets = (walletsData || []).map((w: any) => ({
        ...w,
        groupName: w.groups?.name || 'Agencia Externa',
      }));
      setWallets(processedWallets);

      // 3. Fetch Transactions
      const { data: txData } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      setTransactions(txData || []);
    } catch (err) {
      console.log('Error fetching profile details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileData();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <ScrollView className="flex-1 bg-background px-4 pt-12">
      {isLoading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <View>
          {/* Tarjeta Perfil */}
          <View className="bg-background/90 border border-zinc-850 p-6 rounded-3xl mb-6 shadow-md flex-row justify-between items-center">
            <View>
              <Text className="text-[10px] font-black text-secondary uppercase tracking-widest">Perfil de Usuario</Text>
              <Text className="text-xl font-black text-white mt-1">@{profile?.username || 'usuario'}</Text>
              <Text className="text-foreground text-xs font-bold mt-0.5">{profile?.full_name || 'Nombre Completo'}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile/edit' as any)}
                className="bg-secondary/20 border border-secondary px-4 py-2 rounded-xl mb-2"
              >
                <Text className="text-secondary text-[10px] font-black uppercase">Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-background border border-zinc-850 px-4 py-2 rounded-xl"
              >
                <Text className="text-rose-500 text-[10px] font-black uppercase">Salir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wallets Aisladas */}
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Multi-Wallets (Balances)</Text>
          {wallets.length === 0 ? (
            <View className="bg-background border border-zinc-850 p-5 rounded-3xl mb-6">
              <Text className="text-foreground font-bold text-xs text-center">
                Aún no posees balances o wallets registradas.
              </Text>
            </View>
          ) : (
            <View className="mb-6 space-y-3">
              {wallets.map((wallet) => (
                <View
                  key={wallet.id}
                  className="bg-background/90 border border-zinc-850 p-5 rounded-3xl flex-row justify-between items-center shadow-sm"
                >
                  <Text className="text-foreground font-bold text-sm">{wallet.groupName}</Text>
                  <Text className="text-secondary font-black text-lg font-mono">
                    {wallet.balance.toFixed(2)} Bs.
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Ledger de Transacciones */}
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Historial Contable (Ledger)</Text>
          {transactions.length === 0 ? (
            <View className="bg-background border border-zinc-850 p-6 rounded-3xl">
              <Text className="text-foreground font-bold text-xs text-center">
                No se registran movimientos contables en tu cuenta.
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {transactions.map((tx) => {
                const isDebit = tx.type.startsWith('debito') || tx.type === 'compra_suscripcion';
                return (
                  <View
                    key={tx.id}
                    className="bg-background/90 border border-zinc-850 p-4 rounded-3xl flex-row justify-between items-center shadow-sm"
                  >
                    <View>
                      <Text className="text-white font-black text-xs uppercase tracking-wide">
                        {tx.type.replace('_', ' ')}
                      </Text>
                      <Text className="text-foreground text-[9px] font-bold uppercase mt-1">
                        {new Date(tx.created_at).toLocaleDateString()} • Ref: {tx.reference_code || 'N/A'}
                      </Text>
                    </View>
                    <Text className={`font-black text-sm font-mono ${isDebit ? 'text-rose-500' : 'text-secondary'}`}>
                      {isDebit ? '-' : '+'}{tx.amount.toFixed(2)} Bs.
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
      <View className="h-16" />
    </ScrollView>
  );
}
