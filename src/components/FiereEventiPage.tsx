import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Calendar,
  MapPin,
  Facebook,
  ExternalLink,
  Flame,
  Award,
  Beer,
  Utensils,
  Sparkles,
  Phone
} from 'lucide-react';

const FACEBOOK_PAGE_URL =
  'https://www.facebook.com/p/Braciami-Ancora-Spaccio-carnisalumi-e-formaggi-100063911893005/?locale=it_IT';

const FACEBOOK_GALLERY_ITEMS = [
  {
    id: 'fb-img-01',
    image: '/facebook/immaginiFB/braciami_fb_01_770387779_3028301420834387_952132987076154334_n.jpg',
    title: 'Il Banco Spaccio Carni, Salumi e Formaggi',
    date: '2026 · Via Penzale 25, Cento (FE)',
    category: 'Spaccio & Macelleria',
    postText:
      'Ogni mattina prepariamo al banco tagli selezionati, pronti da cuocere, salumi della tradizione emiliana e formaggi stagionati.'
  },
  {
    id: 'fb-img-02',
    image: '/facebook/immaginiFB/braciami_fb_02_773810549_1039742718767009_7651795546715725946_n.jpg',
    title: 'Serata Musica Tedesca, Birra Belga e Tedesca & Braciami Grigliata',
    date: 'Evento Speciale Live · Cento (FE)',
    category: 'Serate & Degustazioni',
    postText:
      "SE VOLETE PRENOTARE C'È UNA BELLA SERATA CON MUSICA TEDESCA E ASSAGGI DI BIRRA BELGA E TEDESCA IL TUTTO ACCOMPAGNATO DA UNA BUONISSIMA BRACIAMI GRIGLIATA 🍻 NON POTETE MANCARE DA BRACIAMI ANCORA A CENTO IN VIA PENZALE 25 (3471284049 - 0516831000)"
  },
  {
    id: 'fb-img-03',
    image: '/facebook/immaginiFB/braciami_fb_03_773981557_2068966200635558_870045967101874812_n.jpg',
    title: 'Spiedini, Arrosticini & Pronti a Cuocere Artigianali',
    date: 'Produzione Giornaliera · Cento (FE)',
    category: 'Specialità Pronte',
    postText:
      'Le nostre preparazioni artigianali pronte per la griglia o la padella: spiedini ricchi, hamburger gourmet e tagli marinati.'
  },
  {
    id: 'fb-img-04',
    image: '/facebook/immaginiFB/braciami_fb_04_772264091_1758258615326421_6096648422453479467_n.jpg',
    title: 'Carni Frollate & Tagli Nobili da Brace',
    date: 'Selezione Maestri Macellai · Cento (FE)',
    category: 'Alta Macelleria',
    postText:
      'Costate, Fiorentine e tagli selezionati per una cottura sulla brace impeccabile, tenera e succosa.'
  },
  {
    id: 'fb-img-05',
    image: '/facebook/immaginiFB/braciami_fb_05_723215903_2144877559792658_6129166077679313086_n.jpg',
    title: 'Norcineria Emiliana & Taglieri delle Feste',
    date: 'Tradizione Emiliana · Cento (FE)',
    category: 'Salumi & Formaggi',
    postText:
      'Mortadella IGP, Prosciutto Crudo dolce, Salame gentile, Ciccioli e Parmigiano Reggiano DOP per i vostri taglieri in famiglia.'
  },
  {
    id: 'fb-img-06',
    image: '/facebook/immaginiFB/braciami_fb_06_736739554_988968700625400_6720313383049205894_n.jpg',
    title: 'Gastronomia Calda & Piatti Pronti su Ordinazione',
    date: 'Cucina & Rosticceria · Cento (FE)',
    category: 'Gastronomia',
    postText:
      'Dalle lasagne al forno agli arrosti, fino alle grigliate miste calde pronte da ritirare in Via Penzale 25.'
  },
  {
    id: 'fb-img-07',
    image: '/facebook/immaginiFB/braciami_fb_07_740462124_1357611529645740_814416955790715052_n.jpg',
    title: 'La Grande Brace del Weekend da Manuel & Samanta',
    date: 'Ogni Settimana · Via Penzale 25, Cento',
    category: 'Brace Viva',
    postText:
      'Prenota la tua grigliata mista o vieni a scegliere direttamente al banco i tuoi tagli preferiti!'
  }
];

