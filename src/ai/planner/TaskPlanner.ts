export interface TaskItem {
  id: string;
  title: string;
  category: 'plan' | 'ui' | 'backend' | 'database' | 'auth' | 'compile' | 'git' | 'deploy';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  subtasks: string[];
}

export class TaskPlanner {
  public planGoal(goal: string): TaskItem[] {
    const cleanGoal = goal.trim();
    return [
      { id: 't1', title: `Architect System Blueprint for ${cleanGoal}`, category: 'plan', status: 'completed', subtasks: ['Identify components & state model', 'Define REST API routes'] },
      { id: 't2', title: 'Generate UI Canvas Layouts', category: 'ui', status: 'completed', subtasks: ['Create Main Viewport frame', 'Style Dark Theme tokens'] },
      { id: 't3', title: 'Build React Flow Backend Logic', category: 'backend', status: 'completed', subtasks: ['Create HTTP Trigger node', 'Add Database Query action'] },
      { id: 't4', title: 'Configure Database & Auth Provider', category: 'database', status: 'completed', subtasks: ['Set up PostgreSQL table schemas', 'Configure JWT Auth provider'] },
      { id: 't5', title: 'Compile & Run Integration Tests', category: 'compile', status: 'completed', subtasks: ['Run TypeScript verification', 'Check zero compile errors'] },
      { id: 't6', title: 'Git Commit & Prepare Deployment', category: 'deploy', status: 'pending', subtasks: ['Stage modified files', 'Prepare Vercel / Docker deployment'] },
    ];
  }
}

export const taskPlanner = new TaskPlanner();
