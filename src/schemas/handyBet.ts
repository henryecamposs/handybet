import { z } from 'zod';

// Validación estricta del JSON que compone la matriz de la apuesta
export const betPayloadSchema = z.object({
  lotteryId: z.string().min(1, "Debe indicar una lotería válida."),
  schedule: z.string().min(1, "Especifique el horario de cierre del sorteo."),
  gameType: z.enum(['triple', 'terminal', 'animalito', 'permuta']),
  selections: z.array(z.object({
    number: z.string().min(2, "Mínimo 2 dígitos").max(3, "Máximo 3 dígitos"),
    multiplier: z.number().positive("El monto por línea debe ser mayor a cero.")
  })).min(1, "Debe ingresar al menos una combinación de apuesta."),
  totalAmount: z.number().positive("El importe total debe ser un número positivo.")
});

// Validación para el registro de Publicidad Comercial Corporativa
export const adRegistrationSchema = z.object({
  businessName: z.string().min(3, "Nombre comercial de la empresa requerido."),
  businessRif: z.string().regex(/^[JGVEE]-[0-9]{8}-[0-9]$/, "RIF inválido. Use el formato estándar (Ej: J-12345678-9)."),
  businessContact: z.string().min(10, "Escriba un teléfono o canal de contacto corporativo válido."),
  adCopy: z.string().min(10, "El texto publicitario debe contener descripciones claras."),
  mediaUrl: z.string().url("Se requiere un banner gráfico o recurso promocional alojado."),
  costAmount: z.number().positive("La tasa comercial de publicación debe ser mayor a cero.")
});

// Validación de creación de Planes de Contenido Personalizados
export const mediaPlanSchema = z.object({
  groupId: z.string().uuid(),
  name: z.string().min(3, "Asigne un nombre descriptivo al plan (Ej: Plan HandyBet)."),
  price: z.number().min(0, "El valor de la suscripción no puede ser inferior a cero."),
  maxPhotos: z.number().int().nonnegative("Defina un tope válido de fotografías permitidas."),
  maxVideos: z.number().int().nonnegative("Defina un tope válido de videos permitido."),
  durationDays: z.number().int().positive("Los días de cobertura comercial deben ser positivos.")
});
