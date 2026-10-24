import React, { useState } from 'react';
import { ManuelPortrait, SamantaPortrait } from './ArtisanAvatars';
import { useStore } from '../context/StoreContext';
import { Flame, Sparkles } from 'lucide-react';

interface ExtrapolatedFaceProps {
  person: 'manuel' | 'samanta' | 'together';
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'landing' | 'fullscreen';
  className?: string;
}

export const ExtrapolatedFace: React.FC<ExtrapolatedFaceProps> = ({
  person,
  size = 'hero',
  className = ''
}) => {
  const { uploadedPhotoUrl, uploadedManuelPhotoUrl, uploadedSamantaPhotoUrl } = useStore();
  const [manuelImgError, setManuelImgError] = useState(false);
  const [samantaImgError, setSamantaImgError] = useState(false);
  const [togetherImgError, setTogetherImgError] = useState(false);

  // Balanced sizing so Full HD displays the entire landing page and all buttons without scrolling
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    landing: 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-68 lg:h-68',
    hero: 'w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72',
    fullscreen: 'w-full h-full'
  };

  const isSamanta = person === 'samanta';

  // 1. Manuel dedicated real photo (uploaded or bundled default)
  const manuelPhoto = uploadedManuelPhotoUrl || '/assets/aistudio/manuel_cannat__7be14e0a.jpg';
  if (person === 'manuel' && manuelPhoto && !manuelImgError) {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      >
        <img
          src={manuelPhoto}
          alt="Manuel Cannatà - Mastro Grigliatore & Macellaio"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
          onError={() => setManuelImgError(true)}
        />
        {/* Subtle ember overlay vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20 pointer-events-none" />
      </div>
    );
  }

  // 2. Samanta dedicated real photo (uploaded or bundled default)
  const samantaPhoto = uploadedSamantaPhotoUrl || '/assets/aistudio/samanta_maderioli_f3b2f7b7.jpg';
  if (isSamanta && samantaPhoto && !samantaImgError) {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-500/70 bg-stone-950 flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      >
        <img
          src={samantaPhoto}
          alt="Samanta Maderioli - Bottega Gastronomia Braciami ancora Cento"
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
          onError={() => setSamantaImgError(true)}
        />
        {/* Subtle rose-ember overlay vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-stone-950/20 pointer-events-none" />
      </div>
    );
  }

  // 3. Together group photo / Storefront (uploaded or bundled default)
  const togetherPhoto = uploadedPhotoUrl || '/assets/aistudio/Screenshot_2026-10-23_161055_986f6caa.png';
  if (person === 'together' && togetherPhoto && !togetherImgError) {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      >
        <img
          src={togetherPhoto}
          alt="Bottega Braciami ancora - Via Penzale 25, Cento (FE)"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-105"
          onError={() => setTogetherImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-stone-950/20 pointer-events-none" />
      </div>
    );
  }

  // 4. Fallback Artisan Seals if images fail to load
  if (person === 'manuel') {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex flex-col items-center justify-center select-none p-5 text-center ${sizeClasses[size]} ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="mb-2">
          <ManuelPortrait size="lg" className="ring-4 ring-amber-500/40" />
        </div>
        <span className="font-display text-lg sm:text-xl font-black text-amber-400 tracking-tight">
          Manuel Cannatà
        </span>
        <span className="text-[11px] text-stone-300 font-medium mt-0.5">
          Mastro Grigliatore & Macellaio
        </span>
        <div className="mt-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-semibold">
          <Flame className="w-3 h-3 text-amber-400" />
          <span>Bottega di Cento (FE)</span>
        </div>
      </div>
    );
  }

  if (isSamanta) {
    return (
      <div
        className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-rose-500/70 bg-stone-950 flex flex-col items-center justify-center select-none p-5 text-center ${sizeClasses[size]} ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="mb-2">
          <SamantaPortrait size="lg" className="ring-4 ring-rose-500/40" />
        </div>
        <span className="font-display text-lg sm:text-xl font-black text-rose-300 tracking-tight">
          Samanta
        </span>
        <span className="text-[11px] text-stone-300 font-medium mt-0.5">
          Gastronomia & Bottega
        </span>
        <div className="mt-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] text-rose-300 font-semibold">
          <Sparkles className="w-3 h-3 text-rose-400" />
          <span>Accoglienza Centese</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-500/70 bg-stone-950 flex flex-col items-center justify-center select-none p-5 text-center ${sizeClasses[size]} ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,transparent_75%)] pointer-events-none" />
      <div className="relative flex items-center -space-x-3 mb-2">
        <ManuelPortrait size="lg" className="ring-4 ring-amber-500/40" />
        <SamantaPortrait size="lg" className="ring-4 ring-rose-500/40" />
      </div>
      <span className="font-display text-lg sm:text-xl font-black text-amber-400 tracking-tight">
        Manuel & Samanta
      </span>
      <span className="text-[11px] text-stone-300 font-medium mt-0.5">
        I Titolari di Braciami ancora a Cento
      </span>
      <div className="mt-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 font-semibold">
        &ldquo;Ci Mettiamo la Faccia&rdquo;
      </div>
    </div>
  );
};
