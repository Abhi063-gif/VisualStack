import { ComponentFactory } from '../../features/designer/components/factories/ComponentFactory';

export class VisualDesignAssistant {
  public createLandingPage(): string {
    // 1. Create Main Desktop Frame
    ComponentFactory.insertNode('Frame', {
      name: 'Landing Page Viewport',
      position: { x: 50, y: 50 },
      size: { width: 1200, height: 800 },
    });

    // 2. Navigation Header
    ComponentFactory.insertNode('Navbar', {
      name: 'Hero Navigation Bar',
      position: { x: 70, y: 70 },
      size: { width: 1160, height: 60 },
    });

    // 3. Hero Heading Title
    const heading = ComponentFactory.insertNode('Heading', {
      name: 'Main Hero Title',
      position: { x: 120, y: 170 },
      size: { width: 800, height: 60 },
    });
    heading.textContent = 'Build Modern Applications Visually with AI';

    // 4. Hero Subtitle Paragraph
    const sub = ComponentFactory.insertNode('Paragraph', {
      name: 'Hero Subtitle',
      position: { x: 120, y: 240 },
      size: { width: 700, height: 40 },
    });
    sub.textContent = 'VisualStack Studio seamlessly unites drag-and-drop UI design, backend logic workflows, and 1-click cloud deployment.';

    // 5. Primary Action Button
    const btn1 = ComponentFactory.insertNode('Button', {
      name: 'Primary CTA Button',
      position: { x: 120, y: 300 },
      size: { width: 180, height: 44 },
    });
    btn1.textContent = 'Get Started Free';

    // 6. Secondary Action Button
    const btn2 = ComponentFactory.insertNode('Button', {
      name: 'Secondary Button',
      position: { x: 320, y: 300 },
      size: { width: 180, height: 44 },
    });
    btn2.textContent = 'View Documentation';

    // 7. Feature Cards Section
    ComponentFactory.insertNode('Card', {
      name: 'Feature Card 1 - UI Designer',
      position: { x: 120, y: 380 },
      size: { width: 340, height: 200 },
    });

    ComponentFactory.insertNode('Card', {
      name: 'Feature Card 2 - Backend Engine',
      position: { x: 480, y: 380 },
      size: { width: 340, height: 200 },
    });

    ComponentFactory.insertNode('Card', {
      name: 'Feature Card 3 - DevOps Cloud',
      position: { x: 840, y: 380 },
      size: { width: 340, height: 200 },
    });

    return '[AI Visual Engine] Created Landing Page layout with 9 interactive elements on canvas.';
  }

  public createLoginScreen(): string {
    // 1. Create Login Frame
    ComponentFactory.insertNode('Frame', {
      name: 'Login Viewport',
      position: { x: 100, y: 50 },
      size: { width: 1000, height: 700 },
    });

    // 2. Auth Card Container
    ComponentFactory.insertNode('Card', {
      name: 'Authentication Card',
      position: { x: 380, y: 150 },
      size: { width: 440, height: 480 },
    });

    // 3. Login Heading
    const head = ComponentFactory.insertNode('Heading', {
      name: 'Auth Heading',
      position: { x: 420, y: 190 },
      size: { width: 360, height: 40 },
    });
    head.textContent = 'Welcome Back to VisualStack';

    // 4. Email Field Label & Input
    const email = ComponentFactory.insertNode('Input', {
      name: 'Email Address Input',
      position: { x: 420, y: 260 },
      size: { width: 360, height: 42 },
    });
    email.textContent = 'user@example.com';

    // 5. Password Field Input
    const pass = ComponentFactory.insertNode('Input', {
      name: 'Password Input',
      position: { x: 420, y: 330 },
      size: { width: 360, height: 42 },
    });
    pass.textContent = '••••••••••••';

    // 6. Sign In Button
    const btn = ComponentFactory.insertNode('Button', {
      name: 'Sign In Button',
      position: { x: 420, y: 400 },
      size: { width: 360, height: 44 },
    });
    btn.textContent = 'Sign In to Dashboard';

    return '[AI Visual Engine] Created Login Authentication screen layout with 6 canvas nodes.';
  }

  public createCRMDashboard(): string {
    // 1. Main Dashboard Frame
    ComponentFactory.insertNode('Frame', {
      name: 'CRM Dashboard Viewport',
      position: { x: 50, y: 50 },
      size: { width: 1280, height: 850 },
    });

    // 2. Sidebar Navigation
    ComponentFactory.insertNode('Sidebar', {
      name: 'Dashboard Navigation Sidebar',
      position: { x: 50, y: 50 },
      size: { width: 240, height: 850 },
    });

    // 3. Top Header Navbar
    ComponentFactory.insertNode('Navbar', {
      name: 'Header Navbar',
      position: { x: 290, y: 50 },
      size: { width: 1040, height: 60 },
    });

    // 4. Analytics Cards
    ComponentFactory.insertNode('Card', {
      name: 'Revenue Metric Card ($124,500)',
      position: { x: 310, y: 130 },
      size: { width: 310, height: 140 },
    });

    ComponentFactory.insertNode('Card', {
      name: 'Active Users Metric Card (14,200)',
      position: { x: 650, y: 130 },
      size: { width: 310, height: 140 },
    });

    ComponentFactory.insertNode('Card', {
      name: 'Conversion Rate Card (4.8%)',
      position: { x: 990, y: 130 },
      size: { width: 310, height: 140 },
    });

    return '[AI Visual Engine] Created CRM Dashboard layout with sidebar, navbar, and metric cards.';
  }
}

export const visualDesignAssistant = new VisualDesignAssistant();
