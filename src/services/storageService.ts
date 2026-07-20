import { supabase } from '../lib/supabaseClient';

export type StorageBucket = 'avatars' | 'covers' | 'posts' | 'receipts' | 'media_vault';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Servicio de almacenamiento multimedia para HandyBet (Supabase Storage)
 * Garantiza la estructura estandarizada: `{bucket}/{entityId}/{timestamp}.{extension}`
 */
export const storageService = {
  /**
   * Genera la ruta estructurada por ID de entidad y Timestamp: `{entityId}/{timestamp}.{extension}`
   */
  generateEntityPath(entityId: string, extension: string = 'jpg'): string {
    const cleanExt = extension.replace(/^\./, '');
    const timestamp = Date.now();
    return `${entityId}/${timestamp}.${cleanExt}`;
  },

  /**
   * Sube un archivo a un bucket de Supabase indicando la ruta directa
   */
  async uploadFile(
    bucket: StorageBucket,
    filePath: string,
    fileBlob: Blob | File
  ): Promise<UploadResult | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileBlob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error(`Error al subir archivo a ${bucket}:`, error.message);
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
      };
    } catch (err) {
      console.error('Error imprevisto en storageService.uploadFile:', err);
      return null;
    }
  },

  /**
   * Sube un archivo organizando automáticamente la subcarpeta por `entityId`
   * (ID de grupo, canal, miembro, post, receipt, etc.) y nombrando el archivo como `{timestamp}.{extension}`
   */
  async uploadEntityFile(
    bucket: StorageBucket,
    entityId: string,
    fileBlob: Blob | File,
    fileExtension: string = 'jpg'
  ): Promise<UploadResult | null> {
    const filePath = this.generateEntityPath(entityId, fileExtension);
    return this.uploadFile(bucket, filePath, fileBlob);
  },

  /**
   * Elimina uno o más archivos de un bucket específico
   */
  async deleteFile(
    bucket: StorageBucket,
    paths: string[]
  ): Promise<boolean> {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) {
      console.error(`Error al eliminar archivo de ${bucket}:`, error.message);
      return false;
    }
    return true;
  },

  /**
   * Genera una URL firmada con tiempo de expiración para multimedia privada
   */
  async getSignedUrl(
    bucket: StorageBucket,
    path: string,
    expiresInSeconds = 3600
  ): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      console.error('Error al generar URL firmada:', error.message);
      return null;
    }
    return data.signedUrl;
  }
};
