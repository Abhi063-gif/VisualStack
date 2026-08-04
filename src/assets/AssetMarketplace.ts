export interface AssetItem {
  id: string;
  name: string;
  type: 'illustration' | 'lottie' | 'font' | 'image' | 'palette';
  previewUrl: string;
  author: string;
  category: 'Web' | 'Mobile' | 'Animations' | 'Typography' | 'Themes';
}

export class AssetMarketplace {
  private assets: AssetItem[] = [
    // Illustrations
    { id: 'ast_hero_ill', name: 'SaaS Cloud Hero Vector', type: 'illustration', previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&q=80', author: 'Unsplash', category: 'Web' },
    { id: 'ast_auth_ill', name: 'Secure Authentication & Login', type: 'illustration', previewUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&q=80', author: 'Unsplash', category: 'Web' },
    { id: 'ast_ecom_ill', name: 'E-Commerce Shopping Cart Vector', type: 'illustration', previewUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&q=80', author: 'Unsplash', category: 'Web' },
    { id: 'ast_crm_ill', name: 'Analytics Dashboard Charts', type: 'illustration', previewUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&q=80', author: 'Unsplash', category: 'Web' },
    
    // Lottie Vector Animations
    { id: 'ast_lottie_check', name: 'Success Checkmark Animation', type: 'lottie', previewUrl: 'lottie_success_checkmark', author: 'LottieFiles', category: 'Animations' },
    { id: 'ast_lottie_loading', name: 'Pulse Loading Spinner', type: 'lottie', previewUrl: 'lottie_pulse_spinner', author: 'LottieFiles', category: 'Animations' },
    { id: 'ast_lottie_confetti', name: 'Celebration Confetti Burst', type: 'lottie', previewUrl: 'lottie_confetti_burst', author: 'LottieFiles', category: 'Animations' },
    { id: 'ast_lottie_rocket', name: 'Rocket Deployment Launch', type: 'lottie', previewUrl: 'lottie_rocket_launch', author: 'LottieFiles', category: 'Animations' },

    // Google Fonts
    { id: 'ast_inter', name: 'Inter Google Font', type: 'font', previewUrl: 'Inter, sans-serif', author: 'Google Fonts', category: 'Typography' },
    { id: 'ast_roboto', name: 'Roboto Clean Font', type: 'font', previewUrl: 'Roboto, sans-serif', author: 'Google Fonts', category: 'Typography' },
    { id: 'ast_outfit', name: 'Outfit Display Font', type: 'font', previewUrl: 'Outfit, sans-serif', author: 'Google Fonts', category: 'Typography' },
    { id: 'ast_jetbrains', name: 'JetBrains Mono Code Font', type: 'font', previewUrl: 'JetBrains Mono, monospace', author: 'JetBrains', category: 'Typography' },

    // Images
    { id: 'ast_img_avatar1', name: 'User Profile Avatar (Female)', type: 'image', previewUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', author: 'Unsplash', category: 'Mobile' },
    { id: 'ast_img_avatar2', name: 'User Profile Avatar (Male)', type: 'image', previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', author: 'Unsplash', category: 'Mobile' },
    { id: 'ast_img_landscape', name: 'Modern Tech Cityscape', type: 'image', previewUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&q=80', author: 'Unsplash', category: 'Web' },
  ];

  private listeners: Set<() => void> = new Set();

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  public getAssets(type?: AssetItem['type']): AssetItem[] {
    if (!type) return [...this.assets];
    return this.assets.filter((a) => a.type === type);
  }

  public addAsset(asset: Omit<AssetItem, 'id'>): AssetItem {
    const item: AssetItem = {
      ...asset,
      id: `ast_${Date.now().toString(36)}`,
    };
    this.assets.unshift(item);
    this.listeners.forEach((fn) => fn());
    return item;
  }
}

export const assetMarketplace = new AssetMarketplace();