const FAIRS_AND_EVENTS = [
  {
    id: 'fiera-cento',
    title: 'Antica Fiera di Cento & Settembre Centese',
    location: 'Centro Storico & Via Penzale 25, Cento (FE)',
    period: 'Settembre · Edizione Annuale',
    badge: 'Evento Locale Storico',
    description:
      'Degustazioni di salumi emiliani, ciccioli caldi, selezioni di Parmigiano Reggiano DOP e grigliate speciali in occasione della storica Fiera di Cento.'
  },
  {
    id: 'serata-tedesca-birra',
    title: 'Serata Musica Tedesca, Birra Belga/Tedesca & Braciami Grigliata',
    location: 'Braciami Ancora · Via Penzale 25, 44042 Cento (FE)',
    period: 'Eventi Serali su Prenotazione (Tel. 051 6831000 / 347 1284049)',
    badge: 'Dal Post Facebook Ufficiale',
    description:
      'Serata conviviale con musica tradizionale tedesca, degustazione guidata di birre artigianali belghe e tedesche abbinate alla ricchissima Braciami Grigliata.'
  },
  {
    id: 'cibus-tuttofood-rassegne',
    title: 'Rassegne Agroalimentari & Selezione Produttori Emiliani (Cibus / TuttoFood)',
    location: 'Parma · Milano · Emilia-Romagna',
    period: 'Selezione Continua Fornitori',
    badge: 'Ricerca Qualità',
    description:
      'Partecipazione e scouting costante nelle principali fiere gastronomiche italiane ed europee per portare a Cento i migliori tagli di carne, salumi artigianali e formaggi affinati.'
  }
];

export const FiereEventiPage: React.FC = () => {
  const { theme, setActivePage } = useStore();
  const isLight = theme === 'chiaro';

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Intestazione Fiere, Eventi & Pagina Facebook */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border relative overflow-hidden ${
          isLight
            ? 'bg-gradient-to-br from-amber-50 via-white to-stone-100 border-stone-200 shadow-lg'
            : 'bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 border-stone-800 shadow-2xl'
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fiere, Eventi Gastronomici &amp; Social Live</span>
          </div>

          <h1
            className={`font-display text-2xl sm:text-4xl font-black tracking-tight ${
              isLight ? 'text-stone-950' : 'text-white'
            }`}
          >
            Fiere, Serate sulla Brace &amp; Bacheca Facebook Ufficiale
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
            Scopri gli appuntamenti fieristici, le serate di degustazione in <strong>Via Penzale 25 a Cento (FE)</strong>{' '}
            e tutti i post e le fotografie scaricate direttamente dalla pagina Facebook ufficiale{' '}
            <strong>Braciami Ancora - Spaccio carni, salumi e formaggi</strong> (1.582+ follower).
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-bold shadow-md transition-all"
            >
              <Facebook className="w-4 h-4" />
              <span>Visita la Pagina Facebook Ufficiale</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setActivePage('catalogo')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Vai al Catalogo Prodotti</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sezione 1: Calendario Fiere & Serate Speciali */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2
              className={`font-display text-xl sm:text-2xl font-black ${
                isLight ? 'text-stone-950' : 'text-white'
              }`}
            >
              Fiere, Rassegne &amp; Serate Degustazione
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Gli eventi gastronomici e le fiere di riferimento per la nostra macelleria e salumeria a Cento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FAIRS_AND_EVENTS.map((ev) => (
            <div
              key={ev.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white border-stone-200 hover:border-amber-400 shadow-xs'
                  : 'bg-stone-900/80 border-stone-800 hover:border-amber-500/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-500 border border-amber-500/30">
                    {ev.badge}
                  </span>
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                </div>

                <h3
                  className={`font-display text-base sm:text-lg font-extrabold leading-snug ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  {ev.title}
                </h3>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-400'}`}>
                  {ev.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 space-y-1 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{ev.period}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>{ev.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sezione 2: Galleria Immagini & Post Scaricati da Facebook (immaginiFB & postsFB) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2
              className={`font-display text-xl sm:text-2xl font-black flex items-center gap-2 ${
                isLight ? 'text-stone-950' : 'text-white'
              }`}
            >
              <Flame className="w-6 h-6 text-amber-500" />
              <span>Immagini &amp; Post dalla Pagina Facebook (Archivio Locale)</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Sincronizzati in <code>facebook/immaginiFB</code> e <code>facebook/postsFB</code>
            </p>
          </div>
          <a
            href="tel:+390516831000"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 text-xs font-bold"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Prenota Tavolo / Grigliata: 051 6831000 · 347 1284049</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACEBOOK_GALLERY_ITEMS.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl overflow-hidden border flex flex-col transition-all group ${
                isLight
                  ? 'bg-white border-stone-200 hover:shadow-lg'
                  : 'bg-stone-900 border-stone-800 hover:border-amber-500/40'
              }`}
            >
              <a
                href={FACEBOOK_PAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                title="Clicca sulla foto per aprire la pagina Facebook corrispondente in una nuova scheda"
                className="relative h-56 overflow-hidden bg-stone-950 block cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-stone-950/85 text-amber-400 border border-amber-500/30">
                    {item.category}
                  </span>
                </div>
              </a>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
                    <Beer className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                  <h3
                    className={`font-display text-base font-extrabold leading-snug ${
                      isLight ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className={`text-xs leading-relaxed ${isLight ? 'text-stone-600' : 'text-stone-300'}`}>
                    {item.postText}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span className="font-mono truncate">{item.image.split('/').pop()}</span>
                  <a
                    href={FACEBOOK_PAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 hover:underline font-bold inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Vedi su FB</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
