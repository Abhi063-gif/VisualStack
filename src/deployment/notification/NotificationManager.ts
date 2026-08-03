export type NotificationChannel = 'slack' | 'discord' | 'pagerduty' | 'webhook' | 'email';

export interface NotificationRule {
  id: string;
  channel: NotificationChannel;
  targetUrl: string;
  events: Array<'deployment.success' | 'deployment.failed' | 'rollback.triggered' | 'healthcheck.down'>;
  active: boolean;
}

export interface NotificationLog {
  id: string;
  channel: NotificationChannel;
  event: string;
  message: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export class NotificationManager {
  private rules: NotificationRule[] = [];
  private logs: NotificationLog[] = [];

  public getRules(): NotificationRule[] {
    return [...this.rules];
  }

  public getLogs(): NotificationLog[] {
    return [...this.logs];
  }

  public addRule(channel: NotificationChannel, targetUrl: string, events: NotificationRule['events']): NotificationRule {
    const item: NotificationRule = {
      id: `rule_${Date.now().toString(36)}`,
      channel,
      targetUrl,
      events,
      active: true,
    };
    this.rules.push(item);
    return item;
  }

  public async dispatchNotification(event: NotificationRule['events'][number], message: string): Promise<number> {
    const matching = this.rules.filter((r) => r.active && r.events.includes(event));
    let sentCount = 0;

    for (const rule of matching) {
      const log: NotificationLog = {
        id: `log_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        channel: rule.channel,
        event,
        message,
        sentAt: new Date().toISOString(),
        status: 'sent',
      };
      this.logs.unshift(log);
      sentCount++;
    }

    return sentCount;
  }
}

export const notificationManager = new NotificationManager();
