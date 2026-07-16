import { localDB } from '../lib/localDB';
import { GroupPlan, GroupRules, Membership } from '../types/handyBet';

export const groupMonetizationService = {
  // Obtener planes de pago de un grupo
  async getGroupPlans(groupId: string): Promise<GroupPlan[]> {
    const group = await localDB.groups.getById(groupId);
    if (!group) return [];
    return (group.plans || []).map((p: any) => ({
      ...p,
      group_id: groupId,
      created_at: group.created_at,
    }));
  },

  // Obtener reglas de moderación y onboarding del grupo
  async getGroupRules(groupId: string): Promise<GroupRules | null> {
    const group = await localDB.groups.getById(groupId);
    if (!group || !group.rules) return null;
    return {
      id: `rules_${groupId}`,
      group_id: groupId,
      ...group.rules,
      onboarding_questionnaire: group.rules.onboarding_questionnaire || { questions: [] },
    };
  },

  // Completar onboarding de grupo
  async submitOnboarding(
    groupId: string,
    userId: string,
    answers: Record<string, string>,
    planId: string | null
  ): Promise<Membership> {
    const validUntil = planId ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString() : null;

    const newMembership: Membership = {
      id: localDB.generateId('memb'),
      group_id: groupId,
      user_id: userId,
      plan_id: planId,
      status: 'active',
      onboarding_answers: answers,
      valid_until: validUntil,
      created_at: new Date().toISOString()
    };

    // Also add user to group members
    const group = await localDB.groups.getById(groupId);
    if (group && !group.members.includes(userId)) {
      group.members.push(userId);
      await localDB.groups.update(groupId, { members: group.members });
    }

    return newMembership;
  },

  // Procesar pago split
  async processSplitPayment(
    senderId: string,
    receiverId: string,
    groupId: string,
    amount: number,
    splitPercent: number = 0.90
  ): Promise<boolean> {
    // In local mode, just simulate success
    console.log(`[LocalDB] Split payment: ${senderId} -> ${receiverId}, amount: ${amount}, split: ${splitPercent}`);
    return true;
  },

  // Get all groups
  async getAllGroups(): Promise<any[]> {
    return localDB.groups.getAll();
  },

  // Get groups for a user
  async getUserGroups(userId: string): Promise<any[]> {
    const allGroups = await localDB.groups.getAll();
    return allGroups.filter((g: any) => g.members?.includes(userId));
  }
};
