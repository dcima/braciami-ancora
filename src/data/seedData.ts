import {
  UserData,
  Product,
  Order,
  Promozione,
  Sconto,
  DeliveryType,
  OrderHeader,
  OrderDetail,
  OrderMessage,
  OrderEmailLog
} from '../types';
import { SEED_PRODUCTS } from './productsData';
import { SEED_UI_ELEMENTS, SEED_STORE_CONFIG } from './uiElementsData';

export { SEED_PRODUCTS, SEED_UI_ELEMENTS, SEED_STORE_CONFIG };

/**
 * 1. UTENTI & CLIENTI (con Diego e Samanta come amministratori)
 * 70% Italiani (70% Provincia di Ferrara: Cento, Renazzo, Ferrara, Bondeno, Comacchio, Argenta, ecc.)
 * 30% Europei (Germania, Olanda, Paesi Nordici)
 */
export const SEED_USERS: UserData[] = [
  // --- AMMINISTRATORI ---
  {
    uid: 'admin-diego',
    nome: 'Diego',
    cognome: 'Cimarosa',
    data_nascita: '1980-05-12',
    codice_fiscale: 'CMRDGO80E12D548W',
    indirizzo: 'Via Penzale',
    numero_civico: '25',
    cap: '44042',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'diego.cimarosa@gmail.com',
    telefono: '+39 347 1234567',
    note: 'Amministratore di sistema e gestione vendite e-commerce',
    tipo_utente: 1, // 1 = amministratore
    punti_fedelta: 950,
    totale_speso: 1450.0,
    numero_ordini: 18,
    is_otp_guest: false,
    createdAt: '2025-01-10T09:00:00Z'
  },
  {
    uid: 'admin-samanta',
    nome: 'Samanta',
    cognome: 'Maderioli',
    data_nascita: '1983-09-22',
    codice_fiscale: 'MDRSMN83P62C469A',
    indirizzo: 'Via Penzale',
    numero_civico: '25',
    cap: '44042',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'samantamanderioli083@gmail.com',
    telefono: '+39 348 7654321',
    note: 'Titolare bottega, coordinatrice cucina calda e banco gastronomia',
    tipo_utente: 1, // 1 = amministratore
    punti_fedelta: 880,
    totale_speso: 1200.0,
    numero_ordini: 15,
    is_otp_guest: false,
    createdAt: '2025-01-10T09:00:00Z'
  },

  // --- CLIENTI ITALIANI: PROVINCIA DI FERRARA (CENTO & DINTORNI) ---
  {
    uid: 'cust-fe-01',
    nome: 'Marco',
    cognome: 'Bonora',
    data_nascita: '1978-03-14',
    codice_fiscale: 'BNRMRC78C14C469U',
    indirizzo: 'Via IV Novembre',
    numero_civico: '14',
    cap: '44042',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'marco.bonora@email.it',
    telefono: '+39 347 8891234',
    note: 'Top Spender Cento: gradisce tagliata al sangue e salamina cotta calda.',
    tipo_utente: 0,
    punti_fedelta: 620,
    totale_speso: 685.5,
    numero_ordini: 9,
    is_otp_guest: false,
    createdAt: '2025-02-15T10:30:00Z'
  },
  {
    uid: 'cust-fe-02',
    nome: 'Elena',
    cognome: 'Marzocchi',
    data_nascita: '1985-07-28',
    codice_fiscale: 'MRZLNE85L68C469B',
    indirizzo: 'Via Guercino',
    numero_civico: '52',
    cap: '44042',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'elena.marzocchi@libero.it',
    telefono: '+39 339 4521990',
    note: 'Ritira di persona ogni sabato mattina in bottega.',
    tipo_utente: 0,
    punti_fedelta: 410,
    totale_speso: 440.0,
    numero_ordini: 7,
    is_otp_guest: false,
    createdAt: '2025-03-20T11:15:00Z'
  },
  {
    uid: 'cust-fe-03',
    nome: 'Federico',
    cognome: 'Govoni',
    data_nascita: '1990-11-05',
    codice_fiscale: 'GVNFRC90S05C469K',
    indirizzo: 'Via Renazzo',
    numero_civico: '110',
    cap: '44045',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'fede.govoni@gmail.com',
    telefono: '+39 328 1145678',
    note: 'Frazione Renazzo: predilige la consegna a domicilio serale.',
    tipo_utente: 0,
    punti_fedelta: 280,
    totale_speso: 310.0,
    numero_ordini: 4,
    is_otp_guest: true,
    createdAt: '2025-04-12T16:00:00Z'
  },
  {
    uid: 'cust-fe-04',
    nome: 'Giorgio',
    cognome: 'Tassinari',
    data_nascita: '1965-01-20',
    codice_fiscale: 'TSSGRG65A20C469D',
    indirizzo: 'Via Malpighi',
    numero_civico: '8',
    cap: '44042',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'giorgio.tassinari@virgilio.it',
    telefono: '+39 340 7654321',
    note: 'Appassionato di costine al miele e cappelletti fatti a mano.',
    tipo_utente: 0,
    punti_fedelta: 195,
    totale_speso: 215.0,
    numero_ordini: 3,
    is_otp_guest: false,
    createdAt: '2025-05-18T14:20:00Z'
  },
  {
    uid: 'cust-fe-05',
    nome: 'Andrea',
    cognome: 'Guercini',
    data_nascita: '1975-08-19',
    codice_fiscale: 'GRCNDR75M19D548H',
    indirizzo: 'Corso Ercole I d Este',
    numero_civico: '45',
    cap: '44121',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'andrea.guercini@fe-architetti.it',
    telefono: '+39 335 6677889',
    note: 'Ferrara Centro Storico: ordina box aziendali e Pampapato IGP.',
    tipo_utente: 0,
    punti_fedelta: 540,
    totale_speso: 590.0,
    numero_ordini: 6,
    is_otp_guest: false,
    createdAt: '2025-06-01T09:45:00Z'
  },
  {
    uid: 'cust-fe-06',
    nome: 'Chiara',
    cognome: 'Schiavoni',
    data_nascita: '1988-12-02',
    codice_fiscale: 'SCHCHR88T42C912L',
    indirizzo: 'Via Trepponti',
    numero_civico: '12',
    cap: '44022',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'chiara.schiavoni@comacchio.net',
    telefono: '+39 349 9988776',
    note: 'Comacchio: grande appassionata del vino Fortana Bosco Eliceo DOC.',
    tipo_utente: 0,
    punti_fedelta: 230,
    totale_speso: 255.0,
    numero_ordini: 3,
    is_otp_guest: true,
    createdAt: '2025-07-10T12:00:00Z'
  },
  {
    uid: 'cust-fe-07',
    nome: 'Matteo',
    cognome: 'Fabbri',
    data_nascita: '1982-04-17',
    codice_fiscale: 'FBBMTT82D17A965Z',
    indirizzo: 'Via Panzano',
    numero_civico: '31',
    cap: '44012',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'matteo.fabbri@bondeno.fe.it',
    telefono: '+39 338 1239874',
    note: 'Bondeno (FE): acquista tagliate di Pezzata Rossa per il barbecue.',
    tipo_utente: 0,
    punti_fedelta: 340,
    totale_speso: 375.0,
    numero_ordini: 5,
    is_otp_guest: false,
    createdAt: '2025-08-04T15:30:00Z'
  },
  {
    uid: 'cust-fe-08',
    nome: 'Sara',
    cognome: 'Vincenzi',
    data_nascita: '1992-09-11',
    codice_fiscale: 'VNCSRA92P51A393O',
    indirizzo: 'Via Matteotti',
    numero_civico: '88',
    cap: '44011',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'sara.vincenzi@argentafiori.it',
    telefono: '+39 342 7766554',
    note: 'Argenta: acquista cestini gourmet per regali enogastronomici.',
    tipo_utente: 0,
    punti_fedelta: 180,
    totale_speso: 210.0,
    numero_ordini: 2,
    is_otp_guest: false,
    createdAt: '2025-09-12T18:00:00Z'
  },
  {
    uid: 'cust-fe-09',
    nome: 'Luca',
    cognome: 'Baraldi',
    data_nascita: '1979-06-25',
    codice_fiscale: 'BRLCLU79H25G768W',
    indirizzo: 'Via Nazionale',
    numero_civico: '5',
    cap: '44028',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'luca.baraldi@poggiobici.it',
    telefono: '+39 333 4455667',
    note: 'Poggio Renatico (FE): ordini costanti per feste di famiglia.',
    tipo_utente: 0,
    punti_fedelta: 310,
    totale_speso: 345.0,
    numero_ordini: 4,
    is_otp_guest: true,
    createdAt: '2025-10-01T10:10:00Z'
  },
  {
    uid: 'cust-fe-10',
    nome: 'Francesca',
    cognome: 'Zanardi',
    data_nascita: '1987-02-18',
    codice_fiscale: 'ZNRFNC87B58D548Q',
    indirizzo: 'Via Risorgimento',
    numero_civico: '19',
    cap: '44047',
    provincia: 'FE',
    codice_nazione: 'IT',
    email: 'francesca.zanardi@terredelreno.it',
    telefono: '+39 346 1122334',
    note: 'Terre del Reno (FE): cliente abituale di salumi tipici e pasticcio.',
    tipo_utente: 0,
    punti_fedelta: 290,
    totale_speso: 320.0,
    numero_ordini: 4,
    is_otp_guest: false,
    createdAt: '2025-11-15T11:20:00Z'
  },

  // --- CLIENTI ITALIANI: ALTRE PROVINCE ---
  {
    uid: 'cust-it-bo',
    nome: 'Massimo',
    cognome: 'Rossi',
    data_nascita: '1970-10-10',
    codice_fiscale: 'RSSMSM70R10A944D',
    indirizzo: 'Via Santo Stefano',
    numero_civico: '64',
    cap: '40125',
    provincia: 'BO',
    codice_nazione: 'IT',
    email: 'massimo.rossi@bologna-food.it',
    telefono: '+39 335 9900112',
    note: 'Bologna: appassionato dei sapori ferraresi doc, ritira spesso nel weekend.',
    tipo_utente: 0,
    punti_fedelta: 490,
    totale_speso: 530.0,
    numero_ordini: 6,
    is_otp_guest: false,
    createdAt: '2025-05-20T17:00:00Z'
  },
  {
    uid: 'cust-it-mo',
    nome: 'Giulia',
    cognome: 'Ferrari',
    data_nascita: '1991-05-30',
    codice_fiscale: 'FRRGLI91E70F257V',
    indirizzo: 'Viale Ciro Menotti',
    numero_civico: '101',
    cap: '41121',
    provincia: 'MO',
    codice_nazione: 'IT',
    email: 'giulia.ferrari@modena-motori.it',
    telefono: '+39 345 8877665',
    note: 'Modena: acquista carni frollate 45 giorni e arrosticini.',
    tipo_utente: 0,
    punti_fedelta: 260,
    totale_speso: 285.0,
    numero_ordini: 3,
    is_otp_guest: true,
    createdAt: '2025-07-22T14:00:00Z'
  },

  // --- CLIENTI ESTERI: GERMANIA (30% cluster estero) ---
  {
    uid: 'cust-de-01',
    nome: 'Hans',
    cognome: 'Müller',
    data_nascita: '1968-08-14',
    codice_fiscale: 'DE-MULLER-842',
    indirizzo: 'Maximilianstraße',
    numero_civico: '18',
    cap: '80539',
    provincia: 'BY',
    codice_nazione: 'DE',
    email: 'hans.mueller@bayern-consult.de',
    telefono: '+49 89 218070',
    note: 'München: ordina per spedizione refrigerata Salama da Sugo e vini emiliani.',
    tipo_utente: 0,
    punti_fedelta: 750,
    totale_speso: 820.0,
    numero_ordini: 7,
    is_otp_guest: false,
    createdAt: '2025-04-10T08:30:00Z'
  },
  {
    uid: 'cust-de-02',
    nome: 'Klaus',
    cognome: 'Schneider',
    data_nascita: '1974-12-03',
    codice_fiscale: 'DE-SCHNEIDER-119',
    indirizzo: 'Zeil',
    numero_civico: '85',
    cap: '60313',
    provincia: 'HE',
    codice_nazione: 'DE',
    email: 'klaus.schneider@frankfurt-bank.de',
    telefono: '+49 69 987654',
    note: 'Frankfurt am Main: gourmet club buyer per salumi tipici ferraresi.',
    tipo_utente: 0,
    punti_fedelta: 520,
    totale_speso: 575.0,
    numero_ordini: 5,
    is_otp_guest: false,
    createdAt: '2025-06-15T10:00:00Z'
  },

  // --- CLIENTI ESTERI: OLANDA ---
  {
    uid: 'cust-nl-01',
    nome: 'Jan',
    cognome: 'Van der Meer',
    data_nascita: '1981-04-29',
    codice_fiscale: 'NL-VANDERMEER-55',
    indirizzo: 'Keizersgracht',
    numero_civico: '342',
    cap: '1016 EZ',
    provincia: 'NH',
    codice_nazione: 'NL',
    email: 'jan.vandermeer@amsterdam-tech.nl',
    telefono: '+31 20 5551234',
    note: 'Amsterdam: ordina costate Dry Aged e confezioni Pampapato per Natale.',
    tipo_utente: 0,
    punti_fedelta: 680,
    totale_speso: 745.0,
    numero_ordini: 6,
    is_otp_guest: false,
    createdAt: '2025-05-12T13:45:00Z'
  },

  // --- CLIENTI ESTERI: PAESI NORDICI (SVEZIA & DANIMARCA) ---
  {
    uid: 'cust-se-01',
    nome: 'Lars',
    cognome: 'Lindqvist',
    data_nascita: '1983-11-19',
    codice_fiscale: 'SE-LINDQVIST-72',
    indirizzo: 'Drottninggatan',
    numero_civico: '57',
    cap: '111 21',
    provincia: 'ST',
    codice_nazione: 'SE',
    email: 'lars.lindqvist@nordic-bbq.se',
    telefono: '+46 8 12345678',
    note: 'Stockholm: grandissimo estimatore della frollatura a secco di Manuel.',
    tipo_utente: 0,
    punti_fedelta: 590,
    totale_speso: 640.0,
    numero_ordini: 5,
    is_otp_guest: false,
    createdAt: '2025-07-01T15:20:00Z'
  },
  {
    uid: 'cust-dk-01',
    nome: 'Astrid',
    cognome: 'Nielsen',
    data_nascita: '1989-02-14',
    codice_fiscale: 'DK-NIELSEN-99',
    indirizzo: 'Strøget',
    numero_civico: '24',
    cap: '1160',
    provincia: 'CPH',
    codice_nazione: 'DK',
    email: 'astrid.nielsen@cph-design.dk',
    telefono: '+45 33 998877',
    note: 'Copenhagen: ordini regalo gastronomia Samanta e conserve artigianali.',
    tipo_utente: 0,
    punti_fedelta: 380,
    totale_speso: 415.0,
    numero_ordini: 3,
    is_otp_guest: true,
    createdAt: '2025-08-25T11:00:00Z'
  }
];

