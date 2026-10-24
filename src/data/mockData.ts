import { Product, CustomerProfile, Order, PromoCampaign, CommercialProposal } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Piatti Pronti alla Brace
  {
    id: 'prod-fiorentina-brace',
    name: 'Fiorentina alla Brace di Rovere',
    category: 'piatti_pronti',
    portion: 'circa 1.1 kg (per 2 persone)',
    description: 'Bistecca alla Fiorentina di Scottona emiliana cotta espressa su brace ardente di legna dura di rovere. Crosticina dorata e cuore tenero al sangue, finita con sale grosso di Cervia e rosmarino fresco.',
    price: 48.0,
    curator: 'Manuel',
    curatorNote: 'La mia cottura preferita: 6 minuti per lato a calore vivo, 5 minuti di riposo per ridistribuire i succhi. Pronta da gustare calda o scaldare 2 minuti!',
    cookingTime: 'Già cotta al punto giusto, pronta da scaldare 3 min o gustare subito',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Cottura Espressa', 'Scottona Emiliana', 'Specialità della Casa'],
    allergens: []
  },
  {
    id: 'prod-tagliata-scottona',
    name: 'Tagliata di Scottona con Rucola e Grana 24 Mesi',
    category: 'piatti_pronti',
    portion: 'circa 400 g',
    description: 'Trancio di roastbeef di Scottona grigliato alla brace e tagliato a losanghe sottili, servito con rucola selvatica di campo, scaglie di Parmigiano Reggiano DOP 24 mesi e qualche goccia di balsamico tradizionale.',
    price: 21.5,
    curator: 'Samanta',
    curatorNote: 'Un classico senza tempo. Il Parmigiano 24 mesi si fonde appena a contatto con la carne calda.',
    cookingTime: 'Pronta al consumo',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Bestseller', 'Parmigiano DOP', 'Senza Glutine'],
    allergens: ['Latte e derivati']
  },
  {
    id: 'prod-costine-bbq',
    name: 'Costine di Maialino Nostrano Glassate al Miele di Tiglio',
    category: 'piatti_pronti',
    portion: 'circa 650 g',
    description: 'Ribs di maiale pesante padano affumicate lentamente con legno di melo per 4 ore e rifinite alla brace con glassa artigianale al miele di tiglio delle valli e spezie dolci.',
    price: 16.5,
    originalPrice: 18.5,
    curator: 'Manuel',
    curatorNote: 'Carne morbidissima che si stacca dall osso con una forchetta. La glassa è una ricetta di famiglia.',
    cookingTime: 'Pronta da scaldare 5 min in forno a 160°C',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Affumicatura Lenta', 'Glassa Segreta', 'Super Tenera'],
    allergens: ['Senape']
  },
  {
    id: 'prod-grigliata-mista-cento',
    name: 'Grigliata Mista alla Centese',
    category: 'piatti_pronti',
    portion: 'circa 800 g (per 2-3 persone)',
    description: 'Il gran misto della bottega: 2 pezzi di salsiccia tipica all aglio nostrano, 2 costine affumicate, 2 fette di pancetta croccante arrotolata e un trancio di coppa marinata al Sangiovese.',
    price: 26.0,
    curator: 'Manuel',
    curatorNote: 'Il piatto più richiesto la domenica a Cento. Profumo di legna e sapori decisi della nostra terra.',
    cookingTime: 'Pronta al consumo',
    isReadyToEat: true,
    isPopular: true,
    tags: ['Tradizione Centese', 'Piatto Ricco', 'Brace Viva'],
    allergens: []
  },
  {
    id: 'prod-arrosticini-brace',
    name: 'Arrosticini Artigianali di Castrato alla Brace',
    category: 'piatti_pronti',
    portion: 'Confezione da 15 spiedini (circa 450 g)',
    description: 'Veri spiedini di carne ovina selezionata tagliata a cubetti alternati a venature di grasso nobile, cotti sulla classica canaletta a carbonella con pane abbrustolito all olio evo.',
    price: 17.5,
    curator: 'Samanta',
    curatorNote: 'Croccanti fuori e succosi dentro. Serviti nell alluminio per preservare tutto il calore.',
    cookingTime: 'Pronti al consumo',
    isReadyToEat: true,
    tags: ['100% Castrato', 'Artigianali'],
    allergens: ['Glutine (nel pane di accompagnamento separato)']
  },
  {
    id: 'prod-galletto-mattone',
    name: 'Galletto Vallespluga al Mattone con Erbe Aromatiche',
    category: 'piatti_pronti',
    portion: '1 galletto intero (circa 550 g)',
    description: 'Galletto ruspante marinato 24 ore con rosmarino, salvia, aglio dolce e scorza di limone, schiacciato sul mattone refrattario sulla griglia per una pelle extra croccante.',
    price: 14.5,
    curator: 'Manuel',
    curatorNote: 'Pelle croccantissima e petto succoso grazie alla compressione del mattone rovente.',
    cookingTime: 'Pronto da servire',
    isReadyToEat: true,
    tags: ['Pelle Croccante', 'Erbe Aromatiche'],
    allergens: []
  },

  // Carne Selezionata da Cuocere
  {
    id: 'prod-costata-frollata',
    name: 'Costata di Pezzata Rossa Dry Aged (45 Giorni)',
    category: 'carne_fresca',
    portion: 'Bistecca da circa 800 g con osso',
    description: 'Taglio pregiato da vacca matura selezionata negli allevamenti emiliani, maturata per 45 giorni nella nostra cella a temperatura e umidità controllate. Gusto intenso e burroso.',
    price: 34.0,
    curator: 'Manuel',
    curatorNote: 'Una frollatura che trasforma la consistenza: note di nocciola e concentrazione del sapore di manzo senza eguali.',
    cookingTime: 'Consigliata cottura viva su griglia o piastra in ghisa 4 min per lato',
    isReadyToEat: false,
    isPopular: true,
    tags: ['Dry Aged 45gg', 'Pezzata Rossa', 'Selezione Oro'],
    allergens: []
  },
  {
    id: 'prod-fiorentina-cruda',
    name: 'Bistecca Fiorentina di Scottona Selezione Bottega',
    category: 'carne_fresca',
    portion: 'Taglio da 1.2 kg con osso a T',
    description: 'Filetto e controfiletto generosi, frollatura minima 28 giorni. Confezionata sottovuoto con foglio salva-freschezza e sacchettino di sale aromaterapico fatto da Samanta.',
    price: 44.0,
    curator: 'Samanta',
    curatorNote: 'Perfetta per chi ama grigliare a casa la domenica con gli amici. Vi allego il nostro sale alle erbe.',
    cookingTime: 'Tirare fuori dal frigo 1 ora prima di cuocere',
    isReadyToEat: false,
    tags: ['Taglio Nobile', 'Filetto Generoso'],
    allergens: []
  },
  {
    id: 'prod-salsiccia-cento',
    name: 'Salsiccia Tipica di Cento a Nodo Doppio',
    category: 'carne_fresca',
    portion: 'Confezione da 6 pezzi (circa 600 g)',
    description: 'Preparata ogni mattina nel nostro laboratorio con spalla e pancetta di suino padano, sale, pepe nero spaccato e un leggero tocco di vino bianco e aglio pestato nel mortaio.',
    price: 8.8,
    curator: 'Samanta',
    curatorNote: 'La regina indiscussa della nostra gastronomia. Non pungetela mai con la forchetta durante la cottura!',
    cookingTime: '12-15 minuti alla brace a calore medio',
    isReadyToEat: false,
    isPopular: true,
    tags: ['Produzione Quotidiana', 'Ricetta Centese Tradizionale'],
    allergens: []
  },
  {
    id: 'prod-burger-fassona',
    name: 'Duo Burger Gourmet di Fassona Piemontese (2x200g)',
    category: 'carne_fresca',
    portion: '2 burger da 200 g cad.',
    description: 'Macinato a grana media da polpa di Fassona battuta al coltello, senza conservanti né addensanti. Solo carne pura, sale e pepe.',
    price: 9.5,
    curator: 'Manuel',
    curatorNote: 'Gusto pulitissimo e magro. Cuocetelo a fiamma viva lasciando il cuore rosato.',
    cookingTime: '3 minuti per lato a fiamma alta',
    isReadyToEat: false,
    tags: ['100% Fassona', 'Macinato Fresco'],
    allergens: []
  },

  // Cestini Barbecue & Box
  {
    id: 'box-weekend-braciere',
    name: 'Cestino "Grigliata del Weekend Centese" (4-6 Persone)',
    category: 'cestini_box',
    portion: 'Circa 2.8 kg di carni + contorni + condimenti',
    description: 'Il box completo per la grigliata perfetta senza pensieri: 1 Fiorentina da 1kg, 8 salsicce fresche di Cento, 6 costine marinate, 1 barattolo di rub artigianale della bottega e 1 bottiglia di Lambrusco di Sorbara DOC.',
    price: 79.0,
    originalPrice: 89.0,
    curator: 'Manuel',
    curatorNote: 'Il nostro bestseller assoluto del fine settimana. Risparmi 10€ e hai tutto pronto da mettere sul fuoco con gli amici.',
    cookingTime: 'Include guida di cottura stampata passo-passo',
    isReadyToEat: false,
    isPopular: true,
    tags: ['Super Risparmio', 'Kit Completo', 'Omaggio Vino Incluso'],
    allergens: ['Solfiti (nel vino)']
  },
  {
    id: 'box-gourmet-dry-aged',
    name: 'Cestino Degustazione "Frollature Nobili"',
    category: 'cestini_box',
    portion: 'Circa 2.2 kg di selezioni frollate',
    description: 'Per veri intenditori di carne: 1 Tomahawk di Black Angus (1.2 kg), 1 Costata Pezzata Rossa 45gg (700g), vasetto di burro al midollo ed erbe e vasetto di sale affumicato al legno di faggio.',
    price: 98.0,
    curator: 'Manuel',
    curatorNote: 'Un viaggio sensoriale nei tagli frollati con osso lungo. L esperienza più esclusiva che proponiamo.',
    cookingTime: 'Include termometro a sonda omaggio',
    isReadyToEat: false,
    tags: ['Edizione Limitata', 'Esperienza Gourmet'],
    allergens: ['Latte e derivati (nel burro)']
  },
  {
    id: 'box-pronto-tavola',
    name: 'Cestino "Cena Pronta alla Brace" (Caldo o da Rigenerare)',
    category: 'cestini_box',
    portion: 'Per 3-4 persone (circa 1.8 kg di pietanze cotte)',
    description: 'Tutto cotto su brace ardente da Manuel: 1 Tagliata da 600g, 1 Galletto intero al mattone, patate rustiche al forno con rosmarino e lardo, verdure grigliate e salsine.',
    price: 64.0,
    curator: 'Samanta',
    curatorNote: 'Ideale se torni tardi dal lavoro a Cento e vuoi una cena da re senza sporcare la cucina!',
    cookingTime: 'Già cotto. Pronto in 5 minuti di forno',
    isReadyToEat: true,
    tags: ['Zero Sbatti', 'Pronto Subito'],
    allergens: []
  },

  // Gastronomia, Contorni & Vini Locali
  {
    id: 'prod-patate-forno',
    name: 'Patate Rustiche al Forno con Rosmarino e Lardo Battuto',
    category: 'gastronomia_vini',
    portion: 'Vaschetta da 450 g',
    description: 'Patate a pasta gialla dell Emilia cotte nel forno a legna con lardo di colonnata profumato al battuto d aglio ed erbe aromatiche del giardino.',
    price: 5.5,
    curator: 'Samanta',
    curatorNote: 'Croccanti all esterno, cremose dentro. Il lardo dona una doratura imbattibile.',
    cookingTime: 'Pronto da scaldare',
    isReadyToEat: true,
    tags: ['Contorno Tradizionale', 'Golose'],
    allergens: []
  },
  {
    id: 'prod-cipolline-balsamico',
    name: 'Cipolline Borettane all Aceto Balsamico di Modena IGP',
    category: 'gastronomia_vini',
    portion: 'Vasetto da 300 g',
    description: 'Cipolline borettane dolci brasate a fuoco lento con aceto balsamico di Modena e zucchero grezzo di canna. Il matrimonio perfetto con le carni grasse di maiale.',
    price: 6.0,
    curator: 'Samanta',
    curatorNote: 'Sgrassano il palato dopo una costina o una salsiccia. Una ricetta di nonna.',
    cookingTime: 'Pronto all uso',
    isReadyToEat: true,
    tags: ['Conserva Artigianale', 'Balsamico IGP'],
    allergens: ['Solfiti']
  },
  {
    id: 'prod-lambrusco-doc',
    name: 'Lambrusco Grasparossa di Castelvetro DOC - Selezione Bottega',
    category: 'gastronomia_vini',
    portion: 'Bottiglia 750 ml',
    description: 'Vino rosso frizzante secco, spuma vivace e profumo di more selvatiche e marasca. Acidità perfetta per pulire la bocca tra un boccone di Fiorentina e l altro.',
    price: 11.5,
    curator: 'Manuel',
    curatorNote: 'Il compagno insostituibile della nostra griglia. Servitelo fresco a 14-16°C.',
    cookingTime: 'Pronto da stappare',
    isReadyToEat: true,
    tags: ['Vino Emiliano', 'Abbinamento Ideale'],
    allergens: ['Contiene Solfiti']
  },
  {
    id: 'prod-salsa-bbq-bottega',
    name: 'Salsa Barbecue Artigianale con Prugne di Vignola e Miele',
    category: 'gastronomia_vini',
    portion: 'Vasetto da 220 g',
    description: 'La salsa barbecue creata da Samanta: niente additivi chimici, solo pomodoro emiliano, prugne secche locali, miele millefiori e fumo naturale di legno di faggio.',
    price: 4.8,
    curator: 'Samanta',
    curatorNote: 'Equilibrio perfetto tra affumicato, dolcezza e acidità naturale.',
    cookingTime: 'Pronta da versare',
    isReadyToEat: true,
    tags: ['Fatta a Mano', 'Ricetta Esclusiva'],
    allergens: []
  }
];

