import { ComponentFactory } from '../../features/designer/components/factories/ComponentFactory';
import { useSceneStore } from '../../stores/SceneStore';
import { useViewportStore } from '../../stores/ViewportStore';

export class VisualDesignAssistant {

  /**
   * Generates a professional SaaS Landing Page following layout hierarchy:
   * Page Viewport Frame -> Navigation Header -> Hero Banner -> Typography -> CTA Buttons -> Feature Cards -> Footer
   */
  public createLandingPage(): string {
    // 1. Create Page Viewport Frame
    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Landing Page (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: '#0e0f12', stroke: '#4f46e5', strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    // 2. Navigation Header (Full width bar)
    const navbar = ComponentFactory.insertNode('Navbar', {
      name: 'Hero Navigation Bar',
      position: { x: 70, y: 70 },
      size: { width: 1300, height: 64 },
    });
    navbar.updateStyle({ fill: '#14161b', stroke: '#232733', strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(navbar);

    // 3. Hero Banner Container
    const heroSection = ComponentFactory.insertNode('Section', {
      name: 'Main Hero Section',
      position: { x: 70, y: 154 },
      size: { width: 1300, height: 340 },
    });
    heroSection.updateStyle({ fill: '#161922', stroke: '#31374a', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(heroSection);

    // 4. Hero Title Heading
    const title = ComponentFactory.insertNode('Heading', {
      name: 'Main Hero Title',
      position: { x: 120, y: 194 },
      size: { width: 900, height: 60 },
    });
    title.textContent = 'Build Autonomous Fullstack Applications with AI';
    title.updateStyle({ fill: '#ffffff', fontSize: 32, fontWeight: 700, fontFamily: 'Inter' });
    useSceneStore.getState().upsertNode(title);

    // 5. Hero Subtitle Paragraph
    const subtitle = ComponentFactory.insertNode('Paragraph', {
      name: 'Hero Subtitle',
      position: { x: 120, y: 264 },
      size: { width: 850, height: 50 },
    });
    subtitle.textContent = 'VisualStack Studio seamlessly unifies drag-and-drop UI design, React Flow backend logic, database schemas, and 1-click cloud deployment.';
    subtitle.updateStyle({ fill: '#9ca3af', fontSize: 16, fontWeight: 400, fontFamily: 'Inter' });
    useSceneStore.getState().upsertNode(subtitle);

    // 6. Primary Action Button
    const btnPrimary = ComponentFactory.insertNode('Button', {
      name: 'Primary CTA Button',
      position: { x: 120, y: 334 },
      size: { width: 190, height: 46 },
    });
    btnPrimary.textContent = 'Get Started Free';
    btnPrimary.updateStyle({ fill: '#4f46e5', stroke: '#6366f1', strokeWidth: 1, cornerRadius: 8, fontSize: 14, fontWeight: 600 });
    useSceneStore.getState().upsertNode(btnPrimary);

    // 7. Secondary Action Button
    const btnSecondary = ComponentFactory.insertNode('Button', {
      name: 'Secondary Button',
      position: { x: 330, y: 334 },
      size: { width: 190, height: 46 },
    });
    btnSecondary.textContent = 'View Documentation';
    btnSecondary.updateStyle({ fill: '#1f232d', stroke: '#374151', strokeWidth: 1, cornerRadius: 8, fontSize: 14, fontWeight: 500 });
    useSceneStore.getState().upsertNode(btnSecondary);

    // 8. Feature Cards Section
    const cardWidth = 410;
    const card1 = ComponentFactory.insertNode('Card', {
      name: 'Feature Card 1 - UI Designer',
      position: { x: 70, y: 514 },
      size: { width: cardWidth, height: 210 },
    });
    card1.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card1);

    const card2 = ComponentFactory.insertNode('Card', {
      name: 'Feature Card 2 - Backend Engine',
      position: { x: 515, y: 514 },
      size: { width: cardWidth, height: 210 },
    });
    card2.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card2);

    const card3 = ComponentFactory.insertNode('Card', {
      name: 'Feature Card 3 - DevOps Cloud',
      position: { x: 960, y: 514 },
      size: { width: cardWidth, height: 210 },
    });
    card3.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card3);

    // 9. Sync Scene Store & Reset Viewport Camera to Focus Page
    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return '[AI Visual Engine] Created SaaS Landing Page hierarchy (Page Frame -> Navbar -> Hero -> CTA Buttons -> Feature Grid) with styled tokens.';
  }

  /**
   * Generates a professional Authentication Login Page layout.
   */
  public createLoginScreen(): string {
    // 1. Create Page Viewport Frame
    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'Auth Page (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: '#0e0f12', stroke: '#4f46e5', strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    // 2. Auth Card Container
    const card = ComponentFactory.insertNode('Card', {
      name: 'Authentication Card',
      position: { x: 490, y: 160 },
      size: { width: 460, height: 520 },
    });
    card.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 16 });
    useSceneStore.getState().upsertNode(card);

    // 3. Login Heading
    const head = ComponentFactory.insertNode('Heading', {
      name: 'Auth Heading',
      position: { x: 530, y: 210 },
      size: { width: 380, height: 40 },
    });
    head.textContent = 'Welcome Back to VisualStack';
    head.updateStyle({ fill: '#ffffff', fontSize: 24, fontWeight: 700 });
    useSceneStore.getState().upsertNode(head);

    // 4. Subtitle
    const sub = ComponentFactory.insertNode('Paragraph', {
      name: 'Auth Subtitle',
      position: { x: 530, y: 255 },
      size: { width: 380, height: 30 },
    });
    sub.textContent = 'Sign in to access your projects and deployment pipelines.';
    sub.updateStyle({ fill: '#9ca3af', fontSize: 13 });
    useSceneStore.getState().upsertNode(sub);

    // 5. Email Input
    const email = ComponentFactory.insertNode('Input', {
      name: 'Email Address Input',
      position: { x: 530, y: 310 },
      size: { width: 380, height: 44 },
    });
    email.textContent = 'developer@visualstack.io';
    email.updateStyle({ fill: '#101216', stroke: '#31374a', strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(email);

    // 6. Password Input
    const pass = ComponentFactory.insertNode('Input', {
      name: 'Password Input',
      position: { x: 530, y: 380 },
      size: { width: 380, height: 44 },
    });
    pass.textContent = '••••••••••••••••';
    pass.updateStyle({ fill: '#101216', stroke: '#31374a', strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(pass);

    // 7. Sign In Button
    const btn = ComponentFactory.insertNode('Button', {
      name: 'Sign In Button',
      position: { x: 530, y: 460 },
      size: { width: 380, height: 46 },
    });
    btn.textContent = 'Sign In to Dashboard';
    btn.updateStyle({ fill: '#4f46e5', stroke: '#6366f1', strokeWidth: 1, cornerRadius: 8, fontSize: 15, fontWeight: 600 });
    useSceneStore.getState().upsertNode(btn);

    // 8. Sync Scene Store & Reset Viewport Camera
    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return '[AI Visual Engine] Created Login Auth Screen hierarchy (Page Frame -> Auth Card -> Inputs -> Button) with styled tokens.';
  }

  /**
   * Generates a professional CRM Enterprise Dashboard.
   */
  public createCRMDashboard(): string {
    // 1. Create Page Viewport Frame
    const pageFrame = ComponentFactory.insertNode('Frame', {
      name: 'CRM Dashboard Page (1440 x 900)',
      position: { x: 40, y: 40 },
      size: { width: 1360, height: 860 },
    });
    pageFrame.updateStyle({ fill: '#0e0f12', stroke: '#4f46e5', strokeWidth: 2, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(pageFrame);

    // 2. Sidebar Navigation
    const sidebar = ComponentFactory.insertNode('Sidebar', {
      name: 'Dashboard Navigation Sidebar',
      position: { x: 70, y: 70 },
      size: { width: 240, height: 800 },
    });
    sidebar.updateStyle({ fill: '#14161b', stroke: '#232733', strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(sidebar);

    // 3. Top Header Navbar
    const navbar = ComponentFactory.insertNode('Navbar', {
      name: 'Header Navbar',
      position: { x: 330, y: 70 },
      size: { width: 1040, height: 60 },
    });
    navbar.updateStyle({ fill: '#14161b', stroke: '#232733', strokeWidth: 1, cornerRadius: 8 });
    useSceneStore.getState().upsertNode(navbar);

    // 4. Analytics Metric Cards
    const cardW = 330;
    const card1 = ComponentFactory.insertNode('Card', {
      name: 'Total Revenue ($124,500)',
      position: { x: 330, y: 150 },
      size: { width: cardW, height: 140 },
    });
    card1.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card1);

    const card2 = ComponentFactory.insertNode('Card', {
      name: 'Active Customers (14,200)',
      position: { x: 685, y: 150 },
      size: { width: cardW, height: 140 },
    });
    card2.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card2);

    const card3 = ComponentFactory.insertNode('Card', {
      name: 'Conversion Rate (4.8%)',
      position: { x: 1040, y: 150 },
      size: { width: cardW, height: 140 },
    });
    card3.updateStyle({ fill: '#161922', stroke: '#282e3e', strokeWidth: 1, cornerRadius: 12 });
    useSceneStore.getState().upsertNode(card3);

    // 5. Sync Scene Store & Reset Viewport Camera
    useSceneStore.getState().syncFromSceneGraph();
    useViewportStore.getState().setCamera(0, 0, 0.85);

    return '[AI Visual Engine] Created Enterprise CRM Dashboard layout with sidebar, navbar, and metric cards.';
  }
}

export const visualDesignAssistant = new VisualDesignAssistant();
