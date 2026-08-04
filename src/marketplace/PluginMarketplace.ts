export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  rating: number;
  downloads: number;
  category: 'UI Components' | 'Backend Nodes' | 'Integrations' | 'AI Models' | 'Themes';
  description: string;
  isInstalled: boolean;
  isEnabled: boolean;
}

export class PluginMarketplace {
  private plugins: MarketplacePlugin[] = [
    { id: 'plug_stripe', name: 'Stripe Payments Suite', version: '2.4.0', author: 'Stripe Official', rating: 4.9, downloads: 14200, category: 'Backend Nodes', description: 'Checkout webhooks, subscription billing, refund nodes & card elements.', isInstalled: true, isEnabled: true },
    { id: 'plug_supabase', name: 'Supabase Database & Auth', version: '1.8.2', author: 'Supabase Inc', rating: 4.8, downloads: 18900, category: 'Integrations', description: 'Realtime database subscriptions, row-level security & storage buckets.', isInstalled: true, isEnabled: true },
    { id: 'plug_tailwind', name: 'Tailwind UI Library', version: '3.1.0', author: 'VisualStack Community', rating: 4.7, downloads: 22400, category: 'UI Components', description: '150+ pre-styled responsive Tailwind CSS UI widgets & components.', isInstalled: false, isEnabled: false },
    { id: 'plug_openai', name: 'OpenAI GPT-4o Connector', version: '1.2.0', author: 'OpenAI', rating: 4.9, downloads: 31000, category: 'AI Models', description: 'Advanced streaming LLM prompts, vision analysis & function calling.', isInstalled: true, isEnabled: true },
    { id: 'plug_dracula', name: 'Dracula Pro Theme', version: '1.0.1', author: 'Zeno Rocha', rating: 4.9, downloads: 9800, category: 'Themes', description: 'High-contrast dark theme palette for VisualStack Studio editor.', isInstalled: false, isEnabled: false },
  ];

  public getPlugins(category?: string): MarketplacePlugin[] {
    if (!category || category === 'All') return [...this.plugins];
    return this.plugins.filter((p) => p.category === category);
  }

  public toggleInstall(pluginId: string): boolean {
    const target = this.plugins.find((p) => p.id === pluginId);
    if (!target) return false;
    target.isInstalled = !target.isInstalled;
    target.isEnabled = target.isInstalled;
    return true;
  }
}

export const pluginMarketplace = new PluginMarketplace();
