import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Tag, Copy, Check, ArrowRight } from 'lucide-react';

export const PromoModal: React.FC = () => {
  const { isPromoModalOpen, setIsPromoModalOpen, campaigns, applyPromoCode, setIsCartOpen, showToast } = useStore();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  if (!isPromoModalOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    showToast(`Codice ${code} copiato negli appunti!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleApply = (code: string) => {
    const res = applyPromoCode(code);
    showToast(res.message);
    if (res.success) {
      setIsPromoModalOpen(false);
      setIsCartOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-amber-400" />
            <h2 className="font-display text-lg font-bold">
              Campagne Promozionali Attive a Cento
            </h2>
          </div>
          <button
            onClick={() => setIsPromoModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Chiudi promozioni"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-stone-600">
            Manuel e Samanta offrono regolarmente vantaggi esclusivi per assaggiare la vera carne alla brace e i prodotti della bottega:
          </p>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.code}
                className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2 hover:border-amber-400 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-nums font-bold text-sm bg-white border border-stone-300 px-2.5 py-1 rounded text-stone-900 tracking-wider">
                    {camp.code}
                  </span>
                  <span className="text-xs font-bold text-amber-700">
                    {camp.discountType === 'percentage' ? `-${camp.discountValue}%` : `-€${camp.discountValue}`}
                  </span>
                </div>

                <h4 className="font-semibold text-stone-900 text-sm">{camp.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{camp.description}</p>

                {camp.minSpend && (
                  <span className="text-[11px] text-stone-500 block">
                    Spesa minima richiesta: €{camp.minSpend.toFixed(2)}
                  </span>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                  <button
                    onClick={() => handleCopy(camp.code)}
                    className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    {copiedCode === camp.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === camp.code ? 'Copiato' : 'Copia'}</span>
                  </button>
                  <button
                    onClick={() => handleApply(camp.code)}
                    className="px-3 py-1.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <span>Applica al Carrello</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
