export interface DatabaseIR {
  id: string;
  name: string;
  type: 'SQLite' | 'MySQL' | 'PostgreSQL' | 'MongoDB' | 'Firebase Firestore' | 'Supabase' | 'PlanetScale' | 'Neon' | string;
  connectionString?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  tables: {
    name: string;
    type: 'table' | 'collection' | 'view';
    columns: { name: string; type: string; isPrimaryKey: boolean; isNullable: boolean }[];
  }[];
}
