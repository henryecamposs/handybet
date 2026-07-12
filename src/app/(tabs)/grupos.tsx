import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, Users, Plus, Compass } from 'lucide-react-native';
import { handyBetGroups } from '../../mockdata/handyBetMock';
import { useRouter } from 'expo-router';
import { Modal, ActivityIndicator } from 'react-native';
import { groupMonetizationService } from '../../services/groupMonetizationService';
import { Group, GroupPlan, GroupRules } from '../../types/handyBet';

export default function GruposScreen() {
  const router = useRouter();
  
  // Simulamos los grupos del usuario
  const [misGrupos, setMisGrupos] = useState<Group[]>(handyBetGroups.slice(0, 2) as any);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = useState(false);
  const [plans, setPlans] = useState<GroupPlan[]>([]);
  const [rules, setRules] = useState<GroupRules | null>(null);
  
  // Estado de respuestas del cuestionario
  const [experience, setExperience] = useState('');
  const [intentions, setIntentions] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

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

  return (
    <ScrollView className="flex-1 bg-zinc-950 px-4 pt-12" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-zinc-100 font-bold text-2xl">Grupos</Text>
          <Text className="text-zinc-400 text-sm mt-1">Administra y descubre comunidades.</Text>
        </View>
      </View>

      {/* Buscador */}
      <View className="bg-zinc-900 rounded-full flex-row items-center px-4 py-2 border border-zinc-800 mb-6">
        <Search size={20} color="#71717a" />
        <TextInput 
          placeholder="Buscar grupos por interés..." 
          placeholderTextColor="#71717a"
          className="flex-1 text-zinc-100 ml-3 outline-none"
        />
      </View>

      {/* Carrusel de Mis Grupos */}
      <View className="mb-8">
        <Text className="text-zinc-100 font-bold text-lg mb-4">Tus Grupos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {/* Botón de Crear Nuevo Grupo */}
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/grupos/create' as any)}
            className="w-32 h-36 bg-zinc-900 rounded-2xl border border-dashed border-zinc-700 items-center justify-center mr-4 hover:bg-zinc-800/80 transition-colors"
          >
            <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center mb-2">
              <Plus size={24} color="#caee26" />
            </View>
            <Text className="text-zinc-300 font-bold text-sm">Crear Nuevo</Text>
          </TouchableOpacity>

          {misGrupos.map((group: Group) => (
            <TouchableOpacity 
              key={group.id} 
              onPress={() => handleGroupClick(group)}
              className="w-32 h-36 bg-zinc-900 rounded-2xl border border-zinc-800 items-center justify-center mr-4 hover:bg-zinc-800/80 transition-colors"
            >
              <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center mb-2">
                <Users size={20} color="#d4d4d8" />
              </View>
              <Text className="text-zinc-100 font-bold text-center text-sm px-2" numberOfLines={2}>{group.name}</Text>
              <Text className="text-zinc-500 text-[10px] mt-1">{group.members?.length || 0} miembros</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Condicional de Contenido (Empty State o Descubrir) */}
      {misGrupos.length === 0 ? (
        <View className="flex-1 items-center justify-center py-20 mt-4">
          <Compass size={48} color="#52525b" className="mb-4" />
          <Text className="text-zinc-400 font-bold text-lg text-center">Aún no has creado grupos</Text>
          <Text className="text-zinc-500 text-sm text-center mt-2 max-w-[250px]">Crea tu propio grupo para conectar con amigos o descubre nuevas comunidades.</Text>
        </View>
      ) : (
        <View className="mb-8 mt-4">
          <Text className="text-zinc-100 font-bold text-lg mb-4">Descubrir Nuevos Grupos</Text>
          <View className="flex-row flex-wrap gap-4">
            {handyBetGroups.slice(2).map((group) => (
              <TouchableOpacity 
                key={group.id} 
                onPress={() => handleGroupClick(group as any)}
                className="w-[48%] bg-zinc-900 p-4 rounded-2xl border border-zinc-800 items-center justify-center hover:bg-zinc-800/80 transition-colors"
              >
                <View className="w-10 h-10 rounded-full bg-zinc-800 items-center justify-center mb-2 border border-zinc-700">
                  <Text className="text-lg">🌍</Text>
                </View>
                <Text className="text-zinc-100 font-bold text-center mb-1 text-sm">{group.name}</Text>
                <Text className="text-zinc-500 text-[10px]">{group.members?.length || 0} miembros</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {/* Modal de Onboarding y Selección de Plan */}
      <Modal
        visible={showOnboarding}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOnboarding(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-6">
          <View className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            {loadingOnboarding && !selectedGroup ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#caee26" />
                <Text className="text-zinc-400 text-xs font-bold mt-4">Cargando detalles del grupo...</Text>
              </View>
            ) : (
              <>
                <Text className="text-zinc-100 font-black text-xl mb-1">Unirse a {selectedGroup?.name}</Text>
                <Text className="text-zinc-500 text-xs font-bold mb-4">Completa el cuestionario de onboarding para acceder.</Text>

                <ScrollView className="max-h-[380px] mb-6" showsVerticalScrollIndicator={false}>
                  {/* Términos y Aviso Legal */}
                  {rules?.terms_text && (
                    <View className="bg-zinc-900/50 border border-zinc-850 p-4 rounded-2xl mb-4">
                      <Text className="text-zinc-300 font-bold text-xs mb-1.5 uppercase tracking-wider">Aviso Legal y Términos</Text>
                      <Text className="text-zinc-400 text-[11px] leading-4">{rules.terms_text}</Text>
                    </View>
                  )}

                  {/* Cuestionario de Intenciones */}
                  <View className="space-y-4 mb-4">
                    <View>
                      <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                        1. ¿Cuál es tu nivel de experiencia en apuestas?
                      </Text>
                      <TextInput
                        placeholder="Ej: Principiante, Intermedio, Experto"
                        placeholderTextColor="#71717a"
                        value={experience}
                        onChangeText={setExperience}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
                      />
                    </View>

                    <View>
                      <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
                        2. ¿Qué deseas hacer en el grupo?
                      </Text>
                      <TextInput
                        placeholder="Ej: Aprender, publicar pronósticos, etc."
                        placeholderTextColor="#71717a"
                        value={intentions}
                        onChangeText={setIntentions}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-xs font-bold"
                      />
                    </View>
                  </View>

                  {/* Selección de Planes */}
                  {plans.length > 0 && (
                    <View className="mb-2">
                      <Text className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Selecciona un Plan de Acceso</Text>
                      <View className="space-y-2">
                        {plans.map((plan: GroupPlan) => (
                          <TouchableOpacity
                            key={plan.id}
                            onPress={() => setSelectedPlanId(plan.id)}
                            className={`p-3.5 rounded-2xl border flex-row justify-between items-center ${
                              selectedPlanId === plan.id
                                ? 'bg-secondary/15 border-secondary'
                                : 'bg-zinc-900 border-zinc-800'
                            }`}
                          >
                            <View>
                              <Text className="text-zinc-150 text-xs font-black">{plan.name}</Text>
                              <Text className="text-zinc-500 text-[10px] font-bold uppercase mt-0.5">
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
                    className="flex-1 bg-zinc-900 border border-zinc-800 py-3.5 rounded-2xl items-center"
                  >
                    <Text className="text-zinc-400 font-bold text-xs">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleJoinSubmit}
                    disabled={loadingOnboarding || !experience}
                    className="flex-1 bg-primary py-3.5 rounded-2xl items-center justify-center flex-row gap-2"
                  >
                    {loadingOnboarding ? (
                      <ActivityIndicator size="small" color="#0f172a" />
                    ) : (
                      <Text className="text-zinc-900 font-black text-xs uppercase">Aceptar y Unirse</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
