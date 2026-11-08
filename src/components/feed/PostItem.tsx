import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MessageSquare, Share2, Bell, EyeOff, X, Trash2, Sparkles } from 'lucide-react-native';
import Logo from '../ui/Logo';
import FloatingPopup from '../ui/FloatingPopup';
import IconButton from '../ui/IconButton';
import { useBrandColors, useTextColors, withOpacity } from '../../hooks/useThemeColors';
import PostActionButtons from './PostActionButtons';
import PostMediaCarousel from './PostMediaCarousel';
import TierPlanSelector from '../media/TierPlanSelector';
import { useToastStore } from '../../store/useToastStore';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useDevicePlatform } from '../../hooks/useDevicePlatform';

interface PostItemProps {
  post: any;
  isLiked: boolean;
  onLikeToggle: () => void;
  onMediaPress?: (index: number) => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  isSaved?: boolean;
  onSavePress?: () => void;
  onDeletePress?: () => void;
}

export default function PostItem({ post, isLiked, onLikeToggle, onMediaPress, onCommentPress, onSharePress, isSaved, onSavePress, onDeletePress }: PostItemProps) {
  const { addToast } = useToastStore();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const optionsButtonRef = useRef<View>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState<string[]>([]);
  const { walletBalance, deductBalance } = useHandyBetStore();
  const brandColors = useBrandColors();
  const textColors = useTextColors();
  const { isDesktop } = useDevicePlatform();
  const isMobile = !isDesktop;

  const hasPlans = Array.isArray(post.plans) && post.plans.length > 0;
  const isSubscribed = activeSubscriptions.some((subId) =>
    post.plans?.some((p: any) => p.id === subId)
  );

  const formattedPlans = hasPlans
    ? post.plans.map((p: any) => ({
        id: p.id,
        group_id: p.group_id || 'grp_general',
        name: p.name,
        price: Number(p.price || 0),
        max_photos: p.max_photos ?? 100,
        max_videos: p.max_videos ?? 50,
        duration_days: p.duration_days ?? 30,
        created_at: p.created_at || new Date().toISOString(),
      }))
    : [];

  const renderPlanModal = () => {
    if (!hasPlans) return null;
    return (
      <Modal
        visible={showPlanModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View className="flex-1 bg-black/85 items-center justify-center p-4">
          <View className="bg-card border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden p-6 relative shadow-2xl">
            {/* Header Modal */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-row items-center gap-3">
                <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border border-amber-500/40" />
                <View>
                  <Text className="text-foreground font-black text-lg">Membresía Oficial • {post.author}</Text>
                  <Text className="text-muted-foreground text-xs font-semibold">
                    Saldo disponible en tu wallet: <Text className="text-primary font-bold">{walletBalance.toFixed(2)} Bs.</Text>
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setShowPlanModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 items-center justify-center hover:bg-white/20 active:scale-95"
              >
                <X size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Selector de Planes */}
            <TierPlanSelector
              plans={formattedPlans}
              userActiveSubscriptions={activeSubscriptions}
              onPurchasePlan={async (planId: string) => {
                const targetPlan = formattedPlans.find((p: any) => p.id === planId);
                if (!targetPlan) return;

                if (targetPlan.price === 0) {
                  setActiveSubscriptions((prev) => [...prev, planId]);
                  addToast({
                    title: `¡Plan ${targetPlan.name} activado gratis!`,
                    variant: 'secondary',
                    position: 'top-right',
                  });
                  setShowPlanModal(false);
                  return;
                }

                const success = deductBalance(targetPlan.price);
                if (success) {
                  setActiveSubscriptions((prev) => [...prev, planId]);
                  addToast({
                    title: `¡Suscripción exitosa a ${targetPlan.name}!`,
                    variant: 'secondary',
                    position: 'top-right',
                  });
                  setShowPlanModal(false);
                } else {
                  addToast({
                    title: `Saldo insuficiente (${walletBalance.toFixed(2)} Bs.). Requiere ${targetPlan.price.toFixed(2)} Bs.`,
                    variant: 'danger',
                    position: 'top-right',
                  });
                }
              }}
            />
          </View>
        </View>
      </Modal>
    );
  };

  if (isHidden) {
    return (
      <View className="bg-card/40 border border-white/5 p-4 rounded-2xl mb-4 flex-row items-center justify-between shadow-md backdrop-blur-sm">
        <Text className="text-muted-foreground text-xs font-semibold">Publicación oculta de {post.author}</Text>
        <TouchableOpacity
          onPress={() => {
            setIsHidden(false);
          }}
          className="bg-primary/20 px-4 py-2 rounded-full border border-primary/30 active:scale-95"
        >
          <Text className="text-primary text-[10px] font-extrabold uppercase tracking-wider">Deshacer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasMedia = post.mediaUrls && post.mediaUrls.length > 0;
  const limit = hasMedia ? 90 : 240;
  const postText = post.text || '';
  const isLongText = postText.length > limit;
  const displayText = isLongText && !expanded ? `${postText.slice(0, limit)}...` : postText;

  if (isMobile) {
    return (
      <View className="bg-card/75 border border-white/10 p-5 rounded-2xl mb-5 shadow-lg flex-col backdrop-blur-md">
        {/* Header: Mostrar avatar de usuario y nombre, seguir y el icono con popup */}
        <View className="flex-row items-center justify-between mb-4 relative z-50">
          <View className="flex-row items-center gap-3">
            <Image source={{ uri: post.avatar }} className="w-10 h-10 rounded-full border border-white/20" />
            <View>
              <Text className="text-foreground font-bold text-sm">{post.author}</Text>
              <Text className="text-muted-foreground text-[10px] font-medium mt-0.5">{post.time}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            {hasPlans && (
              <TouchableOpacity
                onPress={() => setShowPlanModal(true)}
                activeOpacity={0.8}
                className="flex-row items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full active:scale-95"
              >
                <Sparkles size={11} color="#f59e0b" />
                <Text className="text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                  {isSubscribed ? 'Suscrito' : 'Suscribirse ⭐'}
                </Text>
              </TouchableOpacity>
            )}
            <IconButton
              label={isFollowing ? 'Siguiendo' : 'Seguir'}
              onPress={() => {
                const nextVal = !isFollowing;
                setIsFollowing(nextVal);
                addToast({
                  title: nextVal ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`,
                  variant: nextVal ? 'secondary' : 'muted',
                  position: 'top-right'
                });
              }}
              size="xs"
              rounded="full"
              variant={isFollowing ? 'muted' : 'primary'}
              isActive={!isFollowing}
              hasBorder={false}
            />
            <TouchableOpacity ref={optionsButtonRef} onPress={() => setShowOptionsModal(!showOptionsModal)} className="p-1">
              <Text className="text-primary font-black text-lg">⋮</Text>
            </TouchableOpacity>
          </View>

          {/* Menú desplegable local en movil */}
          <FloatingPopup
            isVisible={showOptionsModal}
            onClose={() => setShowOptionsModal(false)}
            anchorRef={optionsButtonRef as React.RefObject<View>}
            location="bottom"
            size="sm"
            bgColor="bg-card"
          >
            <View className="p-2 w-44 bg-card border border-white/10 rounded-xl shadow-2xl">
              <IconButton
                icon={Share2}
                label="Compartir"
                onPress={() => {
                  setShowOptionsModal(false);
                  onSharePress?.();
                }}
                size="xs"
                variant="ghost"
                hasBorder={false}
                className="w-full justify-start py-2.5"
              />

              <IconButton
                icon={Bell}
                label={isNotificationsEnabled ? 'Notif. Activas' : 'Notificar'}
                onPress={() => {
                  const nextVal = !isNotificationsEnabled;
                  setIsNotificationsEnabled(nextVal);
                  setShowOptionsModal(false);
                  addToast({
                    title: nextVal ? "Notificaciones activadas" : "Notificaciones desactivadas",
                    variant: nextVal ? 'info' : 'muted',
                    position: 'bottom'
                  });
                }}
                size="xs"
                variant="ghost"
                hasBorder={false}
                iconColor={isNotificationsEnabled ? brandColors.primary : textColors.foreground}
                className="w-full justify-start py-2.5"
              />

              <IconButton
                icon={EyeOff}
                label="No mostrar"
                onPress={() => {
                  setIsHidden(true);
                  setShowOptionsModal(false);
                }}
                size="xs"
                variant="ghost"
                hasBorder={false}
                iconColor={brandColors.destructive}
                className="w-full justify-start py-2.5"
              />

              <View className="mt-1.5 border-t border-white/10 pt-1.5">
                <IconButton
                  icon={Trash2}
                  label="Eliminar"
                  onPress={() => {
                    setShowOptionsModal(false);
                    if (onDeletePress) {
                      onDeletePress();
                    } else {
                      setIsHidden(true);
                    }
                  }}
                  size="xs"
                  variant="destructive"
                  hasBorder={false}
                  className="w-full justify-start py-2.5"
                />
            </View>
          </View>
          </FloatingPopup>
        </View>

        {/* Texto clickeable */}
        <TouchableOpacity activeOpacity={0.9} onPress={onCommentPress} className="mb-3 px-1">
          <Text className="text-foreground text-sm leading-relaxed font-normal">
            {displayText}
            {isLongText && !expanded && (
              <Text
                onPress={(e) => {
                  e.stopPropagation();
                  setExpanded(true);
                }}
                className="text-primary font-bold ml-1"
              >
                {' '}Ver más
              </Text>
            )}
          </Text>
        </TouchableOpacity>

        {/* Sentimiento y Barra de Acciones (si no hay media) */}
        <View className="flex-row items-center justify-between my-2 px-1">
          <View className="flex-1">
            {post.feeling && (
              <View className="flex-row items-center gap-1.5 bg-black/30 border border-white/5 px-3 py-1.5 rounded-full self-start">
                {post.feeling.icon && React.createElement(post.feeling.icon, { size: 12, color: post.feeling.color })}
                <Text className="text-muted-foreground text-[10px] font-semibold">
                  <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
                </Text>
              </View>
            )}
          </View>
          {!hasMedia && (
            <View className="flex-row items-center justify-center flex-1 ml-4">
              <PostActionButtons
                isLiked={isLiked}
                likeCount={isLiked ? '1.2k' : '1.1k'}
                commentCount="342"
                onLikeToggle={onLikeToggle}
                onCommentPress={onCommentPress}
                onSharePress={onSharePress}
                isSaved={isSaved}
                onSavePress={onSavePress}
                variant="compact"
              />
            </View>
          )}
        </View>

        {/* Media content expandido */}
        {hasMedia && (
          <View className="w-full overflow-hidden mt-2 rounded-xl relative border border-white/10">
            <PostMediaCarousel
              mediaUrls={post.mediaUrls}
              mediaType={post.mediaType}
              onMediaPress={onMediaPress}
              height={260}
              resizeMode="cover"
            />
            {/* Action Bar Overlay */}
            <View className="absolute bottom-3 w-full items-center z-10">
              <View className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <PostActionButtons
                  isLiked={isLiked}
                  likeCount={isLiked ? '1.2k' : '1.1k'}
                  commentCount="342"
                  onLikeToggle={onLikeToggle}
                  onCommentPress={onCommentPress}
                  onSharePress={onSharePress}
                  isSaved={isSaved}
                  onSavePress={onSavePress}
                  variant="compact"
                />
              </View>
            </View>
          </View>
        )}
        {renderPlanModal()}
      </View>
    );
  }

  // Vista Escritorio (Desktop)
  return (
    <View className="bg-card/75 border border-white/10 p-5 rounded-2xl mb-5 shadow-lg flex-row gap-4 backdrop-blur-md">
      {/* Columna Izquierda: Foto de Perfil */}
      <View className="items-center">
        <Image source={{ uri: post.avatar }} className="w-12 h-12 rounded-full border border-white/20" />
      </View>

      {/* Columna Derecha: Todo el resto del contenido */}
      <View className="flex-1 relative">
        {/* Header Publicación */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2 flex-wrap">
            <Text className="text-foreground font-bold text-base">{post.author}</Text>
            <Text className="text-muted-foreground text-xs font-medium">{post.username} • {post.time}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            {hasPlans && (
              <TouchableOpacity
                onPress={() => setShowPlanModal(true)}
                activeOpacity={0.8}
                className="flex-row items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 rounded-full active:scale-95"
              >
                <Sparkles size={11} color="#f59e0b" />
                <Text className="text-amber-400 font-extrabold text-[10px] uppercase tracking-wider">
                  {isSubscribed ? 'Suscrito' : 'Suscribirse ⭐'}
                </Text>
              </TouchableOpacity>
            )}
            <IconButton
              label={isFollowing ? 'Siguiendo' : 'Seguir'}
              onPress={() => {
                const nextVal = !isFollowing;
                setIsFollowing(nextVal);
                addToast({
                  title: nextVal ? `Siguiendo a ${post.author}` : `Dejaste de seguir a ${post.author}`,
                  variant: nextVal ? 'secondary' : 'muted',
                  position: 'top-right'
                });
              }}
              size="xs"
              rounded="full"
              variant={isFollowing ? 'muted' : 'primary'}
              isActive={!isFollowing}
              hasBorder={false}
            />
            <TouchableOpacity ref={optionsButtonRef} onPress={() => setShowOptionsModal(!showOptionsModal)} className="p-1">
              <Text className="text-primary font-black text-lg">⋮</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menú desplegable local (estilo Popover desde el icono) */}
        <FloatingPopup
          isVisible={showOptionsModal}
          onClose={() => setShowOptionsModal(false)}
          anchorRef={optionsButtonRef as React.RefObject<View>}
          location="bottom"
          size="sm"
          bgColor="bg-card"
        >
          <View className="p-2 w-44 bg-card border border-white/10 rounded-xl shadow-2xl">
            <IconButton
              icon={Share2}
              label="Compartir"
              onPress={() => {
                setShowOptionsModal(false);
                onSharePress?.();
              }}
              size="xs"
              variant="ghost"
              hasBorder={false}
              className="w-full justify-start py-2.5"
            />

            <IconButton
              icon={Bell}
              label={isNotificationsEnabled ? 'Notif. Activas' : 'Notificar'}
              onPress={() => {
                const nextVal = !isNotificationsEnabled;
                setIsNotificationsEnabled(nextVal);
                setShowOptionsModal(false);
                addToast({
                  title: nextVal ? "Notificaciones activadas" : "Notificaciones desactivadas",
                  variant: nextVal ? 'info' : 'muted',
                  position: 'bottom'
                });
              }}
              size="xs"
              variant="ghost"
              hasBorder={false}
              iconColor={isNotificationsEnabled ? brandColors.primary : textColors.foreground}
              className="w-full justify-start py-2.5"
            />

            <IconButton
              icon={EyeOff}
              label="No mostrar"
              onPress={() => {
                setIsHidden(true);
                setShowOptionsModal(false);
              }}
              size="xs"
              variant="ghost"
              hasBorder={false}
              iconColor={brandColors.destructive}
              className="w-full justify-start py-2.5"
            />

            <View className="mt-1.5 border-t border-white/10 pt-1.5">
              <IconButton
                icon={Trash2}
                label="Eliminar"
                onPress={() => {
                  setShowOptionsModal(false);
                  if (onDeletePress) {
                    onDeletePress();
                  } else {
                    setIsHidden(true);
                  }
                }}
                size="xs"
                variant="destructive"
                hasBorder={false}
                className="w-full justify-start py-2.5"
              />
            </View>
          </View>
        </FloatingPopup>

        {/* Texto clickeable */}
        <TouchableOpacity activeOpacity={0.8} onPress={onCommentPress} className="mb-3">
          <Text className="text-foreground text-sm leading-relaxed font-normal">{post.text}</Text>
        </TouchableOpacity>

        {/* Media */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <View className="w-full mb-3 rounded-xl overflow-hidden border border-white/10">
            <PostMediaCarousel
              mediaUrls={post.mediaUrls}
              mediaType={post.mediaType}
              onMediaPress={onMediaPress}
              height={260}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Reacciones y Sentimiento Inferior */}
        <View className="items-center mt-2 pt-2 w-full border-t border-white/5">
          {post.feeling && (
            <View className="flex-row items-center gap-2 bg-black/30 border border-white/5 self-start px-3 py-1.5 rounded-full mb-3">
              {post.feeling.icon && React.createElement(post.feeling.icon, { size: 14, color: post.feeling.color })}
              <Text className="text-muted-foreground text-xs font-semibold">
                Me siento <Text style={{ color: post.feeling.color }}>{post.feeling.text}</Text>
              </Text>
            </View>
          )}

          <View className="flex-row justify-start w-full">
            <PostActionButtons
              isLiked={isLiked}
              likeCount={isLiked ? '1.2k' : '1.1k'}
              commentCount="342"
              onLikeToggle={onLikeToggle}
              onCommentPress={onCommentPress}
              onSharePress={onSharePress}
              isSaved={isSaved}
              onSavePress={onSavePress}
              variant="compact"
            />
          </View>
        </View>
        {renderPlanModal()}
      </View>
    </View>
  );
}
