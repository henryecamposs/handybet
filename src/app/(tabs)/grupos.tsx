import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Users, Compass, MessageSquare, Plus, Trash2, LayoutList, MessageCircle, LucideUserMinus2, LogOut } from 'lucide-react-native';
import { handyBetGroups } from '../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { Modal, ActivityIndicator, ScrollView } from 'react-native';
import { groupMonetizationService } from '../../services/groupMonetizationService';
import { Group, GroupPlan, GroupRules } from '../../types/handyBet';
import { useThemeColors } from '../../hooks/useThemeColors';
import { localDB } from '../../lib/localDB';
import { HubLayout, Carrusel, SeccionLista, PostContainer, TabContainer } from '../../components/layout/hub';
import ListItem from '../../components/ui/ListItem';
import IconButton from '../../components/ui/IconButton';
import EmptyState from '../../components/ui/EmptyState';

export default function GruposScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  // Simulamos los grupos del usuario
  const [misGrupos, setMisGrupos] = useState<Group[]>(handyBetGroups.slice(0, 2) as any);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(false);
  const [plans, setPlans] = useState<GroupPlan[]>([]);
  const [rules, setRules] = useState<GroupRules | null>(null);
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchLatestPosts() {
      try {
        const allPosts = await localDB.posts.getAll();
        const groupOrChannelPosts = allPosts.filter((p: any) => p.group_id || p.channel_id);
        groupOrChannelPosts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const top5 = groupOrChannelPosts.slice(0, 5);
        const resolved = await Promise.all(top5.map(p => localDB.resolvePostWithAuthor(p)));
        setLatestPosts(resolved);
      } catch (err) {
        console.log('Error loading latest posts in groups hub:', err);
      }
    }
    fetchLatestPosts();
  }, []);

  // Estado de respuestas del cuestionario
  const [experience, setExperience] = useState('');
  const [intentions, setIntentions] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleGroupClick = async (group: Group) => {
    // Si ya es miembro, ir directo al chat
    if (misGrupos.some((g: Group) => g.id === group.id)) {
      router.push(`/chat/group/${group.id}` as any);
      return;
    }

    // Si no es miembro, abrir onboarding
    setSelectedGroup(group);
    setLoadingOnboarding(true);
    setShowOnboarding(true);
    try {
      const fetchedPlans = await groupMonetizationService.getGroupPlans(group.id);
      const fetchedRules = await groupMonetizationService.getGroupRules(group.id);
      setPlans(fetchedPlans);
      setRules(fetchedRules);
      if (fetchedPlans.length > 0) {
        setSelectedPlanId(fetchedPlans[0].id);
      } else {
        setSelectedPlanId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOnboarding(false);
    }
  };

  const handleJoinSubmit = async () => {
    if (!selectedGroup) return;
    setLoadingOnboarding(true);
    try {
      const answers = { q1: experience, q2: intentions };
      await groupMonetizationService.submitOnboarding(
        selectedGroup.id,
        'usr_player1', // Usuario actual simulado
        answers,
        selectedPlanId
      );

      // Agregar a mis grupos en el estado local para simular la unión exitosa
      setMisGrupos([...misGrupos, selectedGroup]);
      setShowOnboarding(false);

      // Limpiar estados
      setExperience('');
      setIntentions('');

      // Navegar a la sala de chat del grupo
      router.push(`/chat/group/${selectedGroup.id}` as any);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOnboarding(false);
    }
  };

  const filteredDiscoverGroups = handyBetGroups.slice(2).filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGroupItem = (group: any) => {
    const isMember = misGrupos.some((g: Group) => g.id === group.id);
    return (
      <ListItem
        key={group.id}
        title={group.name}
        subtitle={`${group.members?.length || 0} miembros`}
        subtitleVariant="muted"
        leftElement={
          <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center border border-border">
            {group.id.includes('sug') || !isMember ? <Text className="text-lg">🌍</Text> : <Users size={18} color={colors.primary} />}
          </View>
        }
        rightElement={
          isMember ? (
            <View className="flex-row gap-2 items-center">
              <IconButton
                icon={LayoutList}
                onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
                variant="default"
                rounded="full"
                hasBorder={true}
              />
              <IconButton
                icon={MessageCircle}
                onPress={() => router.push(`/chat/group/${group.id}` as any)}
                variant="default"
                rounded="full"
                hasBorder={true}
              />
              <IconButton
                icon={LogOut}
                onPress={() => {
                  setMisGrupos(misGrupos.filter((g) => g.id !== group.id));
                }}
                variant="destructive"
                rounded="full"
                hasBorder={true}
              />
            </View>
          ) : (
            <IconButton
              label="Ver Feed"
              onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
              variant="ghost"
              hasBorder={true}
              size="xs"
              rounded="full"
            />
          )
        }
        onPress={() => handleGroupClick(group as any)}
        className="mb-2 bg-background/80"
      />
    );
  };

  const emptyState = (
    <EmptyState
      icon={Compass}
      title="Aún no tienes grupos"
      description="No hay grupos disponibles. Explora sugerencias o crea el tuyo."
      variant="dashed"
    />
  );

  const emptyStateDiscover = (
    <EmptyState
      icon={Compass}
      title="No hay sugerencias"
      description="No tenemos nuevas sugerencias por ahora. Vuelve más tarde."
      variant="dashed"
    />
  );

  const tabs = [
    {
      id: 'my-groups',
      label: ((isActive: boolean) => (
        <View className="flex-row items-center justify-center mt-2">
          <Text className={`font-black text-center text-xs uppercase tracking-wider ${isActive ? 'text-primary' : 'text-foreground'}`}>
            Mis Grupos ({misGrupos.length})
          </Text>
          <View className="-my-2 ml-1">
            <IconButton
              icon={Plus}
              onPress={() => router.push('/(tabs)/grupos/create' as any)}
              variant={isActive ? 'primary' : 'ghost'}
              hasBorder={false}
              size="md"
              rounded="full"
            />
          </View>
        </View>
      )),
      content: (
        <View className="mt-2">
          <SeccionLista
            items={misGrupos}
            renderItem={renderGroupItem}
            layout="list"
            emptyState={emptyState}
          />
        </View>
      ),
    },
    {
      id: 'discover',
      label: `Grupos Sugeridos (${filteredDiscoverGroups.length})`,
      content: (
        <SeccionLista
          items={filteredDiscoverGroups}
          renderItem={renderGroupItem}
          layout="list"
          emptyState={emptyStateDiscover}
        />
      ),
    },
  ];

  return (
    <HubLayout
      title="Grupos"
      subtitle="Administra y descubre comunidades."
      searchPlaceholder="Buscar grupos por interés..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showBack={true}
      tabContainer={<TabContainer tabs={tabs} />}
      postContainer={
        <PostContainer
          title="Últimas Publicaciones"
          posts={latestPosts}
          onViewAll={latestPosts[0] ? () => router.push(`/feed/search?id=${latestPosts[0].group_id || latestPosts[0].channel_id}&from=group` as any) : undefined}
        />
      }
    >

      {/* Modal de Onboarding y Selección de Plan */}
      <Modal
        visible={showOnboarding}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOnboarding(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-background border border-border w-full max-w-md  p-6 shadow-2xl">
            {loadingOnboarding && !selectedGroup ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color={colors.secondary} />
                <Text className="text-foreground text-xs font-bold mt-4">Cargando detalles del grupo...</Text>
              </View>
            ) : (
              <>
                <Text className="text-foreground font-black text-xl mb-1">Unirse a {selectedGroup?.name}</Text>
                <Text className="text-foreground text-xs font-bold mb-4">Completa el cuestionario de onboarding para acceder.</Text>

                <ScrollView className="max-h-[380px] mb-6" showsVerticalScrollIndicator={false}>
                  {/* Términos y Aviso Legal */}
                  {rules?.terms_text && (
                    <View className="bg-background/50 border border-border p-4  mb-4">
                      <Text className="text-foreground font-bold text-xs mb-1.5 uppercase tracking-wider">Aviso Legal y Términos</Text>
                      <Text className="text-foreground text-[11px] leading-4">{rules.terms_text}</Text>
                    </View>
                  )}

                  {/* Cuestionario de Intenciones */}
                  <View className="space-y-4 mb-4">
                    <View>
                      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">
                        1. ¿Cuál es tu nivel de experiencia en apuestas?
                      </Text>
                      <TextInput
                        placeholder="Ej: Principiante, Intermedio, Experto"
                        placeholderTextColor={colors.mutedForeground}
                        value={experience}
                        onChangeText={setExperience}
                        className="bg-background border border-border rounded-xs px-4 py-2.5 text-white text-xs font-bold"
                      />
                    </View>

                    <View>
                      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">
                        2. ¿Qué deseas hacer en el grupo?
                      </Text>
                      <TextInput
                        placeholder="Ej: Aprender, publicar pronósticos, etc."
                        placeholderTextColor={colors.mutedForeground}
                        value={intentions}
                        onChangeText={setIntentions}
                        className="bg-background border border-border rounded-xs px-4 py-2.5 text-white text-xs font-bold"
                      />
                    </View>
                  </View>

                  {/* Selección de Planes */}
                  {plans.length > 0 && (
                    <View className="mb-2">
                      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Selecciona un Plan de Acceso</Text>
                      <View className="space-y-2">
                        {plans.map((plan: GroupPlan) => (
                          <TouchableOpacity
                            key={plan.id}
                            onPress={() => setSelectedPlanId(plan.id)}
                            className={`p-3.5  border flex-row justify-between items-center ${selectedPlanId === plan.id
                              ? 'bg-secondary/15 border-secondary'
                              : 'bg-background border-border'
                              }`}
                          >
                            <View>
                              <Text className="text-foreground text-xs font-black">{plan.name}</Text>
                              <Text className="text-foreground text-[10px] font-bold uppercase mt-0.5">
                                {plan.billing_type === '24_hours' ? 'Por 24 horas' : plan.billing_type === 'mensual' ? 'Mensual' : 'Anual'}
                              </Text>
                            </View>
                            <Text className="text-secondary font-black text-sm">${plan.price.toFixed(2)}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </ScrollView>

                {/* Botones de acción */}
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setShowOnboarding(false)}
                    className="flex-1 bg-background border border-border py-3.5  items-center"
                  >
                    <Text className="text-foreground font-bold text-xs">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleJoinSubmit}
                    disabled={loadingOnboarding || !experience}
                    className="flex-1 bg-primary py-3.5  items-center justify-center flex-row gap-2"
                  >
                    {loadingOnboarding ? (
                      <ActivityIndicator size="small" color="#0f172a" />
                    ) : (
                      <Text className="text-foreground font-black text-xs uppercase">Aceptar y Unirse</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </HubLayout>
  );
}

