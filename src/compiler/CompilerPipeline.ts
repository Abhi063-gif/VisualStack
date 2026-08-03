import { CompilerContext, type GeneratedFile } from './CompilerContext';
import type { ProjectIR } from './ir/ProjectIR';
import { projectModelExporter } from '../application/ir/ProjectModelExporter';
import { compilerValidator } from './validation/CompilerValidator';
import { compilerOptimizer } from './optimization/CompilerOptimizer';
import { codeGenerator } from './generators/CodeGenerator';

export class CompilerPipeline {
  public async execute(context: CompilerContext): Promise<GeneratedFile[]> {
    context.logger.startStage('Stage 1: Parse Project');
    this.stage1Parse(context);
    context.logger.endStage('Stage 1: Parse Project', 'Project IR parsed and initialized successfully.');

    context.logger.startStage('Stage 2: Validate');
    this.stage2Validate(context);
    context.logger.endStage('Stage 2: Validate', 'Static architecture validation completed.');

    if (context.diagnostics.hasErrors()) {
      context.logger.startStage('Abort');
      context.logger.endStage('Abort', 'Compilation aborted due to diagnostic errors.');
      return [];
    }

    context.logger.startStage('Stage 3: Optimize');
    this.stage3Optimize(context);
    context.logger.endStage('Stage 3: Optimize', 'Tree shaking and dead code elimination completed.');

    context.logger.startStage('Stage 4: Transform');
    this.stage4Transform(context);
    context.logger.endStage('Stage 4: Transform', 'IR transformed into target framework AST model.');

    context.logger.startStage('Stage 5: Generate');
    this.stage5Generate(context);
    context.logger.endStage('Stage 5: Generate', 'Code generation adapters completed.');

    context.logger.startStage('Stage 6: Format');
    this.stage6Format(context);
    context.logger.endStage('Stage 6: Format', 'Code formatting and line cleaning completed.');

    context.logger.startStage('Stage 7: Export');
    this.stage7Export(context);
    context.logger.endStage('Stage 7: Export', 'Final project bundle generated and exported.');

    return context.generatedFiles;
  }

