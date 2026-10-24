import { CommercialUnitCode, UnitOfMeasureDefinition, Product } from '../types';
import { LanguageCode } from '../i18n/types';

/**
 * Tabella Firebase: units_of_measure
 * Gestisce tutte le unità di misura e confezionamento (grammi, ettogrammi, chilogrammi,
 * millilitri, litri, pezzi, porzioni, confezioni, bottiglie, scatoloni, cesti, unità)
 * con traduzione in tutte le 11 lingue supportate.
 */
export const SEED_UNITS_OF_MEASURE: UnitOfMeasureDefinition[] = [
  {
    unit_id: 'g',
    category: 'weight',
    baseMetricEquivalentGramsOrMl: 1,
    symbol_translations: {
      it_IT: 'g', en_US: 'g', de_DE: 'g', fr_FR: 'g', es_ES: 'g', nl_NL: 'g', sv_SE: 'g', zh_CN: '克', ja_JP: 'g', ru_RU: 'г', ar_SA: 'غ'
    },
    name_singular_translations: {
      it_IT: 'Grammo', en_US: 'Gram', de_DE: 'Gramm', fr_FR: 'Gramme', es_ES: 'Gramo', nl_NL: 'Gram', sv_SE: 'Gram', zh_CN: '克 (g)', ja_JP: 'グラム', ru_RU: 'Грамм', ar_SA: 'غرام'
    },
    name_plural_translations: {
      it_IT: 'Grammi', en_US: 'Grams', de_DE: 'Gramm', fr_FR: 'Grammes', es_ES: 'Gramos', nl_NL: 'Gram', sv_SE: 'Gram', zh_CN: '克', ja_JP: 'グラム', ru_RU: 'Граммы', ar_SA: 'غرامات'
    }
  },
  {
    unit_id: 'hg',
    category: 'weight',
    baseMetricEquivalentGramsOrMl: 100,
    symbol_translations: {
      it_IT: 'etto (100g)', en_US: '100g', de_DE: '100g', fr_FR: '100g', es_ES: '100g', nl_NL: '100g (ons)', sv_SE: 'hg (100g)', zh_CN: '两 (50g×2)', ja_JP: '100g', ru_RU: '100 г', ar_SA: '100 غرام'
    },
    name_singular_translations: {
      it_IT: 'Etto (100g)', en_US: '100 Grams', de_DE: '100 Gramm', fr_FR: '100 Grammes', es_ES: '100 Gramos', nl_NL: 'Ons (100g)', sv_SE: 'Hektogram', zh_CN: '百克 (2两)', ja_JP: '100グラム', ru_RU: '100 грамм', ar_SA: '100 غرام'
    },
    name_plural_translations: {
      it_IT: 'Etti', en_US: '100g units', de_DE: '100g-Einheiten', fr_FR: '100g', es_ES: '100g', nl_NL: 'Ons', sv_SE: 'Hektogram', zh_CN: '百克', ja_JP: '100g単位', ru_RU: 'По 100 г', ar_SA: 'مئات الغرامات'
    }
  },
  {
    unit_id: 'kg',
    category: 'weight',
    baseMetricEquivalentGramsOrMl: 1000,
    symbol_translations: {
      it_IT: 'kg', en_US: 'kg', de_DE: 'kg', fr_FR: 'kg', es_ES: 'kg', nl_NL: 'kg', sv_SE: 'kg', zh_CN: '千克 (2斤)', ja_JP: 'kg', ru_RU: 'кг', ar_SA: 'كجم'
    },
    name_singular_translations: {
      it_IT: 'Chilogrammo', en_US: 'Kilogram', de_DE: 'Kilogramm', fr_FR: 'Kilogramme', es_ES: 'Kilogramo', nl_NL: 'Kilogram', sv_SE: 'Kilogram', zh_CN: '千克 / 公斤', ja_JP: 'キログラム', ru_RU: 'Килограмм', ar_SA: 'كيلوغرام'
    },
    name_plural_translations: {
      it_IT: 'Chilogrammi', en_US: 'Kilograms', de_DE: 'Kilogramm', fr_FR: 'Kilogrammes', es_ES: 'Kilogramos', nl_NL: 'Kilogram', sv_SE: 'Kilogram', zh_CN: '千克 / 公斤', ja_JP: 'キログラム', ru_RU: 'Килограммы', ar_SA: 'كيلوغرامات'
    }
  },
  {
    unit_id: 'ml',
    category: 'volume',
    baseMetricEquivalentGramsOrMl: 1,
    symbol_translations: {
      it_IT: 'ml', en_US: 'ml', de_DE: 'ml', fr_FR: 'ml', es_ES: 'ml', nl_NL: 'ml', sv_SE: 'ml', zh_CN: '毫升', ja_JP: 'ml', ru_RU: 'мл', ar_SA: 'مل'
    },
    name_singular_translations: {
      it_IT: 'Millilitro', en_US: 'Milliliter', de_DE: 'Milliliter', fr_FR: 'Millilitre', es_ES: 'Mililitro', nl_NL: 'Milliliter', sv_SE: 'Milliliter', zh_CN: '毫升', ja_JP: 'ミリリットル', ru_RU: 'Миллилитр', ar_SA: 'ملليلتر'
    },
    name_plural_translations: {
      it_IT: 'Millilitri', en_US: 'Milliliters', de_DE: 'Milliliter', fr_FR: 'Millilitres', es_ES: 'Mililitros', nl_NL: 'Milliliter', sv_SE: 'Milliliter', zh_CN: '毫升', ja_JP: 'ミリリットル', ru_RU: 'Миллилитры', ar_SA: 'ملليلترات'
    }
  },
  {
    unit_id: 'l',
    category: 'volume',
    baseMetricEquivalentGramsOrMl: 1000,
    symbol_translations: {
      it_IT: 'l', en_US: 'L', de_DE: 'l', fr_FR: 'L', es_ES: 'l', nl_NL: 'l', sv_SE: 'l', zh_CN: '升', ja_JP: 'L', ru_RU: 'л', ar_SA: 'لتر'
    },
    name_singular_translations: {
      it_IT: 'Litro', en_US: 'Liter', de_DE: 'Liter', fr_FR: 'Litre', es_ES: 'Litro', nl_NL: 'Liter', sv_SE: 'Liter', zh_CN: '升', ja_JP: 'リットル', ru_RU: 'Литр', ar_SA: 'لتر'
    },
    name_plural_translations: {
      it_IT: 'Litri', en_US: 'Liters', de_DE: 'Liter', fr_FR: 'Litres', es_ES: 'Litros', nl_NL: 'Liter', sv_SE: 'Liter', zh_CN: '升', ja_JP: 'リットル', ru_RU: 'Литры', ar_SA: 'لترات'
    }
  },
  {
    unit_id: 'pz',
    category: 'count',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'pz', en_US: 'pc', de_DE: 'Stk.', fr_FR: 'pce', es_ES: 'ud.', nl_NL: 'st.', sv_SE: 'st', zh_CN: '件/个', ja_JP: '個', ru_RU: 'шт.', ar_SA: 'قطعة'
    },
    name_singular_translations: {
      it_IT: 'Pezzo', en_US: 'Piece', de_DE: 'Stück', fr_FR: 'Pièce', es_ES: 'Pieza', nl_NL: 'Stuk', sv_SE: 'Styck', zh_CN: '件 / 个', ja_JP: '個 (ピース)', ru_RU: 'Штука', ar_SA: 'قطعة'
    },
    name_plural_translations: {
      it_IT: 'Pezzi', en_US: 'Pieces', de_DE: 'Stück', fr_FR: 'Pièces', es_ES: 'Piezas', nl_NL: 'Stuks', sv_SE: 'Stycken', zh_CN: '件 / 个', ja_JP: '個', ru_RU: 'Штуки', ar_SA: 'قطع'
    }
  },
  {
    unit_id: 'porzione',
    category: 'count',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'porz.', en_US: 'serving', de_DE: 'Port.', fr_FR: 'port.', es_ES: 'rac.', nl_NL: 'portie', sv_SE: 'port.', zh_CN: '份', ja_JP: '人前', ru_RU: 'порц.', ar_SA: 'حصة'
    },
    name_singular_translations: {
      it_IT: 'Porzione Pronta', en_US: 'Hot Serving', de_DE: 'Portion', fr_FR: 'Portion', es_ES: 'Ración', nl_NL: 'Portie', sv_SE: 'Portion', zh_CN: '份 (料理)', ja_JP: '一人前', ru_RU: 'Порция', ar_SA: 'حصة غذائية'
    },
    name_plural_translations: {
      it_IT: 'Porzioni', en_US: 'Servings', de_DE: 'Portionen', fr_FR: 'Portions', es_ES: 'Raciones', nl_NL: 'Porties', sv_SE: 'Portioner', zh_CN: '份', ja_JP: '人前', ru_RU: 'Порции', ar_SA: 'حصص'
    }
  },
  {
    unit_id: 'conf',
    category: 'package',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'conf.', en_US: 'pack', de_DE: 'Pckg.', fr_FR: 'barq.', es_ES: 'paq.', nl_NL: 'verp.', sv_SE: 'förp.', zh_CN: '盒/包', ja_JP: 'パック', ru_RU: 'уп.', ar_SA: 'عبوة'
    },
    name_singular_translations: {
      it_IT: 'Confezione Salvafreschezza', en_US: 'Freshness Pack', de_DE: 'Frischepackung', fr_FR: 'Barquette Fraîcheur', es_ES: 'Envase Frescor', nl_NL: 'Versverpakking', sv_SE: 'Färskförpackning', zh_CN: '保鲜盒 / 真空包', ja_JP: 'フレッシュパック', ru_RU: 'Упаковка', ar_SA: 'عبوة حفظ الطزاجة'
    },
    name_plural_translations: {
      it_IT: 'Confezioni', en_US: 'Packs', de_DE: 'Packungen', fr_FR: 'Barquettes', es_ES: 'Envases', nl_NL: 'Verpakkingen', sv_SE: 'Förpackningar', zh_CN: '盒 / 包', ja_JP: 'パック', ru_RU: 'Упаковки', ar_SA: 'عبوات'
    }
  },
  {
    unit_id: 'bottiglia',
    category: 'package',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'bott.', en_US: 'btl', de_DE: 'Fl.', fr_FR: 'bout.', es_ES: 'bot.', nl_NL: 'fles', sv_SE: 'fl.', zh_CN: '瓶', ja_JP: '本', ru_RU: 'бут.', ar_SA: 'زجاجة'
    },
    name_singular_translations: {
      it_IT: 'Bottiglia in Vetro', en_US: 'Glass Bottle', de_DE: 'Glasflasche', fr_FR: 'Bouteille', es_ES: 'Botella', nl_NL: 'Glazen Fles', sv_SE: 'Glasflaska', zh_CN: '玻璃瓶装', ja_JP: 'ボトル (瓶)', ru_RU: 'Бутылка', ar_SA: 'زجاجة'
    },
    name_plural_translations: {
      it_IT: 'Bottiglie', en_US: 'Bottles', de_DE: 'Flaschen', fr_FR: 'Bouteilles', es_ES: 'Botellas', nl_NL: 'Flessen', sv_SE: 'Flaskor', zh_CN: '瓶', ja_JP: '本', ru_RU: 'Бутылки', ar_SA: 'زجاجات'
    }
  },
  {
    unit_id: 'scatolone',
    category: 'package',
    itemsPerPackage: 6,
    symbol_translations: {
      it_IT: 'scatolone', en_US: 'case/box', de_DE: 'Karton', fr_FR: 'carton', es_ES: 'caja', nl_NL: 'doos', sv_SE: 'kartong', zh_CN: '整箱', ja_JP: '箱 (ケース)', ru_RU: 'коробка', ar_SA: 'كرتون / صندوق'
    },
    name_singular_translations: {
      it_IT: 'Scatolone / Collo Multiplo', en_US: 'Master Carton / Case', de_DE: ' Vorratskarton / Gebinde', fr_FR: 'Carton Multiple', es_ES: 'Caja Mayorista', nl_NL: 'Overdoos / Krat', sv_SE: 'Helkartong', zh_CN: '整箱装 (批发/家庭囤货)', ja_JP: 'ケース箱売り', ru_RU: 'Коробка (ящик)', ar_SA: 'صندوق كامل (كرتون)'
    },
    name_plural_translations: {
      it_IT: 'Scatoloni / Colli', en_US: 'Cartons / Cases', de_DE: 'Kartons', fr_FR: 'Cartons', es_ES: 'Cajas', nl_NL: 'Dozen', sv_SE: 'Kartonger', zh_CN: '箱', ja_JP: 'ケース', ru_RU: 'Коробки', ar_SA: 'صناديق / كراتين'
    }
  },
  {
    unit_id: 'cesto',
    category: 'package',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'cesto', en_US: 'hamper', de_DE: 'Präsentkorb', fr_FR: 'coffret', es_ES: 'cesta', nl_NL: 'geschenkmand', sv_SE: 'presentkorg', zh_CN: '礼篮', ja_JP: 'ギフトボックス', ru_RU: 'корзина', ar_SA: 'سلة هدايا'
    },
    name_singular_translations: {
      it_IT: 'Cestino / Box Degustazione', en_US: 'Gourmet Gift Hamper', de_DE: 'Feinkost-Präsentkorb', fr_FR: 'Coffret Dégustation', es_ES: 'Cesta Gourmet', nl_NL: 'Delicatessen Geschenkmand', sv_SE: 'Delikatesslåda', zh_CN: '意式美食礼篮', ja_JP: 'グルメギフトボックス', ru_RU: 'Подарочная корзина', ar_SA: 'سلة تذوق فاخرة'
    },
    name_plural_translations: {
      it_IT: 'Cestini / Box', en_US: 'Gift Hampers', de_DE: 'Präsentkörbe', fr_FR: 'Coffrets', es_ES: 'Cestas', nl_NL: 'Geschenkmanden', sv_SE: 'Delikatesslådor', zh_CN: '礼篮', ja_JP: 'ギフトボックス', ru_RU: 'Подарочные корзины', ar_SA: 'سلال هدايا'
    }
  },
  {
    unit_id: 'unita',
    category: 'count',
    itemsPerPackage: 1,
    symbol_translations: {
      it_IT: 'unità', en_US: 'unit', de_DE: 'Einh.', fr_FR: 'unité', es_ES: 'unid.', nl_NL: 'eenh.', sv_SE: 'enhet', zh_CN: '单位', ja_JP: '単位', ru_RU: 'ед.', ar_SA: 'وحدة'
    },
    name_singular_translations: {
      it_IT: 'Unità Singola', en_US: 'Single Unit', de_DE: 'Einheit', fr_FR: 'Unité', es_ES: 'Unidad', nl_NL: 'Eenheid', sv_SE: 'Enhet', zh_CN: '标准单位', ja_JP: 'ユニット', ru_RU: 'Единица', ar_SA: 'وحدة مفردة'
    },
    name_plural_translations: {
      it_IT: 'Unità', en_US: 'Units', de_DE: 'Einheiten', fr_FR: 'Unités', es_ES: 'Unidades', nl_NL: 'Eenheden', sv_SE: 'Enheter', zh_CN: '单位', ja_JP: 'ユニット', ru_RU: 'Единицы', ar_SA: 'وحدات'
    }
  }
];

