import React, { useState, useRef } from 'react';
import { View, Image, TouchableOpacity, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Text } from 'react-native';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react-native';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';

interface PostMediaCarouselProps {
  mediaUrls: string[];
  mediaType?: 'photo' | 'video';
  onMediaPress?: (index: number) => void;
  height?: number; // Default 192
  resizeMode?: 'cover' | 'contain';
}

export default function PostMediaCarousel({
  mediaUrls,
  mediaType = 'photo',
  onMediaPress,
  height = 192,
  resizeMode = 'cover'
}: PostMediaCarouselProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isDesktop } = useDevicePlatform();

  if (!mediaUrls || mediaUrls.length === 0) return null;

  const screenWidth = Dimensions.get('window').width;
  const initialWidth = screenWidth - 80; // approximate width based on layout
  const widthToUse = layoutWidth > 0 ? layoutWidth : initialWidth;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (widthToUse === 0) return;
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / widthToUse);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex - 1) * widthToUse, animated: true });
    }
  };

  const handleNext = () => {
    if (currentIndex < mediaUrls.length - 1) {
      scrollViewRef.current?.scrollTo({ x: (currentIndex + 1) * widthToUse, animated: true });
    }
  };

  const handleDotPress = (index: number) => {
    scrollViewRef.current?.scrollTo({ x: index * widthToUse, animated: true });
    // setCurrentIndex(index); // This will update via onScroll anyway
  };

  return (
    <View
      className="w-full relative"
      onLayout={(e) => setLayoutWidth(e.nativeEvent.layout.width)}
    >
      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
            scrollEventThrottle={16}
            className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-black"
          >
            {mediaUrls.map((url, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => onMediaPress?.(index)}
                style={{ width: widthToUse, height }}
                className="relative overflow-hidden"
              >
                {mediaType === 'photo' ? (
                  <Image source={{ uri: url }} className="w-full h-full" resizeMode={resizeMode} />
                ) : (
                  <View className="w-full h-full justify-center items-center relative bg-black">
                    <Image source={{ uri: url }} className="absolute inset-0 opacity-40" resizeMode={resizeMode} />
                    <View className="bg-primary/90 w-14 h-14 rounded-full items-center justify-center shadow-lg border border-primary-400/50">
                      <Play size={24} color="white" fill="white" className="ml-1" />
                    </View>
                    <View className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded">
                      <Text className="text-white text-[10px] font-bold">0:15</Text>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Botones de desplazamiento (Desktop/Web style) */}
          {mediaUrls.length > 1 && isDesktop && (
            <>
              <TouchableOpacity
                onPress={handlePrev}
                disabled={currentIndex === 0}
                className={`absolute left-2 top-1/2 -mt-4 w-8 h-8 rounded-full bg-black/60 items-center justify-center border border-white/10 ${currentIndex === 0 ? 'opacity-30' : 'opacity-100'}`}
                style={{ zIndex: 10 }}
              >
                <ChevronLeft size={20} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleNext}
                disabled={currentIndex === mediaUrls.length - 1}
                className={`absolute right-2 top-1/2 -mt-4 w-8 h-8 rounded-full bg-black/60 items-center justify-center border border-white/10 ${currentIndex === mediaUrls.length - 1 ? 'opacity-30' : 'opacity-100'}`}
                style={{ zIndex: 10 }}
              >
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            </>
          )}

          {/* Indicadores (Dots) */}
          {mediaUrls.length > 1 && (
            <View className="flex-row justify-center items-center gap-2 mt-3 absolute bottom-[-18px] left-0 right-0">
              {mediaUrls.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleDotPress(i)}
                  className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-primary' : 'bg-zinc-600'}`}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                />
              ))}
            </View>
          )}
        </View>
      {/* Espacio para los dots si existen */}
      {mediaUrls.length > 1 && <View className="h-4" />}
    </View>
  );
}
