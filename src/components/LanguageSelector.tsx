import React, { useEffect, useId, useRef, useState } from 'react';
import { useI18n, LANGUAGE_TO_COUNTRY, COUNTRY_CITIES_POOL } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/types';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CountryFlag } from './CountryFlag';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    language,
    setLanguage,
    detectedCountry,
    detectedCity,
    detectedCountryName,
    estimatedDistanceKm,
    setSimulatedCountry
  } = useI18n();
  const { theme, pushAdminNotification } = useStore();
  const isLight = theme === 'chiaro';
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const languageMenuId = useId();
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const selectedLanguage = SUPPORTED_LANGUAGES.find((option) => option.code === language)!;

  useEffect(() => {
    if (!languageMenuOpen) return;
    languageMenuRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]')?.focus();
    const closeOutside = (event: PointerEvent) => {
      if (!languageMenuRef.current?.contains(event.target as Node)) setLanguageMenuOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [languageMenuOpen]);

  const handleSelectLanguage = (code: LanguageCode, e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setLanguage(code);

    const relCountry = LANGUAGE_TO_COUNTRY[code] || 'IT';
    const pool = COUNTRY_CITIES_POOL[relCountry] || COUNTRY_CITIES_POOL.IT;
    const countryTitle = pool[0]?.countryName || relCountry;
    pushAdminNotification({
      type: 'USER_CONNECTED',
      severity: 'info',
      title: `Simulazione Utente (${countryTitle})`,
      message: `Cambio lingua (${code}): simulato collegamento e calcolo unità di misura per ${countryTitle}.`,
      countryCode: relCountry,
      deviceType: 'Smartphone'
    });
  };

  const handleRerollRandomCity = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSimulatedCountry(detectedCountry);
  };

  return (
    <div className={`inline-flex min-w-0 max-w-full items-center gap-2 flex-wrap text-left ${className}`}>
      <div
        ref={languageMenuRef}
        className="relative inline-flex shrink-0 lg:hidden"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLanguageMenuOpen(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            setLanguageMenuOpen(false);
            languageButtonRef.current?.focus();
          }
        }}
      >
        <button
          ref={languageButtonRef}
          type="button"
          aria-label={`Seleziona lingua: ${selectedLanguage.label}`}
          aria-haspopup="listbox"
          aria-expanded={languageMenuOpen}
          aria-controls={languageMenuId}
          onClick={() => setLanguageMenuOpen((open) => !open)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setLanguageMenuOpen(true);
            }
          }}
          className={`inline-flex h-7 w-28 items-center gap-1 rounded-lg border px-1.5 text-[11px] font-semibold focus-visible:outline-2 focus-visible:outline-amber-500 ${
            isLight ? 'bg-white text-stone-900 border-stone-300' : 'bg-stone-900 text-stone-100 border-stone-700'
          }`}
        >
          <CountryFlag code={language} size="sm" />
          <span className="min-w-0 flex-1 truncate text-left">{selectedLanguage.label}</span>
          <ChevronDown className="h-3 w-3 shrink-0" />
        </button>
        {languageMenuOpen && (
          <div
            id={languageMenuId}
            role="listbox"
            aria-label="Lingue disponibili"
            className={`absolute start-0 top-full z-50 mt-1 max-h-[min(22rem,60dvh)] w-44 max-w-[calc(100vw-1.5rem)] overflow-y-auto rounded-xl border p-1 shadow-xl ${
              isLight ? 'bg-white text-stone-900 border-stone-300' : 'bg-stone-900 text-stone-100 border-stone-700'
            }`}
            onKeyDown={(event) => {
              const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
              const index = options.indexOf(document.activeElement as HTMLButtonElement);
              let nextIndex: number;
              switch (event.key) {
                case 'ArrowDown': nextIndex = (index + 1) % options.length; break;
                case 'ArrowUp': nextIndex = (index - 1 + options.length) % options.length; break;
                case 'Home': nextIndex = 0; break;
                case 'End': nextIndex = options.length - 1; break;
                default: return;
              }
              event.preventDefault();
              options[nextIndex]?.focus();
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={lang.code === language}
                tabIndex={lang.code === language ? 0 : -1}
                onClick={() => {
                  handleSelectLanguage(lang.code);
                  setLanguageMenuOpen(false);
                  languageButtonRef.current?.focus();
                }}
                className="flex min-h-8 w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-amber-500/15 focus:bg-amber-500/15 focus:outline-none"
              >
                <CountryFlag code={lang.code} size="sm" />
                <span className="flex-1 text-left">{lang.label}</span>
                {lang.code === language && <Check className="h-3.5 w-3.5 text-amber-500" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        role="group"
        aria-label="Selezione lingua con bandierine"
        className={`hidden lg:inline-flex items-center gap-1 px-1.5 py-1 rounded-xl border ${
          isLight
            ? 'bg-white/90 border-stone-300 shadow-2xs'
            : 'bg-stone-900/90 border-stone-800 shadow-inner'
        }`}
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const isSelected = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={(e) => handleSelectLanguage(lang.code, e)}
              title={lang.country ? `${lang.label} (${lang.country})` : lang.label}
              aria-label={lang.label}
              aria-pressed={isSelected}
              className={`p-1 rounded-lg transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                isSelected
                  ? 'ring-2 ring-amber-500 bg-amber-500/20 scale-110 shadow-xs'
                  : 'opacity-65 hover:opacity-100 hover:scale-105 hover:bg-stone-200/60 dark:hover:bg-stone-800'
              }`}
            >
              <CountryFlag code={lang.code} size="sm" />
            </button>
          );
        })}
      </div>

      {/* Pulsante con località di provenienza e distanza dal negozio */}
      <button
        type="button"
        onClick={handleRerollRandomCity}
        title={`Località di provenienza: ${detectedCountryName} (${estimatedDistanceKm} km da Via Penzale 25, Cento FE). Clicca per estrarre un'altra città casuale di ${detectedCountry}.`}
        className={`hidden lg:inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all cursor-pointer shrink-0 leading-tight ${
          isLight
            ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 shadow-2xs'
            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40'
        }`}
      >
        <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
        <span>
          <span className="hidden sm:inline">{detectedCountryName}</span>
          <span className="sm:hidden">
            {detectedCountry} · {detectedCity}
          </span>
        </span>
        {estimatedDistanceKm > 0 && (
          <span className="text-[9px] sm:text-[10px] opacity-85 font-mono shrink-0">
            ({estimatedDistanceKm}km)
          </span>
        )}
      </button>
    </div>
  );
};
