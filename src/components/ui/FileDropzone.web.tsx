import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

interface FileDropzoneProps {
  onFilesSelected: (files: { uri: string; type: string; file?: File }[]) => void;
  type: 'photo' | 'video' | 'mixed';
  maxFiles?: number;
}

export default function FileDropzone({ onFilesSelected, type, maxFiles = 5 }: FileDropzoneProps) {
  const colors = useThemeColors();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const mapped = acceptedFiles.map(file => ({
      uri: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      file
    }));
    onFilesSelected(mapped);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: type === 'photo' ? { 'image/*': [] } : type === 'video' ? { 'video/*': [] } : { 'image/*': [], 'video/*': [] },
    maxFiles
  });

  return (
    <View
      {...getRootProps() as any}
      className={`bg-zinc-900 border-2 border-dashed  h-48 justify-center items-center mb-6 transition-colors cursor-pointer outline-none ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'}`}
    >
      <input {...getInputProps() as any} />
      <UploadCloud size={48} color={isDragActive ? '#fff' : colors.primary} className="mb-4" />
      <Text className="text-white font-bold mb-1">
        {isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos o haz clic para buscar'}
      </Text>
      <Text className="text-muted-foreground text-xs text-center px-4">
        JPG, PNG, GIF {type === 'video' || type === 'mixed' ? 'o MP4 ' : ''}(Max. {maxFiles} archivos)
      </Text>
    </View>
  );
}
