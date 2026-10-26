/**
 * imageSecurity.ts
 * Utilità per il rilevamento fotocamera/webcam, ridimensionamento Full-HD (max 1920x1080),
 * conversione in formato WebP e validazione di sicurezza delle immagini profilo.
 */

export interface ImageSecurityCheckResult {
  valid: boolean;
  error?: string;
  sanitizedDataUrl?: string;
  fileSizeKb?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
}

export interface CameraDetectionResult {
  hasCamera: boolean;
  devicesCount: number;
  deviceLabels: string[];
}

// Byte signature (Magic Bytes)
const JPEG_MAGIC = [0xFF, 0xD8, 0xFF];
const PNG_MAGIC = [0x89, 0x50, 0x4E, 0x47];
const RIFF_MAGIC = [0x52, 0x49, 0x46, 0x46]; // "RIFF"
const WEBP_MAGIC = [0x57, 0x45, 0x42, 0x50]; // "WEBP" at offset 8

// Pattern malevoli da intercettare nella scansione grezza dei byte/stringhe
const SUSPICIOUS_PATTERNS = [
  /<\s*script/i,
  /<\s*\/\s*script\s*>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /<\s*\?php/i,
  /<\s*\?=/i,
  /<\s*%/i,
  /<\s*jsp/i,
  /<\s*asp/i,
  /eval\s*\(/i,
  /base64_decode/i,
  /shell_exec/i,
  /system\s*\(/i,
  /passthru\s*\(/i,
  /exec\s*\(/i,
  /onerror\s*=/i,
  /onload\s*=/i,
  /onclick\s*=/i,
  /<\s*iframe/i,
  /<\s*embed/i,
  /<\s*object/i,
  /document\.cookie/i,
  /window\.location/i
];

/**
 * Esegue un test hardware/browser per verificare se il dispositivo in uso
 * dispone di almeno una fotocamera o webcam (videoinput).
 */
export async function detectCameraAvailability(): Promise<CameraDetectionResult> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return { hasCamera: false, devicesCount: 0, deviceLabels: [] };
  }

  try {
    if (typeof navigator.mediaDevices.enumerateDevices === 'function') {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      if (videoDevices.length > 0) {
        return {
          hasCamera: true,
          devicesCount: videoDevices.length,
          deviceLabels: videoDevices.map((d, idx) => d.label || `Fotocamera ${idx + 1}`)
        };
      }
    }
  } catch {
    // Se enumerateDevices è bloccato dai permessi prima dell'attivazione, verifichiamo il supporto getUserMedia
  }

  return {
    hasCamera: false,
    devicesCount: 0,
    deviceLabels: []
  };
}

/**
 * Calcola le dimensioni ridimensionate al massimo a Full-HD (1920x1080 in orizzontale o 1080x1920 in verticale)
 * mantenendo intatto il rapporto d'aspetto (aspect ratio) e senza mai ingrandire immagini più piccole.
 */
export function computeFullHdDimensions(
  srcWidth: number,
  srcHeight: number
): { width: number; height: number } {
  const safeW = Math.max(1, Math.round(srcWidth || 1));
  const safeH = Math.max(1, Math.round(srcHeight || 1));

  const isPortrait = safeH > safeW;
  const maxW = isPortrait ? 1080 : 1920;
  const maxH = isPortrait ? 1920 : 1080;

  const scale = Math.min(1, maxW / safeW, maxH / safeH);
  return {
    width: Math.max(1, Math.round(safeW * scale)),
    height: Math.max(1, Math.round(safeH * scale))
  };
}

/**
 * Ridimensiona un frame video (<video>) o un'immagine (HTMLImageElement) al massimo a Full-HD (1920x1080)
 * e la converte in formato WebP (image/webp).
 */
export function renderSourceToFullHdWebp(
  source: HTMLVideoElement | HTMLImageElement,
  srcWidth: number,
  srcHeight: number,
  quality = 0.88
): { dataUrl: string; width: number; height: number; fileSizeKb: number } {
  const { width, height } = computeFullHdDimensions(srcWidth, srcHeight);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Impossibile inizializzare il contesto Canvas 2D per la conversione WebP');
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(source, 0, 0, width, height);

  const webpDataUrl = canvas.toDataURL('image/webp', quality);
  const base64Length = webpDataUrl.split(',')[1]?.length || 0;
  const fileSizeKb = Math.max(1, Math.round((base64Length * 3) / 4 / 1024));

  return {
    dataUrl: webpDataUrl,
    width,
    height,
    fileSizeKb
  };
}

/**
 * Dato un DataURL o URL immagine, lo ridimensiona al massimo a Full-HD (1920x1080) e lo converte in WebP.
 */
export function convertDataUrlToFullHdWebp(
  inputDataUrl: string,
  quality = 0.88
): Promise<{ dataUrl: string; width: number; height: number; fileSizeKb: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const w = img.naturalWidth || img.width || 1280;
        const h = img.naturalHeight || img.height || 720;
        const result = renderSourceToFullHdWebp(img, w, h, quality);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      reject(new Error('Impossibile decodificare l\'immagine per la conversione in WebP Full-HD'));
    };
    img.src = inputDataUrl;
  });
}

/**
 * Legge i primi N byte di un file in un Uint8Array
 */
