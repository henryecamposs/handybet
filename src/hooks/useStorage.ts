import { useState, useCallback } from 'react';
import { storageService, StorageBucket, UploadResult } from '../services/storageService';

export interface UseStorageOptions {
  bucket: StorageBucket;
}

/**
 * Custom React Hook para la gestión simplificada de subida y almacenamiento multimedia en Supabase.
 * Organiza los archivos automáticamente bajo la estructura: `{bucket}/{entityId}/{timestamp}.{extension}`
 * 
 * Ejemplo de uso:
 * const { uploadEntityFile, isUploading } = useStorage('avatars');
 * const res = await uploadEntityFile(userId, fileBlob, 'jpg');
 */
export function useStorage(defaultBucket: StorageBucket) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sube un archivo organizando automáticamente la subcarpeta por `entityId`
   * (ID del grupo, canal, usuario/miembro, post, etc.) y guardándolo como `{timestamp}.{extension}`
   */
  const uploadEntityFile = useCallback(
    async (
      entityId: string,
      fileBlob: Blob | File,
      fileExtension = 'jpg',
      targetBucket?: StorageBucket
    ): Promise<UploadResult | null> => {
      const bucket = targetBucket || defaultBucket;
      setIsUploading(true);
      setError(null);

      try {
        const result = await storageService.uploadEntityFile(
          bucket,
          entityId,
          fileBlob,
          fileExtension
        );

        if (!result) {
          setError(`No se pudo subir el archivo al almacenamiento en el bucket ${bucket}`);
        }

        return result;
      } catch (err: any) {
        const msg = err?.message || 'Error inesperado al cargar el archivo';
        console.error('[useStorage] Error:', msg);
        setError(msg);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [defaultBucket]
  );

  /**
   * Elimina uno o más archivos de la ruta especificada
   */
  const deleteFile = useCallback(
    async (paths: string[], targetBucket?: StorageBucket): Promise<boolean> => {
      const bucket = targetBucket || defaultBucket;
      setError(null);
      try {
        return await storageService.deleteFile(bucket, paths);
      } catch (err: any) {
        const msg = err?.message || 'Error al eliminar el archivo';
        setError(msg);
        return false;
      }
    },
    [defaultBucket]
  );

  /**
   * Genera una URL firmada con tiempo de expiración para recursos privados
   */
  const getSignedUrl = useCallback(
    async (path: string, expiresInSeconds = 3600, targetBucket?: StorageBucket): Promise<string | null> => {
      const bucket = targetBucket || defaultBucket;
      return storageService.getSignedUrl(bucket, path, expiresInSeconds);
    },
    [defaultBucket]
  );

  return {
    uploadEntityFile,
    deleteFile,
    getSignedUrl,
    isUploading,
    error,
  };
}

export default useStorage;