/**
 * 2. PRODOTTI TIPICI DI FERRARA, CARNI ALLA BRACE & VINI DOP/IGP
 */
const _LEGACY_SEED_PRODUCTS: Product[] = [
  // --- SPECIALITÀ FERRARESI AUTENTICHE ---
  {
    id: 'prod-fe-salamina-sugo',
    name: 'Salamina da Sugo di Ferrara IGP (con Purea)',
    name_translations: {
      it_IT: 'Salamina da Sugo di Ferrara IGP (con Purea)',
      en_US: 'Ferrara Salamina da Sugo PGI with Mashed Potatoes',
      de_DE: 'Ferrareser Salamina da Sugo g.g.A. mit Kartoffelpüree',
      fr_FR: 'Salamina da Sugo de Ferrare IGP et purée',
      es_ES: 'Salamina da Sugo de Ferrara IGP con puré',
      zh_CN: '费拉拉传统酒香肉肠配土豆泥 (IGP认证)',
      ja_JP: 'フェッラーラ名物 サラミーナ・ダ・スーゴ（マッシュポテト添え）',
      ru_RU: 'Саламина да Суго из Феррары с картофельным пюре',
      ar_SA: 'سلامينا دا سوغو من فيرارا مع البطاطس المهروسة'
    },
    category: 'piatti_pronti',
    portion: 'Porzione generosa circa 450 g con contorno',
    unit: 'porzione',
    description: 'La regina indiscussa della tavola ferrarese: impasto nobile di maiale padano marinato con vino rosso corposo, cannella, chiodi di garofano e noce moscata. Cotta a bagnomaria per 8 ore e servita bollente su vellutata di purè di patate.',
    description_translations: {
      it_IT: 'La regina della tavola estense: impasto speziato e vino rosso, cotta a bagnomaria 8 ore.',
      en_US: 'The crown jewel of Ferrara culinary art: spiced aged pork sausage simmered for 8 hours in wine, served hot on creamy purée.',
      de_DE: 'Die Königin von Ferrara: 8 Stunden im Wasserbad gegarte, würzige Wurstspezialität auf cremigem Püree.',
      fr_FR: 'La reine de la gastronomie de Ferrare : saucisse parfumée aux épices et vin rouge, servie sur purée onctueuse.',
      es_ES: 'Plato estrella de Ferrara: embutido especiado cocido durante 8 horas, servido sobre puré de patatas.',
      zh_CN: '费拉拉文艺复兴传承名菜：红酒香料慢炖8小时的浓郁猪肉香肠，搭配绵密土豆泥。',
      ja_JP: '赤ワインとスパイスに漬け込み8時間湯煎したフェッラーラの最高峰伝統料理。',
      ru_RU: 'Традиционный деликатес Феррары: 8 часов варки в красном вине со специями, подается с пюре.',
      ar_SA: 'طبق فيرارا التاريخي الفاخر: لحم مبهر ومطهو ببطء لمدة 8 ساعات مع البطاطس المهروسة.'
    },
    price: 19.5,
    curator: 'Samanta',
    curatorNote: 'Il profumo inebriante che ha fatto innamorare i duchi d Este. Scaldare 2 minuti e gustare caldissima.',
    cookingTime: 'Pronta calda al consumo',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Tradizione Estense', 'Specialità Ferrara IGP', 'Cottura Lenta 8h'],
    allergens: ['Latte (nel purè di patate)'],
    origin: 'Cento / Ferrara (FE)',
    stockQuantity: 45,
    heatScale: 3,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-cappelletti-brodo',
    name: 'Cappelletti Ferraresi Fatti a Mano',
    name_translations: {
      it_IT: 'Cappelletti Ferraresi Fatti a Mano',
      en_US: 'Handcrafted Ferrara Cappelletti Pasta',
      de_DE: 'Handgemachte Ferrareser Cappelletti Pasta',
      fr_FR: 'Cappelletti artisanaux de Ferrare faits main',
      es_ES: 'Cappelletti artesanales de Ferrara',
      zh_CN: '费拉拉手工传统夹心意饺 (Cappelletti)',
      ja_JP: 'フェッラーラ伝統 手打ちカッペッレッティ',
      ru_RU: 'Каппеллетти ручной лепки по-феррарски',
      ar_SA: 'كابيليتي فيرارا المصنوعة يدويًا'
    },
    category: 'gastronomia_vini',
    portion: 'Confezione salvafreschezza da 500 g',
    unit: 'conf. 500g',
    description: 'Pasta fresca all uovo tirata a mano al mattarello con sfoglia sottile e ruvida. Ripieno ricco di cappone nostrano, lonza di maiale marinata, Parmigiano Reggiano 30 mesi e noce moscata.',
    price: 18.0,
    curator: 'Samanta',
    curatorNote: 'Chiusi uno ad uno a mano come vuole la tradizione delle nostre nonne ferraresi. Cuocere 4 minuti in brodo.',
    cookingTime: 'Da cuocere 4 min in brodo caldo',
    isReadyToEat: false,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Pasta Fresca Artigianale', 'Fatta a Mano', 'Ricetta Ferrarese'],
    allergens: ['Uova', 'Glutine', 'Latte e derivati'],
    origin: 'Bottega di Cento (FE)',
    stockQuantity: 60,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-salame-aglio',
    name: 'Salame Ferrarese all Aglio con Filzetta',
    name_translations: {
      it_IT: 'Salame Ferrarese all Aglio con Filzetta',
      en_US: 'Traditional Ferrara Garlic Salami',
      de_DE: 'Ferrareser Knoblauchsalami mit Kordel',
      fr_FR: 'Salami traditionnel à l ail de Ferrare',
      es_ES: 'Salchichón tradicional al ajo de Ferrara',
      zh_CN: '费拉拉传统蒜香风干萨拉米香肠',
      ja_JP: 'フェッラーラ特産 ガーリックサラミ',
      ru_RU: 'Феррарская салями с чесноком',
      ar_SA: 'سلامي فيرارا التقليدي بالثوم'
    },
    category: 'carne_fresca',
    portion: 'Pezzatura intera circa 650 g',
    unit: 'pezzo',
    description: 'Il salume simbolo delle campagne di Cento e Ferrara: carne suina pesante padana a grana media, insaporita con infuso naturale di aglio dolce nostrano macerato nel vino bianco secco.',
    price: 15.5,
    curator: 'Manuel',
    curatorNote: 'Stagionato 60 giorni nelle nostre cantine. Tagliare a fette oblique non troppo sottili, perfetto con la Coppia Ferrarese.',
    cookingTime: 'Pronto al consumo',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Salume Tipico Ferrarese', 'Stagionatura 60gg', 'Naturale'],
    allergens: [],
    origin: 'Cento (FE)',
    stockQuantity: 80,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-pampapato-igp',
    name: 'Pampapato di Ferrara IGP al Cioccolato Extra Fondente',
    name_translations: {
      it_IT: 'Pampapato di Ferrara IGP al Cioccolato Extra Fondente',
      en_US: 'Pampapato of Ferrara PGI Dark Chocolate Spiced Cake',
      de_DE: 'Pampapato von Ferrara g.g.A. mit edler Zartbitterschokolade',
      fr_FR: 'Pampapato de Ferrare IGP au chocolat noir d exception',
      es_ES: 'Pampapato de Ferrara IGP con chocolate negro intenso',
      zh_CN: '费拉拉传统香料黑巧蛋糕 Pampapato (IGP认证)',
      ja_JP: 'フェッラーラ伝統の銘菓 パンパパート IGP',
      ru_RU: 'Пампапато ди Феррара в темном шоколаде IGP',
      ar_SA: 'كعكة بامباباتو فيرارا بالشوكولاتة الداكنة والتوابل'
    },
    category: 'gastronomia_vini',
    portion: 'Pezzatura regalo 450 g in scatola di latta estense',
    unit: 'conf.',
    description: 'Il dolce storico rinascimentale di Ferrara: impasto ricco di mandorle tostate, canditi pregiati, miele, spezie fini (cannella, noce moscata) e ricoperto da una sontuosa colata di cioccolato fondente 72%.',
    price: 14.5,
    curator: 'Samanta',
    curatorNote: 'Regalo d eccellenza della nostra terra. Si abbina divinamente con un bicchiere di Fortana o Lambrusco.',
    cookingTime: 'Pronto al consumo',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Dolce Storico', 'IGP Ferrara', 'Cioccolato 72%'],
    allergens: ['Frutta a guscio (mandorle)', 'Glutine', 'Latte'],
    origin: 'Ferrara (FE)',
    stockQuantity: 100,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-fortana-doc',
    name: 'Vino Bosco Eliceo Fortana DOC (Vino delle Sabbie)',
    name_translations: {
      it_IT: 'Vino Bosco Eliceo Fortana DOC (Vino delle Sabbie)',
      en_US: 'Bosco Eliceo Fortana DOC Sand Wine',
      de_DE: 'Bosco Eliceo Fortana DOC Rotwein der Sandböden',
      fr_FR: 'Vin Bosco Eliceo Fortana DOC des sables de Ferrare',
      es_ES: 'Vino Bosco Eliceo Fortana DOC de las Arenas',
      zh_CN: '费拉拉黄金沙地红葡萄酒 Fortana DOC',
      ja_JP: 'フェッラーラ砂丘のワイン フォルターナ DOC',
      ru_RU: 'Вино песков Боско Эличео Фортана DOC',
      ar_SA: 'نبيذ فورتانا التقليدي من فيرارا'
    },
    category: 'gastronomia_vini',
    portion: 'Bottiglia 750 ml',
    unit: 'bottiglia',
    description: 'Il celebre vino rosso ferrarese coltivato sulle sabbie del delta del Po fin dal Cinquecento: vivace, sapido, dal bouquet di frutti rossi e acidità sgrassante perfetta per la salamina e le carni alla brace.',
    price: 12.5,
    curator: 'Manuel',
    curatorNote: 'Il vino che pulisce il palato con la sua naturale tannicità marina. Da bere a 14-16°C.',
    cookingTime: 'Pronto da stappare',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['DOC Bosco Eliceo', 'Vino delle Sabbie', 'Ferrara Storica'],
    allergens: ['Contiene Solfiti'],
    origin: 'Delta del Po / Ferrara',
    stockQuantity: 120,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-coppia-igp',
    name: 'Coppia Ferrarese IGP Tradizionale (Ciupèta)',
    name_translations: {
      it_IT: 'Coppia Ferrarese IGP Tradizionale (Ciupèta)',
      en_US: 'Traditional Ferrarese Coppia Bread PGI',
      de_DE: 'Traditionelles Ferrareser Coppia-Brot g.g.A.',
      fr_FR: 'Pain traditionnel Coppia de Ferrare IGP',
      es_ES: 'Pan tradicional Coppia Ferrarese IGP',
      zh_CN: '费拉拉传统牛角脆面包 Coppia IGP',
      ja_JP: 'フェッラーラ伝統の編みパン コッピア IGP',
      ru_RU: 'Хлеб Коппиа Феррарезе IGP',
      ar_SA: 'خبز كوبيا فيراريزي التقليدي'
    },
    category: 'gastronomia_vini',
    portion: 'Confezione da 4 coppie artigianali fresche',
    unit: 'conf. 4pz',
    description: 'Il pane con le corna più famoso al mondo, nato alla corte degli Estensi nel 1536. Due nastri di pasta dura ritorti a formare quattro croccanti cornetti dorati e un morbido cuore centrale.',
    price: 4.5,
    curator: 'Samanta',
    curatorNote: 'Croccantissima da spezzare con le mani. L accompagnamento d obbligo per salumi e frollati.',
    cookingTime: 'Pronto al consumo',
    isReadyToEat: true,
    isTipicoFerrarese: true,
    tags: ['Pane IGP', 'Croccante', 'Tradizione 1536'],
    allergens: ['Glutine'],
    origin: 'Cento (FE)',
    stockQuantity: 70,
    imageUrl: '/assets/together_default.jpg'
  },
  {
    id: 'prod-fe-box-guercino',
    name: 'Cestino Grigliata del Guercino (Specialità Cento)',
    name_translations: {
      it_IT: 'Cestino Grigliata del Guercino (Specialità Cento)',
      en_US: 'Il Guercino Master Grill Box (Cento Specialty)',
      de_DE: 'Guercino Grillbox Spezialität aus Cento',
      fr_FR: 'Coffret Grillade du Guercino Spécialité de Cento',
      es_ES: 'Cesta Parrillada del Guercino de Cento',
      zh_CN: '画家 Guercino 故乡名匠炭烤精选礼盒 (Cento特产)',
      ja_JP: 'チェントの巨匠 グエルチーノ 特選グリルボックス',
      ru_RU: 'Гриль-бокс Иль Гверчино из Ченто',
      ar_SA: 'صندوق الشواء الفاخر جويرتشينو من شينتو'
    },
    category: 'cestini_box',
    portion: 'Box da 1.8 kg (per 4-5 persone)',
    unit: 'box',
    description: 'Il tributo al grande maestro pittore di Cento: include 4 fette di tagliata di Scottona frollata, 4 salsicce centesi all aglio, 4 costine affumicate con miele di tiglio e patate al rosmarino cotte a legna.',
    price: 54.0,
    originalPrice: 62.0,
    curator: 'Entrambi',
    curatorNote: 'Il nostro cestino più celebrato per le domeniche centesi. Completo di salse artigianali e istruzioni per scaldare al meglio.',
    cookingTime: 'Pronto da servire caldo o rigenerare 5 min',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Box Completo', 'Omaggio al Guercino', 'Best Seller'],
    allergens: ['Senape', 'Latte'],
    origin: 'Bottega di Cento (FE)',
    stockQuantity: 35,
    imageUrl: '/assets/together_default.jpg'
  },

  // --- I CLASSICI DELLA BRACE E GASTRONOMIA ---
  {
    id: 'prod-fiorentina-brace',
    name: 'Fiorentina alla Brace di Rovere (Scottona Emiliana)',
    name_translations: {
      it_IT: 'Fiorentina alla Brace di Rovere (Scottona Emiliana)',
      en_US: 'Oak-Charcoal Grilled Florentine T-Bone (Emilian Scottona)',
      de_DE: 'Florentiner T-Bone-Steak über Eichenholzkohle',
      fr_FR: 'T-Bone Fiorentina braisé au chêne (Scottona)',
      es_ES: 'Chuletón Florentina a la brasa de roble',
      zh_CN: '橡木纯炭火烤制佛罗伦萨T骨牛排 (艾米利亚母牛)',
      ja_JP: 'オーク炭火焼き 骨付きフィオレンティーナ ステーキ',
      ru_RU: 'Стейк Фиорентина на дубовых углях',
      ar_SA: 'ستيك فيورنتينا المشوي على فحم البلوط'
    },
    category: 'piatti_pronti',
    portion: 'circa 1.1 kg (per 2 persone)',
    unit: 'porzione 1.1kg',
    description: 'Bistecca alla Fiorentina con filetto e controfiletto di Scottona emiliana cotta espressa su brace ardente di legna dura di rovere. Crosticina dorata e cuore tenero al sangue, sale di Cervia e rosmarino.',
    price: 48.0,
    curator: 'Manuel',
    curatorNote: 'Cottura magistrale: 6 minuti a calore vivo, 5 minuti di riposo per sigillare i succhi.',
    cookingTime: 'Cotta espressa al sangue',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Cottura Espressa', 'Scottona Emiliana', 'Specialità della Casa'],
    allergens: [],
    origin: 'Emilia-Romagna / Cento',
    stockQuantity: 40,
    heatScale: 5,
    dryAgedDays: 30,
    imageUrl: '/assets/manuel_default.jpg'
  },
  {
    id: 'prod-costata-frollata',
    name: 'Costata di Pezzata Rossa Dry Aged (45 Giorni)',
    name_translations: {
      it_IT: 'Costata di Pezzata Rossa Dry Aged (45 Giorni)',
      en_US: '45-Day Dry-Aged Ribeye on the Bone',
      de_DE: '45 Tage trockengereiftes Ribeye-Steak mit Knochen',
      fr_FR: 'Côte de bœuf maturée 45 jours à sec',
      es_ES: 'Chuleton madurado 45 días Dry Aged',
      zh_CN: '专业干式排酸熟成45天带骨肋眼肉排',
      ja_JP: '45日間ドライエイジング 骨付きリブアイステーキ',
      ru_RU: 'Рибай на кости сухого вызревания 45 дней',
      ar_SA: 'ريب آي معتق لمدة 45 يومًا'
    },
    category: 'carne_fresca',
    portion: 'Bistecca da circa 800 g con osso',
    unit: 'taglio 800g',
    description: 'Taglio nobile da cuocere a casa o richiedere cotto al banco: frollatura a secco di 45 giorni a temperatura e umidità controllate nelle nostre celle a vista a Cento. Gusto burroso e morbidezza incomparabile.',
    price: 36.0,
    curator: 'Manuel',
    curatorNote: 'La marezzatura è perfetta. Da cuocere su griglia rovente 4 minuti per lato senza forare la carne.',
    cookingTime: 'Da cuocere su brace viva',
    isReadyToEat: false,
    isPopular: true,
    tags: ['Dry Aged 45gg', 'Celle a Vista', 'Carne Fresca'],
    allergens: [],
    origin: 'Allevamenti Emiliani',
    stockQuantity: 50,
    dryAgedDays: 45,
    imageUrl: '/assets/manuel_default.jpg'
  },
  {
    id: 'prod-tagliata-scottona',
    name: 'Tagliata di Scottona con Rucola e Grana DOP 24 Mesi',
    name_translations: {
      it_IT: 'Tagliata di Scottona con Rucola e Grana DOP 24 Mesi',
      en_US: 'Sliced Beef Steak with Arugula and Aged Grana',
      de_DE: 'Rinder-Tagliata mit Rucola und 24 Monate gereiftem Grana',
      fr_FR: 'Tagliata de bœuf Scottona, roquette et Grana 24 mois',
      es_ES: 'Tagliata de ternera con rúcula y Grana 24 meses',
      zh_CN: '香烤切片牛排配芝麻菜与24个月熟成帕马森芝士',
      ja_JP: 'スコットーナ牛のタリアータ ルッコラと熟成チーズ',
      ru_RU: 'Тальята из говядины с рукколой и пармезаном',
      ar_SA: 'تالیاتا ستيك اللحم مع الجرجير وجبن الجرانا'
    },
    category: 'piatti_pronti',
    portion: 'circa 400 g',
    unit: 'porzione',
    description: 'Trancio di roastbeef di Scottona cotto alla brace e tagliato a losanghe sottili, con rucola selvatica di campo e scaglie di Parmigiano Reggiano DOP 24 mesi.',
    price: 21.5,
    curator: 'Samanta',
    curatorNote: 'Un trionfo di freschezza ed equilibrio. Servito tiepido con filo d olio extravergine.',
    cookingTime: 'Pronta al consumo',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Bestseller', 'Parmigiano DOP', 'Senza Glutine'],
    allergens: ['Latte e derivati'],
    origin: 'Cento (FE)',
    stockQuantity: 45,
    imageUrl: '/assets/samanta_default.jpg'
  },
  {
    id: 'prod-costine-bbq',
    name: 'Costine di Maialino Nostrano Glassate al Miele di Tiglio',
    name_translations: {
      it_IT: 'Costine di Maialino Nostrano Glassate al Miele di Tiglio',
      en_US: 'Linden Honey Glazed Smoked Pork Ribs',
      de_DE: 'Rippchen glasiert mit Lindenblütenhonig',
      fr_FR: 'Travers de porc laqués au miel de tilleul',
      es_ES: 'Costillas glaseadas con miel de tilo',
      zh_CN: '菩提树蜂蜜秘汁慢烤本地猪肋排',
      ja_JP: 'リンデンハニー仕立て スペアリブ',
      ru_RU: 'Свиные ребрышки в липовом меду',
      ar_SA: 'أضلاع اللحم بالعسل الطبيعي'
    },
    category: 'piatti_pronti',
    portion: 'circa 650 g',
    unit: 'porzione',
    description: 'Ribs di maiale pesante padano affumicate lentamente con legno di melo per 4 ore e rifinite alla brace con glassa artigianale al miele di tiglio e spezie dolci.',
    price: 16.5,
    originalPrice: 18.5,
    curator: 'Manuel',
    curatorNote: 'Carne tenerissima che si sfila dall osso semplicemente con una forchetta.',
    cookingTime: 'Pronta da scaldare 5 min',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Affumicatura Lenta', 'Glassa al Miele', 'Super Tenera'],
    allergens: ['Senape'],
    origin: 'Cento (FE)',
    stockQuantity: 55,
    heatScale: 4,
    imageUrl: '/assets/manuel_default.jpg'
  },
  {
    id: 'prod-patate-forno',
    name: 'Patate Rustiche al Forno con Rosmarino e Lardo Battuto',
    name_translations: {
      it_IT: 'Patate Rustiche al Forno con Rosmarino e Lardo Battuto',
      en_US: 'Wood-Oven Roasted Rosemary Potatoes with Lardo',
      de_DE: 'Im Holzofen geröstete Rosmarinkartoffeln mit Lardo',
      fr_FR: 'Pommes de terre rôties au four à bois et lardo',
      es_ES: 'Patatas asadas al horno de leña con romero y lardo',
      zh_CN: '柴火窑烤迷迭香香脆土豆配薄脂培根',
      ja_JP: '薪窯焼き ローストポテト ローズマリー風味',
      ru_RU: 'Запеченный картофель с розмарином и лардо',
      ar_SA: 'بطاطس ريفية مشوية في فرن الحطب'
    },
    category: 'gastronomia_vini',
    portion: 'Vaschetta da 450 g',
    unit: 'vaschetta',
    description: 'Patate a pasta gialla dell Emilia cotte nel forno a legna con lardo profumato al battuto d aglio dolce ed erbe aromatiche del giardino.',
    price: 5.5,
    curator: 'Samanta',
    curatorNote: 'Croccanti all esterno e cremose all interno.',
    cookingTime: 'Pronto da scaldare',
    isReadyToEat: true,
    tags: ['Contorno Tradizionale', 'Forno a Legna'],
    allergens: [],
    origin: 'Cento (FE)',
    stockQuantity: 65,
    imageUrl: '/assets/samanta_default.jpg'
  },
  {
    id: 'prod-lambrusco-doc',
    name: 'Lambrusco Grasparossa DOC Selezione Bottega',
    name_translations: {
      it_IT: 'Lambrusco Grasparossa DOC Selezione Bottega',
      en_US: 'Sparkling Lambrusco Grasparossa DOC Selection',
      de_DE: 'Perlender Lambrusco Grasparossa DOC Auslese',
      fr_FR: 'Lambrusco Grasparossa DOC Sélection Bottega',
      es_ES: 'Lambrusco Grasparossa DOC Selección Bottega',
      zh_CN: '经典艾米利亚起泡红葡萄酒 Lambrusco DOC',
      ja_JP: 'エミリア特選 ランブルスコ DOC 微発泡赤ワイン',
      ru_RU: 'Игристое красное вино Ламбруско DOC',
      ar_SA: 'نبيذ لامبروسكو الفوار التقليدي'
    },
    category: 'gastronomia_vini',
    portion: 'Bottiglia 750 ml',
    unit: 'bottiglia',
    description: 'Vino rosso frizzante secco, spuma vivace e profumo di more selvatiche. Acidità perfetta per pulire la bocca tra un boccone di carne e l altro.',
    price: 11.5,
    curator: 'Manuel',
    curatorNote: 'Il compagno immancabile della brace viva. Da servire a 14°C.',
    cookingTime: 'Pronto da stappare',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Vino Emiliano', 'Abbinamento Carne'],
    allergens: ['Contiene Solfiti'],
    origin: 'Emilia-Romagna',
    stockQuantity: 90,
    imageUrl: '/assets/together_default.jpg'
  }
];

