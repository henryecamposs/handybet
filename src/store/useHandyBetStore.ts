import { create } from 'zustand';

interface HandyBetUniversalState {
  isScannerActive: boolean;
  activeTicketCode: string | null;
  currentBetDraft: any | null;
  mockSession: any | null; // Simula la sesión del usuario para no usar Supabase
  setScannerActive: (isActive: boolean) => void;
  setActiveTicketCode: (code: string | null) => void;
  updateBetDraft: (data: any) => void;
  clearBetDraft: () => void;
  setMockSession: (user: any | null) => void;
}

export const useHandyBetStore = create<HandyBetUniversalState>((set) => ({
  isScannerActive: false,
  activeTicketCode: null,
  currentBetDraft: null,
  mockSession: null,
  setScannerActive: (isActive) => set({ isScannerActive: isActive }),
  setActiveTicketCode: (code) => set({ activeTicketCode: code }),
  updateBetDraft: (data) => set((state) => ({ currentBetDraft: { ...state.currentBetDraft, ...data } })),
  clearBetDraft: () => set({ currentBetDraft: null }),
  setMockSession: (user) => set({ mockSession: user }),
}));
