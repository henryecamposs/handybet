import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type HandyAdsLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface HandyAdsLogoProps {
  size?: HandyAdsLogoSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  className?: string;
}

export default function HandyAdsLogo({
  size = 'md',
  style,
  textStyle,
  className = ''
}: HandyAdsLogoProps) {

  const getTextSize = () => {
    switch (size) {
      case 'xs': return 'text-sm';
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      case 'xl': return 'text-5xl';
      case 'md':
      default: return 'text-2xl';
    }
  };

  return (
    <View style={style} className={`flex-row items-center ${className}`}>
      <Text
        className={`${getTextSize()} font-normal text-white tracking-tight`}
        style={textStyle}
      >
        Handy<Text className="text-secondary font-bold">Ads</Text>
      </Text>
    </View>
  );
}