/**
 * 3. PROMOZIONI ATTIVE
 */
export const SEED_PROMOZIONI: Promozione[] = [
  {
    id: 'promo-01',
    titolo: 'Speciale Brace & Tradizione Ferrarese',
    titolo_translations: {
      it_IT: 'Speciale Brace & Tradizione Ferrarese',
      en_US: 'Hardwood Grill & Ferrarese Traditions',
      de_DE: 'Ferrareser Grill- und Traditionswochen',
      fr_FR: 'Spécial Braise & Traditions de Ferrare',
      es_ES: 'Especial Parrilla y Tradición Ferrarese',
      zh_CN: '费拉拉传统炭烤金秋特别展',
      ja_JP: '炭火グリルとフェッラーラ伝統の秋フェア',
      ru_RU: 'Гриль и традиции Феррары',
      ar_SA: 'أسبوع الشواء وتقاليد فيرارا الخاصة'
    },
    descrizione: 'Su ordini contenenti almeno una specialità ferrarese (Salamina, Cappelletti o Pampapato) ricevi 10% di sconto immediato nel carrello con codice FERRARA10.',
    badge: 'FESTA DI CENTO',
    sconto_percentuale: 10,
    valido_da: '2026-09-01',
    valido_a: '2026-11-30',
    attivo: true
  },
  {
    id: 'promo-02',
    titolo: 'Cestini del Weekend di Samanta',
    titolo_translations: {
      it_IT: 'Cestini del Weekend di Samanta',
      en_US: 'Samanta Weekend Barbecue Feast Boxes',
      de_DE: 'Samantas Wochenend-Grillkörbe',
      fr_FR: 'Paniers Festifs du Week-end par Samanta',
      es_ES: 'Cestas de Fin de Semana de Samanta',
      zh_CN: 'Samanta 独家周末聚会烧烤大礼篮',
      ja_JP: 'サマンタの特製 週末BBQバスケット',
      ru_RU: 'Праздничные барбекю-боксы от Саманты',
      ar_SA: 'سلال الشواء لعطلة نهاية الأسبوع من سامانتا'
    },
    descrizione: 'Consegna gratuita a Cento, Renazzo, Corporeno e Pieve di Cento per tutti i box famiglia superiori a 40€.',
    badge: 'CONSEGNA GRATUITA',
    sconto_percentuale: 12,
    valido_da: '2026-10-01',
    valido_a: '2026-12-31',
    attivo: true
  },
  {
    id: 'promo-03',
    titolo: 'Gourmet Europe Express: Sapori di Cento in Germania e Olanda',
    titolo_translations: {
      it_IT: 'Gourmet Europe Express: Sapori di Cento in Germania e Olanda',
      en_US: 'Gourmet Europe Express: Cento Flavors to Germany & Netherlands',
      de_DE: 'Gourmet Europa Express: Köstlichkeiten aus Cento nach Deutschland',
      fr_FR: 'Gourmet Europe Express : Saveurs de Cento en Allemagne et Pays-Bas',
      es_ES: 'Gourmet Europe Express: Sabores de Cento en Europa',
      zh_CN: '欧洲生鲜直邮：将意大利琴托美味送达德国与荷兰',
      ja_JP: 'ヨーロッパ直送便 チェントの美食をお届け',
      ru_RU: 'Доставка деликатесов Ченто по всей Европе',
      ar_SA: 'خدمة التوصيل الأوروبية السريعة لنكهات شينتو'
    },
    descrizione: 'Spedizione refrigerata isotermica rapida per tagli frollati, salumi ferraresi e pampapato con contributo agevolato.',
    badge: 'SPEDIZIONI UE',
    sconto_percentuale: 15,
    valido_da: '2026-08-01',
    valido_a: '2026-12-31',
    attivo: true
  }
];

