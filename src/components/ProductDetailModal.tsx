import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useI18n } from '../i18n/I18nContext';
import { ProductVisual } from './ProductVisual';
import { AntiScrapingWatermark } from './AntiScrapingWatermark';
import { getLocalizedProductText } from '../data/articlesArchitectureData';
import { computeCountryUnitConversion } from '../utils/unitConversion';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../i18n/types';
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Barcode,
  Factory,
  Activity,
  ChefHat,
  TrendingDown,
  Globe,
  Snowflake,
  Wine,
  Sparkles,
  Save,
  Package,
  Layers
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    products,
    saveProductToCatalog
  } = useStore();
  const {
    language,
    uiText,
    detectedCountry,
    detectedCountryName,
    estimatedDistanceKm,
    storeConfig,
    unitsOfMeasure
  } = useI18n();

  const [quantity, setQuantity] = useState(1);
  const [selectedPrepOption, setSelectedPrepOption] = useState('');
  const [isCartonMode, setIsCartonMode] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'origin_codes' | 'nutrition' | 'recipes' | 'competitors_i18n'
  >('overview');

  // Admin Multilingual Live Editor State (writes directly to Firebase products table)
  const [editLang, setEditLang] = useState<LanguageCode>('it_IT');
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPortion, setEditPortion] = useState('');
  const [isSavingI18n, setIsSavingI18n] = useState(false);

  useEffect(() => {
    if (selectedProductDetail) {
      setQuantity(1);
      setIsCartonMode(false);
      setActiveTab('overview');
      setSelectedPrepOption(selectedProductDetail.preparationOptions?.[0] || '');
      setEditLang(language);
      setEditName(
        selectedProductDetail.name_translations?.[language] || selectedProductDetail.name
      );
      setEditDesc(
        selectedProductDetail.description_translations?.[language] ||
          selectedProductDetail.description
      );
      setEditPortion(
        selectedProductDetail.portion_translations?.[language] ||
          selectedProductDetail.portion
      );
    }
  }, [selectedProductDetail, language]);

  useEffect(() => {
    if (!selectedProductDetail) return;
    setEditName(
      selectedProductDetail.name_translations?.[editLang] ||
        (editLang === 'it_IT' ? selectedProductDetail.name : '')
    );
    setEditDesc(
      selectedProductDetail.description_translations?.[editLang] ||
        (editLang === 'it_IT' ? selectedProductDetail.description : '')
    );
    setEditPortion(
      selectedProductDetail.portion_translations?.[editLang] ||
        (editLang === 'it_IT' ? selectedProductDetail.portion : '')
    );
  }, [editLang, selectedProductDetail]);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const localizedTitle = getLocalizedProductText(product, 'name', language);
  const localizedDesc = getLocalizedProductText(product, 'description', language);
  const localizedNote = getLocalizedProductText(product, 'curatorNote', language);

  const unitConv = computeCountryUnitConversion(
    product,
    detectedCountry,
    language,
    unitsOfMeasure
  );

  const isPerishable = Boolean(product.isFreshPerishable);
  const maxDist = product.maxDeliveryKm || storeConfig.max_fresh_delivery_km;
  const isOverDistance = isPerishable && estimatedDistanceKm > maxDist;

  const unitPrice =
    isCartonMode && unitConv.cartonPackInfo
      ? unitConv.cartonPackInfo.cartonTotalPriceEur
      : product.price;

  const handleSaveMultilingualToFirebase = async () => {
    setIsSavingI18n(true);
    const updated: Product = {
      ...product,
      name: editLang === 'it_IT' && editName ? editName : product.name,
      description: editLang === 'it_IT' && editDesc ? editDesc : product.description,
      portion: editLang === 'it_IT' && editPortion ? editPortion : product.portion,
      name_translations: {
        ...(product.name_translations || {}),
        [editLang]: editName
      },
      description_translations: {
        ...(product.description_translations || {}),
        [editLang]: editDesc
      },
      portion_translations: {
        ...(product.portion_translations || {}),
        [editLang]: editPortion
      }
    };
    await saveProductToCatalog(updated);
    setSelectedProductDetail(updated);
    setIsSavingI18n(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-3 overflow-hidden"
      onClick={() => setSelectedProductDetail(null)}
    >
      <div
        className="bg-white w-full sm:max-w-3xl max-h-[95dvh] sm:rounded-3xl rounded-t-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header with Photo & Close Button (Responsive height for Portrait & Landscape) */}
        <div className="relative shrink-0">
          <ProductVisual
            product={product}
            className="h-32 sm:h-44 landscape:h-24 sm:landscape:h-36"
            showBadge={false}
            hideBottomCode={true}
          />
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="absolute top-2.5 right-2.5 z-20 p-1.5 sm:p-2 rounded-full bg-stone-950/85 hover:bg-stone-900 text-white border border-stone-700 cursor-pointer shadow-md"
            aria-label="Chiudi"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-2 left-2.5 right-12 z-20 flex flex-wrap items-end justify-between gap-1.5 pointer-events-none">
            <div className="bg-stone-950/85 backdrop-blur-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-stone-700 max-w-full">
              <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 block leading-tight">
                SKU: {product.identification?.sku} · EAN: {product.internationalCodes?.gtinEan13 || product.identification?.gtinEan}
              </span>
              <h2 className="font-display text-xs sm:text-base font-bold text-white leading-snug break-words">
                {localizedTitle}
              </h2>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Total Product Sheet (Flex-Wrap & Fluid Sizing so NO button description is ever clipped) */}
        <div className="flex flex-wrap items-center justify-start gap-1 px-2.5 py-1.5 bg-stone-100 border-b border-stone-200 shrink-0">
          {[
            { id: 'overview', label: uiText('tab_overview', 'Unità & Acquisto'), icon: Package },
            { id: 'origin_codes', label: uiText('tab_codes_origin', 'Codici & Stabilimento'), icon: Factory },
            { id: 'nutrition', label: uiText('tab_nutrition', 'Scheda Nutrizionale'), icon: Activity },
            { id: 'recipes', label: uiText('tab_recipes', 'Ricette Abbinate'), icon: ChefHat },
            { id: 'competitors_i18n', label: uiText('tab_comp_i18n', 'Prezzi & Traduzioni Firebase'), icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1 leading-tight transition-all cursor-pointer ${
                  active
                    ? 'bg-stone-900 text-amber-400 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW, COUNTRY UNITS & PACKAGING */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Country Unit Conversion Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-900 block">
                    Calcolo Unità di Misura per {detectedCountryName}
                  </span>
                  <div className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5">
                    {unitConv.commercialUnitTranslated}:{' '}
                    <span className="font-mono text-amber-800">{unitConv.localizedWeightOrVolume}</span>
                  </div>
                </div>
                <div className="text-left sm:text-right font-mono text-xs font-bold text-stone-700">
                  <div>{unitConv.localizedPricePerMeasure}</div>
                  <div className="text-[10px] text-stone-500">
                    Peso Lordo Spedizione: {product.pricingAndWeight?.grossShippingWeightGrams} g
                  </div>
                </div>
              </div>

              {/* Single Unit vs Master Carton Selector */}
              {unitConv.cartonPackInfo && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Seleziona Formato di Vendita (Unità Singola o Scatolone Multiplo):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCartonMode(false)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        !isCartonMode
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-800 border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-amber-400" />
                          <span>1 {unitConv.commercialUnitTranslated}</span>
                        </span>
                        <span className="font-mono">€{product.price.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] opacity-80 mt-1">
                        Misura: {unitConv.localizedWeightOrVolume}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsCartonMode(true)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isCartonMode
                          ? 'bg-amber-500 text-stone-950 border-amber-600'
                          : 'bg-amber-50/60 text-stone-800 border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-xs">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4" />
                          <span>{unitConv.cartonPackInfo.cartonTranslatedLabel}</span>
                        </span>
                        <span className="font-mono">
                          €{unitConv.cartonPackInfo.cartonTotalPriceEur.toFixed(2)} (-
                          {unitConv.cartonPackInfo.cartonSavingsPercent}%)
                        </span>
                      </div>
                      <div className="text-[11px] opacity-85 mt-1">
                        Totale collo: {unitConv.cartonPackInfo.cartonTotalWeightLabel}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <p className="text-stone-700 leading-relaxed">{localizedDesc}</p>

              {/* Curator Note */}
              <div className="p-3.5 rounded-xl bg-stone-100 border-l-4 border-amber-500 italic text-xs text-stone-700">
                &ldquo;{localizedNote}&rdquo; — <strong>{product.curator}</strong>
              </div>

              {/* Multimedia Slideshow, YouTube Video, Google Slides & Technical Sheet (All Protected by Anti-Scraping Watermark) */}
              <div className="space-y-3 pt-1">
                {product.slideshowUrls && product.slideshowUrls.length > 0 && (
                  <div className="p-3 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-700 block">
                      📸 Slideshow Fotografico Prodotto (Protetto da Watermark Anti-Scraping)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product.slideshowUrls.map((url, idx) => (
                        <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-stone-300 bg-stone-900">
                          <img src={url} alt={`${product.name} slide ${idx + 1}`} className="w-full h-full object-cover" />
                          <AntiScrapingWatermark
                            productId={product.id}
                            eanCode={product.identification?.gtinEan || product.id}
                            assetType="SLIDESHOW"
                            customWatermarkId={product.antiScrapingWatermarkId}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.youtubeVideoUrl && (
                  <div className="p-3 rounded-2xl border border-stone-200 bg-stone-950 text-white space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      🎬 Video YouTube Ufficiale (Protetto da Watermark Anti-Scraping)
                    </span>
                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-stone-800">
                      <iframe
                        src={
                          product.youtubeVideoUrl.includes('watch?v=')
                            ? product.youtubeVideoUrl.replace('watch?v=', 'embed/')
                            : product.youtubeVideoUrl
                        }
                        title={`Video ${product.name}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                      <AntiScrapingWatermark
                        productId={product.id}
                        eanCode={product.identification?.gtinEan || product.id}
                        assetType="YOUTUBE"
                        customWatermarkId={product.antiScrapingWatermarkId}
                      />
                    </div>
                  </div>
                )}

                {product.googleSlidesUrl && (
                  <div className="p-3 rounded-2xl border border-stone-200 bg-stone-900 text-white space-y-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      📊 Presentazione Google Slides (Protetta da Watermark Anti-Scraping)
                    </span>
                    <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden border border-stone-700">
                      <iframe
                        src={product.googleSlidesUrl}
                        title={`Google Slides ${product.name}`}
                        className="w-full h-full bg-stone-950"
                        allowFullScreen
                      />
                      <AntiScrapingWatermark
                        productId={product.id}
                        eanCode={product.identification?.gtinEan || product.id}
                        assetType="GOOGLE_SLIDES"
                        customWatermarkId={product.antiScrapingWatermarkId}
                      />
                    </div>
                  </div>
                )}

                <div className="relative p-4 rounded-2xl border border-amber-300 bg-stone-900 text-stone-100 overflow-hidden space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                    📋 Scheda Tecnica Certificata Prodotto (Anti-Scraping Trace)
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {product.technicalSheetSummary ||
                      `Articolo: ${product.name} (${product.weight}) · EAN/PLU: ${
                        product.identification?.gtinEan || product.id
                      } · Stabilimento: ${
                        product.manufacturingOrigin?.facilityName || 'Bottega Braciami Ancora Cento (FE)'
                      } · Conservazione: ${
                        product.logisticsRules?.storageTemperatureRange || '0°C / +4°C'
                      }`}
                  </p>
                  <AntiScrapingWatermark
                    productId={product.id}
                    eanCode={product.identification?.gtinEan || product.id}
                    assetType="TECH_SHEET"
                    customWatermarkId={product.antiScrapingWatermarkId}
                  />
                </div>
              </div>

              {/* Preparation / Packaging Options */}
              {product.preparationOptions && product.preparationOptions.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Opzione di Preparazione & Confezionamento:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.preparationOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedPrepOption(opt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                          selectedPrepOption === opt
                            ? 'bg-amber-500 text-stone-950 border-amber-600 font-bold'
                            : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isOverDistance && (
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex items-center gap-2.5 text-xs">
                  <Snowflake className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>
                    Destinazione a {estimatedDistanceKm} km da Cento: verrà spedito in{' '}
                    <strong>Box Isotermico EPS + Ghiaccio Gel (Catena del Freddo Garantita 48h)</strong>.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERNATIONAL CODES & PHYSICAL MANUFACTURING PLANT */}
          {activeTab === 'origin_codes' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Barcode className="w-4 h-4" />
                  <span>Codici Internazionali & Doganali GS1 / UE</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">GTIN / Barcode EAN-13:</span>
                    <strong className="text-amber-300">{product.internationalCodes?.gtinEan13}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">ITF-14 / DUN-14 Scatolone:</span>
                    <strong className="text-stone-100">{product.internationalCodes?.itf14CartonCode}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Codice Doganale TARIC / HS:</span>
                    <strong className="text-stone-100">{product.internationalCodes?.taricHsCode}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block">Bollo Sanitario Stabilimento CE:</span>
                    <strong className="text-emerald-400">{product.internationalCodes?.sanitaryPlantBoltCE}</strong>
                  </div>
                  {product.internationalCodes?.euDopIgpRegistryCode && (
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 sm:col-span-2">
                      <span className="text-[10px] text-stone-400 block">Registro Ufficiale Europeo DOP/IGP (eAmbrosia):</span>
                      <strong className="text-amber-400">{product.internationalCodes.euDopIgpRegistryCode}</strong>
                    </div>
                  )}
                </div>
              </div>

              {product.manufacturingOrigin && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-stone-900 font-bold uppercase tracking-wider">
                    <Factory className="w-4 h-4 text-amber-600" />
                    <span>Produttore, Marca & Stabilimento Fisico di Produzione</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <span className="text-stone-500 block text-[11px]">Ragione Sociale Produttore:</span>
                      <strong className="text-stone-900">{product.manufacturingOrigin.manufacturerLegalName}</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block text-[11px]">Marca / Brand:</span>
                      <strong className="text-stone-900">{product.manufacturingOrigin.brandOwner}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block text-[11px]">Stabilimento Fisico di Lavorazione / Assemblaggio:</span>
                      <strong className="text-stone-900">
                        {product.manufacturingOrigin.plantName} — {product.manufacturingOrigin.physicalStreetAddress},{' '}
                        {product.manufacturingOrigin.postalCode} {product.manufacturingOrigin.city} ({product.manufacturingOrigin.provinceCode}),{' '}
                        {product.manufacturingOrigin.region} [{product.manufacturingOrigin.countryCode}]
                      </strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block text-[11px]">Origine Fisica Materie Prime:</span>
                      <strong className="text-stone-800">{product.manufacturingOrigin.rawMaterialsOrigin}</strong>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-stone-500 block text-[11px]">Lotto Attuale & Shelf-Life Garantita alla Consegna:</span>
                      <strong className="text-emerald-800 font-mono">
                        {product.supplierInfo?.batchCode} · Minimo {product.supplierInfo?.guaranteedShelfLifeDays} giorni garantiti
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMPLETE NUTRITIONAL PROFILE */}
          {activeTab === 'nutrition' && product.nutritionalFacts && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-xs sm:text-sm">
                    Dichiarazione Nutrizionale Completa (Reg. UE 1169/2011)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                    Nutri-Score {product.nutritionalFacts.nutriScore || 'B'} · NOVA {product.nutritionalFacts.novaGroup || 1}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Energia</span>
                    <strong className="font-mono text-sm text-stone-900">
                      {product.nutritionalFacts.calories} kcal
                    </strong>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      {product.nutritionalFacts.energyKj} kJ
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Proteine</span>
                    <strong className="font-mono text-sm text-stone-900">
                      {product.nutritionalFacts.proteins} g
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Grassi (Saturi)</span>
                    <strong className="font-mono text-sm text-stone-900">
                      {product.nutritionalFacts.fats} g
                    </strong>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      sat. {product.nutritionalFacts.saturatedFats ?? 0} g
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Carboidrati (Zuccheri)</span>
                    <strong className="font-mono text-sm text-stone-900">
                      {product.nutritionalFacts.carbohydrates} g
                    </strong>
                    <span className="text-[10px] text-stone-400 block font-mono">
                      zucc. {product.nutritionalFacts.sugars ?? 0} g
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
                  <span>Fibre: <strong>{product.nutritionalFacts.fiber ?? 0} g</strong></span>
                  <span>Sale Equivalente: <strong>{product.nutritionalFacts.saltGrams ?? 1.1} g</strong></span>
                  <span>Allergeni: <strong>{product.allergens && product.allergens.length > 0 ? product.allergens.join(', ') : 'Nessuno dichiarato'}</strong></span>
                </div>
              </div>

              {product.historyAndCuriosity && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
                  <strong className="text-amber-950 block uppercase tracking-wider">
                    Storia & Tradizione Gastronomica
                  </strong>
                  <p className="text-stone-700">{product.historyAndCuriosity.storia}</p>
                  <p className="text-stone-600 italic">{product.historyAndCuriosity.curiosita}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: LINKED RECIPES & ONE-CLICK INGREDIENTS */}
          {activeTab === 'recipes' && (
            <div className="space-y-4">
              {(product.linkedRecipes || []).map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Ricetta Ufficiale Collegata all'Articolo
                      </span>
                      <h4 className="font-display font-bold text-base text-stone-900">
                        {rec.title_translations?.[language] || rec.title}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-950 text-xs font-bold">
                      {rec.difficulty} · {rec.prepTimeMinutes + rec.cookTimeMinutes} min · {rec.servings} pers.
                    </span>
                  </div>

                  {/* Ingredients with 1-click jump/add */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-stone-700 block">
                      Ingredienti (Clicca per aggiungere dal catalogo):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {rec.ingredients.map((ing, i) => {
                        const linkedProd = products.find((p) => p.id === ing.linkedProductId);
                        return (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <strong className="block truncate text-stone-900">{ing.name}</strong>
                              <span className="text-[10px] text-stone-500">{ing.quantityLabel}</span>
                            </div>
                            {linkedProd && (
                              <button
                                onClick={() => addToCart(linkedProd, 1)}
                                className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold shrink-0 cursor-pointer"
                                title={`Aggiungi ${linkedProd.name}`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-stone-700 block">Procedimento:</span>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-stone-700">
                      {rec.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-xs text-amber-950 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Il Segreto di Manuel & Samanta:</strong> {rec.chefTip}
                      {rec.winePairingLabel && (
                        <div className="mt-1 font-semibold flex items-center gap-1">
                          <Wine className="w-3.5 h-3.5" />
                          <span>Vino consigliato: {rec.winePairingLabel}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: DAILY COMPETITOR BENCHMARK & FIREBASE MULTILINGUAL EDITOR */}
          {activeTab === 'competitors_i18n' && (
            <div className="space-y-4">
              {/* Competitor Daily Price Comparison */}
              {product.competitorIntelligence && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                      <TrendingDown className="w-4 h-4 text-emerald-600" />
                      <span>Confronto Prezzi Giornaliero (Normalizzato €/{product.competitorIntelligence.comparisonUnit})</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                      Nostro: €{product.competitorIntelligence.ourNormalizedPrice.toFixed(2)}/{product.competitorIntelligence.comparisonUnit}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {product.competitorIntelligence.benchmarks.map((b, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <strong className="text-stone-800 block">{b.competitorName}</strong>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Livello: {b.marketScope} · {b.countryCode}
                          </span>
                        </div>
                        <div className="text-right font-mono">
                          <span className="text-stone-600 block">
                            €{b.normalizedPricePerUnit.toFixed(2)}/{product.competitorIntelligence?.comparisonUnit}
                          </span>
                          <strong className="text-emerald-700 text-[11px]">
                            Noi {b.ourDiffPercent}%
                          </strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Firebase Multilingual Editor for this Product */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
                      Zero Testi Cablati · Tabella Firebase &ldquo;products&rdquo;
                    </span>
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                      Modifica Testi in Italiano e Traduzioni Multilingua
                    </h4>
                  </div>
                  <select
                    value={editLang}
                    onChange={(e) => setEditLang(e.target.value as LanguageCode)}
                    className="px-2.5 py-1.5 rounded-xl bg-white border border-amber-400 text-xs font-bold text-stone-900 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.label} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                      Titolo Articolo ({editLang}):
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                      Porzione / Unità Descrittiva ({editLang}):
                    </label>
                    <input
                      type="text"
                      value={editPortion}
                      onChange={(e) => setEditPortion(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 block mb-0.5">
                      Descrizione Completa ({editLang}):
                    </label>
                    <textarea
                      rows={3}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                    />
                  </div>
                  <button
                    onClick={handleSaveMultilingualToFirebase}
                    disabled={isSavingI18n}
                    className="w-full py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {isSavingI18n
                        ? 'Salvataggio su Firebase in corso...'
                        : `Salva Traduzione (${editLang}) su Firebase`}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Add-to-Cart Bar (Always Visible on Mobile!) */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-white border border-stone-300 rounded-xl px-2 py-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 text-stone-700 hover:text-stone-950 cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-sm px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 text-stone-700 hover:text-stone-950 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              const multiplier =
                isCartonMode && unitConv.cartonPackInfo
                  ? unitConv.cartonPackInfo.unitsInCarton
                  : 1;
              addToCart(
                product,
                quantity * multiplier,
                `${isCartonMode ? 'Scatolone Multiplo · ' : ''}${selectedPrepOption}`
              );
              setSelectedProductDetail(null);
            }}
            className="flex-1 py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>
              {uiText('btn_add_to_cart', 'Aggiungi')} · €{(unitPrice * quantity).toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
