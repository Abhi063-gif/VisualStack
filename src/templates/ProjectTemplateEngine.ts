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
    // Fullstack Apps
    { id: 'tmpl_blank', title: 'Blank Project', category: 'Fullstack', description: 'Clean canvas for custom frontend & backend development.', thumbnailColor: '#3b82f6', promptKey: 'create blank page' },
    { id: 'tmpl_ecommerce', title: 'E-Commerce Storefront', category: 'Fullstack', description: 'Product catalogue, cart state & Stripe checkout workflow.', thumbnailColor: '#10b981', promptKey: 'make it an attractive e-commerce website landing page with light colors and theme' },
    { id: 'tmpl_auth', title: 'Authentication System', category: 'Fullstack', description: 'JWT sign-in card, OAuth providers & user schema.', thumbnailColor: '#06b6d4', promptKey: 'create login auth page' },
    { id: 'tmpl_chat', title: 'Realtime Messaging App', category: 'Fullstack', description: 'Chat rooms, direct messages & WebSocket relay.', thumbnailColor: '#3b82f6', promptKey: 'create realtime chat app page' },
    { id: 'tmpl_delivery', title: 'Food Delivery Platform', category: 'Fullstack', description: 'Restaurant listings, cart, driver tracking & orders.', thumbnailColor: '#ef4444', promptKey: 'create food delivery platform page' },
    { id: 'tmpl_saas_billing', title: 'SaaS Subscription Portal', category: 'Fullstack', description: 'Stripe tier checkout, billing invoices & team seats management.', thumbnailColor: '#6366f1', promptKey: 'create landing page' },
    { id: 'tmpl_social_feed', title: 'Social Network Feed', category: 'Fullstack', description: 'User posts feed, likes, comments & notifications API.', thumbnailColor: '#ec4899', promptKey: 'create landing page' },
    { id: 'tmpl_lms_courses', title: 'Learning Management System (LMS)', category: 'Fullstack', description: 'Video course player, quiz modules & student progress tracking.', thumbnailColor: '#8b5cf6', promptKey: 'create landing page' },
    { id: 'tmpl_job_board', title: 'Tech Job Board Portal', category: 'Fullstack', description: 'Company job postings, resume uploader & candidate filter.', thumbnailColor: '#14b8a6', promptKey: 'create landing page' },
    { id: 'tmpl_marketplace_multi', name: 'Multi-Vendor Marketplace', category: 'Fullstack', description: 'Vendor stores, payout split, reviews & order management.', thumbnailColor: '#f59e0b', promptKey: 'make it an attractive e-commerce website landing page with light colors and theme' } as any,

    // Web Apps & Sites
    { id: 'tmpl_landing', title: 'SaaS Landing Page', category: 'Web', description: 'Sleek hero section, feature grid, pricing cards & CTA footer.', thumbnailColor: '#4f46e5', promptKey: 'create landing page' },
    { id: 'tmpl_portfolio', title: 'Developer Portfolio', category: 'Web', description: 'Showcase projects, tech stack badges & contact form.', thumbnailColor: '#ec4899', promptKey: 'create portfolio page' },
    { id: 'tmpl_blog', title: 'Tech Blog & CMS', category: 'Web', description: 'Markdown articles, category tags & RSS backend.', thumbnailColor: '#f59e0b', promptKey: 'create tech blog page' },
    { id: 'tmpl_agency', title: 'Creative Agency Showcase', category: 'Web', description: 'Interactive case studies, video hero background & client logos.', thumbnailColor: '#06b6d4', promptKey: 'create landing page' },
    { id: 'tmpl_event_conference', title: 'Tech Conference & Summit', category: 'Web', description: 'Speaker schedule, ticket booking & venue map.', thumbnailColor: '#ef4444', promptKey: 'create landing page' },
    { id: 'tmpl_crypto_exchange', title: 'Web3 Crypto Dashboard', category: 'Web', description: 'Realtime token price chart, wallet connect & swap interface.', thumbnailColor: '#10b981', promptKey: 'create landing page' },
    { id: 'tmpl_restaurant_menu', title: 'Restaurant & Bistro Website', category: 'Web', description: 'Online menu, table reservation modal & customer reviews.', thumbnailColor: '#d97706', promptKey: 'create landing page' },
    { id: 'tmpl_realestate', title: 'Real Estate Property Portal', category: 'Web', description: 'Interactive map search, property filters & agent booking.', thumbnailColor: '#0284c7', promptKey: 'create landing page' },
    { id: 'tmpl_podcast_player', title: 'Podcast Streaming Station', category: 'Web', description: 'Audio episode player, playlist queue & RSS feed parser.', thumbnailColor: '#a855f7', promptKey: 'create landing page' },
    { id: 'tmpl_crowdfunding', title: 'Crowdfunding Launchpad', category: 'Web', description: 'Campaign funding bar, backer rewards & project story.', thumbnailColor: '#10b981', promptKey: 'create landing page' },

    // Enterprise Systems
    { id: 'tmpl_crm', title: 'Enterprise CRM Suite', category: 'Enterprise', description: 'Analytics cards, lead table & customer backend API.', thumbnailColor: '#8b5cf6', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_hospital', title: 'Hospital Management (EMR)', category: 'Enterprise', description: 'Patient records, doctor appointment booking & pharmacy inventory.', thumbnailColor: '#14b8a6', promptKey: 'create hospital management page' },
    { id: 'tmpl_erp_inventory', title: 'ERP Supply Chain & Inventory', category: 'Enterprise', description: 'Warehouse stock tracking, purchase orders & vendor ledger.', thumbnailColor: '#3b82f6', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_hrm_payroll', title: 'HRM & Employee Payroll Portal', category: 'Enterprise', description: 'Employee attendance, leave requests & monthly salary slips.', thumbnailColor: '#6366f1', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_fintech_banking', title: 'Fintech Core Banking Suite', category: 'Enterprise', description: 'Multi-currency accounts, wire transfers & fraud detection rules.', thumbnailColor: '#059669', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_school_portal', title: 'K-12 School & Campus System', category: 'Enterprise', description: 'Student report cards, teacher gradebook & fee collection.', thumbnailColor: '#d97706', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_hotel_booking', title: 'Hotel & Resort Booking Engine', category: 'Enterprise', description: 'Room availability calendar, guest check-in & housekeeping status.', thumbnailColor: '#0284c7', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_helpdesk', title: 'Customer Support Helpdesk', category: 'Enterprise', description: 'Ticket queue, SLA timer, automated email responses & KB.', thumbnailColor: '#ec4899', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_logistics_fleet', title: 'Logistics & Fleet GPS Tracker', category: 'Enterprise', description: 'Real-time vehicle GPS tracking, route planner & fuel logs.', thumbnailColor: '#84cc16', promptKey: 'create CRM dashboard' },
    { id: 'tmpl_devops_monitor', title: 'Cloud DevOps APM Monitor', category: 'Enterprise', description: 'Server metrics CPU/RAM, cluster health & alert webhooks.', thumbnailColor: '#6366f1', promptKey: 'create CRM dashboard' },

    // Mobile Responsive Apps
    { id: 'tmpl_mobile_fitness', title: 'Fitness Workout Tracker App', category: 'Mobile', description: 'Calorie counter, exercise logs & daily activity rings.', thumbnailColor: '#ef4444', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_ride', title: 'Ride Sharing Taxi App UI', category: 'Mobile', description: 'Live driver tracking, fare calculation & payment sheet.', thumbnailColor: '#10b981', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_wallet', title: 'Mobile Payment Wallet App', category: 'Mobile', description: 'Scan QR code to pay, transaction history & virtual card.', thumbnailColor: '#3b82f6', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_music', title: 'Music & Audio Player App', category: 'Mobile', description: 'Now playing screen, equalizer & offline playlists.', thumbnailColor: '#8b5cf6', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_recipe', title: 'Smart Recipe & Cooking App', category: 'Mobile', description: 'Ingredient checklist, step-by-step timer & nutrition facts.', thumbnailColor: '#f59e0b', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_weather', title: 'Live Weather Forecast App', category: 'Mobile', description: 'Hourly radar map, precipitation warnings & 10-day forecast.', thumbnailColor: '#06b6d4', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_dating', title: 'Match & Dating Social App', category: 'Mobile', description: 'Swipe profile cards, instant match modal & direct chat.', thumbnailColor: '#ec4899', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_task', title: 'Taskmaster To-Do & Reminders', category: 'Mobile', description: 'Kanban boards, priority labels & push notifications.', thumbnailColor: '#10b981', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_news', title: 'Daily News Reader & Magazine', category: 'Mobile', description: 'Trending news feed, audio read-aloud & bookmarking.', thumbnailColor: '#64748b', promptKey: 'create landing page' },
    { id: 'tmpl_mobile_meditation', title: 'Mindfulness & Meditation App', category: 'Mobile', description: 'Guided breathing timer, sleep ambient sounds & mood log.', thumbnailColor: '#14b8a6', promptKey: 'create landing page' },
  ];

  public getTemplates(category?: string): ProjectTemplate[] {
    if (!category || category === 'All') return [...this.templates];
    return this.templates.filter((t) => t.category === category);
  }

  public applyTemplate(templateId: string): string {
    const tmpl = this.templates.find((t) => t.id === templateId) || this.templates[1];
    return aiPromptEngine.executePrompt(tmpl.promptKey);
  }
}

export const projectTemplateEngine = new ProjectTemplateEngine();
