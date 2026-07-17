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
      case 'primary': return 'bg-primary border-primary';
      case 'secondary': return 'bg-zinc-800 border-zinc-700';
      case 'danger': return 'bg-red-600 border-red-500';
      case 'warning': return 'bg-orange-600 border-orange-500';
      case 'success': return 'bg-green-600 border-green-500';
      case 'info': return 'bg-blue-600 border-blue-500';
      case 'muted': return 'bg-zinc-900 border-zinc-800';
      default: return 'bg-zinc-900 border-zinc-800';
    }
  };

  const getIcon = () => {
    const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
    const color = '#ffffff';

    switch (variant) {
      case 'success': return <CheckCircle2 size={iconSize} color={color} />;
      case 'danger': return <XCircle size={iconSize} color={color} />;
      case 'warning': return <AlertTriangle size={iconSize} color={color} />;
      case 'info': return <Info size={iconSize} color={color} />;
      default: return null;
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'sm': return 'p-2';
      case 'lg': return 'p-5';
      default: return 'p-3.5';
    }
  };

  const getMinWidth = () => {
    switch (size) {
      case 'sm': return 200;
      case 'lg': return 350;
      default: return 280;
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
      className={`border rounded-2xl flex-row items-center shadow-2xl mb-2 pointer-events-auto ${getVariantStyles()} ${getSizePadding()}`}
    >
      {/* Avatar o Icono */}
      {avatar ? (
        <Image source={{ uri: avatar }} className={`${size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10'} rounded-full mr-3`} />
      ) : getIcon() ? (
        <View className="mr-3">
          {getIcon()}
        </View>
      ) : null}

      {/* Contenido */}
      <View className="flex-1 pr-2 justify-center">
        <View className="flex-row items-center gap-2">
          <Text className={`text-white font-bold ${getTitleSize()}`}>{title}</Text>
          <TouchableOpacity onPress={closeToast} className="p-1 opacity-70 hover:opacity-100">
            <X size={size === 'sm' ? 14 : 18} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {description && (
          <Text className={`text-white/80 mt-0.5 ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-sm'}`}>
            {description}
          </Text>
        )}
      </View>

      {/* Acciones */}
      <View className="flex-row items-center gap-3">
        {action && (
          <TouchableOpacity onPress={() => { action.onPress(); closeToast(); }}>
            <Text className="text-white font-black uppercase text-[10px] tracking-wider">{action.label}</Text>
          </TouchableOpacity>
        )}

      </View>
    </Animated.View>
  );
}
