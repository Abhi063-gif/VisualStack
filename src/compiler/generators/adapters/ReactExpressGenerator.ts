import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class ReactExpressGenerator implements FrameworkAdapter {
  public id = 'adapter_react_express';
  public name = 'React 19 + Express Node.js Server';
  public targetFramework = 'react-express';

  public supportsLanguage(lang: string): boolean {
    return lang === 'typescript' || lang === 'javascript';
  }

  public generateProject(context: GeneratorContext): GeneratedFile[] {
    const ir = context.ir;
    const files: GeneratedFile[] = [];

    // package.json
    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(
        {
          name: ir.metadata.name.toLowerCase().replace(/\s+/g, '-'),
          version: ir.metadata.version,
          private: true,
          type: 'module',
          scripts: {
            dev: 'concurrently "npm run server" "vite"',
            build: 'vite build',
            server: 'tsx server/index.ts',
          },
          dependencies: {
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'react-router-dom': '^7.0.0',
            express: '^4.21.0',
            cors: '^2.8.5',
            dotenv: '^16.4.5',
            jsonwebtoken: '^9.0.2',
            'lucide-react': '^0.470.0',
            axios: '^1.7.0',
          },
          devDependencies: {
            vite: '^6.0.0',
            typescript: '^5.7.0',
            concurrently: '^9.1.0',
            tsx: '^4.19.0',
            tailwindcss: '^3.4.0',
          },
        },
        null,
        2
      ),
    });

    // index.html
    files.push({
      path: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${ir.metadata.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-950 text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    });

    // src/main.tsx
    const importsStr = ir.screens
      .map((s, idx) => `import Screen${idx} from './pages/${s.name.replace(/\s+/g, '')}';`)
      .join('\n');
    const routesStr = ir.screens
      .map((s, idx) => `<Route path="${s.route.path}" element={<Screen${idx} />} />`)
      .join('\n        ');

    files.push({
      path: 'src/main.tsx',
      type: 'typescript',
      content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
${importsStr}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        ${routesStr}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);`,
    });

    // Frontend Pages
    for (const scr of ir.screens) {
      const pageName = scr.name.replace(/\s+/g, '');
      files.push({
        path: `src/pages/${pageName}.tsx`,
        type: 'typescript',
        content: `import React from 'react';

export default function ${pageName}() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">${scr.name}</h1>
        <p className="text-gray-400 text-sm">Route Path: <code className="text-indigo-400 bg-gray-950 px-2 py-1 rounded font-mono">${scr.route.path}</code></p>
      </div>
    </div>
  );
}`,
      });
    }

    // Express Server
    const serverRoutes = ir.screens
      .map((s) => {
        const path = s.route.path === '/' ? '/main' : s.route.path;
        return `app.post('/api/v1${path}', (req, res) => {\n  res.json({ success: true, screen: "${s.name}", timestamp: new Date().toISOString() });\n});`;
      })
      .join('\n\n');

    files.push({
      path: 'server/index.ts',
      type: 'typescript',
      content: `import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

${serverRoutes}

app.listen(PORT, () => console.log(\`[VisualStack Server] Server running at http://localhost:\${PORT}\`));`,
    });

    // Database Prisma Schema (if DB configured)
    if (ir.databases.length > 0) {
      const db = ir.databases[0];
      const provider = db.type === 'PostgreSQL' ? 'postgresql' : db.type === 'MySQL' ? 'mysql' : 'sqlite';
      files.push({
        path: 'prisma/schema.prisma',
        type: 'markdown',
        content: `datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
}`,
      });
    }

    // .env
    const envContent = ir.environment.map((e) => `${e.key}=${e.value}`).join('\n');
    files.push({
      path: '.env',
      type: 'markdown',
      content: envContent || 'PORT=3000\nVITE_API_URL=http://localhost:3000/api',
    });

    return files;
  }
}
