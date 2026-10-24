export type ProductCategory =
  | 'tutti'
  | 'piatti_pronti'
  | 'carne_fresca'
  | 'gastronomia_vini'
  | 'dispensa_standard'
  | 'cestini_box';

export type ArticleSupplyType =
  | 'LOCAL_ARTISAN'     // Produttore locale di Cento / Terre Estensi (Km 0)
  | 'IN_HOUSE_GRILL'    // Preparato / Cotto in bottega da Manuel & Samanta
  | 'STANDARD_BRAND'    // Prodotto standard italiano confezionato con Barcode EAN-13
  | 'BUNDLE_BOX';       // Cestino degustazione / Box multi-prodotto

export type BarcodeFormatType =
  | 'EAN13'             // Barcode standard europeo 13 cifre (GS1)
  | 'EAN8'              // Barcode compatto 8 cifre
  | 'SCALE_WEIGHT_EAN'  // Barcode bilancia banco a peso/prezzo variabile (20xxxxx...)
  | 'INTERNAL_QR'       // Codice QR / SKU interno di tracciabilità lotto
  | 'NONE';

export type PricingMode =
  | 'FIXED_UNIT'        // Prezzo fisso a pezzo/confezione/bottiglia
  | 'VARIABLE_WEIGHT';  // Vendita a peso variabile (es. tagli di carne, tranci salumi/formaggi)

export type TemperatureRegime =
  | 'HOT_EXPRESS'       // Caldo pronto al consumo (+60°C): solo ritiro o consegna locale Cento
  | 'CHILLED_0_4'       // Fresco da banco (0°C / +4°C): richiede sottovuoto + box isotermico EPS + gel pack
  | 'FROZEN_MINUS_18'   // Abbattuto rapidamente (-18°C): catena del freddo lunga percorrenza
  | 'AMBIENT';          // Temperatura ambiente (dispensa, vini, dolci secchi, conserve)

export type ShippableZone =
  | 'LOCAL_CENTO'       // Cento e comuni limitrofi (entro max_fresh_delivery_km)
  | 'ITALY_NATIONAL'    // Tutto il territorio nazionale italiano
  | 'EU_SCHENGEN'       // Unione Europea (Germania, Francia, Olanda, Spagna, Austria, Belgio, Svezia, ecc.)
  | 'EXTRA_EU_UK_CH';   // Regno Unito, Svizzera, Norvegia (richiede codice doganale TARIC/HS)

export interface ArticleIdentification {
  sku: string;
  supplyType: ArticleSupplyType;
  barcodeType: BarcodeFormatType;
  gtinEan?: string;        // es. "8005110170003" (EAN-13) o "2010450019504" (Bilancia)
  pluCode?: string;        // Codice rapido bilancia banco (es. "PLU-104")
  brandName: string;       // Produttore / Marchio
  customsHsCode?: string;  // Codice doganale TARIC/HS per export Europa/UK
}

export type CommercialUnitCode =
  | 'g'          // Grammi
  | 'hg'         // Ettogrammi (l'etto da banco gastronomia: 100g)
  | 'kg'         // Chilogrammi
  | 'ml'         // Millilitri
  | 'l'          // Litri
  | 'pz'         // Pezzo singolo
  | 'porzione'   // Porzione pronta
  | 'conf'       // Confezione / Vaschetta
  | 'bottiglia'  // Bottiglia
  | 'scatolone'  // Scatolone / Cartone multiplo (es. box da 6 o 12 pezzi)
  | 'cesto'      // Cestino degustazione
  | 'unita';     // Unità generica

export interface UnitOfMeasureDefinition {
  unit_id: CommercialUnitCode;
  category: 'weight' | 'volume' | 'count' | 'package';
  baseMetricEquivalentGramsOrMl?: number; // es. g=1, hg=100, kg=1000, ml=1, l=1000
  itemsPerPackage?: number;               // es. 1 per pezzo, 6 o 12 per scatolone
  symbol_translations: Record<string, string>; // Simbolo breve in ogni lingua (es. pz, pc, Stk, шт, قطعة)
  name_singular_translations: Record<string, string>;
  name_plural_translations: Record<string, string>;
}

