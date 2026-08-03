import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class VueExpressGenerator implements FrameworkAdapter {
  public id = 'adapter_vue_express';
  public name = 'Vue 3 + Vite + Express';
  public targetFramework = 'vue-express';

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
  <div class="min-h-screen bg-gray-950 text-white flex items-center justify-center">
    <h1 class="text-3xl font-bold">VisualStack Vue 3 Application</h1>
  </div>
</template>`,
    });

    return files;
  }
}
