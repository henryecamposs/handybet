import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { X, Users, Tv, User, UserCheck, Search, Share2 } from 'lucide-react-native';
import { useThemeColors } from '../../hooks/useThemeColors';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  onShareSuccess: (destinationName: string, type: string) => void;
}

const MOCK_DATA = {
  grupos: [
    { id: 'g1', name: 'Apuestas Combinadas VIP', members: '1,240 miembros', icon: Users },
    { id: 'g2', name: 'HandyBet Oficial Chat', members: '5,800 miembros', icon: Users },
    { id: 'g3', name: 'Pronósticos Liga Europea', members: '840 miembros', icon: Users },
  ],
  canales: [
    { id: 'c1', name: 'Canal de Datos Fijos', subscribers: '12,500 suscriptores', icon: Tv },
    { id: 'c2', name: 'Premium Tipster Club', subscribers: '3,200 suscriptores', icon: Tv },
    { id: 'c3', name: 'Noticias Deportivas', subscribers: '24,000 suscriptores', icon: Tv },
  ],
  usuarios: [
    { id: 'u1', username: '@carlos_bets', name: 'Carlos Mendoza', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 'u2', username: '@ana_pronosticos', name: 'Ana Silva', avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 'u3', username: '@luis_tips', name: 'Luis Pérez', avatar: 'https://i.pravatar.cc/150?u=3' },
  ],
  seguidos: [
    { id: 'f1', name: 'Pedro González', status: 'En línea', avatar: 'https://i.pravatar.cc/150?u=4' },
    { id: 'f2', name: 'María Rodríguez', status: 'Ausente', avatar: 'https://i.pravatar.cc/150?u=5' },
    { id: 'f3', name: 'Juan Pérez', status: 'En línea', avatar: 'https://i.pravatar.cc/150?u=6' },
  ],
};

type ShareTab = 'grupo' | 'canal' | 'usuario' | 'seguido';

export default function ShareModal({ visible, onClose, onShareSuccess }: ShareModalProps) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<ShareTab>('grupo');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const handleShare = () => {
    if (selectedName) {
      onShareSuccess(selectedName, activeTab);
      setSelectedItem(null);
      setSelectedName(null);
      setSearchQuery('');
      onClose();
    }
  };

  const getFilteredData = () => {
    const q = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'grupo':
        return MOCK_DATA.grupos.filter(g => g.name.toLowerCase().includes(q));
      case 'canal':
        return MOCK_DATA.canales.filter(c => c.name.toLowerCase().includes(q));
      case 'usuario':
        return MOCK_DATA.usuarios.filter(u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q));
      case 'seguido':
        return MOCK_DATA.seguidos.filter(f => f.name.toLowerCase().includes(q));
    }
  };

  const currentList = getFilteredData();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/75 justify-center items-center p-4">
        <View className="bg-background/80 border border-zinc-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-black text-xl flex-row items-center gap-2">
              <Share2 size={20} color={colors.primary} /> Compartir publicación
            </Text>
            <TouchableOpacity onPress={onClose} className="bg-zinc-900 p-2 rounded-full">
              <X size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Categorías (Pestañas) en fila */}
          <View className="flex-row border-b border-zinc-850 mb-4 justify-between">
            {(['grupo', 'canal', 'usuario', 'seguido'] as ShareTab[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => {
                    setActiveTab(tab);
                    setSelectedItem(null);
                    setSelectedName(null);
                  }}
                  className={`pb-2.5 px-2 capitalize flex-1 items-center border-b-2 ${isActive ? 'border-primary' : 'border-transparent'
                    }`}
                >
                  <Text className={`text-xs font-bold ${isActive ? 'text-primary' : 'text-zinc-500'}`}>
                    {tab === 'seguido' ? 'seguidos' : `${tab}s`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Barra de Búsqueda */}
          <View className="flex-row items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 mb-4">
            <Search size={16} color="#71717a" className="mr-2" />
            <TextInput
              placeholder={`Buscar ${activeTab}...`}
              placeholderTextColor="#71717a"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-white text-xs h-6 outline-none"
            />
          </View>

          {/* Lista de Destinos */}
          <ScrollView className="max-h-60 mb-6" showsVerticalScrollIndicator={false}>
            {currentList.length === 0 ? (
              <Text className="text-zinc-500 text-center py-8 text-xs font-bold">No se encontraron resultados</Text>
            ) : (
              currentList.map((item: any) => {
                const isSelected = selectedItem === item.id;
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setSelectedItem(item.id);
                      setSelectedName(item.name || item.username);
                    }}
                    className={`flex-row items-center gap-3 p-3 rounded-2xl mb-2 border ${isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-zinc-900/50 border-zinc-850 hover:bg-zinc-900 transition-colors'
                      }`}
                  >
                    {IconComponent ? (
                      <View className={`p-2.5 rounded-xl ${isSelected ? 'bg-primary/20' : 'bg-zinc-800'}`}>
                        <IconComponent size={18} color={isSelected ? colors.primary : '#a1a1aa'} />
                      </View>
                    ) : (
                      <Image source={{ uri: item.avatar }} className="w-10 h-10 rounded-full border border-zinc-800" />
                    )}

                    <View className="flex-1">
                      <Text className="text-white font-bold text-xs">{item.name || item.username}</Text>
                      {item.username && item.name && (
                        <Text className="text-zinc-500 text-[10px]">{item.username}</Text>
                      )}
                      <Text className="text-zinc-500 text-[10px] mt-0.5">
                        {item.members || item.subscribers || item.status}
                      </Text>
                    </View>

                    <View className={`w-4 h-4 rounded-full border items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-zinc-700'}`}>
                      {isSelected && <View className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Botones de acción */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl items-center"
            >
              <Text className="text-zinc-400 font-bold text-xs">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              disabled={!selectedItem}
              className={`flex-1 py-3 rounded-xl items-center ${selectedItem ? 'bg-primary' : 'bg-zinc-800'
                }`}
            >
              <Text className={`font-black text-xs uppercase ${selectedItem ? 'text-primary-foreground' : 'text-zinc-500'
                }`}>
                Compartir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
