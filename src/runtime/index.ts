export interface IRuntimeHost {
  start(): Promise<void>;
  stop(): Promise<void>;
}
