import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { betPayloadSchema } from '../../schemas/handyBet';
import { z } from 'zod';

interface BetMatrixBuilderProps {
  groupId: string;
  onBetGenerated?: (betData: any) => void;
}

const LOTTERIES = [
  { id: 'chance', name: 'Chance' },
  { id: 'triple-zulia', name: 'Triple Zulia' },
  { id: 'tachira', name: 'Táchira' },
];

const SCHEDULES = ['01:00 PM', '04:30 PM', '07:00 PM'];

const GAME_TYPES = [
  { id: 'triple', name: 'Triple' },
  { id: 'terminal', name: 'Terminal' },
  { id: 'animalito', name: 'Animalito' },
  { id: 'permuta', name: 'Permuta' },
] as const;

export default function BetMatrixBuilder({ groupId, onBetGenerated }: BetMatrixBuilderProps) {
  const { currentBetDraft, updateBetDraft } = useHandyBetStore();

  const [selectedLottery, setSelectedLottery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [gameType, setGameType] = useState<'triple' | 'terminal' | 'animalito' | 'permuta'>('triple');

  const [numInput, setNumInput] = useState('');
  const [multiplierInput, setMultiplierInput] = useState('10.00');
  const [selections, setSelections] = useState<{ number: string; multiplier: number }[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddSelection = () => {
    setValidationError(null);
    const num = numInput.trim();
    const mult = parseFloat(multiplierInput);

    if (!num || isNaN(mult) || mult <= 0) {
      setValidationError('Número y multiplicador válidos requeridos.');
      return;
    }

    if (gameType === 'terminal' && num.length !== 2) {
      setValidationError('Terminal requiere exactamente 2 dígitos.');
      return;
    }
    if (gameType === 'triple' && num.length !== 3) {
      setValidationError('Triple requiere exactamente 3 dígitos.');
      return;
    }

    setSelections([...selections, { number: num, multiplier: mult }]);
    setNumInput('');
  };

  const handleRemoveSelection = (index: number) => {
    setSelections(selections.filter((_, i) => i !== index));
  };

  const totalAmount = selections.reduce((acc, curr) => acc + curr.multiplier, 0);

  const handleGenerateBet = async () => {
    setValidationError(null);
    setIsSubmitting(true);

    const payload = {
      lotteryId: selectedLottery,
      schedule: selectedSchedule,
      gameType,
      selections,
      totalAmount,
    };

    try {
      // Validación estricta con Zod
      betPayloadSchema.parse(payload);

      updateBetDraft({ ...payload, groupId });
      if (onBetGenerated) {
        onBetGenerated(payload);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.issues[0]?.message || 'Datos de apuesta incorrectos.');
      } else {
        setValidationError('Error de validación desconocido.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="bg-background/90 p-6 rounded-3xl border border-zinc-800 shadow-xl max-w-lg w-full mx-auto my-4">
      <Text className="text-2xl font-black text-white mb-6 text-center tracking-tight">
        Confeccionar Jugada
      </Text>

      {/* Loterías */}
      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Lotería</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {LOTTERIES.map((lot) => (
          <TouchableOpacity
            key={lot.id}
            onPress={() => setSelectedLottery(lot.id)}
            className={`px-4 py-2.5 rounded-xl border ${selectedLottery === lot.id
              ? 'bg-primary/20 border-primary'
              : 'bg-background/80 border-zinc-700'
              }`}
          >
            <Text className={`font-bold text-sm ${selectedLottery === lot.id ? 'text-primary' : 'text-foreground'}`}>
              {lot.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Horario */}
      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Horario del Sorteo</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {SCHEDULES.map((time) => (
          <TouchableOpacity
            key={time}
            onPress={() => setSelectedSchedule(time)}
            className={`px-4 py-2.5 rounded-xl border ${selectedSchedule === time
              ? 'bg-primary/20 border-primary'
              : 'bg-background/80 border-zinc-700'
              }`}
          >
            <Text className={`font-bold text-sm ${selectedSchedule === time ? 'text-primary' : 'text-foreground'}`}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tipo de Juego */}
      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Modalidad</Text>
      <View className="flex-row flex-wrap gap-2 mb-4">
        {GAME_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => {
              setGameType(type.id);
              setSelections([]);
            }}
            className={`px-4 py-2.5 rounded-xl border ${gameType === type.id
              ? 'bg-primary/20 border-primary'
              : 'bg-background/80 border-zinc-700'
              }`}
          >
            <Text className={`font-bold text-sm ${gameType === type.id ? 'text-primary' : 'text-foreground'}`}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Inputs de Línea */}
      <View className="flex-row gap-2 mb-4">
        <View className="flex-1">
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Número</Text>
          <TextInput
            placeholder="Ej: 123"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={numInput}
            onChangeText={setNumInput}
            maxLength={3}
            className="bg-background/80 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold"
          />
        </View>
        <View className="flex-1">
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Monto (Bs.)</Text>
          <TextInput
            placeholder="10.00"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={multiplierInput}
            onChangeText={setMultiplierInput}
            className="bg-background/80 border border-zinc-700 rounded-xl px-4 py-3 text-white font-bold"
          />
        </View>
        <TouchableOpacity
          onPress={handleAddSelection}
          className="bg-secondary justify-center items-center px-6 rounded-xl mt-6 border border-secondary"
        >
          <Text className="text-foreground font-extrabold text-sm">+</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Selecciones */}
      {selections.length > 0 && (
        <View className="bg-background/60 p-4 rounded-2xl border border-zinc-800 mb-4">
          <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Líneas Jugadas</Text>
          {selections.map((sel, idx) => (
            <View key={idx} className="flex-row justify-between items-center py-2 border-b border-zinc-800/80">
              <Text className="text-foreground font-bold">
                {gameType.toUpperCase()} - <Text className="text-secondary text-base">{sel.number}</Text>
              </Text>
              <View className="flex-row items-center gap-3">
                <Text className="text-foreground font-bold">{sel.multiplier.toFixed(2)} Bs.</Text>
                <TouchableOpacity onPress={() => handleRemoveSelection(idx)}>
                  <Text className="text-rose-500 font-bold px-2 text-sm">Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View className="flex-row justify-between items-center pt-3 mt-1">
            <Text className="text-foreground font-bold">Total Apuesta:</Text>
            <Text className="text-secondary font-black text-lg">{totalAmount.toFixed(2)} Bs.</Text>
          </View>
        </View>
      )}

      {validationError && (
        <Text className="text-rose-500 text-xs font-bold text-center mb-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
          ⚠️ {validationError}
        </Text>
      )}

      {/* Botón de Generar Apuesta */}
      <TouchableOpacity
        onPress={handleGenerateBet}
        disabled={isSubmitting || selections.length === 0}
        className={`w-full py-4 rounded-2xl flex-row justify-center items-center ${selections.length === 0
          ? 'bg-background/80'
          : 'bg-primary active:scale-[0.98]'
          }`}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#0f172a" />
        ) : (
          <Text className={`font-black text-center text-base ${selections.length === 0 ? 'text-foreground' : 'text-foreground'}`}>
            Guardar y Generar Código QR
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
