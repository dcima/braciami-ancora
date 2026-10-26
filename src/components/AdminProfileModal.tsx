import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Camera,
  FolderOpen,
  Globe,
  Link2,
  Mail,
  RefreshCw,
  Save,
  ShieldCheck,
  Video,
  VideoOff,
  X,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { useStore } from '../context/StoreContext';
import { AdminNotificationPreferences } from './AdminNotificationPreferences';
import {
  validateAndSanitizeProfileImage,
  detectCameraAvailability,
  renderSourceToFullHdWebp
} from '../utils/imageSecurity';
import {
  uploadUserProfilePhoto,
  readUserPhotoFromUsersCollection,
  fetchWebImageAsDataUrl,
  sanitizeStorageFileName,
  STORAGE_BUCKET_GS_PREFIX
} from '../firebase/storageService';
import { getAdminDashboardMetrics } from '../utils/adminDashboard';

export const AdminProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, profile, isAdmin, updateProfileData } = useAuth();
  const { products, orders, theme, setActivePage } = useStore();

  const [sourceMode, setSourceMode] = useState<'filesystem' | 'web_url' | 'camera'>('filesystem');
  const [webUrlInput, setWebUrlInput] = useState('');
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string>('');
  const [pendingFileName, setPendingFileName] = useState<string>('');
  const [pendingMeta, setPendingMeta] = useState<{ width: number; height: number; fileSizeKb?: number } | null>(null);

  // Stato test hardware fotocamera / webcam
  const [cameraChecked, setCameraChecked] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraDevicesCount, setCameraDevicesCount] = useState(0);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const [savedPhotoPath, setSavedPhotoPath] = useState<string>(profile?.photoPath || '');
  const [displayedPhotoUrl, setDisplayedPhotoUrl] = useState<string>(profile?.photo_url || user?.photoURL || '');
  const [loadingInitialPhoto, setLoadingInitialPhoto] = useState<boolean>(false);

  const [uploading, setUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraCaptureInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Ferma tutti i track della webcam/fotocamera
  const stopCameraStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreamActive(false);
  }, []);

  // Esegue il test per rilevare se il dispositivo in uso ha una fotocamera o una webcam
  const runCameraTest = useCallback(async () => {
    const detection = await detectCameraAvailability();
    setCameraChecked(true);
    setHasCamera(detection.hasCamera);
    setCameraDevicesCount(detection.devicesCount);
    return detection;
  }, []);

  // Avvia lo stream live della fotocamera / webcam in Full-HD (fino a 1920x1080)
  const startCameraStream = useCallback(
    async (preferredFacing: 'user' | 'environment' = facingMode) => {
      stopCameraStream();
      setPhotoFailed(false);
      setPhotoMessage('');

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setPhotoFailed(true);
        setPhotoMessage('Fotocamera non accessibile tramite browser su questo dispositivo.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920, max: 1920 },
            height: { ideal: 1080, max: 1080 },
            facingMode: { ideal: preferredFacing }
          },
          audio: false
        });

        mediaStreamRef.current = stream;
        setIsStreamActive(true);
        setHasCamera(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        setPhotoFailed(true);
        setPhotoMessage(
          'Permesso fotocamera negato o webcam occupata. Puoi usare anche il pulsante "Scatto rapido dispositivo".'
        );
      }
    },
    [facingMode, stopCameraStream]
  );

  // Scatta un fotogramma dalla webcam/fotocamera, lo ridimensiona al massimo a Full-HD (1920x1080) e lo converte in WebP
  const handleCaptureFromCamera = () => {
    if (!videoRef.current || !user) return;
    const video = videoRef.current;
    const rawW = video.videoWidth || 1920;
    const rawH = video.videoHeight || 1080;

    try {
      const captured = renderSourceToFullHdWebp(video, rawW, rawH, 0.88);
      const fileName = sanitizeStorageFileName(`scatto_${user.uid}_${Date.now()}.webp`, user.uid);

      setPendingPreviewUrl(captured.dataUrl);
      setPendingFileName(fileName);
      setPendingMeta({
        width: captured.width,
        height: captured.height,
        fileSizeKb: captured.fileSizeKb
      });

      stopCameraStream();
      setPhotoFailed(false);
      setPhotoMessage(
        `Foto scattata, ridimensionata a ${captured.width}×${captured.height}px (max Full-HD) e convertita in WebP (${captured.fileSizeKb} KB). Clicca "Salva foto" per caricarla.`
      );
    } catch (error) {
      setPhotoFailed(true);
      setPhotoMessage(error instanceof Error ? error.message : 'Errore durante lo scatto della foto.');
    }
  };

  // All'apertura del profilo:
  // 1) esegue il test per verificare se il dispositivo ha una fotocamera o webcam
  // 2) legge dalla collection "users" il campo photoPath e presenta la foto nel profilo
  useEffect(() => {
    if (!isOpen || !user || !isAdmin) {
      stopCameraStream();
      return;
    }

    let cancelled = false;
    setLoadingInitialPhoto(true);
    setPhotoMessage('');
    setPhotoFailed(false);

    runCameraTest();

    (async () => {
      try {
        const result = await readUserPhotoFromUsersCollection(user.uid, user.email || undefined);
        if (cancelled) return;
        if (result.photoPath) {
          setSavedPhotoPath(result.photoPath);
        } else if (profile?.photoPath) {
          setSavedPhotoPath(profile.photoPath);
        }
        if (result.displayUrl) {
          setDisplayedPhotoUrl(result.displayUrl);
        } else if (profile?.photo_url || user.photoURL) {
          setDisplayedPhotoUrl(profile?.photo_url || user.photoURL || '');
        }
      } catch {
        // Fallback ai dati già in memoria
      } finally {
        if (!cancelled) {
          setLoadingInitialPhoto(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      stopCameraStream();
    };
  }, [isOpen, isAdmin, user?.uid, user?.email, runCameraTest, stopCameraStream]);

  // Scelta immagine dal FileSystem locale (ridimensionata max Full-HD + convertita in WebP)
  const handleFileSystemSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user) return;

    setPhotoMessage('');
    setPhotoFailed(false);
    try {
      const result = await validateAndSanitizeProfileImage(file);
      if (!result.valid || !result.sanitizedDataUrl) {
        throw new Error(result.error || 'Immagine non valida');
      }
      const cleanName = sanitizeStorageFileName(file.name, user.uid);
      setPendingPreviewUrl(result.sanitizedDataUrl);
      setPendingFileName(cleanName);
      setPendingMeta(
        result.dimensions
          ? {
              width: result.dimensions.width,
              height: result.dimensions.height,
              fileSizeKb: result.fileSizeKb
            }
          : null
      );
      setPhotoMessage(
        `Immagine pronta in formato WebP (${result.dimensions?.width || 0}×${result.dimensions?.height || 0}px, max Full-HD). Clicca "Salva foto" per caricarla.`
      );
    } catch (error) {
      setPhotoFailed(true);
      setPhotoMessage(error instanceof Error ? error.message : 'Selezione file non riuscita.');
    }
  };

  // Scelta immagine da Web o URL (ridimensionata max Full-HD + convertita in WebP)
  const handleLoadFromWebUrl = async () => {
    const trimmedUrl = webUrlInput.trim();
    if (!trimmedUrl || !user) {
      setPhotoFailed(true);
      setPhotoMessage("Inserisci un URL valido di un'immagine dal web.");
      return;
    }

    setUploading(true);
    setPhotoMessage('');
    setPhotoFailed(false);
    try {
      const { dataUrl, suggestedFileName, width, height } = await fetchWebImageAsDataUrl(trimmedUrl);
      const cleanName = sanitizeStorageFileName(pendingFileName || suggestedFileName, user.uid);
      setPendingPreviewUrl(dataUrl);
      setPendingFileName(cleanName);
      setPendingMeta(width && height ? { width, height } : null);
      setPhotoMessage(
        `Immagine caricata da URL, ridimensionata max Full-HD${width && height ? ` (${width}×${height}px)` : ''} e convertita in WebP (${cleanName}). Clicca "Salva foto".`
      );
    } catch (error) {
      setPhotoFailed(true);
      setPhotoMessage(error instanceof Error ? error.message : "Impossibile caricare l'immagine dall'URL.");
    } finally {
      setUploading(false);
    }
  };

  // Salvataggio effettivo in "gs://braciami-ancora.firebasestorage.app/users_photo/$fileName"
  // e aggiornamento di photoPath: "/users_photo/$fileName" nella collection "users"
  const handleSavePhotoToBucket = async () => {
    if (!user) return;

    let sourceToSave = pendingPreviewUrl;
    let fileNameToSave = pendingFileName;

    // Se l'utente ha incollato un URL web e ha premuto direttamente "Salva foto"
    if (!sourceToSave && sourceMode === 'web_url' && webUrlInput.trim()) {
      setUploading(true);
      try {
        const fetched = await fetchWebImageAsDataUrl(webUrlInput.trim());
        sourceToSave = fetched.dataUrl;
        fileNameToSave = sanitizeStorageFileName(fileNameToSave || fetched.suggestedFileName, user.uid);
      } catch (err) {
        setUploading(false);
        setPhotoFailed(true);
        setPhotoMessage(err instanceof Error ? err.message : 'URL immagine non valido.');
        return;
      }
    }

    if (!sourceToSave) {
      setPhotoFailed(true);
      setPhotoMessage('Scegli o scatta prima una foto.');
      return;
    }

    const finalFileName = sanitizeStorageFileName(
      fileNameToSave || `${user.uid}_${Date.now()}.webp`,
      user.uid
    );

    setUploading(true);
    setPhotoMessage('');
    setPhotoFailed(false);

    try {
      const uploaded = await uploadUserProfilePhoto(
        user.uid,
        sourceToSave,
        finalFileName,
        user.email || undefined
      );

      if (!uploaded.downloadUrl) {
        throw new Error('Impossibile salvare la foto. Riprova.');
      }

      // Aggiorna anche lo stato locale/Firestore tramite AuthContext con photoPath: "/users_photo/$fileName"
      await updateProfileData({
        photoPath: uploaded.photoPath,
        photo_url: uploaded.downloadUrl
      });

      setSavedPhotoPath(uploaded.photoPath);
      setDisplayedPhotoUrl(uploaded.downloadUrl);
      setPendingPreviewUrl('');
      setPendingFileName('');
      setPendingMeta(null);
      setWebUrlInput('');
      setPhotoFailed(false);
      setPhotoMessage(
        `Foto WebP${uploaded.width && uploaded.height ? ` (${uploaded.width}×${uploaded.height}px)` : ''} caricata in ${uploaded.gsUri} e campo photoPath aggiornato a "${uploaded.photoPath}".`
      );
    } catch (error) {
      setPhotoFailed(true);
      setPhotoMessage(error instanceof Error ? error.message : 'Caricamento non riuscito.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !isAdmin) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        stopCameraStream();
        onClose();
      }
      if (event.key === 'Tab') {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const buttons = Array.from(
          dialog?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not([hidden]):not(:disabled), summary, a[href], select:not(:disabled)'
          ) || []
        ).filter((element) => element.getClientRects().length > 0);
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [isOpen, isAdmin, onClose, stopCameraStream]);

  if (!isOpen || !user || !isAdmin) return null;

  const metrics = getAdminDashboardMetrics(products, orders);
  const light = theme === 'chiaro';
  const currency = (value: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);

  const activeAvatarPreview =
    pendingPreviewUrl || displayedPhotoUrl || profile?.photo_url || user.photoURL || '';
  const activePhotoPath = pendingFileName
    ? `/users_photo/${sanitizeStorageFileName(pendingFileName, user.uid)}`
    : savedPhotoPath || profile?.photoPath || '';

  const groups = [
    {
      title: 'Prodotti',
      values: [
        ['In catalogo', metrics.catalog],
        ['In magazzino', metrics.warehouse],
        ['In ordine', metrics.ordered]
      ],
      note: 'Numero di articoli distinti. In ordine: presenti negli ordini clienti aperti.'
    },
    {
      title: 'Ordini',
      values: [
        ['Ricevuti', metrics.received],
        ['In elaborazione', metrics.processing],
        ['Evasi', metrics.fulfilled]
      ],
      note: 'In elaborazione: in griglia, pronti e in consegna. Evasi: completati.'
    },
    {
      title: 'Fatturato',
      values: [
        ['Mese', null],
        ['Anno', null],
        ['Storico', null]
      ],
      note: 'N/D: dati delle fatture non disponibili. Gli importi degli ordini pagati sono riportati sotto.'
    },
    {
      title: 'Fornitori',
      values: [
        ['Totali', metrics.suppliers],
        ['Attivi', null],
        ['Dismessi', null]
      ],
      note: 'Totali: fornitori distinti associati al catalogo. N/D: stato attivo o dismesso non disponibile.'
    }
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 sm:p-6"
      onClick={() => {
        stopCameraStream();
        onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-profile-title"
        onClick={(event) => event.stopPropagation()}
        className={`max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl ${
          light ? 'bg-white text-stone-900 border-stone-200' : 'bg-stone-950 text-stone-100 border-stone-700'
        }`}
      >
        <header className="flex items-start justify-between gap-3 border-b border-stone-500/20 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 id="admin-profile-title" className="flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />
              Profilo amministratore
            </h2>
            <p className="mt-2 flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-amber-500" />
              <span className="break-all">{user.email}</span>
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label="Chiudi profilo amministratore"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-amber-500/15"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-4 p-4 sm:p-5">
          {/* SEZIONE FOTO PROFILO AMMINISTRATORE */}
          <section
            aria-label="Foto amministratore"
            className={`rounded-xl border p-4 space-y-3 ${
              light ? 'bg-stone-50 border-stone-200' : 'bg-stone-900/90 border-stone-800'
            }`}
          >
            <div className="flex flex-wrap items-center gap-4">
              {activeAvatarPreview ? (
                <img
                  src={activeAvatarPreview}
                  alt="Foto amministratore"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-amber-500 shrink-0"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-stone-950 shrink-0">
                  {(user.displayName || user.email || 'A')[0].toUpperCase()}
                </span>
              )}

              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    Foto Profilo Admin (WebP · Max Full-HD)
                  </span>
                  {loadingInitialPhoto && (
                    <span className="text-[11px] opacity-60">Lettura photoPath da users...</span>
                  )}
                  {cameraChecked && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        hasCamera
                          ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                          : 'bg-stone-500/15 text-stone-400 border border-stone-500/30'
                      }`}
                    >
                      {hasCamera
                        ? `Fotocamera/Webcam rilevata (${cameraDevicesCount || 1})`
                        : 'Nessuna webcam rilevata'}
                    </span>
                  )}
                </div>

                {activePhotoPath && (
                  <div className="text-[11px] font-mono break-all opacity-80">
                    <span className="font-semibold">photoPath (users):</span>{' '}
                    <code className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 font-bold">
                      {activePhotoPath}
                    </code>
                  </div>
                )}

                <p className="text-[11px] opacity-65 font-mono break-all">
                  Destinazione: {STORAGE_BUCKET_GS_PREFIX}
                  {activePhotoPath || '/users_photo/$fileName'}
                </p>
              </div>
            </div>

            {/* Selettore modalità: Dal FileSystem, Da Web o URL, e (se rilevata fotocamera/webcam) Scatta una foto */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setSourceMode('filesystem');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sourceMode === 'filesystem'
                    ? 'bg-amber-500 text-stone-950'
                    : light
                    ? 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    : 'bg-stone-800 border border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
                <span>Scegli dal FileSystem</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  setSourceMode('web_url');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  sourceMode === 'web_url'
                    ? 'bg-amber-500 text-stone-950'
                    : light
                    ? 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                    : 'bg-stone-800 border border-stone-700 text-stone-200 hover:bg-stone-700'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Da Web o URL</span>
              </button>

              {hasCamera && (
                <button
                  type="button"
                  onClick={() => {
                    setSourceMode('camera');
                    startCameraStream(facingMode);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    sourceMode === 'camera'
                      ? 'bg-amber-500 text-stone-950'
                      : light
                      ? 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                      : 'bg-stone-800 border border-stone-700 text-stone-200 hover:bg-stone-700'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Scatta una foto</span>
                </button>
              )}
            </div>

            {sourceMode === 'filesystem' && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <input
                  ref={photoInputRef}
                  type="file"
                  hidden
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleFileSystemSelect}
                  aria-label="Seleziona foto amministratore dal FileSystem"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => photoInputRef.current?.click()}
                  className={`inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                    light
                      ? 'bg-white border-stone-300 text-stone-900 hover:bg-stone-100'
                      : 'bg-stone-800 border-stone-700 text-stone-100 hover:bg-stone-700'
                  }`}
                >
                  <FolderOpen className="h-4 w-4 text-amber-500" />
                  <span>Sfoglia FileSystem…</span>
                </button>
                <span className="text-[11px] opacity-65">
                  Viene ridimensionata max Full-HD (1920×1080) e convertita in WebP
                </span>
              </div>
            )}

            {sourceMode === 'web_url' && (
              <div className="space-y-2 pt-1">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Link2 className="h-4 w-4 text-amber-500 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      value={webUrlInput}
                      onChange={(e) => setWebUrlInput(e.target.value)}
                      placeholder="https://esempio.it/foto_profilo.jpg o /assets/manuel_default.jpg"
                      className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs ${
                        light
                          ? 'bg-white border-stone-300 text-stone-900'
                          : 'bg-stone-800 border-stone-700 text-stone-100'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    disabled={uploading || !webUrlInput.trim()}
                    onClick={handleLoadFromWebUrl}
                    className={`px-3 py-2 rounded-lg border text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50 ${
                      light
                        ? 'bg-white border-stone-300 text-stone-900 hover:bg-stone-100'
                        : 'bg-stone-800 border-stone-700 text-stone-100 hover:bg-stone-700'
                    }`}
                  >
                    Carica da URL
                  </button>
                </div>
              </div>
            )}

            {sourceMode === 'camera' && (
              <div className="space-y-3 pt-1">
                <div className="relative overflow-hidden rounded-xl border border-stone-700 bg-black aspect-video max-h-64 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`h-full w-full object-contain ${isStreamActive ? 'block' : 'hidden'}`}
                  />
                  {!isStreamActive && (
                    <div className="text-center p-4 text-xs text-stone-300 space-y-2">
                      <Video className="h-7 w-7 text-amber-500 mx-auto" />
                      <p>Premi &ldquo;Attiva fotocamera&rdquo; per inquadrare e scattare in Full-HD WebP</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {!isStreamActive ? (
                    <button
                      type="button"
                      onClick={() => startCameraStream(facingMode)}
                      className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-stone-950 cursor-pointer"
                    >
                      <Video className="h-4 w-4" />
                      <span>Attiva fotocamera</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleCaptureFromCamera}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-xs font-bold text-stone-950 cursor-pointer"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Scatta una foto (Full-HD WebP)</span>
                      </button>

                      {cameraDevicesCount > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextFacing = facingMode === 'user' ? 'environment' : 'user';
                            setFacingMode(nextFacing);
                            startCameraStream(nextFacing);
                          }}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                            light
                              ? 'bg-white border-stone-300 text-stone-900 hover:bg-stone-100'
                              : 'bg-stone-800 border-stone-700 text-stone-100 hover:bg-stone-700'
                          }`}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Cambia camera</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={stopCameraStream}
                        className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold cursor-pointer ${
                          light
                            ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                            : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
                        }`}
                      >
                        <VideoOff className="h-3.5 w-3.5" />
                        <span>Spegni camera</span>
                      </button>
                    </>
                  )}

                  {/* Fallback acquisizione nativa su smartphone/tablet */}
                  <input
                    ref={cameraCaptureInputRef}
                    type="file"
                    hidden
                    accept="image/*"
                    capture="user"
                    onChange={handleFileSystemSelect}
                    aria-label="Scatta foto con fotocamera nativa del dispositivo"
                  />
                  <button
                    type="button"
                    onClick={() => cameraCaptureInputRef.current?.click()}
                    className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer ${
                      light
                        ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                        : 'bg-stone-800 border-stone-700 text-stone-200 hover:bg-stone-700'
                    }`}
                  >
                    <Camera className="h-3.5 w-3.5 text-amber-500" />
                    <span>Scatto rapido dispositivo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Nome file ($fileName) e pulsante di salvataggio su Storage + collection "users" */}
            {(pendingPreviewUrl || (sourceMode === 'web_url' && webUrlInput.trim())) && (
              <div
                className={`p-3 rounded-xl border space-y-2.5 ${
                  light ? 'bg-amber-50/70 border-amber-300' : 'bg-stone-950 border-amber-500/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-500 shrink-0">
                    Nome file ($fileName):
                  </label>
                  <input
                    type="text"
                    value={pendingFileName}
                    onChange={(e) => setPendingFileName(e.target.value)}
                    placeholder={`${user.uid}_photo.webp`}
                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
                      light
                        ? 'bg-white border-stone-300 text-stone-900'
                        : 'bg-stone-900 border-stone-700 text-stone-100'
                    }`}
                  />
                </div>

                {pendingMeta && (
                  <p className="text-[11px] opacity-80">
                    Formato pronto: <strong>WebP</strong> · Risoluzione:{' '}
                    <strong>
                      {pendingMeta.width}×{pendingMeta.height}px
                    </strong>{' '}
                    (max Full-HD 1920×1080)
                    {pendingMeta.fileSizeKb ? ` · Peso: ${pendingMeta.fileSizeKb} KB` : ''}
                  </p>
                )}

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-mono opacity-80 break-all">
                    Salverà in:{' '}
                    <strong>
                      /users_photo/
                      {sanitizeStorageFileName(pendingFileName || `${user.uid}_photo.webp`, user.uid)}
                    </strong>
                  </span>

                  <button
                    type="button"
                    disabled={uploading}
                    onClick={handleSavePhotoToBucket}
                    className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-xs font-bold text-stone-950 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{uploading ? 'Salvataggio in corso…' : 'Salva foto'}</span>
                  </button>
                </div>
              </div>
            )}

            {photoMessage && (
              <p
                role={photoFailed ? 'alert' : 'status'}
                className={`text-xs flex items-center gap-1.5 ${
                  photoFailed ? 'text-red-500' : 'text-emerald-500 font-medium'
                }`}
              >
                {!photoFailed && <CheckCircle2 className="h-4 w-4 shrink-0" />}
                <span>{photoMessage}</span>
              </p>
            )}
          </section>

          <AdminNotificationPreferences
            key={user.uid}
            saved={profile?.adminNotificationPreferences}
            onSave={async (preferences) => {
              await updateProfileData({ adminNotificationPreferences: preferences });
            }}
          />

          <h3 className="text-sm font-semibold">Il negozio · Riepilogo</h3>
          {groups.map((group) => (
            <section
              key={group.title}
              className={`rounded-xl border p-3 ${
                light ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-800'
              }`}
            >
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-600">{group.title}</h4>
              <dl className="grid grid-cols-3 gap-2">
                {group.values.map(([label, value]) => (
                  <div key={String(label)} className="min-w-0">
                    <dt className="text-[11px] opacity-75">{label}</dt>
                    <dd className="mt-1 break-words text-xl font-bold tabular-nums">{value ?? 'N/D'}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed opacity-60">{group.note}</p>
            </section>
          ))}

          <div className="text-xs leading-relaxed opacity-75">
            <p className="font-semibold">Importi ordini pagati (annullati esclusi)</p>
            <p>
              Mese: {currency(metrics.paidMonth)} · Anno: {currency(metrics.paidYear)} · Storico:{' '}
              {currency(metrics.paidHistory)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              setActivePage('admin-crm');
              onClose();
            }}
            className="min-h-11 w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-950 hover:bg-amber-400 cursor-pointer"
          >
            Apri gestione negozio
          </button>
        </div>
      </section>
    </div>,
    document.body
  );
};