export interface ArticlePricingAndWeight {
  pricingMode: PricingMode;
  commercialUnit: CommercialUnitCode;     // Unità di vendita primaria (g, kg, pz, scatolone, unita, bottiglia...)
  unitsPerCarton?: number;                // Quante unità contiene uno scatolone/cartone intero (es. 6 bottiglie, 10 conf.)
  cartonDiscountPercent?: number;         // Sconto automatico se il cliente acquista lo scatolone intero
  netWeightGrams: number;                 // Peso netto in grammi (o ml per liquidi)
  isLiquidVolume?: boolean;               // true se espresso in ml / litri (vini, aceto balsamico, olio)
  grossShippingWeightGrams: number;       // Peso lordo con vetro/imballo per calcolo tariffe corriere UE
  weightTolerancePercent?: number;        // es. ±10% per tagli di carne o salumi artigianali
  pricePerKgOrLiter: number;              // Obbligatorio Direttiva UE 98/6/CE
  referenceUnit: 'kg' | 'l' | 'pz';
  vatRatePercent: 4 | 10 | 22;
  supplierCostNet: number;                // Prezzo d'acquisto netto fornitore (€)
  minMarginPercent: number;               // Margine minimo di sicurezza (%)
}

export interface ArticleSupplierInfo {
  supplierId: string;
  supplierName: string;
  supplierLocality: string;         // es. "Cento (FE)", "Bondeno (FE)", "Parma (PR)"
  distanceFromShopKm: number;       // 0 = produzione propria a Cento, <25km = Km Zero
  batchCode: string;                // Lotto di tracciabilità alimentare
  guaranteedShelfLifeDays: number;  // Scadenza minima garantita alla consegna al cliente
  originCountry: string;
  certifications: string[];         // ["IGP", "DOP", "DOCG", "De.Co. Cento", "100% Italiano"]
}

export interface ArticleLogisticsRules {
  temperatureRegime: TemperatureRegime;
  packagingType: 'THERMAL_FOIL' | 'VACUUM_SEALED' | 'ATMOSPHERE_MAP' | 'GLASS_BOTTLE_SAFE' | 'STANDARD_BOX';
  requiresIsothermalBox: boolean;   // Richiede box polistirolo + ghiaccio gel per spedizioni
  isFragileGlass: boolean;          // Bottiglia o vaso in vetro (richiede cantinetta antiurto)
  allowedDispatchDays: number[];    // 1=Lun, 2=Mar, 3=Mer, 4=Gio, 5=Ven (es. [1,2,3] per freschi in UE)
  shippableZones: ShippableZone[];
  maxTransitHours: number;          // es. 2h caldo, 48h fresco isotermico, 720h ambiente
}

export interface CompetitorBenchmarkEntry {
  competitorName: string;
  marketScope: 'LOCAL_CENTO_FE' | 'ITALY_NATIONAL' | 'EUROPE_EXPORT';
  countryCode: string;
  normalizedPricePerUnit: number;   // Prezzo normalizzato al Kg / Litro / Unità in EUR
  ourDiffPercent: number;           // es. -8.5 (noi siamo più convenienti dell'8.5%)
  lastCheckedAt: string;
}

export interface ArticleCompetitorIntelligence {
  matchingStrategy: 'EXACT_BARCODE_EAN' | 'EQUIVALENT_SPEC_AI';
  comparisonUnit: 'KG' | 'L' | 'UNIT';
  ourNormalizedPrice: number;
  positioning: 'LEADER_CONVENIENZA' | 'ALLINEATO_MERCATO' | 'PREMIUM_ARTIGIANALE';
  benchmarks: CompetitorBenchmarkEntry[];
}

export interface InternationalCodes {
  gtinEan13: string;                  // Codice a barre GS1 EAN-13 internazionale
  itf14CartonCode?: string;           // Codice logistico DUN-14 / ITF-14 per lo scatolone multiplo
  taricHsCode: string;                // Codice Doganale Armonizzato UE TARIC (8-10 cifre)
  gs1GpcBrickCode?: string;           // Classificazione merceologica mondiale GS1 GPC
  euDopIgpRegistryCode?: string;      // Codice ufficiale registro europeo eAmbrosia (es. PGI-IT-0218)
  sanitaryPlantBoltCE?: string;       // Bollo Sanitario Europeo CE dello stabilimento (es. "IT 08 142 CE")
}

