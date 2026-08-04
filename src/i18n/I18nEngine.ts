export type SupportedLanguage =
  | 'en'
  | 'en-gb'
  | 'hi'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja'
  | 'zh-cn'
  | 'zh-tw'
  | 'ar'
  | 'pt'
  | 'ru'
  | 'it'
  | 'ko'
  | 'nl'
  | 'pl'
  | 'tr'
  | 'vi'
  | 'th'
  | 'id';

export interface LanguagePack {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  isRtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguagePack[] = [
  { code: 'en', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'en-gb', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (भारत)', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español (España)', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français (France)', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch (Deutschland)', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語 (日本)', flag: '🇯🇵' },
  { code: 'zh-cn', name: 'Chinese Simplified', nativeName: '简体中文 (中国)', flag: '🇨🇳' },
  { code: 'zh-tw', name: 'Chinese Traditional', nativeName: '繁體中文 (台灣)', flag: '🇹🇼' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (السعودية)', flag: '🇸🇦', isRtl: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский (Россия)', flag: '🇷🇺' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano (Italia)', flag: '🇮🇹' },
  { code: 'ko', name: 'Korean', nativeName: '한국어 (대한민국)', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands (Nederland)', flag: '🇳🇱' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski (Polska)', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe (Türkiye)', flag: '🇹🇷' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt (Việt Nam)', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย (ประเทศไทย)', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
];

export class I18nEngine {
  private currentLang: SupportedLanguage = 'en';

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang = lang;
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLang;
  }
}

export const i18nEngine = new I18nEngine();
