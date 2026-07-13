import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRDisplayZoneProps {
  betCode: string;
}

export default function QRDisplayZone({ betCode }: QRDisplayZoneProps) {
  return (
    <View className="bg-background/90 p-8 rounded-3xl border border-zinc-800 shadow-xl items-center max-w-sm w-full mx-auto my-4">
      <Text className="text-sm font-black text-foreground uppercase tracking-widest mb-4">
        Ticket de Apuesta
      </Text>

      {/* Contenedor del QR */}
      <View className="p-4 bg-white rounded-2xl shadow-inner mb-6 border border-zinc-700">
        <QRCode
          value={betCode}
          size={180}
          backgroundColor="white"
          color="black"
        />
      </View>

      {/* Código en Texto Plano */}
      <Text className="text-xs font-bold text-foreground uppercase tracking-widest mb-1.5">
        Código de Taquilla
      </Text>
      <Text className="text-2xl font-black text-secondary tracking-widest font-mono">
        {betCode}
      </Text>

      <Text className="text-foreground text-xs text-center font-bold mt-4 leading-relaxed px-4">
        Muestra este código QR al taquillero de la agencia de lotería para procesar tu jugada.
      </Text>
    </View>
  );
}