/**
 * 4. SCONTI E COUPON
 */
export const SEED_SCONTI: Sconto[] = [
  {
    id: 'sconto-01',
    codice: 'BENVENUTO5',
    tipo: 'fisso',
    valore: 5.0,
    spesa_minima: 25.0,
    descrizione: '5€ di buono omaggio per i nuovi clienti iscritti alla newsletter o registrati con OTP.',
    attivo: true,
    utilizzi_totali: 64
  },
  {
    id: 'sconto-02',
    codice: 'FERRARA10',
    tipo: 'percentuale',
    valore: 10.0,
    spesa_minima: 40.0,
    descrizione: '10% di sconto per ordini di eccellenze gastronomiche ferraresi e carni scelte.',
    attivo: true,
    utilizzi_totali: 82
  },
  {
    id: 'sconto-03',
    codice: 'BRACE2026',
    tipo: 'percentuale',
    valore: 15.0,
    spesa_minima: 60.0,
    descrizione: '15% di sconto speciale per grigliate abbondanti e box famiglia.',
    attivo: true,
    utilizzi_totali: 45
  },
  {
    id: 'sconto-04',
    codice: 'VIPCENTO',
    tipo: 'fisso',
    valore: 12.0,
    spesa_minima: 75.0,
    descrizione: '12€ di sconto riservato ai clienti fedeli di Cento con oltre 500 punti.',
    attivo: true,
    utilizzi_totali: 28
  }
];

