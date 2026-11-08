import { create } from 'zustand';

interface HandyBetUniversalState {
  isScannerActive: boolean;
  activeTicketCode: string | null;
  currentBetDraft: any | null;
  mockSession: any | null; // Simula la sesión del usuario para no usar Supabase
  walletBalance: number;
  unlockedMediaIds: string[];
  setScannerActive: (isActive: boolean) => void;
  setActiveTicketCode: (code: string | null) => void;
  updateBetDraft: (data: any) => void;
  clearBetDraft: () => void;
  setMockSession: (user: any | null) => void;
  deductBalance: (amount: number) => boolean;
  addBalance: (amount: number) => void;
  unlockMedia: (mediaId: string, price: number) => boolean;
}

export const useHandyBetStore = create<HandyBetUniversalState>((set, get) => ({
  isScannerActive: false,
  activeTicketCode: null,
  currentBetDraft: null,
  mockSession: null,
  walletBalance: 250.0, // Saldo inicial para pruebas
  unlockedMediaIds: [],
  setScannerActive: (isActive) => set({ isScannerActive: isActive }),
  setActiveTicketCode: (code) => set({ activeTicketCode: code }),
  updateBetDraft: (data) => set((state) => ({ currentBetDraft: { ...state.currentBetDraft, ...data } })),
  clearBetDraft: () => set({ currentBetDraft: null }),
  setMockSession: (user) => set({
    mockSession: user,
    walletBalance: user?.wallet_balance ?? get().walletBalance
  }),
  deductBalance: (amount) => {
    const current = get().walletBalance;
    if (current >= amount) {
      set({ walletBalance: current - amount });
      return true;
    }
    return false;
  },
  addBalance: (amount) => set((state) => ({ walletBalance: state.walletBalance + amount })),
  unlockMedia: (mediaId, price) => {
    const current = get().walletBalance;
    if (current >= price) {
      set((state) => ({
        walletBalance: state.walletBalance - price,
        unlockedMediaIds: [...state.unlockedMediaIds, mediaId]
      }));
      return true;
    }
    return false;
  }
}));
