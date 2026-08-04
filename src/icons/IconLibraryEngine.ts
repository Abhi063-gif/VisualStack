export interface IconItem {
  id: string;
  name: string;
  library: 'Lucide' | 'Material' | 'Heroicons' | 'FontAwesome' | 'Bootstrap' | 'Phosphor' | 'Tabler';
  tags: string[];
}

export class IconLibraryEngine {
  private icons: IconItem[] = [
    // Lucide
    { id: 'ic_sparkles', name: 'Sparkles', library: 'Lucide', tags: ['ai', 'magic', 'star'] },
    { id: 'ic_user', name: 'User', library: 'Lucide', tags: ['person', 'profile', 'account'] },
    { id: 'ic_shopping_cart', name: 'ShoppingCart', library: 'Lucide', tags: ['store', 'buy', 'ecommerce'] },
    { id: 'ic_layers', name: 'Layers', library: 'Lucide', tags: ['canvas', 'stack', 'design'] },
    { id: 'ic_database', name: 'Database', library: 'Lucide', tags: ['sql', 'storage', 'data'] },
    { id: 'ic_server', name: 'Server', library: 'Lucide', tags: ['backend', 'host', 'api'] },
    { id: 'ic_shield', name: 'Shield', library: 'Lucide', tags: ['security', 'auth', 'lock'] },
    { id: 'ic_cpu', name: 'Cpu', library: 'Lucide', tags: ['processor', 'hardware', 'devops'] },

    // Material
    { id: 'ic_mat_home', name: 'Home', library: 'Material', tags: ['house', 'main'] },
    { id: 'ic_mat_dashboard', name: 'Dashboard', library: 'Material', tags: ['analytics', 'metrics'] },
    { id: 'ic_mat_settings', name: 'Settings', library: 'Material', tags: ['gear', 'config'] },
    { id: 'ic_mat_search', name: 'Search', library: 'Material', tags: ['find', 'lookup'] },
    { id: 'ic_mat_notifications', name: 'Notifications', library: 'Material', tags: ['bell', 'alert'] },

    // Heroicons
    { id: 'ic_hero_bolt', name: 'Bolt', library: 'Heroicons', tags: ['fast', 'electric', 'lightning'] },
    { id: 'ic_hero_cog', name: 'Cog', library: 'Heroicons', tags: ['settings', 'engine'] },
    { id: 'ic_hero_chat', name: 'ChatBubble', library: 'Heroicons', tags: ['comments', 'message'] },
    { id: 'ic_hero_globe', name: 'Globe', library: 'Heroicons', tags: ['web', 'internet', 'i18n'] },

    // FontAwesome
    { id: 'ic_fa_github', name: 'Github', library: 'FontAwesome', tags: ['git', 'code', 'repo'] },
    { id: 'ic_fa_stripe', name: 'Stripe', library: 'FontAwesome', tags: ['payment', 'card'] },
    { id: 'ic_fa_aws', name: 'AWS', library: 'FontAwesome', tags: ['cloud', 'amazon'] },

    // Bootstrap
    { id: 'ic_bs_check', name: 'CheckCircle', library: 'Bootstrap', tags: ['done', 'success'] },
    { id: 'ic_bs_info', name: 'InfoCircle', library: 'Bootstrap', tags: ['help', 'details'] },

    // Phosphor
    { id: 'ic_ph_heart', name: 'Heart', library: 'Phosphor', tags: ['like', 'love', 'favorite'] },
    { id: 'ic_ph_rocket', name: 'Rocket', library: 'Phosphor', tags: ['deploy', 'launch'] },

    // Tabler
    { id: 'ic_tb_brand', name: 'BrandVite', library: 'Tabler', tags: ['logo', 'vite'] },
    { id: 'ic_tb_code', name: 'CodeDots', library: 'Tabler', tags: ['programming', 'dev'] },
  ];

  public searchIcons(query: string, library?: IconItem['library'] | 'All'): IconItem[] {
    const q = query.toLowerCase();
    return this.icons.filter((icon) => {
      const matchLib = !library || library === 'All' || icon.library === library;
      const matchQuery = !q || icon.name.toLowerCase().includes(q) || icon.tags.some((t) => t.includes(q));
      return matchLib && matchQuery;
    });
  }
}

export const iconLibraryEngine = new IconLibraryEngine();
