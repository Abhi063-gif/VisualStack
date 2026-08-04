export interface PropertyMutation {
  nodeId: string;
  property: string;
  value: any;
  timestamp: number;
  sessionId: string;
}

export class ConflictResolver {
  private propertyTimestamps: Map<string, number> = new Map();

  public resolveMutation(mutation: PropertyMutation): boolean {
    const key = `${mutation.nodeId}:${mutation.property}`;
    const lastTime = this.propertyTimestamps.get(key) || 0;

    if (mutation.timestamp >= lastTime) {
      this.propertyTimestamps.set(key, mutation.timestamp);
      return true; // Apply mutation
    }
    return false; // Reject outdated mutation
  }
}

export const conflictResolver = new ConflictResolver();
