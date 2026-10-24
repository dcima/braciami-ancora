import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { LanguageCode, LanguageOption, SUPPORTED_LANGUAGES } from './types';
import { TRANSLATIONS, Translations } from './translations';
import { UiElement, StoreConfig, UnitOfMeasureDefinition } from '../types';
import { SEED_UI_ELEMENTS, SEED_STORE_CONFIG } from '../data/uiElementsData';
import { SEED_UNITS_OF_MEASURE } from '../utils/unitConversion';
import { FirestoreService } from '../firebase/firestoreService';

export interface SimulatedCityProfile {
  city: string;
  countryCode: string;
  countryName: string;
  lat: number;
  lng: number;
  lang: LanguageCode;
}

export interface I18nContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  detectedLocale: LanguageCode;
  detectedCountry: string;
  detectedCity: string;
  detectedCountryName: string;
  estimatedDistanceKm: number;
  resetToLocale: () => void;
  t: (key: keyof Translations | string, fallback?: string) => string;
  uiText: (elementId: string, fallback?: string) => string;
  uiElements: Record<string, UiElement>;
  unitsOfMeasure: Record<string, UnitOfMeasureDefinition>;
  refreshUiElements: () => Promise<void>;
  currentLanguageOption: LanguageOption;
  isRtl: boolean;
  dir: 'ltr' | 'rtl';
  storeConfig: StoreConfig;
  setSimulatedCountry: (countryCode: string) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'braciami_language_choice_v1';
const DETECTED_KEY = 'braciami_detected_locale_v1';
const COUNTRY_KEY = 'braciami_detected_country_v1';
const CITY_KEY = 'braciami_detected_city_v1';

// Cento (FE) Bottega Reference Point - Via Penzale 25, 44042 Cento FE
const CENTO_LAT = 44.7275;
const CENTO_LNG = 11.2891;

