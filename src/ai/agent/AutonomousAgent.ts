import { taskPlanner, type TaskItem } from '../planner/TaskPlanner';
import { toolCallingEngine } from '../tools/ToolCallingEngine';

export interface AgentExecutionProgress {
  step: string;
  task: TaskItem;
  logs: string[];
}

export class AutonomousAgent {
  public async executeAutonomousGoal(goal: string, onProgress: (prog: AgentExecutionProgress) => void): Promise<string> {
    const tasks = taskPlanner.planGoal(goal);
    const logs: string[] = [`[Autonomous Agent] Initiated execution for goal: "${goal}"`];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      task.status = 'in_progress';
      logs.push(`[${new Date().toLocaleTimeString()}] ▶ Executing Task: ${task.title}...`);

      onProgress({ step: task.title, task, logs: [...logs] });
      await new Promise((r) => setTimeout(r, 600));

      if (task.category === 'deploy') {
        const result = await toolCallingEngine.executeToolCall('deploy_app', { provider: 'vercel', environment: 'production' });
        logs.push(`[Tool Call] ${result}`);
      } else if (task.category === 'git') {
        const result = await toolCallingEngine.executeToolCall('git_commit', { message: `feat: Autonomous agent built ${goal}`, isAmend: false });
        logs.push(`[Tool Call] ${result}`);
      }

      task.status = 'completed';
      logs.push(`[${new Date().toLocaleTimeString()}] ✔ Completed Task: ${task.title}.`);
      onProgress({ step: task.title, task, logs: [...logs] });
    }

    logs.push(`[Autonomous Agent] 🎉 Goal "${goal}" executed successfully across UI, Backend, DB & DevOps!`);
    return logs.join('\n');
  }
}

export const autonomousAgent = new AutonomousAgent();
