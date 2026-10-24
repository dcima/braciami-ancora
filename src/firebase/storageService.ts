/**
 * storageService.ts
 * Gestione upload e cancellazione asset su Firebase Cloud Storage
 * Bucket: gs://braciami-ancora.firebasestorage.app
 */

import { storage } from './firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';

export interface UploadProfilePhotoResult {
  downloadUrl: string;
  storagePath: string;
}

/**
 * Carica una foto profilo sanificata in Firebase Cloud Storage
 * @param uid Identificativo univoco dell'utente
 * @param sanitizedDataUrl Stringa Base64 Data URL (formato WebP o JPEG)
 */
export async function uploadUserProfilePhoto(
  uid: string,
  sanitizedDataUrl: string
): Promise<UploadProfilePhotoResult> {
  if (!uid) {
    throw new Error('Identificativo utente mancante per il caricamento su Storage');
  }

  // Percorso storage organizzato per utente
  const timestamp = Date.now();
  const storagePath = `users/${uid}/profile_photo_${timestamp}.webp`;
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: 'image/webp',
    customMetadata: {
      ownerUid: uid,
      uploadedAt: new Date().toISOString(),
      sanitized: 'true'
    }
  };

  try {
    // Caricamento della stringa DataURL su Firebase Storage
    const snapshot = await uploadString(storageRef, sanitizedDataUrl, 'data_url', metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      downloadUrl,
      storagePath
    };
  } catch (err: any) {
    console.warn('[Firebase Storage] Upload su Cloud Storage non riuscito, fallback locale:', err);
    // Se lo Storage fallisce (es. regole bucket in fase di setup), restituiamo comunque il dataUrl per non bloccare l'interfaccia
    return {
      downloadUrl: sanitizedDataUrl,
      storagePath: ''
    };
  }
}

/**
 * Rimuove una foto da Firebase Cloud Storage dato il suo URL o percorso
 */
export async function deleteUserProfilePhoto(photoUrlOrPath: string): Promise<void> {
  if (!photoUrlOrPath || photoUrlOrPath.startsWith('data:')) {
    return;
  }

  try {
    const storageRef = ref(storage, photoUrlOrPath);
    await deleteObject(storageRef);
  } catch (err) {
    // Non bloccare se il file non esiste più o è già stato cancellato
    console.info('[Firebase Storage] Info cancellazione file precedente:', err);
  }
}
