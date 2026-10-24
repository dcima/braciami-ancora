import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { ExtrapolatedFace } from './ExtrapolatedFaces';
import { BrandLogo } from './BrandLogo';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';
import { UserAuthButton } from './UserAuthButton';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  QrCode
} from 'lucide-react';

export const IntroLanding: React.FC = () => {
  const { setActivePage, setIsLoyaltyOpen, theme, pushAdminNotification } = useStore();
  const {
    language,
    t,
    uiText,
    detectedCountry,
    detectedCountryName,
    estimatedDistanceKm,
    setSimulatedCountry
  } = useI18n();
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const isLight = theme === 'chiaro';

  const slides = useMemo(
    () => [
      {
        id: 'manuel' as const,
        person: 'manuel' as const,
        name: 'Manuel Cannatà',
        roleKey: 'hero_subtitle_manuel',
        descriptionKey: 'hero_quote_manuel',
        thumb: '/assets/aistudio/manuel_cannat__7be14e0a.jpg',
        label: 'Manuel'
      },
      {
        id: 'samanta' as const,
        person: 'samanta' as const,
        name: 'Samanta',
        roleKey: 'hero_subtitle_samanta',
        descriptionKey: 'hero_quote_samanta',
        thumb: '/assets/aistudio/samanta_maderioli_f3b2f7b7.jpg',
        label: 'Samanta'
      },
      {
        id: 'together' as const,
        person: 'together' as const,
        name: 'Bottega di Cento',
        roleKey: 'hero_subtitle_together',
        descriptionKey: 'hero_quote_together',
        thumb: '/assets/aistudio/Screenshot_2026-10-23_161055_986f6caa.png',
        label: 'Bottega'
      }
    ],
    [language]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const active = slides[currentSlide];

  const handleCountrySim = (code: string, label: string) => {
    setSimulatedCountry(code);
    pushAdminNotification({
      type: 'USER_CONNECTED',
      severity: 'info',
      title: `Nuovo Collegamento Utente (${label})`,
      message: `Sessione mobile attiva da ${label}. Lingua e unità di misura convertite automaticamente (${code === 'GB' ? 'oz / lb / fl oz' : code === 'CN' ? '斤 Jīn / 两 Liǎng' : code === 'JP' ? '100gあたり / 合' : 'g / kg / L'}).`,
      countryCode: code,
      deviceType: 'Smartphone'
    });
  };

  return (
    <div
      id="landing-page-root"
      className={`relative min-h-[100dvh] w-full max-w-[100vw] flex flex-col justify-between overflow-x-clip select-none transition-colors duration-200 ${
        isLight ? 'bg-[#FAF8F5] text-stone-900' : 'bg-stone-950 text-stone-100'
      }`}
    >
      {/* Background Ambient Glow */}
      {isLight ? (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
      ) : (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-gradient-to-tr from-amber-600/20 via-rose-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Compact Mobile-First Header: Left = Title + Address below, Right = Controls + Language & Simulated Country/City */}
      <header
        id="landing_header"
        className="relative z-50 max-w-7xl w-full mx-auto px-3 sm:px-6 pt-3 pb-1.5 shrink-0 flex items-center justify-between gap-1.5"
      >
        <BrandLogo variant="compact" theme={isLight ? 'light' : 'dark'} />

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeSelector />
          <UserAuthButton />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Mobile-First Stage */}
      <main
        id="landing_stage_main"
        className="relative z-10 flex-1 max-w-2xl w-full mx-auto px-3 sm:px-6 flex flex-col items-center justify-center py-2 min-h-0"
      >
        {/* Portrait & Safe In-Bounds Controls */}
        <div
          id="slideshow_face_container"
          className="relative w-full max-w-[260px] sm:max-w-xs flex flex-col items-center justify-center shrink-0"
        >
          <div className="relative z-10 flex items-center justify-center shadow-2xl rounded-3xl">
            <ExtrapolatedFace
              person={active.person}
              size="landing"
              className="!w-36 !h-36 sm:!w-48 sm:!h-48 md:!w-56 md:!h-56"
            />
          </div>

          <button
            id="btn_slide_prev"
            onClick={handlePrev}
            className={`absolute left-0 sm:-left-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border shadow-lg transition-all cursor-pointer ${
              isLight
                ? 'bg-white/95 hover:bg-white text-stone-800 border-stone-300'
                : 'bg-stone-900/95 hover:bg-stone-800 text-stone-200 border-stone-700'
            }`}
            aria-label={uiText('btn_prev', 'Precedente')}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            id="btn_slide_next"
            onClick={handleNext}
            className={`absolute right-0 sm:-right-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border shadow-lg transition-all cursor-pointer ${
              isLight
                ? 'bg-white/95 hover:bg-white text-stone-800 border-stone-300'
                : 'bg-stone-900/95 hover:bg-stone-800 text-stone-200 border-stone-700'
            }`}
            aria-label={uiText('btn_next', 'Successivo')}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Fluid Motto Pedestal Box */}
        <div
          id="motto_pedestal_box"
          className="mt-2.5 w-full max-w-md z-20 flex flex-col items-center text-center px-1 shrink-0"
        >
          <div
            className={`border rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 shadow-lg w-full transition-colors ${
              isLight
                ? 'bg-white/95 border-amber-300 text-stone-900'
                : 'bg-stone-900/90 border-amber-500/40 text-stone-100'
            }`}
          >
            <span
              id="motto_role_subtitle"
              className={`text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold block mb-0.5 truncate ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              {active.name} · {uiText(active.roleKey, t(active.roleKey as any))}
            </span>
            <h1
              id="motto_main_quote"
              className={`font-display text-sm sm:text-lg md:text-xl font-black tracking-tight leading-snug ${
                isLight ? 'text-stone-950' : 'text-white'
              }`}
            >
              {uiText('store_motto_quote', t('store_motto_quote'))}
            </h1>
            <p
              id="motto_desc_quote"
              className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
                isLight ? 'text-stone-600' : 'text-stone-300'
              }`}
            >
              {uiText(active.descriptionKey, t(active.descriptionKey as any))}
            </p>
          </div>
        </div>

        {/* Responsive Slide Thumbnails */}
        <div
          id="slides_selector_thumbs"
          className="flex items-center justify-center gap-1.5 sm:gap-2 mt-2.5 z-20 flex-wrap"
        >
          {slides.map((s, idx) => {
            const isSelected = currentSlide === idx;
            return (
              <button
                key={s.id}
                id={`thumb_slide_${s.id}`}
                onClick={() => setCurrentSlide(idx)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? isLight
                      ? 'bg-amber-100 border-amber-400 text-stone-950 shadow-xs'
                      : 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-xs'
                    : isLight
                    ? 'bg-white/80 hover:bg-stone-100 border-stone-200 text-stone-600'
                    : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 text-stone-400'
                }`}
              >
                <img
                  src={s.thumb}
                  alt={s.label}
                  className="w-4 h-4 rounded-full object-cover object-top border border-amber-500/60 shrink-0"
                />
                <span className="text-[10px] font-bold tracking-wide">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Mobile-First Action Buttons */}
        <div
          id="cta_enter_shop_wrapper"
          className="mt-3 w-full max-w-sm z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 px-1 shrink-0"
        >
          <button
            id="btn_enter_shop"
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-display font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{uiText('btn_enter_shop', 'ENTRA IN NEGOZIO')}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          {/* Requirement (d): in landing page non visualizzare più il pulsante "Tessera barcode" (mantenuto nel codice per uso futuro) */}
          {false && (
            <button
              id="btn_open_virtual_card_landing"
              onClick={() => {
                setActivePage('home');
                setIsLoyaltyOpen(true);
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLight
                  ? 'bg-white border-stone-300 text-stone-800 hover:bg-amber-50'
                  : 'bg-stone-900 border-stone-700 text-amber-300 hover:bg-stone-800'
              }`}
            >
              <QrCode className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{uiText('btn_virtual_card', 'Tessera Barcode')}</span>
            </button>
          )}
        </div>
      </main>

      {/* Compact Mobile-Safe Footer */}
      <footer
        id="landing_footer"
        className={`relative z-20 text-center py-2 px-3 text-[10px] sm:text-[11px] border-t shrink-0 ${
          isLight
            ? 'border-stone-200 text-stone-500 bg-white/80'
            : 'border-stone-900 text-stone-400 bg-stone-950/90'
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span className="font-bold text-amber-600 dark:text-amber-400">Braciami Ancora</span>
          <span>·</span>
          <span>Manuel & Samanta</span>
          <span>·</span>
          <a
            href="https://maps.google.com/?q=Via+Penzale+25+44042+Cento+FE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 underline transition-colors"
          >
            Via Penzale 25, 44042 Cento FE
          </a>
        </div>
      </footer>
    </div>
  );
};
