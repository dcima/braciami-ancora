import React from 'react';
import { useStore } from '../context/StoreContext';
import { Moon, Sun } from 'lucide-react';

export const ThemeSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, setTheme } = useStore();
  const isLight = theme === 'chiaro';

  const toggleTheme = () => {
    setTheme(isLight ? 'braciami' : 'chiaro');
  };

  return (
    <button
      id="btn_theme_toggle_two_state"
      type="button"
      onClick={toggleTheme}
      title={
        isLight
          ? 'Tema Chiaro attivo — Clicca per passare al Tema Scuro (Braciami)'
          : 'Tema Scuro attivo — Clicca per passare al Tema Chiaro'
      }
      aria-label={isLight ? 'Passa a tema scuro' : 'Passa a tema chiaro'}
      className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-all cursor-pointer shrink-0 select-none ${
        isLight
          ? 'bg-amber-50 border-amber-300 text-amber-600 hover:bg-amber-100 shadow-xs'
          : 'bg-stone-900 border-stone-700 text-amber-400 hover:bg-stone-800 hover:border-amber-500/50 shadow-xs'
      } ${className}`}
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
};
