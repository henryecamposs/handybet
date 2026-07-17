import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, ScrollView, TextInput, Linking } from 'react-native';
import { X, MessageSquare, Share2, ChevronLeft, ChevronRight, Send, Trophy, ExternalLink } from 'lucide-react-native';
import Logo from '../ui/Logo';
import { useThemeColors } from '../../hooks/useThemeColors';

interface PostMediaViewerProps {
  post: any | null;
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
  isLiked: boolean;
  onLikeToggle: () => void;
}

export default function PostMediaViewer({ post, visible, initialIndex = 0, onClose, isLiked, onLikeToggle }: PostMediaViewerProps) {
  const [prevVisible, setPrevVisible] = useState(visible);
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [newComment, setNewComment] = useState('');

  if (visible !== prevVisible || initialIndex !== prevInitialIndex) {
    setPrevVisible(visible);
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
    if (!visible) {
      setNewComment('');
    }
  }

  const colors = useThemeColors();
  const [comments, setComments] = useState([
    { id: 1, name: 'Carlos Mendoza', avatar: 'https://i.pravatar.cc/150?u=1', text: '¡Excelente publicación! Totalmente de acuerdo.' },
    { id: 2, name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=2', text: 'Me encantó esto. 🙌' }
  ]);

  if (!post) return null;

  const currentMediaUrl = post.mediaUrls && post.mediaUrls.length > 0 ? post.mediaUrls[currentIndex] : post.mediaUrl;
  const hasMultiple = post.mediaUrls && post.mediaUrls.length > 1;

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < post.mediaUrls.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/95 justify-center items-center relative">
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-4 left-4 z-50 bg-black/50 p-2 rounded-full"
        >
          <X size={24} color="#fff" />
        </TouchableOpacity>

        {currentMediaUrl ? (
          <Image
            source={{ uri: currentMediaUrl }}
            className="w-full h-full"
            resizeMode="contain"
          />
        ) : (
          <View className="w-full h-full justify-center items-center px-8 bg-background/80">
            <View className="bg-primary/5 border border-border p-8  w-full max-w-md items-center shadow-2xl relative overflow-hidden">
              <View className="absolute -right-20 -top-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <View className="absolute -left-20 -bottom-20 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />

              <Text className="text-secondary text-xs font-black uppercase tracking-widest mb-2">Publicidad Patrocinada</Text>
              <Trophy size={48} color={colors.secondary} className="mb-4" />

              <Text className="text-white text-2xl font-black text-center mb-2">¡Duplica tu primer depósito!</Text>
              <Text className="text-zinc-400 text-sm text-center font-semibold mb-6">
                Regístrate hoy en HandyBet con el código <Text className="text-primary font-black">REGISTRO100</Text> y obtén un bono del 100% hasta $100 USD para tus apuestas deportivas.
              </Text>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://handybet-promo.com').catch(err => console.log(err))}
                className="bg-primary w-full py-3.5  flex-row justify-center items-center gap-2 hover:opacity-90"
              >
                <Text className="text-primary-foreground font-black text-sm uppercase">Reclamar Bono</Text>
                <ExternalLink size={16} color="#000" />
              </TouchableOpacity>
              <Text className="text-zinc-600 text-[10px] font-bold mt-4 uppercase">Rif: J-40892812-3 • Términos y condiciones aplican</Text>
            </View>
          </View>
        )}

        {hasMultiple && currentIndex > 0 && (
          <TouchableOpacity
            onPress={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronLeft size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {hasMultiple && currentIndex < post.mediaUrls.length - 1 && (
          <TouchableOpacity
            onPress={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
          >
            <ChevronRight size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {post.mediaType === 'video' && (
          <View className="absolute inset-0 justify-center items-center pointer-events-none">
            <View className="bg-primary/90 w-20 h-20 rounded-full items-center justify-center shadow-lg border border-primary-400/50">
              <Text className="text-white text-4xl ml-2">▶</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
