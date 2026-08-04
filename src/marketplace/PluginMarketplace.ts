export interface MarketplacePlugin {
  id: string;
  name: string;
  version: string;
  author: string;
  rating: number;
  downloads: number;
  category: 'UI Kits & Figma' | 'Editor Extensions' | 'Backend Connectors' | 'AI & Copilots' | 'Themes' | 'DevOps & Cloud';
  description: string;
  tags: string[];
  isInstalled: boolean;
  isEnabled: boolean;
}

const REAL_PLUGINS_DATA: MarketplacePlugin[] = [
  // UI Kits & Figma
  { id: 'plug_figma_tokens', name: 'Figma Tokens Sync', version: '2.5.1', author: 'Figma Community', rating: 4.9, downloads: 84200, category: 'UI Kits & Figma', description: 'Bi-directional sync between Figma design tokens, auto-layout variants, and VisualStack CSS tokens.', tags: ['figma', 'tokens', 'styles'], isInstalled: true, isEnabled: true },
  { id: 'plug_tailwind_ui', name: 'Tailwind CSS IntelliSense', version: '3.4.2', author: 'Tailwind Labs', rating: 4.9, downloads: 142000, category: 'UI Kits & Figma', description: 'Intelligent class autocomplete, color previews, and linting for Tailwind CSS in canvas widgets.', tags: ['tailwind', 'css', 'autocomplete'], isInstalled: true, isEnabled: true },
  { id: 'plug_material_ui', name: 'MUI v5 Component Kit', version: '5.15.0', author: 'MUI Official', rating: 4.8, downloads: 96500, category: 'UI Kits & Figma', description: 'Complete Google Material Design 3 UI component set including buttons, dialogs, sliders, and cards.', tags: ['material', 'mui', 'components'], isInstalled: false, isEnabled: false },
  { id: 'plug_shadcn_ui', name: 'shadcn/ui Component Palette', version: '1.2.0', author: 'shadcn', rating: 4.9, downloads: 115000, category: 'UI Kits & Figma', description: 'Copy-paste beautiful accessible Radix UI & Tailwind CSS elements directly onto canvas.', tags: ['shadcn', 'radix', 'react'], isInstalled: true, isEnabled: true },
  { id: 'plug_lucide_icons', name: 'Lucide Icon Pack 1000+', version: '0.350.0', author: 'Lucide Project', rating: 4.9, downloads: 160000, category: 'UI Kits & Figma', description: '1000+ modern SVG icons with configurable stroke width, fill, and vector color support.', tags: ['icons', 'svg', 'lucide'], isInstalled: true, isEnabled: true },
  { id: 'plug_framer_motion', name: 'Framer Motion Animator', version: '11.0.8', author: 'Framer', rating: 4.8, downloads: 78000, category: 'UI Kits & Figma', description: 'Drag-and-drop animation curves, spring physics, and hover/click keyframe effects.', tags: ['animation', 'motion', 'framer'], isInstalled: false, isEnabled: false },
  { id: 'plug_heroicons', name: 'Tailwind Heroicons v2', version: '2.1.1', author: 'Tailwind Labs', rating: 4.7, downloads: 65000, category: 'UI Kits & Figma', description: 'Official hand-crafted solid and outline SVG icon set for modern web interfaces.', tags: ['heroicons', 'svg'], isInstalled: false, isEnabled: false },
  { id: 'plug_chakra_ui', name: 'Chakra UI Pro Widgets', version: '2.8.2', author: 'Chakra Team', rating: 4.7, downloads: 52000, category: 'UI Kits & Figma', description: 'Modular, accessible React components with dark mode and theme token binding.', tags: ['chakra', 'react'], isInstalled: false, isEnabled: false },

  // Editor Extensions (VS Code style)
  { id: 'plug_prettier', name: 'Prettier Code Formatter', version: '10.1.0', author: 'Prettier Core', rating: 4.9, downloads: 280000, category: 'Editor Extensions', description: 'Opinionated code formatter for JS, TS, HTML, CSS, JSON, and React code blocks.', tags: ['formatter', 'prettier', 'code'], isInstalled: true, isEnabled: true },
  { id: 'plug_eslint', name: 'ESLint Code Linter', version: '8.57.0', author: 'ESLint Team', rating: 4.9, downloads: 260000, category: 'Editor Extensions', description: 'Integrates ESLint into VisualStack code editor to highlight syntax and logical errors.', tags: ['linter', 'eslint', 'errors'], isInstalled: true, isEnabled: true },
  { id: 'plug_gitlens', name: 'GitLens Supercharged Git', version: '15.0.1', author: 'GitKraken', rating: 4.9, downloads: 195000, category: 'Editor Extensions', description: 'Inline git blame annotations, revision navigation, commit history graph, and diff view.', tags: ['git', 'blame', 'history'], isInstalled: true, isEnabled: true },
  { id: 'plug_error_lens', name: 'Error Lens Highlighter', version: '3.16.0', author: 'Alexander', rating: 4.8, downloads: 128000, category: 'Editor Extensions', description: 'Highlights error, warning, and diagnostic lines directly in Monaco code editor with inline message.', tags: ['errors', 'monaco'], isInstalled: false, isEnabled: false },
  { id: 'plug_auto_rename_tag', name: 'Auto Rename Tag', version: '0.1.10', author: 'Jun Han', rating: 4.7, downloads: 140000, category: 'Editor Extensions', description: 'Automatically rename paired HTML/JSX tags in code editor simultaneously.', tags: ['html', 'jsx', 'tags'], isInstalled: true, isEnabled: true },
  { id: 'plug_bracket_pair', name: 'Rainbow Brackets Colorizer', version: '2.0.4', author: 'CoenraadS', rating: 4.8, downloads: 175000, category: 'Editor Extensions', description: 'Colorizes matching brackets for nesting clarity in JavaScript and JSON files.', tags: ['brackets', 'colors'], isInstalled: true, isEnabled: true },
  { id: 'plug_path_intellisense', name: 'Path IntelliSense', version: '2.8.5', author: 'Christian Kohler', rating: 4.7, downloads: 110000, category: 'Editor Extensions', description: 'Autocompletes file path imports and asset URIs as you type code.', tags: ['imports', 'paths'], isInstalled: false, isEnabled: false },
  { id: 'plug_live_server', name: 'Live Preview Local Server', version: '0.4.7', author: 'Microsoft', rating: 4.8, downloads: 210000, category: 'Editor Extensions', description: 'Embedded browser preview with instant hot-reload on every canvas or code modification.', tags: ['server', 'preview', 'hot-reload'], isInstalled: true, isEnabled: true },

  // Backend Connectors
  { id: 'plug_stripe', name: 'Stripe Payments Suite', version: '2.4.0', author: 'Stripe Official', rating: 4.9, downloads: 142000, category: 'Backend Connectors', description: 'Checkout webhooks, subscription billing, refund nodes, and payment intent nodes.', tags: ['stripe', 'payments', 'billing'], isInstalled: true, isEnabled: true },
  { id: 'plug_supabase', name: 'Supabase Database & Auth', version: '1.8.2', author: 'Supabase Inc', rating: 4.9, downloads: 189000, category: 'Backend Connectors', description: 'Realtime Postgres subscriptions, Row Level Security rules, Auth, and Storage buckets.', tags: ['supabase', 'postgres', 'auth'], isInstalled: true, isEnabled: true },
  { id: 'plug_firebase', name: 'Firebase Admin & Firestore', version: '10.8.0', author: 'Google Cloud', rating: 4.8, downloads: 156000, category: 'Backend Connectors', description: 'Cloud Firestore database queries, Firebase Auth triggers, and Cloud Functions.', tags: ['firebase', 'google', 'nosql'], isInstalled: false, isEnabled: false },
  { id: 'plug_prisma', name: 'Prisma ORM Generator', version: '5.10.0', author: 'Prisma Data Inc', rating: 4.9, downloads: 132000, category: 'Backend Connectors', description: 'Visual data modeler, schema migrations, and type-safe database query nodes.', tags: ['prisma', 'orm', 'database'], isInstalled: true, isEnabled: true },
  { id: 'plug_redis', name: 'Redis Caching & PubSub', version: '4.6.0', author: 'Redis Ltd', rating: 4.8, downloads: 88000, category: 'Backend Connectors', description: 'In-memory KV caching, key expiration, rate limiting, and PubSub message queues.', tags: ['redis', 'cache', 'queue'], isInstalled: false, isEnabled: false },
  { id: 'plug_graphql', name: 'Apollo GraphQL Engine', version: '3.9.0', author: 'Apollo GraphQL', rating: 4.8, downloads: 74000, category: 'Backend Connectors', description: 'Auto-generate GraphQL schemas, resolvers, and Apollo Client hooks.', tags: ['graphql', 'apollo', 'api'], isInstalled: false, isEnabled: false },
  { id: 'plug_postman', name: 'Postman API Tester', version: '2.1.0', author: 'Postman', rating: 4.9, downloads: 198000, category: 'Backend Connectors', description: 'Import Postman collections, run API test suites, and mock REST endpoints.', tags: ['postman', 'rest', 'api'], isInstalled: true, isEnabled: true },
  { id: 'plug_twilio', name: 'Twilio SMS & Whatsapp API', version: '4.2.0', author: 'Twilio', rating: 4.7, downloads: 62000, category: 'Backend Connectors', description: 'Send SMS notifications, 2FA verification codes, and WhatsApp messages.', tags: ['twilio', 'sms', 'auth'], isInstalled: false, isEnabled: false },

  // AI & Copilots
  { id: 'plug_openai', name: 'OpenAI GPT-4o & Canvas AI', version: '1.4.0', author: 'OpenAI', rating: 4.9, downloads: 310000, category: 'AI & Copilots', description: 'Advanced streaming LLM prompts, visual wireframe parsing, and multi-step fullstack creation.', tags: ['openai', 'gpt4', 'copilot'], isInstalled: true, isEnabled: true },
  { id: 'plug_anthropic', name: 'Claude 3.5 Sonnet Engineer', version: '2.1.0', author: 'Anthropic', rating: 4.9, downloads: 245000, category: 'AI & Copilots', description: 'Deep architectural reasoning, refactoring, code explanation, and bug fixing.', tags: ['claude', 'anthropic', 'ai'], isInstalled: true, isEnabled: true },
  { id: 'plug_deepseek', name: 'DeepSeek R1 Reasoner', version: '1.0.2', author: 'DeepSeek AI', rating: 4.9, downloads: 185000, category: 'AI & Copilots', description: 'Ultra-fast math logic, state machine generation, and algorithm optimizer.', tags: ['deepseek', 'reasoning'], isInstalled: true, isEnabled: true },
  { id: 'plug_ollama', name: 'Ollama Local LLM Connector', version: '0.5.1', author: 'Ollama Community', rating: 4.8, downloads: 140000, category: 'AI & Copilots', description: 'Run Qwen2.5-Coder and Llama3 offline on your GPU without cloud API costs.', tags: ['ollama', 'local', 'gpu'], isInstalled: true, isEnabled: true },
  { id: 'plug_copilot_voice', name: 'Voice Copilot Assistant', version: '1.1.0', author: 'VisualStack AI', rating: 4.7, downloads: 54000, category: 'AI & Copilots', description: 'Speech-to-text dictation to design canvas screens and generate backend workflows by voice.', tags: ['voice', 'speech', 'ai'], isInstalled: false, isEnabled: false },

  // Themes
  { id: 'plug_dracula', name: 'Dracula Pro Theme', version: '1.2.0', author: 'Zeno Rocha', rating: 4.9, downloads: 98000, category: 'Themes', description: 'Vibrant dark theme palette crafted for high readability and reduced eye strain.', tags: ['theme', 'dark', 'dracula'], isInstalled: true, isEnabled: true },
  { id: 'plug_one_dark', name: 'One Dark Pro Theme', version: '3.14.0', author: 'binaryify', rating: 4.8, downloads: 180000, category: 'Themes', description: 'Atom classic One Dark color scheme for code editor, canvas, and sidebars.', tags: ['theme', 'one-dark'], isInstalled: false, isEnabled: false },
  { id: 'plug_tokyo_night', name: 'Tokyo Night Theme Pack', version: '1.0.5', author: 'enkia', rating: 4.9, downloads: 125000, category: 'Themes', description: 'Clean dark theme inspired by the lights of Tokyo at night.', tags: ['theme', 'tokyo-night'], isInstalled: true, isEnabled: true },
  { id: 'plug_catppuccin', name: 'Catppuccin Mocha Palette', version: '0.2.0', author: 'Catppuccin Org', rating: 4.9, downloads: 145000, category: 'Themes', description: 'Soothing pastel dark theme with customizable accent highlights.', tags: ['theme', 'catppuccin', 'pastel'], isInstalled: false, isEnabled: false },
  { id: 'plug_github_theme', name: 'GitHub Light & Dark Theme', version: '6.3.4', author: 'GitHub', rating: 4.8, downloads: 220000, category: 'Themes', description: 'Official GitHub default light, dark, and dim color schemes.', tags: ['theme', 'github'], isInstalled: false, isEnabled: false },

  // DevOps & Cloud
  { id: 'plug_docker', name: 'Docker Container Manager', version: '1.24.0', author: 'Docker Inc', rating: 4.9, downloads: 260000, category: 'DevOps & Cloud', description: 'Build Dockerfiles, manage multi-container Docker Compose stacks, and view logs.', tags: ['docker', 'containers', 'devops'], isInstalled: true, isEnabled: true },
  { id: 'plug_kubernetes', name: 'Kubernetes Cluster Engine', version: '1.3.0', author: 'CNCF', rating: 4.8, downloads: 95000, category: 'DevOps & Cloud', description: 'Deploy Helm charts, inspect Pods, services, and ingress rules.', tags: ['k8s', 'kubernetes', 'cloud'], isInstalled: false, isEnabled: false },
  { id: 'plug_vercel', name: 'Vercel 1-Click Deployment', version: '4.1.0', author: 'Vercel', rating: 4.9, downloads: 290000, category: 'DevOps & Cloud', description: 'Automatic production deployments, preview URLs, and serverless edge logs.', tags: ['vercel', 'deploy', 'nextjs'], isInstalled: true, isEnabled: true },
  { id: 'plug_aws', name: 'AWS S3 & CloudFront Storage', version: '3.1.0', author: 'Amazon Web Services', rating: 4.8, downloads: 175000, category: 'DevOps & Cloud', description: 'Upload static assets directly to AWS S3 buckets with CloudFront CDN distribution.', tags: ['aws', 's3', 'cdn'], isInstalled: false, isEnabled: false },
  { id: 'plug_github_actions', name: 'GitHub Actions CI/CD Pipeline', version: '2.0.1', author: 'GitHub', rating: 4.9, downloads: 210000, category: 'DevOps & Cloud', description: 'Visual pipeline builder for GitHub Actions workflows, automated testing, and release binaries.', tags: ['cicd', 'github', 'pipeline'], isInstalled: true, isEnabled: true },
];

