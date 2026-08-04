import { aiPromptEngine } from '../ai/services/AIPromptEngine';

export interface ProjectTemplate {
  id: string;
  title: string;
  category: 'Fullstack' | 'Web' | 'Enterprise' | 'Mobile';
  description: string;
  thumbnailColor: string;
  promptKey: string;
}

export class ProjectTemplateEngine {
  private templates: ProjectTemplate[] = [
    { id: 'tmpl_blank', title: 'Blank Project', category: 'Fullstack', description: 'Clean canvas for custom frontend & backend development.', thumbnailColor: '#3b82f6', promptKey: 'create blank page' },
    { id: 'tmpl_landing', title: 'SaaS Landing Page', category: 'Web', description: 'Sleek hero section, feature grid, pricing cards & CTA footer.', thumbnailColor: '#4f46e5', promptKey: 'create landing page' },
    { id: 'tmpl_ecommerce', title: 'E-Commerce Storefront', category: 'Fullstack', description: 'Product catalogue, cart state & Stripe checkout workflow.', thumbnailColor: '#10b981', promptKey: 'make it an attractive e-commerce website landing page with light colors and theme' },
    { id: 'tmpl_crm', title: 'Enterprise CRM Suite', category: 'Enterprise', description: 'Analytics cards, lead table & customer backend API.', thumbnailColor: '#8b5cf6', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_auth', title: 'Authentication System', category: 'Fullstack', description: 'JWT sign-in card, OAuth providers & user schema.', thumbnailColor: '#06b6d4', promptKey: 'create login auth page' },
    { id: 'tmpl_portfolio', title: 'Developer Portfolio', category: 'Web', description: 'Showcase projects, tech stack badges & contact form.', thumbnailColor: '#ec4899', promptKey: 'create portfolio page' },
    { id: 'tmpl_blog', title: 'Tech Blog & CMS', category: 'Web', description: 'Markdown articles, category tags & RSS backend.', thumbnailColor: '#f59e0b', promptKey: 'create tech blog page' },
    { id: 'tmpl_chat', title: 'Realtime Messaging App', category: 'Fullstack', description: 'Chat rooms, direct messages & WebSocket relay.', thumbnailColor: '#3b82f6', promptKey: 'create realtime chat app page' },
    { id: 'tmpl_delivery', title: 'Food Delivery Platform', category: 'Fullstack', description: 'Restaurant listings, cart, driver tracking & orders.', thumbnailColor: '#ef4444', promptKey: 'create food delivery platform page' },
    { id: 'tmpl_hospital', title: 'Hospital Management', category: 'Enterprise', description: 'Patient records, doctor appointment booking & EMR.', thumbnailColor: '#14b8a6', promptKey: 'create hospital management page' },
  ];

  public getTemplates(category?: string): ProjectTemplate[] {
    if (!category) return [...this.templates];
    return this.templates.filter((t) => t.category === category);
  }

  public applyTemplate(templateId: string): string {
    const tmpl = this.templates.find((t) => t.id === templateId) || this.templates[1];
    return aiPromptEngine.executePrompt(tmpl.promptKey);
  }
}

export const projectTemplateEngine = new ProjectTemplateEngine();
