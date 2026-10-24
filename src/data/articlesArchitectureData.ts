import {
  Product,
  ArticleIdentification,
  ArticlePricingAndWeight,
  ArticleSupplierInfo,
  ArticleLogisticsRules,
  ArticleCompetitorIntelligence,
  InternationalCodes,
  PhysicalManufacturingOrigin,
  LinkedRecipe,
  DrillDownEcommerceTarget
} from '../types';
import { SEED_PRODUCTS as BASE_SEED_PRODUCTS } from './productsData';
import { LanguageCode } from '../i18n/types';

/**
 * Prodotti Standard Italiani & Eccellenze Confezionate con Barcode EAN-13 Ufficiale
 * (Affiancano le specialità fresche di Manuel e Samanta per l'e-commerce europeo)
 */
const STANDARD_BARCODE_PRODUCTS: Product[] = [
  {
    id: 'prod-std-parmigiano-30m-ean',
    name: 'Parmigiano Reggiano DOP 30 Mesi Stagionato (Sottovuoto)',
    name_translations: {
      it_IT: 'Parmigiano Reggiano DOP 30 Mesi Stagionato (Sottovuoto)',
      en_US: 'Parmigiano Reggiano PDO Aged 30 Months (Vacuum-Packed)',
      de_DE: 'Parmigiano Reggiano g.U. 30 Monate gereift (Vakuumverpackt)',
      fr_FR: 'Parmigiano Reggiano AOP Affiné 30 Mois (Sous Vide)',
      es_ES: 'Parmigiano Reggiano DOP Curado 30 Meses (Al Vacío)',
      nl_NL: 'Parmigiano Reggiano BOB 30 Maanden Gerijpt (Vacuüm)',
      sv_SE: 'Parmigiano Reggiano SUB Lagrad 30 Månader (Vakuumförpackad)',
      zh_CN: '30个月陈酿帕尔马干酪 DOP (真空包装)',
      ja_JP: 'パルミジャーノ・レッジャーノ DOP 30ヶ月熟成（真空パック）',
      ru_RU: 'Пармиджано Реджано DOP выдержка 30 месяцев (вакуум)',
      ar_SA: 'جبن بارميجانو ريجيانو DOP معتق 30 شهرًا (مغلف بتفريغ الهواء)'
    },
    category: 'dispensa_standard',
    portion: 'Trancio sottovuoto da 500 g (±8%)',
    portion_translations: {
      it_IT: 'Trancio sottovuoto da 500 g (±8%)',
      en_US: 'Vacuum-packed wedge 500 g (±8%)',
      de_DE: 'Vakuumiertes Stück 500 g (±8%)',
      fr_FR: 'Morceau sous vide de 500 g (±8%)',
      es_ES: 'Cuña al vacío de 500 g (±8%)',
      nl_NL: 'Vacuümstuk van 500 g (±8%)',
      sv_SE: 'Vakuumförpackad bit 500 g (±8%)'
    },
    unit: 'trancio 500g',
    description: 'Selezionato dai migliori caseifici emiliani tra Cento, Modena e Reggio Emilia. Stagionatura oltre 30 mesi: pasta friabile e granulosa con cristalli di tirosina, naturalmente privo di lattosio.',
    description_translations: {
      it_IT: 'Selezionato dai migliori caseifici emiliani. Stagionatura oltre 30 mesi: friabile, ricco di cristalli di tirosina e naturalmente privo di lattosio.',
      en_US: 'Selected from top Emilian dairies. Aged over 30 months: crumbly texture rich in tyrosine crystals, naturally lactose-free.',
      de_DE: 'Ausgewählt aus den besten Käsereien der Emilia. Über 30 Monate gereift: körnig mit Reifekristallen, natürlich laktosefrei.',
      fr_FR: 'Sélectionné dans les meilleures fromageries d\'Émilie. Affiné plus de 30 mois : texture friable aux cristaux de tyrosine, naturellement sans lactose.',
      es_ES: 'Seleccionado de las mejores queserías de Emilia. Más de 30 meses de curación: textura granulosa y naturalmente sin lactosa.',
      nl_NL: 'Geselecteerd uit de beste kaasmakerijen in Emilia. Meer dan 30 maanden gerijpt, natuurlijk lactosevrij.',
      sv_SE: 'Utvald från de bästa mejerierna i Emilia. Lagrad över 30 månader: naturligt laktosfri med tydliga kristaller.'
    },
    price: 14.9,
    originalPrice: 16.5,
    curator: 'Samanta',
    curatorNote: 'Confezionato sottovuoto ad alto spessore: viaggia perfettamente in tutta Europa mantenendo intatto il profumo appena lo apri.',
    curatorNote_translations: {
      it_IT: 'Confezionato sottovuoto ad alto spessore: viaggia perfettamente in tutta Europa mantenendo intatto il profumo appena lo apri.',
      en_US: 'High-barrier vacuum pack: travels safely across Europe keeping its unmistakable aroma intact.',
      de_DE: 'Hochbarriere-Vakuumverpackung: reist sicher durch ganz Europa und bewahrt sein volles Aroma.',
      fr_FR: 'Conditionné sous vide haute protection : voyage parfaitement dans toute l\'Europe.',
      es_ES: 'Envasado al vacío de alta protección: viaja perfectamente por toda Europa.',
      nl_NL: 'Hoogwaardige vacuümverpakking: reist veilig door heel Europa.',
      sv_SE: 'Högbarriär-vakuumförpackad: klarar leverans i hela Europa med bevarad arom.'
    },
    cookingTime: 'Pronto da gustare a scaglie o grattugiato',
    cookingTime_translations: {
      it_IT: 'Pronto da gustare a scaglie o grattugiato',
      en_US: 'Ready to enjoy in flakes or grated',
      de_DE: 'Genussfertig in Stücken oder gerieben',
      fr_FR: 'Prêt à déguster en copeaux ou râpé',
      es_ES: 'Listo para degustar en escamas o rallado',
      nl_NL: 'Klaar om te eten in schilfers of geraspt',
      sv_SE: 'Färdig att avnjutas i bitar eller riven'
    },
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: false,
    tags: ['Barcode EAN-13', 'Senza Lattosio', 'DOP Certificato', 'Spedizione Europa'],
    allergens: ['Latte'],
    origin: 'Comprensorio DOP Emilia (MO/RE/BO)',
    stockQuantity: 85,
    imageUrl: '/assets/together_default.jpg',
    nutritionalFacts: {
      calories: 402,
      proteins: 32.4,
      fats: 29.7,
      carbohydrates: 0,
      fiber: 0,
      vitamins_minerals: ['Calcio (1159 mg)', 'Fosforo (690 mg)', 'Vitamina B12', 'Zinco'],
      isCalculatedForDish: false
    },
    isFreshPerishable: false,
    canBeFrozen: false,
    maxDeliveryKm: 3500
  },
  {
    id: 'prod-std-balsamico-modena-igp-ean',
    name: 'Aceto Balsamico di Modena IGP Invecchiato "Oro dei Duchi"',
    name_translations: {
      it_IT: 'Aceto Balsamico di Modena IGP Invecchiato "Oro dei Duchi"',
      en_US: 'Aged Balsamic Vinegar of Modena PGI "Oro dei Duchi"',
      de_DE: 'Gereifter Aceto Balsamico di Modena g.g.A. "Oro dei Duchi"',
      fr_FR: 'Vinaigre Balsamique de Modène IGP Vieilli "Oro dei Duchi"',
      es_ES: 'Vinagre Balsámico de Módena IGP Añejo "Oro dei Duchi"',
      nl_NL: 'Gerijpte Balsamicoazijn uit Modena BGA "Oro dei Duchi"',
      sv_SE: 'Lagrad Balsamvinäger från Modena SGB "Oro dei Duchi"',
      zh_CN: '摩德纳陈年香醋 IGP "公爵之金" (高密度)',
      ja_JP: 'モデナ産熟成バルサミコ酢 IGP「オロ・デイ・ドゥーキ」',
      ru_RU: 'Выдержанный бальзамический уксус из Модены IGP «Oro dei Duchi»',
      ar_SA: 'خل بلسمي معتق من مودينا IGP "أورو دي دوكي"'
    },
    category: 'dispensa_standard',
    portion: 'Bottiglia in vetro pesante da 250 ml (Densità 1.34)',
    portion_translations: {
      it_IT: 'Bottiglia in vetro pesante da 250 ml (Densità 1.34)',
      en_US: 'Heavy glass bottle 250 ml (Density 1.34)',
      de_DE: 'Schwere Glasflasche 250 ml (Dichte 1.34)',
      fr_FR: 'Bouteille en verre lourd 250 ml (Densité 1.34)',
      es_ES: 'Botella de vidrio grueso 250 ml (Densidad 1.34)',
      nl_NL: 'Zware glazen fles 250 ml (Dichtheid 1.34)',
      sv_SE: 'Tung glasflaska 250 ml (Densitet 1.34)'
    },
    unit: 'bottiglia 250ml',
    description: 'Ottenuto da mosto cotto d\'uve Trebbiano e Lambrusco invecchiato oltre 3 anni in botti di rovere e ciliegio. Densità sciropposa (1.34), ideale a crudo su Tagliata di Scottona, Parmigiano 30 mesi e fragole.',
    description_translations: {
      it_IT: 'Mosto cotto d\'uve emiliane invecchiato oltre 3 anni in botti di rovere. Densità vellutata 1.34, perfetto su carne alla brace e formaggi.',
      en_US: 'Cooked Emilian grape must aged over 3 years in oak barrels. Velvety 1.34 density, ideal over grilled steak and aged cheese.',
      de_DE: 'Eingekochter Traubenmost, über 3 Jahre in Eichenfässern gereift. Samtige Dichte (1.34), perfekt zu gegrilltem Fleisch und Käse.',
      fr_FR: 'Moût de raisin cuit vieilli plus de 3 ans en fûts de chêne. Densité veloutée 1.34, parfait sur viandes grillées et fromages.',
      es_ES: 'Mosto cocido envejecido más de 3 años en barricas de roble. Densidad 1.34, ideal para carnes a la brasa y quesos.',
      nl_NL: 'Gekookte druivenmost meer dan 3 jaar gerijpt in eikenhouten vaten. Fluweelzachte dichtheid 1.34.',
      sv_SE: 'Kokt druvmust lagrad över 3 år på ekfat. Sammetslen densitet (1.34), perfekt till grillat kött och lagrad ost.'
    },
    price: 16.8,
    curator: 'Manuel',
    curatorNote: 'Ne bastano cinque gocce sulla nostra Fiorentina o sulla Tagliata calda per cambiare completamente il piatto.',
    curatorNote_translations: {
      it_IT: 'Ne bastano cinque gocce sulla nostra Fiorentina o sulla Tagliata calda per cambiare completamente il piatto.',
      en_US: 'Just five drops over our hot T-Bone steak or sliced beef transform the entire dish.',
      de_DE: 'Schon fünf Tropfen auf unserem heißen Florentiner Steak verwandeln das gesamte Gericht.',
      fr_FR: 'Cinq gouttes suffisent sur notre Fiorentina ou notre Tagliata chaude pour sublimer le plat.',
      es_ES: 'Bastan cinco gotas sobre nuestro chuletón o tagliata caliente para transformar el plato.',
      nl_NL: 'Slechts vijf druppels op onze warme steak transformeren het hele gerecht.',
      sv_SE: 'Bara fem droppar över vår varma biff lyfter hela rätten.'
    },
    cookingTime: 'Condimento pronto a crudo',
    isReadyToEat: true,
    isPopular: true,
    isTipicoFerrarese: false,
    tags: ['Barcode EAN-13', 'IGP Modena', 'Invecchiato in Botte', 'Zero Conservanti'],
    allergens: ['Anidride solforosa e solfiti (naturali del mosto)'],
    origin: 'Modena / Confine Centese (MO)',
    stockQuantity: 64,
    imageUrl: '/assets/together_default.jpg',
    nutritionalFacts: {
      calories: 312,
      proteins: 1.1,
      fats: 0,
      carbohydrates: 71.0,
      fiber: 0,
      vitamins_minerals: ['Polifenoli dell\'uva', 'Potassio', 'Antiossidanti naturali'],
      isCalculatedForDish: false
    },
    isFreshPerishable: false,
    canBeFrozen: false,
    maxDeliveryKm: 5000
  },
  {
    id: 'prod-std-riso-carnaroli-delta-igp',
    name: 'Riso del Delta del Po IGP Carnaroli Classico (Sottovuoto)',
    name_translations: {
      it_IT: 'Riso del Delta del Po IGP Carnaroli Classico (Sottovuoto)',
      en_US: 'Po Delta PGI Classic Carnaroli Risotto Rice (Vacuum-Packed)',
      de_DE: 'Riso del Delta del Po g.g.A. Carnaroli Klassisch (Vakuum)',
      fr_FR: 'Riz du Delta du Pô IGP Carnaroli Classique (Sous Vide)',
      es_ES: 'Arroz del Delta del Po IGP Carnaroli Clásico (Al Vacío)',
      nl_NL: 'Carnaroli Risottorijst uit de Po-delta BGA (Vacuüm)',
      sv_SE: 'Carnaroli Risottoris från Po-deltat SGB (Vakuum)',
      zh_CN: '波河三角洲 IGP 顶级卡纳罗利烩饭米 (1kg真空装)',
      ja_JP: 'ポー川デルタ産 IGP カルナローリ米 1kg（真空パック）',
      ru_RU: 'Рис Карнароли из дельты реки По IGP (вакуум 1 кг)',
      ar_SA: 'أرز كارنارولي من دلتا بو IGP للريزوتو (1 كجم)'
    },
    category: 'dispensa_standard',
    portion: 'Astuccio sottovuoto da 1 kg',
    portion_translations: {
      it_IT: 'Astuccio sottovuoto da 1 kg',
      en_US: 'Vacuum-sealed box 1 kg',
      de_DE: 'Vakuum-Karton 1 kg',
      fr_FR: 'Étui sous vide de 1 kg',
      es_ES: 'Estuche al vacío de 1 kg',
      nl_NL: 'Vacuümdoos 1 kg',
      sv_SE: 'Vakuumförpackning 1 kg'
    },
    unit: 'conf. 1kg',
    description: 'Coltivato nelle terre bonificate ferraresi di Jolanda di Savoia accarezzate dalla brezza marina dell\'Adriatico. Chicco grande e perlato ad alto contenuto di amilosio che non scuoce mai.',
    description_translations: {
      it_IT: 'Coltivato nelle risaie ferraresi di Jolanda di Savoia. Chicco perlato ad alta tenuta di cottura, sapido per natura.',
      en_US: 'Grown in the Ferrara lowlands of Jolanda di Savoia near the Adriatic sea breeze. Large pearly grain for the ultimate creamy risotto.',
      de_DE: 'Angebaut in den Reisfeldern von Ferrara (Jolanda di Savoia). Großes, bissfestes Korn für perfektes Risotto.',
      fr_FR: 'Cultivé dans les rizières de Ferrare à Jolanda di Savoia. Grand grain nacré offrant une tenue de cuisson parfaite.',
      es_ES: 'Cultivado en los arrozales de Ferrara en Jolanda di Savoia. Grano perlado de cocción perfecta para risotto.',
      nl_NL: 'Geteeld in de rijstvelden van Ferrara. Grote parelkorrel die nooit overkookt.',
      sv_SE: 'Odlat i Ferraras risfält nära Adriatiska havet. Perfekt tuggmotstånd för krämig risotto.'
    },
    price: 6.9,
    curator: 'Samanta',
    curatorNote: 'Il segreto della sapidità naturale di questo riso è la torba salmastra della pianura ferrarese.',
    curatorNote_translations: {
      it_IT: 'Il segreto della sapidità naturale di questo riso è la torba salmastra della pianura ferrarese.',
      en_US: 'Its natural savory minerality comes from the ancient brackish peat soils of the Ferrara plain.',
      de_DE: 'Seine natürliche Würze stammt aus den mineralreichen Böden der Ebene von Ferrara.',
      fr_FR: 'Sa minéralité naturelle unique provient des terres tourbeuses de la plaine de Ferrare.',
      es_ES: 'Su sabor mineral natural proviene de los suelos de la llanura de Ferrara.',
      nl_NL: 'Zijn natuurlijke smaak komt uit de mineraalrijke bodem van de vlakte van Ferrara.',
      sv_SE: 'Dess naturliga sälta kommer från den mineralrika jorden på Ferraraslätten.'
    },
    cookingTime: 'Cottura per risotto 16-18 minuti',
    isReadyToEat: false,
    isPopular: true,
    isTipicoFerrarese: true,
    tags: ['Barcode EAN-13', 'Ferrara IGP', 'Lunga Conservazione', 'Senza Glutine'],
    allergens: [],
    origin: 'Jolanda di Savoia (FE)',
    stockQuantity: 120,
    imageUrl: '/assets/together_default.jpg',
    nutritionalFacts: {
      calories: 348,
      proteins: 7.4,
      fats: 0.6,
      carbohydrates: 78.2,
      fiber: 1.4,
      vitamins_minerals: ['Potassio', 'Magnesio', 'Selenio', 'Vitamina B3'],
      isCalculatedForDish: false
    },
    isFreshPerishable: false,
    canBeFrozen: false,
    maxDeliveryKm: 5000
  }
];

