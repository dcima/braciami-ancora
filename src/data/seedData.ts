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
  // --- AMMINISTRATORI REALI (Cento FE) ---
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
    password: 'braciami25',
    telefono: '+39 347 1234567',
    note: 'Amministratore di sistema e gestione vendite e-commerce',
    tipo_utente: 1,
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
    password: 'braciami25',
    telefono: '+39 348 7654321',
    note: 'Titolare bottega, coordinatrice cucina calda e banco gastronomia',
    tipo_utente: 1,
    punti_fedelta: 880,
    totale_speso: 1200.0,
    numero_ordini: 15,
    is_otp_guest: false,
    createdAt: '2025-01-10T09:00:00Z'
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
export const SEED_ORDERS: Order[] = [];

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
export const SEED_ORDER_HEADERS: OrderHeader[] = [];

/**
 * 8. DETTAGLI DEGLI ORDINI (order_detail)
 * Campi: id_dettaglio, id_ordine, id_prodotto, quantità, importo_euro, importo_valuta_cliente, codice_sconto, codice_promozione, note
 */
export const SEED_ORDER_DETAILS: OrderDetail[] = [];

/**
 * 9. MESSAGGI E COMUNICAZIONI CICLO DI VITA ORDINE (order_message)
 */
export const SEED_ORDER_MESSAGES: OrderMessage[] = [];

/**
 * 10. LOG EMAIL TRANSAZIONALI ORDINE (order_email)
 */
export const SEED_ORDER_EMAILS: OrderEmailLog[] = [];

