import { Product, CustomerProfile, Order } from '../types';

export interface SqlCustomer {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  cap: string;
  province: string;
  is_registered: boolean;
  payment_method: 'carta_credito' | 'bancomat' | 'paypal' | 'satispay' | 'contanti_ritiro';
  payment_details: string; // JSON with masked card, PCI-DSS token or fake provider id
  registered_date: string;
  total_spent: number;
  order_count: number;
  last_order_date: string;
  loyalty_points: number;
  segment: 'Top Spender' | 'Abituale Weekend' | 'Nuovo Cliente' | 'Dormiente';
  notes: string;
}

export interface SqlProduct {
  id: string;
  name: string;
  category: 'piatti_pronti' | 'carne_fresca' | 'cestini_box' | 'gastronomia_vini';
  sub_category: string;
  price: number;
  original_price: number | null;
  price_unit: string; // 'kg' | 'pz' | 'porzione'
  portion: string;
  description: string;
  curator: 'Manuel' | 'Samanta' | 'Entrambi';
  curator_note: string;
  cooking_time: string;
  is_ready_to_eat: boolean;
  is_popular: boolean;
  heat_scale: number; // 1-5 (1: delicato, 5: piccante/intenso)
  frollatura_days: number;
  allergens: string; // JSON array
  ingredients: string;
  tags: string; // JSON array
}

// -------------------------------------------------------------
// 100 CUSTOMERS (80% registered with full details & simulated payments)
// -------------------------------------------------------------
const ITALIAN_FIRST_NAMES = [
  'Marco', 'Alessandro', 'Matteo', 'Andrea', 'Lorenzo', 'Davide', 'Simone', 'Francesco', 'Luca', 'Gabriele',
  'Giulia', 'Chiara', 'Francesca', 'Sara', 'Elena', 'Martina', 'Silvia', 'Federica', 'Valentina', 'Alice',
  'Roberto', 'Stefano', 'Paolo', 'Massimo', 'Giorgio', 'Fabio', 'Claudio', 'Riccardo', 'Daniele', 'Enrico',
  'Laura', 'Anna', 'Beatrice', 'Monica', 'Alessia', 'Cinzia', 'Paola', 'Simona', 'Cristina', 'Ilaria',
  'Alberto', 'Filippo', 'Giovanni', 'Michele', 'Pietro', 'Antonio', 'Vincenzo', 'Salvatore', 'Giuseppe', 'Luigi'
];

const CENTO_LAST_NAMES = [
  'Rossi', 'Bonfiglioli', 'Gallerani', 'Govoni', 'Tassinari', 'Balboni', 'Ferioli', 'Marvelli', 'Fortini', 'Guercino',
  'Melloni', 'Zucchini', 'Pirazzoli', 'Bregoli', 'Cremonini', 'Bortolotti', 'Baruffaldi', 'Ghelfi', 'Ghedini', 'Malaguti',
  'Lodi', 'Maccaferri', 'Alberghini', 'Venturi', 'Rondelli', 'Bassi', 'Accorsi', 'Cevolani', 'Guidi', 'Minelli'
];

const CENTO_STREETS = [
  'Via Penzale 12', 'Via Penzale 45', 'Via Penzale 88', 'Corso Guercino 14', 'Corso Guercino 85', 'Corso Guercino 112',
  'Via IV Novembre 8', 'Via IV Novembre 23', 'Via Ferrarese 34', 'Via Ferrarese 90', 'Via Bologna 15', 'Via Bologna 62',
  'Via Reno 7', 'Via Cremonino 19', 'Via Malamocco 4', 'Via Campagnoli 28', 'Via Baruffaldi 11', 'Via Donati 5',
  'Via Provenzali 16', 'Via Breve 2', 'Via Vicini 31', 'Piazza del Guercino 3', 'Via Ugo Bassi 40', 'Via Risorgimento 18'
];

export const INITIAL_SQL_CUSTOMERS: SqlCustomer[] = Array.from({ length: 100 }, (_, i) => {
  const firstName = ITALIAN_FIRST_NAMES[i % ITALIAN_FIRST_NAMES.length];
  const lastName = CENTO_LAST_NAMES[(i * 3 + Math.floor(i / 10)) % CENTO_LAST_NAMES.length];
  const fullName = `${firstName} ${lastName}`;
  const isRegistered = i < 80; // Exactly 80% registered
  const street = CENTO_STREETS[i % CENTO_STREETS.length];
  const phone = `+39 34${(70000000 + i * 148293).toString().slice(0, 8)}`;
  const cleanEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 40 ? i : ''}@gmail.com`
    .replace(/\s+/g, '')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Payment method distribution
  const paymentMethods: ('carta_credito' | 'bancomat' | 'paypal' | 'satispay' | 'contanti_ritiro')[] = [
    'carta_credito', 'satispay', 'paypal', 'bancomat', 'contanti_ritiro'
  ];
  const paymentMethod = paymentMethods[i % paymentMethods.length];

  let paymentDetailsObj: Record<string, unknown> = {};
  if (paymentMethod === 'carta_credito') {
    paymentDetailsObj = {
      type: 'Carta di Credito (Visa/Mastercard)',
      brand: i % 2 === 0 ? 'Visa' : 'Mastercard',
      masked_pan: `**** **** **** ${1000 + ((i * 37) % 9000)}`,
      expiry: `${((i % 12) + 1).toString().padStart(2, '0')}/28`,
      pci_dss_token: `PCI_TOKEN_${(i + 1).toString().padStart(4, '0')}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      security_protocol: '3D-Secure 2.2 Verified',
      status: 'ATTIVA'
    };
  } else if (paymentMethod === 'bancomat') {
    paymentDetailsObj = {
      type: 'PagoBancomat / Maestro',
      brand: 'PagoBancomat',
      masked_pan: `**** **** **** ${2000 + ((i * 43) % 8000)}`,
      expiry: '12/27',
      bancomat_auth_token: `BANCOMAT_AUTH_TK_${10000 + i}`,
      terminal_status: 'ABILITATO_CONTACTLESS'
    };
  } else if (paymentMethod === 'paypal') {
    paymentDetailsObj = {
      type: 'PayPal Checkout',
      paypal_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@paypal.fake`,
      billing_agreement_id: `B-938210984${(100 + i)}`,
      payer_id: `PAYER_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      status: 'VERIFICATO'
    };
  } else if (paymentMethod === 'satispay') {
    paymentDetailsObj = {
      type: 'Satispay Smart Payment',
      satispay_user_id: `SATIS_IT_44042_${(10000 + i)}`,
      linked_phone: phone,
      instant_charge_status: 'ABILITATO_RAPIDO',
      cashback_earned: `€${((i * 1.5) % 15).toFixed(2)}`
    };
  } else {
    paymentDetailsObj = {
      type: 'Contanti o POS al Ritiro in Bottega',
      pickup_location: 'Via Penzale, 25 · 44042 Cento FE',
      note: 'Pagamento al banco saltafila con scontrino fiscale'
    };
  }

  const orderCount = isRegistered ? 2 + (i % 18) : 1 + (i % 3);
  const totalSpent = orderCount * (35 + ((i * 7) % 85));
  const points = Math.floor(totalSpent / 5);

  const segment: 'Top Spender' | 'Abituale Weekend' | 'Nuovo Cliente' | 'Dormiente' =
    totalSpent > 600 ? 'Top Spender' : orderCount >= 5 ? 'Abituale Weekend' : i % 7 === 0 ? 'Dormiente' : 'Nuovo Cliente';

  return {
    id: `CUST-${(1001 + i)}`,
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    email: isRegistered ? cleanEmail : '',
    phone,
    address: isRegistered ? street : '',
    city: isRegistered ? 'Cento' : '',
    cap: isRegistered ? '44042' : '',
    province: isRegistered ? 'FE' : '',
    is_registered: isRegistered,
    payment_method: paymentMethod,
    payment_details: JSON.stringify(paymentDetailsObj),
    registered_date: `2025-${((i % 10) + 1).toString().padStart(2, '0')}-${((i % 26) + 1).toString().padStart(2, '0')}`,
    total_spent: Number(totalSpent.toFixed(2)),
    order_count: orderCount,
    last_order_date: `2026-03-${((i % 28) + 1).toString().padStart(2, '0')}`,
    loyalty_points: points,
    segment,
    notes: isRegistered ? `Cliente abituale della bottega di Cento. Preferenza tagli: ${i % 2 === 0 ? 'Fiorentina e Scottona' : 'Cestini Weekend e Costine'}` : 'Cliente ordini veloci da cellulare'
  };
});