export interface PhysicalManufacturingOrigin {
  manufacturerLegalName: string;      // Ragione Sociale del produttore / trasformatore
  brandOwner: string;                 // Proprietario del marchio commerciale
  plantName: string;                  // Nome dello stabilimento / laboratorio / caseificio / cantina
  physicalStreetAddress: string;      // Indirizzo fisico esatto di produzione/assemblaggio
  city: string;
  provinceCode: string;
  postalCode: string;
  region: string;
  countryCode: string;
  plantCoordinates?: { lat: number; lng: number };
  rawMaterialsOrigin: string;         // Provenienza fisica materie prime (es. "Suini nati e allevati in Emilia-Romagna")
  packagingAndAssemblyPlace: string;  // Luogo di assemblaggio/confezionamento finale
}

export interface LinkedRecipe {
  id: string;
  title: string;
  title_translations?: Record<string, string>;
  difficulty: 'Facile' | 'Tradizionale' | 'Maestro Grigliatore';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: {
    name: string;
    quantityLabel: string;
    linkedProductId?: string;         // Se presente nel nostro negozio, acquistabile con 1 click!
  }[];
  steps: string[];
  steps_translations?: Record<string, string[]>;
  winePairingProductId?: string;
  winePairingLabel?: string;
  chefTip: string;
  chefTip_translations?: Record<string, string>;
}

export interface DrillDownSubcategory {
  id: string;
  name: string;
  productCount: number;
  searchQueryForApi: string;
  sampleProducts: Product[];
}

export interface DrillDownDepartment {
  id: string;
  name: string;
  iconName: string;
  subcategories: DrillDownSubcategory[];
}

export interface DrillDownEcommerceTarget {
  siteId: string;
  siteName: string;
  domainUrl: string;
  countryCode: string;
  scope: 'LOCAL_GDO' | 'ITALY_SPECIALTY' | 'EUROPE_ITALIAN_EXPORT' | 'GLOBAL_OPEN_REGISTRY';
  totalIndexedProducts: number;
  lastCrawledAt: string;
  departments: DrillDownDepartment[];
}

export interface NutritionalFacts {
  energyKj?: number;         // kJ per 100g/porzione (Reg. UE 1169/2011)
  calories: number;          // kcal per portion or 100g
  fats: number;              // grams total fat
  saturatedFats?: number;    // grams acidi grassi saturi
  carbohydrates: number;     // grams total carbs
  sugars?: number;           // grams di cui zuccheri
  fiber?: number;            // grams fibre
  proteins: number;          // grams proteine
  saltGrams?: number;        // grams sale (NaCl equivalente)
  nutriScore?: 'A' | 'B' | 'C' | 'D' | 'E';
  novaGroup?: 1 | 2 | 3 | 4; // Grado di trasformazione NOVA
  vitamins_minerals?: string[]; // e.g. ["Vitamina B12", "Ferro Eme", "Zinco", "Selenio", "Polifenoli"]
  isCalculatedForDish: boolean; // true = calculated total for prepared dish/box, false = single ingredient baseline
}

export interface HistoryAndCuriosity {
  storia: string;
  curiosita: string;
  storia_translations?: Record<string, string>;
  curiosita_translations?: Record<string, string>;
}

export interface Product {
  id: string;
  name: string;
  name_translations?: Record<string, string>;
  category: 'piatti_pronti' | 'carne_fresca' | 'cestini_box' | 'gastronomia_vini' | 'dispensa_standard';
  portion: string; // e.g. "circa 1.1 kg", "conf. da 15 pezzi", "2 porzioni", "Bottiglia 750ml"
  portion_translations?: Record<string, string>;
  unit?: string; // kg, pezzo, conf., bottiglia
  description: string;
  description_translations?: Record<string, string>;
  price: number;
  originalPrice?: number;
  curator: 'Manuel' | 'Samanta' | 'Entrambi';
  curatorNote: string;
  curatorNote_translations?: Record<string, string>;
  cookingTime?: string;
  cookingTime_translations?: Record<string, string>;
  ingredients_translations?: Record<string, string>;
  storageInstructions_translations?: Record<string, string>;
  isReadyToEat: boolean;
  isPopular?: boolean;
  isTipicoFerrarese?: boolean;
  tags: string[];
  allergens?: string[];
  origin?: string;
  origin_translations?: Record<string, string>;
  stockQuantity?: number;
  reorderThreshold?: number;
  dailyProductionCap?: number;
  preparationOptions?: string[];
  heatScale?: number;
  dryAgedDays?: number;
  imageUrl?: string;
  
