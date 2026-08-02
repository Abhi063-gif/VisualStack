import { screenManager } from '../screens/ScreenManager';
import { databaseManager } from '../resources/DatabaseManager';

export interface ValidationIssue {
  id: string;
  type: 'error' | 'warning';
  category: 'screen' | 'database' | 'auth' | 'node' | 'env';
  message: string;
  targetId?: string;
}

export class ArchitectureValidator {
  public validateFullProject(): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    // 1. Check Screens
    const screens = screenManager.getAllScreens();
    for (const scr of screens) {
      if (scr.nodes.length === 0) {
        issues.push({
          id: `val_scr_empty_${scr.id}`,
          type: 'warning',
          category: 'screen',
          message: `Screen "${scr.name}" (${scr.route.path}) has an unpopulated backend logic graph.`,
          targetId: scr.id,
        });
      }
    }

    // 2. Check Database Connections
    const dbs = databaseManager.getAllConnections();
    if (dbs.length === 0) {
      issues.push({
        id: 'val_db_missing',
        type: 'warning',
        category: 'database',
        message: 'No database connection configured for the project.',
      });
    }

    return issues;
  }
}

export const architectureValidator = new ArchitectureValidator();
