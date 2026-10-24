import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Flame, Sparkles } from 'lucide-react';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
  showBadge?: boolean;
}

export const ManuelPortrait: React.FC<AvatarProps> = ({
  size = 'md',
  className = '',
  showBadge = false
}) => {
  const { uploadedManuelPhotoUrl } = useStore();
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-28 h-28 text-2xl',
    xl: 'w-36 h-36 text-3xl',
    hero: 'w-48 h-48 md:w-56 md:h-56 text-5xl'
  };

  // Uses custom uploaded photo or fallback default photo
  const photoSrc = uploadedManuelPhotoUrl || '/assets/aistudio/manuel_cannat__7be14e0a.jpg';
  const hasPhoto = Boolean(photoSrc) && !imgError;

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border-2 border-amber-500/80 bg-stone-900 shadow-xl flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      aria-label="Manuel Cannatà - Mastro Macellaio & Grigliatore a Cento"
    >
      {hasPhoto ? (
        <>
          <img
            src={photoSrc}
            alt="Manuel Cannatà"
            className="w-full h-full object-cover object-top select-none transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
        </>
      ) : (
        /* Artisan Seal Badge when photo fails */
        <div className="w-full h-full bg-gradient-to-br from-stone-850 via-stone-900 to-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.18)_0%,transparent_70%)] pointer-events-none" />
          <span className="font-display font-black tracking-tight text-amber-400 drop-shadow-md">
            MC
          </span>
          <div className="flex items-center gap-0.5 text-amber-500/70 mt-0.5">
            <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
          </div>
        </div>
      )}

      {showBadge && (
        <span className="absolute bottom-0 inset-x-0 bg-stone-950/90 text-amber-400 font-bold text-[9px] uppercase tracking-wider text-center py-0.5 border-t border-amber-500/30">
          Manuel
        </span>
      )}
    </div>
  );
};

export const SamantaPortrait: React.FC<AvatarProps> = ({
  size = 'md',
  className = '',
  showBadge = false
}) => {
  const { uploadedSamantaPhotoUrl } = useStore();
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs',
    md: 'w-16 h-16 text-base',
    lg: 'w-28 h-28 text-2xl',
    xl: 'w-36 h-36 text-3xl',
    hero: 'w-48 h-48 md:w-56 md:h-56 text-5xl'
  };

  // Uses custom uploaded photo or fallback default photo
  const photoSrc = uploadedSamantaPhotoUrl || '/assets/aistudio/samanta_maderioli_f3b2f7b7.jpg';
  const hasPhoto = Boolean(photoSrc) && !imgError;

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 border-2 border-rose-500/80 bg-stone-900 shadow-xl flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      aria-label="Samanta - Gastronomia & Accoglienza a Cento"
    >
      {hasPhoto ? (
        <>
          <img
            src={photoSrc}
            alt="Samanta"
            className="w-full h-full object-cover object-top select-none transition-transform duration-500 hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
        </>
      ) : (
        /* Artisan Seal Badge when photo fails */
        <div className="w-full h-full bg-gradient-to-br from-stone-850 via-stone-900 to-stone-950 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.18)_0%,transparent_70%)] pointer-events-none" />
          <span className="font-display font-black tracking-tight text-rose-300 drop-shadow-md">
            S
          </span>
          <div className="flex items-center gap-0.5 text-rose-400/80 mt-0.5">
            <Sparkles className="w-3 h-3 text-rose-400" />
          </div>
        </div>
      )}

      {showBadge && (
        <span className="absolute bottom-0 inset-x-0 bg-stone-950/90 text-rose-300 font-bold text-[9px] uppercase tracking-wider text-center py-0.5 border-t border-rose-500/30">
          Samanta
        </span>
      )}
    </div>
  );
};

export const ManuelAndSamantaTogether: React.FC<{ className?: string; size?: 'md' | 'lg' | 'hero' }> = ({
  className = '',
  size = 'lg'
}) => {
  const { uploadedPhotoUrl } = useStore();
  const [imgError, setImgError] = useState(false);

  const photoSrc = uploadedPhotoUrl || '/assets/together_default.jpg';
  const hasPhoto = Boolean(photoSrc) && !imgError;

  if (size === 'hero') {
    if (hasPhoto) {
      return (
        <div
          className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex items-center justify-center select-none w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 ${className}`}
        >
          <img
            src={photoSrc}
            alt="Manuel e Samanta - Braciami ancora Cento"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
            onError={() => setImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20 pointer-events-none" />
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-stone-900/90 text-amber-400 font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full border border-amber-500/40 shadow-lg whitespace-nowrap">
            Manuel & Samanta
          </span>
        </div>
      );
    }

    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex flex-col items-center justify-center select-none w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 p-6 text-center ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.12)_0%,transparent_75%)] pointer-events-none" />
        <div className="relative flex items-center -space-x-4 mb-3">
          <ManuelPortrait size="lg" className="ring-4 ring-amber-500/40" />
          <SamantaPortrait size="lg" className="ring-4 ring-rose-500/40" />
        </div>
        <span className="font-display text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
          Manuel & Samanta
        </span>
        <span className="text-xs text-stone-300 font-medium mt-1">
          I Titolari di Braciami ancora a Cento
        </span>
        <div className="mt-2.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 font-semibold">
          &ldquo;Ci Mettiamo la Faccia&rdquo;
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Overlapping real photo / artisan portraits */}
      <div className="relative flex items-center -space-x-8 sm:-space-x-12">
        <div className="relative z-10 transform -rotate-3 hover:rotate-0 transition-transform">
          <ManuelPortrait size="lg" className="ring-4 ring-amber-500/50" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-stone-900 text-amber-400 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-700 shadow-md">
            Manuel
          </span>
        </div>
        <div className="relative z-20 transform rotate-3 hover:rotate-0 transition-transform">
          <SamantaPortrait size="lg" className="ring-4 ring-rose-500/50" />
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-stone-900 text-rose-300 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-700 shadow-md">
            Samanta
          </span>
        </div>
      </div>
    </div>
  );
};
