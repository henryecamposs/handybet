import { create } from 'zustand';

interface NavigationState {
  /** Pila de rutas visitadas anteriormente */
  historyStack: string[];
  /** 
   * Agrega la ruta actual al historial antes de navegar a una nueva pantalla.
   */
  pushToHistory: (currentRoute: string) => void;
  /** 
   * Saca la última ruta de la pila y la devuelve. Ideal para hacer "back".
   */
  popFromHistory: () => string | null;
  /**
   * Limpia todo el historial. Útil al cerrar sesión o ir al inicio.
   */
  clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  historyStack: [],
  pushToHistory: (currentRoute) => set((state) => ({ 
    historyStack: [...state.historyStack, currentRoute] 
  })),
  popFromHistory: () => {
    const history = get().historyStack;
    if (history.length === 0) return null;
    
    const newHistory = [...history];
    const previousRoute = newHistory.pop() || null;
    set({ historyStack: newHistory });
    
    return previousRoute;
  },
  clearHistory: () => set({ historyStack: [] }),
}));
