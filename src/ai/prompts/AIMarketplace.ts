export interface AIPackItem {
  id: string;
  name: string;
  author: string;
  downloads: number;
  rating: number;
  category: 'agent' | 'prompt_pack' | 'workflow_template';
  description: string;
}

export class AIMarketplace {
  private packs: AIPackItem[] = [
    { id: 'pack_next_architect', name: 'Next.js App Router Architect Pack', author: 'VisualStack Team', downloads: 14200, rating: 4.9, category: 'prompt_pack', description: 'Complete prompt suite for generating Next.js 14 server components, actions, and routes.' },
    { id: 'pack_docker_devops', name: 'Docker & Kubernetes DevOps Agent', author: 'DevOps Guild', downloads: 9800, rating: 4.8, category: 'agent', description: 'Autonomous agent specialized in Dockerizing apps and generating Helm charts.' },
    { id: 'pack_stripe_flow', name: 'Stripe Billing & Subscription Workflow', author: 'FinTech Labs', downloads: 7600, rating: 4.9, category: 'workflow_template', description: 'Ready-to-use React Flow workflow for recurring subscriptions & webhook handlers.' },
  ];

  public getPacks(): AIPackItem[] {
    return [...this.packs];
  }
}

export const aiMarketplace = new AIMarketplace();
