import React from 'react';
import { View, Text } from 'react-native';
import { Bet } from '../../types/handyBet';

interface ThermalReceiptCardProps {
  bet: Bet;
}

export default function ThermalReceiptCard({ bet }: ThermalReceiptCardProps) {
  const formattedDate = new Date(bet.created_at).toLocaleString('es-VE', {
    timeZone: 'America/Caracas',
  });

  return (
    <View className="bg-neutral-50 p-6  shadow-lg border border-neutral-200/80 max-w-sm w-full mx-auto my-4 relative overflow-hidden">
      {/* Líneas simuladas de corte en los bordes superior/inferior */}
      <View className="absolute top-0 left-0 right-0 h-1.5 flex-row justify-around">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} className="w-2.5 h-1 bg-neutral-200 rotate-45 -translate-y-0.5" />
        ))}
      </View>

      {/* Cabecera del Ticket */}
      <View className="items-center border-b border-dashed border-neutral-300 pb-4 mb-4">
        <Text className="text-xl font-black text-neutral-800 tracking-widest font-mono">
          HANDYBET LOTERÍAS
        </Text>
        <Text className="text-xs font-bold text-neutral-500 tracking-wide font-mono mt-1">
          TICKET DE APUESTA
        </Text>
      </View>

      {/* Datos Generales */}
      <View className="space-y-1 mb-4 font-mono">
        <View className="flex-row justify-between">
          <Text className="text-neutral-500 text-xs font-bold font-mono">Código:</Text>
          <Text className="text-neutral-900 text-xs font-black font-mono">{bet.bet_code}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500 text-xs font-bold font-mono">Fecha/Hora:</Text>
          <Text className="text-neutral-900 text-xs font-black font-mono">{formattedDate}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500 text-xs font-bold font-mono">Lotería:</Text>
          <Text className="text-neutral-900 text-xs font-black font-mono uppercase">{bet.bet_data.lotteryId}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500 text-xs font-bold font-mono">Sorteo:</Text>
          <Text className="text-neutral-900 text-xs font-black font-mono">{bet.bet_data.schedule}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-neutral-500 text-xs font-bold font-mono">Tipo Juego:</Text>
          <Text className="text-neutral-900 text-xs font-black font-mono uppercase">{bet.bet_data.gameType}</Text>
        </View>
      </View>

      {/* Desglose de Jugadas */}
      <View className="border-t border-b border-dashed border-neutral-300 py-3 mb-4">
        <View className="flex-row justify-between mb-1.5">
          <Text className="text-neutral-500 text-xs font-black font-mono">NÚMERO</Text>
          <Text className="text-neutral-500 text-xs font-black font-mono">IMPORTE</Text>
        </View>
        {bet.bet_data.selections.map((sel, idx) => (
          <View key={idx} className="flex-row justify-between py-0.5">
            <Text className="text-neutral-800 font-black text-sm font-mono">{sel.number}</Text>
            <Text className="text-neutral-800 font-bold text-sm font-mono">
              {sel.multiplier.toFixed(2)} Bs.
            </Text>
          </View>
        ))}
      </View>

      {/* Total / Estado */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-neutral-800 font-black text-sm font-mono">TOTAL JUGADO:</Text>
        <Text className="text-neutral-900 font-black text-lg font-mono">
          {bet.amount.toFixed(2)} Bs.
        </Text>
      </View>

      {/* Estado del ticket */}
      <View className="items-center pt-2">
        <View className={`px-4 py-1.5 rounded-full border ${bet.status === 'confirmada' || bet.status === 'cobrada'
          ? 'bg-secondary border-secondary'
          : bet.status === 'pendiente'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-neutral-100 border-neutral-200'
          }`}>
          <Text className={`text-xs font-black uppercase font-mono ${bet.status === 'confirmada' || bet.status === 'cobrada'
            ? 'text-secondary'
            : bet.status === 'pendiente'
              ? 'text-amber-700'
              : 'text-neutral-600'
            }`}>
            {bet.status}
          </Text>
        </View>
      </View>

      {/* Líneas simuladas de corte en los bordes superior/inferior */}
      <View className="absolute bottom-0 left-0 right-0 h-1.5 flex-row justify-around">
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={i} className="w-2.5 h-1 bg-neutral-200 rotate-45 translate-y-0.5" />
        ))}
      </View>
    </View>
  );
}
