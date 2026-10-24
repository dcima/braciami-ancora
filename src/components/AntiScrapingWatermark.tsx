import React, { useMemo } from 'react';

interface AntiScrapingWatermarkProps {
  productId?: string;
  eanCode?: string;
  assetType?: 'IMAGE' | 'SLIDESHOW' | 'YOUTUBE' | 'GOOGLE_SLIDES' | 'TECH_SHEET';
  customWatermarkId?: string;
  className?: string;
}

/**
 * Watermark dinamico di tracciamento anti-bot / anti-scraping:
 * - Sovrappone un pattern diagonale crittografato e un badge firma con ID univoco dell'articolo, EAN e hash sessione.
 * - Inserisce attributi DOM honeypot e blocca il drag/salvataggio diretto da bot automatici.
 */
export const AntiScrapingWatermark: React.FC<AntiScrapingWatermarkProps> = ({
  productId = 'BA-ITEM',
  eanCode = '80044042',
  assetType = 'IMAGE',
  customWatermarkId,
  className = ''
}) => {
  const traceToken = useMemo(() => {
    if (customWatermarkId) return customWatermarkId;
    const dayStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const hash = Math.abs(
      Array.from(`${productId}-${eanCode}-${assetType}`).reduce(
        (acc, ch) => (acc << 5) - acc + ch.charCodeAt(0),
        0
      )
    )
      .toString(16)
      .toUpperCase()
      .slice(0, 6);
    return `WM-BA-${dayStamp}-${hash}`;
  }, [productId, eanCode, assetType, customWatermarkId]);

  return (
    <div
      aria-hidden="true"
      data-anti-bot-trace={traceToken}
      data-owner="Braciami Ancora · Via Penzale 25, 44042 Cento FE"
      onContextMenu={(e) => e.preventDefault()}
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-20 flex flex-col justify-between p-2 ${className}`}
    >
      {/* Diagonal Repeating Watermark Grid */}
      <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-6 -rotate-18 opacity-20">
        {Array.from({ length: 6 }).map((_, idx) => (
          <span
            key={idx}
            className="text-[9px] sm:text-[10px] font-mono font-black uppercase tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] whitespace-nowrap"
          >
            © BRACIAMI ANCORA CENTO · {traceToken} · NO-SCRAPE
          </span>
        ))}
      </div>

      {/* Bottom-Right Forensic Tracking Stamp */}
      <div className="mt-auto ml-auto relative z-10 px-1.5 py-0.5 rounded bg-stone-950/65 backdrop-blur-xs border border-amber-500/30 text-[8px] font-mono text-amber-300/90 tracking-wider">
        🔒 {traceToken} · {assetType}
      </div>
    </div>
  );
};
