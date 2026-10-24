import React, { useEffect, useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { SlidingImageDescriptor } from '../types';
import { getLocalizedSlideContent } from '../data/slidingsConfigData';

function resolveSlideImageUrl(bucketPath: string, fileNameOrUrl: string): string {
  const cleanFile = (fileNameOrUrl || '').trim();
  if (!cleanFile) {
    return 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1400&q=85';
  }
  if (
    cleanFile.startsWith('http://') ||
    cleanFile.startsWith('https://') ||
    cleanFile.startsWith('/') ||
    cleanFile.startsWith('data:')
  ) {
    return cleanFile;
  }
  const cleanBucket = (bucketPath || '').trim().replace(/\/+$/, '');
  if (!cleanBucket || cleanBucket.startsWith('gs://')) {
    return `/facebook/immaginiFB/${cleanFile}`;
  }
  return `${cleanBucket}/${cleanFile}`;
}

export const HeaderSlidingRow: React.FC = () => {
  const { slidingsConfig, activePage, theme } = useStore();
  const { language } = useI18n();
  const isLight = theme === 'chiaro';

  // Find matching slider for activePage (exact match first, then 'tutte' / 'header')
  const activeSlider = useMemo(() => {
    if (!slidingsConfig || slidingsConfig.length === 0) return null;
    const exactMatch = slidingsConfig.find(
      (s) =>
        s.riferimentoPagina &&
        s.riferimentoPagina.toLowerCase() === activePage.toLowerCase() &&
        Array.isArray(s.descrizione) &&
        s.descrizione.length > 0
    );
    if (exactMatch) return exactMatch;

    const globalMatch = slidingsConfig.find(
      (s) =>
        s.riferimentoPagina &&
        (s.riferimentoPagina.toLowerCase() === 'tutte' ||
          s.riferimentoPagina.toLowerCase() === 'header' ||
          s.riferimentoPagina.toLowerCase() === 'all') &&
        Array.isArray(s.descrizione) &&
        s.descrizione.length > 0
    );
    return globalMatch || null;
  }, [slidingsConfig, activePage]);

  const slides: SlidingImageDescriptor[] = activeSlider?.descrizione || [];
  const intervalMs = Math.max(1500, Number(activeSlider?.tempoDiSliding) || 5000);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Reset slide index when activeSlider changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeSlider?.id]);

  // Auto-advance timer configured by tempoDiSliding
  useEffect(() => {
    if (!activeSlider || slides.length <= 1 || isPaused) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [activeSlider, slides.length, intervalMs, isPaused]);

  if (!activeSlider || slides.length === 0) {
    return null;
  }

  const safeIndex = currentIndex < slides.length ? currentIndex : 0;
  const currentSlide = slides[safeIndex];
  const currentImageUrl = resolveSlideImageUrl(activeSlider.bucketPath, currentSlide.fileNameOrUrl);
  const currentLocalized = getLocalizedSlideContent(currentSlide, language);

  return (
    <div
      id="header_row_3_sliding"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full border-b transition-colors ${
        isLight ? 'bg-stone-100/95 border-stone-200' : 'bg-stone-950/95 border-stone-800/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5">
        {/* Panoramic Visual Slide Banner - Clicking the photo opens the corresponding Facebook page in a new tab */}
        <div className="relative w-full h-28 sm:h-36 md:h-44 rounded-xl overflow-hidden border border-amber-500/25 shadow-md group">
          <a
            href={currentLocalized.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={currentLocalized.openFbLabel}
            aria-label={currentLocalized.openFbLabel}
            className="block w-full h-full relative cursor-pointer"
          >
            <img
              key={currentSlide.id || safeIndex}
              src={currentImageUrl}
              alt={currentLocalized.nomePulsante}
              className="w-full h-full object-cover object-center transition-all duration-700 transform scale-100 group-hover:scale-102"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1400&q=85';
              }}
            />

            {/* Gradient Overlay with generous left/right padding so text never overlaps navigation arrows */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-stone-950/25 flex flex-col justify-center pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-20 md:pr-20">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-xs line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {currentLocalized.nomePulsante}
                </h3>
                <ExternalLink className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-stone-200 max-w-2xl mt-1 line-clamp-2 drop-shadow-xs">
                {currentLocalized.descrizione}
              </p>
            </div>
          </a>

          {/* Left/Right Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
                }}
                title={currentLocalized.prevSlideLabel}
                aria-label={currentLocalized.prevSlideLabel}
                className="absolute left-2.5 sm:left-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-stone-950/80 hover:bg-amber-500 text-white hover:text-stone-950 border border-stone-700/80 flex items-center justify-center transition-all shadow-md cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex((prev) => (prev + 1) % slides.length);
                }}
                title={currentLocalized.nextSlideLabel}
                aria-label={currentLocalized.nextSlideLabel}
                className="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-500/90 hover:bg-amber-400 text-stone-950 border border-amber-300 flex items-center justify-center transition-all shadow-md cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>

        {/* Multilingual Buttons Row Underneath the Carousel */}
        <div className="mt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {slides.map((slide, idx) => {
            const isActive = idx === safeIndex;
            const loc = getLocalizedSlideContent(slide, language);
            return (
              <button
                key={slide.id || idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                title={loc.descrizione}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-xs'
                    : isLight
                    ? 'bg-white text-stone-700 border-stone-300 hover:border-amber-400 hover:text-stone-950'
                    : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    isActive ? 'bg-stone-950' : 'bg-amber-500/60'
                  }`}
                />
                <span className="whitespace-nowrap">{loc.nomePulsante}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
