import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UploadCloud } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

interface FileDropzoneProps {
  onFilesSelected: (files: { uri: string; type: string }[]) => void;
  type: 'photo' | 'video' | 'mixed';
  maxFiles?: number;
}

export default function FileDropzone({ onFilesSelected, type, maxFiles = 5 }: FileDropzoneProps) {
  const colors = useThemeColors();

  const handlePress = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'photo' ? ImagePicker.MediaTypeOptions.Images : type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: maxFiles > 1,
      selectionLimit: maxFiles,
      quality: 1,
    });

    if (!result.canceled) {
      onFilesSelected(result.assets.map(asset => ({ uri: asset.uri, type: asset.type || 'image' })));
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-2xl h-48 justify-center items-center mb-6 hover:border-primary transition-colors"
    >
      <UploadCloud size={48} color={colors.primary} className="mb-4" />
      <Text className="text-white font-bold mb-1">Toca para abrir la galería</Text>
      <Text className="text-muted-foreground text-xs text-center px-4">
        Selecciona hasta {maxFiles} {type === 'photo' ? 'fotos' : type === 'video' ? 'videos' : 'archivos multimedia'}
      </Text>
    </TouchableOpacity>
  );
}