/**
 * 5. ORDINI STORICI E RECENTI (per popolamento statistiche mese, anno e storico)
 */
export const SEED_ORDERS: Order[] = [
  // --- MESE CORRENTE (OTTOBRE 2026) ---
  {
    id: 'BA-2026-1001',
    date: '2026-10-22T19:30:00Z',
    items: [
      { product: SEED_PRODUCTS[0], quantity: 2 }, // Salamina
      { product: SEED_PRODUCTS[1], quantity: 1 }, // Cappelletti
      { product: SEED_PRODUCTS[4], quantity: 2 }  // Fortana
    ],
    subtotal: 82.0,
    discount: 8.2,
    deliveryFee: 0,
    total: 73.8,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '19:30 - 20:00',
    paymentMethod: 'satispay',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Marco Bonora',
      email: 'marco.bonora@email.it',
      phone: '+39 347 8891234',
      address: 'Via IV Novembre 14',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'BNRMRC78C14C469U',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 73
  },
  {
    id: 'BA-2026-1002',
    date: '2026-10-21T12:45:00Z',
    items: [
      { product: SEED_PRODUCTS[7], quantity: 1 }, // Fiorentina
      { product: SEED_PRODUCTS[11], quantity: 2 }, // Patate
      { product: SEED_PRODUCTS[12], quantity: 1 }  // Lambrusco
    ],
    subtotal: 70.5,
    discount: 5.0,
    deliveryFee: 0,
    total: 65.5,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: '13:00 - 13:30',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Elena Marzocchi',
      email: 'elena.marzocchi@libero.it',
      phone: '+39 339 4521990',
      address: 'Via Guercino 52',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'MRZLNE85L68C469B',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'BENVENUTO5',
    earnedPoints: 65
  },
  {
    id: 'BA-2026-1003',
    date: '2026-10-20T20:00:00Z',
    items: [
      { product: SEED_PRODUCTS[6], quantity: 1 }, // Box Guercino
      { product: SEED_PRODUCTS[3], quantity: 1 }  // Pampapato
    ],
    subtotal: 68.5,
    discount: 10.28,
    deliveryFee: 0,
    total: 58.22,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: '20:15',
    paymentMethod: 'paypal',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Federico Govoni',
      email: 'fede.govoni@gmail.com',
      phone: '+39 328 1145678',
      address: 'Via Renazzo 110',
      city: 'Renazzo - Cento',
      postalCode: '44045',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'GVNFRC90S05C469K',
      isGuest: true,
      isOtpVerified: true
    },
    appliedPromoCode: 'BRACE2026',
    earnedPoints: 58
  },
  {
    id: 'BA-2026-1004',
    date: '2026-10-18T11:30:00Z',
    items: [
      { product: SEED_PRODUCTS[8], quantity: 2 }, // Costata Pezzata Rossa 45gg
      { product: SEED_PRODUCTS[2], quantity: 2 }, // Salame ferrarese
      { product: SEED_PRODUCTS[3], quantity: 2 }  // Pampapato
    ],
    subtotal: 132.0,
    discount: 13.2,
    deliveryFee: 15.0,
    total: 133.8,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: 'Corriere Refrigerato',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Hans Müller',
      email: 'hans.mueller@bayern-consult.de',
      phone: '+49 89 218070',
      address: 'Maximilianstraße 18',
      city: 'München',
      postalCode: '80539',
      province: 'BY',
      countryCode: 'DE',
      fiscalCode: 'DE-MULLER-842',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 133
  },
  {
    id: 'BA-2026-1005',
    date: '2026-10-15T18:40:00Z',
    items: [
      { product: SEED_PRODUCTS[9], quantity: 2 }, // Tagliata
      { product: SEED_PRODUCTS[10], quantity: 2 } // Costine bbq
    ],
    subtotal: 76.0,
    discount: 5.0,
    deliveryFee: 0,
    total: 71.0,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '19:00',
    paymentMethod: 'contanti',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Giorgio Tassinari',
      email: 'giorgio.tassinari@virgilio.it',
      phone: '+39 340 7654321',
      address: 'Via Malpighi 8',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'TSSGRG65A20C469D',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'BENVENUTO5',
    earnedPoints: 71
  },
  {
    id: 'BA-2026-1006',
    date: '2026-10-11T12:00:00Z',
    items: [
      { product: SEED_PRODUCTS[0], quantity: 4 }, // Salamine
      { product: SEED_PRODUCTS[4], quantity: 3 }  // Vini Fortana
    ],
    subtotal: 115.5,
    discount: 12.0,
    deliveryFee: 0,
    total: 103.5,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '12:30',
    paymentMethod: 'satispay',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Andrea Guercini',
      email: 'andrea.guercini@fe-architetti.it',
      phone: '+39 335 6677889',
      address: 'Corso Ercole I d Este 45',
      city: 'Ferrara',
      postalCode: '44121',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'GRCNDR75M19D548H',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'VIPCENTO',
    earnedPoints: 103
  },

  // --- MESI PRECEDENTI 2026 ---
  {
    id: 'BA-2026-0901',
    date: '2026-09-28T19:15:00Z',
    items: [
      { product: SEED_PRODUCTS[6], quantity: 2 }, // Box Guercino
      { product: SEED_PRODUCTS[12], quantity: 3 } // Lambrusco
    ],
    subtotal: 142.5,
    discount: 14.25,
    deliveryFee: 0,
    total: 128.25,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: '20:00',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Marco Bonora',
      email: 'marco.bonora@email.it',
      phone: '+39 347 8891234',
      address: 'Via IV Novembre 14',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'BNRMRC78C14C469U',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 128
  },
  {
    id: 'BA-2026-0902',
    date: '2026-09-15T13:00:00Z',
    items: [
      { product: SEED_PRODUCTS[8], quantity: 3 }, // Costate 45gg
      { product: SEED_PRODUCTS[3], quantity: 2 }  // Pampapato
    ],
    subtotal: 137.0,
    discount: 13.7,
    deliveryFee: 15.0,
    total: 138.3,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: 'Corriere UE',
    paymentMethod: 'paypal',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Jan Van der Meer',
      email: 'jan.vandermeer@amsterdam-tech.nl',
      phone: '+31 20 5551234',
      address: 'Keizersgracht 342',
      city: 'Amsterdam',
      postalCode: '1016 EZ',
      province: 'NH',
      countryCode: 'NL',
      fiscalCode: 'NL-VANDERMEER-55',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 138
  },
  {
    id: 'BA-2026-0801',
    date: '2026-08-14T20:00:00Z',
    items: [
      { product: SEED_PRODUCTS[7], quantity: 2 }, // Fiorentine
      { product: SEED_PRODUCTS[10], quantity: 2 } // Costine
    ],
    subtotal: 129.0,
    discount: 19.35,
    deliveryFee: 0,
    total: 109.65,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '20:30',
    paymentMethod: 'satispay',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Matteo Fabbri',
      email: 'matteo.fabbri@bondeno.fe.it',
      phone: '+39 338 1239874',
      address: 'Via Panzano 31',
      city: 'Bondeno',
      postalCode: '44012',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'FBBMTT82D17A965Z',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'BRACE2026',
    earnedPoints: 109
  },
  {
    id: 'BA-2026-0701',
    date: '2026-07-20T19:45:00Z',
    items: [
      { product: SEED_PRODUCTS[6], quantity: 1 },
      { product: SEED_PRODUCTS[12], quantity: 2 }
    ],
    subtotal: 77.0,
    discount: 5.0,
    deliveryFee: 0,
    total: 72.0,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: '20:00',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Francesca Zanardi',
      email: 'francesca.zanardi@terredelreno.it',
      phone: '+39 346 1122334',
      address: 'Via Risorgimento 19',
      city: 'Terre del Reno',
      postalCode: '44047',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'ZNRFNC87B58D548Q',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'BENVENUTO5',
    earnedPoints: 72
  },
  {
    id: 'BA-2026-0601',
    date: '2026-06-18T18:30:00Z',
    items: [
      { product: SEED_PRODUCTS[8], quantity: 2 },
      { product: SEED_PRODUCTS[2], quantity: 3 }
    ],
    subtotal: 118.5,
    discount: 11.85,
    deliveryFee: 15.0,
    total: 121.65,
    status: 'completato',
    deliveryMethod: 'consegna_cento',
    deliveryTimeSlot: 'Corriere UE',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Lars Lindqvist',
      email: 'lars.lindqvist@nordic-bbq.se',
      phone: '+46 8 12345678',
      address: 'Drottninggatan 57',
      city: 'Stockholm',
      postalCode: '111 21',
      province: 'ST',
      countryCode: 'SE',
      fiscalCode: 'SE-LINDQVIST-72',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 121
  },

  // --- ANNO 2025 (STORICO) ---
  {
    id: 'BA-2025-1201',
    date: '2025-12-23T10:00:00Z',
    items: [
      { product: SEED_PRODUCTS[0], quantity: 5 }, // Salamine natalizie
      { product: SEED_PRODUCTS[1], quantity: 4 }, // Cappelletti
      { product: SEED_PRODUCTS[3], quantity: 6 }  // Pampapato
    ],
    subtotal: 256.5,
    discount: 38.48,
    deliveryFee: 0,
    total: 218.02,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '11:00',
    paymentMethod: 'carta',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Diego Cimarosa',
      email: 'diego.cimarosa@gmail.com',
      phone: '+39 347 1234567',
      address: 'Via Penzale 25',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'CMRDGO80E12D548W',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'BRACE2026',
    earnedPoints: 218
  },
  {
    id: 'BA-2025-1101',
    date: '2025-11-14T19:00:00Z',
    items: [
      { product: SEED_PRODUCTS[7], quantity: 3 },
      { product: SEED_PRODUCTS[12], quantity: 4 }
    ],
    subtotal: 190.0,
    discount: 19.0,
    deliveryFee: 0,
    total: 171.0,
    status: 'completato',
    deliveryMethod: 'ritiro_bottega',
    deliveryTimeSlot: '19:30',
    paymentMethod: 'satispay',
    paymentStatus: 'pagato',
    customer: {
      fullName: 'Samanta Maderioli',
      email: 'samantamanderioli083@gmail.com',
      phone: '+39 348 7654321',
      address: 'Via Penzale 25',
      city: 'Cento',
      postalCode: '44042',
      province: 'FE',
      countryCode: 'IT',
      fiscalCode: 'MDRSMN83P62C469A',
      isGuest: false,
      isOtpVerified: true
    },
    appliedPromoCode: 'FERRARA10',
    earnedPoints: 171
  }
];

