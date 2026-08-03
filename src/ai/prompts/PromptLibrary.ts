export interface PromptTemplate {
  id: string;
  title: string;
  category: 'ui' | 'backend' | 'database' | 'fullstack';
  description: string;
  prompt: string;
}

export class PromptLibrary {
  private templates: PromptTemplate[] = [
    {
      id: 'tmpl_landing',
      title: 'Modern SaaS Landing Page',
      category: 'ui',
      description: 'Generates a sleek hero section, features grid, pricing tables, testimonials, and call-to-action footer.',
      prompt: 'Create a modern dark-mode SaaS Landing Page with hero section, gradient text, feature grid, pricing card pricing model, and CTA footer.',
    },
    {
      id: 'tmpl_crm',
      title: 'Enterprise CRM Dashboard',
      category: 'fullstack',
      description: 'Generates user statistics, revenue charts, lead tables, activity logs, and team management nodes.',
      prompt: 'Design an Enterprise CRM Dashboard with analytics cards, recent customer leads table, revenue trends graph, and quick status badges.',
    },
    {
      id: 'tmpl_auth',
      title: 'Fullstack Authentication System',
      category: 'backend',
      description: 'Configures JWT authentication workflow, Google OAuth login node, password hashing, and user role-based permissions.',
      prompt: 'Build a complete authentication workflow with JWT sign-in, signup validation, Google OAuth provider integration, and RBAC permissions.',
    },
    {
      id: 'tmpl_ecommerce',
      title: 'E-Commerce Store & Stripe Checkout',
      category: 'fullstack',
      description: 'Generates product catalogue, shopping cart, Stripe payment node, order processing pipeline, and email invoice dispatcher.',
      prompt: 'Create an e-commerce storefront with product search, cart state management, Stripe payment workflow, and order confirmation email node.',
    },
  ];

  public getTemplates(category?: PromptTemplate['category']): PromptTemplate[] {
    if (!category) return [...this.templates];
    return this.templates.filter((t) => t.category === category);
  }
}

export const promptLibrary = new PromptLibrary();
