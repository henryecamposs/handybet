import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { localDB } from '../../lib/localDB';
import { useRouter } from 'expo-router';
import { Wallet, Transaction } from '../../types/handyBet';
import { useHandyBetStore } from '../../store/useHandyBetStore';

export default function ProfileScreen() {
  const { mockSession, setMockSession } = useHandyBetStore();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const [wallets, setWallets] = useState<(Wallet & { groupName?: string })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  async function fetchProfileData() {
    try {
      setIsLoading(true);
      if (!mockSession) return;

      // 1. Fetch Profile
      const profileData = await localDB.users.getById(mockSession.id);
      setProfile(profileData);

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
    setTimeout(() => {
      fetchProfileData();
    }, 0);
  }, [mockSession]);

  async function handleLogout() {
    setMockSession(null);
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
          <View className="bg-card border border-zinc-850 p-6 rounded-3xl mb-6 shadow-md flex-row justify-between items-center">
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
                className="bg-background/80 border border-zinc-850 px-4 py-2 rounded-xl"
              >
                <Text className="text-rose-500 text-[10px] font-black uppercase">Salir</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Wallets Aisladas */}
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Multi-Wallets (Balances)</Text>
          {wallets.length === 0 ? (
            <View className="bg-card border border-zinc-850 p-5 rounded-3xl mb-6">
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
            <View className="bg-card border border-zinc-850 p-6 rounded-3xl">
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
                    className="bg-card border border-zinc-850 p-4 rounded-3xl flex-row justify-between items-center shadow-sm"
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
