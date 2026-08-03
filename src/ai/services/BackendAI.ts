import { GraphManager } from '../../features/logic/graph/GraphManager';
import { useLogicStore } from '../../stores/LogicStore';

export class BackendAI {
  public generateAuthWorkflowNodes(): string {
    const graphMgr = GraphManager.getInstance();

    // 1. Create HTTP Trigger Node
    const n1 = graphMgr.createNode(
      `node_http_${Date.now()}`,
      'http_trigger',
      'Events',
      'POST /api/auth/login',
      'Receives HTTP login requests with email & password body',
      [],
      [{ id: 'out_req', name: 'Request Body', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 100, y: 180 },
      { route: '/api/auth/login', method: 'POST' },
      'globe',
      '#6366f1'
    );

    // 2. Create Input Validation Node
    const n2 = graphMgr.createNode(
      `node_val_${Date.now()}`,
      'validation',
      'Logic',
      'Validate Body Schema',
      'Validates email format and password strength',
      [{ id: 'in_data', name: 'Input Data', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_valid', name: 'Valid Data', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 380, y: 180 },
      { rules: ['email_format', 'min_password_len_8'] },
      'shield-check',
      '#06b6d4'
    );

    // 3. Create Database Query Node
    const n3 = graphMgr.createNode(
      `node_db_${Date.now()}`,
      'db_query',
      'Database',
      'Find User in PostgreSQL',
      'Queries users table by email address',
      [{ id: 'in_query', name: 'Query Params', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_user', name: 'User Document', type: 'data', dataType: 'object', direction: 'output' }],
      { x: 660, y: 180 },
      { sql: 'SELECT * FROM users WHERE email = $1 LIMIT 1' },
      'database',
      '#3b82f6'
    );

    // 4. Create JWT Token Signer Node
    const n4 = graphMgr.createNode(
      `node_jwt_${Date.now()}`,
      'jwt_sign',
      'Auth',
      'Sign JWT Session Token',
      'Signs JWT token with user ID and 7-day expiration',
      [{ id: 'in_user', name: 'User Payload', type: 'data', dataType: 'object', direction: 'input' }],
      [{ id: 'out_token', name: 'JWT Token', type: 'data', dataType: 'string', direction: 'output' }],
      { x: 940, y: 180 },
      { expiresIn: '7d', algorithm: 'HS256' },
      'key',
      '#10b981'
    );

    // 5. Create HTTP Response Node
    const n5 = graphMgr.createNode(
      `node_res_${Date.now()}`,
      'http_response',
      'API',
      'Return 200 OK Token Response',
      'Sends 200 OK JSON response containing session token',
      [{ id: 'in_res', name: 'Response Body', type: 'data', dataType: 'object', direction: 'input' }],
      [],
      { x: 1220, y: 180 },
      { statusCode: 200 },
      'send',
      '#f59e0b'
    );

    // Connect edges between nodes
    graphMgr.createEdge(`edge_1_${Date.now()}`, n1.id, 'out_req', n2.id, 'in_data', 'data');
    graphMgr.createEdge(`edge_2_${Date.now()}`, n2.id, 'out_valid', n3.id, 'in_query', 'data');
    graphMgr.createEdge(`edge_3_${Date.now()}`, n3.id, 'out_user', n4.id, 'in_user', 'data');
    graphMgr.createEdge(`edge_4_${Date.now()}`, n4.id, 'out_token', n5.id, 'in_res', 'data');

    // Sync Zustand Logic Store
    useLogicStore.getState().syncFromGraph();

    return '[AI Backend Engine] Created 5 React Flow logic nodes & 4 connected workflow edges for Auth API.';
  }
}

export class DatabaseAI {
  public generateSchema(dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'SQLite'): string {
    if (dbType === 'MongoDB') {
      return `// MongoDB Mongoose User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
});`;
    }
    return `-- SQL Database Schema (${dbType})
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;
  }
}

export class AuthAI {
  public generateAuthProviderConfig(provider: 'jwt' | 'google' | 'github' | 'magic_link') {
    return {
      provider,
      endpoint: `/api/auth/${provider}`,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
  }
}

export interface FileEditChunk {
  filePath: string;
  originalContent: string;
  newContent: string;
}

export class MultiFileEditor {
  private pendingEdits: FileEditChunk[] = [];

  public stageMultiFileEdits(edits: FileEditChunk[]): void {
    this.pendingEdits = edits;
  }

  public getPendingEdits(): FileEditChunk[] {
    return [...this.pendingEdits];
  }

  public applyEdits(): number {
    const count = this.pendingEdits.length;
    this.pendingEdits = [];
    return count;
  }
}

export const backendAI = new BackendAI();
export const databaseAI = new DatabaseAI();
export const authAI = new AuthAI();
export const multiFileEditor = new MultiFileEditor();
