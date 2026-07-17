import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { useHandyBetStore } from '../../store/useHandyBetStore';
import { useGetBetByCode, useConfirmQRBet, usePayoutQRBet } from '../../hooks/useHandyBetQueries';
import QRCameraScanner from '../../components/betting/QRCameraScanner';
import ThermalReceiptCard from '../../components/betting/ThermalReceiptCard';
import HandyBetLayout from '../../components/layout/HandyBetLayout';

export default function TaquillaScreen() {
  const { isScannerActive, setScannerActive, activeTicketCode, setActiveTicketCode } = useHandyBetStore();
  const [manualCode, setManualCode] = useState('');

  // Buscar apuesta por código de control
  const { data: bet, error: fetchError, isLoading: isLoadingBet } = useGetBetByCode(activeTicketCode);

  // Confirmar apuesta mutation (descontar de monedero de la agencia o cash externo)
  const confirmMutation = useConfirmQRBet();
  // Liquidar premio mutation (pago móvil o crédito en monedero)
  const payoutMutation = usePayoutQRBet();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cash_external'>('wallet');
  const [referenceCode, setReferenceCode] = useState('');

  const [payoutMethod, setPayoutMethod] = useState<'wallet_credit' | 'pago_movil'>('wallet_credit');
  const [payoutReference, setPayoutReference] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleManualSearch = () => {
    if (manualCode.trim()) {
      setActiveTicketCode(manualCode.trim());
      setMessage(null);
    }
  };

  const handleConfirmBet = async () => {
    if (!activeTicketCode || confirmMutation.isPending) return;
    setMessage(null);

    if (paymentMethod === 'cash_external' && !referenceCode.trim()) {
      setMessage({ type: 'error', text: 'La referencia de pago móvil o recibo es obligatoria para cobro externo.' });
      return;
    }

    try {
      const success = await confirmMutation.mutateAsync({
        betCode: activeTicketCode,
        paymentMethod,
        referenceCode: paymentMethod === 'cash_external' ? referenceCode.trim() : undefined,
      });

      if (success) {
        setMessage({ type: 'success', text: `¡Apuesta ${activeTicketCode} confirmada exitosamente en taquilla!` });
        setActiveTicketCode(null);
        setManualCode('');
        setReferenceCode('');
      } else {
        setMessage({ type: 'error', text: 'La transacción no pudo ser procesada.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error al procesar la apuesta.' });
    }
  };

  const handlePayoutBet = async () => {
    if (!activeTicketCode || payoutMutation.isPending) return;
    setMessage(null);

    if (payoutMethod === 'pago_movil' && !payoutReference.trim()) {
      setMessage({ type: 'error', text: 'La referencia del pago móvil bancario es obligatoria.' });
      return;
    }

    try {
      const success = await payoutMutation.mutateAsync({
        betCode: activeTicketCode,
        payoutMethod,
        paymentProof: payoutMethod === 'pago_movil' ? payoutReference.trim() : undefined,
      });

      if (success) {
        setMessage({ type: 'success', text: `¡Premio del ticket ${activeTicketCode} liquidado correctamente!` });
        setActiveTicketCode(null);
        setManualCode('');
        setPayoutReference('');
      } else {
        setMessage({ type: 'error', text: 'No se pudo liquidar el cobro.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Error al liquidar el pago.' });
    }
  };

  if (isScannerActive) {
    return (
      <QRCameraScanner
        onScanned={(code) => {
          setActiveTicketCode(code);
          setScannerActive(false);
          setMessage(null);
        }}
        onClose={() => setScannerActive(false)}
      />
    );
  }

  return (
    <HandyBetLayout title="Taquilla de Validación - Cajero">
      <ScrollView className="flex-1 bg-background/80 p-4 ">
        <View className="mb-6">
          <Text className="text-2xl font-black text-white tracking-tight">Consola de Operaciones</Text>
          <Text className="text-foreground text-xs font-bold mt-1">
            Escanea jugadas QR de clientes, valida e imprime comprobantes, o realiza liquidaciones de premios pendientes.
          </Text>
        </View>

        {/* Buscador QR y Manual */}
        <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <View className="bg-background/80 border border-zinc-850 p-6  justify-between">
            <View>
              <Text className="text-white font-black text-sm mb-4">Escanear Ticket QR</Text>
              <TouchableOpacity
                onPress={() => setScannerActive(true)}
                className="bg-secondary py-4 rounded-xs items-center border border-secondary active:scale-[0.98]"
              >
                <Text className="text-foreground font-black text-sm">📷 ESCANEAR CÓDIGO QR</Text>
              </TouchableOpacity>
            </View>

            <View className="border-t border-zinc-800 pt-6 mt-6">
              <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Ingresar Código Manual</Text>
              <View className="flex-row gap-2">
                <TextInput
                  placeholder="Ej: 1234-123456"
                  placeholderTextColor="#64748b"
                  value={manualCode}
                  onChangeText={setManualCode}
                  className="flex-1 bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-mono font-bold"
                />
                <TouchableOpacity
                  onPress={handleManualSearch}
                  className="bg-background/80 border border-zinc-750 justify-center px-6 rounded-xs"
                >
                  <Text className="text-white font-black text-xs">BUSCAR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Estado de Transacciones */}
          <View className="justify-center">
            {message && (
              <View className={`p-6  border ${message.type === 'success'
                ? 'bg-secondary/10 border-secondary/20'
                : 'bg-rose-500/10 border-rose-500/20'
                }`}>
                <Text className={`font-black text-sm ${message.type === 'success' ? 'text-secondary' : 'text-rose-500'}`}>
                  {message.type === 'success' ? '✓ Operación Exitosa' : '⚠️ Transacción Fallida'}
                </Text>
                <Text className="text-foreground text-xs font-bold mt-2 leading-relaxed">
                  {message.text}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Cargador */}
        {isLoadingBet && (
          <View className="py-20 justify-center items-center">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        )}

        {/* Mensaje de Error en Búsqueda */}
        {fetchError && (
          <View className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xs mb-6">
            <Text className="text-rose-500 text-xs font-bold text-center">
              ⚠️ No se pudo ubicar la jugada: {fetchError.message}
            </Text>
          </View>
        )}

        {/* Detalles del ticket encontrado y control contable */}
        {bet && !isLoadingBet && (
          <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-12">
            {/* Visualización del ticket */}
            <View>
              <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-3 text-center">Comprobante de Apuesta</Text>
              <ThermalReceiptCard bet={bet as any} />
            </View>

            {/* Acciones según el estado del ticket */}
            <View className="bg-background/80 border border-zinc-850 p-6 ">
              <Text className="text-white font-black text-base mb-4">Acciones de Taquilla</Text>

              {/* CASO A: Apuesta pendiente (Se debe confirmar y debitar balance del monedero del grupo) */}
              {bet.status === 'pendiente' && (
                <View>
                  <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Método de Confirmación</Text>
                  <View className="flex-row gap-2 mb-4">
                    <TouchableOpacity
                      onPress={() => setPaymentMethod('wallet')}
                      className={`flex-1 py-3 rounded-xs border items-center ${paymentMethod === 'wallet' ? 'bg-primary/10 border-primary' : 'bg-background/80 border-border'
                        }`}
                    >
                      <Text className={`font-bold text-xs ${paymentMethod === 'wallet' ? 'text-primary' : 'text-foreground'}`}>
                        DEBITAR WALLET
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setPaymentMethod('cash_external')}
                      className={`flex-1 py-3 rounded-xs border items-center ${paymentMethod === 'cash_external' ? 'bg-primary/10 border-primary' : 'bg-background/80 border-border'
                        }`}
                    >
                      <Text className={`font-bold text-xs ${paymentMethod === 'cash_external' ? 'text-primary' : 'text-foreground'}`}>
                        EFECTIVO / PAGO MÓVIL
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {paymentMethod === 'cash_external' && (
                    <View className="mb-4">
                      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Referencia de Pago</Text>
                      <TextInput
                        placeholder="Ej: Ref-987654"
                        placeholderTextColor="#64748b"
                        value={referenceCode}
                        onChangeText={setReferenceCode}
                        className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handleConfirmBet}
                    disabled={confirmMutation.isPending}
                    className="bg-primary py-4 rounded-xs items-center border border-primary-600 active:scale-[0.98]"
                  >
                    {confirmMutation.isPending ? (
                      <ActivityIndicator color="#0f172a" />
                    ) : (
                      <Text className="text-foreground font-black text-sm uppercase">
                        Confirmar Jugada y Registrar Bs. {bet.amount.toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* CASO B: Apuesta ganadora y no cobrada (Se debe liquidar el premio) */}
              {bet.status === 'ganadora' && (
                <View>
                  <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-3">Método de Liquidación de Premio</Text>
                  <View className="flex-row gap-2 mb-4">
                    <TouchableOpacity
                      onPress={() => setPayoutMethod('wallet_credit')}
                      className={`flex-1 py-3 rounded-xs border items-center ${payoutMethod === 'wallet_credit' ? 'bg-secondary/10 border-secondary' : 'bg-background/80 border-border'
                        }`}
                    >
                      <Text className={`font-bold text-xs ${payoutMethod === 'wallet_credit' ? 'text-secondary' : 'text-foreground'}`}>
                        CRÉDITO A WALLET
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setPayoutMethod('pago_movil')}
                      className={`flex-1 py-3 rounded-xs border items-center ${payoutMethod === 'pago_movil' ? 'bg-secondary/10 border-secondary' : 'bg-background/80 border-border'
                        }`}
                    >
                      <Text className={`font-bold text-xs ${payoutMethod === 'pago_movil' ? 'text-secondary' : 'text-foreground'}`}>
                        PAGO MÓVIL P2P
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {payoutMethod === 'pago_movil' && (
                    <View className="mb-4">
                      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-2">Referencia Bancaria</Text>
                      <TextInput
                        placeholder="Ej: 010212345678"
                        placeholderTextColor="#64748b"
                        value={payoutReference}
                        onChangeText={setPayoutReference}
                        className="bg-background/80 border border-border rounded-xs px-4 py-3 text-white font-bold"
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={handlePayoutBet}
                    disabled={payoutMutation.isPending}
                    className="bg-secondary py-4 rounded-xs items-center border border-secondary active:scale-[0.98]"
                  >
                    {payoutMutation.isPending ? (
                      <ActivityIndicator color="#0f172a" />
                    ) : (
                      <Text className="text-foreground font-black text-sm uppercase">
                        Liquidar Premio de Bs. {bet.potential_prize?.toFixed(2)}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* CASO C: Apuesta ya cobrada o expirada */}
              {(bet.status === 'confirmada' || bet.status === 'cobrada' || bet.status === 'perdedora') && (
                <View className="bg-background/80 p-4 rounded-xs border border-border">
                  <Text className="text-foreground text-xs font-bold text-center">
                    Esta jugada se encuentra en estado: <Text className="text-secondary uppercase font-black">{bet.status}</Text>
                  </Text>
                  <Text className="text-foreground text-[10px] text-center mt-2">
                    No se requieren acciones adicionales de cobro ni débito.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => setActiveTicketCode(null)}
                className="mt-4 py-3 rounded-xs items-center bg-background/80 border border-zinc-850"
              >
                <Text className="text-foreground font-bold text-xs uppercase">Limpiar Pantalla</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </HandyBetLayout>
  );
}
