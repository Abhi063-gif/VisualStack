import { ComponentFactory } from '../../features/designer/components/factories/ComponentFactory';
import { useSceneStore, type PageItem } from '../../stores/SceneStore';
import { useViewportStore } from '../../stores/ViewportStore';
import { screenManager } from '../../application/screens/ScreenManager';
import { GraphManager } from '../../features/logic/graph/GraphManager';
import { useLogicStore } from '../../stores/LogicStore';

export interface ThemeTokens {
  isLight: boolean;
  pageFill: string;
  pageStroke: string;
  cardFill: string;
  cardStroke: string;
  navbarFill: string;
  navbarStroke: string;
  textPrimary: string;
  textSecondary: string;
  btnPrimaryFill: string;
  btnPrimaryStroke: string;
  btnPrimaryText: string;
  btnSecondaryFill: string;
  btnSecondaryStroke: string;
  btnSecondaryText: string;
}

export class AIPromptEngine {
  /**
   * Evaluates natural language prompt to extract theme tokens (Light vs Dark)
   */
  private getThemeTokens(prompt: string): ThemeTokens {
    const lower = prompt.toLowerCase();
    const isLight = lower.includes('light') || lower.includes('white') || lower.includes('bright') || lower.includes('clean');

    if (isLight) {
      return {
        isLight: true,
        pageFill: '#f8fafc',
        pageStroke: '#cbd5e1',
        cardFill: '#ffffff',
        cardStroke: '#e2e8f0',
        navbarFill: '#ffffff',
        navbarStroke: '#e2e8f0',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        btnPrimaryFill: '#2563eb',
        btnPrimaryStroke: '#3b82f6',
        btnPrimaryText: '#ffffff',
        btnSecondaryFill: '#f1f5f9',
        btnSecondaryStroke: '#cbd5e1',
        btnSecondaryText: '#1e293b',
      };
    }

    // Default Dark Theme Tokens
    return {
      isLight: false,
      pageFill: '#0e0f12',
      pageStroke: '#4f46e5',
      cardFill: '#161922',
      cardStroke: '#282e3e',
      navbarFill: '#14161b',
      navbarStroke: '#232733',
      textPrimary: '#ffffff',
      textSecondary: '#9ca3af',
      btnPrimaryFill: '#4f46e5',
      btnPrimaryStroke: '#6366f1',
      btnPrimaryText: '#ffffff',
      btnSecondaryFill: '#1f232d',
      btnSecondaryStroke: '#374151',
      btnSecondaryText: '#d1d5db',
    };
  }

  /**
   * Registers & activates a new Page in both SceneStore (Pages Sidebar) and ScreenManager
   */
  private registerAndActivatePage(pageTitle: string, routePath: string): void {
    const store = useSceneStore.getState();
    const existing = store.pages.find((p) => p.name.toLowerCase() === pageTitle.toLowerCase());
    
    let pageId = existing?.id;
    if (!existing) {
      pageId = `page_${Date.now().toString(36)}`;
      const newPage: PageItem = {
        id: pageId,
        name: pageTitle,
        type: 'page',
        parentId: null,
      };
      store.setPages([...store.pages, newPage]);
      screenManager.createScreen(pageTitle, routePath);
    }

    if (pageId) {
      store.setActivePageId(pageId);
    }
  }

  /**
   * Primary entry point to execute natural language prompts accurately
   */
  public executePrompt(prompt: string): string {
    const lower = prompt.toLowerCase();
    const theme = this.getThemeTokens(prompt);

    if (lower.includes('e-commerce') || lower.includes('store') || lower.includes('shopping') || lower.includes('shop')) {
      return this.generateEcommerceStore(theme);
    } else if (lower.includes('login') || lower.includes('auth') || lower.includes('sign in')) {
      return this.generateAuthPage(theme);
    } else if (lower.includes('dashboard') || lower.includes('crm') || lower.includes('analytics')) {
      return this.generateDashboardPage(theme);
    } else {
      return this.generateGenericLandingPage(prompt, theme);
    }
  }

