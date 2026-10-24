/**
 * imageSecurity.ts
 * Utilità per la validazione di sicurezza, scansione antimalware e sanitizzazione
 * delle immagini profilo caricate dagli utenti (JPEG / WEBP, max 1MB).
 */

export interface ImageSecurityCheckResult {
  valid: boolean;
  error?: string;
  sanitizedDataUrl?: string;
  fileSizeKb?: number;
  mimeType?: string;
  dimensions?: { width: number; height: number };
}

// Byte signature (Magic Bytes)
const JPEG_MAGIC = [0xFF, 0xD8, 0xFF];
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
  /window\.location/i,
];

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
const verifyMagicBytes = (bytes: Uint8Array): 'jpeg' | 'webp' | null => {
  // Check JPEG (FF D8 FF)
  if (
    bytes.length >= 3 &&
    bytes[0] === JPEG_MAGIC[0] &&
    bytes[1] === JPEG_MAGIC[1] &&
    bytes[2] === JPEG_MAGIC[2]
  ) {
    return 'jpeg';
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
  // Decodifica i byte in stringa latina / utf-8 per catturare payload ASCII/UTF-8
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
 * Sanitizza l'immagine ridisegnandola su Canvas HTML5.
 * Questa operazione distrugge completamente:
 * - Tracciamenti EXIF / coordinate GPS
 * - Metadati IPTC / XMP malevoli
 * - Payload steganografici nascosti nei padding
 * Genera un nuovo data URL pulito in formato WEBP ottimizzato.
 */
const sanitizeViaCanvas = (file: File): Promise<{ dataUrl: string; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        // Limitiamo le dimensioni massime a 1200x1200px per ottimizzazione profilo
        const maxDimension = 1200;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Impossibile inizializzare il contesto Canvas 2D'));
          return;
        }

        // Sfondo bianco pulito per eventuali trasparenze
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Esportazione in WebP ad alta qualità pulita da qualsiasi metadato
        const sanitizedDataUrl = canvas.toDataURL('image/webp', 0.88);
        URL.revokeObjectURL(objectUrl);
        resolve({ dataUrl: sanitizedDataUrl, width, height });
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
 * Funzione principale di convalida e sanificazione della foto profilo.
 * @param file File caricato dall'utente
 * @returns ImageSecurityCheckResult
 */
export async function validateAndSanitizeProfileImage(file: File): Promise<ImageSecurityCheckResult> {
  const MAX_SIZE_BYTES = 1024 * 1024; // 1 Megabyte esatto

  // 1. Controllo dimensione (max 1Mb)
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `La dimensione del file supera il limite consentito di 1 MB (dimensione attuale: ${sizeMb} MB).`,
      fileSizeKb: Math.round(file.size / 1024)
    };
  }

  // 2. Controllo estensione dichiarata
  const validExtensions = ['.jpg', '.jpeg', '.webp'];
  const fileNameLower = file.name.toLowerCase();
  const hasValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: 'Formato non supportato. Sono accettati esclusivamente file JPG, JPEG e WEBP.'
    };
  }

  // 3. Controllo Magic Bytes binari (firma del file reale)
  try {
    const headerBytes = await readBytes(file, 16);
    const detectedType = verifyMagicBytes(headerBytes);
    if (!detectedType) {
      return {
        valid: false,
        error: "L'intestazione binaria del file non corrisponde a un'immagine JPEG o WEBP autentica (possibile file camuffato)."
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

  // 5. Sanitizzazione grafica tramite Canvas HTML5 (rimozione EXIF/tracking/malware residuo)
  try {
    const { dataUrl, width, height } = await sanitizeViaCanvas(file);
    return {
      valid: true,
      sanitizedDataUrl: dataUrl,
      fileSizeKb: Math.round(file.size / 1024),
      mimeType: file.type || 'image/jpeg',
      dimensions: { width, height }
    };
  } catch (err: any) {
    return {
      valid: false,
      error: `Errore nella decodifica dell'immagine: ${err?.message || 'File immagine non valido o corrotto'}`
    };
  }
}
