import { create } from 'zustand';

export type ToastVariant = 'default' | 'primary' | 'secondary' | 'muted' | 'danger' | 'info' | 'warning' | 'success';
export type ToastSize = 'sm' | 'md' | 'lg';
export type ToastPosition = 'top' | 'bottom' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastAction {
  label: string;
  onPress: () => void;
}

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  size?: ToastSize;
  position?: ToastPosition;
  avatar?: string;
  action?: ToastAction;
  duration?: number; // ms. 0 means infinite
}

interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = {
      ...toastProps,
      id,
      variant: toastProps.variant || 'default',
      size: toastProps.size || 'md',
      position: toastProps.position || 'bottom',
      duration: toastProps.duration !== undefined ? toastProps.duration : 3500,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    return id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  clearToasts: () => set({ toasts: [] }),
}));
