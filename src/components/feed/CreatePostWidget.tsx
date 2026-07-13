import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { VisibilityLevel } from '../../types/handyBet';
import HandyAdsLogo from '../ui/HandyAdsLogo';
import HandyPostLogo from '../ui/HandyPostLogo';
import FileDropzone from '../ui/FileDropzone';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import { Image as ImageIcon, Video, Smile, Heart, Flame, Frown, Meh, UploadCloud, X, Trophy, TrendingUp, Target, Dices, Brain, Clover, Trash2, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { ScrollView, Image } from 'react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';

const FEELINGS = [
  { icon: Smile, color: '#fbbf24', text: 'Feliz' },
  { icon: Heart, color: '#ef4444', text: 'Amado' },
  { icon: Flame, color: '#f97316', text: 'Motivado' },
  { icon: Clover, color: '#10b981', text: 'Con Suerte' },
  { icon: Trophy, color: '#eab308', text: 'Ganador' },
  { icon: TrendingUp, color: '#f59e0b', text: 'En Racha' },
  { icon: Target, color: '#ef4444', text: 'Fijo' },
  { icon: Dices, color: '#8b5cf6', text: 'Arriesgado' },
  { icon: Brain, color: '#3b82f6', text: 'Analítico' },
  { icon: Frown, color: '#3b82f6', text: 'Triste' },
  { icon: Meh, color: '#a8a29e', text: 'Normal' },
];

interface CreatePostWidgetProps {
  onPublish: (content: string, type: 'regular' | 'advertisement', visibility: VisibilityLevel, feeling?: any, mediaUrls?: string[]) => Promise<boolean>;
}

export default function CreatePostWidget({ onPublish }: CreatePostWidgetProps) {
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'regular' | 'advertisement'>('regular');
  const [visibility, setVisibility] = useState<VisibilityLevel>('todos');
  const [isPublishing, setIsPublishing] = useState(false);

  const [selectedFeeling, setSelectedFeeling] = useState<any>(null);
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');

  const [selectedFiles, setSelectedFiles] = useState<{ uri: string, type: string }[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showPublishModal, setShowPublishModal] = useState(false);

  const { mockSession } = useHandyBetStore();
  const colors = useThemeColors();

  const userFirstName = mockSession?.name ? mockSession.name.split(' ')[0] : 'Henry';

  const handlePublish = async () => {
    if ((!postContent.trim() && selectedFiles.length === 0) || isPublishing) return;

    setIsPublishing(true);
    // Pasamos el sentimiento actual y los archivos seleccionados
    const mediaUrls = selectedFiles.map(f => f.uri);
    const success = await onPublish(postContent, postType, visibility, selectedFeeling, mediaUrls);
    setIsPublishing(false);

    if (success) {
      setPostContent('');
      setPostType('regular');
      setVisibility('todos');
      setSelectedFeeling(null);
      setSelectedFiles([]);
      setShowPublishModal(false);
    }
  };

  const handleFilesSelected = (files: { uri: string; type: string }[]) => {
    setSelectedFiles(prev => {
      let newFiles = [...prev, ...files];

      // Regla: máximo 1 video
      const videos = newFiles.filter(f => f.type === 'video');
      if (videos.length > 1) {
        const firstVideo = videos[0];
        newFiles = newFiles.filter(f => f.type !== 'video');
        newFiles.push(firstVideo);
      }

      // Regla: máximo 5 archivos en total
      return newFiles.slice(0, 5);
    });
    setShowUploadModal(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (showPreviewModal) {
      if (selectedFiles.length <= 1) {
        setShowPreviewModal(false);
      } else if (previewIndex >= selectedFiles.length - 1) {
        setPreviewIndex(selectedFiles.length - 2);
      }
    }
  };

  return (
    <View className="mb-6">
      {/* Barra reducida de creación (vista por defecto) */}
      <View className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-2xl flex-row items-center justify-between shadow-sm">
        <View className="flex-row items-center flex-1 gap-3">
          <Image
            source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }}
            className="w-10 h-10 rounded-full border border-zinc-800"
          />
          <TouchableOpacity
            onPress={() => setShowPublishModal(true)}
            className="flex-1 bg-zinc-800/80 border border-zinc-850 px-4 py-2.5 rounded-full justify-center"
          >
            <Text className="text-zinc-400 text-xs font-semibold">
              ¿Qué estás pensando, {userFirstName}?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Iconos de acción rápidos */}
        <View className="flex-row items-center gap-3.5 pl-3">
          <TouchableOpacity
            onPress={() => {
              setUploadType('video');
              setShowPublishModal(true);
              setShowUploadModal(true);
            }}
          >
            <Video size={20} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setUploadType('photo');
              setShowPublishModal(true);
              setShowUploadModal(true);
            }}
          >
            <ImageIcon size={20} color="#22c55e" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowPublishModal(true);
              setShowFeelingModal(true);
            }}
          >
            <Smile size={20} color="#f59e0b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Principal de Creación de Publicación */}
      <Modal
        visible={showPublishModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPublishModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center p-4">
          <View className="bg-background border border-zinc-800 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative">
            {/* Header del Modal */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Text className="text-white font-black text-md uppercase tracking-wider">Crea</Text>
                {postType === 'advertisement' ? (
                  <HandyAdsLogo size="sm" />
                ) : (
                  <HandyPostLogo size="sm" />
                )}
              </View>
              <TouchableOpacity
                onPress={() => setShowPublishModal(false)}
                className="bg-zinc-900 p-2 rounded-full"
              >
                <X size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="¿Qué estás pensando?"
              placeholderTextColor={withOpacity(colors.foreground, 0.2)}
              multiline
              numberOfLines={4}
              value={postContent}
              onChangeText={setPostContent}
              className="bg-background border border-foreground/20 rounded-2xl px-4 py-3 text-white text-xs font-bold outline-none min-h-[80px] mb-4"
            />

            {/* Banner inferior de miniaturas */}
            {selectedFiles.length > 0 && (
              <ScrollView horizontal className="mb-2" showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3 py-2 px-1">
                  {selectedFiles.map((file, idx) => (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.8}
                      onPress={() => {
                        setPreviewIndex(idx);
                        setShowPreviewModal(true);
                      }}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-black justify-center items-center"
                    >
                      <Image source={{ uri: file.uri }} className="w-full h-full opacity-80" resizeMode="cover" />
                      {file.type === 'video' && (
                        <View className="absolute inset-0 justify-center items-center pointer-events-none">
                          <Text className="text-white text-xs font-bold">▶</Text>
                        </View>
                      )}
                      <TouchableOpacity
                        onPress={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                      >
                        <X size={10} color="#fff" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <View className="flex-row items-center gap-4 py-3 mb-2 border-b border-zinc-800/50">
              <TouchableOpacity
                className="flex-row items-center gap-1.5 hover:opacity-70 transition-opacity"
                onPress={() => {
                  setUploadType('photo');
                  setShowUploadModal(true);
                }}
              >
                <ImageIcon size={18} color={colors.primary} />
                <Text className="text-foreground text-xs font-bold">Foto</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-1.5 hover:opacity-70 transition-opacity"
                onPress={() => {
                  setUploadType('video');
                  setShowUploadModal(true);
                }}
              >
                <Video size={18} color="#f43f5e" />
                <Text className="text-foreground text-xs font-bold">Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-1.5 hover:opacity-70 transition-opacity"
                onPress={() => setShowFeelingModal(true)}
              >
                {selectedFeeling ? (
                  <>
                    {React.createElement(selectedFeeling.icon, { size: 18, color: selectedFeeling.color })}
                    <Text className="text-foreground text-xs font-bold" style={{ color: selectedFeeling.color }}>{selectedFeeling.text}</Text>
                  </>
                ) : (
                  <>
                    <Smile size={18} color="#fbbf24" />
                    <Text className="text-foreground text-xs font-bold">Sentimiento</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <View className="flex-row gap-2">
                {/* Selector de tipo */}
                <TouchableOpacity
                  onPress={() => setPostType(postType === 'regular' ? 'advertisement' : 'regular')}
                  className={`px-3 py-1.5 rounded-full border flex-row items-center justify-center min-w-[100px] ${postType === 'advertisement' ? 'bg-secondary/15 border-secondary' : 'bg-background border-zinc-850'}`}
                >
                  {postType === 'advertisement' ? (
                    <HandyAdsLogo size="xs" />
                  ) : (
                    <HandyPostLogo size="xs" />
                  )}
                </TouchableOpacity>

                {/* Selector de Visibilidad */}
                <TouchableOpacity
                  onPress={() => {
                    const levels: VisibilityLevel[] = ['todos', 'amigos', 'amigos_de_mis_amigos'];
                    const nextIndex = (levels.indexOf(visibility) + 1) % levels.length;
                    setVisibility(levels[nextIndex]);
                  }}
                  className="px-3 py-1.5 rounded-full border bg-background border-zinc-850"
                >
                  <Text className="text-[10px] font-black uppercase text-foreground">
                    👁️ {visibility === 'todos' ? 'Público' : visibility === 'amigos' ? 'Amigos' : 'Relacional'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handlePublish}
                disabled={isPublishing || (!postContent.trim() && selectedFiles.length === 0)}
                className={`px-5 py-2.5 rounded-full ${isPublishing || (!postContent.trim() && selectedFiles.length === 0) ? 'bg-zinc-800' : 'bg-primary'}`}
              >
                <Text className={`font-black text-xs uppercase tracking-wider ${isPublishing || (!postContent.trim() && selectedFiles.length === 0) ? 'text-zinc-500' : 'text-primary-foreground'}`}>
                  {isPublishing ? 'Publicando...' : 'Publicar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Subida de Archivos */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View className="flex-1 bg-black/75 justify-center items-center p-6">
          <View className="bg-background border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <TouchableOpacity
              className="absolute top-4 right-4 bg-zinc-900 p-2 rounded-full z-10"
              onPress={() => setShowUploadModal(false)}
            >
              <X size={18} color="#fff" />
            </TouchableOpacity>

            <Text className="text-white font-black text-xl mb-2 text-center">
              Subir {uploadType === 'photo' ? 'Foto' : 'Video'}
            </Text>
            <Text className="text-muted-foreground text-sm mb-6 text-center">
              Selecciona un archivo desde tu dispositivo
            </Text>

            <FileDropzone
              type={uploadType}
              maxFiles={uploadType === 'photo' ? 5 : 1}
              onFilesSelected={handleFilesSelected}
            />

            <TouchableOpacity
              className="bg-primary w-full py-4 rounded-xl items-center"
              onPress={() => setShowUploadModal(false)}
            >
              <Text className="text-primary-foreground font-black text-sm uppercase">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showFeelingModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFeelingModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <View className="bg-background border border-zinc-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-white font-black text-xl">¿Cómo te sientes?</Text>
              <TouchableOpacity onPress={() => setShowFeelingModal(false)} className="bg-zinc-900 p-2 rounded-full absolute -right-2 -top-2">
                <X size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-center gap-3">
              {FEELINGS.map((feeling, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center gap-2 px-4 py-3 rounded-2xl border ${selectedFeeling?.text === feeling.text ? 'bg-zinc-800 border-zinc-700' : 'bg-background border-zinc-800'}`}
                  onPress={() => {
                    setSelectedFeeling(feeling);
                    setShowFeelingModal(false);
                  }}
                >
                  {React.createElement(feeling.icon, { size: 18, color: feeling.color })}
                  <Text className="text-white font-semibold text-sm">{feeling.text}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedFeeling && (
              <TouchableOpacity
                className="mt-6 border border-zinc-800 bg-zinc-900 py-3 rounded-xl items-center"
                onPress={() => {
                  setSelectedFeeling(null);
                  setShowFeelingModal(false);
                }}
              >
                <Text className="text-muted-foreground font-bold text-sm">Quitar sentimiento</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal de Previsualización y Eliminación de Imágenes/Videos */}
      <Modal
        visible={showPreviewModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPreviewModal(false)}
      >
        <View className="flex-1 bg-black/95 justify-center items-center">
          <View className="absolute top-4 right-4 flex-row gap-4 z-50">
            <TouchableOpacity
              onPress={() => removeFile(previewIndex)}
              className="bg-red-500/80 p-3 rounded-full flex-row items-center gap-2"
            >
              <Trash2 size={20} color="#fff" />
              <Text className="text-white font-bold text-sm hidden sm:block">Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowPreviewModal(false)}
              className="bg-zinc-800 p-3 rounded-full"
            >
              <X size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {selectedFiles.length > 0 && selectedFiles[previewIndex] && (
            <View className="w-full h-full justify-center items-center">
              <Image
                source={{ uri: selectedFiles[previewIndex].uri }}
                className="w-[90%] h-[70%]"
                resizeMode="contain"
              />
              {selectedFiles[previewIndex].type === 'video' && (
                <View className="absolute inset-0 justify-center items-center pointer-events-none">
                  <Text className="text-white text-4xl">▶</Text>
                </View>
              )}
            </View>
          )}

          {selectedFiles.length > 1 && (
            <>
              {previewIndex > 0 && (
                <TouchableOpacity
                  onPress={() => setPreviewIndex(previewIndex - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                >
                  <ChevronLeft size={32} color="#fff" />
                </TouchableOpacity>
              )}
              {previewIndex < selectedFiles.length - 1 && (
                <TouchableOpacity
                  onPress={() => setPreviewIndex(previewIndex + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full"
                >
                  <ChevronRight size={32} color="#fff" />
                </TouchableOpacity>
              )}
            </>
          )}

          {selectedFiles.length > 1 && (
            <View className="absolute bottom-8 flex-row gap-2">
              {selectedFiles.map((_, idx) => (
                <View
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === previewIndex ? 'bg-primary' : 'bg-zinc-600'}`}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}
