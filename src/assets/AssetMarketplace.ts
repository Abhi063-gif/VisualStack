export interface AssetItem {
  id: string;
  name: string;
  type: 'illustration' | 'lottie' | 'font' | 'image' | 'palette';
  previewUrl: string;
  author: string;
  category: string;
}

export class AssetMarketplace {
  private assets: AssetItem[] = [
    { id: 'ast_hero_ill', name: 'SaaS Cloud Hero Illustration', type: 'illustration', previewUrl: '/assets/saas_hero.svg', author: 'Undraw', category: 'Web' },
    { id: 'ast_lottie_check', name: 'Success Checkmark Lottie', type: 'lottie', previewUrl: '/assets/success.json', author: 'LottieFiles', category: 'Animations' },
    { id: 'ast_inter', name: 'Inter Google Font Family', type: 'font', previewUrl: 'Inter', author: 'Google Fonts', category: 'Typography' },
    { id: 'ast_cyber_palette', name: 'Cyberpunk Neon Color Palette', type: 'palette', previewUrl: '#00ffcc', author: 'VisualStack Team', category: 'Themes' },
  ];

  public getAssets(type?: AssetItem['type']): AssetItem[] {
    if (!type) return [...this.assets];
    return this.assets.filter((a) => a.type === type);
  }
}

export const assetMarketplace = new AssetMarketplace();