  /**
   * Generates an attractive E-Commerce Storefront UI & Stripe Checkout Backend Logic Graph
   */
  private generateEcommerceStore(theme: ThemeTokens): string {
    this.registerAndActivatePage('E-Commerce Storefront', '/store');

    // 1. Page Viewport Frame
    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Storefront Viewport (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({
      fill: theme.pageFill,
      stroke: theme.pageStroke,
      strokeWidth: 2,
      cornerRadius: 12,
    });
    useSceneStore.getState().upsertNode(pageFrame);

    // 2. E-Commerce Navbar with Cart
    const navbar = ComponentFactory.insertNode('Navbar', {
      name: 'E-Commerce Navigation Header',
      position: { x: 70, y: 70 },
      size: { width: 1300, height: 64 },
    });
    navbar.updateStyle({ fill: theme.navbarFill, stroke: theme.navbarStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(navbar);

    // Navbar Search Input
    const search = ComponentFactory.insertNode('Input', {
      name: 'Product Search Bar',
      position: { x: 500, y: 80 },
      size: { width: 400, height: 42 },
    });
    search.textContent = 'Search products, electronics, apparel...';
    search.updateStyle({ fill: theme.isLight ? '#f1f5f9' : '#0e0f12', stroke: theme.navbarStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(search);

    // Cart Button
    const cartBtn = ComponentFactory.insertNode('Button', {
      name: 'Shopping Cart (3 items)',
      position: { x: 1180, y: 80 },
      size: { width: 170, height: 42 },
    });
    cartBtn.textContent = 'Cart (3) • $647';
    cartBtn.updateStyle({ fill: theme.btnPrimaryFill, stroke: theme.btnPrimaryStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(cartBtn);

    // 3. Hero Promo Banner
    const promoSection = ComponentFactory.insertNode('Section', {
      name: 'Promo Sale Banner',
      position: { x: 70, y: 154 },
      size: { width: 1300, height: 260 },
    });
    promoSection.updateStyle({ fill: theme.cardFill, stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 16 });
    useSceneStore.getState().upsertNode(promoSection);

    const promoTitle = ComponentFactory.insertNode('Heading', {
      name: 'Promo Headline',
      position: { x: 120, y: 194 },
      size: { width: 800, height: 50 },
    });
    promoTitle.textContent = 'Summer Tech Collection - 30% OFF';
    promoTitle.updateStyle({ fill: theme.textPrimary, fontSize: 32, fontWeight: 700 });
    useSceneStore.getState().upsertNode(promoTitle);

    const promoSub = ComponentFactory.insertNode('Paragraph', {
      name: 'Promo Subtitle',
      position: { x: 120, y: 254 },
      size: { width: 750, height: 30 },
    });
    promoSub.textContent = 'Explore flagship noise-canceling headphones, mechanical keyboards, and smart watches with free express shipping.';
    promoSub.updateStyle({ fill: theme.textSecondary, fontSize: 15 });
    useSceneStore.getState().upsertNode(promoSub);

    const shopBtn = ComponentFactory.insertNode('Button', {
      name: 'Shop Now Button',
      position: { x: 120, y: 310 },
      size: { width: 180, height: 44 },
    });
    shopBtn.textContent = 'Explore Catalogue';
    shopBtn.updateStyle({ fill: theme.btnPrimaryFill, stroke: theme.btnPrimaryStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(shopBtn);

    // 4. Product Grid Cards
    const products = [
      { name: 'Wireless Headphones', price: '$299', pos: 70 },
      { name: 'Smart Fitness Watch', price: '$199', pos: 515 },
      { name: 'Mechanical Keyboard', price: '$149', pos: 960 },
    ];

    products.forEach((prod) => {
      const card = ComponentFactory.insertNode('Card', {
        name: `Product Card - ${prod.name}`,
        position: { x: prod.pos, y: 440 },
        size: { width: 410, height: 300 },
      });
      card.updateStyle({ fill: theme.cardFill, stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 12 });
      useSceneStore.getState().upsertNode(card);

      const pTitle = ComponentFactory.insertNode('Heading', {
        name: `Title - ${prod.name}`,
        position: { x: prod.pos + 20, y: 460 },
        size: { width: 370, height: 30 },
      });
      pTitle.textContent = prod.name;
      pTitle.updateStyle({ fill: theme.textPrimary, fontSize: 18, fontWeight: 600 });
      useSceneStore.getState().upsertNode(pTitle);

      const pPrice = ComponentFactory.insertNode('Paragraph', {
        name: `Price - ${prod.price}`,
        position: { x: prod.pos + 20, y: 500 },
        size: { width: 200, height: 25 },
      });
      pPrice.textContent = prod.price;
      pPrice.updateStyle({ fill: theme.btnPrimaryFill, fontSize: 20, fontWeight: 700 });
      useSceneStore.getState().upsertNode(pPrice);

      const addBtn = ComponentFactory.insertNode('Button', {
        name: `Add to Cart - ${prod.name}`,
        position: { x: prod.pos + 20, y: 670 },
        size: { width: 370, height: 42 },
      });
      addBtn.textContent = 'Add to Cart';
      addBtn.updateStyle({ fill: theme.btnSecondaryFill, stroke: theme.btnSecondaryStroke, strokeWidth: 1, cornerRadius: 8 });
      useSceneStore.getState().upsertNode(addBtn);
    });

    // 5. Build E-Commerce Stripe Checkout Backend Workflow Graph
    this.buildCheckoutBackendGraph();

    // Sync Store & Focus Viewport Camera
    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return `[AI Fullstack Engine] Created "E-Commerce Storefront" Page (${theme.isLight ? 'Light Theme' : 'Dark Theme'}) with Navbar, Search, Hero Sale Banner, 3 Product Cards, and Stripe Checkout Logic Nodes!`;
  }

  /**
   * Generates a Login Authentication UI & JWT Backend Workflow Graph
   */
  private generateAuthPage(theme: ThemeTokens): string {
    this.registerAndActivatePage('User Authentication', '/login');

    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Auth Page Viewport (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: theme.pageFill, stroke: theme.pageStroke, strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    const card = ComponentFactory.insertNode('Card', {
      name: 'Authentication Card Container',
      position: { x: 490, y: 160 },
      size: { width: 460, height: 520 },
    });
    card.updateStyle({ fill: theme.cardFill, stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 16 });
    useSceneStore.getState().upsertNode(card);

    const head = ComponentFactory.insertNode('Heading', {
      name: 'Auth Heading',
      position: { x: 530, y: 210 },
      size: { width: 380, height: 40 },
    });
    head.textContent = 'Sign In to Your Account';
    head.updateStyle({ fill: theme.textPrimary, fontSize: 24, fontWeight: 700 });
    useSceneStore.getState().upsertNode(head);

    const sub = ComponentFactory.insertNode('Paragraph', {
      name: 'Auth Subtitle',
      position: { x: 530, y: 255 },
      size: { width: 380, height: 30 },
    });
    sub.textContent = 'Welcome back! Enter your credentials to access your dashboard.';
    sub.updateStyle({ fill: theme.textSecondary, fontSize: 13 });
    useSceneStore.getState().upsertNode(sub);

    const email = ComponentFactory.insertNode('Input', {
      name: 'Email Input',
      position: { x: 530, y: 310 },
      size: { width: 380, height: 44 },
    });
    email.textContent = 'user@company.com';
    email.updateStyle({ fill: theme.isLight ? '#f1f5f9' : '#0e0f12', stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(email);

    const pass = ComponentFactory.insertNode('Input', {
      name: 'Password Input',
      position: { x: 530, y: 380 },
      size: { width: 380, height: 44 },
    });
    pass.textContent = '••••••••••••••••';
    pass.updateStyle({ fill: theme.isLight ? '#f1f5f9' : '#0e0f12', stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(pass);

    const btn = ComponentFactory.insertNode('Button', {
      name: 'Sign In Button',
      position: { x: 530, y: 460 },
      size: { width: 380, height: 46 },
    });
    btn.textContent = 'Sign In';
    btn.updateStyle({ fill: theme.btnPrimaryFill, stroke: theme.btnPrimaryStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(btn);

    // Build Backend Auth Workflow
    this.buildAuthBackendGraph();

    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return `[AI Fullstack Engine] Created "User Authentication" Page (${theme.isLight ? 'Light Theme' : 'Dark Theme'}) with Auth Card, Email/Password Inputs, and JWT Auth Logic Graph!`;
  }

  /**
   * Generates a CRM Dashboard UI & Analytics Backend Workflow Graph
   */
  private generateDashboardPage(theme: ThemeTokens): string {
    this.registerAndActivatePage('CRM Dashboard', '/dashboard');

    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Dashboard Viewport (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: theme.pageFill, stroke: theme.pageStroke, strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    const sidebar = ComponentFactory.insertNode('Sidebar', {
      name: 'Navigation Sidebar',
      position: { x: 70, y: 70 },
      size: { width: 240, height: 800 },
    });
    sidebar.updateStyle({ fill: theme.navbarFill, stroke: theme.navbarStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(sidebar);

    const navbar = ComponentFactory.insertNode('Navbar', {
      name: 'Dashboard Header Navbar',
      position: { x: 330, y: 70 },
      size: { width: 1040, height: 60 },
    });
    navbar.updateStyle({ fill: theme.navbarFill, stroke: theme.navbarStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(navbar);

    // Metric Cards
    const cards = [
      { title: 'Total Revenue', value: '$128,400', pos: 330 },
      { title: 'Active Subscribers', value: '2,450', pos: 685 },
      { title: 'Conversion Rate', value: '4.8%', pos: 1040 },
    ];

    cards.forEach((c) => {
      const card = ComponentFactory.insertNode('Card', {
        name: `Metric Card - ${c.title}`,
        position: { x: c.pos, y: 150 },
        size: { width: 330, height: 140 },
      });
      card.updateStyle({ fill: theme.cardFill, stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 12 });
      useSceneStore.getState().upsertNode(card);

      const t = ComponentFactory.insertNode('Paragraph', {
        name: `Label - ${c.title}`,
        position: { x: c.pos + 20, y: 170 },
        size: { width: 290, height: 24 },
      });
      t.textContent = c.title;
      t.updateStyle({ fill: theme.textSecondary, fontSize: 14 });
      useSceneStore.getState().upsertNode(t);

      const v = ComponentFactory.insertNode('Heading', {
        name: `Value - ${c.value}`,
        position: { x: c.pos + 20, y: 200 },
        size: { width: 290, height: 40 },
      });
      v.textContent = c.value;
      v.updateStyle({ fill: theme.textPrimary, fontSize: 28, fontWeight: 700 });
      useSceneStore.getState().upsertNode(v);
    });

    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return `[AI Fullstack Engine] Created "CRM Dashboard" Page (${theme.isLight ? 'Light Theme' : 'Dark Theme'}) with Sidebar, Header, and Metric Cards!`;
  }

  /**
   * Generates a custom SaaS/Generic Landing Page based on user prompt
   */
  private generateGenericLandingPage(prompt: string, theme: ThemeTokens): string {
    this.registerAndActivatePage('Main Landing Page', '/home');

    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Landing Page Viewport (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: theme.pageFill, stroke: theme.pageStroke, strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    const navbar = ComponentFactory.insertNode('Navbar', {
      name: 'Header Navigation Bar',
      position: { x: 70, y: 70 },
      size: { width: 1300, height: 64 },
    });
    navbar.updateStyle({ fill: theme.navbarFill, stroke: theme.navbarStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(navbar);

    const hero = ComponentFactory.insertNode('Section', {
      name: 'Hero Banner Section',
      position: { x: 70, y: 154 },
      size: { width: 1300, height: 340 },
    });
    hero.updateStyle({ fill: theme.cardFill, stroke: theme.cardStroke, strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(hero);

    const heading = ComponentFactory.insertNode('Heading', {
      name: 'Hero Title',
      position: { x: 120, y: 194 },
      size: { width: 900, height: 60 },
    });
    heading.textContent = prompt.length > 40 ? prompt.slice(0, 45) + '...' : prompt;
    heading.updateStyle({ fill: theme.textPrimary, fontSize: 32, fontWeight: 700 });
    useSceneStore.getState().upsertNode(heading);

    const sub = ComponentFactory.insertNode('Paragraph', {
      name: 'Hero Subtitle',
      position: { x: 120, y: 264 },
      size: { width: 850, height: 50 },
    });
    sub.textContent = 'Designed and wireframed autonomously by VisualStack Studio AI Assistant.';
    sub.updateStyle({ fill: theme.textSecondary, fontSize: 16 });
    useSceneStore.getState().upsertNode(sub);

    const btn1 = ComponentFactory.insertNode('Button', {
      name: 'Primary Action Button',
      position: { x: 120, y: 334 },
      size: { width: 190, height: 46 },
    });
    btn1.textContent = 'Get Started';
    btn1.updateStyle({ fill: theme.btnPrimaryFill, stroke: theme.btnPrimaryStroke, strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(btn1);

    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return `[AI Fullstack Engine] Created "Main Landing Page" Page (${theme.isLight ? 'Light Theme' : 'Dark Theme'}) matching prompt: "${prompt}"!`;
  }

  /**
   * Helper to build Stripe Checkout Backend Nodes
   */
  private buildCheckoutBackendGraph(): void {
    const graphMgr = GraphManager.getInstance();
    const n1 = graphMgr.createNode(
      `node_cart_${Date.now()}`,
      'http_trigger',
      'Events',
      'POST /api/checkout',
      'Receives cart items and customer email',
      [],
      [{ id: 'out_cart', name: 'Cart Payload', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 100, y: 180 },
      { route: '/api/checkout', method: 'POST' },
      'shopping-cart',
      '#6366f1'
    );

    const n2 = graphMgr.createNode(
      `node_stripe_${Date.now()}`,
      'stripe_payment',
      'E-Commerce',
      'Stripe Payment Gateway',
      'Processes credit card payment session',
      [{ id: 'in_cart', name: 'Cart Data', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_paid', name: 'Payment Success', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 420, y: 180 },
      { currency: 'USD' },
      'credit-card',
      '#10b981'
    );

    const n3 = graphMgr.createNode(
      `node_order_db_${Date.now()}`,
      'db_query',
      'Database',
      'Save Order to Database',
      'Inserts order record into orders table',
      [{ id: 'in_order', name: 'Order Data', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_res', name: 'DB Response', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 740, y: 180 },
      { table: 'orders' },
      'database',
      '#3b82f6'
    );

    graphMgr.createEdge(`edge_c1_${Date.now()}`, n1.id, 'out_cart', n2.id, 'in_cart', 'data');
    graphMgr.createEdge(`edge_c2_${Date.now()}`, n2.id, 'out_paid', n3.id, 'in_order', 'data');
    useLogicStore.getState().syncFromGraph();
  }

  /**
   * Helper to build Auth JWT Backend Nodes
   */
  private buildAuthBackendGraph(): void {
    const graphMgr = GraphManager.getInstance();
    const n1 = graphMgr.createNode(
      `node_http_${Date.now()}`,
      'http_trigger',
      'Events',
      'POST /api/auth/login',
      'Receives HTTP login requests',
      [],
      [{ id: 'out_req', name: 'Request Body', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 100, y: 180 },
      { route: '/api/auth/login', method: 'POST' },
      'globe',
      '#6366f1'
    );

    const n2 = graphMgr.createNode(
      `node_jwt_${Date.now()}`,
      'jwt_sign',
      'Auth',
      'Sign JWT Session Token',
      'Signs JWT token with 7-day expiration',
      [{ id: 'in_user', name: 'User Payload', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_token', name: 'JWT Token', type: 'data', dataType: 'string', direction: 'output' }],
      { x: 420, y: 180 },
      { expiresIn: '7d' },
      'key',
      '#10b981'
    );

    graphMgr.createEdge(`edge_a1_${Date.now()}`, n1.id, 'out_req', n2.id, 'in_user', 'data');
    useLogicStore.getState().syncFromGraph();
  }
}

export const aiPromptEngine = new AIPromptEngine();
