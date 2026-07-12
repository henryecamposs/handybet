import React from 'react';
import { View, Text, Image, StyleProp, ViewStyle, TextStyle } from 'react-native';
import logoImg from '../../assets/images/logo.png';

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl';
export type LogoLayout = 'horizontal' | 'vertical';

interface LogoProps {
  size?: LogoSize;
  layout?: LogoLayout;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showText?: boolean;
  showImage?: boolean;
}

export default function Logo({ 
  size = 'md', 
  layout = 'horizontal', 
  style,
  textStyle,
  showText = true,
  showImage = true 
}: LogoProps) {
  
  const getImgSize = () => {
    switch (size) {
      case 'sm': return { width: 32, height: 32 };
      case 'lg': return { width: 70, height: 70 };
      case 'xl': return { width: 100, height: 100 };
      case 'md':
      default: return { width: 48, height: 48 };
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-lg';
      case 'lg': return 'text-3xl';
      case 'xl': return 'text-5xl';
      case 'md':
      default: return 'text-2xl';
    }
  };

  const isHorizontal = layout === 'horizontal';

  return (
    <View 
      className={`${isHorizontal ? 'flex-row items-center gap-2' : 'flex-col items-center justify-center'}`}
      style={style}
    >
      {showImage && (
        <Image 
          source={logoImg} 
          style={getImgSize()} 
          resizeMode="contain" 
        />
      )}
      {showText && (
        <Text 
          className={`${getTextSize()} font-normal text-zinc-400 tracking-tight ${!isHorizontal ? 'mt-2 text-center' : ''}`}
          style={textStyle}
        >
          Handy<Text className="text-secondary font-bold">Bet</Text>
        </Text>
      )}
    </View>
  );
}
