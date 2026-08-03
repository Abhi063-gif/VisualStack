export interface PackageInfo {
  name: string;
  version: string;
  description: string;
  isDevDependency?: boolean;
}

export class PackageManagerService {
  private installedPackages: PackageInfo[] = [
    { name: 'express', version: '^4.19.2', description: 'Fast, unopinionated, minimalist web framework for Node.js' },
    { name: 'cors', version: '^2.8.5', description: 'Node.js CORS middleware' },
    { name: 'react', version: '^19.0.0', description: 'React is a JavaScript library for building user interfaces' },
    { name: 'react-dom', version: '^19.0.0', description: 'React package for working with the DOM' },
    { name: 'zod', version: '^3.23.8', description: 'TypeScript-first schema validation' },
  ];

  public getInstalledPackages(): PackageInfo[] {
    return [...this.installedPackages];
  }

  public installPackage(pkgName: string, version: string = 'latest'): void {
    if (!this.installedPackages.some((p) => p.name === pkgName)) {
      this.installedPackages.push({
        name: pkgName,
        version: version.startsWith('^') ? version : `^${version}`,
        description: `Installed npm package ${pkgName}`,
      });
    }
  }

  public uninstallPackage(pkgName: string): void {
    this.installedPackages = this.installedPackages.filter((p) => p.name !== pkgName);
  }
}

export const packageManagerService = new PackageManagerService();
