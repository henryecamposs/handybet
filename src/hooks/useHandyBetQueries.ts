import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { localDB } from '../lib/localDB';
import { Bet, MediaVaultItem } from '../types/handyBet';

// 1. Query: Obtener apuesta por betCode (usado por el cajero en taquilla)
export function useGetBetByCode(betCode: string | null) {
  return useQuery({
    queryKey: ['bet', betCode],
    queryFn: async (): Promise<Bet> => {
      if (!betCode) throw new Error('El código de la apuesta no es válido.');

      const allBets = await localDB.bets.getAll();
      const found = allBets.find(b => b.bet_code === betCode);

      if (!found) throw new Error('Apuesta no encontrada.');
      return found as Bet;
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
      const allBets = await localDB.bets.getAll();
      const betIdx = allBets.findIndex(b => b.bet_code === betCode);
      if (betIdx === -1) throw new Error('Apuesta no encontrada.');
      
      const bet = allBets[betIdx];
      
      // Deduct wallet balance if payment method is wallet
      if (paymentMethod === 'wallet') {
        const user = await localDB.users.getById(bet.user_id);
        if (user) {
          if (user.wallet_balance < bet.amount) {
            throw new Error('Saldo insuficiente en la wallet del usuario.');
          }
          user.wallet_balance -= bet.amount;
          await localDB.users.update(user.id, { wallet_balance: user.wallet_balance });
        }
      }

      await localDB.bets.update(bet.id, {
        status: 'confirmada',
        payment_proof_url: referenceCode || null,
        processed_by: 'usr_pedro' // Mocked cashier
      });

      return true;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries de la apuesta y wallets asociadas
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betCode] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}

// 3. Query: Obtener colección de media de un grupo
export function useGetMediaVault(groupId: string) {
  return useQuery({
    queryKey: ['mediaVault', groupId],
    queryFn: async (): Promise<MediaVaultItem[]> => {
      // 1. Obtener los ítems de la bóveda
      const allMedia = await localDB.media_vault.getAll();
      const mediaItems = allMedia.filter(m => m.group_id === groupId);

      // 2. Obtener las suscripciones activas del usuario actual (mock usr_henry por defecto)
      const userId = 'usr_henry';
      const allSubs = await localDB.user_subscriptions.getAll();
      const userSubs = allSubs.filter(s => s.user_id === userId && s.is_active);
      const activePlanIds = userSubs.map(s => s.plan_id);

      // 3. Aplicar ofuscación en cliente de storage_url si no tiene suscripción activa
      const processedItems = mediaItems.map((item: any) => {
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

// 4. Mutation: Suscribirse a un plan de contenido
export function useSubscribeToMediaPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planId: string) => {
      const userId = 'usr_henry';
      
      // Find plan details to get price
      const allChannels = await localDB.channels.getAll();
      let price = 0;
      for (const channel of allChannels) {
        const plan = channel.plans?.find((p: any) => p.id === planId);
        if (plan) {
          price = plan.price;
          break;
        }
      }

      const user = await localDB.users.getById(userId);
      if (user && user.wallet_balance < price) {
        throw new Error('Saldo insuficiente en tu wallet.');
      }

      if (user) {
        user.wallet_balance -= price;
        await localDB.users.update(userId, { wallet_balance: user.wallet_balance });
      }

      await localDB.user_subscriptions.insert({
        id: localDB.generateId('sub'),
        user_id: userId,
        plan_id: planId,
        is_active: true,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      });

      return true;
    },
    onSuccess: () => {
      // Invalidar suscripciones del usuario y balance de wallets
      queryClient.invalidateQueries({ queryKey: ['user_subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      queryClient.invalidateQueries({ queryKey: ['mediaVault'] });
    },
  });
}

// 5. Mutation: Liquidar y pagar premios de apuestas
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
      const allBets = await localDB.bets.getAll();
      const betIdx = allBets.findIndex(b => b.bet_code === betCode);
      if (betIdx === -1) throw new Error('Apuesta no encontrada.');

      const bet = allBets[betIdx];

      // Update bet status
      await localDB.bets.update(bet.id, {
        status: 'cobrada',
        payment_proof_url: paymentProof || null,
        processed_by: 'usr_pedro'
      });

      // If payout to wallet_credit, credit user's wallet
      if (payoutMethod === 'wallet_credit') {
        const user = await localDB.users.getById(bet.user_id);
        if (user) {
          user.wallet_balance = (user.wallet_balance || 0) + bet.potential_prize;
          await localDB.users.update(user.id, { wallet_balance: user.wallet_balance });
        }
      }

      // Add to prizes won collection
      await localDB.prizes.insert({
        id: localDB.generateId('prize'),
        user_id: bet.user_id,
        group_id: bet.group_id,
        title: '¡Premio de Apuesta Cobrado!',
        description: `Has cobrado ${bet.potential_prize} VES por tu jugada ganadora. Método: ${payoutMethod}.`,
        amount: bet.potential_prize,
        currency: 'VES',
        bet_code: bet.bet_code,
        status: 'cobrado',
        processed_by: 'usr_pedro',
        created_at: new Date().toISOString()
      });

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bet', variables.betCode] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
}
