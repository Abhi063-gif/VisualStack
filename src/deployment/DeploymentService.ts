import type { DeploymentSession } from './DeploymentSession';
import { providerRegistry } from './providers/ProviderRegistry';
import { deploymentPipeline } from './DeploymentPipeline';

export class DeploymentService {
  public async executeDeployment(session: DeploymentSession): Promise<boolean> {
    const provider = providerRegistry.get(session.status.provider.toLowerCase()) || providerRegistry.get('vercel')!;

    session.status.state = 'building';
    await deploymentPipeline.executeStage(session, 'Source');
    await deploymentPipeline.executeStage(session, 'Build');
    await provider.build(session.projectId);

    session.status.state = 'packaging';
    await deploymentPipeline.executeStage(session, 'Package');

    session.status.state = 'containerizing';
    await deploymentPipeline.executeStage(session, 'Containerize');

    session.status.state = 'uploading';
    await deploymentPipeline.executeStage(session, 'Upload');

    session.status.state = 'deploying';
    await deploymentPipeline.executeStage(session, 'Deploy');
    const url = await provider.deploy(session);

    session.status.state = 'verifying';
    await deploymentPipeline.executeStage(session, 'Verify');
    await deploymentPipeline.executeStage(session, 'Notify');
    await deploymentPipeline.executeStage(session, 'Complete');

    session.status.state = 'success';
    session.status.deploymentUrl = url;
    session.status.completedAt = new Date().toISOString();
    return true;
  }
}

export const deploymentService = new DeploymentService();