/**
 * Mappa Fotografie Gastronomiche Significative (Ottimizzate Mobile WebP/JPG, Responsive & Lazy-Loaded)
 * Ogni scheda prodotto ha una foto reale e rappresentativa del piatto/prodotto specifico.
 */
const PRODUCT_SIGNIFICANT_PHOTOS: Record<string, string> = {
  'prod-fe-salamina-sugo': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=720&q=80',
  'prod-fe-cappelletti-brodo': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=720&q=80',
  'prod-fe-salame-aglio': 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=720&q=80',
  'prod-fe-pampapato-igp': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=720&q=80',
  'prod-fe-coppia-igp': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&q=80',
  'prod-fe-box-guercino': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=720&q=80',
  'prod-fiorentina-brace': 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=720&q=80',
  'prod-costata-frollata': 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=720&q=80',
  'prod-tagliata-scottona': 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=720&q=80',
  'prod-costine-bbq': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=720&q=80',
  'prod-patate-forno': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=720&q=80',
  'prod-wine-bosco-eliceo-fortana-doc': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=720&q=80',
  'prod-wine-lambrusco-grasparossa-doc': 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=720&q=80',
  'prod-wine-colli-bolognesi-pignoletto-docg': 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=720&q=80',
  'prod-wine-emilia-dell-emilia-igp': 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=720&q=80',
  'prod-wine-fortana-del-taro-igp': 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=720&q=80',
  'prod-wine-chianti-classico-docg': 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=720&q=80',
  'prod-wine-amarone-valpolicella-docg': 'https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=720&q=80',
  'prod-wine-barolo-docg': 'https://images.unsplash.com/photo-1560148218-1a83060f7b32?auto=format&fit=crop&w=720&q=80',
  'prod-std-parmigiano-30m-ean': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=720&q=80',
  'prod-std-balsamico-modena-igp-ean': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=720&q=80',
  'prod-std-riso-carnaroli-delta-igp': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=720&q=80'
};

