import React, { useState } from 'react';
import { Product } from '../types';
import { Flame, Beef, ShoppingBag, UtensilsCrossed, Wine, PackageCheck } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { AntiScrapingWatermark } from './AntiScrapingWatermark';

interface ProductVisualProps {
  product: Product;
  className?: string;
  showBadge?: boolean;
  hideBottomCode?: boolean;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  className = 'h-48 sm:h-52',
  showBadge = true,
  hideBottomCode = false
}) => {
  const [imgError, setImgError] = useState(false);
  const { uiText } = useI18n();

  const getCategoryConfig = (category: Product['category']) => {
    switch (category) {
      case 'piatti_pronti':
        return {
          icon: <Flame className="w-7 h-7 text-amber-500" />,
          badgeText: uiText('cat_piatti_pronti', 'Pronto alla Brace'),
          glowColor: '#ea580c'
        };
      case 'carne_fresca':
        return {
          icon: <Beef className="w-7 h-7 text-rose-500" />,
          badgeText: uiText('cat_carne_fresca', 'Taglio Selezionato'),
          glowColor: '#e11d48'
        };
      case 'cestini_box':
        return {
          icon: <ShoppingBag className="w-7 h-7 text-orange-400" />,
          badgeText: uiText('cat_cestini_box', 'Cestino Barbecue'),
          glowColor: '#f97316'
        };
      case 'dispensa_standard':
        return {
          icon: <PackageCheck className="w-7 h-7 text-emerald-400" />,
          badgeText: uiText('cat_dispensa_standard', 'Dispensa & DOP'),
          glowColor: '#10b981'
        };
      case 'gastronomia_vini':
      default:
        return {
          icon:
            product.wineDenomination ||
            product.name.toLowerCase().includes('vino') ||
            product.name.toLowerCase().includes('lambrusco') ? (
              <Wine className="w-7 h-7 text-purple-400" />
            ) : (
              <UtensilsCrossed className="w-7 h-7 text-emerald-400" />
            ),
          badgeText: uiText('cat_gastronomia_vini', 'Bottega & Cantina'),
          glowColor: '#d97706'
        };
    }
  };

  const config = getCategoryConfig(product.category);
  const hasRealPhoto = Boolean(product.imageUrl && !imgError);

  return (
    <div
      className={`relative w-full overflow-hidden bg-stone-900 text-stone-100 flex flex-col items-center justify-center select-none ${className}`}
    >
      {hasRealPhoto ? (
        <>
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {/* Subtle gradient vignette for readable badges */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-stone-950/35 pointer-events-none" />
        </>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
          <div
            className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${config.glowColor} 0%, transparent 70%)`
            }}
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center shadow-inner mb-2">
              {config.icon}
            </div>
            <span className="text-[11px] uppercase tracking-widest text-stone-300 font-semibold">
              {config.badgeText}
            </span>
          </div>
        </div>
      )}

      {/* Top right curator mark */}
      {showBadge && (
        <div className="absolute top-2.5 right-2.5 z-10 text-[10px] text-stone-100 font-semibold px-2 py-0.5 bg-stone-950/80 backdrop-blur-xs border border-stone-700/60 rounded-full shadow-sm">
          {product.curator === 'Manuel'
            ? '🔥 Manuel'
            : product.curator === 'Samanta'
            ? '✨ Samanta'
            : '🥩 Bottega Cento'}
        </div>
      )}

      {/* Bottom left EAN-13 / PLU Badge */}
      {!hideBottomCode && product.identification?.gtinEan && (
        <div className="absolute bottom-2 left-2.5 z-10 pointer-events-none">
          <span className="px-2 py-0.5 rounded-md bg-stone-950/80 backdrop-blur-xs text-stone-200 border border-stone-700/60 text-[9px] font-mono tracking-tight">
            {product.identification.barcodeType === 'EAN13' ? 'EAN ' : 'PLU '}
            {product.identification.gtinEan}
          </span>
        </div>
      )}

      {/* Anti-Scraping Forensic Tracking Watermark */}
      <AntiScrapingWatermark
        productId={product.id}
        eanCode={product.identification?.gtinEan || product.internationalCodes?.gtin13 || product.id}
        assetType="IMAGE"
        customWatermarkId={product.antiScrapingWatermarkId}
      />
    </div>
  );
};