export const INITIAL_CAMPAIGNS: PromoCampaign[] = [
  {
    code: 'CENTOBRACE10',
    title: 'Benvenuto a Cento',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 30,
    expiresAt: '2026-12-31',
    description: '10% di sconto sul tuo primo ordine online per residenti a Cento e dintorni.'
  },
  {
    code: 'FIORENTINA15',
    title: 'Festa della Bistecca',
    discountType: 'percentage',
    discountValue: 15,
    minSpend: 60,
    expiresAt: '2026-11-15',
    description: '15% di sconto per ordini con carrello superiore a 60€.'
  },
  {
    code: 'BENVENUTO5',
    title: 'Bonus Newsletter',
    discountType: 'fixed',
    discountValue: 5,
    minSpend: 25,
    expiresAt: '2026-12-31',
    description: '5€ di buono omaggio per chi si iscrive al club delle novità di Manuel e Samanta.'
  }
];

export const INITIAL_CUSTOMERS: CustomerProfile[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_PROPOSALS: CommercialProposal[] = [];

export const STORE_INFO = {
  name: 'Braciami ancora',
  subname: 'Alimentari & Brace Centese',
  motto: 'Qualità al giusto prezzo',
  address: 'Via Penzale, 25, 44042 Cento FE',
  phone: '051 683 4920',
  whatsapp: '348 998 7654',
  email: 'info@braciamiancoracento.it',
  hours: [
    { days: 'Martedì - Sabato', times: '08:30 - 13:30 | 16:30 - 21:00' },
    { days: 'Domenica', times: '08:30 - 14:00 (Ritiro Grigliate & Piatti caldi) | Sera Chiuso' },
    { days: 'Lunedì', times: 'Chiuso per riposo settimanale' }
  ],
  deliveryZones: [
    'Cento Centro Storico (gratuita sopra 35€)',
    'Renazzo & Corporeno (gratuita sopra 40€)',
    'Pieve di Cento (gratuita sopra 40€)',
    'Dodici Morelli & Casumaro (gratuita sopra 45€)'
  ]
};
