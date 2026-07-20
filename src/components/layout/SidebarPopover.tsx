import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { useThemeColors } from '@/hooks/useThemeColors';
import FloatingPopup from '@/components/ui/FloatingPopup';

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
  const { navigateTo } = useAppNavigation();
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
    navigateTo(path);
  };

  const handleViewAll = () => {
    handleClose();
    if (onViewAll) onViewAll();
    else if (viewAllPath) navigateTo(viewAllPath);
  };

  return (
    <View className="relative z-50">
      <View ref={buttonRef} className="flex-row items-center justify-between p-2 rounded-xs hover:bg-primary/40 active:bg-primary/40 transition-colors">
        <TouchableOpacity
          onPress={handleViewAll}
          className="flex-row items-center flex-1"
        >
          <View className="w-9 items-center justify-center">
            {icon}
          </View>
          <Text className="font-medium text-primary ml-3 text-[15px]">{label}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOpen}
          className="p-1 rounded-full hover:bg-primary/20"
        >
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <FloatingPopup
        isVisible={isVisible}
        onClose={handleClose}
        anchorRef={buttonRef as React.RefObject<View>}
        title={label}
        titleRightLabel="Ver todos"
        onTitleRightPress={handleViewAll}
        location="right"
        size="md"
      >
        <View>
          {items.length === 0 ? (
            <View className="p-4 items-center justify-center">
              <Text className="text-foreground text-sm">No hay elementos disponibles</Text>
            </View>
          ) : (
            items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleNavigate(item.path)}
                className="flex-row items-center p-3 border-b border-border hover:bg-background/80 transition-colors"
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
      </FloatingPopup>
    </View>
  );
}