/**
 * 6. TABELLA TIPI DI DELIVERY (Ritiro in negozio, Spedizione a domicilio, Corriere Refrigerato)
 */
export const SEED_DELIVERY_TYPES: DeliveryType[] = [
  {
    id: 'ritiro_negozio',
    nome: 'Ritiro al banco in Bottega (Via Penzale, 25 - Cento)',
    costo_euro: 0.0,
    tempo_stimato: '30 - 45 minuti',
    istruzioni: 'Vieni direttamente in bottega. Salta la fila e ritira la tua comanda confezionata o appena tolta dalla griglia da Manuel e Samanta.',
    attivo: true
  },
  {
    id: 'domicilio_cento',
    nome: 'Spedizione a Domicilio Calda (Cento, Renazzo, Corporeno)',
    costo_euro: 3.5,
    tempo_stimato: 'Fascia serale 19:30 - 21:00',
    istruzioni: 'Fattorino della bottega con box termico riscaldato a 65°C per mantenere la croccantezza e il calore della brace viva.',
    attivo: true
  },
  {
    id: 'corriere_refrigerato_fe',
    nome: 'Corriere Refrigerato Espresso Provincia di Ferrara',
    costo_euro: 5.5,
    tempo_stimato: '24 ore garantite',
    istruzioni: 'Consegna a domicilio in tutti i comuni della provincia di Ferrara (Bondeno, Comacchio, Argenta, Ferrara città) con mezzo isotermico 0-4°C.',
    attivo: true
  },
  {
    id: 'corriere_refrigerato_italia',
    nome: 'Spedizione Gourmet Refrigerata Nazionale Italia',
    costo_euro: 9.9,
    tempo_stimato: '24 - 48 ore',
    istruzioni: 'Box in polistirolo ad alta densità con panetti di ghiaccio secco atossico e confezionamento sottovuoto alimentare professionale.',
    attivo: true
  },
  {
    id: 'spedizione_ue_priority',
    nome: 'Spedizione Internazionale UE (Germania, Olanda, Paesi Nordici)',
    costo_euro: 18.5,
    tempo_stimato: '48 - 72 ore',
    istruzioni: 'Spedizione aerea refrigerata DHL Express Food con tracciamento real-time e conformità doganale europea per carni e salumi tipici.',
    attivo: true
  }
];

