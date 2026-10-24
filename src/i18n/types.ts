export type LanguageCode =
  | 'it_IT'
  | 'en_US'
  | 'fr_FR'
  | 'de_DE'
  | 'es_ES'
  | 'nl_NL'
  | 'sv_SE'
  | 'zh_CN'
  | 'ja_JP'
  | 'ru_RU'
  | 'ar_SA';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  cartLabel: string;
  country?: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'it_IT', label: 'Italiano', flag: '🇮🇹', country: 'Italia', cartLabel: 'Carrello' },
  { code: 'en_US', label: 'English', flag: '🇬🇧', country: 'UK / Global', cartLabel: 'Cart' },
  { code: 'de_DE', label: 'Deutsch', flag: '🇩🇪', country: 'Deutschland', cartLabel: 'Warenkorb' },
  { code: 'nl_NL', label: 'Nederlands', flag: '🇳🇱', country: 'Nederland', cartLabel: 'Winkelwagen' },
  { code: 'sv_SE', label: 'Svenska', flag: '🇸🇪', country: 'Sverige', cartLabel: 'Varukorg' },
  { code: 'fr_FR', label: 'Français', flag: '🇫🇷', country: 'France', cartLabel: 'Panier' },
  { code: 'es_ES', label: 'Español', flag: '🇪🇸', country: 'España', cartLabel: 'Carrito' },
  { code: 'zh_CN', label: '中文', flag: '🇨🇳', country: '中国', cartLabel: '购物车' },
  { code: 'ja_JP', label: '日本語', flag: '🇯🇵', country: '日本', cartLabel: 'カート' },
  { code: 'ru_RU', label: 'Русский', flag: '🇷🇺', country: 'Россия', cartLabel: 'Корзина' },
  { code: 'ar_SA', label: 'العربية', flag: '🇸🇦', country: 'المملكة العربية السعودية', cartLabel: 'عربة التسوق', isRtl: true }
];
