/**
 * storageService.ts
 * Gestione upload e lettura foto profilo su:
 * Bucket: gs://braciami-ancora.firebasestorage.app/users_photo/$fileName
 * con ridimensionamento massimo Full-HD (1920x1080), conversione in WebP
 * e sincronizzazione del campo `photoPath: "/users_photo/$fileName"` nella collection "users".
 */

import { auth, db, storage } from './firebase';
import { ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc
} from 'firebase/firestore';
import { convertDataUrlToFullHdWebp } from '../utils/imageSecurity';

export const STORAGE_BUCKET_GS_PREFIX = 'gs://braciami-ancora.firebasestorage.app';

export interface UploadProfilePhotoResult {
  downloadUrl: string;
  storagePath: string;
  photoPath: string; // "/users_photo/$fileName"
  gsUri: string;     // "gs://braciami-ancora.firebasestorage.app/users_photo/$fileName"
  fileName: string;
  width?: number;
  height?: number;
}

/**
 * Normalizza il nome file assicurando l'estensione .webp
 */
export function sanitizeStorageFileName(rawName: string, fallbackPrefix = 'profile'): string {
  const trimmed = (rawName || '').trim();
  if (!trimmed) {
    return `${fallbackPrefix}_${Date.now()}.webp`;
  }
  const withoutExt = trimmed.replace(/\.(jpg|jpeg|png|webp|gif|bmp)$/i, '');
  const cleanBase = withoutExt.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_') || `${fallbackPrefix}_${Date.now()}`;
  return `${cleanBase}.webp`;
}

/**
 * Converte un URL web (http/https) in DataURL WebP ridimensionato al massimo a Full-HD (1920x1080)
 * in modo da poter caricare il file nel bucket gs://braciami-ancora.firebasestorage.app/users_photo/$fileName
 */
export async function fetchWebImageAsDataUrl(
  imageUrl: string
): Promise<{ dataUrl: string; suggestedFileName: string; width?: number; height?: number }> {
  const cleanUrl = imageUrl.trim();
  let suggestedFileName = `web_photo_${Date.now()}.webp`;
  try {
    const parsed = new URL(cleanUrl, window.location.origin);
    const base = parsed.pathname.split('/').filter(Boolean).pop() || '';
    if (base) {
      suggestedFileName = sanitizeStorageFileName(decodeURIComponent(base), 'web_photo');
    }
  } catch {}

  if (cleanUrl.startsWith('data:')) {
    try {
      const converted = await convertDataUrlToFullHdWebp(cleanUrl);
      return {
        dataUrl: converted.dataUrl,
        suggestedFileName,
        width: converted.width,
        height: converted.height
      };
    } catch {
      return { dataUrl: cleanUrl, suggestedFileName };
    }
  }

  let rawDataUrl = '';

  // 1. Tentativo fetch diretto dal browser (funziona per URL locali /public o server con CORS)
  try {
    const res = await fetch(cleanUrl);
    if (res.ok) {
      const blob = await res.blob();
      if (blob.type.startsWith('image/') || blob.size > 0) {
        rawDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === 'string') resolve(reader.result);
            else reject(new Error('FileReader result non valido'));
          };
          reader.onerror = () => reject(new Error('Errore lettura blob'));
          reader.readAsDataURL(blob);
        });
      }
    }
  } catch {}

  // 2. Tentativo tramite endpoint proxy server (/api/fetch-web-image) per URL remoti senza CORS
  if (!rawDataUrl) {
    try {
      const proxyRes = await fetch(`/api/fetch-web-image?url=${encodeURIComponent(cleanUrl)}`);
      if (proxyRes.ok) {
        const data = await proxyRes.json();
        if (data && data.ok && typeof data.dataUrl === 'string') {
          rawDataUrl = data.dataUrl;
          if (data.fileName) {
            suggestedFileName = sanitizeStorageFileName(data.fileName, 'web_photo');
          }
        }
      }
    } catch {}
  }

  if (rawDataUrl) {
    try {
      const converted = await convertDataUrlToFullHdWebp(rawDataUrl);
      return {
        dataUrl: converted.dataUrl,
        suggestedFileName,
        width: converted.width,
        height: converted.height
      };
    } catch {
      return { dataUrl: rawDataUrl, suggestedFileName };
    }
  }

  return { dataUrl: cleanUrl, suggestedFileName };
}

