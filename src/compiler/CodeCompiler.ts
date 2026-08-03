import type { UnifiedProjectIR } from '../application/ir/ProjectModelExporter';

export type FrameworkTarget = 'react-express' | 'nextjs' | 'vue-express';

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'typescript' | 'json' | 'css' | 'html' | 'markdown';
}

export class CodeCompiler {
  public compileProject(ir: UnifiedProjectIR, target: FrameworkTarget = 'react-express'): GeneratedFile[] {
    if (target === 'nextjs') {
      return this.compileNextJS(ir);
    } else if (target === 'vue-express') {
      return this.compileVueExpress(ir);
    }
    return this.compileReactExpress(ir);
  }

  private compileReactExpress(ir: UnifiedProjectIR): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    // 1. package.json
    const pkgObj = {
      name: 'visualstack-generated-app',
      version: '1.0.0',
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
      },
      devDependencies: {
        vite: '^6.0.0',
        typescript: '^5.7.0',
        concurrently: '^9.1.0',
        tsx: '^4.19.0',
      },
    };

    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(pkgObj, null, 2),
    });

    // 2. index.html
    files.push({
      path: 'index.html',
      type: 'html',
      content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VisualStack App</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-950 text-white min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    });

    // 3. React App Router & Main Entry
    const importsStr = ir.screens
      .map(
        (scr, idx) =>
          `import Screen${idx} from './pages/${scr.name.replace(/\s+/g, '')}';`
      )
      .join('\n');

    const routesStr = ir.screens
      .map(
        (scr, idx) =>
          `<Route path="${scr.route.path}" element={<Screen${idx} />} />`
      )
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

    // 4. Page Components for each Screen
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
        <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
          <span className="text-xs font-semibold uppercase text-indigo-400">Linked Backend Workflow</span>
          <p className="text-xs text-gray-400">Contains ${scr.nodes.length} logic nodes and ${scr.variables.length} active screen variables.</p>
        </div>
      </div>
    </div>
  );
}`,
      });
    }

    // 5. Express Node.js Server Entrypoint
    const serverRoutesStr = ir.screens
      .map((scr) => {
        const routePath = scr.route.path === '/' ? '/main' : scr.route.path;
        return `app.post('/api/v1${routePath}', (req, res) => {\n  res.json({ success: true, screen: "${scr.name}", message: "Workflow executed." });\n});`;
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

${serverRoutesStr}

app.listen(PORT, () => {
  console.log(\`[VisualStack Server] Server running at http://localhost:\${PORT}\`);
});`,
    });

    // 6. Dotenv Export
    const envLines = ir.resources.environment.map(
      (env) => `${env.key}=${env.value}`
    );
    files.push({
      path: '.env',
      type: 'markdown',
      content: envLines.join('\n') || 'VITE_API_BASE_URL=http://localhost:3000/api',
    });

    return files;
  }

  private compileNextJS(ir: UnifiedProjectIR): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(
        {
          name: 'visualstack-nextjs-app',
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
          },
          dependencies: {
            next: '^15.0.0',
            react: '^19.0.0',
            'react-dom': '^19.0.0',
            'lucide-react': '^0.470.0',
          },
          devDependencies: {
            typescript: '^5.7.0',
            '@types/node': '^22.0.0',
            '@types/react': '^19.0.0',
            tailwindcss: '^3.4.0',
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: 'app/layout.tsx',
      type: 'typescript',
      content: `import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen">{children}</body>
    </html>
  );
}`,
    });

    for (const scr of ir.screens) {
      const pagePath = scr.route.path === '/' ? 'app/page.tsx' : `app${scr.route.path}/page.tsx`;
      files.push({
        path: pagePath,
        type: 'typescript',
        content: `import React from 'react';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">${scr.name} (Next.js 15)</h1>
        <p className="text-gray-400 text-sm">Route Path: <code className="text-indigo-400 bg-gray-950 px-2 py-1 rounded font-mono">${scr.route.path}</code></p>
      </div>
    </div>
  );
}`,
      });
    }

    return files;
  }

  private compileVueExpress(_ir: UnifiedProjectIR): GeneratedFile[] {
    const files: GeneratedFile[] = [];

    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(
        {
          name: 'visualstack-vue-app',
          version: '1.0.0',
          private: true,
          scripts: {
            dev: 'vite',
            build: 'vite build',
          },
          dependencies: {
            vue: '^3.5.0',
            'vue-router': '^4.4.0',
          },
          devDependencies: {
            '@vitejs/plugin-vue': '^5.1.0',
            vite: '^6.0.0',
            typescript: '^5.7.0',
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: 'src/main.ts',
      type: 'typescript',
      content: `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');`,
    });

    files.push({
      path: 'src/App.vue',
      type: 'html',
      content: `<template>
  <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
    <h1 className="text-3xl font-bold">VisualStack Vue 3 Application</h1>
  </div>
</template>`,
    });

    return files;
  }
}

export const codeCompiler = new CodeCompiler();
