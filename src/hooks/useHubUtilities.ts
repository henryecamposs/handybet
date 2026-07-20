import { useLocalSearchParams } from 'expo-router';
import { useToastStore } from '@/store/useToastStore';
import { useAppNavigation } from '@/hooks/useAppNavigation';

export type HubEntityType = 'user' | 'group' | 'channel' | 'member';

export function useHubUtilities() {
  const { navigateTo, goBack } = useAppNavigation();
  const params = useLocalSearchParams<{ id?: string; channelId?: string; from?: string; parentId?: string }>();
  const addToast = useToastStore((state) => state.addToast);

  /**
   * Manejador global para el botón "Atrás".
   * Decide la ruta más segura basándose en el parámetro `from` o hace un fallback inteligente.
   * @param customFallback Ruta de fallback en caso de no poder volver atrás ni tener `from`.
   */
  const handleBack = (customFallback?: string) => {
    goBack(customFallback);
  };

  /**
   * Navega a la pantalla de Chat con los parámetros correctos.
   */
  const handleChat = (id: string, type: HubEntityType) => {
    navigateTo(`/chat/${id}`);
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
      navigateTo(`/(tabs)/follows/${id}`);
    } else if (type === 'group') {
      navigateTo(`/(tabs)/channels/groups?id=${id}`);
    } else if (type === 'channel') {
      navigateTo(`/(tabs)/channels/${id}`);
    }
  };

  /**
   * Navega a la vista de publicaciones (feed filtrado) del elemento especificado.
   */
  const handleViewPosts = (id: string, type: HubEntityType) => {
    navigateTo(`/feed/search?id=${id}`);
  };

  return {
    params,
    handleBack,
    handleChat,
    handleFollowToggle,
    handleSaveToggle,
    handleViewProfile,
    handleViewPosts
  };
}
