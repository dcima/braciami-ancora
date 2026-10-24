import React from 'react';
import { STORE_INFO } from '../data/mockData';
import { MapPin, Phone, MessageCircle, Clock, Truck, Car, Navigation, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-12 bg-stone-50 text-stone-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block">
            Dove Trovarci a Cento (FE)
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight">
            Come Raggiungerci
          </h1>
          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            Siamo a due passi dal centro storico e dalla Rocca di Cento. Passa a trovarci per il ritiro del tuo ordine o per scegliere il tuo taglio preferito al banco.
          </p>
        </div>

        {/* 2-Column Info & Directions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Coordinates & Hours */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Indirizzo Bottega</span>
              </div>
              <h3 className="font-bold text-lg text-stone-950">
                {STORE_INFO.name}
              </h3>
              <p className="text-sm text-stone-700 mt-1">
                {STORE_INFO.address}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                A 100 metri da Piazza del Guercino e dal Palazzo Comunale.
              </p>
            </div>

            {/* Hours */}
            <div className="pt-4 border-t border-stone-100">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Orari di Apertura & Brace</span>
              </div>
              <div className="space-y-2 text-xs">
                {STORE_INFO.hours.map((h, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-stone-100 last:border-none">
                    <span className="font-semibold text-stone-900">{h.days}:</span>
                    <span className="text-stone-600 font-mono-nums">{h.times}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contacts */}
            <div className="pt-4 border-t border-stone-100 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                Contatti Diretti con Manuel & Samanta
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${STORE_INFO.phone.replace(/\s+/g, '')}`}
                  className="p-3 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-stone-900 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>{STORE_INFO.phone}</span>
                </a>
                <a
                  href={`https://wa.me/39${STORE_INFO.whatsapp.replace(/\s+/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs font-semibold text-emerald-900 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp: {STORE_INFO.whatsapp}</span>
                </a>
              </div>
            </div>

            {/* Parking Tips */}
            <div className="pt-4 border-t border-stone-100 flex items-start gap-3 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl">
              <Car className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-900 block mb-0.5">Parcheggio Comodo Consigliato:</strong>
                Piazzale Bonzagni e Parcheggio Rocca di Cento (disco orario o libero, a soli 2 minuti a piedi). Accesso carico per ritiro rapido saltafila davanti alla bottega.
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Schematic & Delivery Coverage */}
          <div className="space-y-6">
            
            {/* Cento Stylized Visual Map */}
            <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                  <Navigation className="w-4 h-4" />
                  <span>Mappa della Bottega · Centro Storico</span>
                </div>
                <span className="text-[11px] text-stone-400">44042 Cento (FE)</span>
              </div>

              {/* Graphic map schematic representation of Cento center */}
              <div className="relative h-64 bg-stone-950 rounded-xl border border-stone-800 overflow-hidden flex items-center justify-center p-4">
                {/* Street grid stylized lines */}
                <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 40 0 L 40 300" stroke="#78716c" strokeWidth="4" />
                  <path d="M 160 0 L 160 300" stroke="#78716c" strokeWidth="8" />
                  <path d="M 280 0 L 280 300" stroke="#78716c" strokeWidth="4" />
                  <path d="M 0 80 L 400 80" stroke="#78716c" strokeWidth="4" />
                  <path d="M 0 160 L 400 160" stroke="#78716c" strokeWidth="6" />
                  <path d="M 0 240 L 400 240" stroke="#78716c" strokeWidth="4" />
                </svg>

                {/* Landmark 1: Piazza Guercino */}
                <div className="absolute top-10 left-12 bg-stone-800/90 border border-stone-700 px-2 py-1 rounded text-[10px] text-stone-300">
                  🏛️ Piazza del Guercino
                </div>

                {/* Landmark 2: Rocca di Cento */}
                <div className="absolute bottom-8 right-8 bg-stone-800/90 border border-stone-700 px-2 py-1 rounded text-[10px] text-stone-300">
                  🏰 Rocca di Cento
                </div>

                {/* Main pin: Bottega Braciami ancora */}
                <div className="relative z-10 flex flex-col items-center animate-bounce duration-1000">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/40 border-2 border-white">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="bg-white text-stone-950 px-3 py-1 rounded-md text-xs font-bold shadow-lg mt-1 whitespace-nowrap">
                    Braciami ancora 🔥
                  </div>
                  <span className="text-[10px] text-amber-300 bg-stone-900/90 px-2 py-0.5 rounded mt-0.5 font-mono">
                    Via Penzale, 25 · 44042 Cento (FE)
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-stone-400 flex items-center justify-between">
                <span>Indicazioni stradali per il navigatore: Via Penzale, 25, 44042 Cento FE</span>
                <a
                  href="https://maps.google.com/?q=Via+Penzale+25+44042+Cento+FE"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-400 hover:text-amber-300 underline font-semibold"
                >
                  Apri in Google Maps
                </a>
              </div>
            </div>

            {/* Delivery Coverage Areas */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                <Truck className="w-4 h-4 text-amber-600" />
                <span>Zone di Consegna Servite a Domicilio</span>
              </div>
              <p className="text-xs text-stone-600">
                Portiamo i nostri piatti caldi alla brace e i cestini barbecue direttamente a casa tua nelle seguenti zone:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {STORE_INFO.deliveryZones.map((zone, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-stone-800 font-medium">{zone}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
