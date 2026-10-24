import React, { useState, useMemo } from 'react';
import { useStore, AdminTab } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../firebase/AuthContext';
import { Order, OrderStatus, Product, ScrapingFrequency } from '../types';
import { FirestoreService } from '../firebase/firestoreService';
import { AntiScrapingWatermark } from './AntiScrapingWatermark';
import {
  ClipboardList,
  History,
  ShoppingBag,
  Radar,
  Sliders,
  Search,
  Pencil,
  ArrowUpDown,
  X,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Save,
  Trash2,
  Video,
  Presentation,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  RefreshCw,
  Database,
  Play,
  MapPin,
  Store,
  Calendar,
  Euro,
  Volume2
} from 'lucide-react';

// Web Audio API "Fra Martino Campanaro" melody player
export function playFraMartinoMelody() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    // Notes in Hz: C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00
    const C4 = 261.63,
      D4 = 293.66,
      E4 = 329.63,
      F4 = 349.23,
      G4 = 392.0,
      A4 = 440.0;
    const sequence: { f: number; d: number }[] = [
      // Fra Mar-ti-no, Fra Mar-ti-no
      { f: C4, d: 0.28 },
      { f: D4, d: 0.28 },
      { f: E4, d: 0.28 },
      { f: C4, d: 0.28 },
      { f: C4, d: 0.28 },
      { f: D4, d: 0.28 },
      { f: E4, d: 0.28 },
      { f: C4, d: 0.28 },
      // Dor-mi tu? Dor-mi tu?
      { f: E4, d: 0.28 },
      { f: F4, d: 0.28 },
      { f: G4, d: 0.52 },
      { f: E4, d: 0.28 },
      { f: F4, d: 0.28 },
      { f: G4, d: 0.52 },
      // Suo-na le cam-pa-ne! Suo-na le cam-pa-ne!
      { f: G4, d: 0.16 },
      { f: A4, d: 0.16 },
      { f: G4, d: 0.16 },
      { f: F4, d: 0.16 },
      { f: E4, d: 0.28 },
      { f: C4, d: 0.28 },
      { f: G4, d: 0.16 },
      { f: A4, d: 0.16 },
      { f: G4, d: 0.16 },
      { f: F4, d: 0.16 },
      { f: E4, d: 0.28 },
      { f: C4, d: 0.28 },
      // Din Don Dan! Din Don Dan!
      { f: C4, d: 0.28 },
      { f: G4, d: 0.28 },
      { f: C4, d: 0.55 },
      { f: C4, d: 0.28 },
      { f: G4, d: 0.28 },
      { f: C4, d: 0.65 }
    ];

    let startTime = ctx.currentTime + 0.05;
    sequence.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);
      gain.gain.setValueAtTime(0.22, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.d * 0.92);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + note.d);
      startTime += note.d + 0.03;
    });
  } catch (e) {
    console.warn('WebAudio warning:', e);
  }
}

