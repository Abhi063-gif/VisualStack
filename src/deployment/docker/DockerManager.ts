import type { SupportedFramework } from '../build/BuildEngine';

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited';
  ports: string;
  created: string;
}

export class DockerManager {
  private containers: ContainerInfo[] = [];

  public generateDockerfile(framework: SupportedFramework): string {
    switch (framework) {
      case 'Next.js':
      case 'React':
      case 'Vue':
      case 'Angular':
        return `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;

      case 'Express':
      case 'NestJS':
      case 'Node':
        return `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "dist/index.js"]`;

      case 'Python':
        return `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]`;

      case 'Spring Boot':
        return `FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`;

      default:
        return `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 8080
CMD ["npm", "start"]`;
    }
  }

  public generateCompose(serviceName = 'app', port = '8080'): string {
    return `version: '3.8'
services:
  ${serviceName}:
    build: .
    ports:
      - "${port}:8080"
    environment:
      - NODE_ENV=production
    restart: always`;
  }

  public getContainers(): ContainerInfo[] {
    return [...this.containers];
  }

  public async buildAndRunContainer(name: string, image: string, ports: string): Promise<ContainerInfo> {
    const container: ContainerInfo = {
      id: `cnt_${Date.now().toString(36)}`,
      name,
      image,
      status: 'running',
      ports,
      created: new Date().toISOString(),
    };
    this.containers.unshift(container);
    return container;
  }

  public async stopContainer(id: string): Promise<boolean> {
    const c = this.containers.find((cnt) => cnt.id === id);
    if (c) {
      c.status = 'stopped';
      return true;
    }
    return false;
  }

  public async deleteContainer(id: string): Promise<boolean> {
    this.containers = this.containers.filter((c) => c.id !== id);
    return true;
  }

  public getContainerLogs(id: string): string[] {
    const c = this.containers.find((cnt) => cnt.id === id);
    if (!c) return [];
    return [
      `[Docker] Starting container ${c.name} (${c.id})...`,
      `[Docker] Binding port ${c.ports}...`,
      `[Docker] Health check passed. Status: ${c.status}.`,
    ];
  }
}

export const dockerManager = new DockerManager();
