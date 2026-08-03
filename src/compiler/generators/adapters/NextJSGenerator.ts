import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class NextJSGenerator implements FrameworkAdapter {
  public id = 'adapter_nextjs';
  public name = 'Next.js 15 (App Router)';
  public targetFramework = 'nextjs';

  public supportsLanguage(lang: string): boolean {
    return lang === 'typescript' || lang === 'javascript';
  }

  public generateProject(context: GeneratorContext): GeneratedFile[] {
    const ir = context.ir;
    const files: GeneratedFile[] = [];

    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(
        {
          name: ir.metadata.name.toLowerCase().replace(/\s+/g, '-'),
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
}
