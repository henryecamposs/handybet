import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useHandyBetStore } from '../../store/useHandyBetStore'; // Force Metro cache invalidation

interface QRCameraScannerProps {
  onScanned: (code: string) => void;
  onClose?: () => void;
}

export default function QRCameraScanner({ onScanned, onClose }: QRCameraScannerProps) {
  const { setScannerActive, setActiveTicketCode } = useHandyBetStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-background/80 p-6">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="text-foreground font-bold mt-4 text-center">
          Solicitando permisos de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-background/80 p-6">
        <Text className="text-rose-500 font-black text-lg mb-4 text-center">
          Acceso a la Cámara Denegado
        </Text>
        <Text className="text-foreground text-sm font-bold text-center mb-6 px-8">
          Necesitamos acceso a la cámara para escanear los códigos QR de los tickets.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-primary px-6 py-3.5 rounded-xs border border-primary-600"
        >
          <Text className="text-foreground font-black text-sm">Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Regex para validación del bet_code: ^[0-9]{4}-[0-9]{6}$
  const qrPattern = /^[0-9]{4}-[0-9]{6}$/;

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    // Si ya fue escaneado, salimos
    if (scanned) return;

    if (qrPattern.test(data)) {
      setScanned(true); // Bloqueo reactivo inmediato local

      // Actualizar el estado en Zustand
      setActiveTicketCode(data);
      setScannerActive(false);

      // Invocar callback externo
      onScanned(data);
    }
  };

  return (
    <View className="flex-1 bg-background/80justify-between relative">
      {/* Cabecera */}
      <View className="absolute top-12 left-0 right-0 z-10 flex-row justify-between items-center px-6">
        <Text className="text-white font-black text-lg">Escanear Ticket</Text>
        {onClose && (
          <TouchableOpacity
            onPress={onClose}
            className="bg-background/60 p-2.5 rounded-full border border-zinc-700"
          >
            <Text className="text-white font-bold text-xs px-2">Cerrar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Visor de Cámara */}
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Retícula de Enfoque */}
        <View className="flex-1 justify-center items-center">
          <View className="w-64 h-64 border-2 border-secondary rounded-3xl relative">
            {/* Esquinas decorativas */}
            <View className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-secondary rounded-tl-xl" />
            <View className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-secondary rounded-tr-xl" />
            <View className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-secondary rounded-bl-xl" />
            <View className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-secondary rounded-br-xl" />
          </View>
          <Text className="text-white text-xs font-bold mt-6 bg-background/80 px-4 py-2 rounded-full border border-zinc-800">
            Alinea el código QR dentro del recuadro
          </Text>
        </View>
      </CameraView>

      {/* Footer */}
      {scanned && (
        <View className="absolute bottom-10 left-0 right-0 z-10 items-center px-6">
          <View className="bg-secondary/90 p-4 rounded-2xl border border-secondary w-full max-w-xs flex-row justify-center items-center gap-2">
            <ActivityIndicator color="#0f172a" />
            <Text className="text-foreground font-black text-sm">Procesando código...</Text>
          </View>
        </View>
      )}
    </View>
  );
}
