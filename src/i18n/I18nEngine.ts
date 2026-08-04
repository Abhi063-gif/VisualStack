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

const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    app_title: 'VisualStack Studio',
    templates: 'Templates',
    comments: 'Comments',
    checkpoints: 'Checkpoints',
    tokens: 'Tokens',
    plugins: 'Plugins',
    share: 'Share',
    ai_copilot: 'AI Copilot',
    save: 'Save',
    view_code: 'View Code',
    deploy: 'Deploy',
    run: 'Run',
    settings: 'Settings',
    community: 'Community',
    professional: 'Professional',
    enterprise: 'Enterprise',
  },
  hi: {
    app_title: 'विजुअलस्टैक स्टूडियो',
    templates: 'टम्प्लेट्स',
    comments: 'टिप्पणियां',
    checkpoints: 'चेकपॉइंट्स',
    tokens: 'टोकन',
    plugins: 'प्लगइन्स',
    share: 'साझा करें',
    ai_copilot: 'एआई कोपायलट',
    save: 'सहेजें',
    view_code: 'कोड देखें',
    deploy: 'तैनात करें',
    run: 'चलाएं',
    settings: 'सेटिंग्स',
    community: 'कम्युनिटी',
    professional: 'प्रोफेशनल',
    enterprise: 'एंटरप्राइज',
  },
  es: {
    app_title: 'VisualStack Studio',
    templates: 'Plantillas',
    comments: 'Comentarios',
    checkpoints: 'Puntos de Control',
    tokens: 'Tokens',
    plugins: 'Extensiones',
    share: 'Compartir',
    ai_copilot: 'Asistente IA',
    save: 'Guardar',
    view_code: 'Ver Código',
    deploy: 'Desplegar',
    run: 'Ejecutar',
    settings: 'Ajustes',
    community: 'Comunidad',
    professional: 'Profesional',
    enterprise: 'Empresarial',
  },
  fr: {
    app_title: 'VisualStack Studio',
    templates: 'Modèles',
    comments: 'Commentaires',
    checkpoints: 'Points de Sauvegarde',
    tokens: 'Jetons',
    plugins: 'Extensions',
    share: 'Partager',
    ai_copilot: 'Copilote IA',
    save: 'Enregistrer',
    view_code: 'Voir le Code',
    deploy: 'Déployer',
    run: 'Exécuter',
    settings: 'Paramètres',
    community: 'Communauté',
    professional: 'Professionnel',
    enterprise: 'Entreprise',
  },
  de: {
    app_title: 'VisualStack Studio',
    templates: 'Vorlagen',
    comments: 'Kommentare',
    checkpoints: 'Wiederherstellungspunkte',
    tokens: 'Tokens',
    plugins: 'Erweiterungen',
    share: 'Teilen',
    ai_copilot: 'KI-Assistent',
    save: 'Speichern',
    view_code: 'Code Anzeigen',
    deploy: 'Bereitstellen',
    run: 'Ausführen',
    settings: 'Einstellungen',
    community: 'Community',
    professional: 'Professionell',
    enterprise: 'Unternehmen',
  },
  ar: {
    app_title: 'فيجوال ستاك ستوديو',
    templates: 'القوالب',
    comments: 'التعليقات',
    checkpoints: 'نقاط الاستعادة',
    tokens: 'الرموز',
    plugins: 'الملحقات',
    share: 'مشاركة',
    ai_copilot: 'المساعد الذكي',
    save: 'حفظ',
    view_code: 'عرض الكود',
    deploy: 'نشر',
    run: 'تشغيل',
    settings: 'الإعدادات',
    community: 'مجاني',
    professional: 'احترافي',
    enterprise: 'مؤسسات',
  },
  ja: {
    app_title: 'VisualStack Studio',
    templates: 'テンプレート',
    comments: 'コメント',
    checkpoints: 'チェックポイント',
    tokens: 'トークン',
    plugins: 'プラグイン',
    share: '共有',
    ai_copilot: 'AIアシスタント',
    save: '保存',
    view_code: 'コード表示',
    deploy: 'デプロイ',
    run: '実行',
    settings: '設定',
    community: 'コミュニティ',
    professional: 'プロフェッショナル',
    enterprise: 'エンタープライズ',
  },
  'zh-cn': {
    app_title: 'VisualStack Studio',
    templates: '模板',
    comments: '评论',
    checkpoints: '检查点',
    tokens: '令牌',
    plugins: '插件',
    share: '分享',
    ai_copilot: 'AI 助手',
    save: '保存',
    view_code: '查看代码',
    deploy: '部署',
    run: '运行',
    settings: '设置',
    community: '社区版',
    professional: '专业版',
    enterprise: '企业版',
  },
};

export class I18nEngine {
  private currentLang: SupportedLanguage = 'en';
  private listeners: Set<(lang: SupportedLanguage) => void> = new Set();

  constructor() {
    const saved = localStorage.getItem('visualstack_i18n_lang') as SupportedLanguage;
    if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
      this.currentLang = saved;
    }
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang = lang;
    localStorage.setItem('visualstack_i18n_lang', lang);
    const pack = SUPPORTED_LANGUAGES.find((l) => l.code === lang);

    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.dir = pack?.isRtl ? 'rtl' : 'ltr';
    }

    this.listeners.forEach((fn) => fn(lang));
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLang;
  }

  public subscribe(fn: (lang: SupportedLanguage) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public t(key: string, defaultText?: string): string {
    const baseCode = this.currentLang.split('-')[0];
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS[baseCode] || TRANSLATIONS.en;
    return dict[key] || defaultText || key;
  }
}

export const i18nEngine = new I18nEngine();
