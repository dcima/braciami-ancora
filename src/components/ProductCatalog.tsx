import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../firebase/AuthContext';
import { Product, ProductCategory } from '../types';
import { ProductVisual } from './ProductVisual';
import {
  getLocalizedProductText,
  DRILL_DOWN_ECOMMERCE_TARGETS,
  crawlLiveFoodRegistryProducts
} from '../data/articlesArchitectureData';
import { computeCountryUnitConversion } from '../utils/unitConversion';
import {
  Search,
  Plus,
  Flame,
  Info,
  Globe,
  Wine,
  Snowflake,
  Factory,
  TrendingDown,
  ChefHat,
  Package,
  Layers,
  Database,
  ChevronRight,
  Download,
  Barcode,
  Scale,
  X
} from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { isAdmin } = useAuth();
  const {
    products,
    addToCart,
    setSelectedProductDetail,
    theme,
    saveProductToCatalog,
    pushAdminNotification,
    isAdminAuthenticated
  } = useStore();
  const isEffectiveAdmin = Boolean(isAdminAuthenticated || isAdmin);
  const {
    language,
    t,
    uiText,
    detectedCountry,
    detectedCountryName,
    estimatedDistanceKm,
    setSimulatedCountry,
    storeConfig,
    unitsOfMeasure
  } = useI18n();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('tutti');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyReadyToEat, setOnlyReadyToEat] = useState(false);

  // Per-product unit mode toggle: 'SINGLE' (g, kg, pz, bottiglia) vs 'CARTON' (Scatolone multiplo)
  const [cartonModeMap, setCartonModeMap] = useState<Record<string, boolean>>({});

  // E-Commerce Drilling-Down Explorer State
  const [showDrillDownExplorer, setShowDrillDownExplorer] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(DRILL_DOWN_ECOMMERCE_TARGETS[0].siteId);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    DRILL_DOWN_ECOMMERCE_TARGETS[0].departments[0].id
  );
  const [selectedSubcatId, setSelectedSubcatId] = useState<string>(
    DRILL_DOWN_ECOMMERCE_TARGETS[0].departments[0].subcategories[0].id
  );
  const [liveCrawlQuery, setLiveCrawlQuery] = useState('');
  const [isCrawlingLive, setIsCrawlingLive] = useState(false);
  const [liveCrawledProducts, setLiveCrawledProducts] = useState<Product[]>([]);

  const isLight = theme === 'chiaro';

  // Sticky / Fixed Pinning state for the Catalog Header Bar when scrolling up/down
  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const headerSentinelRef = useRef<HTMLDivElement | null>(null);
  const catalogBarRef = useRef<HTMLDivElement | null>(null);
  const [isCatalogBarPinned, setIsCatalogBarPinned] = useState(false);
  const [pinnedTopOffset, setPinnedTopOffset] = useState(0);
  const [catalogBarHeight, setCatalogBarHeight] = useState(0);

  const updateCatalogStickyState = useCallback(() => {
    const sentinelEl = headerSentinelRef.current;
    const sectionEl = catalogSectionRef.current;
    if (!sentinelEl || !sectionEl) return;

    const mainHeaderEl = document.getElementById('main_app_header');
    const headerBottom = mainHeaderEl ? Math.max(0, Math.round(mainHeaderEl.getBoundingClientRect().bottom)) : 0;

    if (catalogBarRef.current && !isCatalogBarPinned) {
      const h = catalogBarRef.current.offsetHeight;
      if (h > 0) setCatalogBarHeight(h);
    }

    const sentinelRect = sentinelEl.getBoundingClientRect();
    const sectionRect = sectionEl.getBoundingClientRect();

    // When scrolling the page upward (sentinelRect.top reaches or passes above headerBottom)
    // and the catalog section is still visible, keep the catalog header bar fixed below main_app_header.
    // When scrolling back downward (sentinelRect.top > headerBottom), restore it immediately to normal flow.
    const shouldPin = sentinelRect.top <= headerBottom && sectionRect.bottom > headerBottom + 100;

    setIsCatalogBarPinned(shouldPin);
    setPinnedTopOffset(headerBottom);
  }, [isCatalogBarPinned]);

  useEffect(() => {
    updateCatalogStickyState();
    window.addEventListener('scroll', updateCatalogStickyState, { passive: true });
    window.addEventListener('resize', updateCatalogStickyState);
    return () => {
      window.removeEventListener('scroll', updateCatalogStickyState);
      window.removeEventListener('resize', updateCatalogStickyState);
    };
  }, [updateCatalogStickyState]);

  const categories: { key: ProductCategory; label: string; count: number }[] = [
    { key: 'tutti', label: uiText('cat_all', 'Tutti gli Articoli'), count: products.length },
    {
      key: 'piatti_pronti',
      label: uiText('cat_piatti_pronti', 'Pronti Caldi Brace'),
      count: products.filter((p) => p.category === 'piatti_pronti').length
    },
    {
      key: 'carne_fresca',
      label: uiText('cat_carne_fresca', 'Banco Carne & Frollate'),
      count: products.filter((p) => p.category === 'carne_fresca').length
    },
    {
      key: 'dispensa_standard',
      label: uiText('cat_dispensa_standard', 'Specialità & Barcode EAN'),
      count: products.filter((p) => p.category === 'dispensa_standard').length
    },
    {
      key: 'gastronomia_vini',
      label: uiText('cat_gastronomia_vini', 'Gastronomia & Vini DOP'),
      count: products.filter((p) => p.category === 'gastronomia_vini').length
    },
    {
      key: 'cestini_box',
      label: uiText('cat_cestini_box', 'Cestini & Box'),
      count: products.filter((p) => p.category === 'cestini_box').length
    }
  ];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === 'tutti' || product.category === selectedCategory;
      const localizedName = getLocalizedProductText(product, 'name', language);
      const localizedDesc = getLocalizedProductText(product, 'description', language);
      const ean = product.identification?.gtinEan || '';
      const sku = product.identification?.sku || '';
      const matchSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        localizedName.toLowerCase().includes(q) ||
        localizedDesc.toLowerCase().includes(q) ||
        ean.toLowerCase().includes(q) ||
        sku.toLowerCase().includes(q);
      const matchReady = !onlyReadyToEat || product.isReadyToEat;
      return matchCategory && matchSearch && matchReady;
    });
  }, [products, selectedCategory, searchQuery, onlyReadyToEat, language]);

  const activeSite = useMemo(
    () =>
      DRILL_DOWN_ECOMMERCE_TARGETS.find((s) => s.siteId === selectedSiteId) ||
      DRILL_DOWN_ECOMMERCE_TARGETS[0],
    [selectedSiteId]
  );

  const activeDept = useMemo(
    () =>
      activeSite.departments.find((d) => d.id === selectedDeptId) ||
      activeSite.departments[0],
    [activeSite, selectedDeptId]
  );

  const activeSubcat = useMemo(
    () =>
      activeDept?.subcategories.find((s) => s.id === selectedSubcatId) ||
      activeDept?.subcategories[0],
    [activeDept, selectedSubcatId]
  );

  const handleLiveRegistryCrawl = async (queryOverride?: string) => {
    const q = (queryOverride ?? liveCrawlQuery).trim();
    if (!q) return;
    setIsCrawlingLive(true);
    const results = await crawlLiveFoodRegistryProducts(q);
    setLiveCrawledProducts(results);
    setIsCrawlingLive(false);
  };

  return (
    <section
      ref={catalogSectionRef}
      id="catalogo-prodotti"
      className={`py-6 sm:py-10 border-b transition-colors duration-200 w-full max-w-[100vw] overflow-x-clip ${
        isLight ? 'bg-[#FAF8F5] border-stone-200' : 'bg-stone-50 border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Sentinel + Sticky/Pinned Wrapper for Catalog Header + Search + Admin Drilling-Down */}
        <div
          ref={headerSentinelRef}
          className="mb-5"
          style={{
            minHeight: isCatalogBarPinned && catalogBarHeight > 0 ? `${catalogBarHeight}px` : undefined
          }}
        >
          <div
            ref={catalogBarRef}
            style={
              isCatalogBarPinned
                ? {
                    position: 'fixed',
                    top: `${pinnedTopOffset}px`,
                    left: 0,
                    right: 0,
                    zIndex: 35
                  }
                : undefined
            }
            className={
              isCatalogBarPinned
                ? `w-full border-b backdrop-blur-md shadow-md transition-colors duration-150 ${
                    isLight
                      ? 'bg-[#FAF8F5]/95 border-stone-200'
                      : 'bg-stone-50/95 border-stone-300'
                  }`
                : ''
            }
          >
            <div
              className={
                isCatalogBarPinned
                  ? 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 lg:gap-6'
                  : 'flex flex-col lg:flex-row lg:items-end justify-between gap-3.5 lg:gap-6'
              }
            >
              <div className="shrink-0 min-w-0">
                <span className="text-[11px] uppercase tracking-widest font-bold text-amber-800 block mb-0.5">
                  {uiText('catalog_subtitle_badge', 'Catalogo Articoli Multilingua · Barcode EAN & Filiera Cento')}
                </span>
                <h2 className="font-display text-fluid-title font-bold text-stone-900 tracking-tight">
                  {uiText('nav_catalog', t('nav_catalog'))}
                </h2>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:ml-6 min-w-0">
                {/* Search by Name, Ingredient, Barcode EAN-13 or SKU — ocupa tutto lo spazio disponibile dopo "Prodotti" */}
                <div className="relative flex-1 w-full min-w-0">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="catalog_search_input"
                    type="text"
                    title={uiText(
                      'search_tip_ean',
                      'Digita il nome del prodotto, un ingrediente, il codice Barcode EAN-13 o lo SKU per filtrare il catalogo in tempo reale'
                    )}
                    placeholder={uiText(
                      'search_placeholder_ean',
                      'Cerca nome prodotto, ingrediente, Barcode EAN, SKU, salamina...'
                    )}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-600 shadow-xs"
                  />
                  {/* Pulsante Cancella nel campo ricerca */}
                  {searchQuery.length > 0 && (
                    <button
                      id="btn_clear_catalog_search"
                      type="button"
                      onClick={() => setSearchQuery('')}
                      title={uiText('search_clear_btn', 'Cancella ricerca')}
                      aria-label={uiText('search_clear_btn', 'Cancella ricerca')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-500 hover:text-rose-700 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Button to open E-Commerce Drilling-Down & Total Product Sheets Registry (SOLO per Amministratore autenticato) */}
                {isEffectiveAdmin && (
                  <button
                    id="btn_toggle_drilldown_explorer"
                    onClick={() => setShowDrillDownExplorer(!showDrillDownExplorer)}
                    className={`px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 leading-tight text-center ${
                      showDrillDownExplorer
                        ? 'bg-stone-900 text-amber-400 border-stone-900 shadow-md'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border-amber-400'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" />
                    <span>
                      {uiText('btn_drilldown_catalog', 'Drilling-Down E-Commerce & Database Schede Totali')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Country Origin & Automatic Unit Conversion Bar (g, kg, etti, oz, lb, 斤, 两, 合, Scatoloni) */}
        <div className="mb-5 p-3 bg-gradient-to-r from-amber-50 via-orange-50/70 to-white border border-amber-200 rounded-2xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 text-xs text-stone-800">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-900 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-stone-900 block text-[11px] sm:text-xs">
                {uiText('unit_conversion_active_title', 'Conversione Automatica Unità Paese')}:{' '}
                <strong className="text-amber-800">{detectedCountryName}</strong> (~{estimatedDistanceKm} km)
              </span>
              <span className="text-[10px] sm:text-[11px] text-stone-600 block">
                {detectedCountry === 'GB' || detectedCountry === 'US'
                  ? 'Sistema Imperiale attivo: pesi convertiti in Once (oz), Libbre (lb) e Fluid Ounces (fl oz).'
                  : detectedCountry === 'CN'
                  ? 'Sistema Mercato Cinese (市制) attivo: pesi convertiti in Jīn (斤 = 500g) e Liǎng (两 = 50g).'
                  : detectedCountry === 'JP'
                  ? 'Sistema Giapponese attivo: prezzi per 100g (100gあたり) e misura riso in Gō (合).'
                  : 'Sistema Metrico & Gastronomia attivo: Grammi (g), Etti (100g), Chilogrammi (kg), Pezzi e Scatoloni.'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Globe className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <select
              aria-label="Seleziona Paese per Conversione Unità e Spedizione"
              value={detectedCountry}
              onChange={(e) => {
                const code = e.target.value;
                setSimulatedCountry(code);
                pushAdminNotification({
                  type: 'USER_CONNECTED',
                  severity: 'info',
                  title: `Cambio Paese & Unità di Misura (${code})`,
                  message: `Il visitatore ha impostato paese ${code}. Tutte le schede prodotto ora calcolano pesi e prezzi nell'unità locale.`,
                  countryCode: code,
                  deviceType: 'Smartphone'
                });
              }}
              className="w-full md:w-auto px-2.5 py-1.5 text-xs font-bold bg-white border border-amber-300 rounded-xl text-stone-900 shadow-xs cursor-pointer focus:outline-none"
            >
              <option value="IT">🇮🇹 Italia · Cento (g / etti / kg / L)</option>
              <option value="GB">🇬🇧 Regno Unito · Manchester (oz / lb / fl oz)</option>
              <option value="CN">🇨🇳 Cina · Shanghai (斤 Jīn 500g / 两 Liǎng 50g)</option>
              <option value="JP">🇯🇵 Giappone · Tokyo (100gあたり / 合 Gō)</option>
              <option value="DE">🇩🇪 Germania · Berlino (g / kg / L)</option>
              <option value="FR">🇫🇷 Francia · Parigi (g / kg / cl)</option>
              <option value="NL">🇳🇱 Olanda · Amsterdam (ons 100g / kg)</option>
              <option value="SE">🇸🇪 Svezia · Stoccolma (hg 100g / jfr kg)</option>
              <option value="US">🇺🇸 USA · New York (oz / lb / US fl oz)</option>
            </select>
          </div>
        </div>

        {/* DRILLING-DOWN E-COMMERCE & GLOBAL TOTAL PRODUCT SHEETS EXPLORER (SOLO per Amministratore autenticato) */}
        {isEffectiveAdmin && showDrillDownExplorer && (
          <div className="mb-6 bg-stone-900 text-stone-100 rounded-2xl border border-amber-500/40 p-4 sm:p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold block">
                  Motore di Drilling-Down Siti E-Commerce & Archivio Globale GS1
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">
                  Esplora Reparti Concorrenti & Importa Schede Prodotto Totali
                </h3>
              </div>

              {/* Live Barcode / Product Crawler via OpenFoodFacts World API */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  value={liveCrawlQuery}
                  onChange={(e) => setLiveCrawlQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLiveRegistryCrawl()}
                  placeholder="Inserisci EAN (es. 8076800195057) o prodotto..."
                  className="flex-1 sm:w-64 px-3 py-1.5 rounded-xl bg-stone-800 border border-stone-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => handleLiveRegistryCrawl()}
                  disabled={isCrawlingLive}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold text-xs cursor-pointer shrink-0"
                >
                  {isCrawlingLive ? 'Scansione...' : 'Estrai Live'}
                </button>
              </div>
            </div>

            {/* Level 1: Select Target E-Commerce Site */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {DRILL_DOWN_ECOMMERCE_TARGETS.map((site) => {
                const isSelected = site.siteId === selectedSiteId;
                return (
                  <button
                    key={site.siteId}
                    onClick={() => {
                      setSelectedSiteId(site.siteId);
                      const firstDept = site.departments[0];
                      if (firstDept) {
                        setSelectedDeptId(firstDept.id);
                        if (firstDept.subcategories[0]) {
                          setSelectedSubcatId(firstDept.subcategories[0].id);
                        }
                      }
                    }}
                    className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-white'
                        : 'bg-stone-800/70 border-stone-700/70 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-bold">
                      <span className="truncate">{site.siteName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-950 text-amber-400 text-[10px] font-mono shrink-0">
                        {site.totalIndexedProducts.toLocaleString('it-IT')} schede
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-1 truncate font-mono">
                      {site.domainUrl}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Level 2 & 3: Drill-down Departments -> Subcategories */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-400 font-semibold">Reparti:</span>
              {activeSite.departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDeptId(dept.id);
                    if (dept.subcategories[0]) setSelectedSubcatId(dept.subcategories[0].id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    dept.id === activeDept?.id
                      ? 'bg-amber-400 text-stone-950'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <span>{dept.name}</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              ))}
            </div>

            {activeDept && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-stone-400 font-semibold">Sottocategorie:</span>
                {activeDept.subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubcatId(sub.id);
                      handleLiveRegistryCrawl(sub.searchQueryForApi);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                      sub.id === activeSubcat?.id
                        ? 'bg-stone-100 text-stone-950 border-white font-bold'
                        : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {sub.name} ({sub.productCount})
                  </button>
                ))}
              </div>
            )}

            {/* Level 4: Extracted Total Product Sheets (Pre-indexed + Live API Crawled) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {[...(liveCrawledProducts.length > 0 ? liveCrawledProducts : []), ...(activeSubcat?.sampleProducts || [])]
                .slice(0, 6)
                .map((sheetProd) => (
                  <div
                    key={sheetProd.id}
                    className="bg-stone-950 border border-stone-800 rounded-xl p-3 flex flex-col justify-between gap-2 text-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-amber-400 mb-1">
                        <span>EAN: {sheetProd.internationalCodes?.gtinEan13 || sheetProd.identification?.gtinEan}</span>
                        <span>Bollo: {sheetProd.internationalCodes?.sanitaryPlantBoltCE || 'IT-CE'}</span>
                      </div>
                      <div className="font-bold text-white line-clamp-1">{sheetProd.name}</div>
                      <div className="text-[11px] text-stone-400 mt-0.5 line-clamp-1">
                        Stabilimento: {sheetProd.manufacturingOrigin?.plantName} ({sheetProd.manufacturingOrigin?.city})
                      </div>
                      <div className="text-[10px] text-stone-400 mt-1 flex flex-wrap gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700">
                          {sheetProd.nutritionalFacts?.calories} kcal / {sheetProd.nutritionalFacts?.energyKj} kJ
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700">
                          Nutri-Score {sheetProd.nutritionalFacts?.nutriScore || 'B'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-stone-900 border border-stone-700">
                          {sheetProd.linkedRecipes?.length || 1} Ricette
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800">
                      <button
                        onClick={() => setSelectedProductDetail(sheetProd)}
                        className="text-[11px] font-bold text-amber-400 hover:underline cursor-pointer"
                      >
                        Apri Scheda Totale
                      </button>
                      <button
                        onClick={() => saveProductToCatalog(sheetProd)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Sincronizza su Firebase</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Responsive Flex-Wrap Category Filter Bar (No clipped buttons on any viewport or orientation) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-stone-200">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-200/80 rounded-xl">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-2 sm:px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-1 leading-tight cursor-pointer ${
                    active
                      ? isLight
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[9px] sm:text-[10px] font-mono-nums ${active ? 'text-amber-200' : 'text-stone-500'}`}>
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOnlyReadyToEat(!onlyReadyToEat)}
            className={`px-2.5 py-1 text-[10px] sm:text-xs font-bold rounded-xl border transition-colors flex items-center gap-1 leading-tight cursor-pointer ${
              onlyReadyToEat
                ? 'bg-amber-100 border-amber-400 text-amber-950'
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span>{uiText('filter_ready_to_eat', 'Solo Pronti al Consumo')}</span>
          </button>
        </div>

        {/* Products Grid - Mobile-First Responsive Cards */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center my-4 shadow-xs">
            <Info className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h3 className="text-sm sm:text-base font-bold text-stone-800">
              {searchQuery.trim()
                ? uiText(
                    'cat_no_products_for_query',
                    'Nessun prodotto per la ricerca: $ricerca'
                  ).replace('$ricerca', searchQuery.trim())
                : t('cat_no_products')}
            </h3>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('tutti');
                setOnlyReadyToEat(false);
              }}
              className="mt-3 px-4 py-2 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors cursor-pointer"
            >
              {uiText('btn_reset_filters', 'Mostra Tutti gli Articoli')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProducts.map((product) => {
              const localizedTitle = getLocalizedProductText(product, 'name', language);
              const localizedSummary = getLocalizedProductText(product, 'description', language);
              const isPerishable = Boolean(product.isFreshPerishable);
              const maxDist = product.maxDeliveryKm || storeConfig.max_fresh_delivery_km;
              const isOverDistance = isPerishable && estimatedDistanceKm > maxDist;

              // Dynamic Country Unit Conversion (g, kg, etti, oz, lb, fl oz, 斤, 两, 合, Scatolone)
              const unitConv = computeCountryUnitConversion(
                product,
                detectedCountry,
                language,
                unitsOfMeasure
              );

              const isCartonSelected = Boolean(cartonModeMap[product.id]);
              const activePrice =
                isCartonSelected && unitConv.cartonPackInfo
                  ? unitConv.cartonPackInfo.cartonTotalPriceEur
                  : product.price;

              const euBenchmark = product.competitorIntelligence?.benchmarks.find(
                (b) => b.marketScope === 'ITALY_NATIONAL' || b.marketScope === 'LOCAL_CENTO_FE'
              );

              return (
                <article
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:border-amber-400 transition-all duration-200 shadow-xs"
                >
                  {/* Top Clickable Area: Significant Food Photo + Total Sheet Preview */}
                  <div>
                    <div
                      onClick={() => setSelectedProductDetail(product)}
                      className="relative cursor-pointer"
                    >
                      <ProductVisual product={product} className="h-44 sm:h-48" />

                      {/* Top Left Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none max-w-[70%]">
                        {product.wineDenomination && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-950/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 truncate">
                            <Wine className="w-3 h-3 text-rose-300 shrink-0" />
                            <span className="truncate">
                              {product.wineDenomination} {product.wineRegion?.split(' ')[0]}
                            </span>
                          </span>
                        )}
                        {product.isTipicoFerrarese && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm truncate">
                            Specialità Cento / Ferrara
                          </span>
                        )}
                        {isOverDistance && (
                          <span className="px-2 py-0.5 rounded-full bg-sky-700/95 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Snowflake className="w-3 h-3 shrink-0" />
                            <span>Catena del Freddo UE</span>
                          </span>
                        )}
                      </div>

                      {/* Bottom Right Nutrition & Nutri-Score Badge */}
                      {product.nutritionalFacts?.calories && (
                        <div className="absolute bottom-2 right-2.5 z-10 pointer-events-none flex items-center gap-1">
                          {product.nutritionalFacts.nutriScore && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[9px] font-black uppercase">
                              Nutri-{product.nutritionalFacts.nutriScore}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-stone-950/85 text-amber-300 text-[10px] font-mono font-bold shadow-sm">
                            {product.nutritionalFacts.calories} kcal
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 sm:p-4 space-y-2.5">
                      {/* Country Converted Weight / Volume & Unit Type Pill */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-950 font-bold font-mono-nums">
                          {unitConv.commercialUnitTranslated}: {unitConv.localizedWeightOrVolume}
                        </span>
                        <span className="text-[10px] font-mono-nums text-stone-500 font-semibold">
                          {unitConv.localizedPricePerMeasure}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => setSelectedProductDetail(product)}
                        className="font-bold text-stone-900 text-sm sm:text-base leading-snug group-hover:text-amber-700 transition-colors cursor-pointer"
                      >
                        {localizedTitle}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {localizedSummary}
                      </p>

                      {/* Total Product Sheet Micro-Highlights: Manufacturing Plant, Competitor Diff & Linked Recipe */}
                      <div className="pt-1.5 border-t border-stone-100 space-y-1 text-[11px] text-stone-600">
                        {product.manufacturingOrigin && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Factory className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span className="truncate">
                              Prod.: <strong>{product.manufacturingOrigin.city} ({product.manufacturingOrigin.provinceCode})</strong> · {product.internationalCodes?.sanitaryPlantBoltCE}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-2">
                          {euBenchmark && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              <TrendingDown className="w-3 h-3 shrink-0" />
                              <span>{euBenchmark.ourDiffPercent}% vs Competitor</span>
                            </span>
                          )}

                          {product.linkedRecipes && product.linkedRecipes.length > 0 && (
                            <button
                              onClick={() => setSelectedProductDetail(product)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 hover:underline cursor-pointer"
                            >
                              <ChefHat className="w-3 h-3 shrink-0" />
                              <span>Ricetta Collegata</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Unit vs Master Carton (Scatolone) Selector */}
                      {unitConv.cartonPackInfo && (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setCartonModeMap((prev) => ({ ...prev, [product.id]: false }))
                            }
                            className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 leading-tight text-center transition-all cursor-pointer ${
                              !isCartonSelected
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                            }`}
                          >
                            <Package className="w-3 h-3 shrink-0" />
                            <span>
                              1 {unitConv.commercialUnitSymbol} (€{product.price.toFixed(2)})
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setCartonModeMap((prev) => ({ ...prev, [product.id]: true }))
                            }
                            className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center justify-center gap-1 leading-tight text-center transition-all cursor-pointer ${
                              isCartonSelected
                                ? 'bg-amber-500 text-stone-950 border-amber-600'
                                : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:bg-amber-100'
                            }`}
                          >
                            <Layers className="w-3 h-3 shrink-0" />
                            <span>
                              {unitConv.cartonPackInfo.cartonTranslatedLabel} (-{unitConv.cartonPackInfo.cartonSavingsPercent}%)
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Price & Action Buttons */}
                  <div className="px-3 sm:px-4 pb-3 pt-2.5 border-t border-stone-100 bg-stone-50/50 flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono-nums text-sm sm:text-lg font-extrabold text-stone-900">
                          €{activePrice.toFixed(2)}
                        </span>
                        {product.originalPrice && !isCartonSelected && (
                          <span className="font-mono-nums text-xs text-stone-400 line-through">
                            €{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-stone-500 block leading-tight">
                        IVA {product.pricingAndWeight?.vatRatePercent || 10}% incl. ·{' '}
                        {isCartonSelected && unitConv.cartonPackInfo
                          ? unitConv.cartonPackInfo.cartonTotalWeightLabel
                          : unitConv.metricStandardLabel}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setSelectedProductDetail(product)}
                        className="px-2 sm:px-2.5 py-1.5 text-[10px] sm:text-[11px] font-bold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1 leading-tight"
                        title="Scheda Prodotto Totale: Codici, Stabilimento, Nutrizione e Ricette"
                      >
                        <Barcode className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
                        <span>{uiText('btn_total_sheet', 'Scheda')}</span>
                      </button>

                      <button
                        onClick={() =>
                          addToCart(
                            product,
                            isCartonSelected && unitConv.cartonPackInfo
                              ? unitConv.cartonPackInfo.unitsInCarton
                              : 1,
                            isCartonSelected ? 'Formato Scatolone Multiplo' : undefined
                          )
                        }
                        className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-extrabold text-stone-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-xl transition-all flex items-center gap-1 shadow-xs cursor-pointer leading-tight"
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span>{uiText('btn_add_to_cart', 'Aggiungi')}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