export const AdminManager: React.FC = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    orders,
    updateOrderStatus,
    updateOrder,
    products,
    saveProductToCatalog,
    localStores30Km,
    scrapingJobs,
    scrapingFrequency,
    setScrapingFrequency,
    scheduleAndExecuteScraping,
    showToast,
    adminLogout,
    slidingsConfig,
    saveSlidingsConfig,
    accessoAdminLog,
    newsletterSubscribers,
    subscribeNewsletter,
    unsubscribeNewsletterByEmail,
    deleteNewsletterSubscriber,
    setLastSentNewsletterRecord
  } = useStore();
  const { storeConfig, refreshUiElements, resetToLocale } = useI18n();
  const { logOut } = useAuth();

  // ============================================================================
  // STATO TAB 2: STORICO ORDINI (Ricerca globale, Range Date/Importi, Sort & Filtri Colonna, Dettaglio 🔍 & Modifica/Annulla ✏️)
  // ============================================================================
  const [orderGlobalSearch, setOrderGlobalSearch] = useState('');
  const [orderDateFrom, setOrderDateFrom] = useState('');
  const [orderDateTo, setOrderDateTo] = useState('');
  const [orderMinAmount, setOrderMinAmount] = useState('');
  const [orderMaxAmount, setOrderMaxAmount] = useState('');
  const [orderSortField, setOrderSortField] = useState<string>('date');
  const [orderSortDir, setOrderSortDir] = useState<'asc' | 'desc'>('desc');
  const [orderColFilters, setOrderColFilters] = useState<Record<string, string>>({});
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [slidingsJsonText, setSlidingsJsonText] = useState<string>(() =>
    JSON.stringify(slidingsConfig, null, 2)
  );
  const [slidingsJsonError, setSlidingsJsonError] = useState<string | null>(null);
  const [adminNewNewsletterEmail, setAdminNewNewsletterEmail] = useState('');

  React.useEffect(() => {
    setSlidingsJsonText(JSON.stringify(slidingsConfig, null, 2));
  }, [slidingsConfig]);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // ============================================================================
  // STATO TAB 3: CATALOGO (Ricerca, Sort & Filtri Colonna, Dettaglio Media/Scheda Tecnica 🔍 & Modifica ✏️ con Watermark)
  // ============================================================================
  const [catGlobalSearch, setCatGlobalSearch] = useState('');
  const [catSortField, setCatSortField] = useState<string>('name');
  const [catSortDir, setCatSortDir] = useState<'asc' | 'desc'>('asc');
  const [catColFilters, setCatColFilters] = useState<Record<string, string>>({});
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [slideshowInput, setSlideshowInput] = useState('');

  // ============================================================================
  // STATO TAB 4: MONITORAGGIO PREZZI & NEGOZI ENTRO 30 KM DA CENTO (FE)
  // ============================================================================
  const [monSelectedCategories, setMonSelectedCategories] = useState<string[]>([]);
  const [monSelectedProductIds, setMonSelectedProductIds] = useState<string[]>([]);
  const [monStoreType, setMonStoreType] = useState<'tutti' | 'piccola_distribuzione' | 'catena'>('tutti');
  const [monChainOrStoreName, setMonChainOrStoreName] = useState('');
  const [monPostalCode, setMonPostalCode] = useState('');
  const [monCity, setMonCity] = useState('');
  const [monProvince, setMonProvince] = useState('');
  const [monRegion, setMonRegion] = useState('Emilia-Romagna');
  const [monCountry, setMonCountry] = useState('IT');
  const [monMaxDistanceKm, setMonMaxDistanceKm] = useState<number>(30);
  const [monTextQuery, setMonTextQuery] = useState('');
  const [monSortField, setMonSortField] = useState<'salePriceEur' | 'distanceKm' | 'eanCode' | 'descriptionIt' | 'lastScrapedAt'>('distanceKm');
  const [monSortDir, setMonSortDir] = useState<'asc' | 'desc'>('asc');
  const [isRunningScrape, setIsRunningScrape] = useState(false);

  // ============================================================================
  // STATO TAB 5: CONFIGURAZIONE
  // ============================================================================
  const [cfgMaxFreshKm, setCfgMaxFreshKm] = useState<number>(storeConfig.max_fresh_delivery_km || 50);
  const [cfgWatermarkEnabled, setCfgWatermarkEnabled] = useState<boolean>(true);
  const [cfgWatermarkText, setCfgWatermarkText] = useState<string>(
    '© BRACIAMI ANCORA · VIA PENZALE 25 CENTO (FE) · ANTI-BOT TRACE'
  );
  const [isSeedingDb, setIsSeedingDb] = useState(false);

  // Helper per estrarre i campi fiscali e anagrafici completi di un ordine
  const extractOrderFields = (o: Order) => {
    const parts = (o.customer.fullName || '').trim().split(/\s+/);
    const firstName = o.customer.firstName || parts[0] || '';
    const lastName = o.customer.lastName || parts.slice(1).join(' ') || '';
    const companyName = o.customer.companyName || (o.customer.isGuest ? 'Ospite Privato' : 'Privato');
    const vatNumber = o.customer.vatNumber || '-';
    const fiscalCode = o.customer.fiscalCode || 'BNRMRC82H14C469X';
    const address = o.customer.address || 'Via Penzale 25';
    const postalCode = o.customer.postalCode || '44042';
    const city = o.customer.city || 'Cento';
    const province = o.customer.province || 'FE';
    const countryCode = o.customer.countryCode || 'IT';
    const phone = o.customer.phone || '+39 051 6831000';
    const email = o.customer.email || 'cliente@braciamiancora.it';
    const dateOnly = (o.date || '').split(' ')[0];
    return {
      id: o.id,
      date: o.date,
      dateOnly,
      firstName,
      lastName,
      companyName,
      vatNumber,
      fiscalCode,
      address,
      postalCode,
      city,
      province,
      countryCode,
      phone,
      email,
      total: o.total,
      status: o.status,
      raw: o
    };
  };

  // Costruisce un oggetto Order con tutti i campi anagrafici, fiscali, logistici e articoli precompilati al 100%
  const hydrateOrderForModal = (o: Order): Order => {
    const f = extractOrderFields(o);
    const clonedItems = (o.items || []).map((it) => ({
      ...it,
      product: { ...it.product }
    }));
    const computedSubtotal = Number(
      clonedItems.reduce((sum, it) => sum + it.product.price * it.quantity, 0).toFixed(2)
    );
    return {
      ...o,
      subtotal: o.subtotal ?? computedSubtotal,
      discount: o.discount ?? 0,
      deliveryFee: o.deliveryFee ?? 0,
      deliveryMethod: o.deliveryMethod || 'ritiro_bottega',
      deliveryTimeSlot: o.deliveryTimeSlot || '12:30 (Ritiro Bottega Cento)',
      paymentMethod: o.paymentMethod || 'carta_credito',
      paymentStatus: o.paymentStatus || 'pagato',
      items: clonedItems,
      customer: {
        ...o.customer,
        firstName: f.firstName,
        lastName: f.lastName,
        fullName: `${f.firstName} ${f.lastName}`.trim() || o.customer.fullName,
        companyName: f.companyName,
        vatNumber: f.vatNumber,
        fiscalCode: f.fiscalCode,
        address: f.address,
        postalCode: f.postalCode,
        city: f.city,
        province: f.province,
        countryCode: f.countryCode,
        phone: f.phone,
        email: f.email
      }
    };
  };

  const openViewOrder = (o: Order) => {
    setViewingOrder(hydrateOrderForModal(o));
  };

  const openEditOrder = (o: Order) => {
    setEditingOrder(hydrateOrderForModal(o));
  };

  // Ordini Attivi (Tab 1)
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status !== 'completato' && o.status !== 'annullato'),
    [orders]
  );

  // Storico Ordini Filtrato & Ordinato (Tab 2)
  const filteredHistoricalOrders = useMemo(() => {
    const q = orderGlobalSearch.trim().toLowerCase();
    const minAmt = orderMinAmount !== '' ? Number(orderMinAmount) : null;
    const maxAmt = orderMaxAmount !== '' ? Number(orderMaxAmount) : null;

    const list = orders.map(extractOrderFields).filter((row) => {
      // Ricerca Globale su ogni elemento dell'ordine
      if (q) {
        const haystack = [
          row.id,
          row.date,
          row.firstName,
          row.lastName,
          row.companyName,
          row.vatNumber,
          row.fiscalCode,
          row.address,
          row.postalCode,
          row.city,
          row.province,
          row.countryCode,
          row.total.toFixed(2),
          row.status
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Range Date
      if (orderDateFrom && row.dateOnly < orderDateFrom) return false;
      if (orderDateTo && row.dateOnly > orderDateTo) return false;

      // Range Importi
      if (minAmt !== null && !Number.isNaN(minAmt) && row.total < minAmt) return false;
      if (maxAmt !== null && !Number.isNaN(maxAmt) && row.total > maxAmt) return false;

      // Filtri per singola colonna
      for (const [colKey, colVal] of Object.entries(orderColFilters)) {
        const cleanVal = colVal.trim().toLowerCase();
        if (!cleanVal) continue;
        const cellVal = String((row as any)[colKey] ?? '').toLowerCase();
        if (!cellVal.includes(cleanVal)) return false;
      }

      return true;
    });

    list.sort((a, b) => {
      const valA = (a as any)[orderSortField];
      const valB = (b as any)[orderSortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return orderSortDir === 'asc' ? valA - valB : valB - valA;
      }
      const strA = String(valA ?? '').toLowerCase();
      const strB = String(valB ?? '').toLowerCase();
      return orderSortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return list;
  }, [
    orders,
    orderGlobalSearch,
    orderDateFrom,
    orderDateTo,
    orderMinAmount,
    orderMaxAmount,
    orderColFilters,
    orderSortField,
    orderSortDir
  ]);

  const toggleOrderSort = (field: string) => {
    if (orderSortField === field) {
      setOrderSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderSortField(field);
      setOrderSortDir('asc');
    }
  };

  // Catalogo Filtrato & Ordinato (Tab 3)
  const filteredCatalog = useMemo(() => {
    const q = catGlobalSearch.trim().toLowerCase();

    const list = products
      .map((p) => ({
        id: p.id,
        ean: p.identification?.gtinEan || p.internationalCodes?.gtinEan13 || p.id,
        name: p.name,
        category: p.category,
        weight: p.weight || p.portion,
        price: p.price,
        origin: p.manufacturingOrigin?.city || 'Cento (FE)',
        watermark: p.antiScrapingWatermarkId || `WM-BA-${p.id.slice(0, 8).toUpperCase()}`,
        raw: p
      }))
      .filter((row) => {
        if (q) {
          const hay = [
            row.id,
            row.ean,
            row.name,
            row.category,
            row.weight,
            row.price.toFixed(2),
            row.origin
          ]
            .join(' ')
            .toLowerCase();
          if (!hay.includes(q)) return false;
        }
        for (const [colKey, colVal] of Object.entries(catColFilters)) {
          const clean = colVal.trim().toLowerCase();
          if (!clean) continue;
          const cell = String((row as any)[colKey] ?? '').toLowerCase();
          if (!cell.includes(clean)) return false;
        }
        return true;
      });

    list.sort((a, b) => {
      const valA = (a as any)[catSortField];
      const valB = (b as any)[catSortField];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return catSortDir === 'asc' ? valA - valB : valB - valA;
      }
      return catSortDir === 'asc'
        ? String(valA ?? '').localeCompare(String(valB ?? ''))
        : String(valB ?? '').localeCompare(String(valA ?? ''));
    });

    return list;
  }, [products, catGlobalSearch, catColFilters, catSortField, catSortDir]);

  const toggleCatSort = (field: string) => {
    if (catSortField === field) {
      setCatSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setCatSortField(field);
      setCatSortDir('asc');
    }
  };

  // Monitoraggio Prezzi Filtrato & Ordinato (Tab 4)
  const flattenedMonitoringRows = useMemo(() => {
    const allRows = localStores30Km.flatMap((store) => store.scrapedProducts);
    return allRows
      .filter((r) => {
        if (monSelectedCategories.length > 0 && !monSelectedCategories.includes(r.category)) {
          return false;
        }
        if (monSelectedProductIds.length > 0 && !monSelectedProductIds.includes(r.productId)) {
          return false;
        }
        if (monStoreType !== 'tutti' && r.storeType !== monStoreType) {
          return false;
        }
        if (
          monChainOrStoreName.trim() &&
          !`${r.storeName} ${r.chainName}`
            .toLowerCase()
            .includes(monChainOrStoreName.trim().toLowerCase())
        ) {
          return false;
        }
        if (monPostalCode.trim() && !r.postalCode.includes(monPostalCode.trim())) {
          return false;
        }
        if (monCity.trim() && !r.city.toLowerCase().includes(monCity.trim().toLowerCase())) {
          return false;
        }
        if (
          monProvince.trim() &&
          !r.province.toLowerCase().includes(monProvince.trim().toLowerCase())
        ) {
          return false;
        }
        if (monRegion.trim() && !r.region.toLowerCase().includes(monRegion.trim().toLowerCase())) {
          return false;
        }
        if (
          monCountry.trim() &&
          !r.country.toLowerCase().includes(monCountry.trim().toLowerCase())
        ) {
          return false;
        }
        if (r.distanceKm > monMaxDistanceKm) {
          return false;
        }
        if (
          monTextQuery.trim() &&
          !`${r.eanCode} ${r.descriptionIt} ${r.storeName} ${r.city}`
            .toLowerCase()
            .includes(monTextQuery.trim().toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const vA = a[monSortField];
        const vB = b[monSortField];
        if (typeof vA === 'number' && typeof vB === 'number') {
          return monSortDir === 'asc' ? vA - vB : vB - vA;
        }
        return monSortDir === 'asc'
          ? String(vA).localeCompare(String(vB))
          : String(vB).localeCompare(String(vA));
      });
  }, [
    localStores30Km,
    monSelectedCategories,
    monSelectedProductIds,
    monStoreType,
    monChainOrStoreName,
    monPostalCode,
    monCity,
    monProvince,
    monRegion,
    monCountry,
    monMaxDistanceKm,
    monTextQuery,
    monSortField,
    monSortDir
  ]);

  const handleToggleMonCategory = (cat: string) => {
    setMonSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleToggleMonProduct = (pid: string) => {
    setMonSelectedProductIds((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    );
  };

  const handleRunScrapingNow = async () => {
    setIsRunningScrape(true);
    try {
      await scheduleAndExecuteScraping({
        maxDistanceKm: monMaxDistanceKm,
        postalCode: monPostalCode || '44042',
        city: monCity || 'Tutti',
        province: monProvince || 'Tutte',
        region: monRegion || 'Emilia-Romagna',
        country: monCountry || 'IT',
        productCategory: monSelectedCategories.join(', ') || 'tutte',
        searchQuery: monTextQuery,
        storeType: monStoreType,
        frequency: scrapingFrequency
      });
    } finally {
      setIsRunningScrape(false);
    }
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setSlideshowInput((prod.slideshowUrls || [prod.imageUrl || '']).filter(Boolean).join('\n'));
  };

  const handleCreateNewProduct = () => {
    const newId = `prod-cento-${Date.now()}`;
    const blankProd: Product = {
      id: newId,
      name: 'Nuova Specialità Bottega di Cento',
      category: 'carne_fresca',
      portion: 'Porzione da 500 g',
      weight: '500 g',
      description: 'Descrizione dettagliata in italiano del prodotto...',
      price: 18.5,
      curator: 'Manuel',
      curatorNote: 'Selezionato personalmente a Cento (FE)',
      cookingTime: '10 minuti',
      isReadyToEat: false,
      tags: ['Novità Bottega'],
      allergens: [],
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      slideshowUrls: [
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
      ],
      youtubeVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      googleSlidesUrl: 'https://docs.google.com/presentation/d/e/2PACX-1vR/embed',
      technicalSheetSummary:
        'Scheda Tecnica Certificata · Stabilimento Via Penzale 25, 44042 Cento (FE) · Tracciabilità Lotto & Catena del Freddo.',
      antiScrapingWatermarkId: `WM-BA-${Date.now().toString(16).toUpperCase()}`
    };
    handleOpenEditProduct(blankProd);
  };

  const handleSaveEditedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const urls = slideshowInput
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);
    const updated: Product = {
      ...editingProduct,
      imageUrl: editingProduct.imageUrl || urls[0] || '',
      slideshowUrls: urls
    };
    await saveProductToCatalog(updated);
    setEditingProduct(null);
  };

  const handleSaveEditedOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;
    await updateOrder(editingOrder);
    setEditingOrder(null);
  };

  const handleSeedAllFirebaseTables = async () => {
    setIsSeedingDb(true);
    try {
      await FirestoreService.seedDatabaseIfEmpty();
      await refreshUiElements();
      showToast(
        'Database Firebase sincronizzato con successo (inclusa tabella local_grocery_stores_30km)!'
      );
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSeedingDb(false);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ComponentType<any>; badge?: number }[] = [
    {
      id: 'ordini_attivi',
      label: 'Ordini Attivi',
      icon: ClipboardList,
      badge: activeOrders.length
    },
    {
      id: 'storico_ordini',
      label: 'Storico Ordini',
      icon: History,
      badge: orders.length
    },
    {
      id: 'catalogo',
      label: 'Catalogo',
      icon: ShoppingBag,
      badge: products.length
    },
    {
      id: 'monitoraggio',
      label: 'Monitoraggio (30 km)',
      icon: Radar,
      badge: localStores30Km.length
    },
    {
      id: 'configurazione',
      label: 'Configurazione',
      icon: Sliders
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5 text-stone-900">
      {/* Top Admin Header Banner (Strictly in Italian) */}
      <div className="bg-stone-950 text-stone-100 rounded-3xl p-4 sm:p-6 border border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-[11px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Console Amministratore · Lingua Ufficiale: Italiano (IT)</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-black mt-0.5">
            Braciami Ancora · Via Penzale 25, 44042 Cento (FE)
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Gestione Ordini Attivi, Storico Completo, Catalogo con Watermark Anti-Scraping, Monitoraggio Prezzi 30 km e Configurazione.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={playFraMartinoMelody}
            className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Suona il carillon Fra Martino Campanaro"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Suona Fra Martino 🔔</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              await logOut();
              resetToLocale();
              adminLogout();
            }}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-rose-950 text-stone-200 hover:text-rose-300 border border-stone-700 text-xs font-bold cursor-pointer transition-colors"
          >
            Esci dall&apos;account
          </button>
        </div>
      </div>

      {/* 5 Main Administrator Tabs (Flex-Wrap & Fluid Compact Sizing so all 5 tabs are 100% readable on every display/orientation) */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = adminActiveTab === t.tab || adminActiveTab === t.id;
          return (
            <button
              key={t.id}
              id={`admin_tab_btn_${t.id}`}
              onClick={() => setAdminActiveTab(t.id)}
              className={`px-3 sm:px-3.5 py-2 rounded-2xl text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 leading-tight transition-all cursor-pointer border ${
                isActive
                  ? 'bg-stone-950 text-amber-400 border-stone-950 shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t.label}</span>
              {typeof t.badge === 'number' && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono ${
                    isActive ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1 (PRINCIPALE): ORDINI ATTIVI
         ===================================================================== */}
      {adminActiveTab === 'ordini_attivi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-black text-stone-950">
                  Comande & Ordini Attivi in Lavorazione ({activeOrders.length})
                </h2>
                <p className="text-xs text-stone-500">
                  Avanza lo stato di preparazione, griglia e consegna in tempo reale o apri il dettaglio/modifica.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAdminActiveTab('storico_ordini')}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 self-start cursor-pointer"
              >
                <History className="w-4 h-4 text-amber-600" />
                <span>Vai allo Storico Completo ({orders.length})</span>
              </button>
            </div>

            {activeOrders.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-sm">
                Nessun ordine attivo in attesa. Tutti gli ordini sono stati completati!
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {activeOrders.map((ord) => {
                  const f = extractOrderFields(ord);
                  return (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-stone-200 bg-stone-50/70 p-4 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="font-mono text-sm font-black text-stone-950">
                              Ordine #{ord.id}
                            </span>
                            <span className="ml-2 text-xs text-stone-500 font-mono">{ord.date}</span>
                            <div className="text-xs font-bold text-stone-800 mt-0.5">
                              {f.firstName} {f.lastName} ·{' '}
                              <span className="text-amber-700">{f.companyName}</span>
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {f.address}, {f.postalCode} {f.city} ({f.province}) · Tel:{' '}
                              {ord.customer.phone}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-base font-black text-amber-700">
                              €{ord.total.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => openViewOrder(ord)}
                              title="Dettaglio Ordine"
                              className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-stone-300 text-stone-700 cursor-pointer"
                            >
                              <Search className="w-4 h-4 text-amber-600" />
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditOrder(ord)}
                              title="Modifica / Annulla Ordine"
                              className="p-2 rounded-xl bg-white hover:bg-amber-50 border border-stone-300 text-stone-700 cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 text-stone-700" />
                            </button>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-2.5 border border-stone-200 divide-y divide-stone-100 text-xs">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-1 flex items-center justify-between gap-2">
                              <div>
                                <strong>{it.quantity}x</strong> {it.product.name}
                                {it.specialInstructions && (
                                  <span className="block text-[10px] text-amber-700 italic">
                                    Nota: {it.specialInstructions}
                                  </span>
                                )}
                              </div>
                              <span className="font-mono font-bold">
                                €{(it.product.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Status Progression */}
                      <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          Stato: <strong className="text-stone-900">{ord.status}</strong>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {(
                            [
                              { st: 'ricevuto', label: 'Ricevuto' },
                              { st: 'in_griglia', label: 'In Griglia 🔥' },
                              { st: 'pronto', label: 'Pronto ✅' },
                              { st: 'in_consegna', label: 'In Consegna 🚚' },
                              { st: 'completato', label: 'Completato' }
                            ] as { st: OrderStatus; label: string }[]
                          ).map((btn) => (
                            <button
                              key={btn.st}
                              type="button"
                              onClick={() => updateOrderStatus(ord.id, btn.st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
                                ord.status === btn.st
                                  ? 'bg-amber-500 text-stone-950 border-amber-600'
                                  : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300'
                              }`}
                            >
                              {btn.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: STORICO ORDINI (Header ricerca omni-campo + Sort/Filtro per colonna + 🔍 e ✏️)
         ===================================================================== */}
      {adminActiveTab === 'storico_ordini' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black text-stone-950">
                Storico Ordini Completo ({filteredHistoricalOrders.length} di {orders.length})
              </h2>
              <p className="text-xs text-stone-500">
                Cerca qualsiasi dato (nome, cognome, ragione sociale, P.IVA, CF, indirizzo, CAP, comune, provincia, paese, data, importo) o filtra/ordina ogni colonna.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOrderGlobalSearch('');
                setOrderDateFrom('');
                setOrderDateTo('');
                setOrderMinAmount('');
                setOrderMaxAmount('');
                setOrderColFilters({});
              }}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold self-start cursor-pointer"
            >
              Azzera tutti i filtri
            </button>
          </div>

          {/* Header Search & Date/Amount Range Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
            <div className="md:col-span-4">
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Ricerca Globale (Nome, P.IVA, CF, Indirizzo, Comune, ecc.)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderGlobalSearch}
                  onChange={(e) => setOrderGlobalSearch(e.target.value)}
                  placeholder="Cerca nome, cognome, ragione sociale, P.IVA, CF, CAP..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Da Data
              </label>
              <input
                type="date"
                value={orderDateFrom}
                onChange={(e) => setOrderDateFrom(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                A Data
              </label>
              <input
                type="date"
                value={orderDateTo}
                onChange={(e) => setOrderDateTo(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Importo Min (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={orderMinAmount}
                onChange={(e) => setOrderMinAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                Importo Max (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={orderMaxAmount}
                onChange={(e) => setOrderMaxAmount(e.target.value)}
                placeholder="999.00"
                className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
              />
            </div>
          </div>

          {/* Sortable & Column-Filterable Grid */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-stone-100">
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'date', label: 'Data' },
                    { key: 'firstName', label: 'Nome' },
                    { key: 'lastName', label: 'Cognome' },
                    { key: 'companyName', label: 'Ragione Sociale' },
                    { key: 'vatNumber', label: 'Partita IVA' },
                    { key: 'fiscalCode', label: 'Codice Fiscale' },
                    { key: 'address', label: 'Indirizzo' },
                    { key: 'postalCode', label: 'CAP' },
                    { key: 'city', label: 'Comune' },
                    { key: 'province', label: 'Prov.' },
                    { key: 'countryCode', label: 'Paese' },
                    { key: 'total', label: 'Importo €' },
                    { key: 'status', label: 'Stato' }
                  ].map((col) => (
                    <th key={col.key} className="p-2.5 align-top border-r border-stone-800 min-w-[105px]">
                      <button
                        type="button"
                        onClick={() => toggleOrderSort(col.key)}
                        className="w-full flex items-center justify-between gap-1 font-extrabold text-[11px] uppercase tracking-wider text-amber-400 hover:text-white cursor-pointer mb-1.5"
                      >
                        <span>{col.label}</span>
                        <ArrowUpDown className="w-3 h-3 shrink-0" />
                      </button>
                      <input
                        type="text"
                        value={orderColFilters[col.key] || ''}
                        onChange={(e) =>
                          setOrderColFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                        }
                        placeholder={`Filtra...`}
                        className="w-full px-2 py-1 rounded bg-stone-800 text-stone-100 border border-stone-700 text-[10px] font-normal"
                      />
                    </th>
                  ))}
                  <th className="p-2.5 text-center font-extrabold text-[11px] uppercase tracking-wider text-amber-400 border-r border-stone-800 w-14">
                    Dett.
                  </th>
                  <th className="p-2.5 text-center font-extrabold text-[11px] uppercase tracking-wider text-amber-400 w-14">
                    Mod.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredHistoricalOrders.map((row) => (
                  <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-2.5 font-mono font-bold text-stone-900">{row.id}</td>
                    <td className="p-2.5 font-mono text-[11px] whitespace-nowrap">{row.date}</td>
                    <td className="p-2.5 font-semibold">{row.firstName}</td>
                    <td className="p-2.5 font-semibold">{row.lastName}</td>
                    <td className="p-2.5">{row.companyName}</td>
                    <td className="p-2.5 font-mono text-[11px]">{row.vatNumber}</td>
                    <td className="p-2.5 font-mono text-[11px]">{row.fiscalCode}</td>
                    <td className="p-2.5">{row.address}</td>
                    <td className="p-2.5 font-mono">{row.postalCode}</td>
                    <td className="p-2.5 font-semibold">{row.city}</td>
                    <td className="p-2.5 font-mono">{row.province}</td>
                    <td className="p-2.5 font-mono">{row.countryCode}</td>
                    <td className="p-2.5 font-mono font-black text-amber-800">
                      €{row.total.toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          row.status === 'annullato'
                            ? 'bg-rose-100 text-rose-800'
                            : row.status === 'completato'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    {/* Penultima colonna: Lente di ingrandimento per il dettaglio dell'ordine */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => openViewOrder(row.raw)}
                        title="Visualizza Dettaglio Ordine"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <Search className="w-4 h-4 text-amber-700" />
                      </button>
                    </td>
                    {/* Ultima colonna: Matita per modifica / annullamento ordine */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => openEditOrder(row.raw)}
                        title="Modifica o Annulla Ordine"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4 text-stone-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: CATALOGO (Stessa logica griglia con Sort/Filtro + 🔍 e ✏️ + Slideshow, YouTube, Google Slides, Scheda Tecnica e Watermark Anti-Scraping)
         ===================================================================== */}
      {adminActiveTab === 'catalogo' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-black text-stone-950">
                Catalogo Prodotti & Media Protetti da Watermark ({filteredCatalog.length})
              </h2>
              <p className="text-xs text-stone-500">
                Gestisci foto, slideshow, video YouTube, presentazioni Google Slides e scheda tecnica. Tutti gli elementi sono protetti da Watermark dinamico anti-scraping.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNewProduct}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Nuovo Prodotto</span>
            </button>
          </div>

          {/* Search Header */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={catGlobalSearch}
                onChange={(e) => setCatGlobalSearch(e.target.value)}
                placeholder="Cerca per codice EAN, nome prodotto, categoria, peso, stabilimento..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-300 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setCatGlobalSearch('');
                setCatColFilters({});
              }}
              className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer shrink-0"
            >
              Reset Filtri
            </button>
          </div>

          {/* Sortable & Filterable Catalog Grid */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-900 text-stone-100">
                  <th className="p-2.5 border-r border-stone-800 w-24">Foto + WM</th>
                  {[
                    { key: 'ean', label: 'Codice EAN / PLU' },
                    { key: 'name', label: 'Descrizione Prodotto (IT)' },
                    { key: 'category', label: 'Categoria' },
                    { key: 'weight', label: 'Peso / Unità' },
                    { key: 'price', label: 'Prezzo €' },
                    { key: 'watermark', label: 'Watermark Anti-Bot' }
                  ].map((col) => (
                    <th key={col.key} className="p-2.5 align-top border-r border-stone-800 min-w-[120px]">
                      <button
                        type="button"
                        onClick={() => toggleCatSort(col.key)}
                        className="w-full flex items-center justify-between gap-1 font-extrabold text-[11px] uppercase tracking-wider text-amber-400 hover:text-white cursor-pointer mb-1.5"
                      >
                        <span>{col.label}</span>
                        <ArrowUpDown className="w-3 h-3 shrink-0" />
                      </button>
                      <input
                        type="text"
                        value={catColFilters[col.key] || ''}
                        onChange={(e) =>
                          setCatColFilters((prev) => ({ ...prev, [col.key]: e.target.value }))
                        }
                        placeholder="Filtra..."
                        className="w-full px-2 py-1 rounded bg-stone-800 text-stone-100 border border-stone-700 text-[10px] font-normal"
                      />
                    </th>
                  ))}
                  <th className="p-2.5 text-center font-extrabold text-[11px] uppercase tracking-wider text-amber-400 border-r border-stone-800 w-14">
                    Dett.
                  </th>
                  <th className="p-2.5 text-center font-extrabold text-[11px] uppercase tracking-wider text-amber-400 w-14">
                    Mod.
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {filteredCatalog.map((row) => (
                  <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-2">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-stone-300 bg-stone-900">
                        <img
                          src={row.raw.imageUrl}
                          alt={row.name}
                          className="w-full h-full object-cover"
                        />
                        <AntiScrapingWatermark
                          productId={row.id}
                          eanCode={row.ean}
                          assetType="IMAGE"
                          customWatermarkId={row.watermark}
                        />
                      </div>
                    </td>
                    <td className="p-2.5 font-mono font-bold text-stone-800">{row.ean}</td>
                    <td className="p-2.5 font-bold text-stone-950">{row.name}</td>
                    <td className="p-2.5">{row.category}</td>
                    <td className="p-2.5 font-mono">{row.weight}</td>
                    <td className="p-2.5 font-mono font-black text-amber-800">
                      €{row.price.toFixed(2)}
                    </td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-amber-400 font-mono text-[10px] font-bold">
                        🔒 {row.watermark}
                      </span>
                    </td>
                    {/* Penultima colonna: Lente d'ingrandimento per visualizzare Scheda Tecnica, Slideshow, YouTube e Google Slides con Watermark */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => setViewingProduct(row.raw)}
                        title="Visualizza Scheda Tecnica, Slideshow, YouTube & Google Slides"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <Search className="w-4 h-4 text-amber-700" />
                      </button>
                    </td>
                    {/* Ultima colonna: Matita per modificare Immagini, Slideshow, YouTube, Google Slides e Scheda Tecnica */}
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditProduct(row.raw)}
                        title="Modifica Prodotto, Media, Video YouTube, Google Slides e Scheda Tecnica"
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-stone-800 border border-stone-300 cursor-pointer inline-flex items-center justify-center"
                      >
                        <Pencil className="w-4 h-4 text-stone-700" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MONITORAGGIO PREZZI & NEGOZI ALIMENTARI ENTRO 30 KM DA CENTO (FE)
         ===================================================================== */}
      {adminActiveTab === 'monitoraggio' && (
        <div className="space-y-5">
          {/* Pannello Filtri di Monitoraggio & Schedulazione Scraping */}
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Tabella Firebase: local_grocery_stores_30km · Raggio 30 km da Via Penzale 25, 44042 Cento FE
                </span>
                <h2 className="font-display text-lg sm:text-xl font-black text-stone-950">
                  Monitoraggio Prezzi Competitor & Schedulazione Scraping ({flattenedMonitoringRows.length} rilevazioni)
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
                  Frequenza attiva: <strong>{scrapingFrequency.replace(/_/g, ' ')}</strong>
                </span>
                <button
                  type="button"
                  disabled={isRunningScrape}
                  onClick={handleRunScrapingNow}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunningScrape ? 'Scraping in corso...' : 'Schedula / Esegui Scraping Ora'}</span>
                </button>
              </div>
            </div>

            {/* 1. Selezione Categorie di Prodotti */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                1. Seleziona Categorie di Prodotti (clicca una o più categorie, vuoto = tutte):
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'piatti_pronti', label: 'Piatti Pronti Caldi' },
                  { id: 'carne_fresca', label: 'Carni Fresche & Frollate' },
                  { id: 'cestini_box', label: 'Cestini & Box' },
                  { id: 'gastronomia_vini', label: 'Gastronomia & Vini' },
                  { id: 'dispensa_standard', label: 'Dispensa & Specialità EAN' }
                ].map((cat) => {
                  const selected = monSelectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleMonCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                        selected
                          ? 'bg-stone-900 text-amber-400 border-stone-900'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
                {monSelectedCategories.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setMonSelectedCategories([])}
                    className="px-2.5 py-1.5 text-xs text-rose-600 font-bold underline cursor-pointer"
                  >
                    Tutte le categorie
                  </button>
                )}
              </div>
            </div>

            {/* 2. Selezione di Uno o Più Prodotti */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                2. Seleziona Uno o Più Prodotti Specifici ({monSelectedProductIds.length || 'Tutti'} selezionati):
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {products.map((p) => {
                  const active = monSelectedProductIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleToggleMonProduct(p.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Filtri Tipologia Negozio, Catena, Area Geografica (CAP, Comune, Provincia, Regione, Paese, Distanza km) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Tipologia di Negozio
                </label>
                <select
                  value={monStoreType}
                  onChange={(e) => setMonStoreType(e.target.value as any)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold"
                >
                  <option value="tutti">Tutti (Piccola Distribuzione + Catene)</option>
                  <option value="piccola_distribuzione">Piccola Distribuzione (Botteghe/Salumerie)</option>
                  <option value="catena">Catena / GDO (Conad, Coop, Lidl, ecc.)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Nome Negozio / Catena
                </label>
                <input
                  type="text"
                  value={monChainOrStoreName}
                  onChange={(e) => setMonChainOrStoreName(e.target.value)}
                  placeholder="Es. Conad, Coop, Lidl, Salumeria..."
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  CAP (es. 44042, 40066, 40017)
                </label>
                <input
                  type="text"
                  value={monPostalCode}
                  onChange={(e) => setMonPostalCode(e.target.value)}
                  placeholder="Filtra CAP..."
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Comune (es. Cento, Pieve, Finale...)
                </label>
                <input
                  type="text"
                  value={monCity}
                  onChange={(e) => setMonCity(e.target.value)}
                  placeholder="Filtra Comune..."
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Provincia (FE, BO, MO)
                </label>
                <input
                  type="text"
                  value={monProvince}
                  onChange={(e) => setMonProvince(e.target.value)}
                  placeholder="Es. FE, BO, MO"
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Regione & Paese
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={monRegion}
                    onChange={(e) => setMonRegion(e.target.value)}
                    placeholder="Regione"
                    className="flex-1 min-w-0 px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                  />
                  <input
                    type="text"
                    value={monCountry}
                    onChange={(e) => setMonCountry(e.target.value)}
                    placeholder="IT"
                    className="w-14 px-2 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Distanza Max da Via Penzale 25: {monMaxDistanceKm} km
                </label>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={monMaxDistanceKm}
                  onChange={(e) => setMonMaxDistanceKm(Number(e.target.value))}
                  className="w-full accent-amber-500 mt-1.5"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                  Ricerca Testuale / Codice EAN
                </label>
                <input
                  type="text"
                  value={monTextQuery}
                  onChange={(e) => setMonTextQuery(e.target.value)}
                  placeholder="Cerca EAN o descrizione..."
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-stone-300 text-xs"
                />
              </div>
            </div>

            {/* Tabella Risultati Monitoraggio: Codice EAN, Descrizione in Italiano, Prezzo di Vendita, Data di Ultimo Scraping */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-900 text-stone-100">
                    <th className="p-2.5 border-r border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setMonSortField('eanCode');
                          setMonSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        }}
                        className="flex items-center gap-1 font-extrabold text-[11px] uppercase text-amber-400 cursor-pointer"
                      >
                        <span>Codice EAN</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="p-2.5 border-r border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setMonSortField('descriptionIt');
                          setMonSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        }}
                        className="flex items-center gap-1 font-extrabold text-[11px] uppercase text-amber-400 cursor-pointer"
                      >
                        <span>Descrizione Prodotto (IT)</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="p-2.5 border-r border-stone-800">Tipologia & Nome Negozio / Catena</th>
                    <th className="p-2.5 border-r border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setMonSortField('distanceKm');
                          setMonSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        }}
                        className="flex items-center gap-1 font-extrabold text-[11px] uppercase text-amber-400 cursor-pointer"
                      >
                        <span>Area Geografica (CAP, Comune, Prov, Dist.)</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="p-2.5 border-r border-stone-800">
                      <button
                        type="button"
                        onClick={() => {
                          setMonSortField('salePriceEur');
                          setMonSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        }}
                        className="flex items-center gap-1 font-extrabold text-[11px] uppercase text-amber-400 cursor-pointer"
                      >
                        <span>Prezzo Vendita (€)</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="p-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMonSortField('lastScrapedAt');
                          setMonSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
                        }}
                        className="flex items-center gap-1 font-extrabold text-[11px] uppercase text-amber-400 cursor-pointer"
                      >
                        <span>Data Ultimo Scraping</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {flattenedMonitoringRows.slice(0, 120).map((r) => {
                    const diff = r.salePriceEur - r.ourPriceEur;
                    return (
                      <tr key={r.id} className="hover:bg-amber-50/40">
                        <td className="p-2.5 font-mono font-bold text-stone-900">{r.eanCode}</td>
                        <td className="p-2.5 font-bold text-stone-950">{r.descriptionIt}</td>
                        <td className="p-2.5">
                          <div className="font-bold text-stone-900">{r.storeName}</div>
                          <span
                            className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.storeType === 'catena'
                                ? 'bg-sky-100 text-sky-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {r.storeType === 'catena'
                              ? `Catena (${r.chainName})`
                              : 'Piccola Distribuzione'}
                          </span>
                        </td>
                        <td className="p-2.5 text-stone-700">
                          <span className="font-mono font-bold">{r.postalCode}</span> {r.city} ({r.province}) ·{' '}
                          {r.region} ({r.country}) ·{' '}
                          <strong className="text-amber-800">{r.distanceKm} km</strong>
                        </td>
                        <td className="p-2.5 font-mono">
                          <div className="font-black text-sm text-stone-950">
                            €{r.salePriceEur.toFixed(2)}
                          </div>
                          <div
                            className={`text-[10px] font-bold ${
                              diff >= 0 ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            Nostro: €{r.ourPriceEur.toFixed(2)} (
                            {diff >= 0 ? `+€${diff.toFixed(2)}` : `-€${Math.abs(diff).toFixed(2)}`})
                          </div>
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-stone-600">
                          {new Date(r.lastScrapedAt).toLocaleString('it-IT')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registro Job di Scraping Schedulati */}
          <div className="bg-white rounded-3xl border border-stone-200 p-4 sm:p-6 shadow-xs space-y-3">
            <h3 className="font-display text-base font-black text-stone-950">
              Storico & Coda Schedulazioni Scraping ({scrapingJobs.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scrapingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-stone-900">
                      Raggio {job.maxDistanceKm} km · {job.city} ({job.province}) · {job.region}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Categoria: {job.productCategory} · Tipo: {job.storeType} · Frequenza:{' '}
                      {job.frequency}
                    </div>
                    <div className="text-[10px] font-mono text-stone-400 mt-0.5">
                      Eseguito: {new Date(job.lastRunAt).toLocaleString('it-IT')}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[11px] shrink-0">
                    {job.recordsFoundCount} prezzi EAN
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 5: CONFIGURAZIONE (Frequenza di Scraping, Parametri Raggio 30km, Watermark Anti-Bot & Sync Firebase)
         ===================================================================== */}
      {adminActiveTab === 'configurazione' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="font-display text-lg sm:text-xl font-black text-stone-950">
              Configurazione Frequenza di Scraping & Parametri Bottega
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                Frequenza Automatica di Scraping Prezzi Competitor (entro 30 km da Cento)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    { id: 'ogni_6_ore', label: 'Ogni 6 Ore' },
                    { id: 'ogni_12_ore', label: 'Ogni 12 Ore' },
                    { id: 'giornaliero', label: 'Giornaliero (03:00)' },
                    { id: 'settimanale', label: 'Settimanale' },
                    { id: 'manuale', label: 'Solo Manuale' }
                  ] as { id: ScrapingFrequency; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setScrapingFrequency(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                      scrapingFrequency === opt.id
                        ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-xs'
                        : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-200">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                Distanza Massima Consegna Cibi Freschi / Caldi da Via Penzale 25, Cento (km)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={cfgMaxFreshKm}
                  onChange={(e) => setCfgMaxFreshKm(Number(e.target.value))}
                  className="w-28 px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono font-bold"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await FirestoreService.updateStoreConfig({
                      max_fresh_delivery_km: cfgMaxFreshKm,
                      anti_scraping_watermark_enabled: cfgWatermarkEnabled,
                      anti_scraping_watermark_text: cfgWatermarkText
                    });
                    await refreshUiElements();
                    showToast('Configurazione Bottega salvata su Firebase!');
                  }}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salva Parametri</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-3 border-t border-stone-200">
              <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                Protezione Watermark Anti-Scraping (Immagini, Slideshow, YouTube, Google Slides, Scheda Tecnica)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={cfgWatermarkEnabled}
                  onChange={(e) => setCfgWatermarkEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="text-xs font-semibold text-stone-700">
                  Attiva Watermark Forense Dinamico su tutti gli asset multimediali e tecnici
                </span>
              </div>
              <input
                type="text"
                value={cfgWatermarkText}
                onChange={(e) => setCfgWatermarkText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="font-display text-lg font-black text-stone-950 flex items-center gap-2">
              <Database className="w-5 h-5 text-amber-600" />
              <span>Stato Tabelle Firebase Firestore</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              La collezione <code>local_grocery_stores_30km</code> contiene{' '}
              <strong>{localStores30Km.length} negozi di alimentari</strong> geolocalizzati in un raggio di 30 km da{' '}
              <strong>Via Penzale 25, 44042 Cento FE</strong> (province di FE, BO, MO).
            </p>
            <button
              type="button"
              disabled={isSeedingDb}
              onClick={handleSeedAllFirebaseTables}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isSeedingDb ? 'animate-spin' : ''}`} />
              <span>
                {isSeedingDb
                  ? 'Sincronizzazione Tabelle Firebase...'
                  : 'Sincronizza / Popola Tutte le Tabelle Firebase (30 km)'}
              </span>
            </button>

            {/* Audit Log: configurazione -> accessoAdmin */}
            <div className="mt-4 pt-4 border-t border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                  Tabella &quot;configurazione&quot; &rarr; key &quot;accessoAdmin&quot;
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Attivo su Firebase
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-stone-900 text-stone-100 font-mono text-[11px] space-y-1 border border-stone-800">
                <div>
                  <span className="text-amber-400 font-bold">lastUser:</span>{' '}
                  <span>{accessoAdminLog?.lastUser || 'diegocimarosa@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">timeStamp:</span>{' '}
                  <span>{accessoAdminLog?.timeStamp || new Date().toISOString()}</span>
                </div>
                <div>
                  <span className="text-amber-400 font-bold">fromIp:</span>{' '}
                  <span>{accessoAdminLog?.fromIp || '127.0.0.1'}</span>
                </div>
                <div className="break-all">
                  <span className="text-amber-400 font-bold">browser:</span>{' '}
                  <span className="text-stone-300">{accessoAdminLog?.browser || navigator.userAgent}</span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              CONFIGURAZIONE SLIDINGS (Tabella "configurazione", key "slidings" JSON su Firebase)
             ===================================================================== */}
          <div className="lg:col-span-12 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Tabella Firebase &quot;configurazione&quot; &rarr; key &quot;slidings&quot; (JSON)
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black text-stone-950">
                  Configurazione Sliding Carousel Header (3ª Riga Header &amp; Pagine)
                </h3>
                <p className="text-xs text-stone-600">
                  Ogni elemento contiene: <code>nome</code>, <code>bucketPath</code> (path cartella immagini su Firestore/Storage),{' '}
                  <code>descrizione</code> (JSON array con <code>nomePulsante</code> che appare sotto l&apos;immagine e{' '}
                  <code>descrizione</code> appropriata), <code>riferimentoPagina</code> (dove deve apparire: es.{' '}
                  <code>tutte</code>, <code>home</code>, <code>catalogo</code>, <code>fiere-eventi</code>) e{' '}
                  <code>tempoDiSliding</code> (ms).
                </p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  try {
                    setSlidingsJsonError(null);
                    const parsed = JSON.parse(slidingsJsonText);
                    const list = Array.isArray(parsed) ? parsed : [parsed];
                    await saveSlidingsConfig(list);
                  } catch (e: any) {
                    setSlidingsJsonError(`Errore formato JSON: ${e?.message || 'JSON non valido'}`);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 self-start"
              >
                <Save className="w-4 h-4" />
                <span>Salva JSON &quot;slidings&quot; su Firebase</span>
              </button>
            </div>

            {slidingsJsonError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
                {slidingsJsonError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Anteprima Riepilogativa degli Slidings Attivi */}
              <div className="lg:col-span-5 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-700">
                  Slidings Configurati ({slidingsConfig.length})
                </h4>
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {slidingsConfig.map((sl, idx) => (
                    <div
                      key={sl.id || idx}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="font-bold text-stone-950">{sl.nome}</strong>
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                          pag: {sl.riferimentoPagina} · {sl.tempoDiSliding}ms
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-stone-500 truncate">
                        bucketPath: {sl.bucketPath}
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(sl.descrizione || []).map((imgItem, i) => (
                          <span
                            key={imgItem.id || i}
                            className="px-2 py-0.5 rounded bg-white border border-stone-300 text-[10px] font-semibold text-stone-800"
                            title={imgItem.descrizione}
                          >
                            🔘 {imgItem.nomePulsante}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editor JSON Diretto per configurazione -> slidings */}
              <div className="lg:col-span-7 space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-stone-700 block">
                  Editor JSON (configurazione &rarr; key &quot;slidings&quot;)
                </label>
                <textarea
                  rows={16}
                  value={slidingsJsonText}
                  onChange={(e) => setSlidingsJsonText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-stone-950 text-amber-300 font-mono text-xs border border-stone-800 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* =====================================================================
              GESTIONE TABELLA FIREBASE "newsletter" (RISERVATA SOLO AGLI AMMINISTRATORI)
             ===================================================================== */}
          <div className="lg:col-span-12 bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Tabella Firebase &quot;newsletter&quot; · Gestione Riservata SOLO agli Amministratori
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black text-stone-950">
                  Iscritti Newsletter, Email di Conferma Benvenuto &amp; Disiscrizioni di Legge ({newsletterSubscribers.length})
                </h3>
                <p className="text-xs text-stone-600">
                  Ogni iscrizione invia automaticamente l&apos;email con oggetto{' '}
                  <strong>&quot;Grazie per l&apos;iscrizione alla newsletter di Braciami Ancora - Cento&quot;</strong> e i link di
                  legge in fondo per la disiscrizione immediata (Art. 7 e 21 GDPR UE 2016/679).
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const clean = adminNewNewsletterEmail.trim();
                  if (!clean) return;
                  subscribeNewsletter(clean);
                  setAdminNewNewsletterEmail('');
                }}
                className="flex items-center gap-2 shrink-0"
              >
                <input
                  type="email"
                  required
                  value={adminNewNewsletterEmail}
                  onChange={(e) => setAdminNewNewsletterEmail(e.target.value)}
                  placeholder="Aggiungi e invia benvenuto..."
                  className="px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs cursor-pointer"
                >
                  + Iscrivi &amp; Invia Email
                </button>
              </form>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-stone-900 text-stone-100">
                    <th className="p-2.5 border-r border-stone-800">Email Iscritto</th>
                    <th className="p-2.5 border-r border-stone-800">Data Iscrizione</th>
                    <th className="p-2.5 border-r border-stone-800">Stato</th>
                    <th className="p-2.5 border-r border-stone-800">Email Benvenuto Inviata</th>
                    <th className="p-2.5 border-r border-stone-800">Link di Legge Disiscrizione</th>
                    <th className="p-2.5 text-center">Azioni Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 bg-white">
                  {newsletterSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-amber-50/40">
                      <td className="p-2.5 font-mono font-bold text-stone-900">{sub.email}</td>
                      <td className="p-2.5 font-mono text-[11px] text-stone-600">
                        {new Date(sub.subscribedAt).toLocaleString('it-IT')}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            sub.status === 'attivo'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <button
                          type="button"
                          onClick={() => setLastSentNewsletterRecord(sub)}
                          className="text-amber-800 hover:underline font-bold cursor-pointer"
                        >
                          📧 Vedi Email &quot;Grazie per l&apos;iscrizione...&quot;
                        </button>
                      </td>
                      <td className="p-2.5 font-mono text-[10px] text-stone-500 max-w-xs truncate">
                        {sub.legalUnsubscribeUrl}
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          {sub.status === 'attivo' ? (
                            <button
                              type="button"
                              onClick={() => unsubscribeNewsletterByEmail(sub.email)}
                              className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] cursor-pointer"
                            >
                              Disiscrivi
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => subscribeNewsletter(sub.email)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[10px] cursor-pointer"
                            >
                              Riattiva &amp; Invia Email
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => deleteNewsletterSubscriber(sub.id)}
                            title="Elimina dalla tabella Firebase newsletter"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE LENTE DI INGRANDIMENTO (🔍): DETTAGLIO COMPLETO ORDINE
         ===================================================================== */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-[250] bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 border border-stone-200 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Dettaglio Completo Ordine · Scheda Anagrafica, Fiscale, Logistica & Comanda
                </span>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <h3 className="font-display text-lg sm:text-xl font-black text-stone-950">
                    Ordine #{viewingOrder.id}
                  </h3>
                  <span className="font-mono text-xs text-stone-500">· {viewingOrder.date}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      viewingOrder.status === 'annullato'
                        ? 'bg-rose-100 text-rose-800'
                        : viewingOrder.status === 'completato'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Stato: {viewingOrder.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const ordToEdit = viewingOrder;
                    setViewingOrder(null);
                    openEditOrder(ordToEdit);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Modifica Ordine</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 cursor-pointer"
                  aria-label="Chiudi dettaglio"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {(() => {
              const vf = extractOrderFields(viewingOrder);
              return (
                <div className="space-y-3">
                  {/* Blocco 1: Dati Anagrafici, Fiscali e Contatti */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Nome</span>
                      <strong className="text-stone-900">{vf.firstName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Cognome</span>
                      <strong className="text-stone-900">{vf.lastName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Ragione Sociale</span>
                      <strong className="text-amber-800">{vf.companyName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Partita IVA</span>
                      <strong className="font-mono text-stone-900">{vf.vatNumber}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Codice Fiscale</span>
                      <strong className="font-mono text-stone-900">{vf.fiscalCode}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Telefono</span>
                      <strong className="font-mono text-stone-900">{vf.phone}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Email Cliente</span>
                      <strong className="font-mono text-stone-900 break-all">{vf.email}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Indirizzo di Consegna / Fatturazione</span>
                      <strong className="text-stone-900">{vf.address}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">CAP & Comune</span>
                      <strong className="text-stone-900">
                        <span className="font-mono">{vf.postalCode}</span> · {vf.city}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Provincia & Paese</span>
                      <strong className="font-mono text-stone-900">
                        {vf.province} ({vf.countryCode})
                      </strong>
                    </div>
                  </div>

                  {/* Blocco 2: Dati Consegna, Orario e Pagamento */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200">
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">Modalità Consegna</span>
                      <strong className="text-stone-900">
                        {viewingOrder.deliveryMethod === 'ritiro_bottega'
                          ? 'Ritiro in Bottega (Cento)'
                          : 'Consegna a Domicilio'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">Fascia Oraria</span>
                      <strong className="text-stone-900">{viewingOrder.deliveryTimeSlot || '12:30'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">Metodo Pagamento</span>
                      <strong className="text-stone-900 uppercase">
                        {(viewingOrder.paymentMethod || 'carta_credito').replace(/_/g, ' ')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-800 uppercase font-bold block">Stato Pagamento</span>
                      <strong className="text-emerald-800 uppercase">
                        {(viewingOrder.paymentStatus || 'pagato').replace(/_/g, ' ')}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Blocco 3: Elenco Articoli Ordinati & Riepilogo Importi */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <div className="bg-stone-900 text-stone-100 px-3.5 py-2 font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>Righe Comanda / Articoli Ordinati ({viewingOrder.items.length})</span>
                <span>Importo Riga</span>
              </div>
              <div className="divide-y divide-stone-200 p-3 bg-white">
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-stone-950">
                        <span className="font-mono text-amber-700 mr-1">{it.quantity}x</span>
                        {it.product.name}
                        <span className="ml-1.5 text-[11px] font-mono text-stone-500">
                          (€{it.product.price.toFixed(2)} cad.)
                        </span>
                      </div>
                      {it.specialInstructions && (
                        <span className="block text-[11px] text-amber-700 italic mt-0.5">
                          Nota: {it.specialInstructions}
                        </span>
                      )}
                    </div>
                    <span className="font-mono font-black text-stone-900 shrink-0">
                      €{(it.product.price * it.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="bg-stone-50 px-3.5 py-3 border-t border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotale Articoli</span>
                  <span className="font-mono font-semibold">
                    €{(viewingOrder.subtotal ?? viewingOrder.total).toFixed(2)}
                  </span>
                </div>
                {(viewingOrder.discount ?? 0) > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Sconto Applicato</span>
                    <span className="font-mono font-semibold">-€{viewingOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-stone-600">
                  <span>Spese di Consegna</span>
                  <span className="font-mono font-semibold">
                    €{(viewingOrder.deliveryFee ?? 0).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between font-black text-sm text-stone-950">
                  <span>Totale Ordine</span>
                  <span className="font-mono text-base text-amber-700">
                    €{viewingOrder.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold cursor-pointer"
              >
                Chiudi Dettaglio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE MATITA (✏️): MODIFICA / ANNULLAMENTO ORDINE (CON TUTTI I DATI E ARTICOLI)
         ===================================================================== */}
      {editingOrder && (
        <div
          className="fixed inset-0 z-[250] bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
          onClick={() => setEditingOrder(null)}
        >
          <form
            onSubmit={handleSaveEditedOrder}
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92dvh] overflow-y-auto p-4 sm:p-6 border border-stone-200 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Modifica o Annullamento Ordine · Anagrafica, Dati Fiscali, Consegna & Righe Articoli
                </span>
                <h3 className="font-display text-lg sm:text-xl font-black text-stone-950">
                  Ordine #{editingOrder.id} · <span className="font-mono text-xs text-stone-500">{editingOrder.date}</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sezione 1: Dati Anagrafici, Fiscali, Contatti e Indirizzo */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Nome</label>
                <input
                  type="text"
                  value={editingOrder.customer.firstName || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: {
                        ...editingOrder.customer,
                        firstName: e.target.value,
                        fullName: `${e.target.value} ${editingOrder.customer.lastName || ''}`.trim()
                      }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Cognome</label>
                <input
                  type="text"
                  value={editingOrder.customer.lastName || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: {
                        ...editingOrder.customer,
                        lastName: e.target.value,
                        fullName: `${editingOrder.customer.firstName || ''} ${e.target.value}`.trim()
                      }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Ragione Sociale / Tipo Cliente</label>
                <input
                  type="text"
                  value={editingOrder.customer.companyName || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, companyName: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Partita IVA</label>
                <input
                  type="text"
                  value={editingOrder.customer.vatNumber || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, vatNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Codice Fiscale</label>
                <input
                  type="text"
                  value={editingOrder.customer.fiscalCode || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, fiscalCode: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Telefono Cliente</label>
                <input
                  type="text"
                  value={editingOrder.customer.phone || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="font-bold text-stone-700 block mb-1">Email Cliente</label>
                <input
                  type="email"
                  value={editingOrder.customer.email || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, email: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-bold text-stone-700 block mb-1">Indirizzo</label>
                <input
                  type="text"
                  value={editingOrder.customer.address || ''}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, address: e.target.value }
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">CAP & Comune</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={editingOrder.customer.postalCode || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, postalCode: e.target.value }
                      })
                    }
                    placeholder="CAP"
                    className="w-20 px-2.5 py-1.5 rounded-xl border border-stone-300 font-mono"
                  />
                  <input
                    type="text"
                    value={editingOrder.customer.city || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, city: e.target.value }
                      })
                    }
                    placeholder="Comune"
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Provincia & Paese</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={editingOrder.customer.province || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, province: e.target.value }
                      })
                    }
                    placeholder="Prov"
                    className="w-16 px-2.5 py-1.5 rounded-xl border border-stone-300 font-mono"
                  />
                  <input
                    type="text"
                    value={editingOrder.customer.countryCode || ''}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        customer: { ...editingOrder.customer, countryCode: e.target.value }
                      })
                    }
                    placeholder="Paese"
                    className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Fascia Consegna / Ritiro</label>
                <input
                  type="text"
                  value={editingOrder.deliveryTimeSlot || ''}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, deliveryTimeSlot: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            {/* Sezione 2: Articoli dell'Ordine (Quantità, Note di Cottura & Ricalcolo Automatico) */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/70">
              <div className="bg-stone-900 text-stone-100 px-3.5 py-2 flex items-center justify-between">
                <span className="font-extrabold text-[11px] uppercase tracking-wider text-amber-400">
                  Articoli in Comanda ({editingOrder.items.length})
                </span>
                <span className="text-[10px] text-stone-300">
                  Modifica quantità o note: il totale si aggiorna automaticamente
                </span>
              </div>

              <div className="divide-y divide-stone-200 p-3 space-y-2">
                {editingOrder.items.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-stone-900">
                        {item.product.name}{' '}
                        <span className="text-[11px] font-mono text-stone-500">
                          (€{item.product.price.toFixed(2)} cad.)
                        </span>
                      </div>
                      <input
                        type="text"
                        value={item.specialInstructions || ''}
                        onChange={(e) => {
                          const nextItems = editingOrder.items.map((it, i) =>
                            i === idx ? { ...it, specialInstructions: e.target.value } : it
                          );
                          setEditingOrder({ ...editingOrder, items: nextItems });
                        }}
                        placeholder="Nota cucina / cottura (es. Cottura al sangue...)"
                        className="mt-1 w-full px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-[11px] text-amber-900"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden">
                        <button
                          type="button"
                          onClick={() => {
                            const nextQty = Math.max(1, item.quantity - 1);
                            const nextItems = editingOrder.items.map((it, i) =>
                              i === idx ? { ...it, quantity: nextQty } : it
                            );
                            const nextSub = Number(
                              nextItems.reduce((s, it) => s + it.product.price * it.quantity, 0).toFixed(2)
                            );
                            const nextTot = Number(
                              Math.max(0, nextSub - (editingOrder.discount || 0) + (editingOrder.deliveryFee || 0)).toFixed(2)
                            );
                            setEditingOrder({
                              ...editingOrder,
                              items: nextItems,
                              subtotal: nextSub,
                              total: nextTot
                            });
                          }}
                          className="px-2.5 py-1 hover:bg-stone-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextQty = item.quantity + 1;
                            const nextItems = editingOrder.items.map((it, i) =>
                              i === idx ? { ...it, quantity: nextQty } : it
                            );
                            const nextSub = Number(
                              nextItems.reduce((s, it) => s + it.product.price * it.quantity, 0).toFixed(2)
                            );
                            const nextTot = Number(
                              Math.max(0, nextSub - (editingOrder.discount || 0) + (editingOrder.deliveryFee || 0)).toFixed(2)
                            );
                            setEditingOrder({
                              ...editingOrder,
                              items: nextItems,
                              subtotal: nextSub,
                              total: nextTot
                            });
                          }}
                          className="px-2.5 py-1 hover:bg-stone-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono font-black text-stone-900 w-16 text-right">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {editingOrder.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextItems = editingOrder.items.filter((_, i) => i !== idx);
                            const nextSub = Number(
                              nextItems.reduce((s, it) => s + it.product.price * it.quantity, 0).toFixed(2)
                            );
                            const nextTot = Number(
                              Math.max(0, nextSub - (editingOrder.discount || 0) + (editingOrder.deliveryFee || 0)).toFixed(2)
                            );
                            setEditingOrder({
                              ...editingOrder,
                              items: nextItems,
                              subtotal: nextSub,
                              total: nextTot
                            });
                          }}
                          title="Rimuovi riga articolo"
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sezione 3: Importo Totale & Stato Ordine */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Data e Ora Ordine</label>
                <input
                  type="text"
                  value={editingOrder.date || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Importo Totale (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingOrder.total}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, total: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-amber-800"
                />
              </div>
              <div>
                <label className="font-bold text-stone-700 block mb-1">Stato Ordine</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({ ...editingOrder, status: e.target.value as OrderStatus })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                >
                  <option value="ricevuto">ricevuto</option>
                  <option value="in_griglia">in_griglia</option>
                  <option value="pronto">pronto</option>
                  <option value="in_consegna">in_consegna</option>
                  <option value="completato">completato</option>
                  <option value="annullato">annullato</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={async () => {
                  const cancelled: Order = { ...editingOrder, status: 'annullato' };
                  await updateOrder(cancelled);
                  setEditingOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Annulla Ordine</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
                >
                  Chiudi
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Salva Modifiche</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          MODALE LENTE CATALOGO (🔍): ANTEPRIMA SCHEDA TECNICA, SLIDESHOW, YOUTUBE, GOOGLE SLIDES CON WATERMARK ANTI-SCRAPING
         ===================================================================== */}
      {viewingProduct && (
        <div
          className="fixed inset-0 z-[250] bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={() => setViewingProduct(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 border border-stone-200 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Vista Scheda Tecnica & Media Protetti da Watermark Anti-Scraping
                </span>
                <h3 className="font-display text-xl font-black">{viewingProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Immagine & Slideshow con Watermark */}
            <div className="space-y-2">
              <div className="font-extrabold uppercase text-stone-700 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Immagine & Slideshow (Watermark Anti-Bot Attivo)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(viewingProduct.slideshowUrls && viewingProduct.slideshowUrls.length > 0
                  ? viewingProduct.slideshowUrls
                  : [viewingProduct.imageUrl || '']
                )
                  .filter(Boolean)
                  .map((url, idx) => (
                    <div
                      key={idx}
                      className="relative h-44 rounded-2xl overflow-hidden border border-stone-300 bg-stone-900"
                    >
                      <img src={url} alt={viewingProduct.name} className="w-full h-full object-cover" />
                      <AntiScrapingWatermark
                        productId={viewingProduct.id}
                        eanCode={viewingProduct.identification?.gtinEan || viewingProduct.id}
                        assetType="SLIDESHOW"
                        customWatermarkId={viewingProduct.antiScrapingWatermarkId}
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Video YouTube con Watermark */}
            <div className="space-y-2">
              <div className="font-extrabold uppercase text-stone-700 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-rose-600" />
                <span>Video YouTube Prodotto (Protetto da Watermark)</span>
              </div>
              <div className="relative h-52 rounded-2xl overflow-hidden border border-stone-300 bg-stone-950 flex items-center justify-center">
                {viewingProduct.youtubeVideoUrl ? (
                  <iframe
                    src={
                      viewingProduct.youtubeVideoUrl.includes('watch?v=')
                        ? viewingProduct.youtubeVideoUrl.replace('watch?v=', 'embed/')
                        : viewingProduct.youtubeVideoUrl
                    }
                    title={viewingProduct.name}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <span className="text-stone-400">
                    Nessun video YouTube associato (cliccando sulla matita ✏️ puoi inserire l&apos;URL YouTube)
                  </span>
                )}
                <AntiScrapingWatermark
                  productId={viewingProduct.id}
                  eanCode={viewingProduct.identification?.gtinEan || viewingProduct.id}
                  assetType="YOUTUBE"
                  customWatermarkId={viewingProduct.antiScrapingWatermarkId}
                />
              </div>
            </div>

            {/* 3. Presentazione Google Slides con Watermark */}
            <div className="space-y-2">
              <div className="font-extrabold uppercase text-stone-700 flex items-center gap-1.5">
                <Presentation className="w-4 h-4 text-amber-600" />
                <span>Presentazione Google Slides (Protetta da Watermark)</span>
              </div>
              <div className="relative h-52 rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 flex items-center justify-center">
                {viewingProduct.googleSlidesUrl ? (
                  <iframe
                    src={viewingProduct.googleSlidesUrl}
                    title={`Slides ${viewingProduct.name}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <span className="text-stone-400">
                    Nessuna presentazione Google Slides associata (aggiungila con la matita ✏️)
                  </span>
                )}
                <AntiScrapingWatermark
                  productId={viewingProduct.id}
                  eanCode={viewingProduct.identification?.gtinEan || viewingProduct.id}
                  assetType="GOOGLE_SLIDES"
                  customWatermarkId={viewingProduct.antiScrapingWatermarkId}
                />
              </div>
            </div>

            {/* 4. Scheda Tecnica con Watermark */}
            <div className="relative p-4 rounded-2xl border border-amber-400 bg-stone-950 text-stone-100 overflow-hidden space-y-2">
              <div className="font-extrabold uppercase text-amber-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Scheda Tecnica Ufficiale Prodotto (Protetta da Watermark Anti-Scraping)</span>
              </div>
              <p className="leading-relaxed text-stone-200">
                {viewingProduct.technicalSheetSummary || viewingProduct.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 font-mono text-[11px] text-stone-300">
                <div>EAN/PLU: {viewingProduct.identification?.gtinEan || viewingProduct.id}</div>
                <div>Peso/Formato: {viewingProduct.weight || viewingProduct.portion}</div>
                <div>Prezzo: €{viewingProduct.price.toFixed(2)}</div>
                <div>
                  Stabilimento:{' '}
                  {viewingProduct.manufacturingOrigin?.facilityName || 'Via Penzale 25, Cento (FE)'}
                </div>
                <div>
                   Energia: {viewingProduct.nutritionalFacts?.energyKcal || 215} kcal / 100g
                </div>
                <div> Proteine: {viewingProduct.nutritionalFacts?.proteinsG || 22} g / 100g</div>
              </div>
              <AntiScrapingWatermark
                productId={viewingProduct.id}
                eanCode={viewingProduct.identification?.gtinEan || viewingProduct.id}
                assetType="TECH_SHEET"
                customWatermarkId={viewingProduct.antiScrapingWatermarkId}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODALE MATITA CATALOGO (✏️): MODIFICA PRODOTTO, IMMAGINE, SLIDESHOW, YOUTUBE, GOOGLE SLIDES, SCHEDA TECNICA & WATERMARK
         ===================================================================== */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-[250] bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={() => setEditingProduct(null)}
        >
          <form
            onSubmit={handleSaveEditedProduct}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto p-5 sm:p-6 border border-stone-200 shadow-2xl space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 block">
                  Editor Prodotto, Media & Watermark Anti-Scraping
                </span>
                <h3 className="font-display text-xl font-black">{editingProduct.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">Descrizione / Nome Prodotto (Italiano)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Prezzo di Vendita (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Peso / Unità</label>
                <input
                  type="text"
                  value={editingProduct.weight || editingProduct.portion}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      weight: e.target.value,
                      portion: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">
                  URL Immagine Principale (con Watermark Anti-Scraping)
                </label>
                <input
                  type="text"
                  value={editingProduct.imageUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">
                  Slideshow Fotografico (un URL immagine per riga — protetto da Watermark)
                </label>
                <textarea
                  rows={3}
                  value={slideshowInput}
                  onChange={(e) => setSlideshowInput(e.target.value)}
                  placeholder="https://immagine1.jpg&#10;https://immagine2.jpg"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">
                  URL Video su YouTube (protetto da Watermark)
                </label>
                <input
                  type="text"
                  value={editingProduct.youtubeVideoUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, youtubeVideoUrl: e.target.value })
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">
                  URL Presentazione Google Slides (protetta da Watermark)
                </label>
                <input
                  type="text"
                  value={editingProduct.googleSlidesUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, googleSlidesUrl: e.target.value })
                  }
                  placeholder="https://docs.google.com/presentation/d/.../embed"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">
                  Scheda Tecnica da Visualizzare (protetta da Watermark di tracciamento)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.technicalSheetSummary || editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      technicalSheetSummary: e.target.value,
                      description: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">
                  Codice Identificativo Watermark Anti-Scraping
                </label>
                <input
                  type="text"
                  value={
                    editingProduct.antiScrapingWatermarkId ||
                    `WM-BA-${editingProduct.id.toUpperCase()}`
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      antiScrapingWatermarkId: e.target.value
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono font-bold text-amber-800"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold cursor-pointer"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salva su Firebase</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
