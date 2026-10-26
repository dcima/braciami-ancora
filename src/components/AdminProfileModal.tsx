import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Mail, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { useStore } from '../context/StoreContext';
import { AdminNotificationPreferences } from './AdminNotificationPreferences';
import { validateAndSanitizeProfileImage } from '../utils/imageSecurity';
import { uploadUserProfilePhoto } from '../firebase/storageService';
import { getAdminDashboardMetrics } from '../utils/adminDashboard';

export const AdminProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, profile, isAdmin, updateProfileData } = useAuth();
  const { products, orders, theme, setActivePage } = useStore();
  const [uploading, setUploading] = useState(false);
  const [photoMessage, setPhotoMessage] = useState('');
  const [photoFailed, setPhotoFailed] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const handlePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !user) return;
    setUploading(true); setPhotoMessage(''); setPhotoFailed(false);
    try {
      const result = await validateAndSanitizeProfileImage(file);
      if (!result.valid || !result.sanitizedDataUrl) throw new Error(result.error || 'Immagine non valida');
      const uploaded = await uploadUserProfilePhoto(user.uid, result.sanitizedDataUrl);
      if (!uploaded.storagePath) throw new Error('Storage non disponibile: foto non salvata. Riprova.');
      await updateProfileData({ photo_url: uploaded.downloadUrl });
      setPhotoMessage('Foto aggiornata.');
    } catch (error) { setPhotoFailed(true); setPhotoMessage(error instanceof Error ? error.message : 'Caricamento non riuscito.'); }
    finally { setUploading(false); }
  };
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen || !isAdmin) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab') {
        const dialog = closeRef.current?.closest('[role="dialog"]');
        const buttons = Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not([hidden]):not(:disabled), summary, a[href], select:not(:disabled)') || []).filter((element) => element.getClientRects().length > 0);
        if (!buttons?.length) return;
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [isOpen, isAdmin, onClose]);
  if (!isOpen || !user || !isAdmin) return null;
  const metrics = getAdminDashboardMetrics(products, orders);
  const light = theme === 'chiaro';
  const currency = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  const groups = [
    { title: 'Prodotti', values: [['In catalogo', metrics.catalog], ['In magazzino', metrics.warehouse], ['In ordine', metrics.ordered]], note: 'Numero di articoli distinti. In ordine: presenti negli ordini clienti aperti.' },
    { title: 'Ordini', values: [['Ricevuti', metrics.received], ['In elaborazione', metrics.processing], ['Evasi', metrics.fulfilled]], note: 'In elaborazione: in griglia, pronti e in consegna. Evasi: completati.' },
    { title: 'Fatturato', values: [['Mese', null], ['Anno', null], ['Storico', null]], note: 'N/D: dati delle fatture non disponibili. Gli importi degli ordini pagati sono riportati sotto.' },
    { title: 'Fornitori', values: [['Totali', metrics.suppliers], ['Attivi', null], ['Dismessi', null]], note: 'Totali: fornitori distinti associati al catalogo. N/D: stato attivo o dismesso non disponibile.' }
  ];
  return createPortal(
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 sm:p-6" onClick={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="admin-profile-title" onClick={(event) => event.stopPropagation()}
        className={`max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl ${light ? 'bg-white text-stone-900 border-stone-200' : 'bg-stone-950 text-stone-100 border-stone-700'}`}>
        <header className="flex items-start justify-between gap-3 border-b border-stone-500/20 p-4 sm:p-5">
          <div className="min-w-0">
            <h2 id="admin-profile-title" className="flex items-center gap-2 text-lg font-bold"><ShieldCheck className="h-5 w-5 shrink-0 text-amber-500" />Profilo amministratore</h2>
            <p className="mt-2 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 shrink-0 text-amber-500" /><span className="break-all">{user.email}</span></p>
          </div>
          <button ref={closeRef} type="button" aria-label="Chiudi profilo amministratore" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-amber-500/15"><X className="h-5 w-5" /></button>
        </header>
        <div className="space-y-4 p-4 sm:p-5">
          <section aria-label="Foto amministratore" className="flex flex-wrap items-center gap-3">
            {(profile?.photo_url || user.photoURL) ? <img src={profile?.photo_url || user.photoURL || ''} alt="Foto amministratore" className="h-16 w-16 rounded-full object-cover ring-2 ring-amber-500" /> : <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-stone-950">{(user.displayName || user.email || 'A')[0].toUpperCase()}</span>}
            <div className="min-w-0">
              <input ref={photoInputRef} type="file" hidden accept=".jpg,.jpeg,.webp,image/jpeg,image/webp" onChange={handlePhoto} aria-label="Seleziona foto amministratore" />
              <button type="button" disabled={uploading} onClick={() => photoInputRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-amber-500 px-3 text-xs font-bold text-stone-950 disabled:opacity-50"><Camera className="h-4 w-4" />{uploading ? 'Caricamento…' : profile?.photo_url || user.photoURL ? 'Cambia foto' : 'Carica foto'}</button>
              <p className="mt-1 text-[11px] opacity-65">JPG / WEBP · massimo 1 MB</p>
              {photoMessage && <p role={photoFailed ? 'alert' : 'status'} className={`mt-1 text-xs ${photoFailed ? 'text-red-500' : 'text-green-600'}`}>{photoMessage}</p>}
            </div>
          </section>
          <AdminNotificationPreferences key={user.uid} saved={profile?.adminNotificationPreferences} onSave={async (preferences) => { await updateProfileData({ adminNotificationPreferences: preferences }); }} />
          <h3 className="text-sm font-semibold">Il negozio · Riepilogo</h3>
          {groups.map((group) => (
            <section key={group.title} className={`rounded-xl border p-3 ${light ? 'bg-stone-50 border-stone-200' : 'bg-stone-900 border-stone-800'}`}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-600">{group.title}</h4>
              <dl className="grid grid-cols-3 gap-2">
                {group.values.map(([label, value]) => <div key={String(label)} className="min-w-0"><dt className="text-[11px] opacity-75">{label}</dt><dd className="mt-1 break-words text-xl font-bold tabular-nums">{value ?? 'N/D'}</dd></div>)}
              </dl>
              <p className="mt-3 text-[11px] leading-relaxed opacity-60">{group.note}</p>
            </section>
          ))}
          <div className="text-xs leading-relaxed opacity-75">
            <p className="font-semibold">Importi ordini pagati (annullati esclusi)</p>
            <p>Mese: {currency(metrics.paidMonth)} · Anno: {currency(metrics.paidYear)} · Storico: {currency(metrics.paidHistory)}</p>
          </div>
          <button type="button" onClick={() => { setActivePage('admin-crm'); onClose(); }} className="min-h-11 w-full rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-stone-950 hover:bg-amber-400">Apri gestione negozio</button>
        </div>
      </section>
    </div>, document.body
  );
};
