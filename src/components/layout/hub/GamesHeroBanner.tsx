import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { Trophy, Gamepad2, Flame, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import IconButton from '@/components/ui/IconButton';
import { useThemeColors } from '@/hooks/useThemeColors';

export default function GamesHeroBanner() {
  const router = useRouter();
  const colors = useThemeColors();
  const scrollViewRef = useRef<ScrollView>(null);

  const [scrollProgress, setScrollProgress] = useState(0); // 0 a 1
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  const currentScrollX = useRef(0);

  // Monitoreo del desplazamiento
  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
      currentScrollX.current = contentOffset.x;

      const maxScroll = contentSize.width - layoutMeasurement.width;
      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, contentOffset.x / maxScroll));
        setScrollProgress(progress);
        setCanScrollLeft(contentOffset.x > 15);
        setCanScrollRight(contentOffset.x < maxScroll - 15);
      }
    },
    []
  );

  // Desplazamiento suave con botones de flecha
  const scrollByAmount = useCallback((offset: number) => {
    if (!scrollViewRef.current) return;
    const targetX = Math.max(0, currentScrollX.current + offset);
    scrollViewRef.current.scrollTo({ x: targetX, animated: true });
  }, []);

  // Clic en la barra de desplazamiento (Scroll Track)
  const handleTrackClick = useCallback(
    (e: any) => {
      if (trackWidth <= 0 || !scrollViewRef.current) return;

      // Obtener coordenada relativa del clic
      const nativeEvent = e.nativeEvent || e;
      const clickX =
        typeof nativeEvent.locationX === 'number'
          ? nativeEvent.locationX
          : nativeEvent.offsetX || 0;

      const percentage = Math.min(1, Math.max(0, clickX / trackWidth));
      const maxScroll = contentWidth - containerWidth;

      if (maxScroll > 0) {
        const targetX = percentage * maxScroll;
        scrollViewRef.current.scrollTo({ x: targetX, animated: true });
      }
    },
    [trackWidth, contentWidth, containerWidth]
  );

  // Soporte para rueda de ratón horizontal en Desktop Web
  const handleWheel = useCallback(
    (e: any) => {
      if (Platform.OS === 'web' && scrollViewRef.current && e?.deltaY) {
        const step = e.deltaY * 1.5;
        const targetX = Math.max(0, currentScrollX.current + step);
        scrollViewRef.current.scrollTo({ x: targetX, animated: false });
      }
    },
    []
  );

  // Cálculo del tamaño y posición del Thumb en la barra
  const thumbWidthRatio = contentWidth > 0 ? Math.min(0.5, Math.max(0.2, containerWidth / contentWidth)) : 0.3;
  const thumbWidth = trackWidth * thumbWidthRatio;
  const maxThumbTranslate = trackWidth - thumbWidth;
  const thumbTranslateX = scrollProgress * (maxThumbTranslate > 0 ? maxThumbTranslate : 0);

  return (
    <View className="mb-6 mt-2 relative">
      {/* Contenedor del Carrusel con Botones de Navegación Flotantes */}
      <View
        className="relative"
        onLayout={(e: LayoutChangeEvent) => setContainerWidth(e.nativeEvent.layout.width)}
        {...(Platform.OS === 'web' ? { onWheel: handleWheel } : {})}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(w) => setContentWidth(w)}
          className="flex-row rounded-2xl"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {/* Tarjeta 1: Gran Kino Imaginario */}
          <View className="w-[85vw] md:w-[580px] bg-primary/20 p-6 border border-border relative overflow-hidden justify-center mr-4 rounded-2xl">
            <View className="bg-primary px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-black font-bold text-xs uppercase">Sorteo Activo</Text>
            </View>
            <Text className="text-primary font-black text-3xl mb-2">Gran Kino Imaginario</Text>
            <Text className="text-foreground font-medium mb-4">¡Gana hasta 5,000 Puntos hoy a las 8:00 PM!</Text>
            <View className="self-start">
              <IconButton
                label="Jugar Ahora"
                onPress={() => router.push('/games/d1' as any)}
                variant="primary"
                rounded="full"
                hasBorder={false}
              />
            </View>
            <Trophy size={130} color="rgba(202, 238, 38, 0.2)" className="absolute right-4 bottom-4 z-0 pointer-events-none" />
          </View>

          {/* Tarjeta 2: Bingo Mega X */}
          <View className="w-[85vw] md:w-[580px] bg-secondary/20 p-6 border border-border relative overflow-hidden justify-center mr-4 rounded-2xl">
            <View className="bg-secondary px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-white font-bold text-xs uppercase">Nuevo</Text>
            </View>
            <Text className="text-secondary font-black text-3xl mb-2">Bingo Mega X</Text>
            <Text className="text-foreground font-medium mb-4">Cartones desde 5.00 Bs. ¡Participa ya!</Text>
            <View className="self-start">
              <IconButton
                label="Comprar Cartón"
                onPress={() => router.push('/games/d6' as any)}
                variant="secondary"
                rounded="full"
                hasBorder={false}
              />
            </View>
            <Gamepad2 size={130} color="rgba(16, 185, 129, 0.2)" className="absolute right-4 bottom-4 z-0 pointer-events-none" />
          </View>

          {/* Tarjeta 3: Quiniela Champions VIP */}
          <View className="w-[85vw] md:w-[580px] bg-amber-500/20 p-6 border border-border relative overflow-hidden justify-center mr-4 rounded-2xl">
            <View className="bg-amber-400 px-3 py-1 rounded-full self-start mb-3">
              <Text className="text-black font-bold text-xs uppercase">Pozo Acumulado</Text>
            </View>
            <Text className="text-amber-400 font-black text-3xl mb-2">Quiniela Champions</Text>
            <Text className="text-foreground font-medium mb-4">¡Pozo acumulado de 15,000 Puntos! Cierra en 2 horas.</Text>
            <View className="self-start">
              <IconButton
                label="Pronosticar"
                onPress={() => router.push('/games/d3' as any)}
                variant="primary"
                rounded="full"
                hasBorder={false}
              />
            </View>
            <Flame size={130} color="rgba(251, 191, 36, 0.2)" className="absolute right-4 bottom-4 z-0 pointer-events-none" />
          </View>
        </ScrollView>

        {/* Botón Flecha Izquierda (Flotante) */}
        {canScrollLeft && (
          <TouchableOpacity
            onPress={() => scrollByAmount(-450)}
            activeOpacity={0.8}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-md items-center justify-center shadow-lg z-20 hover:bg-black/80"
          >
            <ChevronLeft size={22} color="#ffffff" />
          </TouchableOpacity>
        )}

        {/* Botón Flecha Derecha (Flotante) */}
        {canScrollRight && (
          <TouchableOpacity
            onPress={() => scrollByAmount(450)}
            activeOpacity={0.8}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 backdrop-blur-md items-center justify-center shadow-lg z-20 hover:bg-black/80"
          >
            <ChevronRight size={22} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* 🟢 BARRA DE DESPLAZAMIENTO (SCROLL TRACK Y THUMB INTERACTIVO) */}
      <View className="flex-row items-center justify-between mt-3 px-1">
        {/* Pista de Scroll (Track) */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTrackClick}
          onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
          className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden cursor-pointer"
        >
          {/* Thumb de Desplazamiento Verde/Primario */}
          <View
            style={{
              width: thumbWidth > 0 ? thumbWidth : 60,
              transform: [{ translateX: thumbTranslateX }],
            }}
            className="h-full bg-primary rounded-full shadow-sm"
          />
        </TouchableOpacity>

        {/* Mini Controles de flechas discretos */}
        <View className="flex-row items-center gap-1.5 ml-3">
          <TouchableOpacity
            onPress={() => scrollByAmount(-350)}
            disabled={!canScrollLeft}
            className={`w-6 h-6 rounded-full items-center justify-center border border-white/10 ${
              canScrollLeft ? 'bg-card/80 opacity-100 hover:bg-white/20' : 'bg-transparent opacity-30'
            }`}
          >
            <ChevronLeft size={14} color={canScrollLeft ? colors.foreground : '#71717a'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => scrollByAmount(350)}
            disabled={!canScrollRight}
            className={`w-6 h-6 rounded-full items-center justify-center border border-white/10 ${
              canScrollRight ? 'bg-card/80 opacity-100 hover:bg-white/20' : 'bg-transparent opacity-30'
            }`}
          >
            <ChevronRight size={14} color={canScrollRight ? colors.foreground : '#71717a'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