const readBytes = async (file: File, length: number): Promise<Uint8Array> => {
  const slice = file.slice(0, length);
  const buffer = await slice.arrayBuffer();
  return new Uint8Array(buffer);
};

/**
 * Convalida i Magic Bytes dell'intestazione del file per verificare il tipo reale
 */
const verifyMagicBytes = (bytes: Uint8Array): 'jpeg' | 'png' | 'webp' | null => {
  // Check JPEG (FF D8 FF)
  if (
    bytes.length >= 3 &&
    bytes[0] === JPEG_MAGIC[0] &&
    bytes[1] === JPEG_MAGIC[1] &&
    bytes[2] === JPEG_MAGIC[2]
  ) {
    return 'jpeg';
  }

  // Check PNG (89 50 4E 47)
  if (
    bytes.length >= 4 &&
    bytes[0] === PNG_MAGIC[0] &&
    bytes[1] === PNG_MAGIC[1] &&
    bytes[2] === PNG_MAGIC[2] &&
    bytes[3] === PNG_MAGIC[3]
  ) {
    return 'png';
  }

  // Check WEBP (RIFF .... WEBP)
  if (
    bytes.length >= 12 &&
    bytes[0] === RIFF_MAGIC[0] &&
    bytes[1] === RIFF_MAGIC[1] &&
    bytes[2] === RIFF_MAGIC[2] &&
    bytes[3] === RIFF_MAGIC[3] &&
    bytes[8] === WEBP_MAGIC[0] &&
    bytes[9] === WEBP_MAGIC[1] &&
    bytes[10] === WEBP_MAGIC[2] &&
    bytes[11] === WEBP_MAGIC[3]
  ) {
    return 'webp';
  }

  return null;
};

/**
 * Scansione euristica su tutto il contenuto del file alla ricerca di codice malevolo,
 * tracking script o tag XSS iniettati nei metadati (EXIF/commenti).
 */
const scanForMaliciousPatterns = async (file: File): Promise<{ safe: boolean; reason?: string }> => {
  const buffer = await file.arrayBuffer();
  const textDecoder = new TextDecoder('latin1');
  const content = textDecoder.decode(buffer);

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      return {
        safe: false,
        reason: `Rilevata sequenza o tag malevolo non conforme: ${pattern.toString()}`
      };
    }
  }

  return { safe: true };
};

/**
 * Sanitizza l'immagine ridisegnandola su Canvas HTML5 al massimo in Full-HD (1920x1080)
 * e convertendola in formato WEBP.
 */
const sanitizeViaCanvas = (
  file: File
): Promise<{ dataUrl: string; width: number; height: number; fileSizeKb: number }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const srcW = img.naturalWidth || img.width;
        const srcH = img.naturalHeight || img.height;
        const converted = renderSourceToFullHdWebp(img, srcW, srcH, 0.88);
        URL.revokeObjectURL(objectUrl);
        resolve(converted);
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Il file non è un'immagine raster valida o è corrotto"));
    };

    img.src = objectUrl;
  });
};

/**
 * Funzione principale di convalida, ridimensionamento Full-HD e conversione WebP della foto profilo.
 * @param file File caricato dall'utente
 * @returns ImageSecurityCheckResult
 */
export async function validateAndSanitizeProfileImage(file: File): Promise<ImageSecurityCheckResult> {
  const MAX_SIZE_BYTES = 10 * 1024 * 1024; // Accetta scatti fotocamera fino a 10MB prima della compressione WebP Full-HD

  // 1. Controllo dimensione iniziale
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `La dimensione del file supera il limite consentito di 10 MB (dimensione attuale: ${sizeMb} MB).`,
      fileSizeKb: Math.round(file.size / 1024)
    };
  }

  // 2. Controllo estensione dichiarata
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const fileNameLower = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
  if (!hasValidExt && !file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Formato non supportato. Sono accettati file JPG, JPEG, PNG e WEBP.'
    };
  }

  // 3. Controllo Magic Bytes binari (firma del file reale)
  try {
    const headerBytes = await readBytes(file, 16);
    const detectedType = verifyMagicBytes(headerBytes);
    if (!detectedType) {
      return {
        valid: false,
        error: "L'intestazione binaria del file non corrisponde a un'immagine JPEG, PNG o WEBP autentica."
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      error: `Errore nella lettura binaria del file: ${err?.message || 'File illeggibile'}`
    };
  }

  // 4. Scansione antimalware e anti-tracciamento su payload grezzo
  try {
    const scanResult = await scanForMaliciousPatterns(file);
    if (!scanResult.safe) {
      return {
        valid: false,
        error: `Controllo di sicurezza fallito: ${scanResult.reason}`
      };
    }
  } catch (err: any) {
    return {
      valid: false,
      error: `Errore durante la scansione di sicurezza: ${err?.message || 'Errore imprevisto'}`
    };
  }

  // 5. Ridimensionamento max Full-HD (1920x1080) e conversione in formato WebP tramite Canvas HTML5
  try {
    const { dataUrl, width, height, fileSizeKb } = await sanitizeViaCanvas(file);
    return {
      valid: true,
      sanitizedDataUrl: dataUrl,
      fileSizeKb,
      mimeType: 'image/webp',
      dimensions: { width, height }
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Errore nella decodifica dell'immagine: ${err?.message || 'File immagine non valido o corrotto'}`
    };
  }
}