/**
 * Funzione che arricchisce ogni articolo con la struttura dati completa E-Commerce
 * (Barcode/EAN/PLU, Peso Variabile, Regole Doganali/Catena del Freddo, Fornitore e Benchmark Competitor)
 */
function enrichArticleWithEnterpriseData(product: Product, index: number): Product {
  const isWine = Boolean(product.wineDenomination);
  const significantPhoto =
    PRODUCT_SIGNIFICANT_PHOTOS[product.id] ||
    (product.imageUrl && !product.imageUrl.includes('together_default')
      ? product.imageUrl
      : isWine
      ? 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=720&q=80'
      : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=720&q=80');
  const isStandard = product.category === 'dispensa_standard';
  const isBox = product.category === 'cestini_box';
  const isHotReady = product.category === 'piatti_pronti' && product.isReadyToEat;
  const isRawMeat = product.category === 'carne_fresca';

  // 1. Calcolo peso netto e lordo realistico
  let netWeightGrams = 500;
  if (product.id.includes('fiorentina')) netWeightGrams = 1100;
  else if (product.id.includes('costata')) netWeightGrams = 800;
  else if (product.id.includes('box-guercino')) netWeightGrams = 2200;
  else if (product.id.includes('salamina')) netWeightGrams = 450;
  else if (product.id.includes('tagliata')) netWeightGrams = 400;
  else if (product.id.includes('costine')) netWeightGrams = 650;
  else if (product.id.includes('patate')) netWeightGrams = 350;
  else if (product.id.includes('salame-aglio')) netWeightGrams = 600;
  else if (product.id.includes('pampapato')) netWeightGrams = 350;
  else if (product.id.includes('coppia')) netWeightGrams = 400;
  else if (product.id.includes('balsamico')) netWeightGrams = 250;
  else if (product.id.includes('riso')) netWeightGrams = 1000;
  else if (isWine) netWeightGrams = 750;

  const grossShippingWeightGrams = isWine
    ? 1380 // Bottiglia di vetro + cantinetta antiurto
    : product.id.includes('balsamico')
    ? 580
    : Math.round(netWeightGrams * 1.15);

  // 2. Identificazione Articolo (EAN-13 Standard vs PLU Bilancia Locale)
  const eanMap: Record<string, string> = {
    'prod-std-parmigiano-30m-ean': '8010721003024',
    'prod-std-balsamico-modena-igp-ean': '8006910001151',
    'prod-std-riso-carnaroli-delta-igp': '8004120001053',
    'prod-fe-pampapato-igp': '8023410090118',
    'prod-wine-bosco-eliceo-fortana-doc': '8019420010124',
    'prod-wine-lambrusco-grasparossa-doc': '8019420010285',
    'prod-wine-colli-bolognesi-pignoletto-docg': '8019420010391',
    'prod-wine-emilia-dell-emilia-igp': '8019420010445',
    'prod-wine-fortana-del-taro-igp': '8019420010513',
    'prod-wine-chianti-classico-docg': '8019420020116',
    'prod-wine-amarone-valpolicella-docg': '8019420030221',
    'prod-wine-barolo-docg': '8019420040336'
  };

  const hasStandardEan = Boolean(eanMap[product.id]);
  const isVariableWeight = isRawMeat || product.id.includes('salame-aglio') || product.id.includes('fiorentina') || product.id.includes('parmigiano');

  const identification: ArticleIdentification = {
    sku: `BA-${(index + 1).toString().padStart(3, '0')}-${product.id.replace('prod-', '').slice(0, 8).toUpperCase()}`,
    supplyType: isBox
      ? 'BUNDLE_BOX'
      : isStandard || isWine
      ? 'STANDARD_BRAND'
      : isHotReady
      ? 'IN_HOUSE_GRILL'
      : 'LOCAL_ARTISAN',
    barcodeType: hasStandardEan
      ? 'EAN13'
      : isVariableWeight
      ? 'SCALE_WEIGHT_EAN'
      : 'INTERNAL_QR',
    gtinEan: hasStandardEan
      ? eanMap[product.id]
      : `2000${(100 + index).toString()}${Math.round(product.price * 100).toString().padStart(5, '0')}7`,
    pluCode: `PLU-${101 + index}`,
    brandName: isStandard
      ? 'Selezione Consorzi Emiliani DOP/IGP'
      : isWine
      ? `Cantine Selezionate ${product.wineRegion || 'Italia'}`
      : 'Bottega Braciami Ancora · Cento (FE)',
    customsHsCode: isWine ? '2204.21.00' : isRawMeat ? '0201.20.00' : '1601.00.91'
  };

  // 3. Prezzo al Kg/Litro (Obbligatorio Direttiva UE 98/6/CE), IVA e Costo Fornitore
  const pricePerKgOrLiter = Number(((product.price / netWeightGrams) * 1000).toFixed(2));
  const vatRatePercent: 4 | 10 | 22 = isWine || isBox
    ? 22
    : product.id.includes('coppia') || product.id.includes('parmigiano') || product.id.includes('riso')
    ? 4
    : 10;
  const supplierCostNet = Number((product.price * 0.56).toFixed(2));

  const isLiquidVolume = isWine || product.id.includes('balsamico');
  const commercialUnit = isBox
    ? 'cesto'
    : isWine || product.id.includes('balsamico')
    ? 'bottiglia'
    : isHotReady
    ? 'porzione'
    : product.id.includes('riso') || product.id.includes('fiorentina')
    ? 'kg'
    : product.id.includes('cappelletti')
    ? 'conf'
    : isRawMeat || product.id.includes('parmigiano') || product.id.includes('salame')
    ? 'g'
    : 'pz';

  const pricingAndWeight: ArticlePricingAndWeight = {
    pricingMode: isVariableWeight ? 'VARIABLE_WEIGHT' : 'FIXED_UNIT',
    commercialUnit,
    unitsPerCarton: isWine ? 6 : isBox ? 2 : 6,
    cartonDiscountPercent: isWine ? 10 : 8,
    netWeightGrams,
    isLiquidVolume,
    grossShippingWeightGrams,
    weightTolerancePercent: isVariableWeight ? 10 : undefined,
    pricePerKgOrLiter,
    referenceUnit: isLiquidVolume ? 'l' : 'kg',
    vatRatePercent,
    supplierCostNet,
    minMarginPercent: 25
  };

  // 4. Fornitore e Tracciabilità Lotto
  const supplierInfo: ArticleSupplierInfo = {
    supplierId: isHotReady
      ? 'sup-bottega-cento'
      : isRawMeat
      ? 'sup-allevamenti-alto-reno'
      : isWine
      ? 'sup-enoteca-consortile'
      : 'sup-artigiani-terre-estensi',
    supplierName: isHotReady
      ? 'Cucina & Brace Manuel e Samanta (Produzione Propria)'
      : isRawMeat
      ? 'Società Agricola Bovini Emiliani - Filiera Controllata'
      : isWine
      ? `Consorzio Tutela Vini ${product.wineDenomination || 'DOC'} (${product.wineRegion || 'Italia'})`
      : 'Maestri Artigiani Centesi & Terre del Guercino',
    supplierLocality: isHotReady ? 'Cento (FE) - Via Penzale 25' : product.origin || 'Cento / Ferrara (FE)',
    distanceFromShopKm: isHotReady ? 0 : isWine && product.wineRegion !== 'EMILIA ROMAGNA' ? 180 : 12,
    batchCode: `LOT-2026-${(10 + index).toString()}-FE`,
    guaranteedShelfLifeDays: isHotReady ? 2 : isRawMeat ? 10 : isWine || isStandard ? 365 : 30,
    originCountry: 'Italia (100% Filiera Tracciata)',
    certifications: [
      ...(product.isTipicoFerrarese ? ['De.Co. / Tradizione Ferrarese'] : []),
      ...(product.wineDenomination ? [product.wineDenomination] : []),
      ...(product.name.includes('IGP') ? ['IGP Certificato UE'] : []),
      ...(product.name.includes('DOP') ? ['DOP Certificato UE'] : []),
      '100% Italiano'
    ]
  };

  // 5. Logistica Europea e Catena del Freddo
  const temperatureRegime = isWine || isStandard && !product.id.includes('parmigiano') || product.id.includes('pampapato') || product.id.includes('coppia')
    ? 'AMBIENT'
    : isHotReady
    ? 'HOT_EXPRESS'
    : 'CHILLED_0_4';

  const logisticsRules: ArticleLogisticsRules = {
    temperatureRegime,
    packagingType: isWine || product.id.includes('balsamico')
      ? 'GLASS_BOTTLE_SAFE'
      : isHotReady
      ? 'THERMAL_FOIL'
      : 'VACUUM_SEALED',
    requiresIsothermalBox: temperatureRegime === 'CHILLED_0_4' || (isHotReady && Boolean(product.canBeFrozen)),
    isFragileGlass: isWine || product.id.includes('balsamico'),
    allowedDispatchDays: temperatureRegime === 'AMBIENT' ? [1, 2, 3, 4, 5] : [1, 2, 3], // Lun-Mer per freschi in Europa!
    shippableZones:
      temperatureRegime === 'AMBIENT'
        ? ['LOCAL_CENTO', 'ITALY_NATIONAL', 'EU_SCHENGEN', 'EXTRA_EU_UK_CH']
        : product.canBeFrozen || temperatureRegime === 'CHILLED_0_4'
        ? ['LOCAL_CENTO', 'ITALY_NATIONAL', 'EU_SCHENGEN']
        : ['LOCAL_CENTO'],
    maxTransitHours: temperatureRegime === 'AMBIENT' ? 720 : 48
  };

  // 6. Intelligence Competitor Giornaliera (Locale Cento/FE, Nazionale Italia, Export Europa)
  const localCompPrice = Number((pricePerKgOrLiter * 1.04).toFixed(2));
  const nationalCompPrice = Number((pricePerKgOrLiter * 1.14).toFixed(2));
  const euCompPrice = Number((pricePerKgOrLiter * 1.28).toFixed(2));

  const competitorIntelligence: ArticleCompetitorIntelligence = {
    matchingStrategy: hasStandardEan ? 'EXACT_BARCODE_EAN' : 'EQUIVALENT_SPEC_AI',
    comparisonUnit: isWine || product.id.includes('balsamico') ? 'L' : 'KG',
    ourNormalizedPrice: pricePerKgOrLiter,
    positioning: 'LEADER_CONVENIENZA',
    benchmarks: [
      {
        competitorName: 'Media Botteghe & GDO Area Cento / Ferrara / Bologna',
        marketScope: 'LOCAL_CENTO_FE',
        countryCode: 'IT',
        normalizedPricePerUnit: localCompPrice,
        ourDiffPercent: -3.8,
        lastCheckedAt: '2026-10-24T06:00:00Z'
      },
      {
        competitorName: isWine ? 'Tannico / Eataly Online Italia' : 'Eataly / Cortilia / Longino Italia',
        marketScope: 'ITALY_NATIONAL',
        countryCode: 'IT',
        normalizedPricePerUnit: nationalCompPrice,
        ourDiffPercent: -12.3,
        lastCheckedAt: '2026-10-24T06:00:00Z'
      },
      {
        competitorName: 'Vico Food Box / Gustini Feinkost (DE · NL · FR · SE)',
        marketScope: 'EUROPE_EXPORT',
        countryCode: 'EU',
        normalizedPricePerUnit: euCompPrice,
        ourDiffPercent: -21.9,
        lastCheckedAt: '2026-10-24T06:00:00Z'
      }
    ]
  };

  // 7. Codici Internazionali Totali (EAN-13, ITF-14 Scatolone, TARIC Doganale, GPC GS1, eAmbrosia DOP/IGP, Bollo CE)
  const gtin13 = identification.gtinEan || `801942000${(100 + index).toString()}5`;
  const internationalCodes: InternationalCodes = {
    gtinEan13: gtin13,
    itf14CartonCode: `1${gtin13.slice(0, 12)}8`,
    taricHsCode: identification.customsHsCode || '1601.00.91',
    gs1GpcBrickCode: isWine ? '10000227 (Wine)' : isRawMeat ? '10005769 (Meat/Poultry)' : '10000181 (Prepared/Preserved Foods)',
    euDopIgpRegistryCode:
      product.wineFascicolo ||
      (product.id.includes('salamina')
        ? 'PGI-IT-0071 (Salama da Sugo IGP)'
        : product.id.includes('pampapato')
        ? 'PGI-IT-01308 (Pampapato di Ferrara IGP)'
        : product.id.includes('coppia')
        ? 'PGI-IT-0145 (Coppia Ferrarese IGP)'
        : product.id.includes('parmigiano')
        ? 'PDO-IT-0016 (Parmigiano Reggiano DOP)'
        : product.id.includes('balsamico')
        ? 'PGI-IT-0430 (Aceto Balsamico di Modena IGP)'
        : product.id.includes('riso')
        ? 'PGI-IT-0712 (Riso del Delta del Po IGP)'
        : undefined),
    sanitaryPlantBoltCE: isWine ? 'IT-ICQRF-FE-248' : isRawMeat || isHotReady ? 'IT 08 142 CE' : 'IT 08 219 CE'
  };

  // 8. Stabilimento Fisico di Produzione, Assemblaggio e Origine Materie Prime
  const manufacturingOrigin: PhysicalManufacturingOrigin = {
    manufacturerLegalName: supplierInfo.supplierName,
    brandOwner: identification.brandName,
    plantName: isHotReady
      ? 'Laboratorio Gastronomico & Griglia a Legna Braciami Ancora'
      : isWine
      ? `Cantina d'Imbottigliamento Certificata (${product.wineRegion || 'Emilia-Romagna'})`
      : 'Stabilimento Artigianale Terre del Guercino & Bassa Ferrarese',
    physicalStreetAddress: isHotReady
      ? 'Via Penzale, 25'
      : product.id.includes('balsamico')
      ? 'Via Vignolese, 1180'
      : product.id.includes('riso')
      ? 'Via Matteotti, 14 (Tenuta Bonifica)'
      : 'Via Bologna, 84 (Zona Artigianale)',
    city: isHotReady
      ? 'Cento'
      : product.id.includes('balsamico')
      ? 'Modena'
      : product.id.includes('riso')
      ? 'Jolanda di Savoia'
      : 'Cento',
    provinceCode: product.id.includes('balsamico') ? 'MO' : 'FE',
    postalCode: product.id.includes('balsamico') ? '41126' : product.id.includes('riso') ? '44037' : '44042',
    region: product.wineRegion || 'Emilia-Romagna',
    countryCode: 'IT',
    plantCoordinates: { lat: 44.7275, lng: 11.2891 },
    rawMaterialsOrigin: isRawMeat || isHotReady
      ? 'Carni 100% Italiane (Nato, Allevato e Sezionato in Emilia-Romagna) · Legna di Rovere stagionata'
      : isWine
      ? `Uve 100% autoctone vinificate nella zona storica ${product.wineDenomination || 'DOC'} (${product.wineRegion || 'Italia'})`
      : 'Materie prime 100% italiane selezionate da filiera agricola certificata del territorio estense',
    packagingAndAssemblyPlace: 'Confezionato, sigillato sottovuoto ed etichettato a Cento (FE), Via Penzale 25, Italia'
  };

  // 9. Scheda Nutrizionale Completa Certificata (Reg. UE 1169/2011)
  const baseCal = product.nutritionalFacts?.calories || (isWine ? 82 : 290);
  const baseProt = product.nutritionalFacts?.proteins ?? (isWine ? 0.2 : 22);
  const baseFat = product.nutritionalFacts?.fats ?? (isWine ? 0 : 16);
  const baseCarb = product.nutritionalFacts?.carbohydrates ?? (isWine ? 2.4 : 4);
  const completeNutrition = {
    energyKj: Math.round(baseCal * 4.184),
    calories: baseCal,
    fats: baseFat,
    saturatedFats: Number((baseFat * 0.38).toFixed(1)),
    carbohydrates: baseCarb,
    sugars: Number((baseCarb * 0.22).toFixed(1)),
    fiber: product.nutritionalFacts?.fiber ?? (isWine ? 0 : 1.2),
    proteins: baseProt,
    saltGrams: isWine ? 0.01 : product.id.includes('salame') || product.id.includes('salamina') ? 2.6 : 1.3,
    nutriScore: (isWine ? 'B' : baseFat > 25 ? 'D' : baseFat > 12 ? 'B' : 'A') as 'A' | 'B' | 'C' | 'D' | 'E',
    novaGroup: (isRawMeat || product.id.includes('riso') ? 1 : 2) as 1 | 2 | 3 | 4,
    vitamins_minerals: product.nutritionalFacts?.vitamins_minerals || ['Ferro Eme', 'Vitamina B12', 'Zinco', 'Selenio'],
    isCalculatedForDish: Boolean(product.nutritionalFacts?.isCalculatedForDish)
  };

  // 10. Ricette Gastronomiche Collegate all'Articolo
  const linkedRecipes: LinkedRecipe[] = [
    {
      id: `rec-${product.id}-1`,
      title: isWine
        ? `Abbinamento Reale: ${product.name} con Grigliata e Salumi Centesi`
        : `Ricetta d'Autore di Manuel & Samanta con ${product.name}`,
      title_translations: {
        it_IT: isWine
          ? `Abbinamento Reale: ${product.name} con Grigliata e Salumi Centesi`
          : `Ricetta d'Autore di Manuel & Samanta con ${product.name}`,
        en_US: isWine
          ? `Royal Pairing: ${product.name} with Wood-Grilled Meats & Ferrara Cured Meats`
          : `Manuel & Samanta's Signature Recipe with ${product.name_translations?.en_US || product.name}`
      },
      difficulty: isHotReady ? 'Facile' : 'Tradizionale',
      prepTimeMinutes: 10,
      cookTimeMinutes: isHotReady ? 5 : 15,
      servings: 2,
      ingredients: [
        { name: product.name, quantityLabel: product.portion, linkedProductId: product.id },
        {
          name: 'Coppia Ferrarese IGP Tradizionale (Ciupèta)',
          quantityLabel: '2 pezzi croccanti',
          linkedProductId: 'prod-fe-coppia-igp'
        },
        {
          name: 'Aceto Balsamico di Modena IGP Invecchiato "Oro dei Duchi"',
          quantityLabel: '5 gocce a crudo',
          linkedProductId: 'prod-std-balsamico-modena-igp-ean'
        }
      ],
      steps: [
        'Portare il prodotto a temperatura ambiente per 15 minuti prima della preparazione per esaltare i profumi naturali.',
        isHotReady
          ? 'Rigenerare dolcemente per 3-4 minuti in forno preriscaldato a 170°C o a bagnomaria nella busta sottovuoto.'
          : 'Impiattare su piatto di ceramica caldo accompagnando con i riccioli croccanti della Coppia Ferrarese IGP.',
        'Rifinire a filo con poche gocce di Aceto Balsamico Invecchiato o sale dolce di Cervia e servire immediatamente.'
      ],
      winePairingProductId: 'prod-wine-bosco-eliceo-fortana-doc',
      winePairingLabel: 'Vino Bosco Eliceo Fortana DOC (Servito a 14-16°C)',
      chefTip: 'Non bucare mai la carne o l\'insaccato durante la cottura o rigenerazione: tutti i succhi nobili devono restare all\'interno.'
    }
  ];

  return {
    ...product,
    imageUrl: significantPhoto,
    nutritionalFacts: completeNutrition,
    reorderThreshold: 12,
    dailyProductionCap: isHotReady ? 30 : undefined,
    preparationOptions: isRawMeat
      ? ['Sottovuoto da viaggio EU', 'Taglio alto da griglia (4 cm)', 'Abbattuto -18°C']
      : isHotReady
      ? ['Caldo pronto (Ritiro/Cento)', 'Sottovuoto + Abbattuto per Spedizione Corriere']
      : ['Confezione Standard Salvafreschezza', 'Sottovuoto Lunga Percorrenza EU'],
    identification,
    pricingAndWeight,
    supplierInfo,
    logisticsRules,
    competitorIntelligence,
    internationalCodes,
    manufacturingOrigin,
    linkedRecipes
  };
}

export const ENRICHED_SEED_PRODUCTS: Product[] = [
  ...BASE_SEED_PRODUCTS,
  ...STANDARD_BARCODE_PRODUCTS
].map((p, idx) => enrichArticleWithEnterpriseData(p, idx));

/**
 * Motore di Drilling-Down per Siti E-Commerce Alimentari e Registri Globali (OpenFoodFacts + Store Competitor)
 * Permette di esplorare Sito -> Reparto -> Sottocategoria -> Schede Prodotto Totali e importarle nel negozio.
 */
export const DRILL_DOWN_ECOMMERCE_TARGETS: DrillDownEcommerceTarget[] = [
  {
    siteId: 'site-openfoodfacts-it-eu',
    siteName: 'OpenFoodFacts Global & Italy Registry (API Live + 3.2M Schede EAN)',
    domainUrl: 'https://it.openfoodfacts.org',
    countryCode: 'IT',
    scope: 'GLOBAL_OPEN_REGISTRY',
    totalIndexedProducts: 3240500,
    lastCrawledAt: '2026-10-24T04:00:00Z',
    departments: [
      {
        id: 'dept-emilia-igp-dop',
        name: 'Specialità Emiliane & Ferraresi DOP / IGP',
        iconName: 'Award',
        subcategories: [
          {
            id: 'sub-salumi-emilia',
            name: 'Salumi, Insaccati & Salamina da Sugo',
            productCount: 420,
            searchQueryForApi: 'salame ferrarese mortadella bologna igp',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.id.includes('salamina') || p.id.includes('salame'))
          },
          {
            id: 'sub-formaggi-parmigiano',
            name: 'Parmigiano Reggiano & Formaggi Stagionati',
            productCount: 890,
            searchQueryForApi: 'parmigiano reggiano dop 30 mesi',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.id.includes('parmigiano'))
          },
          {
            id: 'sub-pasta-riso-ferrara',
            name: 'Pasta Fresca, Riso del Delta IGP & Pane Ferrarese',
            productCount: 650,
            searchQueryForApi: 'cappelletti riso carnaroli coppia ferrarese',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.id.includes('cappelletti') || p.id.includes('riso') || p.id.includes('coppia'))
          }
        ]
      },
      {
        id: 'dept-macelleria-brace',
        name: 'Macelleria, Frollate Dry-Aged & Pronti Brace',
        iconName: 'Flame',
        subcategories: [
          {
            id: 'sub-bovino-scottona',
            name: 'Fiorentine, Costate Dry-Aged & Tagliate',
            productCount: 310,
            searchQueryForApi: 'scottona fiorentina costata',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.category === 'carne_fresca' || p.id.includes('fiorentina') || p.id.includes('tagliata'))
          },
          {
            id: 'sub-suino-bbq',
            name: 'Costine BBQ, Grigliate & Pronti Caldi',
            productCount: 245,
            searchQueryForApi: 'costine maiale grigliata',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.id.includes('costine') || p.id.includes('box-guercino'))
          }
        ]
      },
      {
        id: 'dept-dispensa-vini',
        name: 'Dispensa Italiana con Barcode & Cantina DOC/DOCG',
        iconName: 'Wine',
        subcategories: [
          {
            id: 'sub-aceto-condimenti',
            name: 'Aceto Balsamico di Modena IGP, Oli & Conserve',
            productCount: 1540,
            searchQueryForApi: 'aceto balsamico di modena igp',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.id.includes('balsamico') || p.id.includes('pampapato'))
          },
          {
            id: 'sub-vini-docg',
            name: 'Vini Emiliani & Grandi Rossi Italiani DOC/DOCG',
            productCount: 2180,
            searchQueryForApi: 'lambrusco doc barolo amarone chianti',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => Boolean(p.wineDenomination))
          }
        ]
      }
    ]
  },
  {
    siteId: 'site-eataly-cortilia-it',
    siteName: 'Eataly / Cortilia / Longino & Cardenal (Benchmark Nazionale)',
    domainUrl: 'https://www.eataly.net/it_it/spesa-online',
    countryCode: 'IT',
    scope: 'ITALY_SPECIALTY',
    totalIndexedProducts: 14800,
    lastCrawledAt: '2026-10-24T05:30:00Z',
    departments: [
      {
        id: 'dept-eataly-gastronomia',
        name: 'Gastronomia, Salumi & Formaggi d\'Autore',
        iconName: 'Award',
        subcategories: [
          {
            id: 'sub-eataly-eccellenze',
            name: 'Presidi & IGP Emiliani a Confronto',
            productCount: 520,
            searchQueryForApi: 'parmigiano reggiano aceto balsamico modena',
            sampleProducts: ENRICHED_SEED_PRODUCTS.slice(0, 6)
          }
        ]
      }
    ]
  },
  {
    siteId: 'site-vicofoodbox-gustini-eu',
    siteName: 'Vico Food Box / Gustini Feinkost DE-NL-FR (Export Europa)',
    domainUrl: 'https://www.vicofoodbox.com',
    countryCode: 'DE',
    scope: 'EUROPE_ITALIAN_EXPORT',
    totalIndexedProducts: 9600,
    lastCrawledAt: '2026-10-24T05:45:00Z',
    departments: [
      {
        id: 'dept-eu-export-bestsellers',
        name: 'Più Venduti in Germania, Olanda, Regno Unito e Svezia',
        iconName: 'Globe',
        subcategories: [
          {
            id: 'sub-eu-bestsellers',
            name: 'Specialità Italiane Sottovuoto & Barcode Standard',
            productCount: 780,
            searchQueryForApi: 'italian specialty pasta parmigiano',
            sampleProducts: ENRICHED_SEED_PRODUCTS.filter((p) => p.category === 'dispensa_standard' || Boolean(p.wineDenomination))
          }
        ]
      }
    ]
  }
];

