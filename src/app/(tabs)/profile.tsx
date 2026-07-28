import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { localDB } from '../../lib/localDB';
import { useRouter } from 'expo-router';
import { Wallet, Transaction } from '../../types/handyBet';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useThemeColors } from '../../hooks/useThemeColors';
import HubDetailLayout from '@/components/layout/HubDetailLayout';
import HubDetailsUtilities from '@/components/layout/hub/HubDetailsUtilities';
import HubCover from '@/components/layout/hub/HubCover';
import { TabContainer, SeccionLista } from '@/components/layout/hub';
import PostContainer from '@/components/layout/hub/PostContainer';
import CreatePostWidget from '@/components/feed/CreatePostWidget';
import EmptyState from '@/components/ui/EmptyState';
import IconButton from '@/components/ui/IconButton';
import { useHubUtilities } from '@/hooks/useHubUtilities';
import { 
  Edit3, UserPlus, LogOut, Mail, Phone, Globe, Share2, Send, 
  Sparkles, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, 
  Award, Info, User, ImageIcon, Users, LayoutList 
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { mockSession, setMockSession } = useHandyBetStore();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const colors = useThemeColors();
  const { handleBack } = useHubUtilities();
  const [wallets, setWallets] = useState<(Wallet & { groupName?: string })[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchProfileData() {
    try {
      const currentSession = mockSession || { id: 'usr_henry', name: 'Henry Campos', role: 'admin', avatar: 'https://i.pravatar.cc/150' };

      // 1. Fetch Profile
      const profileData = await localDB.users.getById(currentSession.id);
      const userProf = profileData || {
        id: currentSession.id,
        username: currentSession.name.toLowerCase().replace(' ', '_'),
        full_name: currentSession.name,
        role: currentSession.role || 'player',
        avatar_url: currentSession.avatar,
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
      };
      setProfile(userProf);

      // 2. Fetch Posts
      const allPosts = await localDB.posts.getAll();
      const filteredPosts = allPosts.filter((p: any) => p.author?.username === userProf.username || p.author_id === currentSession.id);
      setUserPosts(filteredPosts);

      // 3. Fetch Wallets (simuladas por grupo)
      const allGroups = await localDB.groups.getAll();
      const userGroups = allGroups.filter((g: any) => g.members?.includes(currentSession.id));
      const simulatedWallets = userGroups.map((g: any) => ({
        id: `wallet_${g.id}`,
        user_id: currentSession.id,
        group_id: g.id,
        groupName: g.name,
        balance: (profileData?.wallet_balance || 150.0) / (userGroups.length || 1),
        created_at: new Date().toISOString()
      }));
      setWallets(simulatedWallets);

      // 4. Fetch Transactions (simuladas)
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfileData();
  }, [mockSession]);

  async function handleLogout() {
    setMockSession(null);
  }

  const heroBanner = (
    <View className="mb-6">
      <HubCover variant="primary" containerClasses="h-36" />

      <HubDetailsUtilities
        avatarNode={
          <Image
            source={{ uri: profile?.avatar_url || mockSession?.avatar || 'https://i.pravatar.cc/150' }}
            className="w-28 h-28 rounded-full bg-background/80"
          />
        }
        title={profile?.full_name || mockSession?.name || 'Nombre del Usuario'}
        subtitle={`@${profile?.username || 'usuario'}`}
        stats={[
          { value: 120, label: 'Seguidores' },
          { value: wallets.length || 15, label: 'Grupos' }
        ]}
        onBack={() => handleBack('/(tabs)/feed')}
        colors={colors}
      >
        <IconButton
          icon={Edit3}
          label="Editar"
          onPress={() => router.push('/(tabs)/profile/edit' as any)}
          variant="primary"
          rounded="full"
          hasBorder={true}
          size="sm"
        />
        <IconButton
          icon={UserPlus}
          onPress={() => router.push('/(tabs)/profile/create' as any)}
          variant="ghost"
          rounded="full"
          hasBorder={true}
          size="sm"
        />
        <IconButton
          icon={LogOut}
          onPress={handleLogout}
          variant="ghost"
          rounded="full"
          hasBorder={true}
          size="sm"
        />
      </HubDetailsUtilities>

      <View className="px-4">
        <Text className="text-foreground mt-2 leading-5 text-sm">
          {profile?.bio || 'Explorando la red HandyBet. Jugador frecuente en La Imaginaria.'}
        </Text>
      </View>
    </View>
  );

  const tabs = [
    {
      id: 'posts',
      label: 'Publicaciones',
      content: (
        <View className="flex-col lg:flex-row gap-6 mt-4">
          {/* Columna Izquierda: Información de Miembro / Usuario */}
          <View className="w-full lg:w-1/3 gap-4">
            <View className="bg-card border border-border rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Info size={18} color={colors.primary} />
                <Text className="text-foreground font-bold text-base">Biografía</Text>
              </View>
              <Text className="text-foreground/80 text-sm leading-5">
                {profile?.bio || 'Apasionado por los pronósticos deportivos y los sorteos en HandyBet.'}
              </Text>
            </View>

            <View className="bg-card border border-border rounded-xl p-4">
              <View className="flex-row items-center gap-2 mb-3">
                <User size={18} color={colors.primary} />
                <Text className="text-foreground font-bold text-base">Datos de Contacto</Text>
              </View>
              <View className="gap-2">
                <View className="flex-row justify-between py-1.5 border-b border-border/50">
                  <Text className="text-foreground/70 text-xs">Email</Text>
                  <Text className="text-foreground font-medium text-xs">{profile?.email || 'usuario@handybet.com'}</Text>
                </View>
                <View className="flex-row justify-between py-1.5 border-b border-border/50">
                  <Text className="text-foreground/70 text-xs">WhatsApp</Text>
                  <Text className="text-foreground font-medium text-xs">{profile?.phone_whatsapp || '+58 412 1234567'}</Text>
                </View>
                <View className="flex-row justify-between py-1.5">
                  <Text className="text-foreground/70 text-xs">Rol</Text>
                  <Text className="text-primary font-bold text-xs uppercase">
                    {profile?.role === 'admin' ? 'Administrador' : 'Jugador VIP'}
                  </Text>
                </View>
              </View>
            </View>

            <View className="bg-card border border-border rounded-xl p-4">
              <Text className="text-foreground font-bold text-sm mb-3">Intereses y Preferencias</Text>
              <View className="flex-row flex-wrap gap-2">
                {(profile?.interests || ['Apuestas Deportivas', 'Pronósticos', 'Loterías']).map((tag: string) => (
                  <View key={tag} className="px-3 py-1 rounded-full bg-primary/20 border border-primary/40">
                    <Text className="text-primary text-xs font-bold">✓ {tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Columna Derecha: Widget de Creación y Muro de Publicaciones */}
          <View className="w-full lg:w-2/3">
            <View className="mb-4">
              <CreatePostWidget onPublish={async () => true} />
            </View>
            {userPosts.length > 0 ? (
              <PostContainer
                title="Mis Publicaciones"
                posts={userPosts}
              />
            ) : (
              <EmptyState title="No has realizado publicaciones todavía." icon={LayoutList} variant="dashed" />
            )}
          </View>
        </View>
      )
    },
    {
      id: 'info',
      label: 'Información',
      content: (
        <View className="mt-4 gap-4">
          <View className="bg-card border border-border rounded-2xl p-6 gap-4">
            <Text className="text-xs font-bold text-primary uppercase tracking-widest border-b border-border pb-2">
              Información Personal & Contacto
            </Text>

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
            </View>
          </View>

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
        </View>
      )
    },
    {
      id: 'wallets',
      label: 'Wallets & Historial',
      content: (
        <View className="mt-4 gap-6">
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
      )
    },
    {
      id: 'photos',
      label: 'Fotos',
      content: <EmptyState title="No has subido fotografías aún." icon={ImageIcon} variant="dashed" />
    },
    {
      id: 'groups',
      label: 'Grupos',
      content: (
        <View className="mt-4 gap-4">
          <EmptyState title="Perteneces a las comunidades oficiales de HandyBet." icon={Users} variant="dashed" />
        </View>
      )
    }
  ];

  return (
    <HubDetailLayout
      hideHeader
      logoType="default"
      backRoute="/(tabs)/feed"
      isLoading={isLoading}
    >
      {heroBanner}
      <View className="px-4">
        <TabContainer tabs={tabs} defaultTabId="posts" />
      </View>
    </HubDetailLayout>
  );
}
