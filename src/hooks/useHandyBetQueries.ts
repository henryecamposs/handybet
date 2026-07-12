import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { Bet, MediaVaultItem } from '../types/handyBet';

// 1. Query: Obtener apuesta por betCode (usado por el cajero en taquilla)
export function useGetBetByCode(betCode: string | null) {
  return useQuery({
    queryKey: ['bet', betCode],
    queryFn: async (): Promise<Bet> => {
      if (!betCode) throw new Error('El código de la apuesta no es válido.');

      const { data, error } = await supabase
        .from('bets')
        .select('*')
        .eq('bet_code', betCode)
        .single();

      if (error) throw new Error(error.message);
      return data as Bet;
    },
    enabled: !!betCode,
  });
}

// 2. Mutation: Confirmar apuesta QR (ejecuta RPC confirm_bet_cashier)
export function useConfirmQRBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      betCode,
      paymentMethod,
      referenceCode,
    }: {
      betCode: string;
      paymentMethod: 'wallet' | 'cash_external';
      referenceCode?: string;
    }) => {
      const { data, error } = await supabase.rpc('confirm_bet_cashier', {
        p_bet_code: betCode,
        p_payment_method: paymentMethod,
        p_reference_code: referenceCode || null,
      });

      if (error) throw new Error(error.message);
      return data as boolean;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries de la apuesta y wallets asociadas
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betCode] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

// 3. Query: Obtener colección de media de un grupo (aplica unión lógica y ofuscación de storage_url)
export function useGetMediaVault(groupId: string) {
  return useQuery({
    queryKey: ['mediaVault', groupId],
    queryFn: async (): Promise<MediaVaultItem[]> => {
      // 1. Obtener los ítems de la bóveda
      const { data: mediaItems, error: mediaError } = await supabase
        .from('media_vault')
        .select('*')
        .eq('group_id', groupId);

      if (mediaError) throw new Error(mediaError.message);

      // 2. Obtener las suscripciones activas del usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return mediaItems || [];

      const { data: subs, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('plan_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (subsError) throw new Error(subsError.message);
      const activePlanIds = (subs || []).map(s => s.plan_id);

      // 3. Aplicar ofuscación en cliente de storage_url si no tiene suscripción activa
      const processedItems = (mediaItems || []).map((item: any) => {
        const requiresPlan = item.plan_id !== null;
        const hasAccess = !requiresPlan || activePlanIds.includes(item.plan_id);
        
        return {
          ...item,
          storage_url: hasAccess ? item.storage_url : '', // Ofuscación de URL real en cliente
        } as MediaVaultItem;
      });

      return processedItems;
    },
    enabled: !!groupId,
  });
}

// 4. Mutation: Suscribirse a un plan de contenido (ejecuta RPC purchase_media_subscription)
export function useSubscribeToMediaPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const { data, error } = await supabase.rpc('purchase_media_subscription', {
        p_plan_id: planId,
      });

      if (error) throw new Error(error.message);
      return data as boolean;
    },
    onSuccess: () => {
      // Invalidar suscripciones del usuario y balance de wallets
      queryClient.invalidateQueries({ queryKey: ['user_subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['mediaVault'] });
    },
  });
}

// 5. Mutation: Liquidar y pagar premios de apuestas (ejecuta RPC payout_bet_cashier)
export function usePayoutQRBet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      betCode,
      payoutMethod,
      paymentProof,
    }: {
      betCode: string;
      payoutMethod: 'wallet_credit' | 'pago_movil';
      paymentProof?: string;
    }) => {
      const { data, error } = await supabase.rpc('payout_bet_cashier', {
        p_bet_code: betCode,
        p_payout_method: payoutMethod,
        p_payment_proof: paymentProof || null,
      });

      if (error) throw new Error(error.message);
      return data as boolean;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betCode] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

