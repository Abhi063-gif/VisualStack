import { BaseDeploymentProvider } from './BaseDeploymentProvider';
import type { IDeploymentProvider } from './IDeploymentProvider';

export class VercelProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'vercel', 'Vercel', 'serverless',
      'Instant global serverless deployment for React, Next.js, and static frontends.',
      'triangle',
      [
        { key: 'vercelToken', label: 'Vercel API Token', type: 'password', required: true, placeholder: 'vcl_...' },
        { key: 'teamId', label: 'Vercel Team ID', type: 'text', required: false, placeholder: 'team_...' },
        { key: 'framework', label: 'Framework Preset', type: 'select', required: true, defaultValue: 'nextjs', options: ['nextjs', 'vite', 'create-react-app'] },
      ]
    );
  }
  public override getDefaultBuildCommand(): string { return 'npx next build || npm run build'; }
}

export class NetlifyProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'netlify', 'Netlify', 'static',
      'Automated web publishing, serverless functions, and edge rules.',
      'globe',
      [
        { key: 'netlifyToken', label: 'Netlify Personal Access Token', type: 'password', required: true, placeholder: 'nfp_...' },
        { key: 'siteId', label: 'Site API ID', type: 'text', required: false, placeholder: 'site-uuid' },
      ]
    );
  }
  public override getDefaultBuildCommand(): string { return 'npm run build'; }
}

export class RailwayProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'railway', 'Railway', 'cloud',
      'Instant infrastructure cloud for full-stack apps and databases.',
      'server',
      [
        { key: 'railwayToken', label: 'Railway API Token', type: 'password', required: true },
        { key: 'environment', label: 'Environment', type: 'select', required: true, defaultValue: 'production', options: ['production', 'staging'] },
      ]
    );
  }
}

export class FirebaseProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'firebase', 'Firebase Hosting', 'static',
      'Fast and secure hosting for web apps, microservices, and static assets.',
      'flame',
      [
        { key: 'projectId', label: 'Firebase Project ID', type: 'text', required: true },
        { key: 'ciToken', label: 'Firebase CI Token', type: 'password', required: true },
      ]
    );
  }
}

export class CloudflareProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'cloudflare', 'Cloudflare Pages', 'static',
      'JAMstack platform for frontend developers to collaborate and deploy websites.',
      'cloud-lightning',
      [
        { key: 'apiToken', label: 'Cloudflare API Token', type: 'password', required: true },
        { key: 'accountId', label: 'Account ID', type: 'text', required: true },
        { key: 'projectName', label: 'Pages Project Name', type: 'text', required: true },
      ]
    );
  }
}

export class AWSAmplifyProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'aws-amplify', 'AWS Amplify', 'cloud',
      'Complete platform to build and host full-stack applications on AWS.',
      'aws',
      [
        { key: 'appId', label: 'Amplify App ID', type: 'text', required: true },
        { key: 'accessKeyId', label: 'AWS Access Key ID', type: 'text', required: true },
        { key: 'secretAccessKey', label: 'AWS Secret Access Key', type: 'password', required: true },
        { key: 'region', label: 'AWS Region', type: 'select', required: true, defaultValue: 'us-east-1', options: ['us-east-1', 'us-west-2', 'eu-central-1'] },
      ]
    );
  }
}

export class AWSEC2Provider extends BaseDeploymentProvider {
  constructor() {
    super(
      'aws-ec2', 'AWS EC2 Container', 'vps',
      'Deploy containerized Docker instances directly to Amazon EC2 virtual servers.',
      'cpu',
      [
        { key: 'instanceIp', label: 'EC2 IPv4 Public IP', type: 'text', required: true },
        { key: 'sshUser', label: 'SSH User', type: 'text', required: true, defaultValue: 'ec2-user' },
        { key: 'privateKey', label: 'SSH Private Key (.pem)', type: 'password', required: true },
      ]
    );
  }
}

export class AWSS3Provider extends BaseDeploymentProvider {
  constructor() {
    super(
      'aws-s3', 'AWS S3 + CloudFront', 'static',
      'High performance static web hosting with AWS CloudFront global CDN distribution.',
      'bucket',
      [
        { key: 'bucketName', label: 'S3 Bucket Name', type: 'text', required: true },
        { key: 'distributionId', label: 'CloudFront Distribution ID', type: 'text', required: false },
      ]
    );
  }
}

export class AzureAppServiceProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'azure-appservice', 'Azure App Service', 'cloud',
      'Fully managed HTTP-based service for hosting web applications.',
      'azure',
      [
        { key: 'appName', label: 'App Service Name', type: 'text', required: true },
        { key: 'publishProfile', label: 'Publish Profile XML', type: 'password', required: true },
      ]
    );
  }
}

export class GoogleCloudRunProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'google-cloudrun', 'Google Cloud Run', 'container',
      'Serverless container platform on Google Cloud infrastructure.',
      'gcp',
      [
        { key: 'projectId', label: 'GCP Project ID', type: 'text', required: true },
        { key: 'serviceAccountKey', label: 'Service Account JSON Key', type: 'password', required: true },
        { key: 'region', label: 'GCP Region', type: 'select', required: true, defaultValue: 'us-central1', options: ['us-central1', 'europe-west1', 'asia-east1'] },
      ]
    );
  }
}

