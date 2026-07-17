import React from 'react';
import { View, Text, ImageBackground } from 'react-native';

export interface HeroBannerProps {
  title: string;
  subtitle?: string;
  imageUri?: string;
  children?: React.ReactNode;
}

export default function HeroBanner({ title, subtitle, imageUri, children }: HeroBannerProps) {
  if (imageUri) {
    return (
      <ImageBackground
        source={{ uri: imageUri }}
        className="w-full h-40 rounded-3xl overflow-hidden justify-end p-4 mb-6"
      >
        <View className="absolute inset-0 bg-black/40" />
        <Text className="text-white font-black text-xl z-10">{title}</Text>
        {subtitle && <Text className="text-white/80 text-xs font-semibold mt-1 z-10">{subtitle}</Text>}
        {children}
      </ImageBackground>
    );
  }

  return (
    <View className="w-full bg-primary/5 border border-primary/20 p-6 rounded-3xl mb-6">
      <Text className="text-foreground font-black text-xl">{title}</Text>
      {subtitle && <Text className="text-muted-foreground text-xs font-medium mt-1">{subtitle}</Text>}
      {children}
    </View>
  );
}
