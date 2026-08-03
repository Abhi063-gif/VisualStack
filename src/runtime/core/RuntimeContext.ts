import type { RuntimeSession } from './RuntimeSession';
import type { RuntimeConfiguration } from './RuntimeConfiguration';

export class RuntimeContext {
  public session: RuntimeSession;
  public config: RuntimeConfiguration;

  constructor(session: RuntimeSession, config: RuntimeConfiguration) {
    this.session = session;
    this.config = config;
  }
}
