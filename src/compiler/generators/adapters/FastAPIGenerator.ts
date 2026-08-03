import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class FastAPIGenerator implements FrameworkAdapter {
  public id = 'adapter_fastapi';
  public name = 'Python FastAPI + Uvicorn Server';
  public targetFramework = 'fastapi';

  public supportsLanguage(lang: string): boolean {
    return lang === 'python';
  }

  public generateProject(context: GeneratorContext): GeneratedFile[] {
    const ir = context.ir;
    const files: GeneratedFile[] = [];

    files.push({
      path: 'requirements.txt',
      type: 'markdown',
      content: `fastapi>=0.115.0
uvicorn[standard]>=0.32.0
pydantic>=2.10.0
sqlalchemy>=2.0.0`,
    });

    files.push({
      path: 'main.py',
      type: 'python',
      content: `from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="${ir.metadata.name}", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "app": "${ir.metadata.name}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)`,
    });

    return files;
  }
}