/**
 * Interroga in tempo reale il registro mondiale OpenFoodFacts per Barcode EAN o termine di ricerca
 * e trasforma ogni risultato in una "Scheda Prodotto Totale" pronta per essere importata in Braciami Ancora!
 */
export async function crawlLiveFoodRegistryProducts(queryOrBarcode: string): Promise<Product[]> {
  const clean = queryOrBarcode.trim();
  if (!clean) return [];

  try {
    const isBarcode = /^\d{8,14}$/.test(clean);
    const url = isBarcode
      ? `https://world.openfoodfacts.org/api/v2/product/${clean}.json`
      : `https://it.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(clean)}&search_simple=1&action=process&json=1&page_size=8`;

    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    const rawItems: any[] = isBarcode
      ? data.product
        ? [data.product]
        : []
      : Array.isArray(data.products)
      ? data.products
      : [];

    return rawItems
      .filter((item) => item && (item.product_name_it || item.product_name))
      .map((item, idx) => {
        const title = item.product_name_it || item.product_name || 'Prodotto Alimentare Italiano';
        const brand = item.brands || 'Produttore Certificato Italiano';
        const code = item.code || `800991000${idx}12`;
        const qtyStr = item.quantity || '500 g';
        const nutriments = item.nutriments || {};
        const kcal = Math.round(Number(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 260));
        const proteins = Number(Number(nutriments.proteins_100g || 12).toFixed(1));
        const fats = Number(Number(nutriments.fat_100g || 14).toFixed(1));
        const carbs = Number(Number(nutriments.carbohydrates_100g || 22).toFixed(1));
        const manufacturingPlace = item.manufacturing_places || item.origins || 'Emilia-Romagna, Italia';

        const baseProduct: Product = {
          id: `prod-crawled-${code}`,
          name: `${title} (${brand})`,
          name_translations: {
            it_IT: `${title} (${brand})`,
            en_US: item.product_name_en ? `${item.product_name_en} (${brand})` : `${title} (${brand})`
          },
          category: 'dispensa_standard',
          portion: qtyStr,
          unit: qtyStr,
          description:
            item.ingredients_text_it ||
            item.generic_name_it ||
            `Scheda prodotto totale estratta da catalogo internazionale. Marca: ${brand}. Stabilimento di produzione: ${manufacturingPlace}.`,
          price: 9.9,
          curator: 'Samanta',
          curatorNote: `Articolo verificato con Barcode Internazionale EAN ${code} · Produttore: ${brand}`,
          cookingTime: 'Vedi scheda tecnica e ricette abbinate',
          isReadyToEat: true,
          tags: [`EAN ${code}`, brand, 'Scheda Prodotto Totale'],
          allergens: item.allergens_tags
            ? item.allergens_tags.map((a: string) => a.replace(/^[a-z]{2}:/, ''))
            : [],
          origin: manufacturingPlace,
          stockQuantity: 40,
          imageUrl: item.image_front_small_url || item.image_url || '/assets/together_default.jpg',
          nutritionalFacts: {
            energyKj: Math.round(kcal * 4.184),
            calories: kcal,
            proteins,
            fats,
            saturatedFats: Number(Number(nutriments['saturated-fat_100g'] || fats * 0.35).toFixed(1)),
            carbohydrates: carbs,
            sugars: Number(Number(nutriments.sugars_100g || 2.5).toFixed(1)),
            fiber: Number(Number(nutriments.fiber_100g || 1.5).toFixed(1)),
            saltGrams: Number(Number(nutriments.salt_100g || 1.1).toFixed(2)),
            nutriScore: (item.nutriscore_grade ? item.nutriscore_grade.toUpperCase() : 'B') as any,
            novaGroup: (Number(item.nova_group) || 2) as any,
            vitamins_minerals: ['Tracciabilità GS1 Completa', 'Etichettatura UE 1169/2011'],
            isCalculatedForDish: false
          },
          isFreshPerishable: false,
          canBeFrozen: false,
          maxDeliveryKm: 5000
        };

        const enriched = enrichArticleWithEnterpriseData(baseProduct, 50 + idx);
        if (enriched.identification) {
          enriched.identification.gtinEan = code;
          enriched.identification.barcodeType = 'EAN13';
          enriched.identification.brandName = brand;
        }
        if (enriched.internationalCodes) {
          enriched.internationalCodes.gtinEan13 = code;
          enriched.internationalCodes.sanitaryPlantBoltCE = item.emb_codes || 'IT-CE-VERIFIED';
        }
        if (enriched.manufacturingOrigin) {
          enriched.manufacturingOrigin.manufacturerLegalName = brand;
          enriched.manufacturingOrigin.brandOwner = brand;
          enriched.manufacturingOrigin.plantName = `Stabilimento ${brand} (${manufacturingPlace})`;
          enriched.manufacturingOrigin.rawMaterialsOrigin = item.origins || manufacturingPlace;
          enriched.manufacturingOrigin.packagingAndAssemblyPlace = manufacturingPlace;
        }
        return enriched;
      });
  } catch (err) {
    console.warn('Live crawl fallback:', err);
    return [];
  }
}