  // Nutrizione e Storia
  nutritionalFacts?: NutritionalFacts;
  historyAndCuriosity?: HistoryAndCuriosity;
  
  // Deperibilità & Regole Distanza Spedizione
  isFreshPerishable?: boolean; // Piatto fresco deperibile a caldo/breve conservazione
  canBeFrozen?: boolean; // Può essere surgelato e spedito come surgelato / catena del freddo a lunga percorrenza
  maxDeliveryKm?: number; // Distanza massima per consegna espressa a fresco (default es. 35-50km)
  
  // Vini DOP / DOC / DOCG / IGP / IGT (estratti dai registri ufficiali italiani)
  wineDenomination?: 'DOP' | 'DOC' | 'DOCG' | 'IGP' | 'IGT';
  wineFascicolo?: string; // e.g. PDO-IT-A0287 (Bosco Eliceo), PGI-IT-A0509 (Emilia)
  wineRegion?: string; // e.g. EMILIA ROMAGNA, TOSCANA, VENETO, PIEMONTE
  alcoholByVolume?: string; // e.g. "12.5% Vol"

  // Nuova Architettura E-Commerce Avanzata (Barcode, Peso Variabile, Fornitori, Logistica UE, Competitor)
  identification?: ArticleIdentification;
  pricingAndWeight?: ArticlePricingAndWeight;
  supplierInfo?: ArticleSupplierInfo;
  logisticsRules?: ArticleLogisticsRules;
  competitorIntelligence?: ArticleCompetitorIntelligence;

  // Scheda Prodotto Totale: Codici Internazionali, Stabilimento Fisico di Produzione e Ricette Collegate
  internationalCodes?: InternationalCodes;
  manufacturingOrigin?: PhysicalManufacturingOrigin;
  linkedRecipes?: LinkedRecipe[];

  // Media Avanzati & Scheda Tecnica con Watermark Anti-Scraping
  slideshowUrls?: string[];
  youtubeVideoUrl?: string;
  googleSlidesUrl?: string;
  technicalSheetSummary?: string;
  technicalSheetSpecs?: { label: string; value: string }[];
  antiScrapingWatermarkId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  specialInstructions?: string;
  isFrozenRequested?: boolean; // true se il cliente richiede la versione abbattuta/surgelata per spedizioni lunghe
  isCartonPack?: boolean;      // true se acquistato a Scatolone / Collo multiplo
}

export type DeliveryMethod = 'ritiro_bottega' | 'consegna_cento';
export type PaymentMethod = 'satispay' | 'carta' | 'paypal' | 'contanti';
export type OrderStatus = 'ricevuto' | 'in_griglia' | 'pronto' | 'in_consegna' | 'completato' | 'annullato';

export interface OrderCustomer {
  fullName: string;
  firstName?: string;
  lastName?: string;
  companyName?: string; // Ragione Sociale
  vatNumber?: string;   // Partita IVA
  email: string;
  phone: string;
  address?: string;
  city?: string;        // Comune
  postalCode?: string;  // CAP
  province?: string;    // Provincia
  countryCode?: string; // Paese
  fiscalCode?: string;  // Codice Fiscale
  notes?: string;
  isGuest: boolean;
  isOtpVerified: boolean;
}

export type StatoOrdine =
  | 'in_lavorazione'
  | 'confermato'
  | 'rifiutato'
  | 'rimborsato'
  | 'in_preparazione'
  | 'in_spedizione'
  | 'spedito'
  | 'ricevuto_feedback';