// -------------------------------------------------------------
// 220+ AUTHENTIC BUTCHERY & DELI PRODUCTS WITH ALLERGENS & HEAT SCALE
// -------------------------------------------------------------
export const INITIAL_SQL_PRODUCTS: SqlProduct[] = [
  // 1. Tagli Pregiati Scottona Dry-Aged (Carne Fresca)
  {
    id: 'prod-scot-01',
    name: 'Fiorentina di Scottona Emiliana Dry-Aged 45gg',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 38.50,
    original_price: 44.00,
    price_unit: 'kg',
    portion: 'Circa 1.2 kg con osso e filetto (2 persone)',
    description: 'Il capolavoro di Manuel: lombata di Scottona nostrana frollata a secco nelle nostre celle per 45 giorni. Spessore 4 dita, marezzatura dorata e sapore burroso.',
    curator: 'Manuel',
    curator_note: 'Consiglio di portarla a temperatura ambiente 1 ora prima di cuocerla su brace vivissima, 5 minuti per lato e 7 minuti in piedi sull\'osso.',
    cooking_time: '18 min brace viva',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 45,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: '100% Carne di Scottona bovina emiliana allevata tra Ferrara e Bologna',
    tags: JSON.stringify(['Fiorentina', 'Dry-Aged', 'Scottona', 'Top Quality', 'Brace'])
  },
  {
    id: 'prod-scot-02',
    name: 'Costata di Scottona Dry-Aged 30gg Senza Filetto',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 32.00,
    original_price: null,
    price_unit: 'kg',
    portion: 'Circa 850g con osso',
    description: 'Costata alta succosa, ricavata dalle prime 6 costole della lombata. Grasso candido fuso a caldo che profuma di pascolo e quercia.',
    curator: 'Manuel',
    curator_note: 'Salare solo a fine cottura con cristalli di sale grosso emiliano.',
    cooking_time: '12 min brace',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 30,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: '100% Carne bovina di Scottona selezionata da Manuel',
    tags: JSON.stringify(['Costata', 'Bistecca', 'Cento'])
  },
  {
    id: 'prod-scot-03',
    name: 'Tomahawk Gigante di Scottona con Osso Lungo 60gg',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 42.00,
    original_price: 48.00,
    price_unit: 'kg',
    portion: 'Circa 1.5 - 1.7 kg',
    description: 'La bistecca da festa per eccellenza: il taglio regale a forma di ascia di guerra, con osso costale scalzato e frollatura estesa a 60 giorni.',
    curator: 'Manuel',
    curator_note: 'Per una crosticina perfetta usare la tecnica del reverse searing o cottura diretta ad alta temperatura.',
    cooking_time: '25 min brace',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 60,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Carne di Scottona emiliana selezione speciale Braciami ancora',
    tags: JSON.stringify(['Tomahawk', 'Bistecca Gigante', 'Brace Festiva'])
  },
  {
    id: 'prod-scot-04',
    name: 'Picanha di Scottona con Copertina di Grasso Nobile',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 26.50,
    original_price: null,
    price_unit: 'kg',
    portion: 'Pezzo intero ca. 1.1 kg o a fette da 300g',
    description: 'Codone di manzo con spessa copertina di grasso saporito. Perfetta sia allo spiedo a C che a fette spesse sulla griglia.',
    curator: 'Manuel',
    curator_note: 'Incisioni a rombo sul grasso prima di passare sulla griglia per far colare i succhi saporiti sulla brace.',
    cooking_time: '15 min',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 25,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: '100% Codone di Scottona bovina nostrana',
    tags: JSON.stringify(['Picanha', 'Churrasco', 'Brace'])
  },
  {
    id: 'prod-scot-05',
    name: 'Filetto di Scottona Tenerissimo al Coltello',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 46.00,
    original_price: null,
    price_unit: 'kg',
    portion: 'Medaglioni da 250g cad.',
    description: 'Il muscolo più nobile e tenero in assoluto. Si taglia come il burro con la forchetta.',
    curator: 'Manuel',
    curator_note: 'Cottura veloce: 3 minuti per lato a fuoco ardente, servito al sangue con una noce di burro al rosmarino.',
    cooking_time: '6 min',
    is_ready_to_eat: false,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 20,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: '100% Filetto bovino selezionato',
    tags: JSON.stringify(['Filetto', 'Tenero', 'Gourmet'])
  },
  {
    id: 'prod-scot-06',
    name: 'Diaframma di Manzo (Skirt Steak) Marinato',
    category: 'carne_fresca',
    sub_category: 'Bovino Scottona',
    price: 22.00,
    original_price: 25.00,
    price_unit: 'kg',
    portion: 'Circa 600g',
    description: 'Il segreto dei veri maestri grigliatori: taglio ricco di ferro e fibre muscolari morbide se cotto al sangue e tagliato controfibra.',
    curator: 'Manuel',
    curator_note: 'Marinato con olio extravergine, aglio centese e rosmarino prima di grigliare.',
    cooking_time: '6 min brace vivace',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 2,
    frollatura_days: 15,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Carne di manzo (diaframma), olio EVO, spezie aromatiche',
    tags: JSON.stringify(['Diaframma', 'Gusto Intenso', 'Grill Master'])
  },
  {
    id: 'prod-scot-07',
    name: 'Tartare di Scottona Battuta al Coltello da Samanta',
    category: 'piatti_pronti',
    sub_category: 'Antipasti e Crudi',
    price: 13.50,
    original_price: null,
    price_unit: 'pz',
    portion: 'Porzione singola da 200g condita a parte',
    description: 'Battuta a mano ogni mattina da Samanta. Carne fresca vellutata accompagnata da tuorlo fresco biologico, capperi di Salina, senape antica e crostini all\'olio.',
    curator: 'Samanta',
    curator_note: 'Conservare in frigo e consumare entro 24 ore per godere della massima freschezza.',
    cooking_time: 'Pronto da gustare',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 18,
    allergens: JSON.stringify(['Uova', 'Senape', 'Glutine (nei crostini)']),
    ingredients: 'Polpa di scottona emiliana battuta al coltello, olio EVO, pepe nero, sale dolce, condimenti freschi',
    tags: JSON.stringify(['Tartare', 'Crudo', 'Fresco', 'Bottega'])
  },
  {
    id: 'prod-scot-08',
    name: 'Tagliata di Scottona con Cesto di Rucola e Grana 30 Mesi',
    category: 'piatti_pronti',
    sub_category: 'Cotti alla Brace',
    price: 18.00,
    original_price: 20.00,
    price_unit: 'porzione',
    portion: 'Porzione abbondante da 350g',
    description: 'Cotta al momento sulla brace di rovere da Manuel, tagliata a fette calde e adagiata su letto di rucola selvatica fresca con scaglie di Parmigiano Reggiano DOP stagionato 30 mesi.',
    curator: 'Entrambi',
    curator_note: 'Condita con qualche goccia di riduzione al Lambrusco e sale di Cervia.',
    cooking_time: 'Cotta espressa',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 28,
    allergens: JSON.stringify(['Latte/Lattosio']),
    ingredients: 'Scottona cotta alla brace, Parmigiano Reggiano DOP 30 mesi, rucola fresca, olio EVO',
    tags: JSON.stringify(['Tagliata', 'Brace', 'Parmigiano', 'Caldo'])
  },

  // 2. Suino & Specialità Tipiche Centesi
  {
    id: 'prod-suin-01',
    name: 'Salsiccia Centese Tradizionale a Nastro alla Brace',
    category: 'carne_fresca',
    sub_category: 'Suino Centese',
    price: 13.90,
    original_price: 15.50,
    price_unit: 'kg',
    portion: 'A confezione da 500g (circa 4 pezzi) o nastro intero',
    description: 'La celebre salsiccia centese prodotta nel laboratorio della nostra bottega secondo la ricetta storica: spalla e pancetta di suino nostrano, aglio in infusione di vino bianco e pepe nero frantumato.',
    curator: 'Manuel',
    curator_note: 'Non bucare il budello durante la cottura per preservare l\'umidità interna e la morbidezza.',
    cooking_time: '12 min brace',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 2,
    frollatura_days: 3,
    allergens: JSON.stringify(['Solfiti (nel vino bianco della marinatura)']),
    ingredients: 'Carne di suino italiano (spalla, pancetta), sale marino, vino bianco, aglio, pepe nero',
    tags: JSON.stringify(['Salsiccia', 'Cento', 'Tipico', 'Artigianale'])
  },
  {
    id: 'prod-suin-02',
    name: 'Costine di Maiale Glassate al Miele di Castagno & Barbecue',
    category: 'piatti_pronti',
    sub_category: 'Cotti alla Brace',
    price: 16.50,
    original_price: 19.00,
    price_unit: 'porzione',
    portion: 'Porzione da 550g (slab da 5 costole carnose)',
    description: 'Cotte a bassa temperatura per 4 ore nel forno a legna e poi laccate sulla brace viva con la salsa miele e spezie segreta di Samanta. La carne si stacca dall\'osso da sola.',
    curator: 'Samanta',
    curator_note: 'Scaldare 3 minuti se ritirate da asporto, oppure gustare subito bollente.',
    cooking_time: '4 ore cottura lenta',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 2,
    frollatura_days: 0,
    allergens: JSON.stringify(['Sedano (nella salsa BBQ)', 'Senape']),
    ingredients: 'Costine di suino pesante emiliano, miele di castagno dei boschi, paprika dolce, salsa BBQ, spezie',
    tags: JSON.stringify(['Costine', 'Ribs', 'Miele', 'Goloso'])
  },
  {
    id: 'prod-suin-03',
    name: 'Salamella Emiliana con Semi di Finocchietto Selvatico',
    category: 'carne_fresca',
    sub_category: 'Suino Centese',
    price: 14.50,
    original_price: null,
    price_unit: 'kg',
    portion: 'Conf. da 4 pezzi da 130g',
    description: 'Impasto rustico a grana grossa profumato al finocchietto delle colline modenesi. Gusto balsamico e digeribile.',
    curator: 'Manuel',
    curator_note: 'Ottima aperta a libretto e scottata in mezzo a una piadina o pane caldo.',
    cooking_time: '10 min',
    is_ready_to_eat: false,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 2,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Carne di maiale emiliano, semi di finocchio, pepe, sale marino',
    tags: JSON.stringify(['Salamella', 'Finocchietto', 'Grigliata'])
  },
  {
    id: 'prod-suin-04',
    name: 'Spiedini Rustici Campagnoli Manuel (Coppa, Pancetta e Peperoni)',
    category: 'carne_fresca',
    sub_category: 'Suino Centese',
    price: 17.50,
    original_price: null,
    price_unit: 'kg',
    portion: 'Vassoio da 4 spiedoni (circa 700g)',
    description: 'Alternanza di bocconcini di coppa fresca di maiale, rotolini di pancetta arrotolata, salsiccia e verdure dell\'orto centese.',
    curator: 'Manuel',
    curator_note: 'Girare ogni 3 minuti sulla brace a media intensità.',
    cooking_time: '15 min',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 2,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Coppa suina, pancetta, salsiccia, peperone rosso e giallo, alloro',
    tags: JSON.stringify(['Spiedini', 'Misto', 'Famiglia'])
  },
  {
    id: 'prod-suin-05',
    name: 'Pancetta Tesa alla Brace con Crosta Croccante',
    category: 'piatti_pronti',
    sub_category: 'Cotti alla Brace',
    price: 12.00,
    original_price: null,
    price_unit: 'porzione',
    portion: 'Porzione da 300g affettata spessa',
    description: 'Fette spesse di pancetta di suino pesante cotte lentamente sulla griglia fino a rendere la cotenna croccantissima come una patatina e il cuore morbido.',
    curator: 'Manuel',
    curator_note: 'Da gustare con le nostre cipolline glassate all\'aceto balsamico.',
    cooking_time: '15 min',
    is_ready_to_eat: true,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 5,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Pancetta di suino nostrano, sale, rosmarino, alloro',
    tags: JSON.stringify(['Pancetta', 'Croccante', 'Brace'])
  },

  // 3. Agnello & Arrosticini
  {
    id: 'prod-agn-01',
    name: 'Arrosticini Artigianali Originali di Ovino (Pacco da 25 pezzi)',
    category: 'carne_fresca',
    sub_category: 'Agnello e Castrato',
    price: 21.00,
    original_price: 24.00,
    price_unit: 'pz',
    portion: '25 spiedini da 28g (totale ca. 700g)',
    description: 'I veri spiedini di carne ovina e tocchetti di grasso nobile intercalati a mano. Infilzati su stecco di faggio naturale.',
    curator: 'Manuel',
    curator_note: 'Cuocere sulla canalina o griglia ravvicinata con sale abbondante alla fine. Servire avvolti nella stagnola come da tradizione.',
    cooking_time: '5 min canalina',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 7,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: '100% Carne ovina selezionata',
    tags: JSON.stringify(['Arrosticini', 'Festa', 'Amici', 'Brace'])
  },
  {
    id: 'prod-agn-02',
    name: 'Arrosticini Extra Gourmet di Agnello e Fegato con Cipolla (15 pz)',
    category: 'carne_fresca',
    sub_category: 'Agnello e Castrato',
    price: 16.50,
    original_price: null,
    price_unit: 'pz',
    portion: '15 spiedini da 35g',
    description: 'Specialità per palati forti: alternanza di carne d\'agnello, fegatino fresco e foglia di cipolla ramata e alloro.',
    curator: 'Manuel',
    curator_note: 'Gusto deciso e avvolgente con profumo balsamico di alloro.',
    cooking_time: '6 min',
    is_ready_to_eat: false,
    is_popular: false,
    heat_scale: 2,
    frollatura_days: 5,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Carne di agnello, fegato ovino, cipolla ramata, alloro',
    tags: JSON.stringify(['Arrosticini', 'Fegato', 'Gourmet'])
  },
  {
    id: 'prod-agn-03',
    name: 'Costolette d\'Agnello Scottadito alla Griglia',
    category: 'piatti_pronti',
    sub_category: 'Cotti alla Brace',
    price: 19.50,
    original_price: 22.00,
    price_unit: 'porzione',
    portion: 'Porzione da 6 costolette rosolate',
    description: 'Le cotolette d\'agnello cotte sulla brace a fuoco vivace con timo, aglio e limone. Si mangiano rigorosamente con le dita caldissime.',
    curator: 'Manuel',
    curator_note: 'Spruzzare qualche goccia di limone fresco di Sorrento prima di mordere.',
    cooking_time: 'Espressa brace',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 10,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Costolette di agnello nazionale, olio EVO, timo, scorza di limone, aglio dolce',
    tags: JSON.stringify(['Agnello', 'Scottadito', 'Brace'])
  },

  // 4. Polli & Carni Bianche allo Spiedo
  {
    id: 'prod-pol-01',
    name: 'Pollo Ruspante Intero allo Spiedo su Legna di Rovere',
    category: 'piatti_pronti',
    sub_category: 'Polli e Carni Bianche',
    price: 14.50,
    original_price: 16.50,
    price_unit: 'pz',
    portion: 'Intero (circa 1.3 kg cotto)',
    description: 'Pollo ruspante allevato a terra con grani nobili, marinato con salvia, rosmarino e vino bianco e rosolato lentamente per 2 ore sul nostro girarrosto a legna dura.',
    curator: 'Samanta',
    curator_note: 'Pelle croccante e carne morbida e idratata fino all\'osso.',
    cooking_time: '2 ore allo spiedo',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Solfiti (nel vino della marinatura)']),
    ingredients: 'Pollo ruspante emiliano, sale, rosmarino, salvia, aglio, vino bianco, olio EVO',
    tags: JSON.stringify(['Pollo', 'Spiedo', 'Domenica', 'Caldo'])
  },
  {
    id: 'prod-pol-02',
    name: 'Galletto al Mattone Piccante alla Brace',
    category: 'piatti_pronti',
    sub_category: 'Polli e Carni Bianche',
    price: 13.00,
    original_price: null,
    price_unit: 'pz',
    portion: 'Intero aperto a libro (circa 600g)',
    description: 'Schiacciato con pietra refrattaria ardente sulla griglia per ottenere una doratura uniforme e croccantissima. Condito con olio al peperoncino calabrese e origano.',
    curator: 'Manuel',
    curator_note: 'Livello piccantezza medio-alto, perfetto con birra ambrata.',
    cooking_time: '15 min brace',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 4,
    frollatura_days: 0,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Galletto nostrano, olio EVO, peperoncino secco frantumato, paprika forte, sale marino',
    tags: JSON.stringify(['Galletto', 'Piccante', 'Mattone'])
  },
  {
    id: 'prod-pol-03',
    name: 'Alette di Pollo BBQ Speziata (Cestino da 10 pz)',
    category: 'piatti_pronti',
    sub_category: 'Polli e Carni Bianche',
    price: 10.50,
    original_price: null,
    price_unit: 'porzione',
    portion: '10 pezzi carnosi con salsa barbecue',
    description: 'Alette marinate con paprika dolce, aglio e salsa barbecue centese, arrostite alla brace.',
    curator: 'Samanta',
    curator_note: 'Ideali come antipasto sfizioso durante la partita o l\'aperitivo del venerdì.',
    cooking_time: '12 min',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 3,
    frollatura_days: 0,
    allergens: JSON.stringify(['Sedano', 'Senape']),
    ingredients: 'Ali di pollo, salsa BBQ, paprika, miele, spezie',
    tags: JSON.stringify(['Alette', 'Finger Food', 'BBQ'])
  },

  // 5. Gastronomia Calda di Samanta (Piatti Pronti)
  {
    id: 'prod-gas-01',
    name: 'Lasagne Tradizionali Centesi al Ragù di Scottona a Legna',
    category: 'piatti_pronti',
    sub_category: 'Primi Piatti Bottega',
    price: 9.50,
    original_price: 11.00,
    price_unit: 'porzione',
    portion: 'Porzione generosa da 420g',
    description: 'Sfoglia verde agli spinaci tirata al mattarello, besciamella fresca al burro di latteria e il leggendario ragù di carne di Scottona cotto 6 ore sulla stufa economica.',
    curator: 'Samanta',
    curator_note: 'La ricetta tramandata dalla nonna: con crosticina dorata e cuore morbidissimo.',
    cooking_time: 'Pronto, scaldare 3 min',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Glutine', 'Latte/Lattosio', 'Uova', 'Sedano (nel soffritto)']),
    ingredients: 'Farina di grano tenero, uova fresche, spinaci, polpa di scottona, pomodoro italiano, latte, burro, Parmigiano Reggiano 24 mesi',
    tags: JSON.stringify(['Lasagne', 'Ragù', 'Tradizione', 'Primo'])
  },
  {
    id: 'prod-gas-02',
    name: 'Cappelletti Artigianali al Ragù di Salsiccia e Funghi Porcini',
    category: 'piatti_pronti',
    sub_category: 'Primi Piatti Bottega',
    price: 11.50,
    original_price: 13.00,
    price_unit: 'porzione',
    portion: 'Porzione da 380g',
    description: 'I cappelletti centesi ripieni di carni nobili e parmigiano, conditi con il ragù bianco di salsiccia centese e funghi porcini trifolati.',
    curator: 'Samanta',
    curator_note: 'Spolverare abbondante Parmigiano Reggiano prima di servire.',
    cooking_time: 'Pronto caldo',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Glutine', 'Latte/Lattosio', 'Uova']),
    ingredients: 'Sfoglia all\'uovo, ripieno di carne, salsiccia centese, funghi porcini, burro, salvia',
    tags: JSON.stringify(['Cappelletti', 'Pasta Fresca', 'Porcini'])
  },
  {
    id: 'prod-gas-03',
    name: 'Melanzane alla Parmigiana nel Coccio di Terracotta',
    category: 'piatti_pronti',
    sub_category: 'Secondi e Piatti Unici',
    price: 8.50,
    original_price: null,
    price_unit: 'porzione',
    portion: 'Coccio monoporzione da 350g',
    description: 'Melanzane fritte asciutte, sugo di pomodoro fresco San Marzano al basilico, fior di latte filante e tanto parmigiano.',
    curator: 'Samanta',
    curator_note: 'Piatto vegetariano ricco e profumatissimo.',
    cooking_time: 'Pronto',
    is_ready_to_eat: true,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Latte/Lattosio', 'Glutine']),
    ingredients: 'Melanzane, pomodoro, mozzarella fior di latte, Parmigiano Reggiano, basilico, olio',
    tags: JSON.stringify(['Parmigiana', 'Vegetariano', 'Coccio'])
  },
  {
    id: 'prod-gas-04',
    name: 'Polpettone Rustico Farcito con Scamorza Affumicata e Speck',
    category: 'piatti_pronti',
    sub_category: 'Secondi e Piatti Unici',
    price: 10.50,
    original_price: null,
    price_unit: 'porzione',
    portion: '3 fette spesse (circa 320g)',
    description: 'Impasto saporito di manzo e maiale con cuore filante di scamorza affumicata cotta a legna e fettine di speck dell\'Alto Adige.',
    curator: 'Samanta',
    curator_note: 'Servito con il suo sughetto ristretto di cottura.',
    cooking_time: 'Pronto caldo',
    is_ready_to_eat: true,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Glutine', 'Latte/Lattosio', 'Uova']),
    ingredients: 'Carne macinata mista, scamorza, speck, uova, pane raffermo, parmigiano, spezie',
    tags: JSON.stringify(['Polpettone', 'Scamorza', 'Rustico'])
  },

  // 6. Contorni alla Brace
  {
    id: 'prod-con-01',
    name: 'Patate Novelle al Rosmarino & Lardo di Colonnata nel Forno a Legna',
    category: 'piatti_pronti',
    sub_category: 'Contorni della Bottega',
    price: 5.50,
    original_price: null,
    price_unit: 'porzione',
    portion: 'Vaschetta da 350g',
    description: 'Patatine tonde con buccia dorata e croccante, aromatizzate con rametti di rosmarino fresco di campo e un velo di lardo che si scioglie in cottura.',
    curator: 'Samanta',
    curator_note: 'Il contorno indispensabile per accompagnare la fiorentina e le salsicce.',
    cooking_time: 'Pronto caldo',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Patate novelle, rosmarino, aglio vestito, lardo di Colonnata IGP, olio EVO, sale marino',
    tags: JSON.stringify(['Patate', 'Rosmarino', 'Contorno'])
  },
  {
    id: 'prod-con-02',
    name: 'Verdure di Stagione Grigliate sulla Brace di Rovere',
    category: 'piatti_pronti',
    sub_category: 'Contorni della Bottega',
    price: 6.00,
    original_price: null,
    price_unit: 'porzione',
    portion: 'Vaschetta mista da 300g',
    description: 'Zucchine, melanzane striate, peperoni dolci e cipolle rosse grigliate sulla brace viva con emulsione di olio extravergine, origano e mentuccia.',
    curator: 'Samanta',
    curator_note: 'Leggere, profumate dal fumo di legno dolce.',
    cooking_time: 'Pronto',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Zucchine, melanzane, peperoni, cipolla rossa, olio EVO, origano',
    tags: JSON.stringify(['Verdure', 'Grigliate', 'Sano'])
  },
  {
    id: 'prod-con-03',
    name: 'Friggione Emiliano Tradizionale con Pomodori e Cipolle Dorate',
    category: 'piatti_pronti',
    sub_category: 'Contorni della Bottega',
    price: 6.50,
    original_price: null,
    price_unit: 'porzione',
    portion: 'Vaschetta da 280g',
    description: 'La celebre salsa/contorno emiliana a base di cipolle dolci appassite per 3 ore nello strutto e stufate con pomodoro fresco pelato.',
    curator: 'Samanta',
    curator_note: 'Spalmatelo sopra una fetta di carne alla brace o su pane bruschettato: sublime.',
    cooking_time: 'Pronto',
    is_ready_to_eat: true,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Nessuno']),
    ingredients: 'Cipolle dorate nostrane, pomodoro pelato, strutto fresco, sale, pizzico di zucchero',
    tags: JSON.stringify(['Friggione', 'Tradizione', 'Emilia'])
  },
  {
    id: 'prod-con-04',
    name: 'Cipolline Borettane all\'Aceto Balsamico Tradizionale di Modena IGP',
    category: 'gastronomia_vini',
    sub_category: 'Sottoli & Dispensa',
    price: 6.50,
    original_price: null,
    price_unit: 'pz',
    portion: 'Vasetto in vetro da 310g',
    description: 'Cipolline piatte dolcissime glassate con vero Aceto Balsamico di Modena IGP. Acidità gentile e perfetta armonia.',
    curator: 'Samanta',
    curator_note: 'Puliscono il palato magnificamente tra un boccone di carne grassa e l\'altro.',
    cooking_time: 'Pronto',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Solfiti (nell\'aceto balsamico)']),
    ingredients: 'Cipolle borettane, Aceto Balsamico di Modena IGP, zucchero, olio EVO',
    tags: JSON.stringify(['Cipolle', 'Balsamico', 'Dispensa'])
  },

  // 7. Salse Artigianali di Samanta
  {
    id: 'prod-sal-01',
    name: 'Salsa Chimichurri Fresca Emiliana di Samanta',
    category: 'gastronomia_vini',
    sub_category: 'Salse Artigianali',
    price: 4.50,
    original_price: null,
    price_unit: 'pz',
    portion: 'Vasetto fresco da 150g',
    description: 'Prezzemolo fresco, aglio di Voghiera DOP, origano selvatico, peperoncino dolce e aceto di vino con olio EVO dei colli.',
    curator: 'Samanta',
    curator_note: 'Da versare generosamente sopra la tagliata, la picanha o il diaframma.',
    cooking_time: 'Pronto freddo',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 2,
    frollatura_days: 0,
    allergens: JSON.stringify(['Solfiti']),
    ingredients: 'Prezzemolo, aglio DOP, olio EVO, origano, aceto di vino, peperoncino, sale',
    tags: JSON.stringify(['Chimichurri', 'Salsa', 'Fresco'])
  },
  {
    id: 'prod-sal-02',
    name: 'Salsa Barbecue Artigianale Affumicata a Legna di Melo',
    category: 'gastronomia_vini',
    sub_category: 'Salse Artigianali',
    price: 5.00,
    original_price: null,
    price_unit: 'pz',
    portion: 'Bottiglietta in vetro da 220g',
    description: 'Ricetta esclusiva della bottega: pomodoro ridotto a fuoco lento, miele millefiori locale, fumo liquido naturale da melo e un tocco di senape antica.',
    curator: 'Samanta',
    curator_note: 'Ideale per costine di maiale, hamburger e pollo alla brace.',
    cooking_time: 'Pronto',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 2,
    frollatura_days: 0,
    allergens: JSON.stringify(['Sedano', 'Senape']),
    ingredients: 'Passata di pomodoro, miele, aceto di mele, fumo naturale, senape, spezie',
    tags: JSON.stringify(['BBQ', 'Affumicato', 'Salsa'])
  },

  // 8. Vini, Birre & Cestini Barbecue Completi
  {
    id: 'prod-box-01',
    name: 'Cestino Barbecue "La Festa del Guercino" (4-5 Persone)',
    category: 'cestini_box',
    sub_category: 'Cestini Barbecue',
    price: 58.00,
    original_price: 68.00,
    price_unit: 'pz',
    portion: 'Box completa con carne, contorni, salsa e vino',
    description: 'Il nostro best seller del weekend per le famiglie di Cento: include 1 Costata di Scottona 30gg (850g), 8 Salsicce centesi a nastro (1kg), 15 Arrosticini ovini, 1 vassoio di Patate novelle al rosmarino, 1 vasetto di Salsa BBQ di Samanta e 1 Bottiglia di Lambrusco Grasparossa DOC.',
    curator: 'Entrambi',
    curator_note: 'Tutto porzionato sottovuoto e sigillato, pronto per essere acceso sul braciere di casa senza pensieri.',
    cooking_time: 'Pronto da grigliare',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 30,
    allergens: JSON.stringify(['Solfiti (nel vino)', 'Sedano e Senape (nella salsa)']),
    ingredients: 'Scottona, maiale centese, agnello, patate, condimenti, vino DOC',
    tags: JSON.stringify(['Cestino', 'Box Completa', 'Offerta', 'Famiglia', 'Weekend'])
  },
  {
    id: 'prod-box-02',
    name: 'Cestino Coppia Romantica "Fiorentina & Sangiovese Superiore"',
    category: 'cestini_box',
    sub_category: 'Cestini Barbecue',
    price: 49.00,
    original_price: 55.00,
    price_unit: 'pz',
    portion: 'Per 2 persone',
    description: 'Comprende 1 Fiorentina di Scottona da 1.1kg frollata 45gg, 1 contorno di Patate con lardo, 1 Tartare battuta al coltello per antipasto e 1 bottiglia di Sangiovese di Romagna Superiore DOC.',
    curator: 'Entrambi',
    curator_note: 'La cena perfetta per celebrare un anniversario o una serata speciale a casa.',
    cooking_time: 'Pronto da cuocere',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 45,
    allergens: JSON.stringify(['Uova (nella tartare)', 'Solfiti (nel vino)']),
    ingredients: 'Fiorentina bovina, tartare battuta, patate, vino Sangiovese DOC',
    tags: JSON.stringify(['Coppia', 'Fiorentina', 'Romantico', 'Vino'])
  },
  {
    id: 'prod-box-03',
    name: 'Cestino Arrosticini Party & Birra Artigianale (50 Pezzi)',
    category: 'cestini_box',
    sub_category: 'Cestini Barbecue',
    price: 44.00,
    original_price: 50.00,
    price_unit: 'pz',
    portion: '50 arrosticini + 2 bottiglie birra artigianale 75cl',
    description: '50 arrosticini ovini originali infilzati su stecco, sale alle erbe di bottega e 2 bottiglie da 75cl di Birra Artigianale Ambrata Centese.',
    curator: 'Manuel',
    curator_note: 'Dedicato a chi ama la brace in compagnia con amici e birra ghiacciata.',
    cooking_time: '5 min',
    is_ready_to_eat: false,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 7,
    allergens: JSON.stringify(['Glutine (nella birra artigianale)']),
    ingredients: 'Carne ovina, birra artigianale con malto d\'orzo, sale aromatizzato',
    tags: JSON.stringify(['Arrosticini', 'Birra', 'Party', 'Amici'])
  },
  {
    id: 'prod-vin-01',
    name: 'Lambrusco Grasparossa di Castelvetro DOC Tenuta Centese',
    category: 'gastronomia_vini',
    sub_category: 'Vini & Bevande',
    price: 9.00,
    original_price: null,
    price_unit: 'pz',
    portion: 'Bottiglia 750ml',
    description: 'Rosso frizzante violaceo, spuma cremosa, profumo di more selvatiche e tannino pulito che sgrassa meravigliosamente la brace.',
    curator: 'Samanta',
    curator_note: 'Servire fresco a 12-14°C.',
    cooking_time: 'Servire fresco',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Solfiti']),
    ingredients: '100% Uve Lambrusco Grasparossa DOC, contiene solfiti',
    tags: JSON.stringify(['Lambrusco', 'Vino', 'Tipico', 'Frizzante'])
  },
  {
    id: 'prod-vin-02',
    name: 'Sangiovese di Romagna Superiore DOC Riserva Bottega',
    category: 'gastronomia_vini',
    sub_category: 'Vini & Bevande',
    price: 13.50,
    original_price: null,
    price_unit: 'pz',
    portion: 'Bottiglia 750ml',
    description: 'Vino rosso fermo strutturato affinato in botte di rovere. Note di ciliegia matura, cuoio e vaniglia. Il compagno sacro della Fiorentina.',
    curator: 'Manuel',
    curator_note: 'Stappare mezz\'ora prima di versare nei calici ampi.',
    cooking_time: 'Temperatura ambiente',
    is_ready_to_eat: true,
    is_popular: true,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Solfiti']),
    ingredients: 'Uve Sangiovese 100%, contiene solfiti',
    tags: JSON.stringify(['Sangiovese', 'Rosso Fermo', 'Riserva'])
  },
  {
    id: 'prod-vin-03',
    name: 'Birra Artigianale Centese "Rovere" Ambrata da Brace 75cl',
    category: 'gastronomia_vini',
    sub_category: 'Vini & Bevande',
    price: 7.50,
    original_price: null,
    price_unit: 'pz',
    portion: 'Bottiglia 750ml con tappo a corona',
    description: 'Birra cruda non pastorizzata brassata con malti tostati su legno di rovere. Corpo rotondo e retrogusto caramellato che esalta la carne affumicata.',
    curator: 'Manuel',
    curator_note: 'Gradazione 6.2% vol. Schiuma compatta e persistente.',
    cooking_time: 'Servire a 8°C',
    is_ready_to_eat: true,
    is_popular: false,
    heat_scale: 1,
    frollatura_days: 0,
    allergens: JSON.stringify(['Glutine']),
    ingredients: 'Acqua, malto d\'orzo tostato, luppolo emiliano, lievito naturale',
    tags: JSON.stringify(['Birra', 'Artigianale', 'Ambrata'])
  }
];

