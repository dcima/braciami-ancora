import React from 'react';
import { useI18n, LANGUAGE_TO_COUNTRY, COUNTRY_CITIES_POOL } from '../i18n/I18nContext';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/types';
import { MapPin } from 'lucide-react';
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
    <div className={`inline-flex items-center gap-2 flex-wrap text-left ${className}`}>
      {/* Fila orizzontale delle bandierine corrispondenti alle lingue supportate (nessun combobox) */}
      <div
        role="group"
        aria-label="Selezione lingua con bandierine"
        className={`inline-flex items-center gap-1 px-1.5 py-1 rounded-xl border ${
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
        className={`inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] font-bold border transition-all cursor-pointer shrink-0 leading-tight ${
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