export interface DeliveryType {
  id: string;
  nome: string;
  costo_euro: number;
  tempo_stimato: string;
  istruzioni: string;
  attivo: boolean;
}

export interface OrderHeader {
  numero_ordine: string;
  data: string; // ISO format
  id_cliente: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  id_valuta: string; // EUR, USD, GBP, CHF
  tasso_cambio?: number;
  codice_sconto?: string;
  codice_promozione?: string;
  tipo_delivery: string; // id rif. a delivery_types
  stato_ordine: StatoOrdine;
  totale_euro: number;
  totale_valuta_cliente: number;
  note: string;
  meet_link?: string;
  createdAt?: string;
}

export interface OrderDetail {
  id_dettaglio: string;
  id_ordine: string; // rif. a numero_ordine
  id_prodotto: string;
  nome_prodotto: string;
  quantita: number;
  importo_euro: number;
  importo_valuta_cliente: number;
  codice_sconto?: string;
  codice_promozione?: string;
  note?: string; // grado di cottura, sottovuoto, ecc.
}

export interface OrderMessage {
  id: string;
  id_ordine: string;
  sender: 'bottega' | 'cliente';
  sender_name: string;
  testo: string;
  timestamp: string;
  tipo: 'testo' | 'stato' | 'meet_invite' | 'email_sent';
}

export interface OrderEmailLog {
  id: string;
  id_ordine: string;
  destinatario: string;
  oggetto: string;
  corpo: string;
  data_invio: string;
  stato_innescato: StatoOrdine | string;
}

export interface Order {
  id: string; // e.g. "BA-8421"
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  deliveryMethod: DeliveryMethod;
  deliveryTimeSlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pagato' | 'in_attesa_al_ritiro';
  customer: OrderCustomer;
  appliedPromoCode?: string;
  earnedPoints: number;
  orderHeader?: OrderHeader;
  orderDetails?: OrderDetail[];
}

/**
 * Tessera Virtuale Fedeltà (Compatibile con Stocard, Apple Wallet, Google Wallet, Catima e Scanner Cassa EAN-13 / Code-128)
 */
export interface VirtualLoyaltyCard {
  cardId: string;                     // es. "BA-CARD-44042-001"
  barcodeEan13: string;               // 13 cifre GS1 con check-digit valido (es. "2094404200018") per Stocard / Scanner Laser
  barcodeCode128: string;             // Code-128 alfanumerico ad alta densità
  qrPayloadUrl: string;               // URL/Token per scansione da fotocamera e lettura info acquisti
  tier: 'BRONZO' | 'ARGENTO' | 'ORO_ESTENSE' | 'AMBASCIATORE_CENTO';
  pointsBalance: number;
  lifetimePoints: number;
  walletPassInstalled?: ('APPLE_WALLET' | 'GOOGLE_WALLET' | 'STOCARD')[];
  activeCardVouchers: {
    code: string;
    label: string;
    discountType: 'PERCENT' | 'FIXED_EUR';
    value: number;
    expiresAt: string;
  }[];
  purchaseFeedAlerts: {
    id: string;
    date: string;
    relatedProductId?: string;
    type: 'COOKING_TIP' | 'LOT_TRACEABILITY' | 'REORDER_DISCOUNT' | 'FRESH_BATCH_ALERT';
    message_it: string;
    message_en?: string;
  }[];
}

export interface CustomerShippingAddress {
  id: string;
  label: string;                      // es. "Casa", "Ufficio", "Figlio a Berlino"
  recipientName: string;
  street: string;
  streetNumber: string;
  postalCode: string;
  city: string;
  province: string;
  countryCode: string;                // IT, DE, GB, FR, NL, SE, CN, US...
  intercomName?: string;              // Nome sul citofono (vitale per consegne alimentari)
  floor?: string;
  courierInstructions?: string;       // es. "Se assente lasciare in portineria: pacco isotermico"
  isDefault: boolean;
}

