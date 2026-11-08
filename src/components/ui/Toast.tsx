import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react-native';
import { ToastData, useToastStore } from '../../store/useToastStore';

export default function Toast({ id, title, description, variant = 'default', size = 'md', avatar, action, duration = 3500 }: ToastData) {
  const { removeToast } = useToastStore();
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(20));

  const closeToast = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => removeToast(id));
  }, [fadeAnim, slideAnim, id, removeToast]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    let timeoutId: ReturnType<typeof setTimeout>;
    if (duration > 0) {
      timeoutId = setTimeout(() => {
        closeToast();
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-card/95 border-primary/30 shadow-primary/5';
      case 'secondary':
        return 'bg-card/95 border-white/10 shadow-white/5';
      case 'danger':
        return 'bg-rose-950/90 border-rose-500/30 shadow-rose-500/5';
      case 'warning':
        return 'bg-amber-950/90 border-amber-500/30 shadow-amber-500/5';
      case 'success':
        return 'bg-emerald-950/90 border-emerald-500/30 shadow-emerald-500/5';
      case 'info':
        return 'bg-blue-950/90 border-blue-500/30 shadow-blue-500/5';
      case 'muted':
      default:
        return 'bg-card/95 border-white/15 shadow-black/40';
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;

    switch (variant) {
      case 'success': return <CheckCircle2 size={iconSize} color="#10b981" />; // emerald-500
      case 'danger': return <XCircle size={iconSize} color="#f43f5e" />; // rose-500
      case 'warning': return <AlertTriangle size={iconSize} color="#f59e0b" />; // amber-500
      case 'info': return <Info size={iconSize} color="#3b82f6" />; // blue-500
      case 'primary': return <CheckCircle2 size={iconSize} color="#00e676" />; // brand-primary (neon mint)
      default: return <Info size={iconSize} color="#a1a1aa" />;
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2.5 rounded-full';
      case 'lg': return 'px-7 py-4.5 rounded-3xl';
      default: return 'px-5 py-3 rounded-full';
    }
  };

  const getMinWidth = () => {
    switch (size) {
      case 'sm': return 180;
      case 'lg': return 360;
      default: return 260;
    }
  };

  const getTitleSize = () => {
    switch (size) {
      case 'sm': return 'text-[10px]';
      case 'lg': return 'text-sm';
      default: return 'text-xs';
    }
  };

  const hasIconOrAvatar = avatar || getIcon();

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        minWidth: getMinWidth(),
      }}
      className={`border flex-row items-center shadow-2xl mb-3 pointer-events-auto backdrop-blur-xl  ${getVariantStyles()} ${getSizePadding()}`}
    >
      {/* Avatar o Icono */}
      {avatar ? (
        <Image source={{ uri: avatar }} className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9'} rounded-full mr-3 border border-white/20`} />
      ) : getIcon() ? (
        <View className="mr-2.5">
          {getIcon()}
        </View>
      ) : null}

      {/* Contenido */}
      <View className="flex-1 pr-3 justify-center">
        <View className="flex-row items-center justify-between gap-2">
          <Text className={`text-foreground font-extrabold tracking-wide ${getTitleSize()}`}>{title}</Text>
          <TouchableOpacity onPress={closeToast} className="p-0.5 opacity-60 hover:opacity-100 transition-opacity">
            <X size={size === 'sm' ? 12 : 14} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {description && (
          <Text className={`text-muted-foreground mt-0.5 font-medium leading-normal ${size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]'}`}>
            {description}
          </Text>
        )}
      </View>

      {/* Acciones */}
      <View className="flex-row items-center gap-3">
        {action && (
          <TouchableOpacity onPress={() => { action.onPress(); closeToast(); }} className="bg-white/10 px-3 py-1 rounded-full border border-white/5 active:scale-95 transition-all">
            <Text className="text-white font-extrabold uppercase text-[9px] tracking-widest">{action.label}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
