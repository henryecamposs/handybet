import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { colorScheme } from 'nativewind';
import { useThemeColors, withOpacity } from '@/hooks/useThemeColors';

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
  const [popupTop, setPopupTop] = useState(128); // Default top-32
  const buttonRef = useRef<View>(null);
  const router = useRouter();
  const colors = useThemeColors();
  const handleOpen = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((fx, fy, width, height, px, py) => {
        // En plataformas web y nativas px y py dan las coordenadas relativas a la pantalla
        setPopupTop(py);
        setIsVisible(true);
      });
    } else {
      setIsVisible(true);
    }
  };

  const handleClose = () => setIsVisible(false);

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
          className="flex-row items-center p-2 rounded-xl hover:bg-primary/40 active:bg-primary/40 transition-colors justify-between"
        >
          <View className="flex-row items-center">
            <View className="w-9 items-center justify-center">
              {icon}
            </View>
            <Text className="font-medium text-foreground ml-3 text-[15px]">{label}</Text>
          </View>
          <ChevronRight size={16} color={withOpacity(colors.primary, 0.5)} />
        </TouchableOpacity>
      </View>

      {isVisible && (
        <Modal transparent visible={isVisible} animationType="fade">
          <TouchableWithoutFeedback onPress={handleClose}>
            <View className="flex-1">
              <TouchableWithoutFeedback>
                <View
                  className="absolute left-[20%] w-72 bg-popover border border-primary/20 rounded-xl shadow-2xl overflow-hidden"
                  style={{ top: popupTop, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20 }}
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between p-4 border-b border-primary/20">
                    <Text className="text-foreground font-bold text-lg">{label}</Text>
                    <TouchableOpacity onPress={handleViewAll}>
                      <Text className="text-primary text-sm font-semibold hover:underline">Ver todos</Text>
                    </TouchableOpacity>
                  </View>

                  {/* List */}
                  <View className="max-h-96">
                    {items.length === 0 ? (
                      <View className="p-4 items-center justify-center">
                        <Text className="text-foreground text-sm">No hay elementos disponibles</Text>
                      </View>
                    ) : (
                      items.map((item) => (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() => handleNavigate(item.path)}
                          className="flex-row items-center p-3 border-b border-zinc-800/50 hover:bg-background/80 transition-colors"
                        >
                          {item.image ? (
                            <Image source={{ uri: item.image }} className="w-10 h-10 rounded-full mr-3 bg-background/80" />
                          ) : (
                            <View className="w-10 h-10 rounded-full bg-background/80 mr-3 items-center justify-center">
                              <Text className="text-foreground font-bold text-lg">{item.name.charAt(0)}</Text>
                            </View>
                          )}
                          <View className="flex-1">
                            <Text className="text-foreground font-medium text-[15px]" numberOfLines={1}>{item.name}</Text>
                            {item.subtitle && (
                              <Text className="text-foreground text-xs mt-0.5" numberOfLines={1}>{item.subtitle}</Text>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}
