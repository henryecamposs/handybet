import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { localDB } from '../../lib/localDB';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useToastStore } from '../../store/useToastStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';

interface RepliesSectionProps {
  targetId: string;
  targetUsername: string;
  onCommentsCountChange?: (count: number) => void;
}

export default function RepliesSection({ targetId, targetUsername, onCommentsCountChange }: RepliesSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  const mockSession = useHandyBetStore(state => state.mockSession);
  const { addToast } = useToastStore();
  const colors = useThemeColors();

  useEffect(() => {
    if (targetId) {
      loadComments(targetId);
    }
  }, [targetId]);

  const loadComments = async (id: string) => {
    setLoadingComments(true);
    try {
      const allComments = await localDB.comments.getAll();
      const filtered = allComments.filter((c: any) => c.post_id === id);
      setComments(filtered);
      onCommentsCountChange?.(filtered.length);
    } catch (e) {
      console.error('Error cargando respuestas:', e);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleSendComment = async () => {
    if (!newComment.trim() || !targetId) return;
    setSubmittingComment(true);
    try {
      const payload = {
        post_id: targetId,
        author_id: mockSession?.id || 'usr_player1',
        author_name: mockSession?.name || 'Usuario',
        author_avatar: mockSession?.avatar || 'https://i.pravatar.cc/150',
        content: newComment.trim(),
        created_at: new Date().toISOString()
      };
      const created = await localDB.comments.insert(payload);
      const newComments = [...comments, created];
      setComments(newComments);
      onCommentsCountChange?.(newComments.length);
      setNewComment('');
      addToast({ title: 'Respuesta enviada con éxito', variant: 'success', position: 'bottom' });
    } catch (e) {
      console.error('Error al enviar comentario:', e);
      addToast({ title: 'Error al enviar la respuesta', variant: 'danger', position: 'bottom' });
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <View>
      {/* Input para responder estilo Twitter */}
      <View className="flex-row items-start gap-3 py-4 border-b border-primary/20">
        <Image source={{ uri: mockSession?.avatar || 'https://i.pravatar.cc/150' }} className="w-10 h-10 rounded-full" />
        <View className="flex-1">
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder={`Responder a ${targetUsername}...`}
            placeholderTextColor="#71717a"
            multiline
            className="text-white bg-primary/5 text-sm py-1.5 outline-none min-h-[44px]"
          />
          <View className="flex-row justify-end items-center mt-2">
            <TouchableOpacity
              disabled={!newComment.trim() || submittingComment}
              onPress={handleSendComment}
              className={`flex-row items-center gap-2 px-5 py-2 rounded-full ${newComment.trim() ? 'bg-primary' : 'bg-muted'
                }`}
            >
              <Text className={`font-bold text-xs uppercase ${newComment.trim() ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                {submittingComment ? 'Enviando...' : 'Responder'}
              </Text>
              {!submittingComment && <Send size={12} color={newComment.trim() ? colors.primaryForeground : colors.mutedForeground} />}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Lista de Comentarios / Respuestas */}
      <View className="py-4">
        <Text className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Respuestas</Text>

        {loadingComments ? (
          <ActivityIndicator size="small" color={colors.secondary} className="py-6" />
        ) : comments.length === 0 ? (
          <View className="py-8 items-center">
            <Text className="text-zinc-500 text-xs font-semibold">Sé el primero en responder a esto</Text>
          </View>
        ) : (
          comments.map((comment) => (
            <View key={comment.id} className="flex-row gap-3 mb-5 border-b border-zinc-800/20 pb-4">
              <Image source={{ uri: comment.author_avatar }} className="w-9 h-9 rounded-full" />
              <View className="flex-1 bg-primary/5 border border-primary/5 rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-white font-black text-xs">{comment.author_name}</Text>
                  <Text className="text-zinc-600 text-[10px] font-bold">
                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <Text className="text-foreground text-xs leading-relaxed mt-1 font-semibold">{comment.content}</Text>
              </View>
            </View>
          ))
        )}
      </View>
      <View className="h-16" />
    </View>
  );
}
