import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { ExtrapolatedFace } from './ExtrapolatedFaces';
import {
  Flame,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ShoppingCart,
  Pause,
  Play
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActivePage, setIsPromoModalOpen, theme } = useStore();
  const { t, uiText } = useI18n();
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const touchStartX = useRef<number | null>(null);

  const isLight = theme === 'chiaro';

  const slides = [
    {
      id: 'manuel',
      roleKey: 'hero_tag',
      name: 'Manuel Cannatà',
      subtitleKey: 'hero_subtitle_manuel',
      quoteKey: 'hero_quote_manuel',
      favoriteSpecialtyKey: 'hero_specialty_manuel',
      actionLabelKey: 'hero_action_manuel',
      faceComponent: <ExtrapolatedFace person="manuel" size="hero" className="!w-36 !h-36 sm:!w-48 sm:!h-48 lg:!w-72 lg:!h-72" />
    },
    {
      id: 'samanta',
      roleKey: 'hero_tag',
      name: 'Samanta',
      subtitleKey: 'hero_subtitle_samanta',
      quoteKey: 'hero_quote_samanta',
      favoriteSpecialtyKey: 'hero_specialty_samanta',
      actionLabelKey: 'hero_action_samanta',
      faceComponent: <ExtrapolatedFace person="samanta" size="hero" className="!w-36 !h-36 sm:!w-48 sm:!h-48 lg:!w-72 lg:!h-72" />
    },
    {
      id: 'together',
      roleKey: 'hero_tag',
      name: t('hero_title_together'),
      subtitleKey: 'hero_subtitle_together',
      quoteKey: 'hero_quote_together',
      favoriteSpecialtyKey: 'hero_specialty_together',
      actionLabelKey: 'hero_action_together',
      faceComponent: <ExtrapolatedFace person="together" size="hero" className="!w-36 !h-36 sm:!w-48 sm:!h-48 lg:!w-72 lg:!h-72" />
    }
  ];

  // Auto slide effect
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const active = slides[currentSlide];

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  return (
    <section
      className={`relative overflow-hidden transition-colors duration-200 border-b ${
        isLight
          ? 'bg-[#FAF8F5] text-stone-900 border-stone-200'
          : 'bg-stone-950 text-stone-100 border-stone-850'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Background ambient lighting */}
      {isLight ? (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-rose-100/30 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-rose-700/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Decorative hairline pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#8c7562_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 lg:py-14 relative z-10">
        
        {/* Motto & Offerte Attive Bar */}
        <div
          className={`flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-5 pb-4 border-b ${
            isLight ? 'border-stone-200' : 'border-stone-850'
          }`}
        >
          {/* Motto */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs min-w-0 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-stone-900/90 border-stone-800 text-stone-100'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500 animate-pulse shrink-0" />
            <div className="flex items-center gap-1.5 text-xs min-w-0 truncate">
              <span className={isLight ? 'text-stone-500 hidden md:inline' : 'text-stone-400 hidden md:inline'}>
                Manuel & Samanta:
              </span>
              <span
                className={`font-display font-extrabold text-xs sm:text-sm tracking-wide truncate ${
                  isLight ? 'text-amber-900' : 'text-amber-300'
                }`}
              >
                {uiText('store_motto_quote', t('store_motto_quote'))}
              </span>
            </div>
          </div>

          {/* Offerte Attive Button */}
          <button
            onClick={() => setIsPromoModalOpen(true)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 ${
              isLight
                ? 'bg-white hover:bg-amber-50 text-amber-950 border-amber-300/80'
                : 'bg-stone-900 hover:bg-stone-850 text-amber-400 border-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{uiText('hero_active_offers', t('hero_active_offers'))}</span>
          </button>
        </div>

        {/* The Interactive Sliding Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Narrative Content of Current Slide */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Sliding Subheader Badge with Face Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`px-2.5 py-1.5 text-xs rounded-xl transition-all font-semibold flex items-center gap-1.5 cursor-pointer ${
                    currentSlide === idx
                      ? isLight
                        ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                        : 'bg-amber-400 text-stone-950 shadow-md font-bold'
                      : isLight
                      ? 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 hover:bg-stone-850 border border-stone-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                  <span>{s.name}</span>
                </button>
              ))}

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-1.5 rounded-md transition-colors ml-auto cursor-pointer ${
                  isLight ? 'text-stone-400 hover:text-stone-700' : 'text-stone-500 hover:text-stone-300'
                }`}
                title={isPlaying ? t('hero_pause') : t('hero_play')}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Slide Title & Tagline */}
            <div className="space-y-1.5">
              <span
                className={`text-[11px] uppercase tracking-widest font-semibold block ${
                  isLight ? 'text-amber-800' : 'text-amber-400'
                }`}
              >
                {uiText(active.roleKey, t(active.roleKey as any))}
              </span>
              <h1
                className={`font-display text-fluid-hero font-bold tracking-tight ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}
                style={{ textWrap: 'balance' }}
              >
                {uiText(active.subtitleKey, t(active.subtitleKey as any))}
              </h1>
            </div>

            {/* Slide Quotation reflecting "Qualità al giusto prezzo" */}
            <div
              className={`border rounded-2xl p-4 sm:p-5 shadow-md relative backdrop-blur-xs ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-800'
                  : 'bg-stone-900/90 border-stone-800 text-stone-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0 mt-1" />
                <div className="space-y-2.5 min-w-0">
                  <blockquote
                    className={`text-xs sm:text-sm italic font-serif leading-relaxed ${
                      isLight ? 'text-stone-800' : 'text-stone-200'
                    }`}
                  >
                    {uiText(active.quoteKey, t(active.quoteKey as any))}
                  </blockquote>
                  <div
                    className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] ${
                      isLight ? 'border-stone-100' : 'border-stone-800'
                    }`}
                  >
                    <span className={isLight ? 'text-stone-600' : 'text-stone-400'}>
                      {uiText('store_motto', t('store_motto'))}:{' '}
                      <strong className={isLight ? 'text-amber-900' : 'text-amber-400'}>
                        {uiText(active.favoriteSpecialtyKey, t(active.favoriteSpecialtyKey as any))}
                      </strong>
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono-nums">
                      Cento (FE) · Brace di Rovere
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setActivePage('catalogo');
                  window.scrollTo({ top: 380, behavior: 'smooth' });
                }}
                className={`flex-1 sm:flex-initial justify-center px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isLight
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-900/10'
                    : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-950/30'
                }`}
              >
                <ShoppingCart className="w-4 h-4 shrink-0" />
                <span>{uiText(active.actionLabelKey, t(active.actionLabelKey as any))}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={() => {
                  setActivePage('chi-siamo');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl border transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs'
                    : 'bg-stone-900 hover:bg-stone-850 text-stone-200 border-stone-800'
                }`}
              >
                {uiText('nav_about', t('nav_about'))}
              </button>
            </div>
          </div>

          {/* Right Column: Visual Sliding Carousel with Manuel and Samanta's Portraits */}
          <div className="order-first lg:order-none lg:col-span-5 flex flex-col items-center min-w-0">
            <div
              className={`relative w-full max-w-sm rounded-3xl border p-2.5 sm:p-4 lg:p-6 flex flex-col items-center justify-between text-center shadow-xl overflow-hidden group ${
                isLight
                  ? 'bg-gradient-to-b from-white via-stone-50 to-stone-100 border-stone-200'
                  : 'bg-gradient-to-b from-stone-900 via-stone-920 to-stone-950 border-stone-800'
              }`}
            >
              {/* Prev / Next Slide Nav Chevrons */}
              <button
                onClick={prevSlide}
                className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border shadow-lg transition-all focus:outline-none cursor-pointer ${
                  isLight
                    ? 'bg-white/90 hover:bg-white text-stone-800 border-stone-200'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border-stone-700/60'
                }`}
                aria-label="Precedente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={nextSlide}
                className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full border shadow-lg transition-all focus:outline-none cursor-pointer ${
                  isLight
                    ? 'bg-white/90 hover:bg-white text-stone-800 border-stone-200'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border-stone-700/60'
                }`}
                aria-label="Successivo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Top Slide Meta Tag */}
              <div className="flex items-center gap-2 z-10">
                <span
                  className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border ${
                    isLight
                      ? 'bg-amber-100 text-amber-950 border-amber-300'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  Bottega Alimentare Cento
                </span>
                <span className="text-[11px] text-stone-400 font-mono-nums">
                  {currentSlide + 1} / {slides.length}
                </span>
              </div>

              {/* The Face Component */}
              <div className="my-2 lg:my-auto transform transition-transform duration-500 group-hover:scale-102 z-10 flex items-center justify-center">
                {active.faceComponent}
              </div>

              {/* Bottom Info Footnote */}
              <div className="z-10 w-full pt-1 lg:pt-4">
                <p className={`text-xs ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  {active.name} · {t('store_address_short')}
                </p>
                {/* Visual Progress Indicators */}
                <div className="flex items-center justify-center gap-2 mt-2 lg:mt-3">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx
                          ? isLight
                            ? 'w-8 bg-amber-600'
                            : 'w-8 bg-amber-400'
                          : isLight
                          ? 'w-2 bg-stone-300 hover:bg-stone-400'
                          : 'w-2 bg-stone-700 hover:bg-stone-500'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