export interface CustomerDietaryAndBilling {
  customerCategory: 'PRIVATE_B2C' | 'HORECA_B2B' | 'CORPORATE_GIFTS';
  companyName?: string;
  vatNumberVies?: string;             // Partita IVA comunitaria VIES
  sdiOrPec?: string;                  // Codice Univoco SDI (7 caratteri) o PEC per fattura elettronica
  declaredAllergens: string[];        // Allergie del cliente per alert automatico sui prodotti!
  preferredCookingLevel?: 'AL_SANGUE' | 'MEDIA' | 'BEN_COTTA';
  preferredPackaging?: 'SOTTOVUOTO_VIAGGIO' | 'VASCHETTA_FRESCA';
  preferredChannel: 'WHATSAPP' | 'EMAIL' | 'SMS' | 'WALLET_PUSH';
  gdprMarketingConsent: boolean;
  gdprProfilingConsent: boolean;
}

/**
 * Tabella Utenti con tutti i campi richiesti per la gestione amministrativa, fiscale, CRM e Tessera Virtuale Barcode
 * tipo_utente: 0 = cliente, 1 = amministratore
 */
export interface UserData {
  uid: string;
  nome: string;
  cognome: string;
  sesso?: 'M' | 'F';
  data_nascita: string; // YYYY-MM-DD
  codice_fiscale: string;
  numero_passaporto?: string;
  indirizzo: string;
  numero_civico: string;
  cap: string;
  provincia: string; // es. FE, BO, MO
  comune_residenza?: string;
  comune_nascita?: string;
  provincia_nascita?: string;
  codice_nazione: string; // IT, DE, NL, SE, DK, GB, CN, ecc.
  email: string;
  telefono: string;
  cellulare_secondario?: string;
  is_whatsapp?: boolean;
  email_secondaria?: string;
  preferenza_contatto?: 1 | 2 | 3 | 4 | 5; // 1=email, 2=whatsapp, 3=email alternativa, 4=cellularePrincipale, 5=cellulareSecondario
  indirizzo_corriere?: string;
  orario_consegna_corriere?: string;
  note_corriere?: string;
  photo_url?: string;
  note: string;
  tipo_utente: 0 | 1; // 0 = cliente, 1 = amministratore
  punti_fedelta: number;
  totale_speso: number;
  numero_ordini: number;
  is_otp_guest: boolean;
  createdAt: string;
  loyaltyPoints?: number;
  virtualCard?: VirtualLoyaltyCard;
  shippingAddresses?: CustomerShippingAddress[];
  dietaryAndBilling?: CustomerDietaryAndBilling;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  registeredDate: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  loyaltyPoints: number;
  segment: 'Top Spender' | 'Abituale Weekend' | 'Nuovo Cliente' | 'Dormiente';
  preferredCut: string;
  notes?: string;
  note?: string;
  uid?: string;
  nome?: string;
  cognome?: string;
  data_nascita?: string;
  codice_fiscale?: string;
  indirizzo?: string;
  numero_civico?: string;
  cap?: string;
  provincia?: string;
  codice_nazione?: string;
  telefono?: string;
  tipo_utente?: 0 | 1;
  punti_fedelta?: number;
  totale_speso?: number;
  numero_ordini?: number;
  is_otp_guest?: boolean;
  createdAt?: string;
}

export interface Promozione {
  id: string;
  titolo: string;
  titolo_translations?: Record<string, string>;
  descrizione: string;
  badge: string;
  sconto_percentuale: number;
  valido_da: string;
  valido_a: string;
  attivo: boolean;
}

export interface Sconto {
  id: string;
  codice: string;
  tipo: 'percentuale' | 'fisso';
  valore: number;
  spesa_minima: number;
  descrizione: string;
  attivo: boolean;
  utilizzi_totali: number;
}

export interface CommercialProposal {
  id: string;
  title: string;
  targetSegment: string;
  discountPercentage: number;
  promoCode: string;
  message: string;
  channel: 'SMS' | 'Email' | 'WhatsApp';
  createdDate: string;
  status: 'bozza' | 'inviata';
  recipientsCount: number;
}

export interface PromoCampaign {
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  expiresAt: string;
  description: string;
}

export interface UiElement {
  element_id: string;
  category: string;
  description?: string;
  it: string;
  en: string;
  de: string;
  fr: string;
  es: string;
  nl: string;
  sv: string;
  da: string;
  zh?: string;
  ja?: string;
  ru?: string;
  ar?: string;
}

