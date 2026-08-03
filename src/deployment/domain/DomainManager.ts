export interface DNSRecord {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  status: 'verified' | 'pending';
}

export interface CustomDomainConfig {
  id: string;
  domain: string;
  verified: boolean;
  sslActive: boolean;
  targetEnvironment: 'development' | 'testing' | 'staging' | 'production' | 'preview';
  dnsRecords: DNSRecord[];
  addedAt: string;
}

export class DomainManager {
  private domains: CustomDomainConfig[] = [];

  public getDomains(environment?: CustomDomainConfig['targetEnvironment']): CustomDomainConfig[] {
    if (!environment) return [...this.domains];
    return this.domains.filter((d) => d.targetEnvironment === environment);
  }

  public addDomain(domain: string, environment: CustomDomainConfig['targetEnvironment'] = 'production'): CustomDomainConfig {
    const sub = domain.split('.')[0];
    const item: CustomDomainConfig = {
      id: `dom_${Date.now().toString(36)}`,
      domain,
      verified: false,
      sslActive: false,
      targetEnvironment: environment,
      dnsRecords: [
        { type: 'CNAME', name: sub, value: 'cname.visualstack-dns.com', status: 'pending' },
        { type: 'TXT', name: `_visualstack.${sub}`, value: `vs-verify=${Math.random().toString(36).slice(2, 10)}`, status: 'pending' },
      ],
      addedAt: new Date().toISOString(),
    };
    this.domains.push(item);
    return item;
  }

  public verifyDomain(id: string): boolean {
    const d = this.domains.find((dom) => dom.id === id);
    if (d) {
      d.verified = true;
      d.sslActive = true;
      d.dnsRecords.forEach((r) => (r.status = 'verified'));
      return true;
    }
    return false;
  }

  public removeDomain(id: string): void {
    this.domains = this.domains.filter((d) => d.id !== id);
  }
}

export const domainManager = new DomainManager();
