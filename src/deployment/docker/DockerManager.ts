export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  status: 'running' | 'stopped' | 'exited';
  ports: string;
}

export class DockerManager {
  private containers: ContainerInfo[] = [
    {
      id: 'cnt_app_01',
      name: 'visualstack-web-prod',
      image: 'visualstack/app:v1.0.0',
      status: 'running',
      ports: '8080:80',
    },
  ];

  public generateDockerfile(_framework: string): string {
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
  }

  public generateCompose(): string {
    return `version: '3.8'
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: always
  db:
    image: sqlite
    volumes:
      - ./data:/data`;
  }

  public getContainers(): ContainerInfo[] {
    return [...this.containers];
  }

  public async buildImage(_imageName: string): Promise<boolean> {
    return true;
  }

  public async pushImage(_imageName: string, _registryUrl: string): Promise<boolean> {
    return true;
  }
}

export const dockerManager = new DockerManager();