export type AdminNotificationType =
  | 'NEW_ORDER'
  | 'USER_CONNECTED'
  | 'PAYMENT_FAILED'
  | 'ORDER_DISPUTE'
  | 'STOCK_OR_COMPETITOR_ALERT'
  | 'LOYALTY_CARD_SCAN';

export interface AdminNotificationEvent {
  id: string;
  type: AdminNotificationType;
  severity: 'info' | 'success' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: string; // ISO string
  read: boolean;
  countryCode?: string;
  deviceType?: 'Smartphone' | 'Tablet' | 'Desktop';
  customerName?: string;
  customerContact?: string;
  relatedOrderId?: string;
  relatedProductId?: string;
  amountEur?: number;
}

export type ScrapingFrequency = 'ogni_6_ore' | 'ogni_12_ore' | 'giornaliero' | 'settimanale' | 'manuale';

export interface ScrapedCompetitorProductRecord {
  id: string;
  storeId: string;
  storeName: string;
  storeType: 'piccola_distribuzione' | 'catena';
  chainName: string;
  postalCode: string;
  city: string;
  province: string;
  region: string;
  country: string;
  distanceKm: number;
  productId: string;
  category: string;
  eanCode: string;
  descriptionIt: string;
  salePriceEur: number;
  ourPriceEur: number;
  lastScrapedAt: string;
}

export interface LocalGroceryStore30Km {
  id: string;
  storeName: string;
  storeType: 'piccola_distribuzione' | 'catena';
  chainName: string;
  address: string;
  postalCode: string;
  city: string;
  province: string;
  region: string;
  country: string;
  distanceFromCentoKm: number;
  lat: number;
  lng: number;
  websiteOrCatalogUrl?: string;
  lastScrapedAt: string;
  scrapedProducts: ScrapedCompetitorProductRecord[];
}

export interface ScrapingScheduleJob {
  id: string;
  createdAt: string;
  maxDistanceKm: number;
  postalCode?: string;
  city: string;
  province: string;
  region: string;
  country: string;
  productCategory: string;
  searchQuery: string;
  storeType: 'tutti' | 'piccola_distribuzione' | 'catena';
  frequency: ScrapingFrequency;
  status: 'schedulato' | 'in_esecuzione' | 'completato';
  lastRunAt: string;
  recordsFoundCount: number;
}

export interface CustomerSupportChatMessage {
  id: string;
  customerEmail: string;
  customerName: string;
  sender: 'cliente' | 'bottega';
  text: string;
  timestamp: string;
  meetLink?: string;
}

export interface SlidingImageDescriptor {
  id: string;
  fileNameOrUrl: string;
  nomePulsante: string;
  descrizione: string;
  facebookUrl?: string;
  targetPageOrCategory?: string;
  translations?: Record<string, { nomePulsante: string; descrizione: string }>;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  language: string;
  status: 'attivo' | 'disiscritto';
  unsubscribedAt?: string;
  unsubscribeToken: string;
  welcomeEmailSent: boolean;
  welcomeEmailSubject: string;
  welcomeEmailBodyHtml: string;
  legalUnsubscribeUrl: string;
  legalPrivacyUrl: string;
}

export interface SlidingConfigItem {
  id: string;
  nome: string;
  bucketPath: string;
  descrizione: SlidingImageDescriptor[];
  riferimentoPagina: string;
  tempoDiSliding: number;
}

export interface AccessoAdminLog {
  lastUser: string;
  timeStamp: string;
  fromIp: string;
  browser: string;
}

export interface StoreConfig {
  id: string;
  max_fresh_delivery_km: number; // default 50 km
  shop_lat: number; // 44.7275
  shop_lng: number; // 11.2891
  shop_address: string;
  shop_name: string;
  notify_on_order?: boolean;
  notify_on_user_connect?: boolean;
  notify_on_payment_failed?: boolean;
  notify_on_dispute?: boolean;
  scraping_frequency?: ScrapingFrequency;
  scraping_default_radius_km?: number;
  anti_scraping_watermark_enabled?: boolean;
  anti_scraping_watermark_text?: string;
  slidings?: SlidingConfigItem[];
  accessoAdmin?: AccessoAdminLog;
}
