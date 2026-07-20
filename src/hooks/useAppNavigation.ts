import { usePathname, useGlobalSearchParams, useRouter } from 'expo-router';
import { useNavigationStore } from '@/store/useNavigationStore';

export function useAppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const { pushToHistory, popFromHistory } = useNavigationStore();

  /**
   * Obtiene la ruta actual exacta (pathname + search params)
   */
  const getCurrentFullPath = () => {
    if (!pathname) return '/';
    
    const queryParams = Object.entries(params)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => `${key}=${encodeURIComponent(v)}`).join('&');
        }
        return `${key}=${encodeURIComponent(String(value))}`;
      })
      .filter(Boolean)
      .join('&');
      
    return queryParams ? `${pathname}?${queryParams}` : pathname;
  };

  /**
   * Navega hacia una nueva ruta guardando inteligentemente la ruta actual en el historial global.
   */
  const navigateTo = (route: string) => {
    const currentFullPath = getCurrentFullPath();
    pushToHistory(currentFullPath);
    router.push(route as any);
  };

  /**
   * Navega directamente sin guardar historial (útil para tabs principales)
   */
  const navigateDirect = (route: string) => {
    router.push(route as any);
  };

  /**
   * Reemplaza la ruta actual (no afecta el historial guardado)
   */
  const replaceRoute = (route: string) => {
    router.replace(route as any);
  };

  /**
   * Función inteligente para volver atrás. 
   * Extrae la última ruta visitada de Zustand y vuelve ahí exactamente.
   * Si no hay historial, hace un fallback seguro.
   */
  const goBack = (fallbackRoute: string = '/(tabs)/feed') => {
    const previousRoute = popFromHistory();
    
    if (previousRoute) {
      // Usamos router.push para regresar, asegurando que los parámetros dinámicos se parseen bien
      router.replace(previousRoute as any);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  };

  return {
    navigateTo,
    navigateDirect,
    replaceRoute,
    goBack,
    getCurrentFullPath
  };
}
