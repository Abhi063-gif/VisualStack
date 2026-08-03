import { logStreamer } from '../logs/LogStreamer';

export class TerminalService {
  public executeCommand(input: string): string[] {
    const cmd = input.trim().toLowerCase();
    logStreamer.pushLog('INFO', `$ ${input}`, 'Terminal');

    if (!cmd) return [];
    if (cmd === 'clear') return [];
    if (cmd === 'help') {
      return [
        'VisualStack Studio DevTools Terminal v1.0.0',
        'Available commands:',
        '  npm run dev       - Starts local development server',
        '  npm test          - Runs test suite',
        '  npx prisma studio - Opens visual database viewer',
        '  git status        - Checks workspace git repository state',
        '  clear             - Clears terminal output',
        '  help              - Lists commands',
      ];
    }
    if (cmd === 'git status') {
      return [
        'On branch main',
        'Your branch is up to date with origin/main.',
        'nothing to commit, working tree clean',
      ];
    }
    if (cmd.startsWith('npm run dev')) {
      return ['[DevServer] Server running at http://localhost:3000 (React 19 + Express)'];
    }
    if (cmd.startsWith('npx prisma studio')) {
      return ['[Prisma] Prisma Studio running at http://localhost:5555'];
    }

    return [`Command executed: ${input}`];
  }
}

export const terminalService = new TerminalService();
