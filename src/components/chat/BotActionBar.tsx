import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bot, Sparkles, ShoppingCart, Play, Dices } from 'lucide-react-native';
import { CopilotMode } from '../../types/chat';
import { useBrandColors } from '@/hooks/useThemeColors';

interface BotActionBarProps {
  copilotMode: CopilotMode;
  onToggleCopilotMode: (mode: CopilotMode) => void;
  onSelectCommand: (command: string) => void;
}

export default function BotActionBar({
  copilotMode,
  onToggleCopilotMode,
  onSelectCommand
}: BotActionBarProps) {
  const brandColors = useBrandColors();

  // Todos los comandos utilizan exclusivamente el prefijo `@` para mayor facilidad en móviles
  const quickCommands = [
    { label: '@start', icon: Play, desc: 'Iniciar Asistente' },
    { label: '@comprar', icon: ShoppingCart, desc: 'Catálogo de Ventas ERP' },
    { label: '@apostar', icon: Dices, desc: 'Bot de Apuestas y Loterías' }
  ];

  return (
    <View className="bg-card/95 border-t border-border px-3 py-2">
      {/* Fila 1: Botones de Comandos Rápidos con Prefijo @ */}
      <View className="flex-row items-center gap-2 mb-2 overflow-x-auto">
        <View className="flex-row items-center gap-1 bg-primary/10 px-2 py-1 rounded-md border border-primary/30">
          <Bot size={14} color={brandColors.primary} />
          <Text className="text-primary text-[10px] uppercase font-bold tracking-wider">Bot JSON Engine</Text>
        </View>

        {quickCommands.map((cmd) => {
          const Icon = cmd.icon;
          return (
            <TouchableOpacity
              key={cmd.label}
              onPress={() => onSelectCommand(cmd.label)}
              className="flex-row items-center gap-1.5 bg-background border border-border px-2.5 py-1 rounded-lg hover:border-primary transition-colors active:opacity-75"
            >
              <Icon size={12} color={brandColors.primary} />
              <Text className="text-foreground font-bold text-xs">{cmd.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Fila 2: Indicador de Modo Co-Piloto (Bot + Humano) */}
      <View className="flex-row items-center justify-between bg-background/50 px-2.5 py-1.5 rounded-lg border border-border/50">
        <View className="flex-row items-center gap-2">
          <Sparkles size={14} color={brandColors.secondary} />
          <Text className="text-xs text-muted-foreground font-medium">
            Modo Co-Piloto: <Text className="text-foreground font-bold uppercase">{copilotMode.replace('_', ' ')}</Text>
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            const nextMode: CopilotMode = copilotMode === 'copilot_hybrid' ? 'human_takeover' : 'copilot_hybrid';
            onToggleCopilotMode(nextMode);
          }}
          className="bg-primary/20 px-2 py-0.5 rounded border border-primary/40"
        >
          <Text className="text-primary text-[10px] font-bold uppercase">
            {copilotMode === 'copilot_hybrid' ? 'Intervenir (Solo Humano)' : 'Activar Co-Piloto'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
