import { supabase } from '../lib/supabaseClient';

export interface UploadResult {
  path: string;
  publicUrl: string;
}

/**
 * Servicio de almacenamiento multimedia para HandyBet (Supabase Storage)
 */
export const storageService = {
  /**
   * Sube un archivo a un bucket de Supabase (ej: 'avatars', 'covers', 'posts', 'receipts')
   */
  async uploadFile(
    bucket: 'avatars' | 'covers' | 'posts' | 'receipts' | 'media_vault',
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
   * Elimina un archivo del bucket correspondiente
   */
  async deleteFile(
    bucket: 'avatars' | 'covers' | 'posts' | 'receipts' | 'media_vault',
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
    bucket: string,
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
