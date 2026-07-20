import React from 'react';
import { View, Image } from 'react-native';

interface HubCoverProps {
  variant?: 'primary' | 'muted' | 'custom' | 'image';
  imageUrl?: string;
  gradientClasses?: string;
  containerClasses?: string;
}

export default function HubCover({
  variant = 'muted',
  imageUrl,
  gradientClasses,
  containerClasses = ''
}: HubCoverProps) {
  let innerGradient = 'from-background to-card';

  if (variant === 'primary') {
    innerGradient = 'from-primary/10 to-background/50';
  } else if (variant === 'custom' && gradientClasses) {
    innerGradient = gradientClasses;
  }

  return (
    <View className={`h-44 bg-background/80 relative w-full border-b border-border-muted ${containerClasses}`}>
      {variant === 'image' && imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className={`absolute inset-0 bg-gradient-to-b ${innerGradient}`} />
      )}
    </View>
  );
}
