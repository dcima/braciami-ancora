import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { OAuthProviderId } from '../firebase/firebase';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { LogOut, User as UserIcon, Shield, Sparkles, ChevronDown, DoorOpen, UserCheck } from 'lucide-react';
import { UserProfileModal } from './UserProfileModal';

interface OAuthProviderMenuItem {
  id: OAuthProviderId;
  label: string;
  icon: React.ReactNode;
}

const OAUTH_PROVIDERS: OAuthProviderMenuItem[] = [
  {
    id: 'google',
    label: 'Google',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        />
      </svg>
    )
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#1877F2"
          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
        />
      </svg>
    )
  },
  {
    id: 'apple',
    label: 'Apple',
    icon: (
      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    )
  },
  {
    id: 'microsoft',
    label: 'Microsoft',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#F25022" d="M1 1h10v10H1z" />
        <path fill="#7FBA00" d="M13 1h10v10H13z" />
        <path fill="#00A4EF" d="M1 13h10v10H1z" />
        <path fill="#FFB900" d="M13 13h10v10H13z" />
      </svg>
    )
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    icon: (
      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    id: 'yahoo',
    label: 'Yahoo',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="#6001D2" />
        <path
          fill="#FFFFFF"
          d="M7.2 6.8h2.6l2.1 4.4 2.1-4.4h2.5l-3.4 6.7v4.1h-2.4v-4.1L7.2 6.8zm9.7 8.5a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"
        />
      </svg>
    )
  },
  {
    id: 'github',
    label: 'GitHub',
    icon: (
      <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.7 5.39-5.27 5.67.41.36.78 1.07.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" />
      </svg>
    )
  }
];

export const UserAuthButton: React.FC = () => {
  const { user, profile, isAdmin, signInWithProvider, logOut, loading } = useAuth();
  const { theme, setActivePage, adminLogout } = useStore();
  const { uiText, resetToLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'chiaro';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsProviderMenuOpen(false);
      }
    };
    if (isOpen || isProviderMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, isProviderMenuOpen]);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-stone-800/40 animate-pulse shrink-0" />
    );
  }

  // Not logged in: Show Open Door icon + translated "Accedi con" button + OAuth Providers context menu
  if (!user) {
    return (
      <div className="relative inline-block text-left" ref={containerRef}>
        <button
          id="btn_google_sign_in"
          type="button"
          onClick={() => setIsProviderMenuOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isProviderMenuOpen}
          className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer border shrink-0 ${
            isLight
              ? 'bg-white hover:bg-stone-50 text-stone-800 border-stone-300'
              : 'bg-stone-900 hover:bg-stone-850 text-stone-200 border-stone-800'
          }`}
          title={uiText('btn_google_sign_in_title', 'Accedi con il tuo provider preferito')}
        >
          <DoorOpen className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{uiText('btn_sign_in_with', 'Accedi con')}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 transition-transform ${
              isProviderMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Context menu of OAuth providers (the provider itself manages its list of recently used accounts) */}
        {isProviderMenuOpen && (
          <div
            role="menu"
            aria-label={uiText('btn_sign_in_with', 'Accedi con')}
            className={`absolute left-0 right-auto sm:left-auto sm:right-0 top-full mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border z-[220] overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150 ${
              isLight
                ? 'bg-white border-stone-300 text-stone-900'
                : 'bg-stone-900 border-stone-700 text-stone-100'
            }`}
          >
            {OAUTH_PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                id={`btn_auth_provider_${provider.id}`}
                type="button"
                role="menuitem"
                onClick={async () => {
                  setIsProviderMenuOpen(false);
                  await signInWithProvider(provider.id);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                  isLight
                    ? 'hover:bg-amber-50 text-stone-800'
                    : 'hover:bg-stone-800 text-stone-100'
                }`}
              >
                {provider.icon}
                <span>{provider.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Logged in: Avatar with dropdown
  const avatarUrl = profile?.photo_url || user.photoURL;

  return (
    <>
      <div className="relative inline-block text-left" ref={containerRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            isLight
              ? 'bg-white hover:bg-stone-100 text-stone-900 border-stone-300 shadow-xs'
              : 'bg-stone-900 hover:bg-stone-850 text-stone-200 border-stone-800'
          }`}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.displayName || 'Utente'}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500/50"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
              {(user.displayName || user.email || 'U')[0].toUpperCase()}
            </div>
          )}
          <span className="max-w-[90px] truncate hidden md:inline">
            {profile?.nome || user.displayName?.split(' ')[0] || 'Account'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <div
            className={`absolute top-full left-0 right-auto sm:left-auto sm:right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl border z-[200] overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-150 ${
              isLight
                ? 'bg-white border-stone-300 text-stone-900'
                : 'bg-stone-900 border-stone-750 text-stone-100'
            }`}
          >
            {/* User Profile Header */}
            <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.displayName || ''}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/60"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold truncate">
                    {profile?.nome && profile?.cognome ? `${profile.nome} ${profile.cognome}` : user.displayName || 'Cliente Bottega'}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">{user.email}</p>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 mt-0.5">
                      <Shield className="w-3 h-3 text-amber-500" />
                      <span>{uiText('auth_admin_role', 'Amministratore')}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Loyalty points banner */}
              {!isAdmin && <div
                className={`mt-2.5 p-2 rounded-xl flex items-center justify-between text-xs ${
                  isLight ? 'bg-amber-50 text-amber-900' : 'bg-stone-800/80 text-amber-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>{uiText('auth_loyalty_points', 'Punti Fedeltà:')}</span>
                </div>
                <span className="font-bold">{profile?.punti_fedelta || profile?.loyaltyPoints || 100} pt</span>
              </div>}
            </div>

            {/* Links */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(true);
                }}
                className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-stone-100 text-stone-800' : 'hover:bg-stone-800 text-stone-200'
                }`}
              >
                <UserCheck className="w-4 h-4 text-amber-500" />
                <span>{isAdmin ? 'Profilo amministratore' : uiText('auth_my_profile', 'Il mio profilo')}</span>
              </button>

              <button
                onClick={() => {
                  setActivePage(isAdmin ? 'admin-crm' : 'ordini');
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2.5 cursor-pointer transition-colors ${
                  isLight ? 'hover:bg-stone-100 text-stone-800' : 'hover:bg-stone-800 text-stone-200'
                }`}
              >
                <UserIcon className="w-4 h-4 text-amber-500" />
                <span>{isAdmin ? 'Gestione negozio' : uiText('auth_my_orders', 'I Miei Ordini & Tracciamento')}</span>
              </button>
            </div>

            {/* Logout button */}
            <div className="pt-1 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={async () => {
                  setIsOpen(false);
                  await logOut();
                  resetToLocale();
                  adminLogout();
                  setActivePage('intro');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full px-4 py-2 text-left text-xs flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer`}
              >
                <LogOut className="w-4 h-4" />
                <span>{uiText('auth_logout', "Esci dall'account")}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pannello Modal "Il Mio Profilo" */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};
