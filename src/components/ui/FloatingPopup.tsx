import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

export interface FloatingPopupProps {
  isVisible: boolean;
  onClose: () => void;
  anchorRef?: React.RefObject<View>;
  title?: string;
  titleRightLabel?: string;
  onTitleRightPress?: () => void;
  children: React.ReactNode;
  location?: 'left' | 'right' | 'top' | 'bottom' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bgColor?: string;
}

export default function FloatingPopup({
  isVisible,
  onClose,
  anchorRef,
  title,
  titleRightLabel,
  onTitleRightPress,
  children,
  location = 'right',
  size = 'md',
  bgColor = 'bg-popover'
}: FloatingPopupProps) {
  const [position, setPosition] = useState({ top: -1000, left: -1000 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isVisible && anchorRef?.current) {
      anchorRef.current.measure((fx, fy, width, height, px, py) => {
        const windowWidth = Dimensions.get('window').width;
        let top = py;
        let left = px;

        // Approximate widths based on Tailwind classes
        let popupWidth = 288; // md (w-72)
        if (size === 'sm') popupWidth = 192; // w-48
        if (size === 'lg') popupWidth = 384; // w-96
        if (size === 'xl') popupWidth = 448; // w-112

        switch (location) {
          case 'right':
            left = px + width + 15;
            break;
          case 'left':
            left = px - popupWidth - 15;
            break;
          case 'top':
            top = py - height - 15;
            break;
          case 'bottom':
            top = py + height + 15;
            break;
          case 'center':
            left = (windowWidth - popupWidth) / 2;
            top = py + height + 15;
            break;
        }

        // Prevent overflow on right side
        if (left + popupWidth > windowWidth) {
          left = windowWidth - popupWidth - 15;
        }

        // Prevent overflow on left side
        if (left < 0) left = 15;

        setPosition({ top, left });
        setOpacity(1); // Show after position is calculated
      });
    } else if (isVisible && !anchorRef) {
      // If no anchor, center it 
      const windowWidth = Dimensions.get('window').width;
      let popupWidth = 288;
      if (size === 'sm') popupWidth = 192;
      if (size === 'lg') popupWidth = 384;
      if (size === 'xl') popupWidth = 448;

      setPosition({ top: 128, left: (windowWidth - popupWidth) / 2 });
      setOpacity(1);
    } else {
      setOpacity(0);
    }
  }, [isVisible, anchorRef, location, size]);

  if (!isVisible) return null;

  const sizeClass = {
    sm: 'w-48',
    md: 'w-72',
    lg: 'w-96',
    xl: 'w-[448px]'
  }[size] || 'w-72';

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1">
          <TouchableWithoutFeedback>
            <View
              className={`absolute ${sizeClass} ${bgColor} border border-border rounded-xs shadow-2xl overflow-hidden`}
              style={{
                top: position.top,
                left: position.left,
                opacity,
                elevation: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.5,
                shadowRadius: 20
              }}
            >
              {/* Header */}
              {(title || titleRightLabel) && (
                <View className="flex-row items-center justify-between p-4 border-b border-border">
                  {title && <Text className="text-foreground font-bold text-lg">{title}</Text>}
                  {titleRightLabel && (
                    <TouchableOpacity onPress={onTitleRightPress}>
                      <Text className="text-primary text-sm font-semibold hover:underline">{titleRightLabel}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Body */}
              <ScrollView className="max-h-[300px]">
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
