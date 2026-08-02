export type DatabaseType =
  | 'SQLite'
  | 'MySQL'
  | 'PostgreSQL'
  | 'MongoDB'
  | 'Firebase Firestore'
  | 'Supabase'
  | 'PlanetScale'
  | 'Neon'
  | 'SQL Server'
  | 'Oracle'
  | 'MariaDB';

export interface DatabaseConnectionConfig {
  id: string;
  name: string;
  type: DatabaseType;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  ssl: boolean;
  autoReconnect: boolean;
  status: 'connected' | 'disconnected' | 'testing';
  tables: DatabaseTableSchema[];
}

export interface DatabaseTableSchema {
  name: string;
  type: 'table' | 'collection' | 'view';
  columns: { name: string; type: string; isPrimaryKey: boolean; isNullable: boolean }[];
  foreignKeys: { column: string; targetTable: string; targetColumn: string }[];
}

export class DatabaseManager {
  private connections: Map<string, DatabaseConnectionConfig> = new Map();

  constructor() {
    this.registerDefaultConnections();
  }

  private registerDefaultConnections(): void {
    const demoDb: DatabaseConnectionConfig = {
      id: 'db_demo_postgres',
      name: 'Primary PostgreSQL DB',
      type: 'PostgreSQL',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      database: 'visualstack_db',
      ssl: true,
      autoReconnect: true,
      status: 'connected',
      tables: [
        {
          name: 'users',
          type: 'table',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'email', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
            { name: 'password_hash', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
            { name: 'role', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
            { name: 'created_at', type: 'timestamp', isPrimaryKey: false, isNullable: false },
          ],
          foreignKeys: [],
        },
        {
          name: 'orders',
          type: 'table',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'user_id', type: 'uuid', isPrimaryKey: false, isNullable: false },
            { name: 'total_amount', type: 'decimal(10,2)', isPrimaryKey: false, isNullable: false },
            { name: 'status', type: 'varchar(50)', isPrimaryKey: false, isNullable: false },
          ],
          foreignKeys: [{ column: 'user_id', targetTable: 'users', targetColumn: 'id' }],
        },
        {
          name: 'products',
          type: 'table',
          columns: [
            { name: 'id', type: 'uuid', isPrimaryKey: true, isNullable: false },
            { name: 'title', type: 'varchar(255)', isPrimaryKey: false, isNullable: false },
            { name: 'price', type: 'decimal(10,2)', isPrimaryKey: false, isNullable: false },
          ],
          foreignKeys: [],
        },
      ],
    };

    this.connections.set(demoDb.id, demoDb);
  }

  public getAllConnections(): DatabaseConnectionConfig[] {
    return Array.from(this.connections.values());
  }

  public getConnectionById(id: string): DatabaseConnectionConfig | undefined {
    return this.connections.get(id);
  }

  public saveConnection(config: DatabaseConnectionConfig): void {
    this.connections.set(config.id, config);
  }

  public testConnection(_config?: Partial<DatabaseConnectionConfig>): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  public deleteConnection(id: string): boolean {
    return this.connections.delete(id);
  }
}

export const databaseManager = new DatabaseManager();