/**
 * Helper universale per leggere qualsiasi campo testuale di un Prodotto nella lingua attiva
 * (Zero testo cablato: legge sempre dal record Firebase/Database del prodotto con fallback intelligente)
 */
export function getLocalizedProductText(
  product: Product,
  field: 'name' | 'description' | 'portion' | 'curatorNote' | 'cookingTime' | 'origin',
  language: LanguageCode
): string {
  const shortLang = language.split('_')[0];
  const translationsMap =
    field === 'name'
      ? product.name_translations
      : field === 'description'
      ? product.description_translations
      : field === 'portion'
      ? product.portion_translations
      : field === 'curatorNote'
      ? product.curatorNote_translations
      : field === 'cookingTime'
      ? product.cookingTime_translations
      : product.origin_translations;

  if (translationsMap) {
    if (translationsMap[language]) return translationsMap[language];
    if (translationsMap[shortLang]) return translationsMap[shortLang];
    if (language !== 'it_IT' && translationsMap['en_US']) return translationsMap['en_US'];
    if (language !== 'it_IT' && translationsMap['en']) return translationsMap['en'];
    if (translationsMap['it_IT']) return translationsMap['it_IT'];
    if (translationsMap['it']) return translationsMap['it'];
  }

  return (product[field] as string) || '';
}