export class DockerProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'docker', 'Docker Engine Host', 'container',
      'Deploy custom Docker images directly to local or remote Docker engines.',
      'box',
      [
        { key: 'hostUrl', label: 'Docker Host Socket / URL', type: 'text', required: true, defaultValue: 'tcp://localhost:2375' },
        { key: 'imageTag', label: 'Container Image Tag', type: 'text', required: true, defaultValue: 'latest' },
      ]
    );
  }
}

export class DigitalOceanProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'digitalocean', 'DigitalOcean App Platform', 'cloud',
      'Platform-as-a-Service (PaaS) to build, deploy, and scale web applications.',
      'droplet',
      [
        { key: 'apiToken', label: 'DigitalOcean Personal Access Token', type: 'password', required: true },
        { key: 'appName', label: 'App Spec Name', type: 'text', required: true },
      ]
    );
  }
}

export class RenderProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'render', 'Render', 'cloud',
      'Unified cloud to build and run all your apps and websites with free SSL.',
      'layout-grid',
      [
        { key: 'apiKey', label: 'Render API Key', type: 'password', required: true },
        { key: 'serviceId', label: 'Web Service ID', type: 'text', required: true },
      ]
    );
  }
}

export class FlyIoProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'flyio', 'Fly.io', 'container',
      'Run full-stack apps and databases close to your users worldwide.',
      'paperplane',
      [
        { key: 'authAuthToken', label: 'Fly.io API Auth Token', type: 'password', required: true },
        { key: 'appName', label: 'Fly App Name', type: 'text', required: true },
      ]
    );
  }
}

export class HostingerProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'hostinger', 'Hostinger VPS', 'vps',
      'Linux VPS deployment with SSH remote automation and Nginx web server.',
      'server',
      [
        { key: 'serverIp', label: 'Hostinger VPS IP Address', type: 'text', required: true },
        { key: 'sshPassword', label: 'SSH Password / Private Key', type: 'password', required: true },
      ]
    );
  }
}

export class CustomVPSProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'custom-vps', 'Custom Linux VPS', 'vps',
      'Generic Linux server deployment via SSH with automated systemd and reverse proxy setup.',
      'terminal',
      [
        { key: 'serverHost', label: 'Hostname / IP', type: 'text', required: true },
        { key: 'sshPort', label: 'SSH Port', type: 'text', required: true, defaultValue: '22' },
        { key: 'authMethod', label: 'Auth Method', type: 'select', required: true, defaultValue: 'key', options: ['key', 'password'] },
        { key: 'sshSecret', label: 'Password / Private Key', type: 'password', required: true },
      ]
    );
  }
}

export class GitHubPagesProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'github-pages', 'GitHub Pages', 'static',
      'Host static websites directly from a GitHub repository gh-pages branch.',
      'github',
      [
        { key: 'repoUrl', label: 'GitHub Repository', type: 'text', required: true, defaultValue: 'Abhi063-gif/VisualStack' },
        { key: 'branch', label: 'Target Branch', type: 'text', required: true, defaultValue: 'gh-pages' },
      ]
    );
  }
}

export class LocalServerProvider extends BaseDeploymentProvider {
  constructor() {
    super(
      'local-server', 'Local Server', 'vps',
      'Local development server host running directly on localhost.',
      'hard-drive',
      [
        { key: 'port', label: 'Local Port', type: 'text', required: true, defaultValue: '8080' },
      ]
    );
  }
}

export class ProviderRegistry {
  private providers: Map<string, IDeploymentProvider> = new Map();

  constructor() {
    this.register(new VercelProvider());
    this.register(new NetlifyProvider());
    this.register(new RailwayProvider());
    this.register(new FirebaseProvider());
    this.register(new CloudflareProvider());
    this.register(new AWSAmplifyProvider());
    this.register(new AWSEC2Provider());
    this.register(new AWSS3Provider());
    this.register(new AzureAppServiceProvider());
    this.register(new GoogleCloudRunProvider());
    this.register(new DockerProvider());
    this.register(new DigitalOceanProvider());
    this.register(new RenderProvider());
    this.register(new FlyIoProvider());
    this.register(new HostingerProvider());
    this.register(new CustomVPSProvider());
    this.register(new GitHubPagesProvider());
    this.register(new LocalServerProvider());
  }

  public register(provider: IDeploymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  public get(id: string): IDeploymentProvider | undefined {
    return this.providers.get(id);
  }

  public getAll(): IDeploymentProvider[] {
    return Array.from(this.providers.values());
  }

  public getByCategory(category: 'cloud' | 'serverless' | 'container' | 'vps' | 'static'): IDeploymentProvider[] {
    return this.getAll().filter((p) => p.category === category);
  }
}

export const providerRegistry = new ProviderRegistry();