/**
 * 7. TESTATE DEGLI ORDINI (order_header)
 * Campi: numero_ordine, data, id_cliente, id_valuta, codice_sconto, codice_promozione, note, stato_ordine, totale_euro, totale_valuta_cliente
 */
export const SEED_ORDER_HEADERS: OrderHeader[] = [
  {
    numero_ordine: 'ORD-2026-1001',
    data: '2026-10-23T08:30:00Z',
    id_cliente: 'cust-fe-01',
    customerName: 'Marco Bonora',
    customerEmail: 'marco.bonora@email.it',
    customerPhone: '+39 347 8891234',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'FERRARA10',
    codice_promozione: 'FESTA DI CENTO',
    tipo_delivery: 'ritiro_negozio',
    stato_ordine: 'in_lavorazione',
    totale_euro: 73.8,
    totale_valuta_cliente: 73.8,
    note: 'Richiesta Salamina ben calda con purè al burro nostrano. Ritiro previsto per pranzo.',
    meet_link: 'https://meet.google.com/bra-ciam-cento',
    createdAt: '2026-10-23T08:30:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1002',
    data: '2026-10-22T17:15:00Z',
    id_cliente: 'cust-fe-02',
    customerName: 'Elena Marzocchi',
    customerEmail: 'elena.marzocchi@libero.it',
    customerPhone: '+39 339 4521990',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'BENVENUTO5',
    codice_promozione: '',
    tipo_delivery: 'domicilio_cento',
    stato_ordine: 'confermato',
    totale_euro: 65.5,
    totale_valuta_cliente: 65.5,
    note: 'Citofonare Marzocchi secondo piano. Gradita cottura al sangue sulla Fiorentina.',
    meet_link: 'https://meet.google.com/qzw-mfkv-xop',
    createdAt: '2026-10-22T17:15:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1003',
    data: '2026-10-22T11:00:00Z',
    id_cliente: 'cust-fe-03',
    customerName: 'Alessandro Bonfiglioli',
    customerEmail: 'alessandro.bonfiglioli@cento.it',
    customerPhone: '+39 348 9988771',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'VIPCENTO',
    codice_promozione: '',
    tipo_delivery: 'ritiro_negozio',
    stato_ordine: 'in_preparazione',
    totale_euro: 92.0,
    totale_valuta_cliente: 92.0,
    note: 'Manuel per favore prepara il Box Grigliata Mista con salsicce ben aromatizzate.',
    meet_link: 'https://meet.google.com/bra-ciam-cento',
    createdAt: '2026-10-22T11:00:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1004',
    data: '2026-10-21T15:40:00Z',
    id_cliente: 'cust-eu-01',
    customerName: 'Hans Gruber',
    customerEmail: 'hans.gruber@bayern-feinkost.de',
    customerPhone: '+49 89 2345678',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: '',
    codice_promozione: 'GOURMET EUROPE EXPRESS',
    tipo_delivery: 'spedizione_ue_priority',
    stato_ordine: 'in_spedizione',
    totale_euro: 168.5,
    totale_valuta_cliente: 168.5,
    note: 'Spedizione refrigerata a Monaco di Baviera. Imballo speciale per salumi e formaggi.',
    meet_link: 'https://meet.google.com/new',
    createdAt: '2026-10-21T15:40:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1005',
    data: '2026-10-20T10:10:00Z',
    id_cliente: 'cust-eu-02',
    customerName: 'Lars Van Der Berg',
    customerEmail: 'lars.vanderberg@amsterdam-food.nl',
    customerPhone: '+31 20 6789123',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'BRACE2026',
    codice_promozione: '',
    tipo_delivery: 'spedizione_ue_priority',
    stato_ordine: 'spedito',
    totale_euro: 215.0,
    totale_valuta_cliente: 215.0,
    note: 'Consegna ad Amsterdam. Richiesto certificato di origine Salamina da Sugo IGP.',
    meet_link: 'https://meet.google.com/bra-ciam-cento',
    createdAt: '2026-10-20T10:10:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1006',
    data: '2026-10-18T18:20:00Z',
    id_cliente: 'cust-fe-04',
    customerName: 'Giulia Govoni',
    customerEmail: 'giulia.govoni@studiolegale.fe.it',
    customerPhone: '+39 340 1122334',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'FERRARA10',
    codice_promozione: 'CESTINI DEL WEEKEND',
    tipo_delivery: 'domicilio_cento',
    stato_ordine: 'ricevuto_feedback',
    totale_euro: 58.0,
    totale_valuta_cliente: 58.0,
    note: 'Feedback cliente: "Cappelletti squisiti e carne tenerissima, Manuel e Samanta i numeri uno!".',
    meet_link: 'https://meet.google.com/new',
    createdAt: '2026-10-18T18:20:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1007',
    data: '2026-10-16T14:00:00Z',
    id_cliente: 'cust-fe-05',
    customerName: 'Roberto Mascellani',
    customerEmail: 'roberto.mascellani@renazzo-mecc.it',
    customerPhone: '+39 347 5566778',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: '',
    codice_promozione: '',
    tipo_delivery: 'ritiro_negozio',
    stato_ordine: 'rifiutato',
    totale_euro: 42.0,
    totale_valuta_cliente: 42.0,
    note: 'Rifiutato su richiesta del cliente per indisponibilità oraria ritiro. Sostituito con comanda successiva.',
    createdAt: '2026-10-16T14:00:00Z'
  },
  {
    numero_ordine: 'ORD-2026-1008',
    data: '2026-10-15T09:30:00Z',
    id_cliente: 'cust-eu-04',
    customerName: 'Sven Lindqvist',
    customerEmail: 'sven.lindqvist@stockholm-nordic.se',
    customerPhone: '+46 8 55667788',
    id_valuta: 'SEK',
    tasso_cambio: 11.5,
    codice_sconto: '',
    codice_promozione: '',
    tipo_delivery: 'spedizione_ue_priority',
    stato_ordine: 'rimborsato',
    totale_euro: 130.0,
    totale_valuta_cliente: 1495.0,
    note: 'Rimborsato integralmente a Stoccolma per ritardo sciopero aereo transfrontaliero.',
    createdAt: '2026-10-15T09:30:00Z'
  },
  {
    numero_ordine: 'ORD-2026-0901',
    data: '2026-09-28T19:00:00Z',
    id_cliente: 'admin-diego',
    customerName: 'Diego Cimarosa',
    customerEmail: 'diego.cimarosa@gmail.com',
    customerPhone: '+39 347 1234567',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'BRACE2026',
    codice_promozione: 'FESTA DI CENTO',
    tipo_delivery: 'ritiro_negozio',
    stato_ordine: 'completato' as any,
    totale_euro: 218.0,
    totale_valuta_cliente: 218.0,
    note: 'Degustazione banco brace con amici e familiari.',
    meet_link: 'https://meet.google.com/bra-ciam-cento',
    createdAt: '2026-09-28T19:00:00Z'
  },
  {
    numero_ordine: 'ORD-2026-0902',
    data: '2026-09-15T12:00:00Z',
    id_cliente: 'admin-samanta',
    customerName: 'Samanta Maderioli',
    customerEmail: 'samantamanderioli083@gmail.com',
    customerPhone: '+39 348 7654321',
    id_valuta: 'EUR',
    tasso_cambio: 1.0,
    codice_sconto: 'FERRARA10',
    codice_promozione: '',
    tipo_delivery: 'ritiro_negozio',
    stato_ordine: 'completato' as any,
    totale_euro: 171.0,
    totale_valuta_cliente: 171.0,
    note: 'Selezione tagli speciali Fiorentina e Fortana DOC.',
    meet_link: 'https://meet.google.com/bra-ciam-cento',
    createdAt: '2026-09-15T12:00:00Z'
  }
];

/**
 * 8. DETTAGLI DEGLI ORDINI (order_detail)
 * Campi: id_dettaglio, id_ordine, id_prodotto, quantità, importo_euro, importo_valuta_cliente, codice_sconto, codice_promozione, note
 */