// Pool of real cities for each country to simulate a random city when switching language or country
export const COUNTRY_CITIES_POOL: Record<string, SimulatedCityProfile[]> = {
  IT: [
    { city: 'Cento (FE)', countryCode: 'IT', countryName: 'Italia', lat: 44.7275, lng: 11.2891, lang: 'it_IT' },
    { city: 'Ferrara', countryCode: 'IT', countryName: 'Italia', lat: 44.8381, lng: 11.6198, lang: 'it_IT' },
    { city: 'Bologna', countryCode: 'IT', countryName: 'Italia', lat: 44.4949, lng: 11.3426, lang: 'it_IT' },
    { city: 'Milano', countryCode: 'IT', countryName: 'Italia', lat: 45.4642, lng: 9.1900, lang: 'it_IT' },
    { city: 'Roma', countryCode: 'IT', countryName: 'Italia', lat: 41.9028, lng: 12.4964, lang: 'it_IT' },
    { city: 'Firenze', countryCode: 'IT', countryName: 'Italia', lat: 43.7696, lng: 11.2558, lang: 'it_IT' },
    { city: 'Torino', countryCode: 'IT', countryName: 'Italia', lat: 45.0703, lng: 7.6869, lang: 'it_IT' },
    { city: 'Venezia', countryCode: 'IT', countryName: 'Italia', lat: 45.4408, lng: 12.3155, lang: 'it_IT' },
    { city: 'Verona', countryCode: 'IT', countryName: 'Italia', lat: 45.4384, lng: 10.9916, lang: 'it_IT' },
    { city: 'Napoli', countryCode: 'IT', countryName: 'Italia', lat: 40.8518, lng: 14.2681, lang: 'it_IT' }
  ],
  GB: [
    { city: 'London', countryCode: 'GB', countryName: 'United Kingdom', lat: 51.5074, lng: -0.1278, lang: 'en_US' },
    { city: 'Manchester', countryCode: 'GB', countryName: 'United Kingdom', lat: 53.4808, lng: -2.2426, lang: 'en_US' },
    { city: 'Edinburgh', countryCode: 'GB', countryName: 'United Kingdom', lat: 55.9533, lng: -3.1883, lang: 'en_US' },
    { city: 'Birmingham', countryCode: 'GB', countryName: 'United Kingdom', lat: 52.4862, lng: -1.8904, lang: 'en_US' },
    { city: 'Liverpool', countryCode: 'GB', countryName: 'United Kingdom', lat: 53.4084, lng: -2.9916, lang: 'en_US' },
    { city: 'Bristol', countryCode: 'GB', countryName: 'United Kingdom', lat: 51.4545, lng: -2.5879, lang: 'en_US' },
    { city: 'Oxford', countryCode: 'GB', countryName: 'United Kingdom', lat: 51.7520, lng: -1.2577, lang: 'en_US' },
    { city: 'Cambridge', countryCode: 'GB', countryName: 'United Kingdom', lat: 52.2053, lng: 0.1218, lang: 'en_US' }
  ],
  DE: [
    { city: 'Berlin', countryCode: 'DE', countryName: 'Deutschland', lat: 52.5200, lng: 13.4050, lang: 'de_DE' },
    { city: 'München', countryCode: 'DE', countryName: 'Deutschland', lat: 48.1351, lng: 11.5820, lang: 'de_DE' },
    { city: 'Hamburg', countryCode: 'DE', countryName: 'Deutschland', lat: 53.5511, lng: 9.9937, lang: 'de_DE' },
    { city: 'Frankfurt am Main', countryCode: 'DE', countryName: 'Deutschland', lat: 50.1109, lng: 8.6821, lang: 'de_DE' },
    { city: 'Köln', countryCode: 'DE', countryName: 'Deutschland', lat: 50.9375, lng: 6.9603, lang: 'de_DE' },
    { city: 'Stuttgart', countryCode: 'DE', countryName: 'Deutschland', lat: 48.7758, lng: 9.1829, lang: 'de_DE' },
    { city: 'Düsseldorf', countryCode: 'DE', countryName: 'Deutschland', lat: 51.2277, lng: 6.7735, lang: 'de_DE' },
    { city: 'Dresden', countryCode: 'DE', countryName: 'Deutschland', lat: 51.0504, lng: 13.7373, lang: 'de_DE' }
  ],
  FR: [
    { city: 'Paris', countryCode: 'FR', countryName: 'France', lat: 48.8566, lng: 2.3522, lang: 'fr_FR' },
    { city: 'Lyon', countryCode: 'FR', countryName: 'France', lat: 45.7640, lng: 4.8357, lang: 'fr_FR' },
    { city: 'Marseille', countryCode: 'FR', countryName: 'France', lat: 43.2965, lng: 5.3698, lang: 'fr_FR' },
    { city: 'Bordeaux', countryCode: 'FR', countryName: 'France', lat: 44.8378, lng: -0.5792, lang: 'fr_FR' },
    { city: 'Nice', countryCode: 'FR', countryName: 'France', lat: 43.7102, lng: 7.2620, lang: 'fr_FR' },
    { city: 'Toulouse', countryCode: 'FR', countryName: 'France', lat: 43.6047, lng: 1.4442, lang: 'fr_FR' },
    { city: 'Strasbourg', countryCode: 'FR', countryName: 'France', lat: 48.5734, lng: 7.7521, lang: 'fr_FR' },
    { city: 'Lille', countryCode: 'FR', countryName: 'France', lat: 50.6292, lng: 3.0573, lang: 'fr_FR' }
  ],
  ES: [
    { city: 'Madrid', countryCode: 'ES', countryName: 'España', lat: 40.4168, lng: -3.7038, lang: 'es_ES' },
    { city: 'Barcelona', countryCode: 'ES', countryName: 'España', lat: 41.3874, lng: 2.1686, lang: 'es_ES' },
    { city: 'Valencia', countryCode: 'ES', countryName: 'España', lat: 39.4699, lng: -0.3763, lang: 'es_ES' },
    { city: 'Sevilla', countryCode: 'ES', countryName: 'España', lat: 37.3891, lng: -5.9845, lang: 'es_ES' },
    { city: 'Bilbao', countryCode: 'ES', countryName: 'España', lat: 43.2630, lng: -2.9350, lang: 'es_ES' },
    { city: 'Málaga', countryCode: 'ES', countryName: 'España', lat: 36.7213, lng: -4.4214, lang: 'es_ES' },
    { city: 'Zaragoza', countryCode: 'ES', countryName: 'España', lat: 41.6488, lng: -0.8891, lang: 'es_ES' }
  ],
  NL: [
    { city: 'Amsterdam', countryCode: 'NL', countryName: 'Nederland', lat: 52.3676, lng: 4.9041, lang: 'nl_NL' },
    { city: 'Rotterdam', countryCode: 'NL', countryName: 'Nederland', lat: 51.9244, lng: 4.4777, lang: 'nl_NL' },
    { city: 'Utrecht', countryCode: 'NL', countryName: 'Nederland', lat: 52.0907, lng: 5.1214, lang: 'nl_NL' },
    { city: 'Den Haag', countryCode: 'NL', countryName: 'Nederland', lat: 52.0705, lng: 4.3007, lang: 'nl_NL' },
    { city: 'Eindhoven', countryCode: 'NL', countryName: 'Nederland', lat: 51.4416, lng: 5.4697, lang: 'nl_NL' },
    { city: 'Maastricht', countryCode: 'NL', countryName: 'Nederland', lat: 50.8514, lng: 5.6910, lang: 'nl_NL' }
  ],
  SE: [
    { city: 'Stockholm', countryCode: 'SE', countryName: 'Sverige', lat: 59.3293, lng: 18.0686, lang: 'sv_SE' },
    { city: 'Göteborg', countryCode: 'SE', countryName: 'Sverige', lat: 57.7089, lng: 11.9746, lang: 'sv_SE' },
    { city: 'Malmö', countryCode: 'SE', countryName: 'Sverige', lat: 55.6050, lng: 13.0038, lang: 'sv_SE' },
    { city: 'Uppsala', countryCode: 'SE', countryName: 'Sverige', lat: 59.8586, lng: 17.6389, lang: 'sv_SE' },
    { city: 'Västerås', countryCode: 'SE', countryName: 'Sverige', lat: 59.6099, lng: 16.5448, lang: 'sv_SE' }
  ],
  CN: [
    { city: 'Shanghai', countryCode: 'CN', countryName: 'China', lat: 31.2304, lng: 121.4737, lang: 'zh_CN' },
    { city: 'Beijing', countryCode: 'CN', countryName: 'China', lat: 39.9042, lng: 116.4074, lang: 'zh_CN' },
    { city: 'Shenzhen', countryCode: 'CN', countryName: 'China', lat: 22.5431, lng: 114.0579, lang: 'zh_CN' },
    { city: 'Guangzhou', countryCode: 'CN', countryName: 'China', lat: 23.1291, lng: 113.2644, lang: 'zh_CN' },
    { city: 'Chengdu', countryCode: 'CN', countryName: 'China', lat: 30.5728, lng: 104.0668, lang: 'zh_CN' },
    { city: 'Hangzhou', countryCode: 'CN', countryName: 'China', lat: 30.2741, lng: 120.1551, lang: 'zh_CN' }
  ],
  JP: [
    { city: 'Tokyo', countryCode: 'JP', countryName: 'Japan', lat: 35.6762, lng: 139.6503, lang: 'ja_JP' },
    { city: 'Osaka', countryCode: 'JP', countryName: 'Japan', lat: 34.6937, lng: 135.5023, lang: 'ja_JP' },
    { city: 'Kyoto', countryCode: 'JP', countryName: 'Japan', lat: 35.0116, lng: 135.7681, lang: 'ja_JP' },
    { city: 'Yokohama', countryCode: 'JP', countryName: 'Japan', lat: 35.4437, lng: 139.6380, lang: 'ja_JP' },
    { city: 'Sapporo', countryCode: 'JP', countryName: 'Japan', lat: 43.0618, lng: 141.3545, lang: 'ja_JP' },
    { city: 'Fukuoka', countryCode: 'JP', countryName: 'Japan', lat: 33.5902, lng: 130.4017, lang: 'ja_JP' }
  ],
  RU: [
    { city: 'Moskva', countryCode: 'RU', countryName: 'Russia', lat: 55.7558, lng: 37.6173, lang: 'ru_RU' },
    { city: 'Sankt-Peterburg', countryCode: 'RU', countryName: 'Russia', lat: 59.9343, lng: 30.3351, lang: 'ru_RU' },
    { city: 'Kazan', countryCode: 'RU', countryName: 'Russia', lat: 55.7961, lng: 49.1064, lang: 'ru_RU' },
    { city: 'Novosibirsk', countryCode: 'RU', countryName: 'Russia', lat: 55.0084, lng: 82.9357, lang: 'ru_RU' },
    { city: 'Sochi', countryCode: 'RU', countryName: 'Russia', lat: 43.5855, lng: 39.7231, lang: 'ru_RU' }
  ],
  SA: [
    { city: 'Riyadh', countryCode: 'SA', countryName: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, lang: 'ar_SA' },
    { city: 'Jeddah', countryCode: 'SA', countryName: 'Saudi Arabia', lat: 21.4858, lng: 39.1925, lang: 'ar_SA' },
    { city: 'Dammam', countryCode: 'SA', countryName: 'Saudi Arabia', lat: 26.4207, lng: 50.0888, lang: 'ar_SA' },
    { city: 'Mecca', countryCode: 'SA', countryName: 'Saudi Arabia', lat: 21.3891, lng: 39.8579, lang: 'ar_SA' }
  ],
  US: [
    { city: 'New York', countryCode: 'US', countryName: 'United States', lat: 40.7128, lng: -74.0060, lang: 'en_US' },
    { city: 'Chicago', countryCode: 'US', countryName: 'United States', lat: 41.8781, lng: -87.6298, lang: 'en_US' },
    { city: 'Boston', countryCode: 'US', countryName: 'United States', lat: 42.3601, lng: -71.0589, lang: 'en_US' },
    { city: 'San Francisco', countryCode: 'US', countryName: 'United States', lat: 37.7749, lng: -122.4194, lang: 'en_US' }
  ]
};

