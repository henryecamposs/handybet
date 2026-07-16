import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useToastStore, ToastPosition } from '../../store/useToastStore';
import Toast from './Toast';

export default function ToastContainer() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    const pos = toast.position || 'bottom';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {} as Record<ToastPosition, typeof toasts>);

  const renderToastGroup = (position: ToastPosition, groupToasts: typeof toasts) => {
    if (!groupToasts || groupToasts.length === 0) return null;

    const getPositionClasses = () => {
      switch (position) {
        case 'top': return 'top-10 left-4 right-4 items-center';
        case 'bottom': return 'bottom-20 left-4 right-4 items-center';
        case 'top-left': return 'top-10 left-4 items-start';
        case 'top-right': return 'top-10 right-4 items-end';
        case 'bottom-left': return 'bottom-20 left-4 items-start';
        case 'bottom-right': return 'bottom-20 right-4 items-end';
        default: return 'bottom-20 left-4 right-4 items-center';
      }
    };

    return (
      <View key={position} className={`absolute z-[999] pointer-events-none flex-col ${getPositionClasses()}`}>
        {groupToasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </View>
    );
  };

  const positions: ToastPosition[] = ['top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return (
    <>
      {positions.map((pos) => renderToastGroup(pos, groupedToasts[pos]))}
    </>
  );
}
