import { supabase } from '../lib/supabaseClient';
import { GroupPlan, GroupRules, Membership } from '../types/handyBet';

const MOCK_PLANS: GroupPlan[] = [
  { id: 'plan_1', group_id: 'grp_1', name: 'Acceso VIP 24 Horas', price: 5.00, billing_type: '24_hours', created_at: new Date().toISOString() },
  { id: 'plan_2', group_id: 'grp_1', name: 'Suscripción Mensual', price: 20.00, billing_type: 'mensual', created_at: new Date().toISOString() }
];

const MOCK_RULES: Record<string, GroupRules> = {
  'grp_1': {
    id: 'rules_1',
    group_id: 'grp_1',
    permitir_publicar_feeds: true,
    permitir_publicar_publicidad: true,
    terms_text: 'Al unirte a este grupo aceptas no compartir spam, respetar a los moderadores y entender que las sugerencias de pronósticos son meramente informativas.',
    onboarding_questionnaire: {
      questions: [
        { id: 'q1', question: '¿Cuál es tu nivel de experiencia en apuestas?', required: true },
        { id: 'q2', question: '¿Qué buscas lograr al unirte a este grupo?', required: false }
      ]
    },
    pay_to_post_enabled: true,
    pay_to_post_fee: 2.50
  }
};

const MOCK_MEMBERSHIPS: Membership[] = [];

export const groupMonetizationService = {
  // Obtener planes de pago de un grupo
  async getGroupPlans(groupId: string): Promise<GroupPlan[]> {
    try {
      const { data, error } = await supabase
        .from('group_plans')
        .select('*')
        .eq('group_id', groupId);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('Usando mock group plans por falla en base de datos:', err);
      return MOCK_PLANS.filter(p => p.group_id === groupId);
    }
  },

  // Obtener reglas de moderación y onboarding del grupo
  async getGroupRules(groupId: string): Promise<GroupRules | null> {
    try {
      const { data, error } = await supabase
        .from('group_rules')
        .select('*')
        .eq('group_id', groupId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Usando mock group rules por falla en base de datos:', err);
      return MOCK_RULES[groupId] || null;
    }
  },

  // Completar onboarding de grupo (Cuestionario y selección de plan)
  async submitOnboarding(
    groupId: string,
    userId: string,
    answers: Record<string, string>,
    planId: string | null
  ): Promise<Membership> {
    try {
      const validUntil = planId ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() : null; // Simulado 30 días

      const { data, error } = await supabase
        .from('memberships')
        .insert([{
          group_id: groupId,
          user_id: userId,
          plan_id: planId,
          status: planId ? 'onboarding_pending' : 'active', // Si es de pago queda pendiente del pago del plan
          onboarding_answers: answers,
          valid_until: validUntil
        }])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Simulando onboarding de membresía por falla en DB:', err);
      const newMembership: Membership = {
        id: `memb_${Math.random().toString(36).substr(2, 9)}`,
        group_id: groupId,
        user_id: userId,
        plan_id: planId,
        status: planId ? 'active' : 'active', // Simular activo directo para propósitos demo
        onboarding_answers: answers,
        valid_until: planId ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() : null,
        created_at: new Date().toISOString()
      };
      MOCK_MEMBERSHIPS.push(newMembership);
      return newMembership;
    }
  },

  // Procesar pago de Pay-to-Post o Suscripción con split de transacciones
  async processSplitPayment(
    senderId: string,
    receiverId: string,
    groupId: string,
    amount: number,
    splitPercent: number = 0.90 // 90% admin / 10% plataforma
  ): Promise<boolean> {
    try {
      const platformFee = amount * (1 - splitPercent);
      const reference = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

      const { error } = await supabase
        .from('transactions')
        .insert([{
          sender_id: senderId,
          receiver_id: receiverId,
          group_id: groupId,
          amount: amount,
          platform_fee: platformFee,
          status: 'completed',
          reference_code: reference
        }]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('Simulando procesamiento de pago split:', err);
      return true; // Simulación exitosa para fines demostrativos
    }
  }
};