export interface CountryMeasurementConversion {
  /** Peso o volume convertito nell'unità del paese di origine del visitatore (es. "15.9 oz (0.99 lb)" per UK, "9 两 (0.9 斤)" per Cina) */
  localizedWeightOrVolume: string;
  /** Peso/volume metrico europeo di riferimento (es. "450 g", "1.1 kg", "750 ml") */
  metricStandardLabel: string;
  /** Nome dell'unità commerciale tradotta (es. "Pezzo", "Piece", "Scatolone da 6", "6-Bottle Case", "整箱 6件") */
  commercialUnitTranslated: string;
  /** Simbolo breve dell'unità commerciale nella lingua attiva */
  commercialUnitSymbol: string;
  /** Prezzo per unità di peso/volume nel sistema del paese del cliente (es. "€19.65/lb" per UK, "€21.67/斤(500g)" per Cina, "€4.33/etto" per Italia) */
  localizedPricePerMeasure: string;
  /** Eventuale dicitura per acquisto a Scatolone / Collo multiplo */
  cartonPackInfo?: {
    unitsInCarton: number;
    cartonTotalWeightLabel: string;
    cartonTotalPriceEur: number;
    cartonSavingsPercent: number;
    cartonTranslatedLabel: string;
  };
}

/**
 * Restituisce la definizione dell'unità di misura (da Firebase o dal seed)
 */
