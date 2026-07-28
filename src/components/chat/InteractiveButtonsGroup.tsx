import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { InteractiveButton } from '../../types/chat';

interface InteractiveButtonsGroupProps {
  buttons: InteractiveButton[];
  onPressButton: (button: InteractiveButton) => void;
  disabled?: boolean;
}

export default function InteractiveButtonsGroup({
  buttons,
  onPressButton,
  disabled = false
}: InteractiveButtonsGroupProps) {
  if (!buttons || buttons.length === 0) return null;

  const getVariantStyles = (variant?: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary border-primary text-black font-bold';
      case 'secondary':
        return 'bg-secondary border-border text-foreground font-semibold';
      case 'destructive':
        return 'bg-rose-500/20 border-rose-500/50 text-rose-400 font-bold';
      case 'outline':
      default:
        return 'bg-background/80 border-border text-foreground font-medium';
    }
  };

  return (
    <View className="mt-3 gap-2 w-full">
      {buttons.map((btn) => (
        <TouchableOpacity
          key={btn.id}
          onPress={() => onPressButton(btn)}
          disabled={disabled}
          className={`px-4 py-2.5 rounded-xl border flex-row items-center justify-center shadow-sm active:opacity-75 ${getVariantStyles(btn.variant)}`}
        >
          <Text className="text-xs text-center font-bold">{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
