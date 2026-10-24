import React from 'react';
import { useStore } from '../context/StoreContext';
import { ManuelPortrait } from './ArtisanAvatars';
import { Flame, Thermometer, Clock, Sparkles, ArrowRight } from 'lucide-react';

export const GrillGuidePage: React.FC = () => {
  const { setActivePage } = useStore();

  const cookingTips = [
    {
      title: '1. Il Riposo prima e dopo la Griglia',
      description: 'Non mettere mai una bistecca fredda di frigorifero sulla brace! Lasciala a temperatura ambiente per almeno 45 minuti. Dopo la cottura, falla riposare 5 minuti su un tagliere caldo coperta leggermente: i succhi si redistribuiranno rendendola tenerissima.',
      icon: <Clock className="w-5 h-5 text-amber-600" />
    },
    {
      title: '2. Temperature al Cuore (Sonda)',
      description: 'Per la Fiorentina o la Costata frollata, misura con un termometro a cuore: 48-50°C per una cottura al sangue perfetta (Rare), 54°C per media (Medium-rare). Oltre i 58°C il grasso nobile si disperde.',
      icon: <Thermometer className="w-5 h-5 text-amber-600" />
    },
    {
      title: '3. Come Rigenerare i Piatti Pronti di Manuel',
      description: 'Se hai ordinato le nostre Costine glassate o la Grigliata mista già cotta alla brace, scaldala in forno preriscaldato a 160°C per 6-8 minuti. Manterrà la crosticina croccante e la fragranza del fumo di rovere senza asciugarsi.',
      icon: <Flame className="w-5 h-5 text-amber-600" />
    },
    {
      title: '4. Il Sale: Quando e Quale',
      description: 'Noi usiamo esclusivamente sale grosso dolce di Cervia. Sulla Fiorentina si mette solo alla fine del riposo, prima del taglio. Sulle salsicce non serve aggiungere nulla: sono già sapientemente bilanciate.',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />
    }
  ];

  return (
    <div className="py-12 bg-stone-50 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            I Segreti del Mastro Macellaio
          </span>
          <h1 className="font-display text-4xl font-bold text-stone-950 tracking-tight">
            Guida alla Brace & Cottura Perfetta
          </h1>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            I trucchi del mestiere di Manuel per ottenere il massimo da ogni taglio di carne acquistato in bottega a Cento.
          </p>
        </div>

        {/* Masterclass Card */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-md flex flex-col md:flex-row items-center gap-6">
          <ManuelPortrait size="lg" className="shrink-0 ring-4 ring-amber-500/20" />
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold">
              Parola di Manuel
            </span>
            <h3 className="font-display text-2xl font-bold text-white">
              &ldquo;Il segreto non è la fiamma, è la brace viva.&rdquo;
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              La carne non deve mai toccare la fiamma viva, che la brucerebbe rendendola amara. Serve un letto spesso di braci ardenti grigie, aria costante e pazienza.
            </p>
          </div>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cookingTips.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200 p-6 space-y-3 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60">
                  {tip.icon}
                </div>
                <h4 className="font-bold text-stone-950 text-sm">{tip.title}</h4>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {tip.description}
              </p>
            </div>
          ))}
        </div>

        {/* Action Banner */}
        <div className="bg-amber-100/60 border border-amber-200 rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-display text-2xl font-bold text-stone-900">
            Pronto a Mettere alla Prova la Griglia?
          </h3>
          <p className="text-xs text-stone-700 max-w-md mx-auto">
            Ordina ora una Fiorentina frollata da cuocere a casa o fattela preparare calda da Manuel per cena!
          </p>
          <button
            onClick={() => {
              setActivePage('catalogo');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg shadow-sm inline-flex items-center gap-2"
          >
            <span>Vai al Banco Macelleria & Brace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
