import { gitManager } from '../git/GitManager';

export class DocGenerator {
  public generateChangelog(version = 'v1.0.0'): string {
    const history = gitManager.getCommitHistory();
    const dateStr = new Date().toISOString().split('T')[0];

    let markdown = `# Release Notes (${version}) - ${dateStr}\n\n`;
    markdown += `## 🚀 What's Changed in ${version}\n\n`;

    if (history.length === 0) {
      markdown += `- Initial release of VisualStack Studio project.\n`;
    } else {
      history.forEach((c) => {
        markdown += `- **[${c.shortHash}]** ${c.message} (${c.author})\n`;
      });
    }

    markdown += `\n---\n*Generated automatically by VisualStack Studio Release & Documentation Engine.*`;
    return markdown;
  }

  public generateGitHubWorkflowYaml(): string {
    return `name: VisualStack Studio Continuous Deployment

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter & Tests
        run: npm run test --if-present

      - name: Build Production Bundle
        run: npm run build

      - name: Deploy to Cloud Infrastructure
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
        run: npx vercel --prod --token \${{ secrets.VERCEL_TOKEN }}`;
  }

  public generateGitLabCiYaml(): string {
    return `stages:
  - lint
  - build
  - deploy

lint_job:
  stage: lint
  image: node:20-alpine
  script:
    - npm ci
    - npm run lint

build_job:
  stage: build
  image: node:20-alpine
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy_job:
  stage: deploy
  image: alpine:latest
  script:
    - echo "Deploying VisualStack Studio to Production..."
  only:
    - main`;
  }
}

export const docGenerator = new DocGenerator();
