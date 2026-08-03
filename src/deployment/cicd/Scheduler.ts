export interface CronJobConfig {
  id: string;
  name: string;
  expression: string;
  targetProvider: string;
  active: boolean;
}

export class Scheduler {
  private jobs: CronJobConfig[] = [
    { id: 'cron_nightly', name: 'Nightly Staging Build', expression: '0 0 * * *', targetProvider: 'Vercel', active: true },
    { id: 'cron_weekly', name: 'Weekly Production Release', expression: '0 2 * * 1', targetProvider: 'AWS EC2', active: false },
  ];

  public getJobs(): CronJobConfig[] {
    return [...this.jobs];
  }
}

export const scheduler = new Scheduler();
