import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Plus, X, Check, Sparkles } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';
import interestsData from '@/mockdata/interests.json';

export interface InterestChipsSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  label?: string;
  allowCustom?: boolean;
}

export default function InterestChipsSelector({
  selectedInterests = [],
  onChange,
  label = 'Intereses y Temas de Interés',
  allowCustom = true,
}: InterestChipsSelectorProps) {
  const colors = useThemeColors();
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const toggleInterest = (tag: string) => {
    if (selectedInterests.includes(tag)) {
      onChange(selectedInterests.filter((t) => t !== tag));
    } else {
      onChange([...selectedInterests, tag]);
    }
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedInterests.includes(trimmed)) {
      onChange([...selectedInterests, trimmed]);
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <View className="mb-4">
      {label ? (
        <View className="flex-row items-center gap-2 mb-2">
          <Sparkles size={16} color={colors.primary} />
          <Text className="text-foreground font-bold text-sm">{label}</Text>
        </View>
      ) : null}

      {/* Selected Custom / Dynamic Chips bar if any */}
      {selectedInterests.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-3 p-3 bg-card/60 border border-border rounded-xl">
          <Text className="w-full text-xs text-muted-foreground font-medium mb-1">
            Seleccionados ({selectedInterests.length}):
          </Text>
          {selectedInterests.map((interest) => (
            <TouchableOpacity
              key={interest}
              onPress={() => toggleInterest(interest)}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40"
            >
              <Check size={12} color={colors.primary} />
              <Text className="text-primary text-xs font-semibold">{interest}</Text>
              <X size={12} color={colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Categories & Presets Chips */}
      {interestsData.categories.map((cat) => (
        <View key={cat.id} className="mb-3">
          <Text className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {cat.name}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {cat.tags.map((tag) => {
              const isSelected = selectedInterests.includes(tag);
              return (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleInterest(tag)}
                  className={`px-3 py-1.5 rounded-full border transition-all ${
                    isSelected
                      ? 'bg-primary border-primary'
                      : 'bg-background/80 border-border hover:border-primary/50'
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isSelected ? 'text-primary-foreground font-bold' : 'text-foreground'
                    }`}
                  >
                    {isSelected ? `✓ ${tag}` : tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      {/* Add Custom Tag Section */}
      {allowCustom && (
        <View className="mt-2">
          {showCustomInput ? (
            <View className="flex-row items-center gap-2 mt-1">
              <TextInput
                value={customInput}
                onChangeText={setCustomInput}
                placeholder="Ej: Análisis Político, Fórmula 1..."
                placeholderTextColor={colors.mutedForeground}
                className="flex-1 bg-background border border-primary/50 text-foreground px-4 py-2.5 rounded-full text-xs"
                onSubmitEditing={handleAddCustom}
                autoFocus
              />
              <TouchableOpacity
                onPress={handleAddCustom}
                className="bg-primary px-3 py-2 rounded-xl"
              >
                <Text className="text-primary-foreground font-bold text-xs">Agregar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowCustomInput(false)}
                className="bg-muted p-2 rounded-xl"
              >
                <X size={14} color={colors.foreground} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setShowCustomInput(true)}
              className="flex-row items-center gap-1.5 self-start px-3 py-1.5 rounded-full bg-card border border-dashed border-primary/50"
            >
              <Plus size={14} color={colors.primary} />
              <Text className="text-primary text-xs font-bold">+ Otro tema/interés personalizado</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
