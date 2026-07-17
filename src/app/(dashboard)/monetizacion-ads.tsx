import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { localDB } from '../../lib/localDB';
import { adRegistrationSchema } from '../../schemas/handyBet';
import { z } from 'zod';
import { Advertisement, Transaction } from '../../types/handyBet';

export default function MonetizacionAdsScreen() {
  // Estados de Anuncios
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState('');

  const [businessName, setBusinessName] = useState('');
  const [businessRif, setBusinessRif] = useState('');
  const [businessContact, setBusinessContact] = useState('');
  const [adCopy, setAdCopy] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [targetDeeplink, setTargetDeeplink] = useState('');

  // Estados de Ledger de Retiros / Egresos
  const [pendingWithdrawals, setPendingWithdrawals] = useState<(Transaction & { username?: string })[]>([]);
  const [processingTxId, setProcessingTxId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingAd, setIsSubmittingAd] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [adSuccessMessage, setAdSuccessMessage] = useState<string | null>(null);

  async function fetchDashboardData() {
    try {
      setIsLoading(true);

      // 1. Obtener mis canales del localDB
      const channelsData = await localDB.channels.getAll();
      const userChannels = channelsData.filter((c: any) => c.owner_id === 'usr_henry');
      setChannels(userChannels || []);
      if (userChannels && userChannels.length > 0) {
        setSelectedChannel(userChannels[0].id);
      }

      // 2. Obtener anuncios del localDB
      const adsData = await localDB.ads.getAll();
      setAds(adsData || []);

      // 3. Obtener egresos/retiros pendientes (simulados en local)
      const txData = [
        { id: 'tx_w1', amount: 1500.00, type: 'retiro', status: 'pendiente', reference_code: null, receipt_image_url: null, processed_by: null, wallet_id: 'w1', created_at: new Date().toISOString(), username: 'carlos_ruiz' },
        { id: 'tx_w2', amount: 350.00, type: 'retiro', status: 'pendiente', reference_code: null, receipt_image_url: null, processed_by: null, wallet_id: 'w2', created_at: new Date().toISOString(), username: 'maria_gonzalez' }
      ];
      setPendingWithdrawals(txData as any);

    } catch (err) {
      console.log('Error fetching dashboard details:', err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      fetchDashboardData();
    }, 0);
  }, []);

  const handleRegisterAd = async () => {
    setValidationError(null);
    setAdSuccessMessage(null);
    setIsSubmittingAd(true);

    const payload = {
      businessName,
      businessRif,
      businessContact,
      adCopy,
      mediaUrl,
      costAmount: parseFloat(costAmount),
    };

    try {
      // Validación estricta Zod (RIF y URLs)
      adRegistrationSchema.parse(payload);

      if (!selectedChannel) {
        setValidationError('Por favor, selecciona un canal asociado.');
        setIsSubmittingAd(false);
        return;
      }

      await localDB.ads.insert({
        id: localDB.generateId('ad'),
        channel_id: selectedChannel,
        business_name: businessName,
        business_rif: businessRif,
        business_contact: businessContact,
        ad_copy: adCopy,
        media_url: mediaUrl,
        target_deeplink: targetDeeplink || null,
        cost_amount: parseFloat(costAmount),
        is_active: true,
      } as any);

      setAdSuccessMessage('Anuncio registrado y activado comercialmente.');
      // Limpiar Form
      setBusinessName('');
      setBusinessRif('');
      setBusinessContact('');
      setAdCopy('');
      setMediaUrl('');
      setCostAmount('');
      setTargetDeeplink('');
      fetchDashboardData();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.issues[0]?.message || 'Formato de anuncio inválido.');
      } else {
        setValidationError((err as any)?.message || 'Error al guardar el anuncio.');
      }
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const handleApproveWithdrawal = async (txId: string) => {
    if (processingTxId) return;
    setProcessingTxId(txId);

    try {
      const reference = prompt('Ingrese el código de referencia del egreso bancario:');
      if (!reference) {
        setProcessingTxId(null);
        return;
      }

      setPendingWithdrawals(prev => prev.filter(t => t.id !== txId));
      alert('Egreso bancario liquidado con éxito.');
    } catch (err: any) {
      alert(err.message || 'Error al aprobar egreso.');
    } finally {
      setProcessingTxId(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background/80 p-6 md:p-12">
      <View className="mb-8">
        <Text className="text-3xl font-black text-white tracking-tight">Monetización y Publicidad</Text>
        <Text className="text-foreground text-xs font-bold mt-1">
          Crea campañas patrocinadas para el muro social y procesa egresos por cobro de premios de forma contable.
        </Text>
      </View>

      {isLoading ? (
        <View className="py-20 justify-center items-center">
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">

          {/* Registro de Anuncios */}
          <View className="bg-background/80 border border-border p-8  shadow-xl w-full">
            <Text className="text-white font-black text-lg mb-6">Pauta Publicitaria Comercial</Text>

            {validationError && (
              <View className="bg-rose-500/10 border border-rose-500/20 p-4  mb-4">
                <Text className="text-rose-500 text-xs font-bold text-center">⚠️ {validationError}</Text>
              </View>
            )}

            {adSuccessMessage && (
              <View className="bg-secondary/10 border border-secondary/20 p-4  mb-4">
                <Text className="text-secondary text-xs font-bold text-center">✓ {adSuccessMessage}</Text>
              </View>
            )}

            <View className="space-y-4">
              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Nombre Comercial</Text>
                <TextInput
                  placeholder="Empresa o Negocio"
                  placeholderTextColor="#64748b"
                  value={businessName}
                  onChangeText={setBusinessName}
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">RIF Corporativo (Venezuela)</Text>
                <TextInput
                  placeholder="Ej: J-12345678-9"
                  placeholderTextColor="#64748b"
                  value={businessRif}
                  onChangeText={setBusinessRif}
                  autoCapitalize="characters"
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-mono font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Teléfono / Contacto</Text>
                <TextInput
                  placeholder="Ej: 04121234567"
                  placeholderTextColor="#64748b"
                  value={businessContact}
                  onChangeText={setBusinessContact}
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Copy / Texto de Anuncio</Text>
                <TextInput
                  placeholder="Texto publicitario que se mostrará en el muro..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                  value={adCopy}
                  onChangeText={setAdCopy}
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>

              <View>
                <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">URL de Banner Gráfico</Text>
                <TextInput
                  placeholder="https://servidor.com/imagen.jpg"
                  placeholderTextColor="#64748b"
                  value={mediaUrl}
                  onChangeText={setMediaUrl}
                  className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                />
              </View>

              <View className="grid grid-cols-2 gap-4">
                <View>
                  <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Costo Campaña (Bs.)</Text>
                  <TextInput
                    placeholder="250.00"
                    placeholderTextColor="#64748b"
                    keyboardType="numeric"
                    value={costAmount}
                    onChangeText={setCostAmount}
                    className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                  />
                </View>
                <View>
                  <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">Redirección Deeplink</Text>
                  <TextInput
                    placeholder="handyBet://grupo/id"
                    placeholderTextColor="#64748b"
                    value={targetDeeplink}
                    onChangeText={setTargetDeeplink}
                    className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegisterAd}
              disabled={isSubmittingAd}
              className="bg-secondary py-4  items-center border border-secondary mt-6 active:scale-[0.98]"
            >
              {isSubmittingAd ? (
                <ActivityIndicator color="#0f172a" />
              ) : (
                <Text className="text-foreground font-black text-sm uppercase">Registrar y Activar Anuncio</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Egresos Pendientes / Ledger */}
          <View className="bg-background/80 border border-border p-8  shadow-xl w-full">
            <Text className="text-white font-black text-lg mb-6">Premios y Retiros por Liquidar</Text>

            {pendingWithdrawals.length === 0 ? (
              <View className="py-12 justify-center items-center">
                <Text className="text-foreground font-bold text-sm text-center">
                  No se registran solicitudes de retiros o premios pendientes.
                </Text>
              </View>
            ) : (
              <View className="space-y-4">
                {pendingWithdrawals.map((tx) => (
                  <View
                    key={tx.id}
                    className="bg-background/60 border border-border p-5  flex-row justify-between items-center shadow-sm"
                  >
                    <View>
                      <Text className="text-white font-black text-sm">@{tx.username}</Text>
                      <Text className="text-foreground text-[10px] font-bold uppercase mt-1">
                        Solicitud de Egresos • Bs. {tx.amount.toFixed(2)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleApproveWithdrawal(tx.id)}
                      disabled={processingTxId === tx.id}
                      className="bg-secondary px-4 py-2.5 rounded-xs border border-secondary active:scale-[0.98]"
                    >
                      {processingTxId === tx.id ? (
                        <ActivityIndicator color="#0f172a" size="small" />
                      ) : (
                        <Text className="text-foreground font-black text-xs uppercase">Liquidar</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

        </View>
      )}
    </ScrollView>
  );
}
