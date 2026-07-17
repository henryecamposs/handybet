import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Users, Compass, MessageSquare, Plus } from 'lucide-react-native';
import { handyBetGroups } from '../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { Modal, ActivityIndicator, ScrollView } from 'react-native';
import { groupMonetizationService } from '../../services/groupMonetizationService';
import { Group, GroupPlan, GroupRules } from '../../types/handyBet';
import { useThemeColors } from '../../hooks/useThemeColors';
import { localDB } from '../../lib/localDB';
import { HubLayout, Carrusel, SeccionLista, PostContainer } from '../../components/layout/hub';

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

  const renderMyGroupCard = (group: Group) => (
    <View
      key={group.id}
      className="w-36 h-44 bg-background/80 rounded-3xl border border-muted-foreground items-center justify-between p-3 mr-4 hover:bg-background/80/80 transition-colors"
    >
      <TouchableOpacity
        onPress={() => handleGroupClick(group)}
        className="items-center flex-1 justify-center w-full"
      >
        <View className="w-10 h-10 rounded-full bg-background/85 items-center justify-center mb-1.5 border border-zinc-800">
          <Users size={18} color={colors.primary} />
        </View>
        <Text className="text-foreground font-black text-center text-xs px-1" numberOfLines={2}>
          {group.name}
        </Text>
        <Text className="text-zinc-500 text-[9px] font-bold mt-0.5">
          {group.members?.length || 0} miembros
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
        className="w-full bg-primary/20 border border-primary/30 py-1.5 rounded-xl items-center"
      >
        <Text className="text-primary text-[9px] font-black uppercase tracking-wider">Ver Feed 📢</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDiscoverGroupCard = (group: any) => (
    <View
      key={group.id}
      className="w-[48%] bg-background/80 p-3.5 rounded-3xl border border-muted-foreground items-center justify-between min-h-[160px] mb-4"
    >
      <TouchableOpacity
        onPress={() => handleGroupClick(group as any)}
        className="items-center flex-1 justify-center w-full mb-3"
      >
        <View className="w-10 h-10 rounded-full bg-background/80 items-center justify-center mb-2 border border-zinc-700">
          <Text className="text-lg">🌍</Text>
        </View>
        <Text className="text-foreground font-black text-center text-xs" numberOfLines={2}>{group.name}</Text>
        <Text className="text-zinc-500 text-[9px] font-bold mt-0.5">{group.members?.length || 0} miembros</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push(`/feed/search?id=${group.id}&from=group` as any)}
        className="w-full bg-primary/20 border border-primary/30 py-1.5 rounded-xl items-center"
      >
        <Text className="text-primary text-[9px] font-black uppercase tracking-wider">Ver Feed 📢</Text>
      </TouchableOpacity>
    </View>
  );

  const emptyState = (
    <View className="flex-1 items-center justify-center py-20 mt-4">
      <Compass size={48} color="#52525b" className="mb-4" />
      <Text className="text-foreground font-bold text-lg text-center">Aún no has creado grupos</Text>
      <Text className="text-foreground text-sm text-center mt-2 max-w-[250px]">
        Crea tu propio grupo para conectar con amigos o descubre nuevas comunidades.
      </Text>
    </View>
  );

  return (
    <HubLayout
      title="Grupos"
      subtitle="Administra y descubre comunidades."
      searchPlaceholder="Buscar grupos por interés..."
      searchValue={searchQuery}
      onSearchChange={setSearchQuery}
      showBack={true}
    >
      <Carrusel
        title="Mis Grupos"
        items={misGrupos}
        renderItem={renderMyGroupCard}
        onAddNew={() => router.push('/(tabs)/grupos/create' as any)}
        addNewLabel="Crear Nuevo"
      />

      <SeccionLista
        title="Descubrir Nuevos Grupos"
        items={filteredDiscoverGroups}
        renderItem={renderDiscoverGroupCard}
        layout="grid"
        emptyState={emptyState}
      />

      <PostContainer
        title="Últimas Publicaciones"
        posts={latestPosts}
        onViewAll={latestPosts[0] ? () => router.push(`/feed/search?id=${latestPosts[0].group_id || latestPosts[0].channel_id}&from=group` as any) : undefined}
      />

      {/* Modal de Onboarding y Selección de Plan */}
      <Modal
        visible={showOnboarding}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOnboarding(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-background border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
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
                    <View className="bg-background/50 border border-zinc-850 p-4 rounded-2xl mb-4">
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
                        className="bg-background border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
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
                        className="bg-background border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
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
                            className={`p-3.5 rounded-2xl border flex-row justify-between items-center ${selectedPlanId === plan.id
                                ? 'bg-secondary/15 border-secondary'
                                : 'bg-background border-zinc-800'
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
                    className="flex-1 bg-background border border-zinc-800 py-3.5 rounded-2xl items-center"
                  >
                    <Text className="text-foreground font-bold text-xs">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleJoinSubmit}
                    disabled={loadingOnboarding || !experience}
                    className="flex-1 bg-primary py-3.5 rounded-2xl items-center justify-center flex-row gap-2"
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

