import { useRouter, useLocalSearchParams } from 'expo-router';
import { useToastStore } from '@/store/useToastStore';

export type HubEntityType = 'user' | 'group' | 'channel' | 'member';

export function useHubUtilities() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; channelId?: string; from?: string; parentId?: string }>();
  const addToast = useToastStore((state) => state.addToast);

  /**
   * Manejador global para el botón "Atrás".
   * Decide la ruta más segura basándose en el parámetro `from` o hace un fallback inteligente.
   * @param customFallback Ruta de fallback en caso de no poder volver atrás ni tener `from`.
   */
  const handleBack = (customFallback?: string) => {
    const { from, parentId } = params;
    
    if (from === 'channel' && parentId) {
      router.push(`/channels/${parentId}` as any);
    } else if (from === 'group' && parentId) {
      router.push(`/channels/groups?id=${parentId}` as any); // Asume que groups usa el id
    } else if (customFallback) {
      router.push(customFallback as any);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/(tabs)/feed' as any); // Fallback universal a la pantalla principal
    }
  };

  /**
   * Navega a la pantalla de Chat con los parámetros correctos.
   */
  const handleChat = (id: string, type: HubEntityType) => {
    const { from } = params;
    const fromParam = from ? `&from=${from}` : '';
    router.push(`/chat/${id}?fromType=${type}${fromParam}` as any);
  };

  /**
   * Alterna el estado de seguimiento (Follow) y muestra un Toast global.
   */
  const handleFollowToggle = (isFollowing: boolean, type: HubEntityType, onToggle?: (newVal: boolean) => void) => {
    const newVal = !isFollowing;
    if (onToggle) onToggle(newVal);
    
    const entityName = type === 'user' || type === 'member' ? 'usuario' : type === 'group' ? 'grupo' : 'canal';
    
    addToast({
      title: newVal ? `Siguiendo ${entityName}` : `Dejaste de seguir al ${entityName}`,
      variant: newVal ? 'success' : 'muted',
      position: 'bottom'
    });
  };

  /**
   * Alterna el estado de Guardado (Save/Bookmark) y muestra un Toast global.
   */
  const handleSaveToggle = (isSaved: boolean, type: HubEntityType, entityName?: string, onToggle?: (newVal: boolean) => void) => {
    const newVal = !isSaved;
    if (onToggle) onToggle(newVal);
    
    const nameStr = entityName ? ` ${entityName}` : '';
    addToast({
      title: newVal ? `Agregado a guardados${nameStr}` : `Eliminado de guardados${nameStr}`,
      variant: newVal ? 'success' : 'muted',
      position: 'bottom'
    });
  };

  /**
   * Navega a la vista de perfil/hub del elemento especificado.
   */
  const handleViewProfile = (id: string, type: HubEntityType) => {
    if (type === 'user' || type === 'member') {
      router.push(`/(tabs)/follows/${id}` as any);
    } else if (type === 'group') {
      router.push(`/(tabs)/channels/groups?id=${id}` as any);
    } else if (type === 'channel') {
      router.push(`/(tabs)/channels/${id}` as any);
    }
  };

  return {
    params,
    handleBack,
    handleChat,
    handleFollowToggle,
    handleSaveToggle,
    handleViewProfile
  };
}
