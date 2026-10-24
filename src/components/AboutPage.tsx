import React from 'react';
import { useStore } from '../context/StoreContext';
import { ManuelPortrait, SamantaPortrait } from './ArtisanAvatars';
import { Flame, Heart, Award, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage } = useStore();

  return (
    <div className="py-12 bg-stone-50 text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Editorial Heading */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            La nostra storia a Cento
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight">
            Chi Siamo
          </h1>
          <p className="text-stone-600 text-base max-w-2xl mx-auto leading-relaxed">
            Due anime, un unico banco e un braciere ardente nel cuore della terra del Guercino: la passione di Manuel per la carne e l attenzione di Samanta per la gastronomia emiliana.
          </p>
        </div>

        {/* The Motto Manifesto Card */}
        <div className="bg-stone-950 text-stone-100 rounded-2xl p-8 shadow-xl border border-stone-850 relative overflow-hidden text-center space-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold block">
            Il nostro principio fondamentale
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            &ldquo;Qualità al giusto prezzo&rdquo;
          </h2>
          <p className="text-stone-300 text-sm max-w-xl mx-auto leading-relaxed">
            Non crediamo nella carne di lusso inaccessibile, né nei compromessi dei grandi discount. Selezioniamo piccoli allevatori emiliani, gestiamo noi stessi frollatura e cottura espressa, garantendo il miglior sapore autentico al prezzo onesto di bottega.
          </p>
        </div>

        {/* The Two Portrayals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Manuel's Story */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-4">
              <ManuelPortrait size="lg" />
              <div>
                <h3 className="font-display text-xl font-bold text-stone-950">Manuel</h3>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block">
                  Mastro Macellaio & Braciere
                </span>
                <span className="text-xs text-stone-500">20+ anni di mestiere</span>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Cresciuto con il profumo della carne frollata e il rumore della legna che scoppietta. Manuel seleziona ogni singola mezzena di Scottona e Pezzata Rossa, conosce per nome gli allevatori e controlla giornalmente la cella di maturazione a secco.
            </p>
            <blockquote className="text-xs italic text-stone-600 bg-stone-50 p-3 rounded-lg border-l-2 border-amber-600 font-serif">
              &ldquo;La brace è sincerità: non puoi mascherare una carne mediocre con il fuoco. O è buona e ben marezzata, o la griglia la tradisce subito.&rdquo;
            </blockquote>
          </div>

          {/* Samanta's Story */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-4">
              <SamantaPortrait size="lg" />
              <div>
                <h3 className="font-display text-xl font-bold text-stone-950">Samanta</h3>
                <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block">
                  Gastronomia & Accoglienza
                </span>
                <span className="text-xs text-stone-500">Custode delle ricette di famiglia</span>
              </div>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              Samanta è l anima accogliente del banco. Cucina ogni giorno i contorni cotti a legna, sperimenta salse artigianali senza conservanti e compone con cura i cestini barbecue per permettere alle famiglie di Cento di godersi la domenica senza stress.
            </p>
            <blockquote className="text-xs italic text-stone-600 bg-stone-50 p-3 rounded-lg border-l-2 border-amber-600 font-serif">
              &ldquo;Quando un cliente entra in bottega deve sentirsi a casa. Il nostro compito è farvi portare a tavola profumi e sapori che creano ricordi felici.&rdquo;
            </blockquote>
          </div>

        </div>

        {/* The 4 Pillars */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6">
          <h3 className="font-display text-2xl font-bold text-stone-950 text-center">
            I 4 Pilastri di &ldquo;Braciami ancora&rdquo;
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-700">
            <div className="flex gap-3">
              <Flame className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Brace Naturale Quotidiana</h4>
                <p>Niente piastre a gas o scorciatoie: solo carbonella di legna dura e roverella emiliana per quel profumo inconfondibile.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Filiera Corta Emiliana</h4>
                <p>Bovini nati, allevati e macellati tra Ferrara, Bologna e Modena con alimentazione naturale a fieno e cereali nobili.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Award className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Frollature Controllate</h4>
                <p>Cella di Dry Aging a vista: stagioniamo le costate fino a 45-60 giorni per raggiungere morbidezza e note aromatiche uniche.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Heart className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-1">Spesa Pronta o da Cuocere</h4>
                <p>Tu scegli se ritirare il piatto caldo fumante appena tolto dal braciere o la carne fresca con i consigli per grigliarla a casa.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 text-center">
            <button
              onClick={() => {
                setActivePage('catalogo');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg shadow-sm inline-flex items-center gap-2"
            >
              <span>Esplora i Piatti di Manuel & Samanta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
