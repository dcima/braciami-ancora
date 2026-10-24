import React, { useState, useRef, useEffect } from 'react';
import { COMUNI_ISTAT, ComuneIstat } from '../data/comuniIstatData';
import { Search, MapPin, Check } from 'lucide-react';

interface ComuneIstatPickerProps {
  label: string;
  value: string;
  provinceSigla?: string;
  onSelect: (comune: ComuneIstat) => void;
  placeholder?: string;
  required?: boolean;
  showCap?: boolean;
}

export const ComuneIstatPicker: React.FC<ComuneIstatPickerProps> = ({
  label,
  value,
  provinceSigla,
  onSelect,
  placeholder = 'Cerca comune...',
  required = false,
  showCap = true
}) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cleanTerm = searchTerm.trim().toLowerCase();
  const filteredComuni = cleanTerm.length >= 1
    ? COMUNI_ISTAT.filter((c) =>
        c.nome.toLowerCase().includes(cleanTerm) || c.sigla.toLowerCase() === cleanTerm
      ).slice(0, 30)
    : COMUNI_ISTAT.slice(0, 15);

  return (
    <div className="relative space-y-1" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {provinceSigla && (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
            Prov. {provinceSigla}
          </span>
        )}
      </div>

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
        <input
          type="text"
          required={required}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-xs"
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 max-h-48 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-xl z-50 divide-y divide-stone-100">
          {filteredComuni.length === 0 ? (
            <div className="p-3 text-xs text-stone-500 text-center">
              Nessun comune trovato per &quot;{searchTerm}&quot;
            </div>
          ) : (
            filteredComuni.map((c) => {
              const isSelected = value.toLowerCase() === c.nome.toLowerCase();
              return (
                <button
                  key={`${c.nome}_${c.sigla}_${c.codiceCatastale}`}
                  type="button"
                  onClick={() => {
                    setSearchTerm(c.nome);
                    setIsOpen(false);
                    onSelect(c);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50/70 transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-50 font-bold text-amber-950' : 'text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{c.nome}</span>
                    <span className="text-[10px] text-stone-400 font-mono">({c.sigla})</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 text-[10px] text-stone-400">
                    {showCap && c.cap && c.cap.length > 0 && <span>CAP: {c.cap.join(', ')}</span>}
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
