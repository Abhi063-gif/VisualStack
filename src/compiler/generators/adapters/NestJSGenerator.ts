import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class NestJSGenerator implements FrameworkAdapter {
  public id = 'adapter_nestjs';
  public name = 'NestJS Enterprise Server';
  public targetFramework = 'nestjs';

  public supportsLanguage(lang: string): boolean {
    return lang === 'typescript';
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
            build: 'nest build',
            start: 'nest start',
            'start:dev': 'nest start --watch',
          },
          dependencies: {
            '@nestjs/common': '^10.0.0',
            '@nestjs/core': '^10.0.0',
            '@nestjs/platform-express': '^10.0.0',
            'reflect-metadata': '^0.2.0',
            rxjs: '^7.8.0',
          },
          devDependencies: {
            '@nestjs/cli': '^10.0.0',
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
      content: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('[NestJS] Server listening at http://localhost:3000');
}
bootstrap();`,
    });

    files.push({
      path: 'src/app.module.ts',
      type: 'typescript',
      content: `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}`,
    });

    return files;
  }
}
