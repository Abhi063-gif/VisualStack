export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

export class I18nEngine {
  private currentLang: SupportedLanguage = 'en';
  private translations: Record<SupportedLanguage, Record<string, string>> = {
    en: { appTitle: 'VisualStack Studio', save: 'Save', deploy: 'Deploy', run: 'Run', aiCopilot: 'AI Copilot' },
    hi: { appTitle: 'विज़ुअलस्टैक स्टूडियो', save: 'सहेजे', deploy: 'तैनाेत करें', run: 'चलाएं', aiCopilot: 'एआई सहायक' },
    es: { appTitle: 'VisualStack Studio', save: 'Guardar', deploy: 'Desplegar', run: 'Ejecutar', aiCopilot: 'Copiloto IA' },
    fr: { appTitle: 'VisualStack Studio', save: 'Enregistrer', deploy: 'Déployer', run: 'Exécuter', aiCopilot: 'Copilote IA' },
    de: { appTitle: 'VisualStack Studio', save: 'Speichern', deploy: 'Bereitstellen', run: 'Ausführen', aiCopilot: 'KI-Assistent' },
    ja: { appTitle: 'VisualStack Studio', save: '保存', deploy: 'デプロイ', run: '実行', aiCopilot: 'AIコパイロット' },
    zh: { appTitle: 'VisualStack Studio', save: '保存', deploy: '部署', run: '运行', aiCopilot: 'AI 助手' },
    ar: { appTitle: 'فيجوال ستاك ستوديو', save: 'حفظ', deploy: 'نشر', run: 'تشغيل', aiCopilot: 'مساعد الذكاء الاصطناعي' },
  };

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLang = lang;
  }

  public t(key: string): string {
    return this.translations[this.currentLang]?.[key] || this.translations.en[key] || key;
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLang;
  }
}

export const i18nEngine = new I18nEngine();