// Helper to generate additional realistic products up to 220+ products across all categories
const CATEGORY_TEMPLATES = [
  { prefix: 'Tagliata di Scottona', cat: 'carne_fresca', sub: 'Bovino Scottona', basePrice: 28, unit: 'kg', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '8 min brace' },
  { prefix: 'Costata Selezionata', cat: 'carne_fresca', sub: 'Bovino Scottona', basePrice: 31, unit: 'kg', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '12 min brace' },
  { prefix: 'Bistecca con Osso Frollata', cat: 'carne_fresca', sub: 'Bovino Scottona', basePrice: 34, unit: 'kg', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '14 min brace' },
  { prefix: 'Salsiccia Fresca Artigianale', cat: 'carne_fresca', sub: 'Suino Centese', basePrice: 13.5, unit: 'kg', heat: 2, curator: 'Manuel', allergens: ['Solfiti'], time: '10 min brace' },
  { prefix: 'Braciola di Maiale Brado', cat: 'carne_fresca', sub: 'Suino Centese', basePrice: 15, unit: 'kg', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '10 min brace' },
  { prefix: 'Bombette di Lonza Emiliane', cat: 'carne_fresca', sub: 'Suino Centese', basePrice: 18.5, unit: 'kg', heat: 2, curator: 'Manuel', allergens: ['Latte/Lattosio'], time: '12 min' },
  { prefix: 'Arrosticini Rustici', cat: 'carne_fresca', sub: 'Agnello e Castrato', basePrice: 19.5, unit: 'pz', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '5 min' },
  { prefix: 'Spiedini d\'Agnello al Timo', cat: 'carne_fresca', sub: 'Agnello e Castrato', basePrice: 22, unit: 'kg', heat: 1, curator: 'Manuel', allergens: ['Nessuno'], time: '8 min' },
  { prefix: 'Pollo Marinato alla Brace', cat: 'piatti_pronti', sub: 'Polli e Carni Bianche', basePrice: 12.5, unit: 'pz', heat: 2, curator: 'Samanta', allergens: ['Nessuno'], time: 'Pronto caldo' },
  { prefix: 'Cosce di Pollo al Forno a Legna', cat: 'piatti_pronti', sub: 'Polli e Carni Bianche', basePrice: 8.5, unit: 'porzione', heat: 1, curator: 'Samanta', allergens: ['Nessuno'], time: 'Pronto' },
  { prefix: 'Pasta al Forno della Bottega', cat: 'piatti_pronti', sub: 'Primi Piatti Bottega', basePrice: 9.0, unit: 'porzione', heat: 1, curator: 'Samanta', allergens: ['Glutine', 'Latte/Lattosio', 'Uova'], time: 'Pronto' },
  { prefix: 'Spezzatino Tradizionale con Polenta', cat: 'piatti_pronti', sub: 'Secondi e Piatti Unici', basePrice: 12.0, unit: 'porzione', heat: 1, curator: 'Samanta', allergens: ['Sedano'], time: 'Pronto' },
  { prefix: 'Contorno di Verdure al Coccio', cat: 'piatti_pronti', sub: 'Contorni della Bottega', basePrice: 5.5, unit: 'porzione', heat: 1, curator: 'Samanta', allergens: ['Nessuno'], time: 'Pronto' },
  { prefix: 'Salsa Artigianale in Vaso', cat: 'gastronomia_vini', sub: 'Salse Artigianali', basePrice: 4.8, unit: 'pz', heat: 2, curator: 'Samanta', allergens: ['Senape'], time: 'Pronto' },
  { prefix: 'Vino Tipico dei Colli Centesi', cat: 'gastronomia_vini', sub: 'Vini & Bevande', basePrice: 11.0, unit: 'pz', heat: 1, curator: 'Samanta', allergens: ['Solfiti'], time: 'Pronto' },
  { prefix: 'Cestino Grigliata Speciale', cat: 'cestini_box', sub: 'Cestini Barbecue', basePrice: 45.0, unit: 'pz', heat: 1, curator: 'Entrambi', allergens: ['Solfiti'], time: 'Pronto da cuocere' }
];

