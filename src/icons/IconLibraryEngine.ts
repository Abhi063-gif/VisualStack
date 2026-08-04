export interface IconItem {
  id: string;
  name: string;
  library: 'Lucide' | 'Material' | 'Heroicons' | 'FontAwesome' | 'Bootstrap' | 'Phosphor' | 'Tabler';
  tags: string[];
}

export class IconLibraryEngine {
  private icons: IconItem[] = [
    { id: 'ic_sparkles', name: 'Sparkles', library: 'Lucide', tags: ['ai', 'magic', 'star'] },
    { id: 'ic_user', name: 'User', library: 'Lucide', tags: ['person', 'profile', 'account'] },
    { id: 'ic_shopping_cart', name: 'ShoppingCart', library: 'Lucide', tags: ['store', 'buy', 'ecommerce'] },
    { id: 'ic_mat_home', name: 'Home', library: 'Material', tags: ['house', 'main'] },
    { id: 'ic_hero_bolt', name: 'Bolt', library: 'Heroicons', tags: ['fast', 'electric', 'lightning'] },
    { id: 'ic_fa_github', name: 'Github', library: 'FontAwesome', tags: ['git', 'code', 'repo'] },
    { id: 'ic_bs_check', name: 'CheckCircle', library: 'Bootstrap', tags: ['done', 'success'] },
    { id: 'ic_ph_heart', name: 'Heart', library: 'Phosphor', tags: ['like', 'love', 'favorite'] },
    { id: 'ic_tb_brand', name: 'BrandVite', library: 'Tabler', tags: ['logo', 'vite'] },
  ];

  public searchIcons(query: string, library?: IconItem['library']): IconItem[] {
    const q = query.toLowerCase();
    return this.icons.filter((icon) => {
      const matchLib = !library || library === 'Lucide' || icon.library === library;
      const matchQuery = icon.name.toLowerCase().includes(q) || icon.tags.some((t) => t.includes(q));
      return matchLib && matchQuery;
    });
  }
}

export const iconLibraryEngine = new IconLibraryEngine();
