export interface IService {
  name?: string;
  initialize?: () => Promise<void>;
  dispose?: () => Promise<void>;
}

export type ServiceIdentifier<T> = string | (new (...args: any[]) => T);

export class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();

  private constructor() {}

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private getKey<T>(id: ServiceIdentifier<T>): string {
    return typeof id === 'string' ? id : id.name;
  }

  public registerSingleton<T>(id: ServiceIdentifier<T>, instance: T): void {
    const key = this.getKey(id);
    this.services.set(key, instance);
  }

  public registerFactory<T>(id: ServiceIdentifier<T>, factory: () => T): void {
    const key = this.getKey(id);
    this.factories.set(key, factory);
  }

  public get<T>(id: ServiceIdentifier<T>): T {
    const key = this.getKey(id);

    if (this.services.has(key)) {
      return this.services.get(key);
    }

    if (this.factories.has(key)) {
      const instance = this.factories.get(key)!();
      this.services.set(key, instance);
      return instance;
    }

    throw new Error(`Service [${key}] not registered in ServiceContainer`);
  }

  public has<T>(id: ServiceIdentifier<T>): boolean {
    const key = this.getKey(id);
    return this.services.has(key) || this.factories.has(key);
  }

  public clear(): void {
    this.services.clear();
    this.factories.clear();
  }
}

export const container = ServiceContainer.getInstance();
