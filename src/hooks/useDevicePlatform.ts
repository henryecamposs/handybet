import { useWindowDimensions, Platform } from 'react-native';

export function useDevicePlatform() {
  const { width } = useWindowDimensions();

  // Determinar la plataforma base
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  const isWeb = Platform.OS === 'web';
  
  // En web, consideramos "móvil" si el ancho es menor a 768px (breakpoint estándar 'md' de Tailwind)
  const isWebMobile = isWeb && width < 768;
  const isWebDesktop = isWeb && width >= 768;

  return {
    isNative, // true si corre nativamente en iOS/Android
    isWeb,    // true si corre en el navegador web
    isWebMobile,  // true si es web y el ancho simula un teléfono/tablet pequeña
    isWebDesktop, // true si es web y el ancho es de escritorio
    
    // Flag consolidado: true si es la app nativa O si es web vista en pantalla pequeña
    isMobile: isNative || isWebMobile,
    // Flag consolidado: true si es escritorio
    isDesktop: isWebDesktop,
  };
}
