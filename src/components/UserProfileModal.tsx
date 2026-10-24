import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { useStore } from '../context/StoreContext';
import { UserData } from '../types';
import { ComuneIstatPicker } from './ComuneIstatPicker';
import { validateAndSanitizeProfileImage } from '../utils/imageSecurity';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Camera,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Clock,
  FileText,
  ShoppingBag,
  Sparkles,
  HelpCircle,
  Save,
  Trash2
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, profile, updateProfileData, isAdmin } = useAuth();
  const { theme } = useStore();
  const isLight = theme === 'chiaro';

  // Stato del form inizializzato con i dati del profilo
  const [formData, setFormData] = useState<Partial<UserData>>({
    nome: profile?.nome || '',
    cognome: profile?.cognome || '',
    sesso: (profile?.sesso as 'M' | 'F') || 'M',
    data_nascita: profile?.data_nascita || '',
    comune_nascita: profile?.comune_nascita || '',
    provincia_nascita: profile?.provincia_nascita || '',
    codice_fiscale: profile?.codice_fiscale || '',
    numero_passaporto: profile?.numero_passaporto || '',
    codice_nazione: profile?.codice_nazione || 'IT',
    indirizzo: profile?.indirizzo || '',
    numero_civico: profile?.numero_civico || '',
    cap: profile?.cap || '',
    comune_residenza: profile?.comune_residenza || '',
    provincia: profile?.provincia || '',
    telefono: profile?.telefono || '',
    cellulare_secondario: profile?.cellulare_secondario || '',
    is_whatsapp: profile?.is_whatsapp ?? true,
    email_secondaria: profile?.email_secondaria || '',
    preferenza_contatto: (profile?.preferenza_contatto as 1 | 2 | 3 | 4 | 5) || 1,
    indirizzo_corriere: profile?.indirizzo_corriere || '',
    orario_consegna_corriere: profile?.orario_consegna_corriere || '',
    note_corriere: profile?.note_corriere || '',
    photo_url: profile?.photo_url || user?.photoURL || ''
  });

  const [imageScanning, setImageScanning] = useState(false);
  const [imageScanSuccess, setImageScanSuccess] = useState<string | null>(null);
  const [imageScanError, setImageScanError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Gestione caricamento foto con analisi di sicurezza
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageScanning(true);
    setImageScanError(null);
    setImageScanSuccess(null);

    try {
      const result = await validateAndSanitizeProfileImage(file);
      if (!result.valid) {
        setImageScanError(result.error || 'File immagine non valido o non sicuro');
      } else if (result.sanitizedDataUrl) {
        setFormData((prev) => ({ ...prev, photo_url: result.sanitizedDataUrl }));
        setImageScanSuccess(
          `Immagine verificata con successo (${result.fileSizeKb} KB, ${result.dimensions?.width}x${result.dimensions?.height}px). Metadati EXIF rimossi e codice malevolo escluso.`
        );
      }
    } catch (err: any) {
      setImageScanError(err?.message || 'Errore imprevisto durante l\'analisi di sicurezza');
    } finally {
      setImageScanning(false);
      // Reset input file per permettere nuovo caricamento dello stesso file se necessario
      e.target.value = '';
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo_url: '' }));
    setImageScanSuccess(null);
    setImageScanError(null);
  };

  // Aggiornamento checkbox WhatsApp
  const handleWhatsAppToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_whatsapp: checked,
      cellulare_secondario: checked ? prev.telefono || '' : prev.cellulare_secondario || ''
    }));
  };

  const handleSalva = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const dataToSave: Partial<UserData> = {
        ...formData,
        // Assicuriamo che se is_whatsapp è true il secondario sia allineato
        cellulare_secondario: formData.is_whatsapp ? formData.telefono : formData.cellulare_secondario
      };

      await updateProfileData(dataToSave);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Errore nel salvataggio del profilo');
    } finally {
      setIsSaving(false);
    }
  };

  // Formattazione data registrazione cliente
  const formattedRegistrationDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : 'Ottobre 2026';

  const userTypeLabel = isAdmin ? 'Amministratore Bottega' : 'Cliente Registrato';

  return (
    <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-3xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden ${
          isLight
            ? 'bg-stone-50 border-stone-300 text-stone-900'
            : 'bg-stone-900 border-stone-700 text-stone-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div
          className={`px-5 py-4 flex items-center justify-between border-b shrink-0 ${
            isLight
              ? 'bg-white border-stone-200'
              : 'bg-stone-950 border-stone-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Il Mio Profilo Cliente
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-bold uppercase tracking-wider border border-amber-500/30">
                  {userTypeLabel}
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Gestisci le tue informazioni personali, recapiti e preferenze di consegna
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENUTO SCROLLABILE */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-6">

          {/* MINI-DASHBOARD STATISTICHE E FOTO PROFILO */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border shadow-xs ${
              isLight
                ? 'bg-white border-stone-200'
                : 'bg-stone-950/70 border-stone-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Foto Profilo e Upload */}
              <div className="relative group shrink-0 text-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-amber-500/40 shadow-lg bg-stone-800 flex items-center justify-center">
                  {formData.photo_url ? (
                    <img
                      src={formData.photo_url}
                      alt="Foto Profilo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 font-black text-2xl bg-amber-500/10">
                      {(formData.nome?.[0] || 'U').toUpperCase()}
                      {(formData.cognome?.[0] || '').toUpperCase()}
                    </div>
                  )}

                  {/* Overlay durante scansione */}
                  {imageScanning && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-[10px] text-center p-1">
                      <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-1" />
                      <span>Analisi...</span>
                    </div>
                  )}
                </div>

                {/* Pulsanti gestione foto */}
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <label
                    htmlFor="profile-photo-input"
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-500 hover:bg-amber-600 text-stone-950 rounded-lg cursor-pointer transition-colors shadow-xs"
                    title="Carica foto (JPG o WEBP, max 1MB)"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{formData.photo_url ? 'Cambia' : 'Carica'}</span>
                  </label>
                  <input
                    id="profile-photo-input"
                    type="file"
                    accept=".jpg,.jpeg,.webp,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={imageScanning}
                  />

                  {formData.photo_url && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="p-1 text-stone-400 hover:text-rose-500 rounded-lg transition-colors"
                      title="Rimuovi foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="text-[10px] text-stone-400 mt-1">
                  JPG / WEBP max 1MB
                </div>
              </div>

              {/* Informazioni Cliente & Indicatori KPI */}
              <div className="flex-1 w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-lg font-black text-stone-900 dark:text-white">
                      {formData.nome || 'Nome'} {formData.cognome || 'Cognome'}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono">
                      {profile?.codice_fiscale || formData.codice_fiscale || 'CF non impostato'}
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center gap-1 text-[11px] font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">
                    <Calendar className="w-3 h-3 text-amber-500" />
                    <span>Cliente dal: <strong className="text-stone-800 dark:text-stone-200">{formattedRegistrationDate}</strong></span>
                  </span>
                </div>

                {/* 4 Box KPI Mini-Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-amber-50/60 border-amber-200/80' : 'bg-stone-900 border-stone-800'}`}>
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                      <span>Ordini</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-stone-900 dark:text-amber-400 mt-0.5">
                      {profile?.numero_ordini || 0}
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${isLight ? 'bg-amber-50/60 border-amber-200/80' : 'bg-stone-900 border-stone-800'}`}>
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Spesa Totale</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-stone-900 dark:text-amber-400 mt-0.5">
                      € {(profile?.totale_speso || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className={`col-span-2 sm:col-span-1 p-2.5 rounded-xl border ${isLight ? 'bg-amber-50/60 border-amber-200/80' : 'bg-stone-900 border-stone-800'}`}>
                    <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                      <span>Punti Fedeltà</span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">
                      {profile?.punti_fedelta || profile?.loyaltyPoints || 0} pt
                    </div>
                  </div>
                </div>

                {/* Banner esito scansione foto */}
                {imageScanSuccess && (
                  <div className="mt-3 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{imageScanSuccess}</span>
                  </div>
                )}
                {imageScanError && (
                  <div className="mt-3 p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{imageScanError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSalva} className="space-y-6">

            {/* SEZIONE 1: DATI ANAGRAFICI */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-950/70 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                <User className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Dati Anagrafici & Identificativi
                </h4>
              </div>

              {/* Email registrazione: NON MODIFICABILE */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Email di Registrazione (Non Modificabile)
                  </label>
                  <span className="inline-flex items-center gap-1 text-[10px] text-stone-400">
                    <Lock className="w-3 h-3" /> Bloccata per sicurezza
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="email"
                    value={profile?.email || user?.email || ''}
                    disabled
                    readOnly
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-mono cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Cognome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cognome || ''}
                    onChange={(e) => setFormData({ ...formData, cognome: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Sesso *
                  </label>
                  <select
                    value={formData.sesso || 'M'}
                    onChange={(e) => setFormData({ ...formData, sesso: e.target.value as 'M' | 'F' })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="M">Maschio (M)</option>
                    <option value="F">Femmina (F)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Data di Nascita *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.data_nascita || ''}
                    onChange={(e) => setFormData({ ...formData, data_nascita: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  {/* Comune di nascita con showCap={false} */}
                  <ComuneIstatPicker
                    label="Comune di Nascita"
                    required
                    showCap={false}
                    value={formData.comune_nascita || ''}
                    provinceSigla={formData.provincia_nascita}
                    onSelect={(comune) => {
                      setFormData({
                        ...formData,
                        comune_nascita: comune.nome,
                        provincia_nascita: comune.sigla
                      });
                    }}
                  />
                </div>
              </div>

              {/* Codice fiscale o passaporto */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Codice Fiscale / Documento
                </label>
                <input
                  type="text"
                  value={formData.codice_fiscale || ''}
                  onChange={(e) => setFormData({ ...formData, codice_fiscale: e.target.value.toUpperCase() })}
                  placeholder="Es. RSSMRA85M01H501Z"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SEZIONE 2: RESIDENZA */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-950/70 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                <MapPin className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Residenza Anagrafica
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Indirizzo Residenza *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.indirizzo || ''}
                    onChange={(e) => setFormData({ ...formData, indirizzo: e.target.value })}
                    placeholder="Via, Piazza o Corso"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Civico *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.numero_civico || ''}
                    onChange={(e) => setFormData({ ...formData, numero_civico: e.target.value })}
                    placeholder="Es. 25/A"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <ComuneIstatPicker
                    label="Comune di Residenza"
                    required
                    value={formData.comune_residenza || ''}
                    provinceSigla={formData.provincia}
                    onSelect={(comune) => {
                      setFormData({
                        ...formData,
                        comune_residenza: comune.nome,
                        provincia: comune.sigla,
                        cap: (comune.cap && comune.cap[0]) ? comune.cap[0] : formData.cap
                      });
                    }}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Provincia (Auto)
                  </label>
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={formData.provincia || ''}
                    placeholder="Sigla prov."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-xs font-mono cursor-not-allowed select-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  CAP Residenza *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.cap || ''}
                  onChange={(e) => setFormData({ ...formData, cap: e.target.value })}
                  placeholder="Es. 44042"
                  className="w-full sm:w-48 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* SEZIONE 3: RECAPITI E PREFERENZA CONTATTO */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-950/70 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                <Phone className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Recapiti & Canali di Contatto
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Cellulare Principale *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono || ''}
                    onChange={(e) => {
                      const newTel = e.target.value;
                      setFormData({
                        ...formData,
                        telefono: newTel,
                        cellulare_secondario: formData.is_whatsapp ? newTel : formData.cellulare_secondario
                      });
                    }}
                    placeholder="Es. 338 1234567"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    Email Alternativa / Secondaria
                  </label>
                  <input
                    type="email"
                    value={formData.email_secondaria || ''}
                    onChange={(e) => setFormData({ ...formData, email_secondaria: e.target.value })}
                    placeholder="altra.email@esempio.it"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkbox WhatsApp */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="whatsapp-check"
                  checked={formData.is_whatsapp ?? true}
                  onChange={(e) => handleWhatsAppToggle(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="whatsapp-check" className="text-xs cursor-pointer select-none">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    È il numero WhatsApp?
                  </span>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Se selezionato, imposta automaticamente lo stesso recapito anche per i messaggi diretti WhatsApp.
                  </p>
                </label>
              </div>

              {/* Numero secondario se WhatsApp è falso o modificabile */}
              {!formData.is_whatsapp && (
                <div className="space-y-1 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Numero Cellulare Secondario (WhatsApp o Altro)
                  </label>
                  <input
                    type="tel"
                    value={formData.cellulare_secondario || ''}
                    onChange={(e) => setFormData({ ...formData, cellulare_secondario: e.target.value })}
                    placeholder="Es. 340 9876543"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              )}

              {/* Preferenza di contatto: 1..5 */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Canale di Contatto Preferito *
                </label>
                <select
                  value={formData.preferenza_contatto || 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferenza_contatto: Number(e.target.value) as 1 | 2 | 3 | 4 | 5
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value={1}>1 - Email Principale ({profile?.email || user?.email || 'registrazione'})</option>
                  <option value={2}>2 - Messaggio WhatsApp</option>
                  <option value={3}>3 - Email Alternativa / Secondaria</option>
                  <option value={4}>4 - Chiamata Cellulare Principale</option>
                  <option value={5}>5 - Chiamata Cellulare Secondario</option>
                </select>
              </div>
            </div>

            {/* SEZIONE 4: CONSEGNA ORDINI & NOTE PER IL CORRIERE */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
                isLight ? 'bg-white border-stone-200' : 'bg-stone-950/70 border-stone-800'
              }`}
            >
              <div className="flex items-center gap-2 pb-2 border-b border-stone-200 dark:border-stone-800">
                <Truck className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                  Istruzioni di Consegna & Note per il Corriere
                </h4>
              </div>

              {/* Indirizzo per il corriere con suggerimenti */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Indirizzo Specifico per il Corriere
                  </label>
                  <span className="text-[10px] text-stone-400">Opzionale se diverso da residenza</span>
                </div>
                <input
                  type="text"
                  value={formData.indirizzo_corriere || ''}
                  onChange={(e) => setFormData({ ...formData, indirizzo_corriere: e.target.value })}
                  placeholder="Es. Via Roma 1, Città di Castello, 06012, PG"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />

                {/* Tip con indirizzi di esempio cliccabili */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-stone-500 dark:text-stone-400">
                  <span className="font-semibold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-amber-500" /> Esempi rapidi:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        indirizzo_corriere: 'Via Roma 1, Città di Castello, 06012, PG'
                      })
                    }
                    className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-[10px] border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                  >
                    Via Roma 1, Città di Castello, 06012, PG
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        indirizzo_corriere: 'Via Roma 1, Città di Castello, 06012, PG, presso il distributore IP'
                      })
                    }
                    className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-[10px] border border-stone-200 dark:border-stone-700 transition-colors cursor-pointer"
                  >
                    ...presso il distributore IP
                  </button>
                </div>
              </div>

              {/* Orario di consegna per il corriere con avviso */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Fascia Oraria di Consegna Preferita
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-stone-400">Suggerito:</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, orario_consegna_corriere: '16.00-18.30' })}
                      className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      16.00-18.30
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <Clock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.orario_consegna_corriere || ''}
                    onChange={(e) => setFormData({ ...formData, orario_consegna_corriere: e.target.value })}
                    placeholder="Es. 16.00-18.30"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                  <span>
                    <strong>Avviso:</strong> L&apos;orario indicato costituisce una preferenza non vincolante per il corriere espresso ed è subordinato ai percorsi logistici del vettore.
                  </span>
                </div>
              </div>

              {/* Note aggiuntive per il corriere */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                    Note Aggiuntive per il Corriere
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, note_corriere: 'Lasciare dietro la siepe' })}
                    className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    Esempio: &quot;lasciare dietro la siepe&quot;
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={formData.note_corriere || ''}
                  onChange={(e) => setFormData({ ...formData, note_corriere: e.target.value })}
                  placeholder="Es. Citofono Rossi, lasciare dietro la siepe o presso la portineria se assente"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* ERRORI O CONFERME DI SALVATAGGIO */}
            {saveSuccess && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Profilo aggiornato e sincronizzato con successo nel database!</span>
              </div>
            )}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* PULSANTI AZIONE */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Chiudi
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{isSaving ? 'Salvataggio in corso...' : 'Salva Modifiche Profilo'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