export function getUnitDefinition(
  unitCode: CommercialUnitCode,
  customUnitsMap?: Record<string, UnitOfMeasureDefinition>
): UnitOfMeasureDefinition {
  if (customUnitsMap && customUnitsMap[unitCode]) {
    return customUnitsMap[unitCode];
  }
  return (
    SEED_UNITS_OF_MEASURE.find((u) => u.unit_id === unitCode) ||
    SEED_UNITS_OF_MEASURE[SEED_UNITS_OF_MEASURE.length - 1]
  );
}

/**
 * Calcola e traduce peso, volume, unità di vendita (g, kg, pz, scatoloni, unità) e prezzo al kg/lb/斤
 * in base al paese di provenienza del cliente (es. GB -> oz/lb/fl oz, CN -> 斤 jīn / 两 liǎng, JP -> 100g / 合, IT -> etti/kg).
 */
export function computeCountryUnitConversion(
  product: Product,
  countryCode: string,
  language: LanguageCode,
  customUnitsMap?: Record<string, UnitOfMeasureDefinition>
): CountryMeasurementConversion {
  const pw = product.pricingAndWeight;
  const gramsOrMl = pw?.netWeightGrams || 500;
  const isLiquid = Boolean(pw?.isLiquidVolume || product.wineDenomination || product.id.includes('balsamico'));
  const unitCode: CommercialUnitCode = pw?.commercialUnit || (isLiquid ? 'bottiglia' : 'pz');
  const unitDef = getUnitDefinition(unitCode, customUnitsMap);

  const commercialUnitSymbol =
    unitDef.symbol_translations[language] ||
    unitDef.symbol_translations.en_US ||
    unitDef.unit_id;

  const commercialUnitTranslated =
    unitDef.name_singular_translations[language] ||
    unitDef.name_singular_translations.en_US ||
    unitDef.unit_id;

  // 1. Etichetta Metrica Standard
  const metricStandardLabel = isLiquid
    ? gramsOrMl >= 1000
      ? `${(gramsOrMl / 1000).toFixed(2).replace(/\.00$/, '')} L`
      : `${gramsOrMl} ml`
    : gramsOrMl >= 1000
    ? `${(gramsOrMl / 1000).toFixed(2).replace(/\.00$/, '')} kg`
    : `${gramsOrMl} g`;

  const pricePerKgOrLiter = pw?.pricePerKgOrLiter || Number(((product.price / gramsOrMl) * 1000).toFixed(2));
  const c = (countryCode || 'IT').toUpperCase();

  let localizedWeightOrVolume = metricStandardLabel;
  let localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/${isLiquid ? 'L' : 'kg'}`;

  // --- CONVERSIONE PAESI ANGLOSASSONI (UK / USA: Once, Libbre, Fluid Ounces) ---
  if (['GB', 'UK', 'US', 'CA', 'AU', 'IE'].includes(c) || language === 'en_US') {
    if (isLiquid) {
      // UK fl oz = 28.413 ml, US fl oz = 29.5735 ml
      const flOzFactor = c === 'US' ? 29.5735 : 28.4131;
      const flOz = (gramsOrMl / flOzFactor).toFixed(1);
      const pintUk = (gramsOrMl / 568.261).toFixed(2);
      localizedWeightOrVolume =
        gramsOrMl >= 500
          ? `${flOz} fl oz (${pintUk} pt · ${metricStandardLabel})`
          : `${flOz} fl oz (${metricStandardLabel})`;
      const pricePerFlOz = (product.price / (gramsOrMl / flOzFactor)).toFixed(2);
      localizedPricePerMeasure = `€${pricePerFlOz}/fl oz (€${pricePerKgOrLiter.toFixed(2)}/L)`;
    } else {
      // 1 oz = 28.3495 g, 1 lb = 453.592 g
      const totalOz = gramsOrMl / 28.34952;
      const totalLb = gramsOrMl / 453.59237;
      const pricePerLb = (pricePerKgOrLiter * 0.45359237).toFixed(2);
      const pricePerOz = (pricePerKgOrLiter * 0.0283495).toFixed(2);

      if (gramsOrMl >= 450) {
        localizedWeightOrVolume = `${totalLb.toFixed(2)} lb · ${totalOz.toFixed(1)} oz (${metricStandardLabel})`;
        localizedPricePerMeasure = `€${pricePerLb}/lb (€${pricePerKgOrLiter.toFixed(2)}/kg)`;
      } else {
        localizedWeightOrVolume = `${totalOz.toFixed(1)} oz (${metricStandardLabel})`;
        localizedPricePerMeasure = `€${pricePerOz}/oz · €${pricePerLb}/lb`;
      }
    }
  }
  // --- CONVERSIONE CINA (CN: Sistema Shìzhì 市制 -> 1 斤 Jīn = 500g, 1 两 Liǎng = 50g) ---
  else if (['CN', 'HK', 'TW', 'SG'].includes(c) || language === 'zh_CN') {
    if (isLiquid) {
      localizedWeightOrVolume = `${gramsOrMl} 毫升 (${(gramsOrMl / 500).toFixed(1)} 斤装)`;
      localizedPricePerMeasure = `€${(pricePerKgOrLiter / 2).toFixed(2)}/500ml (€${pricePerKgOrLiter.toFixed(2)}/升)`;
    } else {
      const jin = gramsOrMl / 500; // 1 斤 = 500g
      const liang = gramsOrMl / 50; // 1 两 = 50g
      const pricePerJin = (pricePerKgOrLiter / 2).toFixed(2); // Prezzo per 斤 (500g)
      if (gramsOrMl >= 500) {
        localizedWeightOrVolume = `${jin.toFixed(1).replace(/\.0$/, '')} 斤 (${metricStandardLabel})`;
      } else {
        localizedWeightOrVolume = `${liang.toFixed(1).replace(/\.0$/, '')} 两 / ${jin.toFixed(2)} 斤 (${metricStandardLabel})`;
      }
      localizedPricePerMeasure = `€${pricePerJin}/斤 (€${pricePerKgOrLiter.toFixed(2)}/kg)`;
    }
  }
  // --- CONVERSIONE GIAPPONE (JP: Prezzo per 100g 100gあたり + 合 gō per il riso) ---
  else if (c === 'JP' || language === 'ja_JP') {
    if (isLiquid) {
      const goLiquid = (gramsOrMl / 180.39).toFixed(1); // 1 合 (shaku/gō per sake/vino) = 180.4 ml
      localizedWeightOrVolume = `${gramsOrMl}ml (約${goLiquid}合)`;
      localizedPricePerMeasure = `€${(pricePerKgOrLiter / 10).toFixed(2)}/100ml (€${pricePerKgOrLiter.toFixed(2)}/L)`;
    } else {
      const pricePer100g = (pricePerKgOrLiter / 10).toFixed(2);
      if (product.id.includes('riso')) {
        const riceGo = (gramsOrMl / 150).toFixed(1); // 1 合 di riso = 150g
        localizedWeightOrVolume = `${metricStandardLabel} (約${riceGo}合)`;
      } else {
        localizedWeightOrVolume = `${gramsOrMl}g (${metricStandardLabel})`;
      }
      localizedPricePerMeasure = `€${pricePer100g}/100gあたり (€${pricePerKgOrLiter.toFixed(2)}/kg)`;
    }
  }
  // --- CONVERSIONE FRANCIA (FR: Centilitri cl per vini e liquidi) ---
  else if (c === 'FR' || language === 'fr_FR') {
    if (isLiquid) {
      const cl = Math.round(gramsOrMl / 10);
      localizedWeightOrVolume = `${cl} cl (${metricStandardLabel})`;
      localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/L`;
    } else {
      localizedWeightOrVolume = metricStandardLabel;
      localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/kg`;
    }
  }
  // --- CONVERSIONE OLANDA & SVEZIA (NL: "ons" = 100g, SE: "hg" = hektogram 100g) ---
  else if (c === 'NL' || language === 'nl_NL') {
    if (!isLiquid && gramsOrMl < 1000) {
      const ons = (gramsOrMl / 100).toFixed(1).replace(/\.0$/, '');
      localizedWeightOrVolume = `${gramsOrMl} g (${ons} ons)`;
    }
    localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/${isLiquid ? 'l' : 'kg'}`;
  } else if (c === 'SE' || language === 'sv_SE') {
    if (!isLiquid && gramsOrMl < 1000) {
      const hg = (gramsOrMl / 100).toFixed(1).replace(/\.0$/, '');
      localizedWeightOrVolume = `${gramsOrMl} g (${hg} hg)`;
    }
    localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/${isLiquid ? 'jfr/l' : 'jfr/kg'}`;
  }
  // --- CONVERSIONE ITALIA (IT: Etti da banco gastronomia + kg/L) ---
  else if (c === 'IT' || language === 'it_IT') {
    if (!isLiquid && gramsOrMl >= 100 && gramsOrMl < 1000) {
      const etti = (gramsOrMl / 100).toFixed(1).replace(/\.0$/, '');
      localizedWeightOrVolume = `${gramsOrMl} g (${etti} ${Number(etti) === 1 ? 'etto' : 'etti'})`;
      localizedPricePerMeasure = `€${(pricePerKgOrLiter / 10).toFixed(2)}/etto · €${pricePerKgOrLiter.toFixed(2)}/kg`;
    } else if (isLiquid && gramsOrMl === 750) {
      localizedWeightOrVolume = `750 ml (0,75 L)`;
      localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/litro`;
    } else {
      localizedWeightOrVolume = metricStandardLabel;
      localizedPricePerMeasure = `€${pricePerKgOrLiter.toFixed(2)}/${isLiquid ? 'litro' : 'kg'}`;
    }
  }

  // 2. Calcolo opzione Scatolone / Collo Multiplo (per tutti i prodotti confezionati, vini, dispensa e box)
  const unitsInCarton = pw?.unitsPerCarton || (isLiquid ? 6 : 6);
  const cartonSavingsPercent = pw?.cartonDiscountPercent || 8;
  const cartonDef = getUnitDefinition('scatolone', customUnitsMap);
  const cartonWord =
    cartonDef.name_singular_translations[language] ||
    cartonDef.name_singular_translations.en_US ||
    'Scatolone';

  const cartonTotalGrams = gramsOrMl * unitsInCarton;
  const cartonTotalWeightLabel = isLiquid
    ? `${((cartonTotalGrams) / 1000).toFixed(1)} L (${unitsInCarton} × ${metricStandardLabel})`
    : `${((cartonTotalGrams) / 1000).toFixed(1)} kg (${unitsInCarton} × ${metricStandardLabel})`;

  const cartonTotalPriceEur = Number(
    (product.price * unitsInCarton * (1 - cartonSavingsPercent / 100)).toFixed(2)
  );

  return {
    localizedWeightOrVolume,
    metricStandardLabel,
    commercialUnitTranslated,
    commercialUnitSymbol,
    localizedPricePerMeasure,
    cartonPackInfo: {
      unitsInCarton,
      cartonTotalWeightLabel,
      cartonTotalPriceEur,
      cartonSavingsPercent,
      cartonTranslatedLabel: `${cartonWord} (${unitsInCarton} ${commercialUnitSymbol})`
    }
  };
}
