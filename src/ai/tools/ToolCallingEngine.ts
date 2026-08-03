import { gitManager } from '../../deployment/git/GitManager';
import { deploymentCenter } from '../../deployment/DeploymentCenter';
import { dockerManager } from '../../deployment/docker/DockerManager';
import { secretsVault } from '../../deployment/security/SecretsVault';
import { domainManager } from '../../deployment/domain/DomainManager';

export interface ExecutableTool {
  name: string;
  description: string;
  category: 'git' | 'deployment' | 'docker' | 'secrets' | 'domain' | 'compiler';
  execute: (args: Record<string, any>) => Promise<string>;
}

export class ToolCallingEngine {
  private tools: Map<string, ExecutableTool> = new Map();

  constructor() {
    this.registerCoreTools();
  }

  private registerCoreTools(): void {
    // Git Tools
    this.registerTool({
      name: 'git_commit',
      description: 'Commits staged files with a commit message',
      category: 'git',
      execute: async ({ message, isAmend }) => {
        const item = gitManager.commit(message, isAmend);
        return `Committed [${item.shortHash}] "${item.message}".`;
      },
    });

    this.registerTool({
      name: 'git_push',
      description: 'Pushes commits to the remote git origin repository',
      category: 'git',
      execute: async () => {
        gitManager.push();
        return `Pushed commits to ${gitManager.getRemoteUrl()} (${gitManager.getCurrentBranch()}).`;
      },
    });

    // Deployment Tools
    this.registerTool({
      name: 'deploy_app',
      description: 'Triggers deployment to target cloud provider',
      category: 'deployment',
      execute: async ({ provider, environment }) => {
        const session = await deploymentCenter.createDeployment('visualstack-app', provider || 'vercel', environment || 'production');
        return `Deployment session [${session.id}] initiated on ${session.status.provider} (${session.status.targetEnvironment}). State: ${session.status.state}.`;
      },
    });

    // Docker Tools
    this.registerTool({
      name: 'build_docker_container',
      description: 'Builds and runs a Docker container',
      category: 'docker',
      execute: async ({ name, ports }) => {
        const cnt = await dockerManager.buildAndRunContainer(name || 'visualstack-app', 'visualstack/prod:v1', ports || '8080:8080');
        return `Container [${cnt.name}] built & running on ports ${cnt.ports}.`;
      },
    });

    // Secrets Vault Tools
    this.registerTool({
      name: 'set_secret',
      description: 'Encrypts and saves an API key or secret token into vault',
      category: 'secrets',
      execute: async ({ key, value, category, environment }) => {
        secretsVault.setSecret(key, value, category || 'api_key', environment || 'production');
        return `Secret [${key}] encrypted and saved in [${environment || 'production'}] vault.`;
      },
    });

    // Custom Domain Tools
    this.registerTool({
      name: 'add_custom_domain',
      description: 'Adds and configures a custom domain with Let\'s Encrypt SSL',
      category: 'domain',
      execute: async ({ domain, environment }) => {
        const item = domainManager.addDomain(domain, environment || 'production');
        return `Custom domain [${item.domain}] registered. Required CNAME: cname.visualstack-dns.com.`;
      },
    });
  }

  public registerTool(tool: ExecutableTool): void {
    this.tools.set(tool.name, tool);
  }

  public getTools(): ExecutableTool[] {
    return Array.from(this.tools.values());
  }

  public async executeToolCall(name: string, args: Record<string, any>): Promise<string> {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Tool [${name}] not found in ToolCallingEngine.`);
    }
    return await tool.execute(args);
  }
}

export const toolCallingEngine = new ToolCallingEngine();
