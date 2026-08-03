export interface CronJobConfig {
  id: string;
  name: string;
  expression: string;
  targetProvider: string;
  active: boolean;
}

export class Scheduler {
  private jobs: CronJobConfig[] = [];

  public getJobs(): CronJobConfig[] {
    return [...this.jobs];
  }

  public addJob(job: Omit<CronJobConfig, 'id'>): CronJobConfig {
    const item: CronJobConfig = {
      id: `cron_${Date.now()}`,
      ...job,
    };
    this.jobs.push(item);
    return item;
  }
}

export const scheduler = new Scheduler();
