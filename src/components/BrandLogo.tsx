import React from 'react';
import { useI18n } from '../i18n/I18nContext';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'emblem';
  className?: string;
  theme?: 'dark' | 'light';
  titleTooltip?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className = '',
  theme = 'dark',
  titleTooltip = 'Braciami ancora · Cento Ferrara — Clicca sul titolo per tornare alla pagina di presentazione (Landing Page)'
}) => {
  const isDark = theme === 'dark';
  const { t } = useI18n();

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center select-none ${className}`} title={titleTooltip}>
        <div className="relative shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-600 to-stone-900 p-0.5 shadow-md shadow-amber-900/20">
          <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 32 32" className="w-6 h-6 relative z-10" fill="none">
              <path
                d="M16 3 C16 3, 22 9, 22 16 C22 21.5, 18.5 25, 14 25 C10 25, 7 22, 7 17 C7 11.5, 12 7, 16 3 Z"
                fill="#f59e0b"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      title={titleTooltip}
      className={`inline-grid grid-cols-[auto_1fr] grid-rows-3 items-center gap-x-2.5 sm:gap-x-3 gap-y-0.5 select-none min-w-0 text-left ${className}`}
    >
      {/* Left Column: Logo Spanned across all 3 rows (row-span-3) */}
      <div className="row-span-3 relative shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-600 to-stone-900 p-0.5 shadow-md shadow-amber-900/25 flex items-center justify-center">
        <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="8" y1="8" x2="36" y2="36" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="36" y1="8" x2="8" y2="36" stroke="#f59e0b" strokeWidth="1.5" />
            <circle cx="22" cy="22" r="16" stroke="#ea580c" strokeWidth="1.2" strokeDasharray="3 3" />
          </svg>

          <svg
            viewBox="0 0 32 32"
            className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="flameGradLogo" x1="0%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="45%" stopColor="#ea580c" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <path
              d="M16 3 C16 3, 22 9, 22 16 C22 21.5, 18.5 25, 14 25 C10 25, 7 22, 7 17 C7 11.5, 12 7, 16 3 Z"
              fill="url(#flameGradLogo)"
            />
            <path
              d="M16 11 C16 11, 19 14.5, 19 18 C19 20.8, 17 22.5, 15 22.5 C12.8 22.5, 11.5 21, 11.5 18.5 C11.5 15.5, 14 13, 16 11 Z"
              fill="#fef08a"
              opacity="0.95"
            />
            <circle cx="21" cy="7" r="1.2" fill="#fbbf24" />
            <circle cx="25" cy="12" r="1" fill="#ea580c" />
          </svg>
        </div>
      </div>

      {/* Row 1 of Title: Main Brand Name */}
      <div
        className={`font-display text-sm sm:text-base lg:text-lg font-black tracking-tight leading-tight truncate ${
          isDark ? 'text-white' : 'text-stone-950'
        }`}
      >
        Braciami Ancora
      </div>

      {/* Row 2 of Title: Category & Artisanal Subtitle */}
      <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-amber-500 leading-tight whitespace-normal">
        {t('store_category')}
      </div>

      {/* Row 3 of Title: Store Address & City */}
      <div
        role="link"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          window.open('https://maps.google.com/?q=Via+Penzale+25+44042+Cento+FE', '_blank', 'noopener,noreferrer');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            window.open('https://maps.google.com/?q=Via+Penzale+25+44042+Cento+FE', '_blank', 'noopener,noreferrer');
          }
        }}
        title="Apri su Google Maps: Via Penzale 25, 44042 Cento FE"
        className={`text-[10px] sm:text-[11px] font-medium tracking-tight leading-tight truncate hover:text-amber-500 hover:underline transition-colors cursor-pointer ${
          isDark ? 'text-stone-300' : 'text-stone-600'
        }`}
      >
        Via Penzale 25, 44042 Cento (FE)
      </div>
    </div>
  );
};
