import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, X, ArrowRight } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const { setIsPromoModalOpen, campaigns } = useStore();

  if (dismissed || campaigns.length === 0) return null;

  const currentPromo = campaigns[0];

  return (
    <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/40">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-1 text-center truncate">
        <Tag className="w-3.5 h-3.5 shrink-0 text-stone-950" />
        <span className="truncate">
          Offerta Bottega a Cento: Usa il codice <strong className="font-mono-nums tracking-wide">{currentPromo.code}</strong> per il {currentPromo.discountValue}% di sconto!
        </span>
        <button
          onClick={() => setIsPromoModalOpen(true)}
          className="ml-2 inline-flex items-center gap-0.5 underline text-stone-950 hover:text-stone-800 shrink-0 font-bold"
        >
          <span>Vedi tutte</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-amber-600/20 rounded text-stone-900 shrink-0 focus:outline-none"
        aria-label="Chiudi banner promozionale"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
