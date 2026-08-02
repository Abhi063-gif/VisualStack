import { graphManager } from '../graph/GraphManager';
import { ConnectionValidator } from './Validation';
import type { LogicPort } from './Port';

export class ConnectionManager {
  private portRegistry: Map<string, LogicPort> = new Map();

  public registerPort(nodeId: string, port: LogicPort): void {
    this.portRegistry.set(`${nodeId}:${port.id}`, port);
  }

  public unregisterNodePorts(nodeId: string): void {
    for (const key of this.portRegistry.keys()) {
      if (key.startsWith(`${nodeId}:`)) this.portRegistry.delete(key);
    }
  }

  public getPort(nodeId: string, portId: string): LogicPort | undefined {
    return this.portRegistry.get(`${nodeId}:${portId}`);
  }

  public tryConnect(
    connectionId: string,
    sourceNodeId: string,
    sourcePortId: string,
    targetNodeId: string,
    targetPortId: string
  ): { success: boolean; reason?: string } {
    const sourcePort = this.getPort(sourceNodeId, sourcePortId);
    const targetPort = this.getPort(targetNodeId, targetPortId);

    if (!sourcePort || !targetPort) {
      // Allow connection if ports aren't pre-registered (dynamic nodes)
      graphManager.createEdge(
        connectionId,
        sourceNodeId,
        sourcePortId,
        targetNodeId,
        targetPortId,
        'execution'
      );
      return { success: true };
    }

    const result = ConnectionValidator.canConnectPorts(sourcePort, targetPort);
    if (!result.valid) {
      return { success: false, reason: result.reason };
    }

    graphManager.createEdge(
      connectionId,
      sourceNodeId,
      sourcePortId,
      targetNodeId,
      targetPortId,
      sourcePort.type,
      sourcePort.dataType
    );
    return { success: true };
  }

  public disconnect(connectionId: string): void {
    graphManager.deleteEdge(connectionId);
  }
}

export const connectionManager = new ConnectionManager();
