import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, X, Flame, Mail } from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (adminEmail?: string) => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const [adminEmail, setAdminEmail] = useState('diegocimarosa@gmail.com');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      setAdminEmail(user.email);
    }
  }, [user?.email]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = (adminEmail || user?.email || 'diegocimarosa@gmail.com').trim();
    const cleanUser = username.trim();
    const cleanPass = password.trim();

    if (cleanUser === 'braciami25' && cleanPass === 'braciami25') {
      sessionStorage.setItem('braciami_admin_auth', 'true');
      setUsername('');
      setPassword('');
      onSuccess(cleanEmail);
    } else {
      setError('Credenziali non valide. Inserisci utente e password corretti.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 text-stone-100 shadow-2xl space-y-4 my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        {/* Header with Title and explicit Close button */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                Accesso Riservato Titolari
              </span>
              <h2 id="admin-modal-title" className="font-display text-lg font-bold text-white leading-tight">
                Gestione Bottega &amp; CRM
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 -mt-1 text-stone-400 hover:text-white rounded-xl bg-stone-800/60 hover:bg-stone-800 transition-colors cursor-pointer shrink-0 border border-stone-700/50"
            aria-label="Chiudi finestra"
            title="Chiudi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-stone-300">
          Inserisci l&apos;email amministratore e le credenziali di sicurezza. Al completamento dell&apos;accesso verranno salvati su Firebase (<code>configurazione &rarr; accessoAdmin</code>): <strong>lastUser</strong>, <strong>timeStamp</strong>, <strong>fromIp</strong> e <strong>browser</strong>.
        </p>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-xs text-rose-300 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-300">
              Email Amministratore (salvata in configurazione &rarr; accessoAdmin &rarr; lastUser)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="es. diegocimarosa@gmail.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-750 rounded-xl text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-300">
              Nome Utente
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoFocus
                placeholder="Nome utente"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-750 rounded-xl text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-stone-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password di sicurezza"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-stone-950 border border-stone-750 rounded-xl text-xs sm:text-sm text-stone-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 placeholder-stone-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 cursor-pointer p-1"
                aria-label={showPassword ? 'Nascondi password' : 'Mostra password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-stone-950/60 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Audit Firebase attivo: lastUser, timeStamp, fromIp, browser</span>
          </div>

          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-stone-950" />
              <span>Entra in Gestione</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
