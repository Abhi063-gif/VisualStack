export interface FileTreeNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  extension?: string;
  children?: FileTreeNode[];
  content?: string;
}

export class FileTreeService {
  private tree: FileTreeNode[] = [
    {
      id: 'src',
      name: 'src',
      path: '/src',
      type: 'directory',
      children: [
        {
          id: 'src/index.ts',
          name: 'index.ts',
          path: '/src/index.ts',
          type: 'file',
          extension: 'ts',
          content: `import express from 'express';\nimport cors from 'cors';\nimport routes from './routes';\n\nconst app = express();\napp.use(cors());\napp.use(express.json());\napp.use('/api', routes);\n\nconst PORT = process.env.PORT || 3000;\napp.listen(PORT, () => {\n  console.log(\`Server running on http://localhost:\${PORT}\`);\n});`,
        },
        {
          id: 'src/routes',
          name: 'routes',
          path: '/src/routes',
          type: 'directory',
          children: [
            {
              id: 'src/routes/api.ts',
              name: 'api.ts',
              path: '/src/routes/api.ts',
              type: 'file',
              extension: 'ts',
              content: `import { Router } from 'express';\nconst router = Router();\n\nrouter.get('/health', (req, res) => {\n  res.json({ status: 'ok', timestamp: new Date() });\n});\n\nexport default router;`,
            },
          ],
        },
        {
          id: 'src/components',
          name: 'components',
          path: '/src/components',
          type: 'directory',
          children: [
            {
              id: 'src/components/App.tsx',
              name: 'App.tsx',
              path: '/src/components/App.tsx',
              type: 'file',
              extension: 'tsx',
              content: `import React from 'react';\n\nexport const App: React.FC = () => {\n  return (\n    <div className="p-8 text-center bg-gray-900 text-white min-h-screen">\n      <h1 className="text-3xl font-bold text-indigo-400">Welcome to VisualStack Generated App</h1>\n      <p className="mt-2 text-gray-400">Built with React 19 + Express</p>\n    </div>\n  );\n};\nexport default App;`,
            },
          ],
        },
      ],
    },
    {
      id: 'package.json',
      name: 'package.json',
      path: '/package.json',
      type: 'file',
      extension: 'json',
      content: `{\n  "name": "visualstack-demo-app",\n  "version": "1.0.0",\n  "type": "module",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc -b && vite build"\n  },\n  "dependencies": {\n    "express": "^4.19.2",\n    "cors": "^2.8.5",\n    "react": "^19.0.0",\n    "react-dom": "^19.0.0"\n  }\n}`,
    },
    {
      id: '.env',
      name: '.env',
      path: '/.env',
      type: 'file',
      extension: 'env',
      content: `PORT=3000\nNODE_ENV=development\nDATABASE_URL="file:./dev.db"\nJWT_SECRET="super-secret-key-123"`,
    },
  ];

  public getTree(): FileTreeNode[] {
    return this.tree;
  }

  public getFileContent(path: string): string | null {
    const findNode = (nodes: FileTreeNode[]): FileTreeNode | null => {
      for (const node of nodes) {
        if (node.path === path) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    const target = findNode(this.tree);
    return target ? target.content || '' : null;
  }
}

export const fileTreeService = new FileTreeService();
