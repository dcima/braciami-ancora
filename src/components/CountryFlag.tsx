import React from 'react';
import { LanguageCode } from '../i18n/types';

interface CountryFlagProps {
  code: LanguageCode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CountryFlag: React.FC<CountryFlagProps> = ({
  code,
  className = '',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'w-4 h-3',
    md: 'w-5 h-3.5',
    lg: 'w-6 h-4'
  };

  const baseClasses = `${sizeMap[size]} shrink-0 inline-block rounded-xs shadow-2xs border border-black/20 overflow-hidden align-middle ${className}`;

  switch (code) {
    case 'it_IT':
      // Italy: Green, White, Red vertical tricolor
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Bandiera Italia">
          <rect width="10" height="20" fill="#009246" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#ce2b37" />
        </svg>
      );

    case 'en_US':
      // United Kingdom: Union Jack
      return (
        <svg viewBox="0 0 60 30" className={baseClasses} aria-label="Flag United Kingdom">
          <clipPath id="uk-clip">
            <rect width="60" height="30" />
          </clipPath>
          <g clipPath="url(#uk-clip)">
            <rect width="60" height="30" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
            <path d="M0,0 L60,30" stroke="#c8102e" strokeWidth="2" strokeDasharray="30" />
            <path d="M60,0 L0,30" stroke="#c8102e" strokeWidth="2" strokeDasharray="30" strokeDashoffset="30" />
            <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
          </g>
        </svg>
      );

    case 'fr_FR':
      // France: Blue, White, Red vertical tricolor
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Drapeau France">
          <rect width="10" height="20" fill="#002654" />
          <rect x="10" width="10" height="20" fill="#ffffff" />
          <rect x="20" width="10" height="20" fill="#ce1126" />
        </svg>
      );

    case 'de_DE':
      // Germany: Black, Red, Gold horizontal tricolor
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Flagge Deutschland">
          <rect width="30" height="6.67" fill="#000000" />
          <rect y="6.67" width="30" height="6.67" fill="#dd0000" />
          <rect y="13.34" width="30" height="6.66" fill="#ffce00" />
        </svg>
      );

    case 'es_ES':
      // Spain: Red, Yellow (double height), Red horizontal tricolor with coat of arms mark
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Bandera de España">
          <rect width="30" height="5" fill="#aa151b" />
          <rect y="5" width="30" height="10" fill="#f1bf00" />
          <rect y="15" width="30" height="5" fill="#aa151b" />
          {/* Subtle Spanish shield / pillar icon */}
          <circle cx="8" cy="10" r="2.5" fill="#aa151b" opacity="0.85" />
          <circle cx="8" cy="10" r="1.5" fill="#f1bf00" />
        </svg>
      );

    case 'zh_CN':
      // China: Red field with large star and 4 small stars
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Flag of China">
          <rect width="30" height="20" fill="#de2910" />
          {/* Main big star */}
          <polygon
            points="5,3 6.2,6.7 3,4.4 7,4.4 3.8,6.7"
            fill="#ffde00"
          />
          {/* 4 small arc stars */}
          <circle cx="10" cy="2.5" r="0.7" fill="#ffde00" />
          <circle cx="12" cy="4.5" r="0.7" fill="#ffde00" />
          <circle cx="12" cy="7.5" r="0.7" fill="#ffde00" />
          <circle cx="10" cy="9.5" r="0.7" fill="#ffde00" />
        </svg>
      );

    case 'ja_JP':
      // Japan: White field with red disc
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Flag of Japan">
          <rect width="30" height="20" fill="#ffffff" />
          <circle cx="15" cy="10" r="6" fill="#bc002d" />
        </svg>
      );

    case 'ru_RU':
      // Russia: White, Blue, Red horizontal tricolor
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Flag of Russia">
          <rect width="30" height="6.67" fill="#ffffff" />
          <rect y="6.67" width="30" height="6.67" fill="#0039a6" />
          <rect y="13.34" width="30" height="6.66" fill="#d52b1e" />
        </svg>
      );

    case 'nl_NL':
      // Netherlands: Red, White, Blue horizontal tricolor
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Vlag Nederland">
          <rect width="30" height="6.67" fill="#ae1c28" />
          <rect y="6.67" width="30" height="6.67" fill="#ffffff" />
          <rect y="13.34" width="30" height="6.66" fill="#21468b" />
        </svg>
      );

    case 'sv_SE':
      // Sweden: Blue field with yellow Nordic cross
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Sveriges flagga">
          <rect width="30" height="20" fill="#006aa7" />
          <rect x="8" width="4" height="20" fill="#fecc02" />
          <rect y="8" width="30" height="4" fill="#fecc02" />
        </svg>
      );

    case 'ar_SA':
      // Saudi Arabia / Arabic: Green field with white sword & emblem
      return (
        <svg viewBox="0 0 30 20" className={baseClasses} aria-label="Flag of Saudi Arabia">
          <rect width="30" height="20" fill="#006c35" />
          {/* Stylized white emblem & sword */}
          <line x1="7" y1="13.5" x2="23" y2="13.5" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8,11 h14 M9,9 h12 M11,7 h8" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.95" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 30 20" className={baseClasses}>
          <rect width="30" height="20" fill="#666666" />
        </svg>
      );
  }
};