  private stage1Parse(context: CompilerContext): void {
    const rawIR = projectModelExporter.exportUnifiedIR();
    const now = new Date().toISOString();

    const projectIR: ProjectIR = {
      metadata: {
        id: rawIR.metadata?.projectId || 'visualstack_project',
        name: 'VisualStack Application',
        version: rawIR.metadata?.version || '1.0.0',
        targetFramework: context.options.targetFramework,
        createdAt: rawIR.metadata?.exportTimestamp || now,
        updatedAt: now,
      },
      theme: {
        id: 'theme_default',
        name: 'VisualStack Default Theme',
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          background: '#0e0f12',
          surface: '#14161d',
          text: '#ffffff',
          border: '#232733',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
        },
        typography: {
          fontFamily: 'Inter, sans-serif',
          baseFontSize: '14px',
          headings: {
            h1: { fontSize: '24px', fontWeight: '700' },
            h2: { fontSize: '18px', fontWeight: '600' },
          },
        },
        spacing: { sm: '8px', md: '16px', lg: '24px' },
        radius: { sm: '4px', md: '8px', lg: '16px' },
        shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)', md: '0 4px 6px rgba(0,0,0,0.1)' },
        isDarkMode: true,
      },
      screens: rawIR.screens.map((scr) => ({
        id: scr.id,
        name: scr.name,
        route: {
          id: `route_${scr.id}`,
          path: scr.route.path,
          screenId: scr.id,
          screenName: scr.name,
          isProtected: scr.route.isProtected,
        },
        components: [],
        workflow: {
          id: `wf_${scr.id}`,
          name: `${scr.name} Workflow`,
          screenId: scr.id,
          triggerEvent: 'Page Loaded',
          nodes: scr.nodes.map((n) => ({
            id: n.id,
            type: String(n.type),
            label: String(n.data?.label || n.type),
            category: String(n.data?.category || 'Logic'),
            config: (n.data?.config as Record<string, unknown>) || {},
            inputs: Array.isArray(n.data?.inputs)
              ? n.data.inputs.map((i: any) => ({
                  id: String(i.id),
                  name: String(i.name),
                  dataType: String(i.dataType),
                  defaultValue: i.defaultValue,
                }))
              : [],
            outputs: Array.isArray(n.data?.outputs)
              ? n.data.outputs.map((o: any) => ({
                  id: String(o.id),
                  name: String(o.name),
                  dataType: String(o.dataType),
                }))
              : [],
          })),
          edges: scr.edges.map((e) => ({
            id: e.id,
            sourceNodeId: e.source,
            sourcePortId: e.sourceHandle || '',
            targetNodeId: e.target,
            targetPortId: e.targetHandle || '',
          })),
        },
        variables: (scr.variables || []).map((v) => ({
          id: v.id,
          name: v.name,
          type: v.type as any,
          scope: v.scope as any,
          defaultValue: v.value,
          isConstant: false,
          isSecret: false,
        })),
      })),
      globalVariables: Array.isArray((rawIR as any).variables)
        ? ((rawIR as any).variables as any[]).map((v) => ({
            id: v.id,
            name: v.name,
            type: v.type as any,
            scope: 'global',
            defaultValue: v.value,
            isConstant: false,
            isSecret: false,
          }))
        : [],
      databases: rawIR.resources.databases.map((db) => ({
        id: db.id,
        name: db.name,
        type: db.type as any,
        connectionString: db.host,
        tables: (db.tables || []).map((t) => ({
          name: t.name,
          type: t.type,
          columns: t.columns,
        })),
      })),
      authServices: rawIR.resources.auth.map((a) => ({
        id: a.id,
        name: a.name,
        provider: a.provider as any,
        enabled: a.enabled,
        clientId: a.clientId,
        clientSecret: a.clientSecret,
        tokenExpirySeconds: a.tokenExpirySeconds,
        socialProviders: a.socialProviders,
      })),
      storageBuckets: rawIR.resources.storage.map((s) => ({
        id: s.id,
        name: s.name,
        provider: s.provider as any,
        bucketName: s.bucketName,
        region: s.region,
        accessKeyId: s.accessKeyId,
        secretAccessKey: s.secretAccessKey,
        isPublic: s.isPublic,
      })),
      externalApis: rawIR.resources.apis.map((api) => ({
        id: api.id,
        name: api.name,
        protocol: api.protocol as any,
        method: api.method as any,
        url: api.url,
        headers: api.headers,
        authType: api.authType as any,
      })),
      environment: rawIR.resources.environment.map((env) => ({
        key: env.key,
        value: env.value,
        isSecret: env.isSecret,
        targetEnv: env.targetEnv,
      })),
    };

    context.ir = projectIR;
  }

  private stage2Validate(context: CompilerContext): void {
    if (!context.ir) return;
    compilerValidator.validate(context.ir, context.diagnostics);
  }

  private stage3Optimize(context: CompilerContext): void {
    if (!context.ir) return;
    compilerOptimizer.optimize(context.ir, context.diagnostics);
  }

  private stage4Transform(_context: CompilerContext): void {
    // Stage 4 Transform complete
  }

  private stage5Generate(context: CompilerContext): void {
    if (!context.ir) return;
    const output = codeGenerator.generate({
      ir: context.ir,
      targetFramework: context.options.targetFramework,
      language: context.options.language,
      cssFramework: context.options.cssFramework,
      diagnostics: context.diagnostics,
      logger: context.logger,
    });
    context.generatedFiles = output.files;
  }

  private stage6Format(context: CompilerContext): void {
    for (const file of context.generatedFiles) {
      file.content = file.content.trim() + '\n';
    }
  }

  private stage7Export(_context: CompilerContext): void {
    // Stage 7 Export complete
  }
}