/**
 * Ridimensiona al massimo a Full-HD (1920x1080), converte in WebP,
 * carica la foto in "gs://braciami-ancora.firebasestorage.app/users_photo/$fileName"
 * e aggiorna il documento nella collection "users" aggiungendo/modificando il campo:
 * photoPath: "/users_photo/$fileName"
 */
export async function uploadUserProfilePhoto(
  uid: string,
  sourceDataUrlOrWebUrl: string,
  explicitFileName?: string,
  userEmail?: string
): Promise<UploadProfilePhotoResult> {
  if (!uid) {
    throw new Error('Identificativo utente mancante per il caricamento su Storage');
  }

  let dataUrlToUpload = sourceDataUrlOrWebUrl.trim();
  let resolvedFileName = explicitFileName
    ? sanitizeStorageFileName(explicitFileName, uid)
    : sanitizeStorageFileName(`${uid}_${Date.now()}.webp`, uid);
  let finalWidth: number | undefined;
  let finalHeight: number | undefined;

  // Se la sorgente è un URL web/relativo (non data:), la scarichiamo e convertiamo in WebP Full-HD
  if (!dataUrlToUpload.startsWith('data:')) {
    const fetched = await fetchWebImageAsDataUrl(dataUrlToUpload);
    dataUrlToUpload = fetched.dataUrl;
    finalWidth = fetched.width;
    finalHeight = fetched.height;
    if (!explicitFileName && fetched.suggestedFileName) {
      resolvedFileName = fetched.suggestedFileName;
    }
  } else {
    // Assicuriamoci che il DataURL sia ridimensionato al massimo a Full-HD (1920x1080) e in formato image/webp
    try {
      const converted = await convertDataUrlToFullHdWebp(dataUrlToUpload);
      dataUrlToUpload = converted.dataUrl;
      finalWidth = converted.width;
      finalHeight = converted.height;
    } catch {}
  }

  // Percorso richiesto nel bucket gs://braciami-ancora.firebasestorage.app/users_photo/$fileName
  const storageRelativePath = `users_photo/${resolvedFileName}`;
  const photoPath = `/users_photo/${resolvedFileName}`;
  const gsUri = `${STORAGE_BUCKET_GS_PREFIX}/${storageRelativePath}`;

  let finalDownloadUrl = dataUrlToUpload;

  // 1. Caricamento su Firebase Cloud Storage: gs://braciami-ancora.firebasestorage.app/users_photo/$fileName
  if (dataUrlToUpload.startsWith('data:')) {
    try {
      const storageRef = ref(storage, storageRelativePath);
      const metadata = {
        contentType: 'image/webp',
        customMetadata: {
          ownerUid: uid,
          photoPath,
          gsUri,
          format: 'webp',
          maxResolution: 'Full-HD (1920x1080)',
          width: finalWidth ? String(finalWidth) : '',
          height: finalHeight ? String(finalHeight) : '',
          uploadedAt: new Date().toISOString()
        }
      };
      const snapshot = await uploadString(storageRef, dataUrlToUpload, 'data_url', metadata);
      const bucketUrl = await getDownloadURL(snapshot.ref);
      if (bucketUrl) {
        finalDownloadUrl = bucketUrl;
      }
    } catch {
      // Se le regole del bucket Storage richiedono un token custom, proseguiamo salvando il mirror su Firestore
    }
  }

  // 2. Persistenza su Firestore nella collection "users_photo/$fileName" per risoluzione immediata di "/users_photo/$fileName"
  try {
    await setDoc(
      doc(db, 'users_photo', resolvedFileName),
      {
        fileName: resolvedFileName,
        photoPath,
        gsUri,
        uid,
        email: userEmail || '',
        contentType: 'image/webp',
        width: finalWidth || null,
        height: finalHeight || null,
        downloadUrl: finalDownloadUrl,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch {}

  // 3. Aggiorna il documento nella collection "users" aggiungendo o modificando il campo photoPath con "/users_photo/$fileName"
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(
      userRef,
      {
        photoPath,
        photo_url: finalDownloadUrl
      },
      { merge: true }
    );

    if (userEmail) {
      const cleanEmail = userEmail.trim().toLowerCase();
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      for (const userDoc of snap.docs) {
        await setDoc(
          doc(db, 'users', userDoc.id),
          {
            photoPath,
            photo_url: finalDownloadUrl
          },
          { merge: true }
        );
      }
    }
  } catch {}

  return {
    downloadUrl: finalDownloadUrl,
    storagePath: storageRelativePath,
    photoPath,
    gsUri,
    fileName: resolvedFileName,
    width: finalWidth,
    height: finalHeight
  };
}

/**
 * Risolve un valore `photoPath` (es. "/users_photo/$fileName") in un URL visualizzabile nel browser,
 * interrogando il bucket "gs://braciami-ancora.firebasestorage.app/users_photo/$fileName" e il mirror Firestore.
 */
export async function resolvePhotoUrlFromPhotoPath(
  photoPath?: string,
  fallbackPhotoUrl?: string
): Promise<string> {
  if (!photoPath) {
    return fallbackPhotoUrl || '';
  }

  const cleanStoragePath = photoPath.replace(/^\/+/, ''); // "users_photo/$fileName"
  const fileName = cleanStoragePath.replace(/^users_photo\//, '');

  // 1. Prova a risolvere da Firestore "users_photo/$fileName"
  if (fileName) {
    try {
      const mirrorSnap = await getDoc(doc(db, 'users_photo', fileName));
      if (mirrorSnap.exists()) {
        const data = mirrorSnap.data();
        if (data?.downloadUrl) {
          return String(data.downloadUrl);
        }
      }
    } catch {}
  }

  // 2. Prova a risolvere direttamente da Firebase Storage gs://braciami-ancora.firebasestorage.app/users_photo/$fileName
  try {
    const storageRef = ref(storage, cleanStoragePath);
    const url = await getDownloadURL(storageRef);
    if (url) return url;
  } catch {}

  return fallbackPhotoUrl || '';
}

/**
 * All'apertura del profilo: legge dalla collection "users" il campo `photoPath`
 * e risolve l'immagine da presentare nel profilo.
 */
export async function readUserPhotoFromUsersCollection(
  uid: string,
  email?: string
): Promise<{ photoPath: string; displayUrl: string }> {
  let foundPhotoPath = '';
  let foundFallbackUrl = '';

  // 1. Legge doc(db, 'users', uid)
  if (uid) {
    try {
      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (typeof data.photoPath === 'string' && data.photoPath.trim()) {
          foundPhotoPath = data.photoPath.trim();
        }
        if (typeof data.photo_url === 'string' && data.photo_url.trim()) {
          foundFallbackUrl = data.photo_url.trim();
        }
      }
    } catch {}
  }

  // 2. Se non trovato per uid o se photoPath è vuoto, cerca nella collection "users" per email
  if ((!foundPhotoPath || !foundFallbackUrl) && email) {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        const data = d.data();
        if (!foundPhotoPath && typeof data.photoPath === 'string' && data.photoPath.trim()) {
          foundPhotoPath = data.photoPath.trim();
        }
        if (!foundFallbackUrl && typeof data.photo_url === 'string' && data.photo_url.trim()) {
          foundFallbackUrl = data.photo_url.trim();
        }
      }
    } catch {}
  }

  const displayUrl = await resolvePhotoUrlFromPhotoPath(foundPhotoPath, foundFallbackUrl);
  return {
    photoPath: foundPhotoPath,
    displayUrl
  };
}

/**
 * Rimuove una foto da Firebase Cloud Storage o da Firestore dato il suo URL o percorso
 */
export async function deleteUserProfilePhoto(photoUrlOrPath: string): Promise<void> {
  if (!photoUrlOrPath || photoUrlOrPath.startsWith('data:')) {
    return;
  }

  const cleanStoragePath = photoUrlOrPath.replace(/^\/+/, '');
  if (cleanStoragePath.startsWith('users_photo/')) {
    const fileName = cleanStoragePath.replace(/^users_photo\//, '');
    try {
      await deleteDoc(doc(db, 'users_photo', fileName));
    } catch {}
  }

  if (auth.currentUser) {
    try {
      const storageRef = ref(storage, cleanStoragePath);
      await deleteObject(storageRef);
    } catch {}
  }
}