export class PluginMarketplace {
  private plugins: MarketplacePlugin[] = [];

  constructor() {
    this.loadState();
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem('visualstack_plugins_installed_v2');
      if (saved) {
        const parsedMap: Record<string, boolean> = JSON.parse(saved);
        this.plugins = REAL_PLUGINS_DATA.map((p) => ({
          ...p,
          isInstalled: parsedMap[p.id] !== undefined ? parsedMap[p.id] : p.isInstalled,
          isEnabled: parsedMap[p.id] !== undefined ? parsedMap[p.id] : p.isEnabled,
        }));
        return;
      }
    } catch {
      // Fallback
    }
    this.plugins = [...REAL_PLUGINS_DATA];
  }

  private saveState(): void {
    try {
      const map: Record<string, boolean> = {};
      this.plugins.forEach((p) => {
        map[p.id] = p.isInstalled;
      });
      localStorage.setItem('visualstack_plugins_installed_v2', JSON.stringify(map));
    } catch {
      // Ignore
    }
  }

  public getPlugins(category?: string, filterType?: 'all' | 'installed' | 'featured' | 'popular'): MarketplacePlugin[] {
    let result = [...this.plugins];

    if (category && category !== 'All') {
      result = result.filter((p) => p.category === category);
    }

    if (filterType === 'installed') {
      result = result.filter((p) => p.isInstalled);
    } else if (filterType === 'popular') {
      result = result.sort((a, b) => b.downloads - a.downloads);
    } else if (filterType === 'featured') {
      result = result.filter((p) => p.rating >= 4.9);
    }

    return result;
  }

  public toggleInstall(pluginId: string): boolean {
    const target = this.plugins.find((p) => p.id === pluginId);
    if (!target) return false;
    target.isInstalled = !target.isInstalled;
    target.isEnabled = target.isInstalled;
    this.saveState();
    return true;
  }

  public getInstalledCount(): number {
    return this.plugins.filter((p) => p.isInstalled).length;
  }

  public getTotalCount(): number {
    return this.plugins.length;
  }
}

export const pluginMarketplace = new PluginMarketplace();