export const SEED_ORDER_DETAILS: OrderDetail[] = [
  // --- DETTAGLI ORD-2026-1001 ---
  {
    id_dettaglio: 'DET-1001-01',
    id_ordine: 'ORD-2026-1001',
    id_prodotto: 'prod-fe-salamina-igp',
    nome_prodotto: 'Salamina da Sugo IGP Tradizionale di Ferrara',
    quantita: 2,
    importo_euro: 44.0,
    importo_valuta_cliente: 44.0,
    codice_sconto: 'FERRARA10',
    codice_promozione: 'FESTA DI CENTO',
    note: 'Cotta lentamente 6 ore, servita con abbondante purè soffice.'
  },
  {
    id_dettaglio: 'DET-1001-02',
    id_ordine: 'ORD-2026-1001',
    id_prodotto: 'prod-fe-cappelletti',
    nome_prodotto: 'Cappelletti Ferraresi Fatti a Mano da Samanta',
    quantita: 1,
    importo_euro: 18.0,
    importo_valuta_cliente: 18.0,
    codice_sconto: 'FERRARA10',
    codice_promozione: '',
    note: 'Pasta fresca tirata a matterello, ripieno nobile con manzo e parmigiano 30 mesi.'
  },
  {
    id_dettaglio: 'DET-1001-03',
    id_ordine: 'ORD-2026-1001',
    id_prodotto: 'prod-fe-fortana-doc',
    nome_prodotto: 'Vino Bosco Eliceo Fortana DOC (Vino delle Sabbie)',
    quantita: 2,
    importo_euro: 20.0,
    importo_valuta_cliente: 20.0,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Bottiglie da 750ml fresche a 14°C.'
  },

  // --- DETTAGLI ORD-2026-1002 ---
  {
    id_dettaglio: 'DET-1002-01',
    id_ordine: 'ORD-2026-1002',
    id_prodotto: 'prod-fiorentina-chianina',
    nome_prodotto: 'Fiorentina di Chianina IGP Certificata',
    quantita: 1,
    importo_euro: 48.0,
    importo_valuta_cliente: 48.0,
    codice_sconto: 'BENVENUTO5',
    codice_promozione: '',
    note: 'Taglio a 4 dita (circa 1.1 kg), cottura al sangue con crosta profumata al rosmarino.'
  },
  {
    id_dettaglio: 'DET-1002-02',
    id_ordine: 'ORD-2026-1002',
    id_prodotto: 'prod-patate-brace',
    nome_prodotto: 'Patate della Campagna Ferrarese alla Cenere',
    quantita: 2,
    importo_euro: 11.0,
    importo_valuta_cliente: 11.0,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Condite con fiocchi di sale di Cervia e rosmarino fresco.'
  },
  {
    id_dettaglio: 'DET-1002-03',
    id_ordine: 'ORD-2026-1002',
    id_prodotto: 'prod-lambrusco-doc',
    nome_prodotto: 'Lambrusco Grasparossa DOC Selezione Bottega',
    quantita: 1,
    importo_euro: 11.5,
    importo_valuta_cliente: 11.5,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Da stappare fresco con la carne.'
  },

  // --- DETTAGLI ORD-2026-1003 ---
  {
    id_dettaglio: 'DET-1003-01',
    id_ordine: 'ORD-2026-1003',
    id_prodotto: 'prod-box-guercino',
    nome_prodotto: 'Box Degustazione del Guercino (Specialità di Cento)',
    quantita: 1,
    importo_euro: 65.0,
    importo_valuta_cliente: 65.0,
    codice_sconto: 'VIPCENTO',
    codice_promozione: '',
    note: 'Confezione regalo estense con nastro bordeaux.'
  },
  {
    id_dettaglio: 'DET-1003-02',
    id_ordine: 'ORD-2026-1003',
    id_prodotto: 'prod-fe-salame-aglio',
    nome_prodotto: 'Salame Ferrarese all Aglio con Filzetta',
    quantita: 2,
    importo_euro: 31.0,
    importo_valuta_cliente: 31.0,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Stagionato 60 giorni, filzetta integra.'
  },

  // --- DETTAGLI ORD-2026-1004 (Monaco di Baviera) ---
  {
    id_dettaglio: 'DET-1004-01',
    id_ordine: 'ORD-2026-1004',
    id_prodotto: 'prod-tagliata-angus',
    nome_prodotto: 'Tagliata di Black Angus al Sale Dolce di Cervia',
    quantita: 3,
    importo_euro: 66.0,
    importo_valuta_cliente: 66.0,
    codice_sconto: '',
    codice_promozione: 'GOURMET EUROPE EXPRESS',
    note: 'Confezionamento sottovuoto Cryovac per conservazione termica fino a 7 giorni.'
  },
  {
    id_dettaglio: 'DET-1004-02',
    id_ordine: 'ORD-2026-1004',
    id_prodotto: 'prod-fe-coppia-igp',
    nome_prodotto: 'Coppia Ferrarese IGP Croccante Tradizionale',
    quantita: 4,
    importo_euro: 14.0,
    importo_valuta_cliente: 14.0,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Confezione sigillata con atmosfera protettiva per salvaguardare la friabilità dei crostini.'
  },
  {
    id_dettaglio: 'DET-1004-03',
    id_ordine: 'ORD-2026-1004',
    id_prodotto: 'prod-fe-pampapato-igp',
    nome_prodotto: 'Pampapato di Ferrara IGP al Cioccolato Extra Fondente',
    quantita: 4,
    importo_euro: 58.0,
    importo_valuta_cliente: 58.0,
    codice_sconto: '',
    codice_promozione: '',
    note: 'Scatola in latta estense da collezione.'
  },

  // --- DETTAGLI ORD-2026-1005 (Amsterdam) ---
  {
    id_dettaglio: 'DET-1005-01',
    id_ordine: 'ORD-2026-1005',
    id_prodotto: 'prod-fiorentina-chianina',
    nome_prodotto: 'Fiorentina di Chianina IGP Certificata',
    quantita: 2,
    importo_euro: 96.0,
    importo_valuta_cliente: 96.0,
    codice_sconto: 'BRACE2026',
    codice_promozione: '',
    note: 'Frollatura dry-aged 35 giorni, certificato di razza Chianina allegato.'
  },
  {
    id_dettaglio: 'DET-1005-02',
    id_ordine: 'ORD-2026-1005',
    id_prodotto: 'prod-box-guercino',
    nome_prodotto: 'Box Degustazione del Guercino (Specialità di Cento)',
    quantita: 2,
    importo_euro: 130.0,
    importo_valuta_cliente: 130.0,
    codice_sconto: 'BRACE2026',
    codice_promozione: '',
    note: 'Etichette e schede degustazione in lingua inglese/olandese.'
  }
];

/**
 * 9. MESSAGGI E COMUNICAZIONI CICLO DI VITA ORDINE (order_message)
 */
export const SEED_ORDER_MESSAGES: OrderMessage[] = [
  {
    id: 'msg-1001-01',
    id_ordine: 'ORD-2026-1001',
    sender: 'bottega',
    sender_name: 'Samanta Maderioli',
    testo: 'Buongiorno Marco! Abbiamo ricevuto il tuo ordine per la Salamina IGP e i Cappelletti. Manuel ha già messo la pentola in lenta ebollizione.',
    timestamp: '2026-10-23T08:35:00Z',
    tipo: 'testo'
  },
  {
    id: 'msg-1001-02',
    id_ordine: 'ORD-2026-1001',
    sender: 'cliente',
    sender_name: 'Marco Bonora',
    testo: 'Grazie Samanta! Riuscite ad aggiungere anche due coppie ferraresi croccanti per favore?',
    timestamp: '2026-10-23T08:40:00Z',
    tipo: 'testo'
  },
  {
    id: 'msg-1001-03',
    id_ordine: 'ORD-2026-1001',
    sender: 'bottega',
    sender_name: 'Manuel Cannatà',
    testo: 'Aggiunte volentieri Marco, appena sfornate! Se vuoi dare un occhio alla cottura, ho attivato la videochiamata Google Meet: https://meet.google.com/bra-ciam-cento',
    timestamp: '2026-10-23T08:45:00Z',
    tipo: 'meet_invite'
  },
  {
    id: 'msg-1002-01',
    id_ordine: 'ORD-2026-1002',
    sender: 'bottega',
    sender_name: 'Manuel Cannatà',
    testo: 'Ciao Elena, ordine confermato! La Fiorentina è una Chianina eccellente con 35 giorni di frollatura. Sarà a casa tua tra le 19:30 e le 20:00.',
    timestamp: '2026-10-22T17:20:00Z',
    tipo: 'stato'
  }
];

/**
 * 10. LOG EMAIL TRANSAZIONALI ORDINE (order_email)
 */
export const SEED_ORDER_EMAILS: OrderEmailLog[] = [
  {
    id: 'eml-1001-01',
    id_ordine: 'ORD-2026-1001',
    destinatario: 'marco.bonora@email.it',
    oggetto: 'Braciami Ancora: Abbiamo preso in carico la tua comanda #ORD-2026-1001',
    corpo: 'Gentile Marco,\n\nGrazie per il tuo ordine presso Braciami Ancora Cento!\n\nRiepilogo comanda:\n- 2x Salamina da Sugo IGP Tradizionale\n- 1x Cappelletti Ferraresi Fatti a Mano da Samanta\n- 2x Vino Bosco Eliceo Fortana DOC\nTotale: €73.80\n\nStato attuale: In lavorazione sul braciere.\nRitirabile in Via Penzale, 25 a Cento.\n\nManuel & Samanta',
    data_invio: '2026-10-23T08:31:00Z',
    stato_innescato: 'in_lavorazione'
  },
  {
    id: 'eml-1002-01',
    id_ordine: 'ORD-2026-1002',
    destinatario: 'elena.marzocchi@libero.it',
    oggetto: 'Braciami Ancora: Il tuo ordine #ORD-2026-1002 è Confermato',
    corpo: 'Gentile Elena,\n\nil tuo ordine è stato confermato da Manuel e affidato alla preparazione espressa.\n\nConsegna prevista: Questa sera 19:30 - 21:00 in Via Guercino 52, Cento (FE).\n\nPer qualsiasi nota contatta la bottega al +39 347 1234567.',
    data_invio: '2026-10-22T17:16:00Z',
    stato_innescato: 'confermato'
  },
  {
    id: 'eml-1004-01',
    id_ordine: 'ORD-2026-1004',
    destinatario: 'hans.gruber@bayern-feinkost.de',
    oggetto: 'Braciami Ancora Cento: Your Order #ORD-2026-1004 has shipped via DHL Express Food',
    corpo: 'Dear Hans,\n\nYour artisan meat & gourmet box from Cento (Ferrara) has been dispatched in temperature-controlled refrigerated packaging.\n\nTracking: DHL-EXP-FE-984210\nEstimated delivery in Munich: 48 hours.\n\nManuel & Samanta',
    data_invio: '2026-10-21T16:00:00Z',
    stato_innescato: 'in_spedizione'
  }
];

