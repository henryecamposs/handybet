import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Send, MessageSquare, Heart, MoreVertical, Flag, ShieldAlert, UserPlus, UserMinus } from 'lucide-react-native';
import { localDB } from '../../lib/localDB';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useToastStore } from '../../store/useToastStore';
import { useThemeColors, withOpacity } from '../../hooks/useThemeColors';
import Logo from '../ui/Logo';
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
  const [openOptionsId, setOpenOptionsId] = useState<string | null>(null);
  const [followingUsers, setFollowingUsers] = useState<Record<string, boolean>>({});
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});

  const mockSession = useHandyBetStore(state => state.mockSession);
  const { addToast } = useToastStore();
  const colors = useThemeColors();

  const loadComments = React.useCallback(async (id: string) => {
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
  }, [onCommentsCountChange]);

  useEffect(() => {
    if (targetId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadComments(targetId);
    }
  }, [targetId, loadComments]);

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
          comments.map((comment) => {
            const isFollowing = !!followingUsers[comment.author_id];
            const isOptionsOpen = openOptionsId === comment.id;
            const isLiked = !!likedComments[comment.id];
            const baseLikes = (comment.content?.length || 10) % 20 + 3;
            const likeCount = baseLikes + (isLiked ? 1 : 0);

            return (
              <View key={comment.id} className="flex-row gap-3 mb-4 border-b border-zinc-800/50 pb-4 px-1 relative z-10">
                <Image source={{ uri: comment.author_avatar }} className="w-10 h-10 rounded-full" />
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-1">
                    <View className="flex-row items-center gap-1.5 flex-1 pr-2">
                      <Text className="text-white font-black text-sm" numberOfLines={1}>{comment.author_name}</Text>
                      <Text className="text-muted-foreground text-xs font-semibold" numberOfLines={1}>@usuario</Text>
                      <Text className="text-muted-foreground text-xs">·</Text>
                      <Text className="text-muted-foreground text-xs">
                        {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                    
                    {/* Action Bar Superior Derecha */}
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity 
                        onPress={() => setLikedComments(prev => ({ ...prev, [comment.id]: !isLiked }))}
                        className="flex-row items-center gap-1.5 p-1"
                      >
                        <Logo size="xs" showText={false} style={{ opacity: isLiked ? 1 : 0.4 }} />
                        <Text className={`text-xs font-bold ${isLiked ? 'text-primary' : 'text-muted-foreground'}`}>{likeCount}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => setOpenOptionsId(isOptionsOpen ? null : comment.id)}
                        className="p-1"
                      >
                        <MoreVertical size={16} color={colors.mutedForeground} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {/* Dropdown Options */}
                  {isOptionsOpen && (
                    <View className="absolute right-0 top-8 bg-background border border-primary/20 p-1.5 rounded-2xl w-48 z-50 shadow-2xl">
                      <TouchableOpacity
                        onPress={() => {
                          setOpenOptionsId(null);
                          addToast({ title: "Comentario reportado", variant: 'info', position: 'bottom' });
                        }}
                        className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
                      >
                        <Flag size={15} color={colors.foreground} />
                        <Text className="text-foreground text-xs font-semibold">Reportar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          setOpenOptionsId(null);
                          addToast({ title: "Usuario bloqueado", variant: 'warning', position: 'bottom' });
                        }}
                        className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
                      >
                        <ShieldAlert size={15} color="#ef4444" />
                        <Text className="text-red-500 text-xs font-semibold">Bloquear</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={() => {
                          setFollowingUsers(prev => ({ ...prev, [comment.author_id]: !isFollowing }));
                          setOpenOptionsId(null);
                          addToast({ 
                            title: isFollowing ? `Dejaste de seguir a ${comment.author_name}` : `Siguiendo a ${comment.author_name}`, 
                            variant: isFollowing ? 'muted' : 'secondary', 
                            position: 'bottom' 
                          });
                        }}
                        className="flex-row items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-900 transition-colors"
                      >
                        {isFollowing ? (
                          <UserMinus size={15} color={colors.primary} />
                        ) : (
                          <UserPlus size={15} color={colors.foreground} />
                        )}
                        <Text className={`text-xs font-semibold ${isFollowing ? 'text-primary' : 'text-foreground'}`}>
                          {isFollowing ? 'Dejar de seguir' : 'Seguir'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <Text className="text-foreground text-[15px] leading-relaxed mb-2 mt-1 pr-6">{comment.content}</Text>
                </View>
              </View>
            );
          })
        )}
      </View>
      <View className="h-16" />
    </View>
  );
}