export const LANGUAGE_TO_COUNTRY: Record<LanguageCode, string> = {
  it_IT: 'IT',
  en_US: 'GB',
  de_DE: 'DE',
  fr_FR: 'FR',
  es_ES: 'ES',
  nl_NL: 'NL',
  sv_SE: 'SE',
  zh_CN: 'CN',
  ja_JP: 'JP',
  ru_RU: 'RU',
  ar_SA: 'SA'
};

export function pickRandomCityForCountry(countryCode: string, excludeCity?: string): SimulatedCityProfile {
  const code = countryCode.toUpperCase();
  const pool = COUNTRY_CITIES_POOL[code] || COUNTRY_CITIES_POOL.IT;
  const candidates = pool.length > 1 && excludeCity ? pool.filter((c) => c.city !== excludeCity) : pool;
  const idx = Math.floor(Math.random() * candidates.length);
  return candidates[idx] || pool[0];
}

// Approximate geographical centroids fallback for distance calculation from Cento FE
export const COUNTRY_PROFILES: Record<string, { lat: number; lng: number; name: string; lang: LanguageCode }> = {
  IT: { lat: 44.7275, lng: 11.2891, name: 'Italia (Cento / Ferrara)', lang: 'it_IT' },
  GB: { lat: 53.4808, lng: -2.2426, name: 'United Kingdom (Manchester)', lang: 'en_US' },
  DE: { lat: 52.5200, lng: 13.4050, name: 'Deutschland (Berlin)', lang: 'de_DE' },
  NL: { lat: 52.3676, lng: 4.9041, name: 'Nederland (Amsterdam)', lang: 'nl_NL' },
  SE: { lat: 59.3293, lng: 18.0686, name: 'Sverige (Stockholm)', lang: 'sv_SE' },
  DK: { lat: 55.6761, lng: 12.5683, name: 'Danmark (København)', lang: 'en_US' },
  FR: { lat: 48.8566, lng: 2.3522, name: 'France (Paris)', lang: 'fr_FR' },
  ES: { lat: 40.4168, lng: -3.7038, name: 'España (Madrid)', lang: 'es_ES' },
  CN: { lat: 31.2304, lng: 121.4737, name: 'China (Shanghai)', lang: 'zh_CN' },
  JP: { lat: 35.6762, lng: 139.6503, name: 'Japan (Tokyo)', lang: 'ja_JP' },
  RU: { lat: 55.7558, lng: 37.6173, name: 'Russia (Moscow)', lang: 'ru_RU' },
  SA: { lat: 24.7136, lng: 46.6753, name: 'Saudi Arabia (Riyadh)', lang: 'ar_SA' },
  US: { lat: 40.7128, lng: -74.0060, name: 'United States (New York)', lang: 'en_US' }
};

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

