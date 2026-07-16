import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useThemeColors } from '../../../hooks/useThemeColors';
import { localDB } from '../../../lib/localDB';
import { socialService } from '../../../services/socialService';
import { useHandyBetStore } from '../../../store/useHandyBetStore';
import { useToastStore } from '../../../store/useToastStore';

interface FriendRequestsCenterViewProps {
  currentView: 'all-follow-suggestions' | 'follow-suggestion-detail';
  selectedItemId: string | null;
  onBack: () => void;
}

export default function FriendRequestsCenterView({ currentView, selectedItemId, onBack }: FriendRequestsCenterViewProps) {
  const colors = useThemeColors();
  const { mockSession } = useHandyBetStore();
  const { addToast } = useToastStore();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [followedStates, setFollowedStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const userId = mockSession?.id || 'usr_henry';

  useEffect(() => {
    loadSuggestions();
  }, [userId]);

  const loadSuggestions = async () => {
    try {
      setLoading(true);
      const allSuggestions = await localDB.relationships.getFriendSuggestions(userId);
      const resolved = await Promise.all(allSuggestions.map(async (s: any) => {
        const user = await localDB.users.getById(s.suggested_id);
        const isFollowing = await localDB.relationships.isFollowing(userId, s.suggested_id);
        return {
          id: s.id,
          suggestedId: s.suggested_id,
          name: user?.full_name || 'Usuario',
          avatar: user?.avatar_url || 'https://i.pravatar.cc/150',
          time: '2 d',
          mutualFollowers: s.mutual_followers || 0,
          reason: s.reason,
          isFollowing
        };
      }));
      setSuggestions(resolved);

      const states: Record<string, boolean> = {};
      resolved.forEach(r => {
        states[r.id] = r.isFollowing;
      });
      setFollowedStates(states);
    } catch (e) {
      console.warn('[Suggestions] Error loading suggestions:', e);
    } finally {
      setLoading(false);
    }
  };

  if (currentView !== 'all-follow-suggestions' && currentView !== 'follow-suggestion-detail') return null;

  const toggleFollow = async (suggestion: any) => {
    const isCurrentlyFollowing = !!followedStates[suggestion.id];
    const newFollowingState = !isCurrentlyFollowing;

    // Optimistic update
    setFollowedStates(prev => ({ ...prev, [suggestion.id]: newFollowingState }));

    try {
      if (newFollowingState) {
        await socialService.followUser(userId, suggestion.suggestedId);
        addToast({
          title: `Siguiendo a ${suggestion.name}`,
          variant: 'secondary',
          position: 'top-right'
        });
      } else {
        await socialService.unfollowUser(userId, suggestion.suggestedId);
        addToast({
          title: `Dejaste de seguir a ${suggestion.name}`,
          variant: 'muted',
          position: 'top-right'
        });
      }
    } catch (e) {
      console.warn('[Suggestions] Follow toggle failed:', e);
      // Revert state on error
      setFollowedStates(prev => ({ ...prev, [suggestion.id]: isCurrentlyFollowing }));
    }
  };

  const selectedSuggestion = suggestions.find(s => s.id === selectedItemId);

  return (
    <View className="flex-1 bg-background">
      {/* Header estilo Backend */}
      <View className="flex-row items-center border-b border-primary/20 py-2 px-4 bg-background/80 sticky top-0 z-10">
        <TouchableOpacity onPress={onBack} className="mr-3 p-1 rounded-full hover:bg-primary/20">
          <ArrowLeft size={22} color={colors.foreground} />
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <Text className="text-foreground font-bold text-lg">Sugerencias</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {currentView === 'all-follow-suggestions' && (
          <Text className="text-xl font-bold text-foreground mb-4">Sugerencias para ti</Text>
        )}

        {currentView === 'all-follow-suggestions' ? (
          <View className="flex-col gap-4">
            {suggestions.map(req => {
              const isFollowing = !!followedStates[req.id];
              return (
                <View key={req.id} className="py-4 flex-row items-center gap-4 border-b border-zinc-800/80 hover:bg-zinc-900/50 transition-colors">
                  <Image source={{ uri: req.avatar }} className="w-16 h-16 rounded-full border border-primary/20" />
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="font-semibold text-foreground text-lg">{req.name}</Text>
                      <Text className="text-muted-foreground text-sm">{req.time}</Text>
                    </View>
                    <Text className="text-secondary text-sm mb-1">{req.mutualFollowers} seguidores en común</Text>
                    <Text className="text-muted-foreground text-xs mb-3">{req.reason}</Text>
                    <View className="flex-row gap-2 max-w-[250px]">
                      <TouchableOpacity
                        onPress={() => toggleFollow(req)}
                        className={`flex-1 py-2 rounded-lg items-center ${isFollowing ? 'bg-background/80 border border-zinc-700' : 'bg-primary'}`}
                      >
                        <Text className={`font-bold text-sm ${isFollowing ? 'text-foreground' : 'text-primary-foreground'}`}>
                          {isFollowing ? 'Siguiendo' : 'Seguir'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-1 bg-background/80 py-2 rounded-lg items-center border border-zinc-700">
                        <Text className="text-foreground font-bold text-sm">Descartar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          (() => {
            const req = selectedSuggestion;
            if (!req) return null;
            const isFollowing = !!followedStates[req.id];
            return (
              <View className="py-8 flex-col items-center max-w-2xl mx-auto w-full">
                <Image source={{ uri: req.avatar }} className="w-24 h-24 rounded-full border-2 border-primary/20 mb-4" />
                <View className="items-center">
                  <Text className="font-bold text-foreground text-2xl mb-1">{req.name}</Text>
                  <Text className="text-secondary text-md mb-2">{req.mutualFollowers} seguidores en común</Text>
                  <Text className="text-muted-foreground text-sm mb-4 text-center">{req.reason}</Text>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => toggleFollow(req)}
                      className={`flex-1 py-3 rounded-lg items-center ${isFollowing ? 'bg-background/80 border border-zinc-700' : 'bg-primary'}`}
                    >
                      <Text className={`font-bold text-md ${isFollowing ? 'text-foreground' : 'text-primary-foreground'}`}>
                        {isFollowing ? 'Siguiendo' : 'Seguir Cuenta'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-background/80 py-3 rounded-lg items-center border border-zinc-700">
                      <Text className="text-foreground font-bold text-md">Descartar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })()
        )}
      </ScrollView>
    </View>
  );
}
