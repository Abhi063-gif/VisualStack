import { BaseDeploymentProvider } from './BaseDeploymentProvider';
import type { IDeploymentProvider } from './IDeploymentProvider';

export class VercelProvider extends BaseDeploymentProvider {
  constructor() { super('vercel', 'Vercel', 'serverless'); }
}

export class NetlifyProvider extends BaseDeploymentProvider {
  constructor() { super('netlify', 'Netlify', 'static'); }
}

export class RailwayProvider extends BaseDeploymentProvider {
  constructor() { super('railway', 'Railway', 'cloud'); }
}

export class FirebaseProvider extends BaseDeploymentProvider {
  constructor() { super('firebase', 'Firebase Hosting', 'static'); }
}

export class CloudflareProvider extends BaseDeploymentProvider {
  constructor() { super('cloudflare', 'Cloudflare Pages', 'static'); }
}

export class AWSAmplifyProvider extends BaseDeploymentProvider {
  constructor() { super('aws-amplify', 'AWS Amplify', 'cloud'); }
}

export class AWSEC2Provider extends BaseDeploymentProvider {
  constructor() { super('aws-ec2', 'AWS EC2 Container', 'vps'); }
}

export class AWSS3Provider extends BaseDeploymentProvider {
  constructor() { super('aws-s3', 'AWS S3 + CloudFront', 'static'); }
}

export class AzureAppServiceProvider extends BaseDeploymentProvider {
  constructor() { super('azure-appservice', 'Azure App Service', 'cloud'); }
}

export class GoogleCloudRunProvider extends BaseDeploymentProvider {
  constructor() { super('google-cloudrun', 'Google Cloud Run', 'container'); }
}

export class DockerProvider extends BaseDeploymentProvider {
  constructor() { super('docker', 'Docker Engine Host', 'container'); }
}

export class DigitalOceanProvider extends BaseDeploymentProvider {
  constructor() { super('digitalocean', 'DigitalOcean App Platform', 'cloud'); }
}

export class RenderProvider extends BaseDeploymentProvider {
  constructor() { super('render', 'Render', 'cloud'); }
}

export class FlyIoProvider extends BaseDeploymentProvider {
  constructor() { super('flyio', 'Fly.io', 'container'); }
}

export class HostingerProvider extends BaseDeploymentProvider {
  constructor() { super('hostinger', 'Hostinger VPS', 'vps'); }
}

export class CustomVPSProvider extends BaseDeploymentProvider {
  constructor() { super('custom-vps', 'Custom Linux VPS', 'vps'); }
}

export class GitHubPagesProvider extends BaseDeploymentProvider {
  constructor() { super('github-pages', 'GitHub Pages', 'static'); }
}

export class LocalServerProvider extends BaseDeploymentProvider {
  constructor() { super('local-server', 'Local Server', 'vps'); }
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
}

export const providerRegistry = new ProviderRegistry();