const FLAVOR_VARIATIONS = [
  'al Rosmarino & Salvia di Campo',
  'al Ginepro & Pepe Nero della Valle',
  'con Aceto Balsamico Tradizionale di Modena',
  'con Aglio Dolce di Voghiera DOP',
  'alla Birra Artigianale Ambrata',
  'con Erbe Aromatiche Centesi',
  'al Lambrusco Grasparossa Ristretto',
  'al Sale Dolce di Cervia e Pepe Rosa',
  'Speziato al Fuoco di Rovere',
  'Marinatura Rustica all\'Olio EVO Nostrano',
  'Frollatura Speciale Riserva Bottega',
  'con Tartufo Nero Estivo dei Colli',
  'Glassato al Miele Millefiori e Senape',
  'Affumicato alle Erbe di Fiume'
];

// Generate extra products to exceed 220 total items
export const ALL_SQL_PRODUCTS: SqlProduct[] = [...INITIAL_SQL_PRODUCTS];

let itemCounter = INITIAL_SQL_PRODUCTS.length + 1;
for (let t = 0; t < CATEGORY_TEMPLATES.length; t++) {
  const tmpl = CATEGORY_TEMPLATES[t];
  for (let f = 0; f < FLAVOR_VARIATIONS.length; f++) {
    const variation = FLAVOR_VARIATIONS[f];
    const id = `prod-ext-${itemCounter.toString().padStart(3, '0')}`;
    const priceVariance = (f * 1.5) % 8;
    const finalPrice = Number((tmpl.basePrice + priceVariance).toFixed(2));
    const heatScale = ((f % 4) + 1);

    ALL_SQL_PRODUCTS.push({
      id,
      name: `${tmpl.prefix} ${variation}`,
      category: tmpl.cat as any,
      sub_category: tmpl.sub,
      price: finalPrice,
      original_price: f % 4 === 0 ? Number((finalPrice * 1.15).toFixed(2)) : null,
      price_unit: tmpl.unit,
      portion: tmpl.unit === 'kg' ? 'Taglio al peso ca. 750g - 1kg' : tmpl.unit === 'pz' ? 'Pezzo singolo confezionato' : 'Porzione singola da 350g',
      description: `Specialità della bottega di Cento: ${tmpl.prefix.toLowerCase()} preparato secondo antica tradizione con ingredienti selezionati da ${tmpl.curator}. Note aromatiche di ${variation.toLowerCase()}.`,
      curator: tmpl.curator as any,
      curator_note: `Consigliato da ${tmpl.curator}: cottura controllata su brace viva di rovere o pronto caldo per la tavola.`,
      cooking_time: tmpl.time,
      is_ready_to_eat: tmpl.cat === 'piatti_pronti',
      is_popular: f % 3 === 0,
      heat_scale: heatScale,
      frollatura_days: tmpl.cat === 'carne_fresca' ? 20 + ((f * 5) % 40) : 0,
      allergens: JSON.stringify(tmpl.allergens),
      ingredients: `Ingredienti primari selezionati per ${tmpl.prefix}, aromi naturali di ${variation}, olio EVO, sale marino`,
      tags: JSON.stringify([tmpl.sub, tmpl.curator, 'Bottega Cento', 'Qualità'])
    });
    itemCounter++;
  }
}