// Country code to LanguageCode mapping
export function normalizeCountryParam(raw?: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().toUpperCase();
  if (!cleaned) return null;

  // Support language codes or common country aliases (case-insensitive)
  if (cleaned === 'UK' || cleaned === 'EN' || cleaned === 'EN_US' || cleaned === 'EN_GB') return 'GB';
  if (cleaned === 'IT_IT') return 'IT';
  if (cleaned === 'DE_DE' || cleaned === 'AT' || cleaned === 'CH') return 'DE';
  if (cleaned === 'FR_FR') return 'FR';
  if (cleaned === 'ES_ES') return 'ES';
  if (cleaned === 'NL_NL' || cleaned === 'BE') return 'NL';
  if (cleaned === 'SV' || cleaned === 'SV_SE') return 'SE';
  if (cleaned === 'ZH' || cleaned === 'ZH_CN') return 'CN';
  if (cleaned === 'JA' || cleaned === 'JA_JP') return 'JP';
  if (cleaned === 'RU_RU') return 'RU';
  if (cleaned === 'AR' || cleaned === 'AR_SA') return 'SA';

  return cleaned;
}

export function getUrlCountryParam(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    // Support ?country=DE or ?COUNTRY=de (case-insensitive parameter key)
    for (const [key, val] of params.entries()) {
      if (key.toLowerCase() === 'country' && val) {
        return normalizeCountryParam(val);
      }
    }
  } catch {}
  return null;
}

