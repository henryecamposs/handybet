import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/useThemeColors';

interface PopoverItem {
  id: string;
  name: string;
  subtitle?: string;
  image?: string;
  path: string; // The path to navigate when clicked
}

interface SidebarPopoverProps {
  icon: React.ReactNode;
  label: string;
  items: PopoverItem[];
  onViewAll?: () => void;
  viewAllPath?: string;
}

export default function SidebarPopover({ icon, label, items, onViewAll, viewAllPath }: SidebarPopoverProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [popupTop, setPopupTop] = useState(128);
  const buttonRef = useRef<View>(null);
  const router = useRouter();
  const colors = useThemeColors();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    if (isVisible) {
      // Smooth fade-in and spring scale-up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset values
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [isVisible]);

  const handleOpen = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        setPopupTop(py);
        setIsVisible(true);
      });
    } else {
      setIsVisible(true);
    }
  };

  const handleClose = () => {
    // Smooth fade-out and scale-down before hiding modal
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
    });
  };

  const handleNavigate = (path: string) => {
    handleClose();
    router.push(path as any);
  };

  const handleViewAll = () => {
    handleClose();
    if (onViewAll) onViewAll();
    else if (viewAllPath) router.push(viewAllPath as any);
  };

  return (
    <View className="relative z-50">
      <View ref={buttonRef}>
        <TouchableOpacity
          onPress={handleOpen}
          className="flex-row items-center p-2.5 rounded-xl hover:bg-primary/10 active:bg-primary/20 transition-colors justify-between"
        >
          <View className="flex-row items-center">
            <View className="w-9 items-center justify-center">
              {icon}
            </View>
            <Text className="font-bold text-foreground/90 ml-3 text-[15px]">{label}</Text>
          </View>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isVisible && (
        <Modal transparent visible={isVisible} animationType="none" onRequestClose={handleClose}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <Animated.View 
              style={{ opacity: fadeAnim }} 
              className="flex-1 bg-black/40"
            >
              <TouchableWithoutFeedback>
                <Animated.View
                  className="absolute left-[20%] w-72 bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
                  style={{ 
                    top: popupTop, 
                    transform: [{ scale: scaleAnim }],
                    elevation: 10, 
                    shadowColor: '#000', 
                    shadowOffset: { width: 0, height: 10 }, 
                    shadowOpacity: 0.5, 
                    shadowRadius: 20 
                  }}
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between p-4 border-b border-primary/10 bg-primary/5">
                    <Text className="text-foreground font-black text-base uppercase tracking-wider">{label}</Text>
                    <TouchableOpacity onPress={handleViewAll}>
                      <Text className="text-primary text-[10px] font-black uppercase hover:underline">Ver todos</Text>
                    </TouchableOpacity>
                  </View>

                  {/* List */}
                  <View className="max-h-96">
                    {items.length === 0 ? (
                      <View className="p-6 items-center justify-center">
                        <Text className="text-muted-foreground font-bold text-xs">No hay elementos disponibles</Text>
                      </View>
                    ) : (
                      items.map((item, index) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleNavigate(item.path)}
                          className={`flex-row items-center p-3 hover:bg-primary/5 active:bg-primary/10 transition-colors ${
                            index !== items.length - 1 ? 'border-b border-primary/5' : ''
                          }`}
                        >
                          {item.image ? (
                            <Image source={{ uri: item.image }} className="w-10 h-10 rounded-full mr-3 bg-background/80 border border-zinc-800" />
                          ) : (
                            <View className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 mr-3 items-center justify-center">
                              <Text className="text-primary font-black text-base uppercase">{item.name.charAt(0)}</Text>
                            </View>
                          )}
                          <View className="flex-1">
                            <Text className="text-foreground font-black text-xs leading-tight" numberOfLines={1}>{item.name}</Text>
                            {item.subtitle && (
                              <Text className="text-muted-foreground text-[10px] font-semibold mt-1 uppercase" numberOfLines={1}>{item.subtitle}</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </Animated.View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}