export function syncUrlCountryParam(countryCode: string) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    // Remove any case variant of 'country'
    Array.from(url.searchParams.keys()).forEach((k) => {
      if (k.toLowerCase() === 'country') {
        url.searchParams.delete(k);
      }
    });
    url.searchParams.set('country', countryCode.toUpperCase());
    window.history.replaceState({}, '', url.toString());
  } catch {}
}

export function isDevelopmentEnvironment(): boolean {
  try {
    if ((import.meta as any).env?.DEV) return true;
  } catch {}
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host.startsWith('192.168.') ||
      host.startsWith('10.') ||
      host.endsWith('.local')
    ) {
      return true;
    }
  }
  return false;
}

export function mapCountryToLanguage(countryCode?: string): LanguageCode {
  if (!countryCode) return 'it_IT';
  const c = normalizeCountryParam(countryCode) || 'IT';

  if (['IT', 'SM', 'VA'].includes(c)) return 'it_IT';
  if (['GB', 'UK', 'US', 'CA', 'AU', 'NZ', 'IE'].includes(c)) return 'en_US';
  if (['DE', 'AT', 'LI', 'CH'].includes(c)) return 'de_DE';
  if (['NL', 'BE'].includes(c)) return 'nl_NL';
  if (['SE', 'NO', 'FI'].includes(c)) return 'sv_SE';
  if (['FR', 'MC', 'LU'].includes(c)) return 'fr_FR';
  if (['ES', 'MX', 'AR', 'CO', 'CL', 'PE'].includes(c)) return 'es_ES';
  if (['CN', 'HK', 'TW', 'SG'].includes(c)) return 'zh_CN';
  if (['JP'].includes(c)) return 'ja_JP';
  if (['RU', 'BY', 'KZ'].includes(c)) return 'ru_RU';
  if (['SA', 'AE', 'EG', 'QA'].includes(c)) return 'ar_SA';

  return 'it_IT';
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read ?country=XX from URL at startup. If not specified -> default to IT (it_IT)
  const initialUrlCountry = useMemo(() => getUrlCountryParam(), []);

  const [detectedCountry, setDetectedCountry] = useState<string>(() => {
    return initialUrlCountry || 'IT';
  });

  const [detectedCity, setDetectedCity] = useState<string>(() => {
    const startCountry = initialUrlCountry || 'IT';
    const picked = pickRandomCityForCountry(startCountry);
    return picked.city;
  });

  // Exact georeferenced coordinates & country name (used in production when georeferencing resolves)
  const [exactGeoCoords, setExactGeoCoords] = useState<{
    lat: number;
    lng: number;
    countryName?: string;
    city?: string;
  } | null>(null);

  const [detectedLocale, setDetectedLocale] = useState<LanguageCode>(() => {
    if (initialUrlCountry) {
      return mapCountryToLanguage(initialUrlCountry);
    }
    return 'it_IT';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (initialUrlCountry) {
      return mapCountryToLanguage(initialUrlCountry);
    }
    // Se ?country non è specificato nell'URL, imposta sempre IT (it_IT)
    return 'it_IT';
  });

  // Table user_interface elements from Firestore
  const [uiElements, setUiElements] = useState<Record<string, UiElement>>(() => {
    const map: Record<string, UiElement> = {};
    SEED_UI_ELEMENTS.forEach((e) => {
      map[e.element_id] = e;
    });
    return map;
  });

  const [unitsOfMeasure, setUnitsOfMeasure] = useState<Record<string, UnitOfMeasureDefinition>>(() => {
    const map: Record<string, UnitOfMeasureDefinition> = {};
    SEED_UNITS_OF_MEASURE.forEach((u) => {
      map[u.unit_id] = u;
    });
    return map;
  });

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(SEED_STORE_CONFIG);

  // Load UI elements, Units of Measure and Store Config from Firebase Firestore
  const refreshUiElements = useCallback(async () => {
    try {
      const [elements, cfg, units] = await Promise.all([
        FirestoreService.getUiElements(),
        FirestoreService.getStoreConfig(),
        FirestoreService.getUnitsOfMeasure()
      ]);
      if (elements && elements.length > 0) {
        const map: Record<string, UiElement> = {};
        SEED_UI_ELEMENTS.forEach((seed) => {
          map[seed.element_id] = seed;
        });
        const forcedSeedIds = new Set([
          'nav_catalog',
          'nav_home',
          'nav_support',
          'nav_fairs_events',
          'catalog_subtitle_badge',
          'search_placeholder_ean',
          'search_tip_ean',
          'search_clear_btn',
          'cat_no_products_for_query'
        ]);
        elements.forEach((e) => {
          if (forcedSeedIds.has(e.element_id)) {
            return;
          }
          map[e.element_id] = { ...(map[e.element_id] || {}), ...e };
        });
        setUiElements(map);
      }
      if (units && units.length > 0) {
        const uMap: Record<string, UnitOfMeasureDefinition> = {};
        units.forEach((u) => {
          uMap[u.unit_id] = u;
        });
        setUnitsOfMeasure(uMap);
      }
      if (cfg) {
        setStoreConfig(cfg);
      }
    } catch (err) {
      console.warn('Notice loading UI elements from Firestore:', err);
    }
  }, []);

  useEffect(() => {
    refreshUiElements();
  }, [refreshUiElements]);

  // Landing page ?country=XX parameter + Development (random city) vs Production (exact georeferencing)
  useEffect(() => {
    let isMounted = true;

    async function applyCountryAndGeolocation() {
      const urlCountry = getUrlCountryParam();
      const targetCountry = urlCountry || 'IT';
      const targetLang = urlCountry ? mapCountryToLanguage(urlCountry) : 'it_IT';
      const isDev = isDevelopmentEnvironment();

      if (isMounted) {
        setDetectedCountry(targetCountry);
        setLanguageState(targetLang);
      }

      if (isDev) {
        // IN SVILUPPO: imposta una località a caso del paese (targetCountry)
        const randomCity = pickRandomCityForCountry(targetCountry);
        if (isMounted) {
          setExactGeoCoords(null);
          setDetectedCity(randomCity.city);
        }
        return;
      }

      // IN PRODUZIONE: rileva la località esatta tramite georeferenziazione (IP Geolocation + HTML5 Geolocation)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch('https://ipwho.is/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success !== false && isMounted) {
            const ipCountry = normalizeCountryParam(data.country_code) || 'IT';
            const ipCity = data.city || '';
            const ipLat = typeof data.latitude === 'number' ? data.latitude : null;
            const ipLng = typeof data.longitude === 'number' ? data.longitude : null;
            const ipCountryName = data.country || ipCountry;

            setDetectedLocale(mapCountryToLanguage(ipCountry));

            // Se non c'è ?country nell'URL oppure ?country coincide con il paese georeferenziato, usa la città esatta georeferenziata
            if (!urlCountry || urlCountry === ipCountry) {
              if (ipCity && ipLat !== null && ipLng !== null) {
                setDetectedCity(ipCity);
                setExactGeoCoords({
                  lat: ipLat,
                  lng: ipLng,
                  countryName: ipCountryName,
                  city: ipCity
                });
              }
            } else {
              // Se in produzione è stato forzato un ?country=XX diverso dall'IP, cerca di georeferenziare o usa località del paese richiesto
              const fallbackCity = pickRandomCityForCountry(targetCountry);
              setDetectedCity(fallbackCity.city);
              setExactGeoCoords(null);
            }
          }
        }
      } catch {
        // Fallback secondario per georeferenziazione in produzione (ipapi.co)
        try {
          const resFallback = await fetch('https://ipapi.co/json/');
          if (resFallback.ok && isMounted) {
            const data = await resFallback.json();
            const ipCountry = normalizeCountryParam(data.country_code) || 'IT';
            const ipCity = data.city || '';
            const ipLat = typeof data.latitude === 'number' ? data.latitude : null;
            const ipLng = typeof data.longitude === 'number' ? data.longitude : null;
            if ((!urlCountry || urlCountry === ipCountry) && ipCity && ipLat !== null && ipLng !== null) {
              setDetectedCity(ipCity);
              setExactGeoCoords({
                lat: ipLat,
                lng: ipLng,
                countryName: data.country_name || ipCountry,
                city: ipCity
              });
            }
          }
        } catch {}
      }

      // Se in produzione il browser ha già il permesso GPS/Geolocation attivo, affina con coordinate GPS esatte (Nominatim Reverse Geocoding)
      if (typeof navigator !== 'undefined' && 'geolocation' in navigator && 'permissions' in navigator) {
        try {
          const perm = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
          if (perm.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                if (!isMounted) return;
                const { latitude, longitude } = pos.coords;
                try {
                  const revRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                  );
                  if (revRes.ok && isMounted) {
                    const revData = await revRes.json();
                    const addr = revData.address || {};
                    const exactCity =
                      addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
                    const exactCountryCode = normalizeCountryParam(addr.country_code) || targetCountry;
                    if (!urlCountry || urlCountry === exactCountryCode) {
                      if (exactCity) setDetectedCity(exactCity);
                      setExactGeoCoords({
                        lat: latitude,
                        lng: longitude,
                        countryName: addr.country || exactCountryCode,
                        city: exactCity || undefined
                      });
                    }
                  }
                } catch {}
              },
              () => {},
              { timeout: 3000, maximumAge: 60000 }
            );
          }
        } catch {}
      }
    }

    applyCountryAndGeolocation();

    const handlePopState = () => {
      applyCountryAndGeolocation();
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    const relativeCountry = LANGUAGE_TO_COUNTRY[lang] || 'IT';
    const picked = pickRandomCityForCountry(relativeCountry, detectedCity);
    setExactGeoCoords(null);
    setDetectedCountry(relativeCountry);
    setDetectedCity(picked.city);
    syncUrlCountryParam(relativeCountry);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(COUNTRY_KEY, relativeCountry);
      localStorage.setItem(CITY_KEY, picked.city);
    } catch {}
  };

  const setSimulatedCountry = (countryCode: string) => {
    const c = normalizeCountryParam(countryCode) || 'IT';
    const picked = pickRandomCityForCountry(c, detectedCity);
    setExactGeoCoords(null);
    setDetectedCountry(c);
    setDetectedCity(picked.city);
    const mapped = mapCountryToLanguage(c);
    setLanguageState(mapped);
    syncUrlCountryParam(c);
    try {
      localStorage.setItem(COUNTRY_KEY, c);
      localStorage.setItem(CITY_KEY, picked.city);
      localStorage.setItem(STORAGE_KEY, mapped);
    } catch {}
  };

  const resetToLocale = () => {
    const relCountry = LANGUAGE_TO_COUNTRY[detectedLocale] || 'IT';
    const picked = pickRandomCityForCountry(relCountry, detectedCity);
    setExactGeoCoords(null);
    setDetectedCountry(relCountry);
    setDetectedCity(picked.city);
    setLanguageState(detectedLocale);
    syncUrlCountryParam(relCountry);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(COUNTRY_KEY, relCountry);
      localStorage.setItem(CITY_KEY, picked.city);
    } catch {}
  };

  const activeCityProfile = useMemo(() => {
    const pool = COUNTRY_CITIES_POOL[detectedCountry] || COUNTRY_CITIES_POOL.IT;
    const found = pool.find((item) => item.city === detectedCity);
    if (found) return found;
    return pool[0];
  }, [detectedCountry, detectedCity]);

  // Estimated distance in KM from Bottega in Via Penzale 25, 44042 Cento FE
  const estimatedDistanceKm = useMemo(() => {
    if (exactGeoCoords) {
      return calculateDistanceKm(CENTO_LAT, CENTO_LNG, exactGeoCoords.lat, exactGeoCoords.lng);
    }
    if (activeCityProfile) {
      return calculateDistanceKm(CENTO_LAT, CENTO_LNG, activeCityProfile.lat, activeCityProfile.lng);
    }
    const profile = COUNTRY_PROFILES[detectedCountry] || { lat: 44.7275, lng: 11.2891 };
    return calculateDistanceKm(CENTO_LAT, CENTO_LNG, profile.lat, profile.lng);
  }, [exactGeoCoords, activeCityProfile, detectedCountry]);

  const detectedCountryName = useMemo(() => {
    if (exactGeoCoords && exactGeoCoords.city) {
      return `${exactGeoCoords.countryName || detectedCountry} · ${exactGeoCoords.city}`;
    }
    if (activeCityProfile) {
      return `${activeCityProfile.countryName} · ${detectedCity || activeCityProfile.city}`;
    }
    return COUNTRY_PROFILES[detectedCountry]?.name || detectedCountry;
  }, [exactGeoCoords, activeCityProfile, detectedCountry, detectedCity]);

  const currentLanguageOption = useMemo(() => {
    return SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  }, [language]);

  const isRtl = Boolean(currentLanguageOption.isRtl);
  const dir: 'ltr' | 'rtl' = isRtl ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language.replace('_', '-');
    document.documentElement.dir = dir;
  }, [language, dir]);

  /**
   * Reads from Firebase user_interface table by element ID
   * Guarantees exact translations for buttons like "ENTRA IN NEGOZIO" -> "ENTER THE SHOP",
   * while never translating proper titles ("Braciami Ancora") and locations ("Cento / Ferrara").
   */
  const uiText = useCallback(
    (elementId: string, fallback?: string): string => {
      const elem = uiElements[elementId];
      if (elem) {
        if (language === 'en_US' && elem.en) return elem.en;
        if (language === 'de_DE' && elem.de) return elem.de;
        if (language === 'fr_FR' && elem.fr) return elem.fr;
        if (language === 'es_ES' && elem.es) return elem.es;
        if (language === 'nl_NL' && elem.nl) return elem.nl;
        if (language === 'sv_SE' && elem.sv) return elem.sv;
        if (language === 'zh_CN' && elem.zh) return elem.zh;
        if (language === 'ja_JP' && elem.ja) return elem.ja;
        if (language === 'ru_RU' && elem.ru) return elem.ru;
        if (language === 'ar_SA' && elem.ar) return elem.ar;
        if (language === 'it_IT' && elem.it) return elem.it;
      }

      // Check legacy dictionary for the active language before falling back to English/Italian
      const langDict = TRANSLATIONS[language] || TRANSLATIONS.it_IT;
      const dictValue = (langDict as any)[elementId];
      if (dictValue) return dictValue;

      if (elem) {
        if (elem.en && language !== 'it_IT') return elem.en;
        if (elem.it) return elem.it;
      }

      return fallback || elementId;
    },
    [uiElements, language]
  );

  const t = useCallback(
    (key: keyof Translations | string, fallback?: string): string => {
      const elem = uiElements[key];
      if (elem) {
        if (language === 'en_US' && elem.en) return elem.en;
        if (language === 'de_DE' && elem.de) return elem.de;
        if (language === 'fr_FR' && elem.fr) return elem.fr;
        if (language === 'es_ES' && elem.es) return elem.es;
        if (language === 'nl_NL' && elem.nl) return elem.nl;
        if (language === 'sv_SE' && elem.sv) return elem.sv;
        if (language === 'zh_CN' && elem.zh) return elem.zh;
        if (language === 'ja_JP' && elem.ja) return elem.ja;
        if (language === 'ru_RU' && elem.ru) return elem.ru;
        if (language === 'ar_SA' && elem.ar) return elem.ar;
        if (language === 'it_IT' && elem.it) return elem.it;
      }

      const langDict = TRANSLATIONS[language] || TRANSLATIONS.it_IT;
      const value = (langDict as any)[key];
      if (value) return value;

      if (elem) {
        if (elem.en && language !== 'it_IT') return elem.en;
        if (elem.it) return elem.it;
      }

      const itValue = (TRANSLATIONS.it_IT as any)[key];
      if (itValue) return itValue;
      return fallback || String(key);
    },
    [uiElements, language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        detectedLocale,
        detectedCountry,
        detectedCity,
        detectedCountryName,
        estimatedDistanceKm,
        resetToLocale,
        t,
        uiText,
        uiElements,
        unitsOfMeasure,
        refreshUiElements,
        currentLanguageOption,
        isRtl,
        dir,
        storeConfig,
        setSimulatedCountry
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
